var Platform = require('./block_platform');

var BoostPlatform = function () {
    var platform = new Platform('#995c00');
    platform.grav = 0.3;
    platform.jumpV = -2;
    return platform;
};

module.exports = BoostPlatform;

