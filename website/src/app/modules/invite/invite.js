angular.module('modules.invite', [

]);
angular.module('modules.invite').


directive('showInviteLinkModal', function ($mdDialog) {
    return {
        restrict: 'A',
        scope: {
            parent : '=',
            group  : '@?',
            role   : '@?',
            modalCallback : '&?'
        },
        link : function(scope, element, attrs){
            element.bind('click', function (event) {
                var data = {
                    parentId   : scope.parent._id,
                    parentType : scope.parent.type,
                    group      : scope.group,
                    role       : scope.role,
                }
                return $mdDialog.show({
                    template: require('./tpls/invite-link-modal.html'),
                    controller: function(data, $scope, InviteService, Authentication){
                        $scope.type = data.parentType;
                        InviteService.generateInviteCode({
                            parentId  :  data.parentId,
                            parentType:  data.parentType,
                        }).then(function(result){
                            $scope.url = 'https://stemn.com?invitecode='+result.data._id;
                            if(data.group){
                                $scope.url = $scope.url +'&invitegroup='+data.group;
                            }
                            if(data.role){
                                $scope.url = $scope.url +'&inviterole='+data.role;
                            }
                            if(Authentication.currentUser.ref){
                                $scope.url = $scope.url +'&ref='+Authentication.currentUser.ref;
                            }
                        })
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                    },
                    locals: {data: data},
                    clickOutsideToClose: true,
                    targetEvent: event,
                }).then(scope.modalCallback).catch(scope.modalCallback)
            });
        }
    }
}).


service('InviteService', function($rootScope, $stateParams, $state, $location, $localStorage, $http, $mdToast, Authentication, AuthenticationModalService){
    var service = this;
    this.setInviteCode      = setInviteCode;     //function()
    this.getInviteCode      = getInviteCode;     //function()
    this.sendInviteCode     = sendInviteCode;    //function()
    this.generateInviteCode = generateInviteCode //function({parentId, parentType})

    $rootScope.$on('authentication.logIn', function(){
        // Send invite code on login.
        service.sendInviteCode();
    });

    ////////////////////////////////////////////////

    function setInviteCode(){
        $state.current.reloadOnSearch = false;
        $location.search('invitecode' , null);
        $location.search('inviterole' , null);
        $location.search('invitegroup', null);
        if($stateParams.invitecode){
            // TODO - remove this when toy is done
            $stateParams.invitecode = removeRef($stateParams.invitecode);
			// Set to memory
            $localStorage.inviteCode  = $stateParams.invitecode;
            $localStorage.inviteRole  = decodeURIComponent($stateParams.inviterole);
            $localStorage.inviteGroup = decodeURIComponent($stateParams.invitegroup);
            if(Authentication.currentUser.isLoggedIn()){
                service.sendInviteCode();
            }
            else{
                $mdToast.show({
					controller: function($scope, $mdToast){
						$scope.closeToast = function() {
							$mdToast.hide();
                            AuthenticationModalService.login(event);
						};
					},
					template:
					'<md-toast>'+
						'<span flex>You\'ve been invited to a project. <b>{{result.name}}</b></span>'+
						'<md-button ng-click="closeToast()">'+
							'Click here to join'+
						'</md-button>'+
					'</md-toast>',
					hideDelay: 15000,
				});
            }
		}
    }

    function getInviteCode(){
        var invite = {
            inviteCode  : $localStorage.inviteCode,
            inviteRole  : $localStorage.inviteRole,
            inviteGroup : $localStorage.inviteGroup
        }
		return invite
	}

    function sendInviteCode(){
        if(service.getInviteCode()){
            $http({
                url: '/api/v1/invite/accept',
                method: "GET",
                params: {
                    inviteId: service.getInviteCode().inviteCode,
                    role    : service.getInviteCode().inviteRole,
                    group   : service.getInviteCode().inviteGroup,
                }
             }).success(function(result){
                $mdToast.show({
					controller: function($scope, $mdToast, CoreLibrary){
                        $scope.sref       = CoreLibrary.getSref(result.type, result.stub)
						$scope.closeToast = function() {
							$mdToast.hide();
						};
						$scope.result = result;
					},
					template:
					'<md-toast>'+
						'<span flex>You\'ve been invited to the {{result.type}}: <b>{{result.name}}</b></span>'+
						'<md-button ui-sref="{{sref}}" ng-click="closeToast()">'+
							'View {{result.type}}'+
						'</md-button>'+
					'</md-toast>',
					hideDelay: 15000,
				});
                delete $localStorage.inviteCode  // remove code from localstorage
                delete $localStorage.inviteRole  // remove code from localstorage
                delete $localStorage.inviteGroup // remove code from localstorage
            }).catch(function(){
                delete $localStorage.inviteCode  // remove code from localstorage
                delete $localStorage.inviteRole  // remove code from localstorage
                delete $localStorage.inviteGroup // remove code from localstorage
            })
        }
    }

    function generateInviteCode(data){
        if(data.parentId && data.parentType){
            return $http({
                url: '/api/v1/invite',
                method: "GET",
                params: {
                    parentType : data.parentType,
                    parentId   : data.parentId
                }
            })
        }
    }

    function removeRef(param){
        // TODO - remove this when toy is done
        return param.split('?ref')[0]
    }
});

