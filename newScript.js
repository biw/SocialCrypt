/**
 * Created by Ben on 11/8/14.
 */


//set the default vars
var EncEnabled = false;
var Cipher = 0;

//get the value if the extention is enabled from  chrome values
chrome.storage.sync.get('EncEnabled', function (result) {
    EncEnabled = result.EncEnabled;
});


//get the value what the current cypher texts are
chrome.storage.sync.get('CurrentCy', function(result) {
    Cipher = result.CurrentCy;
});


//$(document).delegate("._52lb","DOMSubtreeModified", function() {
$(document).ready( function() {

    var settingsBox = $("._52lb");

    window.setTimeout(function () {

        if($("#enc-area").length == 0) {

            var enc_data = '<button id="encypt_button">Encypt & Post</button>';
            $("._1dsp").after("<div id='enc-area'>" + enc_data + "</div>");

            $("#enc-area").append('<div id="cypherList"></div><div id="cypherButton">Select Encryption Key <div id="downArrow"></div></div>');


            var cipherLen = Cipher.length;

            for(var i = 0; i < cipherLen; i++) {
               $("#cypherList").append('<li>' + Cipher[i] + '</li>');
            }
        }

    }, 500)
});



//when the user clicks to encypt
$(document).delegate("#encypt_button", "click", function(x) {

    //get the value
    var userCipher = $("#encypt_button").prev().val();
    var UserText = $(".mentionsTextarea").val();

    //create the new Cipher and Hash
    var encryptedText = newCipher(UserText, userCipher);
    var hashText = makeHash(userCipher.concat(encryptedText));

    //create the text for the text area
    var newText = "<enc"+hashText+">"+encryptedText;

    //add the values to the website
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
            var fb_value = $("#fb_added_keys").val();
            $(".fb_added_content").remove();;
            $("#fb_added_keys").val(fb_value);

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
            if(Cipher) {
                var cipherLen = Cipher.length;
            }
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

//function to make Hash
function makeHash(txt){

    //use the CryptoMD5 library to md5 the text
    return CryptoJS.MD5(txt);
}

//check if the key is the reverse of the hash
function isKey(code, hashText, encryptedText){
    var a = code.concat(encryptedText);
    var tempHash = CryptoJS.MD5(a);

    //if the hash is the same
    if (tempHash == hashText){
        return true;
    } else {
        return false;
    }
}

//create a new Cipher from a plain text and an encoding code
function newCipher(plainText, code){

    //get the length of the key
    var keyLen = code.length;

    //create a new array
    var cipherValues = new Array(0);

    //for each item, add it to cipherValues
    for (var j = 0; j < keyLen; j++){
        cipherValues[j] = createCipher(code.charAt(j));
    }

    //Cipher the text
    var len = plainText.length;

    //set an empty output
    var out = "";

    //for each item in the plaintext
    for (var i = 0; i < len; i++) {

        //if the key is in the ascii value range
        if ((plainText.charCodeAt(i) + cipherValues[i % keyLen]) < 127) {

            //apply the cipher on it with the key value
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cipherValues[i % keyLen]));

        //if the key is out of range, subtract 94 so that is stays in the ascii range
        } else {

            //apply the ciher to it with the key value
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cipherValues[i % keyLen] - 94));
        }
    }

    //return the new output
    return out;
}

//function the Decipher things
function newDecipher(plainText, code){

    //get the key length
    var keyLen = code.length;

    //create the new array
    var cipherValues = new Array(0);

    //for each item, add it to cipherValues
    for (var j = 0; j < keyLen; j++){
        cipherValues[j] = createCipher(code.charAt(j));
    }

    //Cipher the text
    var len = plainText.length;

    //set a empty output
    var out = "";

    //for each item in the plaintext
    for (var i = 0; i < len; i++) {

        //if the key is in the ascii value range
        if ((plainText.charCodeAt(i) - cipherValues[i % keyLen]) > 31) {

            //apply the decipher for the char
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) - cipherValues[i % keyLen]));

        //if they is out of the ascii value range
        } else {

            //apply the decipher for the char + 94
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) - cipherValues[i % keyLen] + 94));
        }
    }

    //return the Deciphered text
    return out;
}

//code to create Cipher
function createCipher(code) {

    //get the var length
    var len = code.length;

    //set the cipher value to 0
    var cipherVal = 0;

    //for each item in text
    for (var j = 0; j < len; j++){

        //add the cipher value
        cipherVal += code.charCodeAt(j);
    }

    //return the cipher Value mod 94
    return cipherVal % 94;
}