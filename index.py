#v0.1 06/26/2020
from os import path
from flask import Flask, render_template
from io import open
import re
import time

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
	filePath = input('Enter input path: ')

	start_time = time.time()
	textFile = open(filePath, "r")
	date = []
	hour = []
	person = []
	message = []
	segments = []
	badCharacters = ["\n","\t","\r","\b","\f","\a","\\","\x00","\x01","\x02","\x03","\x04","\x05","\x06","\x07","\x08"]
	i = 0

	while True:

		line = textFile.readline()

		if "" == line:
			print("End file")
			break
		else:
			for j in badCharacters:
				line = line.replace(j,'')

			line = line.replace('"', "'")
			segments = re.split(', | - |: ', line, 3)
			
			if (len(segments) != 4 or segments[0].count('/') != 2):
				date.append(date[i-1])
				hour.append(hour[i-1])
				person.append(person[i-1])
				segments = ' '.join(segments)
				message.append(' '.join(segments))
			else:
				date.append(segments[0])
				hour.append(segments[1])
				person.append(segments[2])
				message.append(segments[3])
		i = i+1

	data = {'date': date, 'hour': hour, 'person': person, 'message': message}

	print("--- %s seconds ---" % (time.time() - start_time))

	return render_template('index.html', data=data)


if __name__ == '__main__':
	app.run(port=3000, debug=True)