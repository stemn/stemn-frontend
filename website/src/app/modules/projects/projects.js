import './projects.scss';

angular.module('modules.projects', [
    'modules.project'
]);
angular.module('modules.projects').

directive('projectFilterBar', function () {
    return {
        restrict: 'E',
        scope: {
            filter : '=',
            view   : '='
        },
        template: require('./tpls/projects-filter-bar.html'),
        controller: function($scope) {
            // The diffrent types of filters
            $scope.filters = [{
                text    : 'Activity',
                model   : 'updated',
                reverse : true
            }, {
                text    : 'Threads',
                model   : 'numThreads',
                reverse : true
            }, {
                text    : 'Likes',
                model   : 'likes',
                reverse : true
            }, {
                text    : 'Age',
                model   : 'created',
                reverse : true
            }];
            $scope.view = $scope.view || 'block';

            $scope.updateFilter = function() {
                $scope.filter.sort = $scope.active.filter.model;
                $scope.filter.order = $scope.active.filter.reverse ? 'des' : 'asc';
                $scope.filter.page = 1; // reset the index to the start
            }
            // Initiate OrderBy filter
            $scope.active = {
                filter: $scope.filters[0]
            };
        }
    }
}).

service('ProjectService', function(HttpService, Restangular, Authentication, ModularEditorService, LocalCache) {

    this.getProject    = getProject;    // function(stubOrId, select)
    this.getProjects   = getProjects;   // function(data)
    this.createProject = createProject; // function(project)
    this.deleteProject = deleteProject; // function(projectId)
    this.updateProject = updateProject; // function(project)

    var endpoint       = 'project';

    //////////////////////////////////

    function getProject(stubOrId, select) {
        // Default the selectFields
        var selectFields
        if(select == 'sm'){
            selectFields = ['stub', 'name', 'picture', 'blurb'];
        } else if (select == 'md'){
            selectFields = ['stub', 'name', 'picture', 'blurb', 'created', 'updated', 'fields', 'organisations', 'team' , 'likes', 'numComments', 'location'];
        } else{
            selectFields = ['*'];
            select = 'lg';
        }

        var getPromise = function(data){
            // data - [asfasffsa, asfafsasfasf] - Array of user ids
            return HttpService({
                url: '/api/v1/projects',
                method: "GET",
                params: {
                    'select[]' : selectFields,
                    'ids[]'  : data,
                }
            });
        };
        return LocalCache.getPackaged(endpoint+select, stubOrId, getPromise)
	}

    function getProjects(data) {
        /***************************************** /
         page : The page number to request
         size : The number of results per page
         sort : The field to sort the results by
         type : The entity to get results for e.g. user, organisation, field
        / *****************************************/
        // default to getting projects for user
        if (data.type) {
            data.type = data.type + 's'; // pluralise for api route
            return Restangular.one(data.type, data._id).all('projects').getList(data);
        } else {
            return Restangular.all('projects').getList(data);
        }
    }

    function createProject(project){
        return HttpService({
            method: 'POST',
            url: 'api/v1/projects',
            data: project
        })
    }
    function updateProject(project) {
        analytics.track('Project Update', {
            project     : project.stub,
            teamMembers : project.team.length
        });
		var projectCopy = _.clone(project, true);
		ModularEditorService.stripSectionsDomElements(projectCopy.sectionData.sections);
        LocalCache.save(endpoint+'lg', projectCopy);
        // to save exceeding request size, remove unnecessary data
        return HttpService({
            method: 'PUT',
            url: 'api/v1/projects/'+projectCopy._id,
            data: projectCopy
        })
    }

    function deleteProject(id) {
        return HttpService({
            url: '/api/v1/projects/'+id,
            method: "DELETE",
        });
    }
});
