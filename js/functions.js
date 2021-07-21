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
	debugger;
	var objJSON = await toBackPOST(endP, {"file": "/run/media/angel/Datos/MEGA/Documentos/ProyectosPython/WhatsAppVisualizer/test.txt"});

	lastHourPrincipal = 0;
	lastHourSecondary = 0;
	principal = "John Vega";
	currentDate = 0;
	lastPerson = 0;
	lines = 0;
	var newDiv;

	if(objJSON[0].date == 0 || objJSON[0].hour == 0 || objJSON[0].person == 0){
		objJSON[0].date = '-';
		objJSON[0].hour = '00:00';
		objJSON[0].person = 'WhatsApp';
		lines -= 1;
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
			document.getElementById("container").appendChild(newDate)
		}

		if (objJSON[i].person == principal) {
			if (objJSON[i].hour == lastHourPrincipal && principal == lastPerson) {
				innerMessage();
			}
			else {
				innerRead("principal")
				lastHourPrincipal = objJSON[i].hour;
			}
		}
		else {
			if (objJSON[i].hour == lastHourSecondary && objJSON[i].person == lastPerson) {
				innerMessage();
			}
			else {
				innerRead("secondary");
				lastHourSecondary = objJSON[i].hour;
			}
		}
	}
	function innerMessage() {
		debugger;
		var mes = document.createElement('p');
		mes.id = "message";
		text = document.createTextNode(objJSON[i].message);
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

		document.getElementById("container").appendChild(newDiv)
		lastPerson = objJSON[i].person;
		lines++;
	}
	document.getElementById("lines").innerHTML = "Messages: " + lines;
}