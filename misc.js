const logger = require("./logger");

const { validationResult } = require('express-validator');

exports.MISC_validation=function(req) {
    var i;

    const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return `Error: ${msg} for ${param}`;
    };

    var errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        var errorstr = "";
        for (i = 0; i < errors.array().length; i++) {
            errorstr += errors.array()[i];
            if (i < errors.array().length - 1) {
                errorstr += ", ";
            }

        }
        logger.error("Error in validation: %s", errorstr);
        req.flash('danger', errorstr);
        return(false);
    }
    return(true);
};

exports.MISC_checkOrigin=function(host)  {
    if (host.includes("atheios")) {
        return "ATH";
    }
    if (host.includes("localhost")) {
        return "ETHO";
    }
    if (host.includes("ether1")) {
        return "ETHO";
    }

}


// Generates 5 tuples of type length
// XXXXX-XXXXX-XXXXX ...
exports.MISC_maketoken = function(length) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i=0;i<length;i++) {
        for (var j = 0; j < 5; j++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        text += "-";
    }
    text = text.substring(0, text.length - 1);
    return text;
}

exports.MISC_makeid = function(length) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.MISC_numberFormating = function (n) {

    n=String(n).replace(/(.)(?=(\d{3})+$)/g,'$1,')
    return(n);
}

exports.MISC_ASSETCATEGORY=["Action", "Adventure & RPG", "Fighting", "Multiplayer", "Music", "Other", "Puzzle", "Shooting", "Sports & Racing", "Strategy & Defence", "Template"];
const MISC_GAMECAT_ACTION=1;
const MISC_GAMECAT_ADVENTURERPG=2;
const MISC_GAMECAT_FIGHTING=4;
const MISC_GAMECAT_MULTIPLAYER=8;
const MISC_GAMECAT_MUSIC=16;
const MISC_GAMECAT_OTHER=32;
const MISC_GAMECAT_PUZZLE=64;
const MISC_GAMECAT_SHOOTING=128;
const MISC_GAMECAT_SPORTSRACING=256;
const MISC_GAMECAT_STRATEGYDEFENCE=512;
const MISC_GAMECAT_TEMPLATE=1024;
