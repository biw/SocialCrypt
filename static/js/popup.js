$('#enc-keys').submit(function () {
    console.log('item: '+ $('input').val());
    if ($('#enc-keys-input').val() !== '') {
        var inputValue = $('#enc-keys-input').val();
        $('ul').append('<li><a href="">x</a> ' + inputValue + '</li>');
    };
    $('#enc-keys-input').val('');
    return false;
});

$(document).on('click', 'a', function (e) {
    e.preventDefault();
    $(this).parent().remove();
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
        code: '$("span, p").each(function(){var e=$(this).html().replace(/\{enc:([^:]+):enc}/gim,function(e,n){console.log(e);for(var r=0;r<Cipher.length;r++){var t=CryptoJS.AES.decrypt(n,Cipher[r]);try{t=CryptoJS.enc.Utf8.stringify(t)}catch(c){t=""}if(t.length)return t.replace(/</gim,"&#60;")}return console.log(t),"{enc:Invalid Keys:enc}"});$(this).html(e)});'
    });
});


//get if the extention is enabled
chrome.storage.sync.get('EncEnabled', function (result) {

    //if the extention is on
    if(result.EncEnabled == true) {

        //fill the checkbox
        $("#checked").html('<input type="checkbox" id="enc" name="enc" checked>');

    //if the extention is off
    } else {

        //empty the checkbox
        $("#checked").html('<input type="checkbox" id="enc" name="enc">');
    }
})

//get the current ciphers
chrome.storage.sync.get('CurrentCy', function(result) {

    //add the current ciphers to the lists
    $(".cipher").val(result.CurrentCy);
});


//when someone clicks the save button
$("#save").click(function() {

    //see if the function is enabled
    var Enabler = $("#enc").is(":checked");

    //check the value of the ciphers
    var Cipher = $(".cipher").val();

    //set the current ciphers
    chrome.storage.sync.set({"CurrentCy": ["nullptr, Cipher"]});
    chrome.storage.sync.get("CurrentCy", function(result) {

        //if the current ciphers is null
        if(result.CurrentCy == null) {

            //set an empty cipher text
            chrome.storage.sync.set({"EncEnabled": Enabler, "CurrentCy": ["nullptr", Cipher]});

        //if the current ciphers is not null
        } else {

            //add the cipher to the currentCy
            result.CurrentCy.push(Cipher);

            //split each cipher by ,
            Cipher = Cipher.split(",");

            //set the new cipher list
            chrome.storage.sync.set({"EncEnabled": Enabler, "CurrentCy": Cipher});
        }
    })
});
