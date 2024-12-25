//Get the token from request body user parameter
const logger = require('../global/logger');
exports.generateToken = (req, res, next)=>{
    if (req.user){
        const key = req.user;
        logger.info(`Request user body is available`);
        return res.status(200).send({result: 'succeeded', msg: key});     
    }
    return  res.status(400).send({result:'failed', msg:'Failed to create JWT key'}); 
}
