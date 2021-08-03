#v0.1 06/26/2020
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
import werkzeug
from werkzeug.utils import secure_filename
from io import open
import os
import re
import time

UPLOAD_FOLDER = '/run/media/ramdisk/'
ALLOWED_EXTENSIONS = {'txt'}

app = Flask(__name__)
cors = CORS(app)
api = Api(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class processor(Resource):
	def post(self):
		start_time = time.time()

		parse = reqparse.RequestParser()
		parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
		args = parse.parse_args()
		file = args['file']

		filename = secure_filename(file.filename)
		file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
		textFile = open(UPLOAD_FOLDER + filename, "r")
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
	app.run(host='0.0.0.0', port=3000, debug=True)