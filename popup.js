/**
 * Created by Ben on 11/8/14.
 */

    chrome.storage.sync.get('EncEnabled', function (result) {

        if(result.EncEnabled == true) {
            $("#checked").html('<input type="checkbox" id="enc" name="enc" checked value="True">');
        } else {
            $("#checked").html('<input type="checkbox" id="enc" name="enc" value="True">');
        }
    });


    chrome.storage.sync.get('CurrentSy', function(result) {

        $("#cipher").value(result.CurrentSy);
    });



    $("#cipher").click(function() {
        var Enabler = $("#checked").value;
        console.log(Enabler);

        if(Enabler == "True") {
            Enabler = true;

        } else {
            Enabler = false;
        }
        var Cipher = $("#cipher").value;

        chrome.storage.sync.set({"EncEnabled": Enabler})
    });

console.log("awd");