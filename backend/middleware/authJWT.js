const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const logger = require('../global/logger');

//Build global configuration access
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const headerKey = process.env.TOKEN_HEADER_KEY;

exports.login = async (req, res, next)=>{
    const usrname = req.query.username;
    const pwd = req.query.password;
    if ((!usrname) || (!pwd)){
        return res.status(400).send({result:"failed", msg:"Empty usrname or password"});
    }
    if (! usrname === process.env.USER_NAME){
        return res.status(400).send({result:"failed", msg:"User does not exists"});
    }
    if (! pwd === process.env.PASSWORD){
        return res.status(400).send({result:"failed", msg:"Wrong password"});
    }
    try{
        if ((usrname === process.env.USER_NAME) && (pwd === process.env.PASSWORD)){
            logger.info("Successfully login and go to token generation......");
            const token = await generateJWTToken();
            if (token) {
                return res.status(200).send({result: 'succeeded', msg: token}); 
            }
            return  res.status(400).send({result:'failed', msg:'Failed to create JWT key'}); 
        }
        return res.status(400).send({result:"failed", msg:"Authentication failed, not right username and password"});
    }catch(error){
        logger.error(error);
        return res.status(403).send({result:'failed', msg:'Authentication failed with error'});
    }
    
}

//Check the jwt token
function checkToken(token){
    return new Promise((resolve, reject)=>{
        jwt.verify(token, jwtSecretKey, (error, user)=>{
            if (error) {
                logger.error(error)
                reject(error);
            }
            resolve(user);
        })
    })
}

//Authenticate the validity and content of the token
exports.verifyToken = async (req, res, next)=>{
    const authToken = req.headers[headerKey];
    if (!authToken){
        logger.error(`No auth token`);
        return res.status(403).send({result:'failed', msg:'unthorized, auth jwt not passed'});
    }
    try{
        req.user = await checkToken(authToken);
        next();
    }catch(error){
        logger.error(error);
        return res.status(403).send({result:'failed', msg:'unthorized, auth jwt not passed'});
    }
}
//Get the token from request user parameter
exports.generateToken = async (req, res, next)=>{
    try{
        req.user = await generateJWTToken();
        next();
    }catch(error){
        logger.error(error)
        return res.status(401).send({result:'failed', msg:'Generate jwt token failed'});
    } 
}
//Generate the token from fixed content
function generateJWTToken(){
    let payload = {
        time: Date(),
        useId: '13014592',
        userName: 'Bob'
    }
    return new Promise((resolve, reject)=>{
        setTimeout(() => {
            try{
                const token = jwt.sign(payload, jwtSecretKey);
                resolve(token);
            }catch(error){
                logger.error(error);
                reject(error);
            }
        }, 100);
    })
}