
const logger = require('../global/logger');
const globals = require('../global/globals')
//liveness interface for server
exports.liveness = async (req, res, next)=>{
    const currentTime = Date.now();
    const uptime = currentTime - globals.getServerStartTime(); // Uptime in milliseconds

    // Convert uptime to a more readable format (seconds, minutes, etc.)
    const uptimeSeconds = Math.floor(uptime / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);
    logger.info("Liveness probe attached once...........");
    return res.status(200).send({
        status: 'alive',
        uptime: {
            milliseconds: uptime,
            seconds: uptimeSeconds,
            minutes: uptimeMinutes,
            hours: uptimeHours,
        },
    });
}