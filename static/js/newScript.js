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



var pageUnencrypter = function() {
    $("span, p").each(function(i, obj) {

        var new0 = $(this).html().replace(/\{enc:([^:]+):enc}/gim, function(match, key) {
            console.log(match);
            for(var i = 0; i < Cipher.length; i++) {

                var cryptString = CryptoJS.AES.decrypt(key, Cipher[i])

                try {
                    cryptString = CryptoJS.enc.Utf8.stringify(cryptString)
                } catch(err) {
                    cryptString = ""
                }

                if(cryptString.length) {

                    return cryptString.replace(/</gim, "&#60;")
                }
            }
            return "{enc:Invalid Keys:enc}"
        })
        $(this).html(new0)
    })
}

(function() {
    console.log("code started")
    pageUnencrypter()

})();