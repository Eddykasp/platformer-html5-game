var Platform = require('./block_platform');

var SandPlatform = function () {
    var platform = new Platform('#999900');
    platform.grav = 0.9;
    platform.jumpV = -2;
    return platform;
};

module.exports = SandPlatform;
