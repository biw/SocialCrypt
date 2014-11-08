/**
 * Created by Ben on 11/8/14.
 */

var entries = $(".userContent").length;


for(var i = 0; i < entries; i++) {

    var dataDom = $(".userContent").slice(i, i+1);
    var dataText = dataDom.text();

    var encyt_flag = dataText.slice(0, 3);

    if(encyt_flag == "enc") {

        dataDom.text("new message");
    }
}