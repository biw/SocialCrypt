/**
 * Created by Ben on 11/8/14.
 */


//set the default vars
var EncEnabled = false;
var Cipher;

//get their chrome values
chrome.storage.sync.get('EncEnabled', function (result) {
    EncEnabled = result.EncEnabled;
});


console.log( syncGet("CurrentCy"));



chrome.storage.sync.get('CurrentCy', function(result) {
    Cipher = result.CurrentCy;
    console.log( result);
});

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

            //change the start text
            currentItem = $(".userContent")[0]

            //run main again
            main();
        }
    }, 2000);
});

function syncGet(keyword) {
    chrome.storage.sync.get(keyword, function(result) {
        console.log(result);
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
        var encyt_flag = dataText.slice(0, 5);
        var message = dataText.slice(5);

        //if the flag is valid, change the message
        if (encyt_flag == "<enc>") {

            var out = newDecipher(message, Cipher);
            
            //temp message change
            dataDom.html(out);
        }
    }
};

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


function cipher(plainText, code){
    var cValue = createCipher(code);

    //Cipher the text
    var len = plainText.length;

    var out = "";
    for (var i = 0; i < len; i++) {
        if ((plainText.charCodeAt(i) + cValue) < 127) {
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cValue));
        }
        else {
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cValue - 94));
        }
    }
    return out;
}

function decipher(encryptedText, code){

    var cValue = createCipher(code);

    //Decipher the text
    var len = encryptedText.length;

    var out = "";
    for (var i = 0; i < len; i++) {
        if ((encryptedText.charCodeAt(i) - cValue) > 31) {
            out = out.concat(String.fromCharCode(encryptedText.charCodeAt(i) - cValue));
        }
        else {
            out = out.concat(String.fromCharCode(encryptedText.charCodeAt(i) - cValue + 94));
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