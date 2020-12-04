# regex-pattern-builder
generate a regex from an input sample string set using machine learning


This is a simple node frontend that exposes a web api for the fantastic RegexGenerator project found here: https://github.com/MaLeLabTs/RegexGenerator


# setup

Note: you need to run this on a machine with node 14.x and java jre available on the path.

```bash
npm install --production

sudo cp regex-pat-web.service /lib/systemd/system/
sudo chmod 664 /lib/systemd/system/regex-pat-web.service
sudo systemctl daemon-reload
sudo systemctl enable regex-pat-web.service
```
