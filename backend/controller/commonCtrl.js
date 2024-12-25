const logger = require('../global/logger')
exports.pageNotFound = (req, res, next) => {
    logger.info('Page not found, status code 404');
    const msg = 'Page Not Found';
    return res.status(404).send({result:'failed', msg:msg});
};
