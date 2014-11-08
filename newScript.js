/**
 * Created by Ben on 11/8/14.
 */


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
        var encyt_flag = dataText.slice(0, 3);

        //debugging log
        console.log("flag:", encyt_flag);

        //if the flag is valid, change the message
        if (encyt_flag == "enc") {

            //temp message change
            dataDom.html("new message");
        }
    }
};