/**
 * Created by Ben on 11/8/14.
 */


//set the default vars
var EncEnabled = false;
var Cipher = 0;

//get their chrome values
chrome.storage.sync.get('EncEnabled', function (result) {
    EncEnabled = result.EncEnabled;
});


chrome.storage.sync.get('CurrentCy', function(result) {
    Cipher = result.CurrentCy;
    //console.log( result);
});

function facebookadder() {
    var facebook_content = '<div class="fb_added_content">Choose Key: <input id="fb_added_keys"> <button id="encypt_button">Encypt text</button></div>'
    $("#contentArea").prepend(facebook_content);
}



//when the user clicks to encypt
$(document).delegate("#encypt_button", "click", function(x) {

    //get the value
    var userCipher = $("#encypt_button").prev().val();
    var UserText = $(".mentionsTextarea").val();

    var encryptedText = newCipher(UserText, userCipher);
    var hashText = makeHash(userCipher.concat(encryptedText));
    var newText = "<enc"+hashText+">"+encryptedText;

    $(".mentionsTextarea").val(newText);
    $(".mentionsTextarea").parent().parent().parent().next().val(newText);

    //console.log(userCipher);
    chrome.storage.sync.get('CurrentCy', function(result) {
        result.CurrentCy.push(userCipher);
        //console.log(result.CurrentCy);
        chrome.storage.sync.set({'CurrentCy': result.CurrentCy});
    });
})

//get the start item
var currentItem = $(".userContent")[0];

//when the page loads
$(document).ready(function () {

    //load the facebook
    facebookadder();

    //run main to start
    main();


});

//when someone clicks something
$(document).on("click", function () {

    //wait two seconds
    window.setTimeout(function () {

        //if the items has changed
        if ($(".userContent")[0] != currentItem) {

            //debugging log
            //console.log("change url");
            $(".fb_added_content").remove();;
            facebookadder();

            //run main again
            main();
        }
        //two seconds
    }, 2000);
});


//main function
function main() {

    //get the amount of entrees
    var entries = $(".userContent").length;

    //loop through the items
    for (var i = 0; i < entries; i++) {

        //slice up the items
        var dataDom = $(".userContent").slice(i, i + 1);
        var dataText = dataDom.text();

        var foundItem = false;

        //check the encryption flag
        var encryt_flag = dataText.slice(0, 4);
        var hash = dataText.slice(4, 36);
        //console.log(hash);
        var message = dataText.slice(37);
        //console.log(message);

        //if the flag is valid, change the message
        if (encryt_flag == "<enc") {

            //var out = newDecipher(message, Cipher);

            //set if the key is correct
            var rightKey = false;

            //set the correct Cipher
            var correctCipher = "";

            //get the Cipher length
            var cipherLen = Cipher.length;

            //set the output
            var out = "";
            //console.log(cipherLen);

            //for each of the keys
            for(var j = 0; j < cipherLen; j++) {

                //set the current key
                rightKey = isKey(Cipher[j], hash, message);
                //console.log(Cipher[j]);

                //if the key is correct
                if (rightKey) {

                    //set the correctCiphers for the current one
                    correctCipher = Cipher[j];

                    //console.log("Found it", Cipher[j]);

                    //set the output
                    out = newDecipher(message, correctCipher);

                    //output new text
                    dataDom.html(out);

                    //change the found flag
                    foundItem = true;
                }
            }

            //if we havn't found the right key
            if(!foundItem) {

                //tell the user
                dataDom.text("<Invalid Creditials>");
            }
        }
    }
};

function makeHash(txt){
    return CryptoJS.MD5(txt);
}

function isKey(code, hashText, encryptedText){
    var a = code.concat(encryptedText);
    var tempHash = CryptoJS.MD5(a);

    if (tempHash == hashText){
        return true;
    }
    else return false;
}

function newCipher(plainText, code){

    var keyLen = code.length;

    var cipherValues = new Array(0);

    for (var j = 0; j < keyLen; j++){
        cipherValues[j] = createCipher(code.charAt(j));
    }

    //Cipher the text
    var len = plainText.length;

    var out = "";
    for (var i = 0; i < len; i++) {
        if ((plainText.charCodeAt(i) + cipherValues[i % keyLen]) < 127) {
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cipherValues[i % keyLen]));
        }
        else {
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cipherValues[i % keyLen] - 94));
        }
    }
    return out;
}

function newDecipher(plainText, code){

    var keyLen = code.length;

    var cipherValues = new Array(0);

    for (var j = 0; j < keyLen; j++){
        cipherValues[j] = createCipher(code.charAt(j));
    }

    //Cipher the text
    var len = plainText.length;

    var out = "";
    for (var i = 0; i < len; i++) {
        if ((plainText.charCodeAt(i) - cipherValues[i % keyLen]) > 31) {
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) - cipherValues[i % keyLen]));
        }
        else {
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) - cipherValues[i % keyLen] + 94));
        }
    }
    return out;
}

function createCipher(code) {
    var len = code.length;
    var cipherVal = 0;

    for (var j = 0; j < len; j++){
        cipherVal += code.charCodeAt(j);
    }
    return cipherVal % 94;
}