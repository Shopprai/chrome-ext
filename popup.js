console.log("popup.js");

var stored_email = "";

function create_list_item(request) {
	var list_item = document.createElement("li");
	list_item.styleName = "flex";

	// Create image link
	var anchor = document.createElement("a");
	anchor.href = request.page_url;
	var img_div = document.createElement("div");
	img_div.style.backgroundImage = "url('" + request.src_url + "')";
	img_div.className = "img";
	anchor.appendChild(img_div);

	// Create checkboxes
	var options = ["fit", "color", "brand"];
	var options_form = document.createElement("form");
	options_form.className = "form-items";
	for (option of options) {
		var input_item = document.createElement("input");
		input_item.name = "style_priority";
		input_item.value = option;
		input_item.type = "checkbox";
		input_item.name = request.src_url + "_chkbox"; // Identify form item by its item url.

		var line_break = document.createElement("br");
		options_form.appendChild(input_item);
		options_form.appendChild(document.createTextNode(option));
		options_form.appendChild(line_break);
	}

	var submit_button = document.createElement("button");
	submit_button.appendChild(document.createTextNode("Submit"));
	submit_button.className = "form-submit";
	submit_button.id = request.src_url;
	submit_button.onclick = update_style_priorities;

	// Compile together
	list_item.appendChild(anchor);
	list_item.appendChild(options_form);
	list_item.appendChild(submit_button);
	return list_item;
}

function update_style_priorities(e) {
	console.log(e.target.id);
	console.log(stored_email);
	var form_items = document.getElementsByName(e.target.id + "_chkbox");
	checked_items = [];
	for (item of form_items) { 
		if (item.checked) {
			checked_items.push(item.value);
		}
	}
	console.log(checked_items);
}

function refresh_data() {
	chrome.identity.getProfileUserInfo(function(user_info){
		stored_email = user_info.email;
		$.ajax({
			method: "GET",
			url: "http://localhost:5000/request/" + user_info.email,
			// url: "https://shoppr-ai.herokuapp.com/request/" + user_info.email,
			success: function(results) {
				requests = results.requests;
				var ul = document.getElementById("request_list");
				ul.innerHTML = "";
				for (request of requests) {
					var li = create_list_item(request);
					ul.appendChild(li);
				}
				activate_links();
			},
			error: function(error) {
				console.log(error);
			}
		});
	});
}

function activate_links() {
	var links = document.getElementsByTagName("a");
    console.log(links);
    console.log(links.length);
    for (var i = 0; i < links.length; i++) {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
    }
}

document.getElementById("refresh_button").onclick = refresh_data;
window.onload = refresh_data;
