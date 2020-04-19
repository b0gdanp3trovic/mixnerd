from flask import Flask, request
import youtube_dl
import subprocess
import shutil
from acrcloud.recognizer import ACRCloudRecognizer
import json
import glob, os
import dotenv
import sys

app = Flask(__name__)
dotenv.load_dotenv()

config = {
    #Replace "xxxxxxxx" below with your project's host, access_key and access_secret.
    'host':os.getenv('HOST'),
    'access_key':os.getenv('ACCESS_KEY'), 
    'access_secret':os.getenv('ACCESS_SECRET'),
    'timeout':10 # seconds
}
re = ACRCloudRecognizer(config)

@app.route('/rec', methods = ['POST'])
def recognize():

    data = request.get_json(force=True)
    url = data['url']
    print(url)
    temp_cnt = 0
    for fold in os.listdir('.'):
        if(fold.startswith('temp')):
            temp_cnt += 1
    temp_cnt = str(temp_cnt)
    ydl_opts = {
        'format': 'worstaudio/worst',
        'prefer_ffmpeg': True,
        'keepvideo': False,
        'outtmpl': 'temp' + temp_cnt +'/' + 'file' + '.%(ext)s' 
    }
    
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
        cmd = 'ffmpeg -i temp' + temp_cnt+ '/file.webm -f segment -segment_time 120 -c copy temp' + temp_cnt + '/out%04d.webm'
        process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
        output, error = process.communicate()
        process.wait()
        os.remove('./temp' + temp_cnt + '/file.webm')
        return_info = []
        for file in os.listdir('./temp' + temp_cnt):
            if(file.startswith('o')):
                result = json.loads(re.recognize_by_file('./temp' + temp_cnt + '/' + file, 0))
                if(result):
                    if(result.get('metadata') is None):
                        continue
                    artist_name = result.get('metadata').get('music')[0].get('artists')[0].get('name')
                    song_name = result.get('metadata').get('music')[0].get('title')
                    return_info.append(artist_name + ' - ' + song_name)
                    os.remove('./temp' + temp_cnt + '/' + file)
        return_info = list(dict.fromkeys(return_info))
        print(return_info)
        
        try:
            shutil.rmtree('temp' + temp_cnt)
        except OSError as e:
            print ("Error: %s - %s." % (e.filename, e.strerror))
    return json.dumps(return_info)

if __name__ == "__main__":
    app.run()