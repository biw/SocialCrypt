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
    var facebook_content = '<div id="fb_added_content">Choose Key: <input id="fb_added_keys"> <button id="encypt_button">Encypt text</button></div>'
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

    chrome.storage.sync.set({'CurrentCy': userCipher});
})

//get the start item
var currentItem = $(".userContent")[0];

//when the page loads
$(document).ready(function () {

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

            //change the start text
            currentItem = $(".userContent")[0];

            facebookadder();

            //run main again
            main();
        }
    }, 2000);
});

function syncGet(keyword) {
    chrome.storage.sync.get(keyword, function(result) {
        //console.log(result);
        return result;
    });
}

//main function
function main() {

    //get the amount of entrees
    var entries = $(".userContent").length;

    //loop through the items
    for (var i = 0; i < entries; i++) {

        //slice up the items
        var dataDom = $(".userContent").slice(i, i + 1);
        var dataText = dataDom.text();

        //check the encryption flag
        var encryt_flag = dataText.slice(0, 4);
        var hash = dataText.slice(4, 37);
        var message = dataText.slice(37);

        //if the flag is valid, change the message
        if (encryt_flag == "<enc") {

            //var out = newDecipher(message, Cipher);

            var rightKey = false;

            rightKey = isKey(Cipher, hash, message);

            var out = "Decipher FAILED.";
            if (rightKey){
                out = newDecipher(message, Cipher);
            }

            //output new text
            dataDom.html(out);
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