# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The backend is set up with node js [express](https://expressjs.com/). All project codebase is under the same git control. 

## Available Scripts for Frond End

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Available Scripts for Frond End

### `node .\server.js`
In the project directory, you can start the server as a standalone application to serv as https API server.
It will enable the back end servic full started. 

### `node --inpsect XXX.js`
Inspect is a useful debugging suffix for node command line. It can debug both apps and scripts. Detailed 
command line options reference is [here](https://nodejs.org/en/learn/getting-started/debugging). 
If you do not prefer the black and white console, there are more dev client options recommended. Chrome 
DevTools 55+, Microsoft Edge, Visual Studio Code, Visual Studio 2017+, JetBrains WebStorm and other 
JetBrains IDEs, and Eclipse IDE etc.

## Required Dependency

### Priority Queue

Install @datastructures-js/priority-queue for the MinPriorityQueue
`npm install @datastructures-js/priority-queue --save`

### NodeJS Package

Install 3 packages for node js and jwt
`npm install express@4.21.2 dotenv@16.4.5 jsonwebtoken@9.0.2 --save`

### Logging for NodeJS

Winston is the most popular logging library for Node.js. It aims to make logging more flexible and extensible by decoupling different aspects such as log levels, formatting, and storage so that each API is independent and many combinations are supported.It also uses Node.js streams to minimize the performance impact of implementing logging in your application. Pls following to install:
`npm install winston@latest --save`

### Javascript Testing Tools - Jest

Jest is a testing framework for JavaScript that was developed by Facebook. It is used to test code written in Node.js, React, and other JavaScript frameworks. Jest is designed to be easy to use and comes with a built-in test runner that can be used to run tests in parallel, which makes testing faster. In this project, Jest is the unit test tools for both frontend and backend.
`npm install jest --save`

### React Icons
React icons is a icon library for React design.
`npm install react-icons --save`

## Installation Guide

The whole project codebase is under one working directory, and it is easy to manage the source without sync across different
repositories. However, the deployment still needs several steps to contruct the working enviroment and start the server. Please follow the steps as instructed, and keep a close watch to the log.

### Build the Front End 

At the root directory, package.json clarifies the dependencies required by react and nodeJS. Apply simple command 
`npm run build` at the root directory to build whole react project into one static working directory `./build`. 
Webpack plugins help pack the rcodebase into static resources to be render in the server root. Remember, `./build` 
is your front end delivery resource, so do not modify and part inside the folder.

### Generate the .env

The environment variables would be acquired from .env file. Secrets, keys, ports and some initiating context should 
be read into server context from deployment environment.  You should set up .env file in the project root folder, and
define following variables:
```
HTTP_PORT = 5000
HTTPS_PORT = 5443
HTTP_ENABLED = 'disabled'
HTTPS_ENABLED = 'enabled'
JWT_SECRET_KEY = '...'
TOKEN_HEADER_KEY = 'authorization'
WINSTON_LOG_LEVEL = 'info'


USER_NAME = 'admin'
PASSWORD = '2024Sam12'
```

The HTTP_PORT and HTTPS_PORT define the API server serving ports. 
HTTP_ENABLED and HTTPS_ENABLED define the server protocol could be enabled. **Remind** Do not make both disabled, that would be disaster if you do not want to make it work.
JWT_SECRET_KEY is the generated private key,  you could use this [tool](https://jwtsecret.com/generate) to make one, and then
store it here. 
Just leave TOKEN_HEADER_KEY as default. 
WINSTON_LOG_LEVEL controls the logger level, as usually applied `info`, `warn`, `debug`, `error` levels are all included. Details about level setting could be applied as [winston reference](https://www.npmjs.com/package/winston/v/2.4.6).
As the web needs to sign in, so following the username and password and leave them untouched as default.

### Generate the HTTPS key
As all API interfaces are addressed with token, according to the recommendation from OWASP hijack attack, HTTPS is recommended
as the service protocol. We recommend use OpenSSL to generate the key and certificate file.
Apply following command in console or shell:
`openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:4096 -keyout rootCA.key -out rootCA.pem` and answer some interactive
question to get a self signed certificate for the project.
You will find rootCA.key and rootCA.pem generated in the command running folder. Please copy them to the project root folder
with the name unchanged.

### Project Root Source and Launch
After the above steps applied, the server is ready to run. The running project root source should look like this:
```
\build
\backend
server.js
rootCA.key
rootCA.pem
package.json
```
Please do not forget to build your own **.env** with the instruction above. Then use `npm i` to install all dependencies
as required automatically. Then apply `node .\server.js` to start the server.

### Logging

AS the server is started, two logging files will be created in the root - app_logging.log and app-error.log. Keep a track 
on the logging to see if some warns and errors. The file volume capacity management is under the control of Winston default.

### Funny interface

Since the server is keep running. In order to get the status(liveness) of the service, the liveness API interface has been added in. Its addressing format is like below(use https as example, http just change the protocol and port):
```
Request url: https://xxx.xxx.xxx.xxx:5443/liveness
Request method: Get
Response format: JSON
Response content template:
{"status":"alive","uptime":{"milliseconds":582856,"seconds":582,"minutes":9,"hours":0}}
```
The uptime will change according to the addressing time dynamically.


