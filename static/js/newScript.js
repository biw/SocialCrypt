//set the default vars
var EncEnabled = false
var Cipher = 0

//get the value if the extention is enabled from  chrome values
chrome.storage.sync.get('EncEnabled', function (result) {
    EncEnabled = result.EncEnabled
})


//get the value what the current cypher texts are
chrome.storage.sync.get('CurrentCy', function(result) {
    Cipher = result.CurrentCy
})


$(document).delegate("._52lb", "DOMSubtreeModified", function() {

    window.setTimeout(function () {

        if($("#enc-area").length == 0) {

            var enc_data = '<button id="encypt_button">Encypt & Post</button>'
            $("._1dsp").after("<div id='enc-area'>" + enc_data + "</div>")
            $("#enc-area").append('<div id="cypherList"></div><div id="cypherButton">Select Encryption Key <div id="downArrow"></div></div>')

            var cipherLen = Cipher.length

            for(var i = 0; i < cipherLen; i++) {

                if(Cipher[i] != "") {
                    $("#cypherList").append('<li>' + Cipher[i] + '</li>')
                }
            }
            $("#cypherList").append("<input id='cypherin' placeholder='enter new key'>")
        }
    }, 500)
})

$(document).delegate(".mentionsTextarea", "click", function () {
    $("#enc-area").show()
})

//when the cypher button is clicked
$(document).delegate("#cypherButton", "click", function() {
    $("#cypherList").toggle()
})

//when a list item is click
$(document).delegate("#cypherList li", "click", function (x) {

    var clicked_item = x.target.firstChild.data

    //change the view value
    $("#cypherButton").text(clicked_item)

    //change the list view
    $("#cypherList").hide()
})


//when the user clicks to encypt
$(document).delegate("#encypt_button", "click", function(x) {

    //get the value
    var userCipher = $("#cypherButton").text()
    var userText = $(".mentionsTextarea").val()

    //cipher the text
    var encryptedText = CryptoJS.AES.encrypt(userText, userCipher)
    var finalValue = "{enc:" + encryptedText + ":enc}"

    //add the values to the website
    $(".mentionsTextarea").val(finalValue)
    $(".mentionsHidden").val(finalValue)

    $("#enc-area").hide()

    chrome.storage.sync.get('CurrentCy', function(result) {
        var newKey = true

        for(var i = 0; i < Cipher.length; i++) {

            if(userCipher == Cipher[i]) {
                newKey = false
            }
        }

        if(newKey) {
            result.CurrentCy.push(userCipher)
        }
        chrome.storage.sync.set({'CurrentCy': result.CurrentCy})
    })
})

//get the start item
var currentItem = $(".userContent")[0]

//when the page loads
$(document).ready(function () {
    main()
})

//when someone clicks something
$(document).on("click", function () {

    //wait two seconds
    window.setTimeout(function () {

        //if the items has changed
        if ($(".userContent")[0] != currentItem) {
            var fb_value = $("#fb_added_keys").val()
            $(".fb_added_content").remove()
            $("#fb_added_keys").val(fb_value)
            main()
        }

    //two seconds
    }, 2000)
})

function main() {

    //get the amount of entrees
    var entries = $(".userContent").length

    //loop through the items
    for (var i = 0; i < entries; i++) {

        //slice up the items
        var dataDom = $(".userContent").slice(i, i + 1)
        var dataText = dataDom.text()

        var foundItem = false

        //check the encryption flag
        var encryt_flag = dataText.slice(0, 5)
        var encryptedText = dataText.slice(5, -5)

        console.log(encryptedText)

        //if the flag is valid, change the message
        if(encryt_flag === "{enc:") {

            //set the output
            var unencryptedText = ""

            //for each of the keys
            for(var j = 0; j < Cipher.length; j++) {

                //set the current key
                unencryptedText =  CryptoJS.AES.decrypt(encryptedText, Cipher[j])

                try {
                    unencryptedText = CryptoJS.enc.Utf8.stringify(unencryptedText)
                } catch(err) {
                    unencryptedText = ""
                }

                //if the key is correct
                if (unencryptedText.length) {

                    //output new text
                    dataDom.html(unencryptedText)

                    //change the found flag
                    foundItem = true
                }
            }

            //if we haven't found the right key
            if(!foundItem) {

                //tell the user
                dataDom.text("<Invalid Creditials>")
            }
        }
    }
}