var Platform = require('./block_platform');

var FragilePlatform = function () {
    var platform = new Platform('#009999');
    platform.update = function () {
        if (platform.t > 0){
            platform.t -= 1;
        }
        if (platform.t >= 0) {
            platform.c = '#00' +
                (3 * platform.t + 9) +
                (3 * platform.t + 9);
        }
    };
    return platform;
};

module.exports = FragilePlatform;
