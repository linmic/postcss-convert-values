'use strict';

var postcss = require('postcss');
var convert = require('./lib/convert');
var eachValue = require('./lib/eachValue');

// From longer to shorter!
var units = [
    'vmin',
    'vmax',
    'rem',
    'em',
    'ex',
    'vw',
    'vh',
    'vm',
    'ch',
    'in',
    'cm',
    'mm',
    'pt',
    'pc',
    'px',
    'ms',
    's',
    '%'
];

module.exports = postcss.plugin('postcss-convert-values', function () {
    return function (css) {
        css.eachDecl(function (decl) {
            if (~decl.prop.indexOf('flex')) {
                return;
            }
            decl.value = eachValue(decl.value, function (value) {
                var number,
                    unit,
                    splits = value.split(/[*\/]+/),
                    unitCount = 0;

                if ( !isNaN(number = parseFloat(value)) ) {
                    for( var i = 0; i < splits.length; i += 1 ) {
                        var unitCandidate = splits[i].replace(/[\d\s]/g, '');

                        if ( !~units.indexOf( unitCandidate ) && ( unitCount === 0 ) ) {
                            unitCount += 1;
                            unit = units[ units.indexOf( unitCandidate ) ];
                        } else {
                            // return the original value if the format is invalid
                            return value;
                        }
                    }

                    number = value.replace(/[\D\s]/g, '');

                    if ( number === 0 ) {
                        value = (unit === 'ms' || unit === 's') ? 0 + unit : 0;
                    } else {
                        value = convert( number, unit );
                    }

                    return value;
                }
            });
        });
    };
});
