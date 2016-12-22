import './cards.scss';

angular.module('modules.cards', [
]);
angular.module('modules.cards').

directive('card', function () {
    return {
        restrict: 'E',
        scope: {
            cardType : '@',
            cardId   : '@'
        },
        template: '<div compile="template"></div>',
        controller: function ($scope) {
            var templates = {
                project      : '<creation-card      entity-type="project" entity-id="'+$scope.cardId+'"></creation-card>',
                organisation : '<organisation-card  size="sm" id="'+$scope.cardId+'"></organisation-card>',
                user         : '<personcard         size="sm" id="'+$scope.cardId+'"></personcard>',
                field        : '<field-card         size="sm" id="'+$scope.cardId+'"></organisation-card>',
            }
            $scope.template =  templates[$scope.cardType];
        }
    };
}).

directive('creationCard', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entityId   : '@?',
            entity     : '=?',
            entityType : '@?',
            size       : '@?' // small
        },
        template: require('./tpls/creation-card.html'),
        controller: function ($scope, $rootScope, FeedService, CoreLibrary) {
            $scope.env = $rootScope.env;
            if ($scope.entityId && $scope.entityType) {
                // Initiate Loading class
                $scope.loading = true;
                FeedService.getFeedItem({
                    _id  : $scope.entityId,
                    type : $scope.entityType
                }).then(function (response) {
                    $scope.entity = response;
                    $scope.loading = false;
                    initialise();
                });
            }
            else{
                initialise();
            }

            ////////////////////
            function initialise(){
                // Get Team
                $scope.team = $scope.entity.team || [$scope.entity.owner];

                // Get Picture
                $scope.picture = getPicture($scope.entity)

                // Get Url
                $scope.url = CoreLibrary.getHref($scope.entity.type, $scope.entity.stub);
            }


            function getPicture(entity){
                if(!entity.picture){
                    var field = _.find(entity.fields, 'picture');
                    if(field){
                        return field.picture;
                    }
                }
                else{
                    return entity.picture
                }
            }
        }
    };
}).

directive('organisationCard', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            id   : '@?',
            entity : '=?',
            size : '@?'
        },
        template: require('./tpls/organisation-card.html'),
        controller: function ($scope, Authentication, OrganisationService) {
            if ($scope.id) {
                // Initiate Loading class
                $scope.loading = true;
                OrganisationService.getOrganisation($scope.id).then(function (organisation) {
                    $scope.entity = organisation;
                    // Set loading to false when user has loaded
                    $scope.loading = false
                });
            }
        }
    };
});
