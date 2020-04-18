import youtube_dl

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192'
    }],
    'postprocessor_args': [
        '-i', 'song-'+ '.%(title)s', 'segment', '-segment_time', '20', '-c', 'copy', 'out%03d.mp3'
    ],
    'prefer_ffmpeg': True,
    'keepvideo': False,
    'outtmpl' : 'song-' +'.%(title)s'+ '.%(ext)s' 
}
   
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download(['https://www.youtube.com/watch?v=xODK_OwxpHM'])