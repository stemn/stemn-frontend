import './components.scss';
import './st-multi-select/st-multi-select.js';
import './fullscreen/fullscreen.js';

angular.module('modules.components', [
    'modules.st-multi-select',
    'modules.components.fullscreen',
    'modules.layout-options',
    'modules.animations', // Used it edit buttons
]);
angular.module('modules.components').

directive('loadingDots', function () {
    return {
        restrict: 'E',
        template: '<span class="dot-one">.</span><span class="dot-two">.</span><span class="dot-three">.</span>'
    };
}).

directive('sectionColour', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            colour: "@"
        },
        templateUrl: 'app/modules/components/tpls/section-colour.html',
    };
}).

directive('backButton', function () {
    return {
        restrict: 'E',
        scope: {
            backState: "@?",
            backFn   : '&?'
        },
        templateUrl: 'app/modules/components/tpls/back-button.html',
        controller: function($scope, $state){
            $scope.back = function(){
                if($scope.backState){
                    $state.go($scope.backState)
                }
                if($scope.backFn){
                    $scope.backFn();
                }
            }
        }
    };
}).


/********************************************************
This will hide/show and panel based on a value.

<collapse-panel show-panel="true||false">
    <span>Toggle Content</span>
</collapse-panel>

********************************************************/
directive('collapsePanel', function () {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            showPanel : '='
        },
        template: '<div class="collapse-panel" ng-show="showPanel" ng-transclude></div>',
    };
}).

directive('userInput', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            placeholder   : '@?',
            sectionData   : '=?',
            saveFn        : '&?',
            saveText      : '@?',
            status        : '=?',   // status.active = true || false
            radioDetails  : '=?',   // {options: [{val:'opt1', title:'Option 1'}], selected: 'selected option'}
            titleText     : '@?'    // text to be displayed in the title area when editing
        },
        templateUrl: 'app/modules/components/tpls/user-input.html',
        controller: function($scope, Authentication, ProjectCreateModalService, ThreadCreateModalService){
            var $window = angular.element(window);
            $scope.status = $scope.status || {};

            $scope.activate = activate; // function()
            $scope.submit   = submit;   // function()

            $scope.user = Authentication.currentUser;
            $scope.editorOptions = {
				realtime  : false,
				contained : true,
				minimal   : false
			}

            $scope.selectedType = 'project';


            // Binds
            $scope.$on('$destroy', unbindClick);
            bindClick();

            ////////////////////////////////////////
            function submit(){
                $scope.saveFn();
            }

            function activate(){
                $scope.status.active = true;
                $scope.$apply();
            }
            function deactivate(){
                $scope.status.active = false;
                $scope.$apply();
            }
            function processClick(event){
                var element = event.target;
                if(angular.element(element).hasClass('user-input')){
//                    activate();
                    return
                }
                else{
                    var parent = angular.element(element).parents('.user-input')[0];
                    if(!parent){
                        deactivate();
                    }
                    else{
//                        activate();
                        return
                    }
                }
            }
            function bindClick(){
                $window.on('mousedown',  processClick);
            }

            function unbindClick(){
                $window.off('mousedown', processClick);
            }

        }
    };
}).


directive('settingsButton', function () {
    return {
        restrict: 'E',
        transclude : true,
        scope: {
            above : '=?' // true || false - this makes the button above the corner
        },
        templateUrl: 'app/modules/components/tpls/settings-button.html',
    };
}).

directive('teamText', function () {
    return {
        restrict: 'EA',
        scope: {
            team : '=',
            limit: '='
        },
        templateUrl: 'app/modules/components/tpls/team-text.html',
    };
}).
directive('teamImages', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            team : '=',
            limit: '=',
            link: '@?', // true(default) || false
            showMore: '&?' // showMore team-members click fin
        },
        templateUrl: 'app/modules/components/tpls/team-images.html',
    };
}).
directive('organisationImages', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            organisations : '=',
            limit: '='
        },
        templateUrl: 'app/modules/components/tpls/organisation-images.html',
    };
}).

directive('userImage', function () {
    return {
        restrict: 'E',
        scope: {
            src              : '=?',
            imageId          : '@?',
            imageStub        : '@?',
            popupFixedBottom : '='   // Fix popup to bottom
        },
        templateUrl: 'app/modules/components/tpls/user-image.html',
    };
}).

directive('organisationImage', function () {
    return {
        restrict: 'E',
        scope: {
            src              : '=?',
            imageId          : '@?',
            imageStub        : '@?',
            popupFixedBottom : '='   // Fix popup to bottom
        },
        templateUrl: 'app/modules/components/tpls/organisation-image.html',
    };
}).

directive('projectImage', function () {
    return {
        restrict: 'E',
        scope: {
            src              : '=?',
            imageId          : '@?',
            imageStub        : '@?',
            popupFixedBottom : '='   // Fix popup to bottom
        },
        templateUrl: 'app/modules/components/tpls/project-image.html',
    };
}).

directive('fieldImage', function () {
    return {
        restrict: 'E',
        scope: {
            src              : '=?',
            imageId          : '@?',
            imageStub        : '@?',
        },
        templateUrl: 'app/modules/components/tpls/field-image.html',
    };
}).

directive('collapsedSection', function ($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            openStatus : '=?',
            height     : '@',   // The height in collapsed form
            verb       : '@'    // See || Read etc
        },
        templateUrl: 'app/modules/components/tpls/collapsed-section.html',
        link: function(scope, element, attrs){
            $timeout(function(){
                if(element[0].offsetHeight <= scope.height){
                    scope.disabled = true;
                }
            },1);
            scope.$watch('openStatus', function(){
                if(scope.openStatus){
                    scope.sectionStyles = {'max-height': ''};
                }else{
                    scope.sectionStyles = {'max-height': (scope.height||0)+'px'};
                }
            })
        }
    };
}).


/************************************************************
Example:
<fat-tabs>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
</fat-tabs>
************************************************************/
directive('fatTabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'app/modules/components/tpls/fat-tabs.html',
    };
}).

/************************************************************
Example:
<tabs>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
    <a flex ng-click="">Tab</a>
</tabs>
************************************************************/
directive('tabs', function () {
    return {
        restrict: 'E',
        scope: {
            selectedTab: '='
        },
        controller: function($scope, $element, $timeout){
            var tabsElements = $element[0].getElementsByTagName('A');

            $timeout(function(){
                _.forEach(tabsElements, function(element){
                    angular.element(element).bind('click', function(){
                        removeActive(true);
                        addActiveClick(element);
                    });
                });
                addActive();
            },1);

            $scope.$watch('selectedTab', function(ov, nv){
                if(ov != nv){
                    $timeout(removeActive,1);
                    $timeout(addActive,1);
                }
            })

            ////////////////////////

            function removeActive(force){
                _.forEach(tabsElements, function(element, index){
                    if(index != $scope.selectedTab || force){
                        angular.element(element).removeClass('active')
                    }
                })
            }
            function addActive(){
                angular.element(tabsElements[$scope.selectedTab]).addClass('active');
            }
            function addActiveClick(element){
                angular.element(element).addClass('active');
            }

        }
    };
}).


directive('editButton', function () {
    /*****************************************************************************
    This directive sets up the data copy so we can reset.
    It also makes 3 functions available on the form object:
        form.$edit()
        form.$cancel()
        form.$save()

    Notes on use:
    The edit button element MUST be warpped with an element that has .edit-box class.
    This is used to specify the content that is editable.
    Elements inside the .edit-box can be wrapped in .disable-when-edit. This will hide
    them during the edit process (useful for items that are not editable).

    Example:
    <form unsaved-warning-form novalidate name="formName" class="edit-box">
        <edit-button form="formName" inline="true"></edit-button>
        <div class="hide-when-edit">
            <input ng-model="model" name="name" placholder="this will be hidden">
        </div>
        <input ng-model="model" name="name" placholder="this will be shown">
    </form>

    The form can also be actived with $stateParams.
    If the $stateParams.edit = form.$name. Edit will be acivated.
	If the form name is something like 'forms.formName' the stateParam should be just 'formName'


    ******************************************************************************/
    return {
        restrict: 'E',
        scope: {
            form      : '=?', // The form controller (this is the form name).
            inline    : '=?', // This will enable the Save/Close after edit is selected - Defaults to False
            editFn    : '&?', // Edit Function   - run when edit is pressed
            saveFn    : '&?', // Save Function   - run when save is pressed
            cancelFn  : '&?', // Cancel Function - run when cancel is pressed
            hideEdit  : '=?', // Hide Edit button - this is used when the edit is activated using form.$edit externally
            draft     : '=?', // true || false - if true, the text will be 'Save Draft' instead of 'Save'
        },
        templateUrl: 'app/modules/components/tpls/edit-button1.html',
        controller : function ($scope, $rootScope, $element, $timeout, LayoutOptions, $compile, $stateParams, TopBannerService, $q, $state, $location, $document){
            // Each form input but have a 'name' and 'ng-mode'.
            // These are required to append ng-model to the form controller.
            // This allows us to get the initial form data so we can cancel.
            $scope.form = $scope.form || {};
            var removeActive
            // This is where the initial form data will be assigned
            var initial = {};

            // Find the nearest edit-box parent
            var editBoxEl = $element.parents('.edit-box');

            // Set up the buttons and overlay element
            var buttonEle
            var overlayEle
            var disableTabOverlayEle
            createButtons();
            createOverlay();

            // Form functions ---------------------------------------------------------
            $scope.form.$edit = function(){
                beginEdit();
                $scope.editFn()
            }
            $scope.form.$save = function(){
                // Wrap save fn in q.when so it always acts like a pronise
                $q.when($scope.saveFn()).then(function(result){
                    endEdit();
                })
            }
            $scope.form.$cancel = function(){
                $scope.cancelFn();
                reset($scope.form);
                endEdit();
            }
            // DOM Functions ----------------------------------------------------------
            $scope.edit = function(){
                 $scope.form.$edit();
            };
            $scope.save = function(){
                $scope.form.$save();
            };
            $scope.cancel = function(){
                $scope.form.$cancel();
            };

            // Nitty Gritty ------------------------------------------------------------
            var beginEdit = function (){
                TopBannerService.hideBanner();
                // If inline is true, we show the Save/Close buttons
                if($scope.inline){
                    initial = initialise();
                    $timeout.cancel(removeActive);
                    editBoxEl.addClass('active');
                    createDisableTabOverlay();
                    LayoutOptions.overlay.highlight = true; // This is used in the header
                    // If form exists, show it
                    if($scope.form){
                        $scope.form.$visible = true;
                    }
                }
            }

            var endEdit = function (){
                removeDisableTabOverlay();
                LayoutOptions.overlay.highlight = false; // This is used in the header
                // Delay the removal for 0.5s so it does not flash as overlay fades.
                editBoxEl.addClass('remove-active')
                removeActive = $timeout(function() {editBoxEl.removeClass('active remove-active')},500);

                // Remove any edit params from location
                $state.current.reloadOnSearch = false;
                $location.search('edit', null);
                $timeout(function () { $state.current.reloadOnSearch = undefined;});

                // Change back form variables
                $scope.form.$visible = false;
                $scope.form.$setPristine();
            }

            // Temp Edit Data model ----------------------------------------------------
            var reset = function(form){
                if (form){
                    // Assign the initial models to the form i.e. reset the form
                    // Repeat for each field in the form (each ng-model)
                    _.each(_.keys(formFields(form)), function(property) {
                        // Extend the form with the initial ng-models
                        _.extend(form[property], initial[property]);
                        // Write model to scope
                        form[property].$$writeModelToScope();
                        // Render the new ng-models
                        form[property].$render();
                    });
                    form.$setPristine();
                }
            };

            // Create an initial copy of all the form data
            var initialise = function(){
                 return angular.copy(formFields($scope.form));
            }

            // Get the form fields - these are all the ng-models used in the form
            var formFields = function(form) {
                return _.pick(form, _.filter(_.keys($scope.form), function(key) { return !/^\$/.test(key) } ));
            }

            // State Params activation ------------------------------------------------
            // This will active the form if the $stateParams.edit is the same as the
            // form name.
			// The form name is split at '.' to get the actual name:
			// 'forms.formgroup.formname' becomes 'formname'
            if($scope.form.$name){
                var formNameSplit = $scope.form.$name.split('.');
                var formName = formNameSplit[formNameSplit.length-1]
                if($stateParams.edit == formName){
                    $timeout(function(){$document.scrollToElement(editBoxEl, 0, 500)},1000)
                    $timeout($scope.form.$edit, 1)
                }
            }


            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                // Remove disabled tab if we change state (in particular, if we go back)
                removeDisableTabOverlay();
            });


            // Create Overlay and Buttons  -------------------------------------------
            function createOverlay(){
                overlayEle = angular.element(
                    '<div class="highlight-overlay" ng-show="form.$visible"></div>'
                );
                // Compile the element
                $compile(overlayEle)($scope);
                // Append element to body
                editBoxEl.after(overlayEle);
            }

            // Create the buttons
            function createButtons(){
                buttonEle = angular.element(
                    '<div class="form-save" ng-show="form.$visible" attention-animation animate-toggle="{{shakeAnimation}}">'+
                        '<md-button class="md-lower" ng-click="cancel()" style="background-color: rgba(255, 255, 255, 0.75);">Cancel</md-button>'+
						'<span tip-throbber="{{draft ? \'saveDraft\' : \'\'}}" tip-position="bottom-right" tip-offset-x="10px" tip-offset-y="-8px">'+
							'<md-button class="md-raised md-accent md-lower" ng-click="save()" ng-disabled="form.$invalid" >'+
								'{{draft ? "Save Draft" : "Save"}}'+
							'</md-button>'+
						'</span>'+
                    '</div>'
                );
                // Compile the element
                $compile(buttonEle)($scope);
                // Append element to body
                editBoxEl.after(buttonEle);
            }

            // Create the overlay the disables tab view
            $scope.disableTabClick = function(){
                $scope.shakeAnimation = !$scope.shakeAnimation;

            }
            function createDisableTabOverlay(){
                disableTabOverlayEle = angular.element(
                    '<div class="disable-tab-view-overlay" ng-click="disableTabClick()"></div>'
                );
                // Compile the element
                $compile(disableTabOverlayEle)($scope);
                // Append element to body
                angular.element(document.body).append(disableTabOverlayEle);
            }
            // Remove the buttons
            function removeDisableTabOverlay(){
                if(disableTabOverlayEle){
                    disableTabOverlayEle.remove()
                }
            }
        },
    };
}).

directive('confirm', function ($mdDialog) {
    /******************************************

    This directive will pop a confirm modal.
    It can be modified with [confirm-title] and
    [confirm-body] attributes.

	confirm="false" will do nothing

    ******************************************/
    return {
        priority: 50,
        restrict: 'A',
        link: {
            pre: function (scope, element, attrs) {
				// Set the message data
                var data = {};
                data.confirmTitle = attrs.confirmTitle
                data.confirmBody = attrs.confirmBody
                data.confirmYes = attrs.confirmYes
                data.confirmNo = attrs.confirmNo

                var clickAction = attrs.ngClick || attrs.href;
                element.bind('click touchstart', function (event) {
					if(attrs.confirm != 'false'){
						event.stopImmediatePropagation();
						event.preventDefault();
						$mdDialog.show({
							templateUrl: 'app/modules/components/tpls/confirm-modal.html',
							controller: function(data, $scope){
								$scope.data = data;
								$scope.cancel = function () {
									$mdDialog.cancel();
								};
								$scope.confirm = function () {
									$mdDialog.hide();
								};
							},
							locals: {data: data},
							targetEvent: event,
						}).then(function(){
							scope.$eval(clickAction);
						});
					}
                });
            }
        }
    };
}).

directive('bindClick', function ($parse) {
    // Alternative to ng-click, used in md-menu
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.bind('click', function (event) {
                var clickFn = $parse(attrs.bindClick)(scope);
                clickFn()
            });
        }
    };
}).


//directive('loadClick', function ($parse) {
//    // Alternative to ng-click, that adds loading to scope
//    return {
//        restrict: 'A',
//        scope: {},
//        link: function(scope, element, attrs){
//            element.bind('click', function (event) {
//                scope.loading = true;
////                $q.all()
////                $parse(attrs.loadClick)(scope).then(function(response){
////                    scope.loading = false;
////                }).catch(function(){
////                    scope.loading = false;
////                })
//            });
//        }
//    };
//}).




directive('ngEnter', function () {
    // <input ng-enter="functionToRun()">
    // This will run the function when enter key is pressed
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
}).

directive('focusMe', function ($timeout, $parse) {
    // This function will focus the element when it comes into view
    // <input type="text" focus-me="{{itemVisible}}">
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            attrs.$observe('focusMe', function(val) {
                if(val == 'true'){
                    $timeout(function () {
                        var focusEl, inputEls = element[0].querySelectorAll("input");
                        if (inputEls.length>0){
                            focusEl = inputEls[0];
                        }
                        else{
                            focusEl = element;
                        }
                        focusEl.focus();
                    },100); // All in timeout so internal contents can render
                }
            });
        }
    };
}).

directive('countTo', function ($timeout) {

    /***********************************************************
    This has been modified to look for the 'animated' class
    This class is added by WOW.js.

    It still works without WOW :) -- MAYBE NOT TODO

    Initial code from:
    https://github.com/sparkalow/angular-count-to
    ***********************************************************/

    return {
        replace: false,
        scope: true,
        link: function (scope, element, attrs) {

            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment;

            var calculate = function () {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseInt(attrs.countTo) || 0;
                scope.value = parseInt(attrs.value, 10) || 0;
                duration = (parseFloat(attrs.duration) * 1000) || 0;

                steps = Math.ceil(duration / refreshInterval);
                increment = ((countTo - scope.value) / steps);
                num = scope.value;
            }

            var tick = function () {
                scope.timoutId = $timeout(function () {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;
                        e.textContent = countTo;
                    } else {
                        e.textContent = Math.round(num);
                        tick();
                    }
                }, refreshInterval);

            }

            var start = function () {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            }

            attrs.$observe('countTo', function (val) {
                if (val) {
                    start();
                }
            });

//            var classes;
//            scope.$watch(function () {
//                classes = attrs.class.split(" ");
//                console.log(classes)
//                if (classes.indexOf('wow') != -1) {
//                    if(classes.indexOf('animated') != -1){
//                        // If wow has activated
//                        start();
//                    }
//                }else{
//                    // If we are not using wow
//                    start();
//                }
//            });

            attrs.$observe('value', function (val) {
                start();
            });

            return true;
        }
    }
}).

directive('pluralise', function () {
    return {
        restrict : 'A',
        transclude: true,
        scope: {
            number : "@",
            lower  : "@?" // Should the S be lower case? True or False
        },
        template   : '<span>{{number || \'0\'}} </span><span class="ng-transclude"></span><span ng-if="number!=1 && lower != \'true\'">S</span><span ng-if="number!=1 && lower == \'true\'">s</span>'
    };
}).

directive('selectOnClick', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('click', function () {
                var selection = $window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element[0]);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        }
    };
}).

directive('loadingOverlay', function () {
    return {
        restrict : 'E',
        replace  : true,
        transclude: true,
		scope    : {
			determinate : '=?', // value || if no value we assume indeterminate
		},
        template :
        '<div class="loading-overlay" layout="column" layout-align="center center">'+
            '<md-progress-circular style="margin: 5px 0;" ng-if="!determinate" class="md-accent" md-mode="indeterminate"></md-progress-circular>'+
            '<md-progress-circular style="margin: 5px 0;" ng-if="determinate"  class="md-accent" md-mode="determinate" value="{{determinate}}"></md-progress-circular>'+
            '<div class="text-lightgrey" ng-transclude></div>'+
        '</div>'
    };
}).

directive('previewGallery', function () {
    return {
        restrict : 'E',
        replace  : true,
		scope    : {
			gallery  : '=?', // value || if no value we assume indeterminate
			showEdit : '=?',
            saveFn   : '&'
		},
        templateUrl : 'app/modules/components/tpls/preview-gallery.html',
        controller  : function($scope, $timeout, UploadsModalService){
            $scope.previewIndex = 0;
            $scope.editGallery = function($event, data){
                UploadsModalService.uploadImagesNewModal($event, data).then(function(results){
                    $scope.gallery = results;
                    $timeout($scope.saveFn, 1);
                })
            }
        }
    };
});
