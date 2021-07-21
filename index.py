#v0.1 06/26/2020
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
from io import open
import re
import time

app = Flask(__name__)
cors = CORS(app)
api = Api(app)

taskPostArgs = reqparse.RequestParser()
taskPostArgs.add_argument('file', type=str, help='File path is required.', required=True)

class processor(Resource):
	def post(self):
		args = taskPostArgs.parse_args()
		filePath = args['file']

		start_time = time.time()
		textFile = open(filePath, "r")
		date = 0
		hour = 0
		person = 0
		message = 0
		segments = []
		data = []
		badCharacters = ["\n","\t","\r","\b","\f","\a","\\","\x00","\x01","\x02","\x03","\x04"]
		i = 0

		while True:
			line = textFile.readline()

			if line == "":
				print("End file")
				break
			else:
				for j in badCharacters:
					line = line.replace(j,'')

				line = line.replace('"', "'")
				segments = re.split(', | - |: ', line, 3)
			
				if (len(segments) != 4 or segments[0].count('/') != 2):
					segments = ' '.join(segments)
					message = ''.join(segments)
				else:
					date = segments[0]
					hour = segments[1]
					person = segments[2]
					message = segments[3]
			i = i+1
			data.append({'date': date, 'hour': hour, 'person': person, 'message': message})

		print("--- %s seconds ---" % (time.time() - start_time))

		return data

api.add_resource(processor, '/processor')

if __name__ == '__main__':
	app.run(port=3000, debug=True)