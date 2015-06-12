//when the user clicks to encypt
$(document).delegate("#encypt_button", "click", function(x) {

    //get the value
    var userCipher = $("#cypherText").val()
    var userText = $("#inputText").val()

    console.log("userCipher: " + userCipher)
    console.log("userText: " + userText)


    //cipher the text
    var encryptedText = CryptoJS.AES.encrypt(userText, userCipher)

    console.log("AES: " + encryptedText)

    var unencryptedText =  CryptoJS.AES.decrypt(encryptedText, userCipher + "d")
    unencryptedText = CryptoJS.enc.Utf8.stringify(unencryptedText)

    if(unencryptedText.length) {
        console.log("unencryptedText: " + unencryptedText)
    } else {
        console.log("unencryptedText: Invalid userCipher")
    }

    //create hash
    var hashText = makeHash(userCipher.concat(encryptedText))

    console.log("hash: " + hashText)

    //create the text for the text area
    var newText = "<enc"+hashText+">"+encryptedText

    //add the values to the website
    $("#outputText").val(newText)

    console.log("")

})


//function to make Hash
function makeHash(txt){

    //use the CryptoMD5 library to md5 the text
    return CryptoJS.SHA256(txt, { outputLength: 256 })
}