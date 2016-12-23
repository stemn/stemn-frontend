import './feed.scss';
import './widget-timeline/widget-timeline.js';

angular.module('modules.feed', [
    'modules.call-to-action',
    'modules.feed.widget-timeline'
]);


angular.module('modules.feed').
directive('feedItem', feedItemDirective).
directive('cardFeed', cardFeedDirective).
directive('loadingFeed', loadingFeedDirective).
directive('itemFields', itemFieldsDirective).
directive('itemOwner', itemOwnerDirective).
directive('itemImage', itemImageDirective).
directive('feed', feedDirective).
directive('feedRecommend', feedRecommendDirective).
service('FeedService', feedService)


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function feedItemDirective(CoreLibrary, FeedService) {
    return {
        restrict: 'E',
        scope: {
            data: '=?',
            itemType: '@?',
            size: '@?', // lg || sm  - lg defaults
        },
        template: require('./tpls/feed-item.html'),
        controller: function ($scope) {
            // This directive accepts 2 forms of data
            // 1. Data can be passed in on the data object with form:
            //    $scope.data = { data : 'ITEM DATA', itemType : 'ITEM TYPE'}
            // 2. Data can also come in on the $scope.data object and $scope.itemType:
            //    $scope.data = 'ITEM DATA'  and   $scope.itemType : 'ITEM TYPE'


            var data = $scope.data.data || $scope.data;
            // If there is no name, we must fetch the item
            if (!data.name) {
                $scope.loading = true;
                FeedService.getFeedItem({
                    _id: data._id,
                    type: data.type
                }).then(function (result) {
                    data = result;
                    initialise();
                })
            } else {
                initialise();
            }

            // Watch loading - if it changes we re-initialise
            $scope.$watch('data.loading', function () {
                initialise();
            });

            // Functions -----------------------------------------------------
            function initialise() {
                if ($scope.data.loading !== true) {
                    var data = $scope.data.data || $scope.data;
                    $scope.type = data.entityType;
                    $scope.altType = CoreLibrary.getAltType($scope.type);
                    // Map general properties
                    $scope.id = data._id;
                    $scope.title = data.name;
                    $scope.blurb = data.blurb;
                    $scope.fields = data.fields;
                    $scope.wordCount = data.wordCount;
                    $scope.sref = CoreLibrary.getSref(data.entityType, data.stub);
                    $scope.image = data.picture;
                    $scope.srefComments = CoreLibrary.getSrefBase(data.entityType) + '({"stub":"' + data.stub + '","#":"responses"})';
                    $scope.srefCommentsReply = CoreLibrary.getSrefBase(data.entityType) + '({"stub":"' + data.stub + '", "reply" : "true", "#":"reply"})';
                    $scope.numPosts = data.numPosts || data.numComments;
                    $scope.likes = {
                        num: data.likes
                    };

                    // Time block -----------------------------------------------------
                    // This is used to set how long ago something was added/updated etc
                    if (data.updated) {
                        $scope.timeDesc = 'Updated';
                        $scope.time = data.updated;
                    }
                    if (data.submitted) {
                        $scope.timeDesc = 'Submitted';
                        $scope.time = data.submitted;
                    }

                    // Map variable properties
                    if (data.entityType == 'project') {
                        setOwner(data.organisations, data.team);
                    } else {
                        setOwner(data.organisations, data.owner, data.projects);
                    }

                    $scope.loading = false;
                } else {
                    $scope.loading = true;
                }
            }

            function setOwner(organisations, users, projects) {
                // Set the organisation and user
                var organisation
                if (organisations && organisations[0]) {
                    organisation = organisations[0];
                }
                var project
                if (projects && projects[0]) {
                    project = projects[0];
                }
                var user = users[0] || users;

                // Set the owner data on $scope
                if (organisation) {
                    $scope.avatar = organisation.picture;
                    $scope.owner = organisation.name;
                    $scope.ownerId = organisation._id;
                    $scope.ownerStub = organisation.stub;
                    $scope.ownerSref = CoreLibrary.getSref('organisation', organisation.stub);
                    // There is also a sub-owner (the user)
                    $scope.subOwner = user.name;
                    $scope.subOwnerSref = CoreLibrary.getSref('user', user.stub);
                    $scope.ownerType = 'organisation';
                } else if (project) {
                    $scope.avatar = project.picture;
                    $scope.owner = project.name;
                    $scope.ownerId = project._id;
                    $scope.ownerStub = project.stub;
                    $scope.ownerSref = CoreLibrary.getSref('project', project.stub);
                    // There is also a sub-owner (the user)
                    $scope.subOwner = user.name;
                    $scope.subOwnerSref = CoreLibrary.getSref('user', user.stub);
                    $scope.ownerType = 'project';
                } else {
                    $scope.avatar = user.picture;
                    $scope.owner = user.name;
                    $scope.ownerId = user._id;
                    $scope.ownerStub = user.stub;
                    $scope.ownerSref = CoreLibrary.getSref('user', user.stub);
                    $scope.ownerType = 'user';
                }
            }
        }
    };
}

function loadingFeedDirective() {
    return {
        restrict: 'E',
        replace: true,
        template: require('./tpls/feed-loading.html')
    };
}

function itemFieldsDirective() {
    return {
        restrict: 'E',
        scope: {
            fields: '=',
            limit: '=' // The number to display
        },
        template: require('./tpls/item-fields.html'),
        controller: function ($scope, CoreLibrary) {
            _.forEach($scope.fields, function (field) {
                field.sref = CoreLibrary.getSref('field', field.stub);
            })
        }
    };
}

function itemOwnerDirective() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            avatar: '@', // url of avatar image
            type: '@', // organisation || user
            ownerId: '@',
            ownerStub: '@'
        },
        template: require('./tpls/item-owner.html'),
    };
}

function itemImageDirective() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: require('./tpls/item-image.html'),
    };
}

function feedDirective() {
    return {
        restrict: 'E',
        scope: {
            parentId   : '@', // The id of the parent
            parentType : '@', // organisation || project || user || field
            parent     : '=?', // The parent object - This is used to create a more detailed empty message
            type       : '@', // all // projects || blogs || discussions
            size       : '@?', // lg || sm  - lg defaults
            contained  : '@?', // true || false - false defaults if true, banners are hidden an no md-containers
            data       : '=?', // Feed data from resolve
            resolved   : '=?', // true if data comes in from a resolve
            published  : '=?', // true || false || 'both' - true behavior defaults
            showEdit   : '=?', // true || false - will enabled edit features
            hideInput  : '='   // hides the input box
        },
        template: require('./tpls/feed.html'),
        controller: function ($scope, ThreadCreateModalService, NewCreationsService, HttpQuery) {
            var page, size = 10, typeInfos = getTypeInfos();
            // Initiate
            $scope.$watch('parentId', initialise)

            ////////////////////////////////////////////////////////////////////////////

            function initialise(){
                $scope.query = HttpQuery({
                    url    : 'api/v1/feed',
                    params : {
                        parentType : $scope.parentType,
                        parentId   : $scope.parentId,
                        type       : $scope.type,
                        sort       : 'updated',
                        size       : size,
                        published  : $scope.published,
                        populate   : true
                    },
                });

                $scope.typeInfo = typeInfos[$scope.type];
                newEntity();
                $scope.newEntitySubmit = newEntitySubmit; // function()

                $scope.query.results = [{loading: true, name: 'loading'},{loading: true, name: 'loading'},{loading: true, name: 'loading'}];
                $scope.query.more();

            }

            function newEntity(){
                $scope.newEntity={}
                $scope.sectionData = {};
                $scope.radioDetails = {
                    options:  $scope.typeInfo.inputRadioOptions,
                    selected: $scope.typeInfo.inputRadioOptions[0].val,
                }

                // Add the fields/organisations tags
                if($scope.parent && ($scope.parentType == 'organisation' || $scope.parentType == 'project' || $scope.parentType == 'field')){
                    $scope.newEntity[$scope.parentType + 's'] = [{
                        _id:     $scope.parent._id,
                        stub:    $scope.parent.stub,
                        name:    $scope.parent.name,
                        picture: $scope.parent.picture,
                    }];
                    // Add the additional organisation tags if it is a project
                    if ($scope.parentType == 'project') {
                        $scope.newEntity.organisations = $scope.parent.organisations;
                    }
                }
            }

            function newEntitySubmit(){
                var entityType
                $scope.newEntity.sectionData = $scope.sectionData.model;
                $scope.newEntity.type        = $scope.radioDetails.selected;
                // Get the entity type
                if($scope.radioDetails.selected == 'project'){
                    entityType = 'project'
                }
                else{
                    entityType = 'thread'
                }
                NewCreationsService.create(entityType, $scope.newEntity);
            }

            function getTypeInfos(){
                // The first radio button will be selected automatically.
                return {
                    all: {
                        noMoreSingular: 'Nothing here yet.',
                        noMoreMulti: 'No more results.',
                        inputPlaceholder: 'Post a project, blog or question.',
                        inputRadioOptions: [{
                            val: 'project',
                            title: 'Project'
                        }, {
                            val: 'blog',
                            title: 'Blog / Update'
                        }, {
                            val: 'question',
                            title: 'Question'
                        }],
                    },
                    projects: {
                        noMoreSingular: 'No projects yet.',
                        noMoreMulti: 'No more projects.',
                        inputPlaceholder: 'Post a project or Research paper',
                        inputRadioOptions: [{
                            val: 'project',
                        }],
                    },
                    blogs: {
                        noMoreSingular: 'No blogs here yet',
                        noMoreMulti: 'No more blogs.',
                        inputPlaceholder: 'Start a project blog or post something interesting...',
                        inputRadioOptions: [{
                            val: 'blog',
                        }],
                    },
                    discussions: {
                        noMoreSingular: 'No questions yet.',
                        noMoreMulti: 'No more questions.',
                        inputPlaceholder: 'Ask a question or request some help.',
                        inputRadioOptions: [{
                            val: 'question',
                        }],
                    },
                    questions: {
                        noMoreSingular: 'No questions yet.',
                        noMoreMulti: 'No more questions.',
                        inputPlaceholder: 'Ask a question or request some help.',
                        inputRadioOptions: [{
                            val: 'question',
                        }],
                    },
                }
            }
        }
    }
}
function cardFeedDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            parentId   : '@',  // The id of the parent
            parentType : '@',  // organisation || project || user || field
            sort       : '@',  // sort type
            type       : '@',  // all || projects || blogs || discussions
            size       : '@',  // the number of cards
            hideMore   : '=?', // true || false - if true, the 'see more' button will be hidden
            query      : '=?'  // Query(to be used in the parent scope)
        },
        template: require('./tpls/card-feed.html'),
        controller: function ($scope, $timeout, HttpQuery) {
            var page;
            var initDebounce, initDebounceTime = 10;

            // Initiate
            $scope.$watch('parentId', debounceInit, true)
            $scope.$watch('sort',     debounceInit, true)

            ////////////////////////////////////////////////////////////////////////////

            function debounceInit(){
                $timeout.cancel(initDebounce)
                initDebounce = $timeout(initialise, initDebounceTime);
            }

            function initialise(){
                // Defaults
                $scope.size = $scope.size || 3;
                $scope.sort = $scope.sort || 'updated';

                $scope.query = HttpQuery({
                    url    : 'api/v1/feed',
                    params : {
                        parentType: $scope.parentId ? $scope.parentType : '',
                        parentId: $scope.parentId,
                        type: $scope.type,
                        sort: $scope.sort,
                        size: $scope.size,
                        published: $scope.published,
                        populate: true
                    },
                    requerySize: 12
                });
                $scope.query.more();

                if($scope.type == 'projects'){
                    $scope.messageMore   = 'See more projects';
                    $scope.messageNoMore = 'No more projects'
                }
                else if($scope.type == 'blogs'){
                    $scope.messageMore   = 'See more updates';
                    $scope.messageNoMore = 'No more updates'
                }
                else if($scope.type == 'discussions'){
                    $scope.messageMore   = 'See more questions';
                    $scope.messageNoMore = 'No more questions'
                }
                else{
                    $scope.messageMore   = 'See more';
                    $scope.messageNoMore = 'No more results'
                }
            }
        }
    }
}

function feedRecommendDirective($http, $mdToast) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            entityType : '@',
            entityId : '@'
        },
        template: require('./tpls/feed-recommend.html'),
        link : function(scope, element){
            element.bind('click', function(event) {
                $http.post('/api/v1/feed/recommend', {
                    entityType : scope.entityType,
                    entityId : scope.entityId
                }).then(function(response) {
                    $mdToast.show(
                        $mdToast.simple().
                        content('Recommended to everybody!')
                    );
                });
            });
        }
    }
}

function feedService(ThreadService, ProjectService, HttpService) {

    this.getFeed = function (options) {
        /*********************************************************************************************************************
            API:

            parentType : 'user || project || field || organisation',         the parent to provide a feed for
            parentId : 'id',                                                 the id parent of the parent to provide a feed for
            type : 'all || projects || question || discussions || blogs',    the type of items to request
            page : 1,
            size : 10,
            sort : 'recent || top || views',                                 the way to sort the results
            location : {                                                     location filter object
                northeast:{latitude,longitude},
                southwest:{latitude,longitude}
            }
            published : true || false || undefined                           pubished || unpublished || both (true default)
            populate  : true || false(default)                               if true, { type: '', _id: ''}

        *********************************************************************************************************************/
        return HttpService({
            method: 'GET',
            url: 'api/v1/feed',
            params: options
        });
    }
    this.getFeedItem = function (data) {
        /**************************************************************************
            API:

            _id : 'id',
            type : 'user || project || field || organisation'

        **************************************************************************/
        if (data.type == 'project') {
            return ProjectService.getProject(data._id, 'md')
        } else {
            return ThreadService.getThread(data._id, 'md');
        }

    }
}

