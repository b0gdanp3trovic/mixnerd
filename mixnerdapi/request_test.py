import requests 

print(requests.get('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=VRmry6AeKlw&format=json').json())