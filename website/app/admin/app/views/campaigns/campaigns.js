angular.module('views.campaigns', [
    'modules.search'
]);
angular.module('views.campaigns').

config(function ($stateProvider) {
    $stateProvider.state('app.campaigns', {
        url: "/campaigns?criteria&sort&order",
        templateUrl: "app/views/campaigns/campaigns.html",
        controller: 'CampaignsViewCtrl'
    });
}).

controller('CampaignsViewCtrl', function ($scope, $http, $stateParams, SearchService, HttpService, $mdDialog, $mdToast, EntityService, HttpQuery, CoreModalService, $timeout) {
    var vm = this;

    // Main query object
    $scope.campaignQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type : 'campaign',
            size: 20,
            sort: 'date',
            order: 'dsc',
            'select[]': ['*', 'owner'],
            populate: false
        },
        onSuccess: function(results){
            // Map each of the ref-signups to the {type:'user', id:XXXX} form
            _.forEach(results, function(result){
                result.ref.signups = _.map(result.ref.signups, function(item){
                    return {type: 'user', id  : item.user}
                })
            })
            return results
        },
        columns: [{
                status: true,
                sort: false,
                name: 'User',
                model: 'owner',
                width: '40px',
                template: `
                    <core-entity-picture entity-type="user" entity-id="{{item.owner}}"></core-entity-picture>
                `,
            },{
                status: true,
                name: 'Date',
                model: 'date',
                width: '80px',
                class: 'hide-xs',
                template: `
                    <span ng-class="{'bold':item.edited}">
                        {{item.date | amDateFormat:'DD/MM/YYYY'}}
                    </span>
                `,
            },{
                status: true,
                name: 'Ref Code',
                model: 'ref.ref',
                class: 'hide show-gt-md',
                width: '80px',
                template: `
                    {{item.ref.ref}}
                `
            },{
                status: true,
                name: 'Channel',
                model: 'channel',
                class: 'hide-xs',
                width: '120px',
            },{
                status: true,
                name: 'Page',
                model: 'page',
                width: '200px',
                template: `
                    {{item.page | words : 6}}
                `,
            },{
                status: true,
                name: 'Content',
                model: 'content',
                class: 'hide show-gt-lg',
                template: `
                    {{item.content | words : 10}}
                `,
            },{
                status: true,
                name: 'Url',
                model: 'url',
                width: '200px',
                class: 'hide show-gt-lg',
                template: `
                    <a ng-href="{{item.url}}" target="_blank">
                        {{item.url | stripHttp | letters: 15}}
                    </a>
                `,
            },{
                status: true,
                name: 'Clicks',
                model: 'numHits',
                width: '100px',
                template: `
                    {{item.ref.numHits || '0'}}
                `,
            },{
                status: true,
                name: 'Signups',
                model: 'numSignups',
                width: '100px',
                template: `
                    <a click-show-entities="item.ref.signups">{{item.ref.signups.length || '0'}}</a>
                `,
            }, {
                status: true,
                name: 'Actions',
                model: 'temp',
                width: '80px',
                template: `<entity-row-actions entity="item" query="query"></entity-row-actions>`,
            }
        ],
        filters: {
            columnOrder: {}
        }
    });

    $scope.typeFilter = SearchService.newFilter({
        title   : 'Campaign Type',
        model   : 'criteria.channel',
        options : [
            {
                model : '/linkedin/i',
                name  : 'LinkedIn'
            },{
                model : '/email/i',
                name  : 'Email'
            },{
                model : 'Twitter',
                name  : 'Twitter'
            },{
                model : '/facebook/i',
                name  : 'Facebook'
            },{
                model : 'Private Message',
                name  : 'Private Message'
            },{
                model : 'Reddit',
                name  : 'Reddit'
            },{
                model : 'University Job Board',
                name  : 'University Job Board'
            },{
                model : 'Facebook Ad',
                name  : 'Facebook Ad'
            }
        ],
        query : $scope.campaignQuery
    });

    $scope.ownerFilter = SearchService.newFilter({
        title   : 'User Type',
        model   : 'criteria.owner',
        options : [
            {
                model : '5498e258a7fbbfcc12c3fa15',
                name  : 'Jackson'
            },{
                model : '55c0cb75dca1a7e5444c13f7',
                name  : 'Denzil'
            },{
                model : '5496bdb8104ad2c800020602',
                name  : 'Jack'
            },{
                model : '547db55af7f342380174e228',
                name  : 'David'
            },{
                model : '565f9406ca3491aff9b9ad4a',
                name  : 'Anthony Tan'
            },{
                model : '55e92c8142be6dba0b4c05e9',
                name  : 'Toy'
            },{
                model : '56cfd32276dbc2072fc17a09',
                name  : 'Email Templater'
            },{
                model : '56e14e058c106e6711b76ed7',
                name  : 'Upwork'
            }
        ],
        query : $scope.campaignQuery
    });

    $scope.campaignQuery.more();

    // Scoped functions
	$scope.newCampaignModal = newCampaignModal; // function(event)
	$scope.multiDelete      = multiDelete; // function(event)
	$scope.multiClone       = multiClone; // function(event)
	$scope.multiEdit        = multiEdit; // function(event)


    // Search Filter -------------------------------
    $scope.searchFilter = SearchService.newFilter({
        type : 'search',
        query: $scope.campaignQuery,
        key  : 'ref',
        options: [{
            model : 'ref',
            name  : 'Ref'
        },{
            model : 'page',
            name  : 'Page'
        },{
            model : 'content',
            name  : 'Content'
        },{
            model : 'Channel',
            name  : 'Channel'
        }],
    });




	///////////////////////////////////////////////

    function multiDelete(selectedRows, queryResults){
        if (confirm('Are you sure you want to delete these?')) {
            _.forEach(selectedRows, function(id){
                EntityService.remove('campaign', id);
            })
            // Remove from results
            _.forEachRight(queryResults, function(result, index){
                // If the id should be removed
                if(selectedRows.indexOf(result._id) !== -1){
                    queryResults.splice(index, 1);
                }
            })
        }
    }

    function multiClone(selectedRows, queryResults){
        $mdDialog.show({
            templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
            controller: function($scope){
                $scope.campaign ={};
                $scope.modalTitle   = 'Clone Overwrites';
                $scope.confirmTitle = 'Clone';
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    $mdDialog.hide($scope.campaign);
                }
            },
            targetEvent: null,
            clickOutsideToClose: true,
        }).then(function(overwriteData){
            var refreshTimeout;
            _.forEach(selectedRows, function(id){
                var campaign = _.clone(_.find(queryResults, '_id', id));
                campaign = _.extend(campaign, overwriteData);
                delete campaign.ref;
                delete campaign.timestamp;
                delete campaign.date;
                EntityService.create('campaign', campaign).then(function(){
                    $timeout.cancel(refreshTimeout);
                    refreshTimeout = $timeout(function(){
                        EntityService.updateSuccess();
                        $scope.campaignQuery.refresh();
                    }, 500)
                });
            })
        })
    }

    function multiEdit(selectedRows, queryResults){
        $mdDialog.show({
            templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
            controller: function($scope){
                $scope.campaign ={};
                $scope.modalTitle   = 'Multi Edit Overwrites';
                $scope.confirmTitle = 'Save';
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.confirm = function () {
                    $mdDialog.hide($scope.campaign);
                }
            },
            targetEvent: null,
            clickOutsideToClose: true,
        }).then(function(overwriteData){
            var refreshTimeout;
            _.forEach(selectedRows, function(id){
                var campaign = _.clone(_.find(queryResults, '_id', id));
                campaign = _.extend(campaign, overwriteData);
                EntityService.update('campaign', campaign).then(function(){
                    $timeout.cancel(refreshTimeout);
                    refreshTimeout = $timeout(function(){
                        EntityService.updateSuccess();
                        $scope.campaignQuery.refresh();
                    }, 500)
                });
            })
        })
    }

	function newCampaignModal(event){
		$mdDialog.show({
			templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
			controller: function($scope){
				$scope.modalTitle   = 'New Campaign';
				$scope.confirmTitle = 'Create Campaign';

				$scope.campaign = {
					channel: '',
					page: '',
					url: '',
					content: '',
					date: Date.now(),
					edited: false
				}

				$scope.cancel = function () {
					$mdDialog.cancel();
				};
				$scope.confirm = function () {
                    EntityService.create('campaign', $scope.campaign).then(function(){
                        EntityService.updateSuccess();
                        $mdDialog.hide();
                    })
				}
			},
			targetEvent: event,
			clickOutsideToClose: true,
		}).then(function(){
			$scope.campaignQuery.refresh();
		})
	}

}).

directive('entityRowActions', function () {
    return {
        restrict: 'E',
        scope: {
            entity: '=',
            query:  '='
        },
        template: `
             <div layout="row">
                <md-button aria-label="edit" class="md-icon-button md-sm" ng-click="edit($event, entity)">
                    <ng-md-icon icon="edit"></ng-md-icon>
                </md-button>
                <md-button aria-label="clone" class="md-icon-button md-sm" ng-click="clone($event, entity)">
                    <ng-md-icon icon="content_copy"></ng-md-icon>
                </md-button>
                <md-button aria-label="delete" class="md-icon-button md-sm" ng-click="remove(entity._id)">
                    <ng-md-icon icon="close"></ng-md-icon>
                </md-button>
            </div>
        `,
        controller: function ($scope, HttpService, $mdDialog, $mdToast, EntityService) {
            $scope.remove   = remove;   // function(id)
            $scope.edit     = edit;     // function(event, data)
            $scope.clone    = clone;     // function(event, data)


            ////////////////////////////////////////

            function remove(id){
                if (confirm('Are you sure you want to delete this?')) {
                    EntityService.remove('campaign',id).then(function (response) {
                        EntityService.removeSuccess();
                        $scope.query.refresh();
                    })
                }
            }
            function edit(event, data){
                $mdDialog.show({
                    templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
                    controller: function(data, $scope){
                        $scope.campaign = data;
                        $scope.modalTitle   = 'Edit Campaign - Ref: '+ data.ref.ref;
                        $scope.confirmTitle = 'Save Campaign';

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.confirm = function () {
                            EntityService.update('campaign', $scope.campaign).then(function(){
                                EntityService.updateSuccess();
                                $mdDialog.hide();
                            })
                        }
                    },
                    locals: {data:data},
                    targetEvent: event,
                    clickOutsideToClose: true,
                }).then(function(){
                    $scope.query.refresh();
                })
            }

            function clone(event, data){
                $mdDialog.show({
                    templateUrl: 'app/views/campaigns/tpls/new-campaign-modal.html',
                    controller: function(data, $scope){
                        $scope.campaign = angular.copy(data);
                        delete $scope.campaign.ref;
                        delete $scope.campaign.timestamp;
                        delete $scope.campaign.date;
                        console.log($scope.campaign)
                        $scope.modalTitle   = 'Clone Campaign';
                        $scope.confirmTitle = 'Create Campaign';


                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.confirm = function () {
                            EntityService.create('campaign', $scope.campaign).then(function(){
                                EntityService.updateSuccess();
                                $mdDialog.hide();
                            })
                        }
                    },
                    locals: {data:data},
                    targetEvent: event,
                    clickOutsideToClose: true,
                }).then(function(){
                    $scope.query.refresh();
                })
            }
        }
    };
});
