import youtube_dl
import subprocess
import shutil

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192'
    }],
    'postprocessor_args': [
        '-ar', '16000'
    ],
    'prefer_ffmpeg': True,
    'keepvideo': False,
    'outtmpl': 'temp1/' + 'file' + '.%(ext)s' 
}
   
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=LYb_nqU_43w'])
    cmd = 'ffmpeg -i temp1/file.mp3 -f segment -segment_time 20 -c copy temp1/out%04d.mp3'
    process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()
    
    try:
        shutil.rmtree('temp1')
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))




