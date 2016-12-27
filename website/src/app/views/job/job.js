import './job.scss';

angular.module('views.job', [
    'modules.jobs'
]);
angular.module('views.job').

config(function ($stateProvider) {
    $stateProvider.
    state('app.job', {
        url: '/jobs/:stub?edit',
        template: require('./tpls/job.html'),
		controller: 'JobViewCtrl',
        seo: function(resolve){
            return {
                title       : resolve.entity.name + ' - STEMN' || 'Untitled Job',
                picture     : resolve.entity.organisation ? resolve.entity.organisation[0].picture || '' : '',
                description : resolve.entity.blurb
            }
        },
        resolve: {
            entity: function (userdata, $timeout, $state, $stateParams, EntityService) {
                return EntityService.get('job', $stateParams.stub).catch(function(error){
                    $timeout(function(){
                        $state.go('app.404', null, {location: false});
                    })
                })
            },
        },
        layout: {
            size: 'md',
            footer: true,
        },
    })
}).



controller('JobViewCtrl', function (entity, $scope, $state, $document, $timeout, $http, $mdToast, Authentication, HighlightElement, LayoutOptions, JobModalService, CoreLibrary, ApplicationService, PublishService, EntityService) {
    $scope.forms = {};
    $scope.entity = initEntity(entity);
    $scope.user = Authentication.currentUser;

    $scope.userCanEdit = _.any(entity.owners, function (member) {
        return Authentication.currentUser._id === member;
    }) || Authentication.currentUser.isAdmin;
    $scope.showEdit = $scope.userCanEdit;

    if(!$scope.entity.published && $scope.userCanEdit){
        $timeout(function(){$scope.forms.JobForm.$edit()})
    }

    $scope.jobTypes = ['Full-time', 'Part-time', 'Casual', 'Internship', 'Volunteer', 'Temporary'];
    $scope.visas    = ['Available', 'Not Available', 'Not Applicable', 'No - Must be citizen'];
    $scope.currency = CoreLibrary.getCurrencies();



    // Scoped functions
    $scope.save = save;           // function()
    $scope.publish = publish;     // function()
    $scope.deleteJob = deleteJob; // function()
    $scope.editFn = editFn;       // function()
    $scope.endEditFn = endEditFn; // function()
    $scope.createJob = JobModalService.createJob; // function(event)
    $scope.formatDate = formatDate; // function(date)
    $scope.checkSourceValid = checkSourceValid; // function()


    ///////////////////////////////////////////////////////////////

    function checkSourceValid(){
        if($scope.entity.sourceUrl && $scope.entity.sourceKnownString){
            $http({
                method: 'GET',
                url: '/api/v1/sync/download/sourceCheck',
                params: {
                    url : $scope.entity.sourceUrl,
                    string : $scope.entity.sourceKnownString
                }
            }).then(function(response){
                if(response.data.found){
                    $mdToast.show($mdToast.simple().content('Job source is valid'));
                }
                else{
                    failToaster()
                }
            }).catch(failToaster)
        }else{
            failToaster()
        }


        function failToaster(){
            $mdToast.show($mdToast.simple().content('Source Check failed').theme('warn'));
        }
    }

    function initEntity(entity){
        // Format Dates
        entity.deadline = formatDate(entity.deadline);
        return entity
    }

    function formatDate(date){
        if(date){
            date = new Date(date);
        }
        else{
            date = '';
        }
        return date
    }

    function editFn(){
        LayoutOptions.footer.hideFooter = true;
    }
    function endEditFn(){
        LayoutOptions.footer.hideFooter = false;
    }
    function save() {
        $scope.entity.updated = Date.now();
        return EntityService.update('job', $scope.entity).then(function(response){
            $scope.entity = initEntity(response);
        });
    }
    function deleteJob(){
        EntityService.remove('job', $scope.entity._id).then(function() {
            history.back();
        });
    }
	function publish(event) {
        // Check if we can publish
        // If we can't find any that are missing, we can publish
        if(!_.find($scope.requiredFields, 'missing')){
            PublishService.selectStubModal(event, $scope.entity, $scope.entity.organisations[0].name+'-').then(function(stub){
                $scope.entity.stub    = stub;
                $scope.entity.updated = Date.now();
                var entityCopy = _.clone($scope.entity, true);
                entityCopy.published = true;
                EntityService.update('job', entityCopy).then(function(response){
                    $scope.forms.JobForm.$endEdit();
                    $scope.entity = initEntity(response);
                    $mdToast.show($mdToast.simple().content('Your job listing has been published. It will now be public.'));
                    // Go to the new named entity after the edit finishes
                    $timeout(function(){$state.go('app.job',{stub : response.stub})},0)
                })
            })
        }
        else{
            $scope.publishAttempted = true;
            $document.scrollTopAnimated(0);
            PublishService.missingFieldsToast($scope.forms.JobForm);
        }
    }

    $scope.requiredFields = [
        {
            model     : 'name',
            condition : function(entity){return !!entity.name},
            title     : 'You must add a job name. <a ng-click="field.click()">Click here to add one.</a>',
            click     : function(){
                HighlightElement.scrollHighlightElement('nameEdit', {background: true, offset: 100});
            }
        },{
            model     : 'fields',
            condition : function(entity){return entity.fields.length>0},
            title     : 'You have not added any related fields <a ng-click="field.click()">Add field tags.</a>',
            click     : function(){
                HighlightElement.scrollHighlightElement('fieldsEdit', {background: true, offset: 100});
            }
        },{
            model     : 'location',
            condition : function(entity){return entity.location.length>0},
            title     : 'You have not added a location yet. <a ng-click="field.click()">Click here to add one.</a>',
            click     : function(){
                HighlightElement.scrollHighlightElement('locationEdit', {background: true, offset: 100});
            }
        },{
            model     : 'description',
            condition : function(entity){return entity.description && entity.description.length>10},
            title     : 'You must have a job description. <a ng-click="field.click()">Click here.</a>',
            click     : function(){
                HighlightElement.scrollHighlightElement('descriptionEdit', {background: true, offset: 100});
            }
        }
    ]
});
