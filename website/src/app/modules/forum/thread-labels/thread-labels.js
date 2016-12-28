import './thread-labels.scss';

angular.module('modules.thread.labels', [
]);
angular.module('modules.thread.labels').

service('ThreadLabelService', function () {
    var service = this;

    this.labels = [{
        model: 'question',
        label: 'Question',
        color: 'rgb(255, 65, 54)',
        textColor: 'white',
        bgColor: 'rgba(255, 65, 54, 0.1)'
    },{
        model: 'discussion',
        label: 'Discussion',
        color: 'rgb(0, 116, 217)',
        textColor: 'white',
        bgColor: 'rgba(0, 116, 217, 0.1)',
    },{
        model: 'help',
        label: 'Help Wanted',
        color: 'rgb(57, 204, 204)',
        textColor: 'white',
        bgColor:'rgba(57, 204, 204, 0.1)',
    },{
        model: 'blog',
        label: 'Blog/Update',
        color: 'rgb(255, 133, 27)',
        textColor: 'white',
        bgColor: 'rgba(255, 133, 27, 0.1)',
    },{
        model: 'bug',
        label: 'Bug',
        color: 'rgb(141, 198, 63)',
        textColor: 'white',
        bgColor: 'rgba(141, 198, 63, 0.1)',
    }];

    this.getInfo = getInfo;

    //////////////////////////////////////

    function getInfo(type){
        return _.find(service.labels, 'model', type);
    }


}).

directive('labelStyle', function (ThreadLabelService) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var labelInfo = ThreadLabelService.getInfo(attrs.labelStyle);
            if(labelInfo){
                element.css({
                    'background-color': labelInfo.color,
                    'color'           : labelInfo.textColor,
                })
            }
        }
    };
});
