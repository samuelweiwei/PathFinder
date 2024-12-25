let serverStartTime = null;
module.exports = {
    setServerStartTime(time) {
        serverStartTime = time;
    },
    getServerStartTime() {
        return serverStartTime;
    },
};