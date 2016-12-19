angular.module('modules.moment', ['angularMoment']);
angular.module('modules.moment').

run(function (moment) {
    // configure moment display strings
    moment.locale('en', {
        relativeTime : {
            future : 'in %s',
            past   : '%s ago',
            s      : '%d seconds',
            m      : 'a minute',
            mm     : '%d minutes',
            h      : 'an hour',
            hh     : '%d hours',
            d      : 'a day',
            dd     : '%d days',
            M      : 'a month',
            MM     : '%d months',
            y      : 'a year',
            yy     : '%d years'
        }
    });
});
