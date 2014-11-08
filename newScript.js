/**
 * Created by Ben on 11/8/14.
 */

var entries = $(".userContent").length;


for(var i = 0; i < entries; i++) {

    var dataDom = $(".userContent").slice(i, i+1);
    var data = dataDom.text();

    var encyt_flag = data.slice(0, 3);

    if(encyt_flag == "enc") {

        data.text("new message");
    }
}