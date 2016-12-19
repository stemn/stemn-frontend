angular.module('modules.users', [
    'modules.compile'
]);

angular.module('modules.users').

directive('userRow', function () {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			entityId: '@?',
			text: '@?', // Small text for display
		},
		templateUrl: 'app/modules/users/tpls/user-row.html',
		controller: function ($scope, Authentication, EntityService) {
			EntityService.get('user', $scope.entityId).then(function (user) {
				$scope.user = user;
			});
		}
	};
}).

directive('userCrm', function () {
	return {
		restrict: 'E',
		scope: {
            entity: '=?',
			data: '=',
            saveFn: '&'
		},
		templateUrl: 'app/modules/users/tpls/user-crm.html',
		controller: function ($scope, $mdDialog, EmailService, $mdToast, Authentication) {
            // Init the adminData and CRM
            $scope.data = $scope.data || [];

            if($scope.data[0] && $scope.data[0].date){
                $scope.data[0].date = new Date($scope.data[0].date)
            }


            $scope.remove    = remove;  // function(index)
            $scope.newItem   = newItem; // function()
            $scope.edit      = edit;    // function(event, item)
            $scope.sendEmail = sendEmail;    // function(emailType)

            /////////////////

            function remove(index){
                $scope.data.splice(index,1);
                $scope.saveFn();
            }
            function newItem(event){
                $scope.data.push({
                    date: Date.now(),
                    contactedBy: Authentication.userData.name
                });
                edit(event, $scope.data[$scope.data.length-1])

            }

            function sendEmail(event){
                var composedEmail;
                EmailService.composeEmail(event, {
                    recipient : $scope.entity
                }).then(function(email){
                    composedEmail = email;
                    EmailService.sendEmail(email).then(function(){
                        $mdToast.show($mdToast.simple().content('Email successfully sent'));
                        $scope.data.push({
                            date: Date.now(),
                            contactedBy: Authentication.userData.name,
                            notes: 'Email Sent: ' + composedEmail.message.type
                        });
                        $scope.saveFn();
                    });
                })
            }

            function edit(event, item){
                $mdDialog.show({
                    templateUrl: 'app/modules/users/tpls/user-crm-modal.html',
                    controller: function ($scope) {
                        $scope.item = item;
                        $scope.item.date = new Date($scope.item.date);

                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.save = function () {
                            $mdDialog.hide();
                        };
                    },
                    targetEvent: event,
                    clickOutsideToClose: true,
                }).then(function(){
                    $scope.saveFn();
                })
            }
		}
	};
}).

directive('displayUsersModal', function ($mdDialog, UserModalService) {
	return {
		restrict: 'A',
		scope: {
			displayUsersModal:'='
		},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				if(scope.displayUsersModal.length>0){
					UserModalService.showUserModal(event, scope.displayUsersModal);
				}
			});
		}
	};
}).

directive('displayUserLogModal', function ($mdDialog) {
	return {
		restrict: 'A',
		scope: {
			displayUserLogModal:'=' // user id
		},
		link: function (scope, element, attrs) {
			element.bind("click", function (event) {
				showModal(event, scope.displayUserLogModal)
			});

			function showModal(event, data) {
				$mdDialog.show({
					templateUrl: 'app/modules/users/tpls/user-log-modal.html',
					controller: function (data, $scope, LogService) {
                        var page = 1;
                        $scope.logs = [];
						$scope.getLogs = getLogs;
                        $scope.getLogs(); // Initialise

						$scope.cancel = $mdDialog.cancel; // function()

                        /////////////////////////////////


                        function getLogs(){
                            if(!scope.noMoreResults){
                                $scope.loading = true;
                                LogService.getLogs({
                                    fields : {
                                        requestUser : data,
                                        event : { $nin : ['get-notifications', 'feed-all', 'search'] }
                                    },
                                    exists : {
                                        event : true
                                    },
                                    select : 'parentType parentId entityType entityId event requestUser',
                                    page : page,
                                    size : 10
                                }).then(function(logs) {
                                    if (logs.length === 0){scope.noMoreResults = true;}
                                    $scope.logs = $scope.logs.concat(logs);
                                    $scope.loading = false;
                                    page++;
                                });
                            }
                        }
					},
					targetEvent: event,
					clickOutsideToClose: true,
					locals:{data:data}
				})
			}
		}
	};
}).

service('UserModalService', function($mdDialog) {
    this.showUserModal = showUserModal;

    ///////////////////////////////////////////

    function showUserModal(event, data) {
        $mdDialog.show({
            templateUrl: 'app/modules/users/tpls/users-modal.html',
            controller: function (data, $scope) {
                console.log(data);
                $scope.users = data;
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
            },
            targetEvent: event,
            clickOutsideToClose: true,
            locals:{data:data}
        })
    }

});
