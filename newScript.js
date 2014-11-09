/**
 * Created by Ben on 11/8/14.
 */


//set the default vars
var EncEnabled = false;
var Cipher = "0";

//get their chrome values
chrome.storage.sync.get('EncEnabled', function (result) {
    EncEnabled = result.EncEnabled;
});

chrome.storage.sync.get('CurrentCy', function(result) {
    Cipher = result.CurrentCy;
});


//get the start item
var currentItem = $(".userContent")[0];

//when the page loads
$(document).ready(function () {

    //run main to start
    main();
});

//when someone clicks something
$(document).on("click", function() {

    //wait two seconds
    window.setTimeout(function () {

        //if the items has changed
        if ($(".userContent")[0] != currentItem) {

            //debugging log
            console.log("change url");

            //change the start text
            currentItem = $(".userContent")[0]

            //run main again
            main();
        }
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

        //check the encryption flag
        var encyt_flag = dataText.slice(0, 5);
        var message = dataText.slice(5);

        //debugging log
        console.log("flag:", encyt_flag);

        //if the flag is valid, change the message
        if (encyt_flag == "<enc>") {

            var out = decipher(message, Cipher);
            
            //temp message change
            dataDom.html(out);
        }
    }
};

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
            out = out.concat(String.fromCharCode(plainText.charCodeAt(i) + cValue - 127));
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
            out = out.concat(String.fromCharCode(encryptedText.charCodeAt(i) - cValue + 127));
        }
    }
    return out;
}

function createCipher(code) {
    var j = code.length;
    var cipherVal = 0;

    while(j--){
        cipherVal += code.charCodeAt(j);
    }
    return cipherVal % 94;
}