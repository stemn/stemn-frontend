import './onboarding.scss';
import './onboarding-wizard/onboarding-wizard.scss';

angular.module('modules.onboarding', [
    'modules.settings',
    'modules.users',
	'modules.checklist',
    'modules.state-history'
]);
angular.module('modules.onboarding').

service('OnboardingService', function ($state, $localStorage) {
    var service = this;
    this.goToOnboarding = goToOnboarding;
    this.goToLanding = goToLanding;
    this.beenLanding = false;

    //////////////////////////////////////

    function goToLanding() {
        // If the initial state includes the word 'job' (such as 'app.browse.jobs' or 'app.job')
        if($localStorage.initialState.name.indexOf('job') != -1){
            $state.go('app.landing.jobs');
        }
        else{
            $state.go('app.landing.sync');
        }
    }
    function goToOnboarding(){
        if($localStorage.initialState.name.indexOf('job') != -1){
            $state.go('app.onboarding.select');
        }
        else{
            $state.go('app.onboarding.sync.intro');
        }
    }
}).

directive('tipThrobber', function ($compile, $window, $timeout, $rootScope, $mdDialog, TipService, Authentication) {
    /*******************************************************************************

    This will create the throbber and link the tip data.
    The throbber will be positioned relative to where the [tip-throbber] attribute is added.

    [tip-throbber] = String - representing the tip to display
    [tip-position] = String - The position 'bottom-right' || 'bottom-left'
    [tip-offset-x] = String - The x-axis offset - '10px'
    [tip-offset-y] = String - The y-axis offset - '10px'

    Example:
    <div tip-throbber="menu" tip-position="top-right" tip-offset-x="10px" tip-offset-y="10px">
        -- content the throbber refers to would go in here --
    </div>
    This would create a 'menu' tip throbber 10px from the top-right corner/

    *******************************************************************************/
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            var throbberEl;
            // Logic ---------------------------------------------------------------
            var tip = attrs.tipThrobber;
            if(Authentication.currentUser.isLoggedIn()){
				if(tip){
					TipService.getStatuses().then(function(statuses) {
						// if we want to show the tip
						if(statuses[tip]){
							throbberEl = createThrobber();
							positionThrobber(throbberEl)
							bindClickFunctions(tip);
						}
					});
				}
            }
            // Positioning ---------------------------------------------------------
            function positionThrobber(element){
                var positionCss = {};
                if(attrs.tipPosition        == 'bottom-right'){
                    positionCss.bottom       = attrs.tipOffsetY || 0;
                    positionCss.right        = attrs.tipOffsetX || 0;
                    positionCss.marginBottom = '-29px';
                    positionCss.marginRight  = '-29px';
                }
                else if(attrs.tipPosition   == 'bottom-left'){
                    positionCss.bottom       = attrs.tipOffsetY || 0;
                    positionCss.left         = attrs.tipOffsetX || 0;
                    positionCss.marginBottom = '-29px';
                    positionCss.marginLeft   = '-29px';
                }
                else if(attrs.tipPosition   == 'top-left'){
                    positionCss.top          = attrs.tipOffsetY || 0;
                    positionCss.left         = attrs.tipOffsetX || 0;
                    positionCss.marginTop    = '-29px';
                    positionCss.marginLeft   = '-29px';
                }
                else if(attrs.tipPosition   == 'top-right'){
                    positionCss.top          = attrs.tipOffsetY || 0;
                    positionCss.right        = attrs.tipOffsetX || 0;
                    positionCss.marginTop    = '-29px';
                    positionCss.marginRight  = '-29px';
                }
                else{
                    console.error('Tip Throbber Position Undefined')
                }
                element.css(positionCss)
            }


            // Bind click functions ------------------------------------------------
            function bindClickFunctions(tip){
                throbberEl.bind('click touchstart', function (event) {
                    TipService.markAsRead(tip)
                    throbberEl.addClass('explode')
                    $timeout(function(){throbberEl.remove()},1000)
                    addActiveStyle(element)
                    $mdDialog.show({
                        template: require('./tpls/tip-modal.html'),
                        controller: function(tip, $scope, TipService){
                            $scope.data = TipService.tips[tip];
                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };
                            $scope.confirm = function () {
                                $mdDialog.hide();
                            };
                            $scope.optOut = function(){
                                TipService.markAllAsRead();
                                $mdDialog.hide();
                            }
                        },
                        locals: {tip: tip},
                        targetEvent: event,
                        clickOutsideToClose: true,
                    }).then(function(){
                        removeActiveStyle(element)
                    }).catch(function(){
                        removeActiveStyle(element)
                    })
                });
            }

            // Functions -----------------------------------------------------------
            function addActiveStyle(element){
                element.css({'z-index':200})
            }
            function removeActiveStyle(element){
                element.css({'z-index':''})
            }

            function createThrobber(){
                var template = angular.element(
                    '<tip-throbber></tip-throbber>'
                );
                // Compile the element
                $compile(template)(scope);
                // Append element to body
                element.append(template);
                return template
            }
		}
    };
}).

directive('tipBanner', function (TipService, Authentication) {
    /*******************************************************************************
    [tip]      = String  - representing the tip to display
    [tip-hide] = boolean - This will hide the tip if true
    *******************************************************************************/
    return {
        restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			tip     : '@?', // string - this corresponds to a message in the settings object
			tipHide : '=?',
			local   : '=?'  // true || false - if true, we do not check server for status
		},
		template: require('./tpls/tip-banner.html'),
        link: function(scope, element, attrs){

			initialise();
			scope.close = close; //function()

			///////////////////////////////////////////////////////////

			function initialise(){
				if(Authentication.currentUser.isLoggedIn()){
					if(scope.local){
						scope.enableTip = true;
					}
					else if(scope.tip){
						TipService.getStatuses().then(function(statuses) {
							// show the tip
							if(statuses[scope.tip]){
								scope.enableTip = true;
							}
							else if(statuses[scope.tip] == undefined){
								console.error('No tip exists with the name: '+scope.tip)
							}
							else{
								scope.enableTip = false;
							}
						});
					}
					else{
						console.error('No Tip configured')
					}
				}
			}

			function close(){
				if(scope.tip){
					TipService.markAsRead(scope.tip)
				}
				scope.hideTip = true;
			}
		}
    };
}).

service('TipService', function ($mdDialog, SettingsService, Authentication) {
    var settings;
    this.tips = {
    // This is an object that contains the different tip messages
    // The key is the tip name
        dynamicMenu : {
            title : 'The Dynamic menu',
            body  :
            '<img src="/assets/images/tips/dynamicMenu.png">'+
            '<p>Normally, the top navigation of a website never really changes. This is <strong>not</strong> the case on STEMN...</p>'+
            '<p>You\'ll notice that the top menu adapts to the page you are on. This means it is different for each and every type of page.'+
            ' Keep an eye out for these menu changes because they\'ll reveal lots of different content and settings.</p>',
        },
        backToHome : {
            title : 'Your feed',
            body  :
            '<img src="/assets/images/tips/backToHome.png">'+
            '<p>Wherever you are, click on the astronaut and she\'ll take you back home.</p>',
        },
        saveDraft : {
            title : 'Save Draft',
            body  :
            '<p>You can save your drafts at any time. It will not be publically available until you actually decide to publish it.</p>'+
            '<p>You can find this and any other drafts in <a class="text-green" href="/creations" target="_blank">your creations.</a></p>',
        }
    };

    this.markAllAsRead = function(){
        _.forEach(settings.tips, function(n, key) {
            settings.tips[key] = false;
        });
        settings.save();
    }

    this.markAllAsUnread = function(tip){
        _.forEach(settings.tips, function(n, key) {
            settings.tips[key] = true;
        });
        settings.save();
    }

    this.markAsRead = function(tip){
        settings.tips[tip] = false;
        settings.save();
    }

    this.getStatuses = function() {
        return SettingsService.getSettings().then(function(_settings) {
            settings = _settings;
            return settings.tips;
        });
    }

}).

directive('feedChecklist', function (ChecklistService) {
    /*******************************************************************************
    This will run the update whenever it becomes visible
    *******************************************************************************/
    return {
        restrict: 'E',
        scope: {
            incomplete: '='
        },
        template: require('./tpls/feed-checklist.html'),
        link: function(scope, element, attrs){
            ChecklistService.updateChecklist();
            scope.checklist      = ChecklistService.checklist;
            scope.checklistItems = ChecklistService.checklistItems;
            scope.incomplete     = ChecklistService.incomplete;

		}
    };
}).

service('ChecklistService', function (Authentication, FollowService, $q, NewCreationsService, UserService, SettingsService, $mdDialog) {

    var self = this;

    this.checklistItems = {
        newsfeed : {
            text     : 'Visit your newsfeed.',
            href     : '/',
            complete : true,
        },
        followFields : {
            text     : 'Follow 5 fields',
            href     : '/browse/fields',
            complete : false,
        },
        basicProfile : {
            text     : 'Fill out your basic profile.',
            href     : '/profile-wizard',
            complete : false,
        },
        newProject : {
            text     : "Create a project.",
            click    : NewCreationsService.createModal,
            complete : false,
        }
    }

    this.checklist = [
        'newsfeed',
        'followFields',
        'basicProfile',
        'newProject',
    ];

    this.incomplete = {
        status : false // This is set to true when the checklist is complete
    }
    this.updateChecklist = updateChecklist // function()

    updateChecklist()

    ///////////////////////////////////////////

    function updateChecklist(){
        // If logged in and not complete
        if (Authentication.currentUser.isLoggedIn()) {
            // Load userdata
            Authentication.loadUserData().then(function(){
				// Evaluate Async checks
                $q.all([
					followFieldsCheck(self.checklistItems.followFields),
					basicProfileCheck(self.checklistItems.basicProfile)
				]).then(function(){
					// Evaluate sync checks
					self.checklistItems.newProject.complete   = hasProject();

					// If the checklist is complete
					if(self.checklistItems.followFields.complete &&
					   self.checklistItems.basicProfile.complete &&
					   self.checklistItems.newProject.complete
					  ){
						self.incomplete.status = false;
					}
					else{
						self.incomplete.status = true;
					}
				})
            })
        }
    }

    function followFieldsCheck(checklistItem){
        // TODO: Put the number of field follows on the currentuser object
        return FollowService.getFollowing({
            user : Authentication.currentUser._id,
            type : 'field',
            page : 1,
            size : 5,
        }).then(function(results){
            checklistItem.complete = results.length >= 5
        })
    }
    function basicProfileCheck(checklistItem){
		return SettingsService.getSettings().then(function(settings){
			checklistItem.complete = !settings.messages.userOnboarding
		})
    }
    function newSomethingCheck(){
        return Authentication.currentUser.numProjects > 0 ||
            Authentication.currentUser.numBlogs       > 0 ||
            Authentication.currentUser.numGenerals    > 0 ||
            Authentication.currentUser.numQuestions   > 0 ||
            Authentication.currentUser.numThreads     > 0
    }
    function hasProject(){
        return Authentication.currentUser.numProjects > 0
    }
});
