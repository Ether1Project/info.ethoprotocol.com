# info.ethoprotocol.com
# Installation
In order to run the info dashboards several components need to be installed:

## Install Mysql
```
  sudo apt update
  sudo apt install mysql-server
  sudo mysql_secure_installation 
```  

## Install Node JS, npm and git
```
  sudo apt install nodejs
  sudo apt install npm
  sudo apt install git
```  

## Clone the git repository
Clone git in Your local directory, or where ever the project root shall be.
```
  cd
  git clone https://github.com/...
```

Create the npm files needed for this instance
```
  npm install
```


## Setup configuration and database
Next go to the config directory and create a file with the configuration for the project.
```
  cd config
  vi config.production.json
```

The config file has the following syntax. Replace the password and user according to Your mysql installation.
```
{
  "development": true,
  "connectionLimit": 10,
  "host": "localhost",
  "user": "root",
  "password": "19467fdm",
  "database": "info",
  "multipleStatements": true,
  "timezone": "local",
  "httphost": "http://localhost",
  "NODEMAIL_HOST": "xxx",
  "NODEMAIL_USER": "yyy",
  "NODEMAIL_PASS": "zzz",
  "PORT": "3006",
  "CAPTCHAKEY": "Not yet needed",
  "CMCAPIKEY": "Private key here"
}
```

Make sure You make the file only readable to the user running late node js.
```
  chown 0600 config.production.json
```

Next we need to create the database called gamedev. For that we go to the project root.
```
  cd ..
  mysqladmin -uroot -p create gamedev
  mysql -uroot -p gamedev < basedataset.sql
```

Finally we install PM2 and fire it up
```
  sudo npm install pm2@latest -g
  pm2 start ecosystem.config.js 
```

Now You can start the website with http://xxx.xxx.xxx.xxx:3002
It should look like this one: http://portal.atheios.org:3002

# info.ethoprotocol.com
