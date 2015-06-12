/**
 * Created by Ben on 11/8/14.
 * Code for the popup window
 */

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
});

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