# gormonn.github.io

28.01.21
* Nodejs + Systemd (Nodejs as service)
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
* Prototype Mixins [app-watchdog](https://github.com/gormonn/app-watchdog)
*The main idea was to make this library "modular". To work with various USB Watchdog devices. To achieve this goal, I decided to use mixins.*
