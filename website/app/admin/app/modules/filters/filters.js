angular.module('modules.filters', []);
angular.module('modules.filters').

filter('capitaliseFirst', function () {
    return function (str) {
        str = str || '';
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    };
}).

filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
}).

filter('bytes', function() {
	return function(bytes, precision) {
		if (bytes===0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
}).

filter('words', function () {
    // From the Ment.io Package
    return function (input, words) {
        if (isNaN(words)) {
            return input;
        }
        if (words <= 0) {
            return '';
        }
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '\u2026';
            }
        }
        return input;
    };
}).

filter('letters', function () {
    // From the Ment.io Package
    return function (input, letters) {
        if (isNaN(letters)) {
            return input;
        }
        if (letters <= 0) {
            return '';
        }
        if (input) {
            if (input.length > letters) {
                input = input.slice(0, letters) + '\u2026';
            }
        }
        return input;
    };
}).

filter('orderObjectBy', function(){
 // http://stackoverflow.com/questions/
 // 14478106/angularjs-sorting-by-property
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
}).

filter('hasValue', function () {
    return function (str) {
        if (str === null) {
            return false;
        } else if (str === "") {
            return false;
        } else {
            return true;
        }
    };
}).

filter('firstWord', function () {
    return function (str) {
        str = str.split(' ')[0];
        return str
    };
}).

filter('lastWord', function () {
    return function (str) {
        str = str.split(' ').pop();
        return str
    };
}).

// deep inspection via recursion
filter('isEmptyObject', function ($filter) {
    return function (object) {
        return _.every(object, function (value, key) {
            if (_.isArray(value)) {
                return _.every(value, $filter('isEmptyObject'));
            } else {
                if (key === '$$hashKey') { // fix for angular adding trackby internal reference
                    return true;
                } else {
                    return _.isEmpty(value);
                }
            }
        });
    };
}).

filter('consolelog', function () {
    return function (message) {
        console.log(message);
    };
}).

filter('trueValues', function () {
    return function (object) {
        var result = [];
        _.each(object, function (value, key) {
            if (value === true) {
                var obj = {};
                obj[key] = value;
                result.push(obj);
            }
        });
        return result;
    };
}).

filter('values', function () {
    return function (object) {
        var result = [];
        _.each(object, function (value, key) {
            var obj = {};
            obj[key] = value;
            result.push(obj);
        });
        return result;
    };
}).

filter('toJSON', function () {
    return function (object) {
        return JSON.stringify(object, null, 4);
    };
}).

filter('stripHttp', function () {
    return function (object) {
        return object.toString().replace('http://', '').replace('https://', '').replace('www.', '').replace('http://www.', '').replace('https://www.', '');
    };
}).

filter('typeaheadHighlightMatch', function () {

    function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function (matchItem, query) {
        return query ? ('' + matchItem).replace(new RegExp('\\b' + escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
});
