/**
 * Created by Ben on 11/8/14.
 */

    chrome.storage.sync.get('EncEnabled', function (result) {

        if(result.EncEnabled == true) {
            $("#checked").html('<input type="checkbox" id="enc" name="enc" checked>');
        } else {
            $("#checked").html('<input type="checkbox" id="enc" name="enc">');
        }
    });


    chrome.storage.sync.get('CurrentSy', function(result) {

        $("#cipher").val(result.CurrentSy);
    });



    $("#save").click(function() {
        var Enabler = $("#enc").is(":checked");

        var Cipher = $("#cipher").val();

        chrome.storage.sync.set({"EncEnabled": Enabler, "CurrentSy": Cipher});
    });

console.log("awd");