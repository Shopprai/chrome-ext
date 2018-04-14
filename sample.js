// Src: https://developer.chrome.com/extensions/examples/api/contextMenus/basic/sample.js
// Identity tutorial: https://developer.chrome.com/apps/app_identity

// Get auth token (but where are we using it? idk)
chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  console.log("Logged in with Chrome.");
});

if(jQuery) {
  console.log("JQuery loaded.");
} else{
  console.warn("JQuery not loaded.");
}

if(Notify) {
  console.log("Notify loaded.");
} else {
  console.warn("Notify not loaded.");
}

// giving into the jquery life.

function post(path, params, success_callback, failure_callback) {
  console.log('post');
  $.ajax({
    type: "POST",
    url: path, 
    data: params,
    dataType: "json",
    success: function(result) {
      console.log("success: " + result);
      success_callback();
    },
    error: function(error) {
      console.log("error: " + error);
      failure_callback();
      return false;
    },
    complete: function(data) {
      console.log("call completed");
    }
  });
}

function send_notification(title, body) {
  var notification = new Notify(title, {body: body})
  if (!Notify.needsPermission) {
      notification.show();
  } else if (Notify.isSupported()) {
      Notify.requestPermission(onPermissionGranted, onPermissionDenied);
  }

  function onPermissionGranted() {
    console.log('Permission has been granted by the user');
    notification.show();
  }

  function onPermissionDenied() {
    console.warn('Permission has been denied by the user');
  }
}

// On click listener
function send_request(info, tab) {

  chrome.identity.getProfileUserInfo(function(user_info){
    var post_url = "https://shoppr-ai.herokuapp.com/request"
    // var post_url = "http://localhost:5000/request"
    params = {'src_url': info.srcUrl, 'link_url': info.linkUrl, 'page_url':info.pageUrl, 'email': user_info.email};
    var success = post(post_url, params, success_callback=function() {
      send_notification(title="Loomi heard your request!", body="Recommendations in your inbox in 24 hours (:");
    }, failure_callback=function() {
      send_notification(title="An error occurred with the image you sent.", body="If this issue persists, email contact@loomable.co with your request.")
    });
  });
}

$(document).ready(function(){
  var image_menu_item = chrome.contextMenus.create({"title": "Send out Loomi to find alternatives", "contexts":["image"], "onclick": send_request});
  var instagram_menu_item = chrome.contextMenus.create({"title":"Mention @loomable.co to get personalized recommendations in your inbox!", "documentUrlPatterns":["*://www.instagram.com/*"]})
});
