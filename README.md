## Partiko Web Application For Merchants


Based on this template [SB Admin v2.0](http://startbootstrap.com/template-overviews/sb-admin-2/) to Angular Theme.



## Installation
####1. Clone this project or Download that ZIP file

```sh
$ git clone https://github.com/start-angular/sb-admin-angular.git
```

####2.  Make sure you have [bower](http://bower.io/), [grunt-cli](https://www.npmjs.com/package/grunt-cli) and  [npm](https://www.npmjs.org/) installed globally
 
  for linux
```sh
$ sudo apt-get install npm
$ sudo npm install -g grunt-cli
$ sudo npm install -g bower
```
for windows 
open command promt 
CD - go to project folder
install grunt -g
install bower -g 

####3. On the command prompt run the following commands

```sh
$ cd `project-directory`
```
- bower install is ran from the postinstall
```sh
$ npm install 
```
- a shortcut for `grunt serve`
```sh
$ npm start
```

the following project is used for deployment purpose on server. It runs Uglify, JShint etc tasks so that your code is comsume less space and is difficult to read.

- a shortcut for `grunt serve:dist` to minify the files for deployment
```sh
$ npm run dist 
```


**Note:**
If you get this following error, 
```text
Error: EACCES, permission denied '.config/configstore/insight-bower.yml'
You don't have access to this file.
```
changing ownner .config

```sh
sudo chown -R [user name] ~/.config
```


## Roadmap

- Add sample AJAX calls and make the directives more modular

### Automation tools

- [Grunt](http://gruntjs.com/)
