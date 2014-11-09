/**
 * Created by Ben on 11/8/14.
 */

function savedata(data) {
    if (tab.incognito) {
        chrome.runtime.getBackgroundPage(function(bgPage) {
            bgPage[tab.url] = data;      // Persist data ONLY in memory
        });
    } else {
        localStorage["bob"] = data;  // OK to store data
        console.log("saved the data");
    }
}

savedata("the dog");

theValue = dog;
chrome.storage.sync.set({'value': theValue}, function() {
    // Notify that we saved.
    console.log('Settings saved');
});