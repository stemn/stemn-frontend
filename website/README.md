# README #

### Requirements
Make sure you have installed:

* Node.js - [https://nodejs.org/en/](Link URL)
* MongoDB - [https://www.mongodb.org/downloads#production](Link URL)
* git - [https://git-scm.com/downloads](Link URL)
* Python2.7 - [https://www.python.org/downloads/](Link URL)
* Ruby - [http://rubyinstaller.org/downloads/](Ruby)
* SASS - `gem install sass` (This requires Ruby)
* Visual Studio & Sharp - [https://www.microsoft.com/en-us/download/details.aspx?id=48159](Link URL) - Only required for Windows (to build Sharp) then `npm install sharp --msvs_version=2015 --with-modules=no`

### How do I get set up? ###
* Clone this repo onto your computer
* Navigate to the root of the STEMN directory
* Run `npm install` to download 3rd party packages
* Run `npm install -g grunt-cli brunch nodemon`

## Run the App
#### To run the main app
* Run the dependencies (MongoDB and Redis) `stemn\server\start-dependencies.bat`
* Change directory to `app/main` and run `brunch w --server`
* The app will be available at `localhost:3333`

#### To run the admin panel
* Add the mapping `127.0.0.1 admin.stemn.dev` to the hostfile `C:\Windows\System32\drivers\etc\` or `/etc/hosts`
* Run the dependencies (MongoDB and Redis) `stemn\server\start-dependencies.bat`
* Change directory to `app/admin` and run `brunch w --server`
* The admin panel will be available at `admin.stemn.dev:3333`

#### Deploy the app
* Run `grunt deploy`

#### Test the app
* Install protractor `npm install -g protractor`
* run `grunt test`

### Utilities
* Download the latest database `node scripts/mongodb/get-latest-database` (Requires [OpenSSH for Windows](https://sourceforge.net/projects/sshwindows/files/OpenSSH%20for%20Windows%20-%20Release/3.8p1-1%2020040709%20Build/setupssh381-20040709.zip/download))
* Connect to the AWS servers `node scripts/aws/ssh`
* View real time application server logs `node scripts/aws/logs`
* To clear the analytics cache `GET http://localhost:3000/api/v1/analytics/flushCache`
* To clear the entire cache `GET http://localhost:3000/api/v1/flushCache`
