console.log("popup.js");

function refresh_data() {
	chrome.identity.getProfileUserInfo(function(user_info){
		$.ajax({
			method: "GET",
			url: "https://shoppr-ai.herokuapp.com/request/" + user_info.email,
			success: function(results) {
				requests = results.requests;
				var ul = document.getElementById("request_list");
				ul.innerHTML = "";
				for (request of requests) {
					var li = document.createElement("li");
					li.appendChild(document.createTextNode(request.src_url));
					ul.appendChild(li);
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	});
}

document.getElementById("refresh_button").onclick = refresh_data;