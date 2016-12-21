angular.module('modules.skills', [
]);
angular.module('modules.skills').

directive('userSkills', function () {
    return {
        restrict: 'E',
        scope: {
            user       : '=',
            activeFields : '=',
        },
        template: require('./tpls/user-skills.html'),
        controller: function($scope, $http, EntityService, SkillsService){
            var activeFieldsArray = _.map($scope.activeFields, '_id');

            $scope.tags = $scope.user.profile.profileDetails.skills.concat($scope.user.profile.profileDetails.technologies);

            SkillsService.getSkills($scope.user._id).then(function(response){
                var evidencedFieldsAll = response.data;
                $scope.unclassifiedFields = SkillsService.createFieldsFromEvidence(evidencedFieldsAll);
            })
            detemineActive($scope.tags);

            /////////////////////////////

            function detemineActive(tags){
                _.forEach(tags, function(tag){
                    if(activeFieldsArray.indexOf(tag._id) != -1){
                        tag.active = true;
                    }
                });
            }
        }
    };
}).

directive('evidencedFields', function () {
    return {
        restrict: 'E',
        scope: {
            user : '=',
            edit : '=',
            activeFields : '=',
        },
        template: require('./tpls/evidenced-fields.html'),
        controller: function($scope, $http, EntityService, SkillsService){
            var evidencedFieldsAll;          // All evidenced fields
            init();

            //////////////////////////////

            function init(){
                SkillsService.getSkills($scope.user._id).then(function(results){
                    evidencedFieldsAll        = results.data;
                    $scope.unclassifiedFields = SkillsService.createFieldsFromEvidence(evidencedFieldsAll);

                    // Merge evidenced fields with profileDetail.skills && profileDetails.technologies
                    SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.skills,       evidencedFieldsAll, $scope.unclassifiedFields);
                    SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.technologies, evidencedFieldsAll, $scope.unclassifiedFields);

                    // Watch the skills and technologies fields. If they change (fields added), merge the evidence field
                    $scope.$watch('user.profile.profileDetails.skills', function(ov, nv){
                        if(ov.length != nv.length){
                            SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.skills, evidencedFieldsAll, $scope.unclassifiedFields);
                        }
                    }, true)
                    $scope.$watch('user.profile.profileDetails.technologies', function(ov, nv){
                        if(ov.length != nv.length){
                            SkillsService.mergeEvidencedSkills($scope.user.profile.profileDetails.technologies, evidencedFieldsAll, $scope.unclassifiedFields);
                        }
                    }, true)

                    // Extend the unclassified fields with the data
                    SkillsService.populateFields($scope.unclassifiedFields);
                })
            }
        }
    };
}).

service('SkillsService', function(HttpService, LocalCache, Authentication, $http, EntityService){
    var service = this;
    this.getStatus = getStatus;             // function(jobId)

    this.getSkills            = getSkills;
    this.mergeEvidencedSkills = mergeEvidencedSkills;
    this.populateFields       = populateFields;
    this.createFieldsFromEvidence       = createFieldsFromEvidence;

    ///////////////////////////////////

    function getStatus(fieldId){
        var getPromise = function(fieldId){
            return HttpService({
                url: '/api/v1/social',
                method: "GET",
                params: {
                    socialType    : 'skill',
                    'parentIds[]' : fieldId,
                    childId       : Authentication.currentUser._id
                }
            });
        };
        return LocalCache.getPackaged('skills-status', fieldId, getPromise)
    }

    function getSkills(userId){
        return $http({
            url: 'api/v1/users/'+userId+'/skills',
            method: 'GET'
        })
    }

    function mergeEvidencedSkills(destinationArray, evidencedAll, evidencedUnclassified){
        // This will merge the evidenced skills to the destination array
        if(evidencedAll){
            _.forEach(destinationArray, function(field){
                // If the field is evidenced - extend with the evidence data
                if(evidencedAll[field._id]){
                    field.evidence = evidencedAll[field._id];
                    field.noDelete = true;
                    // Delete from the unclassified array
                    var evidencedFieldIndex = _.findIndex(evidencedUnclassified, {'_id' : field._id});
                    if(evidencedFieldIndex != -1){
                        evidencedUnclassified.splice(evidencedFieldIndex, 1)
                    }
                }
            })
        }
    }

    function populateFields(unpopulatedFields){
        _.forEach(unpopulatedFields, function(field){
            EntityService.get('field', field._id, 'sm').then(function(response){
                _.extend(field, response);
            })
        })
    }

    function createFieldsFromEvidence(evidence){
        return _.map(evidence, function(fieldEvidence, fieldId){
            return {
                _id      : fieldId,
                evidence : fieldEvidence,
                noDelete : true,
            }
        })
    }
});
