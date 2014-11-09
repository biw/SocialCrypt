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


    chrome.storage.sync.get('CurrentCy', function(result) {

        $(".cipher").val(result.CurrentCy);
    });



    $("#save").click(function() {
        var Enabler = $("#enc").is(":checked");

        var Cipher = $(".cipher").val();
        chrome.storage.sync.get("CurrentCy", function(result) {

            if(result.CurrentCy == null) {
                chrome.storage.sync.set({"EncEnabled": Enabler, "CurrentCy": ["nullptr", Cipher]});
            } else {
                console.log("awda");
                result.CurrentCy.push(Cipher);
                Cipher = Cipher.split(",");
                chrome.storage.sync.set({"EncEnabled": Enabler, "CurrentCy": Cipher});
            }
        })
    });

console.log("awd");