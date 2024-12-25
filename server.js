const express = require('express');
var https = require('https')
var http = require('http')
const dotenv = require('dotenv');
const path = require('path');
const authJWT = require('./backend/middleware/authJWT');
const graphCtrl = require('./backend/controller/graphCtrl');
const jwtCtrl = require('./backend/controller/authJWTCtrl')
const commonCtrl = require('./backend/controller/commonCtrl');
const livenessCtrl = require('./backend/controller/livenessCtrl');
const globals = require('./backend/global/globals');
const logger = require('./backend/global/logger');
const cors = require('cors');
var fs = require('fs');

//Initialization
const app = express();
dotenv.config();
app.use(cors());
//server starter
const httpPort = process.env.HTTP_PORT || 5000;
const httpsPort = process.env.HTTPS_PORT || 5443;
const httpEnabled = process.env.HTTP_ENABLED || 'disabled';
const httpsEnabled = process.env.HTTPS_ENABLED || 'enabled';
var options = {
    key: fs.readFileSync('./rootCA.key'),
    cert: fs.readFileSync('./rootCA.pem')
  };
if (httpEnabled.toLowerCase() === 'enabled') {
    http.createServer(app).listen(httpPort);
    console.log('Http server started............');
    logger.info('Http is starting......');
}
if (httpsEnabled.toLowerCase() === 'enabled'){
    https.createServer(options, app).listen(httpsPort);
    console.log('Https server started........');
    logger.info('Https is starting......');
}

globals.setServerStartTime(Date.now());
//router starter, integrate react, not separate controller
app.use(express.static('build'));
app.get('/', (req, rsp, next)=>{
    rsp.sendFile(path.resolve(__dirname, './build/index.html'));
})

//seperate controllers
app.get('/routeswithmaxstops', authJWT.verifyToken, graphCtrl.routesWithMaxStops);

app.get('/routeswithfixedstops', authJWT.verifyToken, graphCtrl.routesWithFixedStops);

app.get('/routeswithmaxdist', authJWT.verifyToken, graphCtrl.routesWithMaxDist);

app.get('/shortestpath', authJWT.verifyToken, graphCtrl.shortestPath);

app.get('/distances', authJWT.verifyToken, graphCtrl.distances);

app.get('/generateToken', authJWT.verifyToken, authJWT.generateToken, jwtCtrl.generateToken);

app.get('/login', authJWT.login);

app.get("/liveness", livenessCtrl.liveness);

app.use(commonCtrl.pageNotFound);
