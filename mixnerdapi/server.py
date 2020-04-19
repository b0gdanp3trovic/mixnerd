from flask import Flask, request, jsonify
import youtube_dl
import subprocess
import shutil
from acrcloud.recognizer import ACRCloudRecognizer
import json
import glob, os
import dotenv
import sys
from flask_cors import CORS, cross_origin


app = Flask(__name__)
dotenv.load_dotenv()
cors = CORS(app)

config = {
    #Replace "xxxxxxxx" below with your project's host, access_key and access_secret.
    'host':os.getenv('HOST'),
    'access_key':os.getenv('ACCESS_KEY'), 
    'access_secret':os.getenv('ACCESS_SECRET'),
    'timeout':10 # seconds
}
re = ACRCloudRecognizer(config)


@app.route('/rec', methods = ['POST'])
@cross_origin()
def recognize():
    data = request.get_json(force=True)
    url = data['url']
    print(data['timestamps'])
    segment_time = 120
    if(data['timestamps']):
        segment_time = 15
    temp_cnt = 0
    for fold in os.listdir('.'):
        if(fold.startswith('temp')):
            temp_cnt += 1
    temp_cnt = str(temp_cnt)
    ydl_opts = {
        'noplaylist': True,
        'format': 'worstaudio/worst',
        'prefer_ffmpeg': True,
        'keepvideo': False,
        'outtmpl': 'temp' + temp_cnt +'/' + 'file' + '.%(ext)s' 
    }
    
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
        cmd = 'ffmpeg -i temp' + temp_cnt+ '/file.webm -f segment -segment_time ' + str(segment_time) + ' -c copy temp' + temp_cnt + '/out%04d.webm'
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        process.wait()
        os.remove('./temp' + temp_cnt + '/file.webm')
        return_info = []
        timestamps = []
        print('gettin')
        timestamp_cnt = 0
        for file in os.listdir('./temp' + temp_cnt):
            timestamp_cnt += 1
            if(file.startswith('o')):
                result = json.loads(re.recognize_by_file('./temp' + temp_cnt + '/' + file, 0))
                print('ha')
                if(result):
                    if(result.get('metadata') is None):
                        continue
                    artists = map(lambda artist: artist.get('name'), result.get('metadata').get('music')[0].get('artists'))
                    artists = ', '.join(artists)
                    print(result)
                    song_name = result.get('metadata').get('music')[0].get('title')
                    album_name = result.get('metadata').get('music')[0].get('album').get('name')
                    print(album_name)
                    return_info.append({'artists': artists, 'song_name': song_name, 'album_name': album_name})
                    timestamps.append((timestamp_cnt-1) * 15)
                os.remove('./temp' + temp_cnt + '/' + file)
        seen = set()
        new_l = []
        index = 0
        for d in return_info:
            print(d)
            t = tuple(d.items())
            if t not in seen: 
                a = d.copy()
                a['timestamp'] = timestamps[index]
                seen.add(t)
                new_l.append(a)
            index += 1
        return_info = new_l

        
        try:
            shutil.rmtree('temp' + temp_cnt)
        except OSError as e:
            print ("Error: %s - %s." % (e.filename, e.strerror))
    return jsonify(return_info)

if __name__ == "__main__":
    app.run(threaded=True)