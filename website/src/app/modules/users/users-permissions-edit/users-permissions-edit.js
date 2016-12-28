import './users-permissions-edit.scss';
angular.module('modules.users.permissions-edit', [
]);

angular.module('modules.users.permissions-edit').


directive('usersPermissionsEdit', function ($mdDialog, $timeout) {
    return {
        restrict: 'E',
        scope: {
            users: '=',
            saveFn: '&?',
            userPermissions: '=?',
            parent: '=?',
            type: '@?' // project || organisation
        },
        template: require('./tpls/users-permissions-edit.html'),
        controller: function($scope, Authentication) {

            var permissions;
            if($scope.type == 'organisation'){
                permissions = {
                    admin : {
                        value: 'admin',
                        title: 'Administrator',
                        icon: 'settings',
                        description : 'Administrator: Can do everything',
                        descriptionDetailed : 'Can add/remove users. Can change all settings.'
                    },
                    collaborator : {
                        value: 'collaborator',
                        title: 'Collaborator',
                        icon: 'edit',
                        description : 'Collaborator: Can view and edit',
                        descriptionDetailed : 'Can edit images and text. Can\'t invite or change major settings.'
                    }
                }
            }
            else{
                permissions = {
                    admin : {
                        value: 'admin',
                        title: 'Administrator',
                        icon: 'settings',
                        description : 'Administrator: Can do everything',
                        descriptionDetailed : 'Can add/remove users. Can change settings.'
                    },
                    collaborator : {
                        value: 'collaborator',
                        title: 'Collaborator',
                        icon: 'edit',
                        description : 'Collaborator: Can view and edit',
                        descriptionDetailed : 'Can sync all files. Can view all revisions.'
                    },
                    viewer : {
                        value: 'viewer',
                        title: 'Viewer',
                        icon: 'visibility',
                        description : 'Viewer: Can view but can\'t edit',
                        descriptionDetailed : 'Can comment and can view files.'
                    }
                }
            }

            $scope.permissions = permissions;

            $scope.deleteUser = deleteUser; // function(index)
            $scope.editUser = editUser;     // function(event, index)
            $scope.userAddPreProcessFn = userAddPreProcessFn; // function(userResult)

            ///////////////////////
            function userAddPreProcessFn(result){
                result.permissions = {
                    role: 'admin'
                }
                return result
            }

            function deleteUser(index){
                $scope.users.splice(index, 1);
                $timeout($scope.saveFn, 0);
            }
            function editUser(event, index){
                var user = $scope.users[index];
                $mdDialog.show({
                    template: require('./tpls/users-permissions-edit-modal.html'),
                    controller: function($scope, $mdDialog){
                        $scope.user   = angular.copy(user);
                        $scope.cancel = $mdDialog.cancel; // function()
                        $scope.save   = function(){
                            $mdDialog.hide($scope.user)
                        }
                        $scope.permissions = permissions;
                    },
                    targetEvent: event
                }).then(function(user){
                    $scope.users[index] = user;
                    $timeout($scope.saveFn, 0);
                })
            }
        }
    }
});

//            $scope.usersGroups = teamToGroups($scope.users);
//
//            $scope.save = function(){
//                $scope.users = groupsToTeam($scope.usersGroups);
//                $timeout($scope.saveFn, 0);
//            }
//            $scope.$watch('usersGroups', function(){
//                $scope.users = groupsToTeam($scope.usersGroups);
//            }, true)
//
//            $scope.userSortConfig = {
//                group: 'users',
//                animation: 150,
//                handle: '.my-handle'
//            };
//            $scope.userGroupSortConfig = {
//                animation: 150,
//                handle: '.my-handle'
//            };
//            $scope.delete = function(group, index){
//                group.splice(index, 1);
//            }
//            $scope.newGroup = function(){
//                var emptyGroup = {
//                    name    : '',
//                    members : []
//                };
//                $scope.usersGroups.push(emptyGroup);
//            }
//
//            // If empty, add an empty group
//            if($scope.users.length === 0){
//                $scope.newGroup();
//            }
//
//            // adds a 'people groups' data structure onto the project that is a mapping
//            // of the back end's flat team structure so a front end style group structure
//            function teamToGroups(team) {
//
//                var original = {
//                    project : {
//                        team : [{
//                            _id : 'ObjectId',
//                            role : 'String',
//                            owner : 'Boolean',
//                            group : 'String'
//                        }]
//                    }
//                };
//
//                var target = {
//                    project : {
//                        usersGroups : [{
//                            name : 'String',
//                            members : [{
//                                _id : 'ObjectId',
//                                role : 'String',
//                                owner : 'Boolean'
//                            }]
//                        }]
//                    }
//                };
//
//                var usersGroups = [];
//
//                // take the flat team representation and put them into arrays of groups
//                team.forEach(function(member) {
//                    var group = _.find(usersGroups, { name : member.group });
//                    // if there's no group for the given user group, create it
//                    if (!group) {
//                        group = {
//                            name : member.group,
//                            members : []
//                        };
//                        usersGroups.push(group);
//                    }
//                    group.members.push(member);
//                });
//
//                return usersGroups;
//            }
//
//            // maps the front end generated people groups field back to
//            // the back end format of th team field for the project
//            function groupsToTeam(usersGroups) {
//
//                var original = {
//                    project : {
//                        usersGroups : [{
//                            name : 'String',
//                            members : [{
//                                _id : 'ObjectId',
//                                role : 'String',
//                                owner : 'Boolean'
//                            }]
//                        }]
//                    }
//                };
//
//                var target = {
//                    project : {
//                        team : [{
//                            _id : 'ObjectId',
//                            role : 'String',
//                            owner : 'Boolean',
//                            group : 'String'
//                        }]
//                    }
//                };
//
//                var newTeam = [];
//
//                // take the peopleGroup as the true correct data, and rebuild the team from this data
//                usersGroups.forEach(function(group) {
//                    group.members.forEach(function(member) {
//                        member.group = group.name;
//                        newTeam.push(member);
//                    });
//                });
//
//                return newTeam;
//            }
