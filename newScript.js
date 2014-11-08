/**
 * Created by Ben on 11/8/14.
 */

var entries = $(".userContent").length;


for(var i = 0; i < entries; i++) {

    var data = $(".userContent")[i].childNodes[0].childNodes;

    var encyt_flag = data.slice(0, 3);

    if(encyt_flag == "enc") {

        data = "secret message";
    }
}