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
	var selected_options = request.priority_list;
	var options_form = document.createElement("form");
	options_form.className = "form-items";
	for (option of options) {
		var input_item = document.createElement("input");
		input_item.name = "style_priority";
		input_item.value = option;
		input_item.type = "checkbox";
		input_item.name = request.src_url + "_chkbox"; // Identify form item by its item url.
		if (selected_options.indexOf(option) >= 0) {
			input_item.checked = "checked"
		} else {
			input_item.checked = ""
		}

		var line_break = document.createElement("br");
		options_form.appendChild(input_item);
		options_form.appendChild(document.createTextNode(option));
		options_form.appendChild(line_break);
	}

	var submit_button = document.createElement("button");
	submit_button.appendChild(document.createTextNode("Update"));
	submit_button.addEventListener("click", function() {
		submit_button.innerHTML = "Updated!";
	});
	submit_button.className = "form-submit";
	submit_button.id = request.src_url;
	submit_button.onclick = update_style_priorities;

	var timer = document.createElement("p");
	timer.innerHTML = request.time_left_hours + ":" + request.time_left_minutes + " until this request is fulfilled!"

	// Compile together
	list_item.appendChild(anchor);
	list_item.appendChild(options_form);
	list_item.appendChild(submit_button);
	list_item.appendChild(timer);
	return list_item;
}

function post(path, params) {
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

function update_style_priorities(e) {
	var form_items = document.getElementsByName(e.target.id + "_chkbox");
	checked_items = [];
	for (item of form_items) { 
		if (item.checked) {
			checked_items.push(item.value);
		}
	}
	// var url = "http://localhost:5000/request/priorities"
	var url = "https://shoppr-ai.herokuapp.com/priorities"
	var params = {'_id': stored_email + e.target.id, 'priority_list': checked_items}
	post(url, params);
}

function refresh_data() {
	chrome.identity.getProfileUserInfo(function(user_info){
		stored_email = user_info.email;
		$.ajax({
			method: "GET",
			// url: "http://localhost:5000/request/" + user_info.email,
			url: "https://shoppr-ai.herokuapp.com/request/" + user_info.email,
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
    for (var i = 0; i < links.length; i++) {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
    }
}

// document.getElementById("refresh_button").onclick = refresh_data;
window.onload = refresh_data;
