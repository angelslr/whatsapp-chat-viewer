var url = "http://localhost:3000/";

/*ENDPOINT*/

//POST
var endP = "processor";

async function toBackPOST(endpoint, jsonString) {
	const response = await fetch(url + endpoint, {
		method: 'POST',
		body: JSON.stringify(jsonString),
		headers: {
			"Content-type": "application/json"
		}
	});
	return response.json();
}

async function read() {
	var objJSON = await toBackPOST(endP, {"file": "/run/media/angel/Datos/MEGA/Documentos/ProyectosPython/WhatsAppVisualizer/test.txt"});
	console.log(objJSON);
	console.log(objJSON[0].message);
	lastHourPrincipal = 0;
	debugger;
	lastHourSecondary = 0;
	principal = "John Vega";
	currentDate = 0;
	lastPerson = 0;
	lines = 0;
	var newDiv;

	for (var i = 0; i < objJSON.date.length; i++) {
		if (objJSON.date[i] != currentDate) {
			currentDate = objJSON.date[i];

			let newDate = document.createElement('div');
			newDate.className = "date";

			let d = document.createElement('p');
			let dateText = document.createTextNode(currentDate);
			d.appendChild(dateText);
			newDate.appendChild(d)
			document.getElementById("container").appendChild(newDate)
		}

		if (objJSON.person[i] == principal) {
			if (objJSON.hour[i] == lastHourPrincipal && principal == lastPerson) {
				innerMessage();
			}
			else {
				innerRead("principal")
				lastHourPrincipal = objJSON.hour[i];
			}
		}
		else {
			if (objJSON.hour[i] == lastHourSecondary && objJSON.person[i] == lastPerson) {
				innerMessage();
			}
			else {
				innerRead("secondary");
				lastHourSecondary = objJSON.hour[i];
			}
		}
	}
	function innerMessage() {
		debugger;
		var mes = document.createElement('p');
		mes.id = "message";
		text = document.createTextNode(objJSON.message[i]);
		mes.appendChild(text);
		newDiv.appendChild(mes)
		lines++;
	}

	function innerRead(cName) {
		debugger;

		newDiv = document.createElement('div');
		newDiv.className = cName;

		var h = document.createElement('p');
		h.id = "hour";
		var text = document.createTextNode(objJSON.hour[i]);
		h.appendChild(text);
		newDiv.appendChild(h)

		var per = document.createElement('p');
		per.id = "person";
		text = document.createTextNode(objJSON.person[i]);
		per.appendChild(text);
		newDiv.appendChild(per)

		var mes = document.createElement('p');
		mes.id = "message";
		text = document.createTextNode(objJSON.message[i]);
		mes.appendChild(text);
		newDiv.appendChild(mes)

		document.getElementById("container").appendChild(newDiv)
		lastPerson = objJSON.person[i];
		lines++;
	}
	document.getElementById("lines").innerHTML = "Messages: " + lines;
}