import './validation.scss';

angular.module('modules.validation', []);
angular.module('modules.validation').

directive('charCount', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            text      : '=ngModel',
            maxlength : '=' // Max Length allowed
        },
        link: function(scope, element, attrs) {
            // Wrap the input box in a div
            element.wrap('<div class="rel-box"></div>');
            // Create the element to display chars remaining
            var sibling = angular.element('<span class="char-count">{{remaining}}</span>');
            // Insert it after the input box
            sibling.insertAfter(element);
            // Add it to the compile
            $compile(sibling)(scope);
        },
        controller: function($scope) {
            $scope.$watch('text', function(oldValue, newValue) {
                if ($scope.text) {
                    $scope.remaining = $scope.maxlength - $scope.text.length
                }
            });
        }
    };
}).

directive('easyValidation', function ($compile, $timeout) {
    return {
        restrict: 'A',
        // Takes in 'validation-name'
        require: ['^form','ngModel'],
        controller: function($scope, $element, $attrs){
            $timeout(function() {
                var form  = $element.inheritedData('$formController');
                var input = $element.inheritedData('$ngModelController');
                var parentElement = $element.parent();
                var errors = [];
                var messages = {};
                // Create a new isolate scope - this will be used for the error message div
                var isolateScope = $scope.$new(true);
                // Set the model to the new isolate scope
                isolateScope.model = input;

                // Insert a div after the input box
                var errorDiv = angular.element('<div class="help-block height-min">{{errormessage}}</div>');
                errorDiv.insertAfter($element);
                $compile(errorDiv)(isolateScope);

                // Watch the model for changes
                // Add and remove the has error class to show current state
                isolateScope.$watch(function() {
                    // If the input has been touched and is invalid, add error class
                    if(input.$invalid && input.touched){
                        parentElement.addClass('has-error');
                    }
                    // If the input is invalid, remove error class
                    else{
                        parentElement.removeClass('has-error');
                    }
                });

                // TODO - this observe should be replaced, this section is C R A P...
                $attrs.$observe('validationName', function(value){
                    var name  = $attrs.validationName;
                    // Create the messages array object
                    messages = {
                        required  : 'Sorry, this is required.',
                        email     : 'Sorry, that is not a valid email.',
                        minlength : 'Your '+name+' is too short. Min '+$attrs.ngMinlength+' characters',
                        maxlength : 'Your '+name+' is too long. Max '+$attrs.ngMaxlength+' characters',
                        taMinText : 'Your '+name+' is too short. Min '+$attrs.taMinText+' characters',
                        taMaxText : 'Your '+name+' is too long. Max '+$attrs.taMaxText+' characters',
                        min       : 'Your '+name+' is too long. Max '+$attrs.min+' characters',
                        max       : 'Your '+name+' is too long. Max '+$attrs.max+' characters',
                    }
                });

                $element.on('click', function () {
                    // Hide the error div
                    errorDiv.addClass('height-min');
                    // Mark the element because it has been touched
                    input.touched = true;
                });
                $element.on('focus', function () {
                    // Hide the error div
                    errorDiv.addClass('height-min');
                    // Mark the element because it has been touched
                    input.touched = true;
                });
                $element.on('blur', function () {
                    // If invalid, add 'has-error' to parent element
                    if(input.$invalid){
                        // Return an array of all the failed validation methods
                        errors = _.compact(_.map(_.keys(input.$error), function(key) {
                            if (input.$error[key] === true) {
                                return key;
                            }
                        }));
                        parentElement.addClass('has-error');
                        errorDiv.removeClass('height-min');
                        // update the message in the scope
                        isolateScope.$apply(function () {
                            // get the last message from the error array (usually most specific)
                            isolateScope.errormessage = messages[errors[errors.length-1]]
                        });
                    }
                    else{
                        parentElement.removeClass('has-error');
                        errorDiv.addClass('height-min');
                        isolateScope.$apply(function () {
                            isolateScope.show = false;
                        });
                    }
                });
            },0);
        }
    };
});
