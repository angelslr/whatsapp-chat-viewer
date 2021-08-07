var url = "http://192.168.1.60:3000/";

/*ENDPOINT*/
var endP = "processor";

async function toBackPOST(endpoint, data) {
	const response = await fetch(url + endpoint, {
		method: 'POST',
		body: data,
	});
	return response.json();
}

async function check() {
	let file = document.getElementById('filePath').value;
	let name = document.getElementById('mainParticipant').value;

	if (file == '' || name == '') {
		alert('Some inputs are empty');
	}
	else {
		read(name)
	}
}

async function read(name) {

	//Show animation load
	var animation = document.getElementById('loadContainer');
	animation.style.display = 'block';
	animation.style.opacity = '1';

	//Clean the chat
	let chat = document.getElementById('chat');
	chat.innerHTML = "";
	chat.lastChild = "";

	//Send txt file to backend
	const formData = new FormData();
	const fileField = document.querySelector('input[type="file"]');

	formData.append('file', fileField.files[0]);
	var objJSON = await toBackPOST(endP, formData);

	lastHourPrincipal = 0;
	lastHourSecondary = 0;
	principal = name;
	currentDate = 0;
	lastPerson = 0;
	messages = 0;
	var newDiv;

	if (objJSON[0].date == 0 || objJSON[0].hour == 0 || objJSON[0].person == 0) {
		objJSON[0].date = '-';
		objJSON[0].hour = '00:00';
		objJSON[0].person = 'WhatsApp';
		messages -= 1;
	}

	
	for (var i = 0; i < objJSON.length; i++) {
		if (objJSON[i].date != currentDate) {
			currentDate = objJSON[i].date;
			let newDate = document.createElement('div');
			newDate.className = "date";

			let d = document.createElement('p');
			let dateText = document.createTextNode(currentDate);
			d.appendChild(dateText);
			newDate.appendChild(d)
			document.getElementById("chat").appendChild(newDate)
		}
		if (objJSON[i].person == principal) {
			//If the name of main participant and hour are the same as the current message, the message is added to the same chat balloon
			if (objJSON[i].hour == lastHourPrincipal && principal == lastPerson) {
				innerMessage();
			}
			else {
				innerRead("principal")
				lastHourPrincipal = objJSON[i].hour;
			}
		}
		else {
			//If the last person and hour are the same as the current message, the message is added to the same chat balloon
			if (objJSON[i].hour == lastHourSecondary && objJSON[i].person == lastPerson) {
				innerMessage();
			}
			//If not, a new chat is created
			else {
				innerRead("secondary");
				lastHourSecondary = objJSON[i].hour;
			}
		}
	}
	//Append messages to a chat
	function innerMessage() {
		var mes = document.createElement('p');
		mes.id = "message";
		text = document.createTextNode(objJSON[i].message);
		mes.appendChild(text);
		newDiv.appendChild(mes)
		messages++;
	}

	//Add a new chat balloon
	function innerRead(cName) {
		newDiv = document.createElement('div');
		newDiv.className = cName;

		var h = document.createElement('p');
		h.id = "hour";
		var text = document.createTextNode(objJSON[i].hour);
		h.appendChild(text);
		newDiv.appendChild(h)

		var per = document.createElement('p');
		per.id = "person";
		text = document.createTextNode(objJSON[i].person);
		per.appendChild(text);
		newDiv.appendChild(per)

		var mes = document.createElement('p');
		mes.id = "message";
		text = document.createTextNode(objJSON[i].message);
		mes.appendChild(text);
		newDiv.appendChild(mes)

		document.getElementById("chat").appendChild(newDiv)
		lastPerson = objJSON[i].person;
		messages++;
	}
	document.getElementById("messages").innerHTML = "Messages: " + messages;

	//Hide animation load
	animation.style.display = 'none';
	animation.style.opacity = '0';
}