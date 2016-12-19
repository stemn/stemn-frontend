angular.module('modules.reading-time', [
]);
angular.module('modules.reading-time').

directive('readingTime', function () {
    /**********************************************
    This will output the amount of time to read
    something based on the number of words.

    [words] : number - the number of words
    **********************************************/
    return {
        restrict: 'E',
        replace: true,
        template: '<span>{{readingTime}}</span>',
        link: function(scope, element, attrs){
            var wordsPerMin = 250;
            var time = Math.floor(parseInt(attrs.words)/wordsPerMin);
            if(time < 1){
                scope.readingTime = '1 min read';
            }
            else{
                scope.readingTime = time + ' min read';
            }
        }
    };
});
