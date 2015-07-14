'use strict';

var balanced = require('balanced-match');
var list = require('css-list');
var re = /([\d\w]{1})([\+\-])(\d{1})/g;

function t( re, str ) {
    if( str.match(re) ) {
        return t(re, str.replace(re, '$1 $2 $3'));
    } else {
        return str.replace(re, '$1 $2 $3');
    }
}

module.exports = function eachValue (value, callback) {
    return list.map(value, function (value, type) {
        var name,
            match,
            index;

        if (type === null) {
            return callback(value);
        }

        if (type === 'func') {
            value = t(re, value);

            index = value.indexOf('(');
            name = value.substring(0, index);
            if (~name.indexOf('calc')) {
                match = balanced('(', ')', value);
                if (match) {
                    return name + '(' + eachValue(match.body, callback) + ')';
                }
            }
        }
    });
};
