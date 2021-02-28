# regex-pattern-builder
generate a regex from an input sample string set using machine learning


This is a simple node frontend that exposes a web api for the fantastic RegexGenerator project found here: https://github.com/MaLeLabTs/RegexGenerator


# setup

Note: you need to run this on a machine with node 14.x and java jre available on the path.

```bash
sudo apt install default-jre

npm install --production

sudo cp regex-pat-web.service /lib/systemd/system/
sudo chmod 664 /lib/systemd/system/regex-pat-web.service
sudo systemctl daemon-reload
sudo systemctl enable regex-pat-web.service
```


If you're using nginx as a reverse proxy, add this to your nginx config:

```nginx
location /regex {
	proxy_pass http://127.0.0.1:5001;
	proxy_http_version 1.1;
	proxy_set_header X-Forwarded-Proto https;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection 'upgrade';
	proxy_set_header Host $host;
	proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300;
}
```
