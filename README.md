# Introdution
Hello! My name is Dmitry and this is my development blog.
Now I work in a local company office, but I'm looking for a warmer place.

I need to blog primarily in order to reflect my development and research experience on paper. I started doing this in Google Doc, but realized that it was not effective.

Perhaps in the future, I will convert this page into an easy-to-read blog. And I will transfer the accumulated experience from Google Docs here (I'm too lazy, really).

<!--[You can buy me an apple](https://www.buymeacoffee.com/gormonn)-->

# Builds
*  [WIP] [[source](https://github.com/gormonn/react-practice-list-edit-sort-filter)] [React list](https://gormonn.github.io/react-practice-list-edit-sort-filter/)


# Diary

## 28.01.21
### Nodejs + Systemd (Nodejs as service)
```
#!/bin/bash
path="$NVM_DIR/versions/node/v12.19.0/bin"
s='monitoring-nc'
echo "
[Unit]
Description=Monitoring-NC

[Service]
Type=simple
Restart=on-failure
WorkingDirectory=$(pwd)
ExecStart=$path/node $(pwd)/dist/server.js

[Install]
WantedBy=multi-user.target
" > ${s}.service

sudo cp ./monitoring-nc.service /etc/systemd/system/${s}.service
sudo chmod 664 /etc/systemd/system/${s}.service

sudo systemctl daemon-reload
sudo systemctl enable ${s}
```
### Prototype Mixins in [app-watchdog](https://github.com/gormonn/app-watchdog)
The main idea was to make this library "modular". To work with various USB Watchdog devices. To achieve this goal, I decided to use mixins.
