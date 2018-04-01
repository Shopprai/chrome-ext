// Src: https://developer.chrome.com/extensions/examples/api/contextMenus/basic/sample.js
// Identity tutorial: https://developer.chrome.com/apps/app_identity

// Get auth token (but where are we using it? idk)
chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  console.log("authenticated af");
});

if(jQuery) {
  console.log("JQuery loaded");
} else{
  console.log("nope");
}

// giving into the jquery life.

  function post(path, params) { // TODO: this only executes once...
    console.log('post');
    $.ajax({
      type: "POST",
      url: path, 
      data: params,
      dataType: "json",
      success: function(result) {
        console.log("success: " + result);
      },
      error: function(error) {
        console.log("error: " + error);
      },
      complete: function(data) {
        console.log("call completed");
      }
    });
  }

  // Callback
  function sendRequest(info, tab) {
    console.log("srcUrl: " + info.srcUrl);
    console.log("linkUrl: " + info.linkUrl);
    console.log("pageUrl: " + info.pageUrl);

    chrome.identity.getProfileUserInfo(function(user_info){ // TODO: code block not executing :(
      console.log("posting");
      var post_url = "https://shoppr-ai.herokuapp.com/request";
      params = {'src_url': info.srcUrl, 'link_url': info.linkUrl, 'page_url':info.pageUrl, 'email': user_info.email};
      post(post_url, params);
    });
    console.log("done");
  }

$(document).ready(function(){
  console.log('document ready');
  var parent = chrome.contextMenus.create({"title": "Find similar clothing", "contexts":["image"], "onclick": sendRequest});
});