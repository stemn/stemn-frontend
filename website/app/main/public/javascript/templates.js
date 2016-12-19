(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/linkedin-warn-modal.html', '<md-dialog>\r\n    <md-dialog-content>\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px; margin-bottom: 40px;\">Are you sure?</h1>\r\n            <p>This will <strong>overwrite</strong> parts of your STEMN user profile using information in your Linkedin profile.</p>\r\n            <p>If you are unsure, you should make a copy of your STEMN profile\'s summary and education sections.</p>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex></div>\r\n        <md-button class=\"\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-raised md-warn\" ng-click=\"finish()\">Proceed</md-button>\r\n    </div>\r\n    <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/login-local-modal.html', '<md-dialog class=\"md-full-screen loginRegisterModal\">\r\n    <md-toolbar style=\"background: transparent;\">\r\n        <div class=\"md-toolbar-tools\">\r\n			<md-button class=\"md-icon-button\" ng-click=\"back($event)\">\r\n				<md-icon md-svg-icon=\"arrow-back\" aria-label=\"Back\"></md-icon>\r\n			</md-button>\r\n            <span flex>\r\n            </span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <form unsaved-warning-form novalidate ng-submit=\"loginLocal()\" name=\"LoginForm\">\r\n        <md-dialog-content>\r\n            <div layout=\"column\" layout-align=\"center center\" style=\"min-height: 80vh;\">\r\n				<div class=\"dialog-container\">\r\n					<h1 class=\"md-display-1\">STEMN beta</h1>\r\n					<h4 class=\"text-lightgrey\">Sign in to STEMN</h4>\r\n					<div class=\"text-left\">\r\n						<md-input-container class=\"md-accent\">\r\n							<label>Email</label>\r\n							<input name=\"email\" ng-model=\"login.email\"\r\n							required type=\"email\">\r\n							<div ng-messages=\"LoginForm.email.$error\" ng-if=\"LoginForm.email.$dirty\">\r\n								<div ng-message=\"required\">We\'ll be needing this...</div>\r\n								<div ng-message=\"email\">That is not a valid email.</div>\r\n							</div>\r\n						</md-input-container>\r\n						<md-input-container class=\"md-accent\">\r\n							<label>Password</label>\r\n							<input name=\"password\" ng-model=\"login.password\"\r\n							required type=\"password\">\r\n							<div ng-messages=\"LoginForm.password.$error\" ng-if=\"LoginForm.password.$dirty\">\r\n								<div ng-message=\"required\">If only the world was that simple... You\'ll need the password :)</div>\r\n							</div>\r\n						</md-input-container>\r\n					</div>\r\n					<div class=\"next-buttons\" layout=\"row\" layout-align=\"center center\">\r\n						<md-button flex-order=\"2\" type=\"submit\" class=\"md-raised md-accent\" ng-disabled=\"LoginForm.$invalid\">Login</md-button>\r\n						<md-button flex-order=\"1\" type=\"button\" ng-click=\"back($event)\">Back</md-button>\r\n					</div>\r\n				</div>\r\n				<div class=\"info-container\">\r\n					<p class=\"text-lightgrey\">If you have previously logged in using a social account (LinkedIn or Facebook), you can create an email and password combo too, by visiting your settings panel after logging in socially.</p>\r\n					<p class=\"text-lightgrey\">If you have forgotten your password you can <a class=\"underlined\" ng-click=\"recoverPassword($event)\">recover it here.</a></p>\r\n				</div>\r\n			</div>\r\n        </md-dialog-content>\r\n        <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/login-modal.html', '<md-dialog class=\"md-full-screen loginRegisterModal\">\r\n    <md-toolbar style=\"background: transparent;\">\r\n        <div class=\"md-toolbar-tools\">\r\n            <span flex></span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel($event)\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n\r\n    <form unsaved-warning-form novalidate name=\"LoginForm\">\r\n        <md-dialog-content>\r\n            <div layout=\"column\" layout-align=\"center center\" style=\"min-height: 80vh;\">\r\n				<div class=\"dialog-container\" layout=\"column\" layout-align=\"start center\">\r\n					<h1 class=\"md-display-1\">{{data.title || \'STEMN beta\'}}</h1>\r\n					<h4 class=\"text-lightgrey\" ng-bind-html=\"data.subtitle || \'Sign in or create an account.\'\"></h4>\r\n                    <div layout=\"column\">\r\n                        <md-button hide-sm class=\"md-social md-linkedin\" ng-click=\"authenticate(\'linkedin\');\" layout=\"row\" layout-align=\"start center\">\r\n                            <md-icon md-font-icon=\"fa-linkedin\"></md-icon>\r\n                            <span flex>Continue with Linkedin</span>\r\n                        </md-button>\r\n                        <md-button class=\"md-social md-facebook\" ng-click=\"authenticate(\'facebook\');\" layout=\"row\" layout-align=\"start center\">\r\n                            <md-icon md-font-icon=\"fa-facebook\"></md-icon>\r\n                            <span flex>Continue with Facebook</span>\r\n                        </md-button>\r\n                        <md-button class=\"md-social md-email\" ng-click=\"openRegister($event)\" layout=\"row\" layout-align=\"start center\">\r\n                            <md-icon md-font-icon=\"fa-envelope\"></md-icon>\r\n                            <span flex>Sign up with email</span>\r\n                        </md-button>\r\n                    </div>\r\n					<div class=\"text-lightgrey m-v-15\">or</div>\r\n					<a ng-click=\"openLoginLocal($event)\" class=\"text-green\">\r\n						Log in with email\r\n					</a>\r\n				</div>\r\n				<div class=\"info-container\">\r\n					<p class=\"text-lightgrey\">We\'ll never post to your LinkedIn or Facebook without your permission.</p>\r\n					<p class=\"text-lightgrey\">Creating your account means you are agreeing to our <a class=\"underlined\" href=\"/terms\">Terms of Service</a>. If you do not agree, you cannot use STEMN.</p>\r\n				</div>\r\n            </div>\r\n        </md-dialog-content>\r\n        <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/login-recruit-modal.html', '<md-dialog aria-label=\"Recruit Modal\">\r\n    <md-dialog-content class=\"overflow-x-box p-0\">\r\n        <!-- Is Logged In -->\r\n        <div class=\"md-content-container content-md p-0\" layout=\"column\" layout-gt-sm=\"row\" ng-hide=\"currentUser.isLoggedIn()\">\r\n            <div class=\"p-30\" flex>\r\n                <div class=\"md-headline m-b-60\">\r\n                    Get Early Access\r\n                </div>\r\n                <div style=\"font-size: 15px;\">\r\n                    You\'ll love STEMN Recruiting:\r\n                    <div layout=\"row\" layout-align=\"start center\" class=\"m-t-10\" ng-repeat=\"item in points\">\r\n                        <md-icon md-svg-icon=\"done\" class=\"s-20 md-icon-green m-r-15\"></md-icon>\r\n                        <div flex>{{item}}</div>\r\n                    </div>\r\n                    <div class=\"m-t-30\">Access the world\'s best aerospace talent. Find scientists and engineers with the technical skills you need. Browse their portfolios.<br><br>\r\n                    STEMN jobs in currently in beta. Request early access now!</div>\r\n\r\n                </div>\r\n            </div>\r\n            <div class=\"bg-lightgrey p-30\" flex>\r\n                <form class=\"rel-box\" novalidate name=\"SignupForm\" ng-submit=\"submitSignup()\">\r\n                    <div class=\"md-subhead\" style=\"color: rgba(0, 0, 0, 0.7);\">Request Access</div>\r\n                    <div layout=\"row\">\r\n                        <md-input-container class=\"md-accent\" flex>\r\n                            <label>First Name*</label>\r\n                            <input ng-model=\"signup.firstname\"\r\n                            name=\"firstname\" type=\"text\" required>\r\n                            <div ng-messages=\"SignupForm.firstname.$error\" ng-if=\"SignupForm.firstname.$dirty\">\r\n                                <div ng-message=\"required\">This is required.</div>\r\n                            </div>\r\n                        </md-input-container>\r\n                        <md-input-container class=\"md-accent\" flex>\r\n                            <label>Last Name*</label>\r\n                            <input ng-model=\"signup.lastname\"\r\n                            name=\"lastname\" type=\"text\" required>\r\n                            <div ng-messages=\"SignupForm.lastname.$error\" ng-if=\"SignupForm.lastname.$dirty\">\r\n                                <div ng-message=\"required\">This is required.</div>\r\n                            </div>\r\n                        </md-input-container>\r\n                    </div>\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Email*</label>\r\n                        <input ng-model=\"signup.email\"\r\n                        name=\"email\" type=\"email\" required>\r\n                        <div ng-messages=\"SignupForm.email.$error\" ng-if=\"SignupForm.email.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                            <div ng-message=\"email\">That is not a valid email.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Phone*</label>\r\n                        <input ng-model=\"signup.phone\"\r\n                        name=\"phone\" type=\"text\" required>\r\n                        <div ng-messages=\"SignupForm.phone.$error\" ng-if=\"SignupForm.phone.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Company*</label>\r\n                        <input ng-model=\"signup.company\"\r\n                        name=\"company\" type=\"text\" required>\r\n                        <div ng-messages=\"SignupForm.company.$error\" ng-if=\"SignupForm.company.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Location*</label>\r\n                        <input ng-model=\"signup.location\"\r\n                        name=\"location\" type=\"text\" required>\r\n                        <div ng-messages=\"SignupForm.location.$error\" ng-if=\"SignupForm.location.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <div layout=\"row\">\r\n                        <div flex></div>\r\n                        <md-button type=\"submit\" class=\"md-raised md-accent md-cornered m-0 md-md md-flat\">Request Access</md-button>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/recover-password-modal.html', '<md-dialog class=\"md-full-screen loginRegisterModal\">\r\n    <md-toolbar style=\"background: transparent;\">\r\n        <div class=\"md-toolbar-tools\">\r\n			<md-button class=\"md-icon-button\" ng-click=\"back($event)\">\r\n				<md-icon md-svg-icon=\"arrow-back\" aria-label=\"Back\"></md-icon>\r\n			</md-button>\r\n            <span flex>\r\n            </span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <form unsaved-warning-form novalidate ng-submit=\"submit()\" name=\"RecoverPasswordForm\">\r\n        <md-dialog-content layout=\"column\" layout-align=\"center center\">\r\n            <div class=\"dialog-container\">\r\n                <img src=\"/assets/images/authentication/changepassword.gif\" alt=\"Change Password\" style=\"width: 200px;\">\r\n                <h1 class=\"md-display-1\">Lost password?</h1>\r\n                <h4 class=\"text-lightgrey\">Put in your email and we\'ll send you a new password.</h4>\r\n                <div class=\"text-left\">\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Email address</label>\r\n                        <input name=\"email\" ng-model=\"data.email\" type=\"email\"\r\n                        required>\r\n                        <div ng-messages=\"RecoverPasswordForm.email.$error\" ng-if=\"RecoverPasswordForm.email.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                            <div ng-message=\"email\">That is not a valid email.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                </div>\r\n                <div class=\"next-buttons\" layout=\"row\" layout-align=\"center center\">\r\n                    <md-button flex-order=\"2\" type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"RecoverPasswordForm.$invalid\">Submit</md-button>\r\n                    <md-button flex-order=\"1\" type=\"button\" ng-click=\"back($event)\">Back</md-button>\r\n                </div>\r\n            </div>\r\n            <div class=\"info-container\">\r\n                <p class=\"text-lightgrey\"></p>\r\n            </div>\r\n        </md-dialog-content>\r\n        <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n    </form>\r\n    <div class=\"md-actions\" layout=\"row\"></div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/register-form.html', '<div layout=\"row\">\r\n    <md-input-container flex class=\"md-accent\">\r\n        <label>First name</label>\r\n        <input name=\"firstname\" ng-model=\"data.firstname\" type=\"text\"\r\n        required ng-minlength=\"2\" ng-maxlength=\"30\">\r\n        <div ng-messages=\"RegisterForm.firstname.$error\" ng-if=\"RegisterForm.firstname.$dirty\">\r\n            <div ng-message=\"required\">This is required.</div>\r\n            <div ng-message=\"minlength\">Bit short...</div>\r\n            <div ng-message=\"maxlength\">Wow! too long...</div>\r\n        </div>\r\n    </md-input-container>\r\n    <md-input-container flex class=\"md-accent\">\r\n        <label>Last name</label>\r\n        <input name=\"lastname\" ng-model=\"data.lastname\" type=\"text\"\r\n        required ng-minlength=\"2\" ng-maxlength=\"30\">\r\n        <div ng-messages=\"RegisterForm.lastname.$error\" ng-if=\"RegisterForm.lastname.$dirty\">\r\n            <div ng-message=\"required\">This is required.</div>\r\n            <div ng-message=\"minlength\">Bit short...</div>\r\n            <div ng-message=\"maxlength\">Wow! too long...</div>\r\n        </div>\r\n    </md-input-container>\r\n</div>\r\n<md-input-container class=\"md-accent\">\r\n    <label>Email address</label>\r\n    <input name=\"email\" ng-model=\"data.email\" type=\"email\"\r\n    required>\r\n    <div ng-messages=\"RegisterForm.email.$error\" ng-if=\"RegisterForm.email.$dirty\">\r\n        <div ng-message=\"required\">This is required.</div>\r\n        <div ng-message=\"email\">That is not a valid email.</div>\r\n    </div>\r\n</md-input-container>\r\n<md-input-container class=\"md-accent\">\r\n    <label>Password</label>\r\n    <input name=\"password\" ng-model=\"data.password\" type=\"password\"\r\n    required ng-minlength=\"5\" ng-maxlength=\"35\">\r\n    <div ng-messages=\"RegisterForm.password.$error\" ng-if=\"RegisterForm.password.$dirty\">\r\n        <div ng-message=\"required\">This is required.</div>\r\n        <div ng-message=\"pattern\">Sorry, that field name is invalid. You can\'t use the characters: / \\ [ ]</div>\r\n        <div ng-message=\"minlength\">Bit short...</div>\r\n        <div ng-message=\"maxlength\">Wow! too long...</div>\r\n    </div>\r\n</md-input-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/authentication/tpls/register-modal.html', '<md-dialog class=\"md-full-screen loginRegisterModal\">\r\n    <md-toolbar style=\"background: transparent;\">\r\n        <div class=\"md-toolbar-tools\">\r\n			<md-button class=\"md-icon-button\" ng-click=\"back($event)\">\r\n				<md-icon md-svg-icon=\"arrow-back\" aria-label=\"Back\"></md-icon>\r\n			</md-button>\r\n            <span flex>\r\n            </span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <form unsaved-warning-form novalidate ng-submit=\"signupFormSubmit()\" name=\"RegisterForm\">\r\n        <md-dialog-content>\r\n            <div layout=\"column\" layout-align=\"center center\" style=\"min-height: 80vh;\">\r\n				<div class=\"dialog-container\">\r\n					<h1 class=\"md-display-1\">STEMN beta</h1>\r\n					<h4 class=\"text-lightgrey\">Sign up to STEMN. Your space adventure awaits.</h4>\r\n					<div class=\"text-left\">\r\n						<register-form></register-form>\r\n					</div>\r\n					<div class=\"next-buttons\" layout=\"row\" layout-align=\"center center\">\r\n						<md-button flex-order=\"2\" type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"RegisterForm.$invalid\">Sign Up</md-button>\r\n						<md-button flex-order=\"1\" type=\"button\" ng-click=\"back($event)\">Back</md-button>\r\n					</div>\r\n				</div>\r\n				<div class=\"info-container\">\r\n					<p class=\"text-lightgrey\">Creating your account means you are agreeing to our <a class=\"underlined\" href=\"/terms\">Terms of Service</a>. If you do not agree, you cannot use STEMN.</p>\r\n				</div>\r\n			</div>\r\n        </md-dialog-content>\r\n        <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/banner-header/banner-header.html', '<div class=\"banner-header\"\r\nng-class=\"{\'background-gradient-1\' : !image, \'bounding-box\' : image}\"\r\nng-hide=\"close\"\r\nstyle=\"margin: 0px -15px; width: 110%;\"\r\nng-style=\"image && colour && {\'background-image\':\'url(\'+image+\'?size=banner-lg&crop=true),linear-gradient(\'+angle+\',\'+colour[0]+\' 10%, \'+colour[1]+\' 90%)\'} ||\r\nimage && {\'background-image\':\'url(\'+image+\'?size=banner-lg&crop=true)\'} ||\r\ncolour && {\'background-image\':\'linear-gradient(\'+angle+\',\'+colour[0]+\' 10%, \'+colour[1]+\' 90%)\'}\">\r\n</div>\r\n\r\n<div class=\"{{text || \'white\'}}\" ng-show=\"showClose\">\r\n   <a class=\"close-top-right\" ng-click=\"close=true\">&times;</a>\r\n</div>\r\n\r\n<div class=\"overlay-child banner-header\" ng-hide=\"close\" lightbox=\"true\" lightbox-image=\"lightboxImage\">\r\n    <div class=\"vertical-center-parent text-center\" style=\"margin:auto\">\r\n        <div class=\"vertical-center-child {{text || \'white\'}} ng-transclude\">\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"expand-toggle\" ng-show=\"close==true\" ng-click=\"close=false\"></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/browser-info/tpls/bad-browser-modal.html', '<md-dialog>\r\n    <md-dialog-content layout=\"row\">\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">We don\'t support your browser yet...</h1>\r\n<!--            <p>It looks like you are using <strong>{{data.name}} v.{{data.version}}</strong>.</p>-->\r\n            <p>Unfortunately, we are in beta and don\'t yet support all browsers. There could be bugs if you don\'t swap to a supported browser.</p>\r\n            <p>We recommend you use\r\n            <a class=\"text-green\" href=\"https://www.google.com/chrome/browser/\">Google Chrome</a>\r\n            </p>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex></div>\r\n        <div>\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"confirm()\">Continue anyway</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/call-to-action/tpls/call-to-action.html', '<div class=\"call-to-action card-z1 m-b-15\" ng-include=\"banner.templateUrl\"></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/call-to-action/tpls/cta-map.html', '<div layout=\"row\" layout-align=\"start center\">\r\n    <div flex class=\"m-r-15\">\r\n        <div class=\"md-title bold\">Explore the map</div>\r\n        <p class=\"text-grey\">Explore the STEMN map to find projects, organisations and jobs near you. See what\'s going on where.</p>\r\n        <md-button class=\"m-l-0 md-cornered md-accent\" ui-sref=\"app.map\">Explore the map</md-button>\r\n    </div>\r\n    <div style=\"width: 200px;\">\r\n        <img class=\"w-100\" src=\"/assets/images/explanation-modals/earth.svg\" alt=\"\">\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/call-to-action/tpls/cta-project.html', '<div layout=\"row\" layout-align=\"start center\">\r\n    <div flex class=\"m-r-15\">\r\n        <div class=\"md-title bold\">Start a project</div>\r\n        <p class=\"text-grey\">List your project on STEMN. Whether it is underway, complete or just an idea, STEMN lets you document projects at all stages.</p>\r\n        <md-button authenticate class=\"m-l-0 md-cornered md-accent\" click-create>Create project</md-button>\r\n    </div>\r\n    <div style=\"width: 200px;\">\r\n        <img class=\"w-100\" src=\"/assets/images/explanation-modals/droid.svg\" alt=\"\">\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/call-to-action/tpls/cta-referrals.html', '<div layout=\"row\" layout-align=\"start center\">\r\n    <div flex class=\"m-r-15\">\r\n        <div class=\"md-title bold\">Refer your friends to STEMN</div>\r\n        <p class=\"text-grey\">Signup friends and get awesome rewards including stickers and official t-shirts. Help our community grow and increase collaboration in science and engineering.</p>\r\n        <md-button class=\"m-l-0 md-cornered md-accent\" ui-sref=\"app.referrals\">Get your referral code</md-button>\r\n    </div>\r\n    <div style=\"width: 200px;\">\r\n        <img class=\"w-100\" src=\"/assets/images/swag/white-shirt-sm.jpg\" alt=\"\">\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/cards/tpls/creation-card.html', '<div>\r\n    <div flex class=\"creation-card rel-box\" layout=\"column\">\r\n        <a md-ink-ripple ng-href=\"{{url}}\" class=\"picture bounding-box\" ng-style=\"(entity.picture || picture) && {\'background-image\':\'url(\'+(entity.picture || picture) +\'?size=project-card&crop=true)\'}\"></a>\r\n        <div flex class=\"content ellipsis-container\" layout=\"column\">\r\n            <a ng-href=\"{{url}}\" class=\"title\">{{entity.name | letters: 50}}</a>\r\n            <div flex class=\"sub\">{{entity.blurb | letters: 150}}</div>\r\n            <div class=\"card-bottom\">\r\n                <div class=\"m-v-15\">\r\n                    <tags edit=\"false\" size=\"sm\" tags=\"entity.fields\" type=\"field\" limit=\"3\" one-line=\"true\"></tags>\r\n                </div>\r\n                <div layout=\"row\">\r\n                    <organisation-images organisations=\"entity.organisations\" limit=\"2\"></organisation-images>\r\n                    <div ng-if=\"entity.organisations.length>0\" class=\"divider-v\"></div>\r\n                    <team-images team=\"team\" limit=\"2\" class=\"stacked\"></team-images>\r\n                    <div flex></div>\r\n                    <div layout=\"row\" layout-align=\"start center\" class=\"text-lightgrey\">\r\n                        <stat-button type=\"like\" parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" count=\"entity.likes\" display-style=\"circle\" style=\"margin-right: -3px;\"></stat-button>\r\n                        <a class=\"count\" stat-display-modal parent-id=\"{{entity._id}}\" parent-type=\"{{entity.type}}\" type=\"like\">\r\n                            {{entity.likes || 0}}\r\n                        </a>\r\n                        <md-button class=\"md-icon-button md-sm\" aria-label=\"comments\" style=\"margin-right: -3px;\" ng-href=\"{{url}}#reply\">\r\n                            <md-icon md-svg-icon=\"response\"></md-icon>\r\n                        </md-button>\r\n                        <a class=\"count\" ng-href=\"{{url}}#responses\">{{entity.numPosts || entity.numComments || 0}}</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <loading-overlay ng-if=\"loading\" ng-class=\"{\'translucent\' : items.length > 0}\"></loading-overlay>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/cards/tpls/organisation-card.html', '<div layout=\"column\">\r\n    <div flex class=\"organisation-card\" layout=\"column\">\r\n        <a md-ink-ripple ui-sref=\"app.organisation.overview({\'stub\':entity.stub})\"\r\n        class=\"avatar-contain avatar-100 square\"\r\n        style=\"background-image:url({{ entity.picture || \'/assets/images/default/org.png\' }}?size=thumb-lg)\"></a>\r\n\r\n        <div flex class=\"p-15 text-center\" layout=\"column\" layout-align=\"start center\">\r\n            <a flex class=\"title m-b-30\" ui-sref=\"app.organisation.overview({\'stub\':entity.stub})\">{{entity.name}}</a>\r\n            <div hidepublic>\r\n                <stat-button hide-stat=\"true\" hide-icon=\"true\" type=\"follow\" parent-type=\"organisation\" parent-id=\"{{entity._id}}\" count=\"entity.followers\" class=\"lg m-b-15\"></stat-button>\r\n            </div>\r\n        </div>\r\n    <!--    <div class=\"card-loading-overlay anim-fade\" ng-show=\"loading\"></div>-->\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/carousel/tpls/carousel.html', '<div class=\"carousel rel-box\">\r\n    <div ng-show=\"$index == activeSlide\" ng-repeat=\"slide in slides\" class=\"slide overlay-child bg-img-cover\" ng-style=\"slide.image && {\'background-image\': \'url(\'+slide.image+\')\'}\"></div>\r\n    <div class=\"text-overlay overlay-child darked\" layout=\"column\" layout-align=\"center center\" ng-transclude></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/checklist/tpls/checklist-item.html', '<div class=\"checklist-item\" ng-class=\"{\'complete\':itemComplete}\" layout=\"row\" layout-align=\"start center\">\r\n	<md-icon md-svg-icon=\"done\"></md-icon>\r\n	<div flex>\r\n		<a ng-href=\"{{itemHref}}\" ng-click=\"itemClick($event)\" ng-transclude></a>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/code-mirror/tpls/code-mode.html', '<md-select ng-model=\"mode\" placeholder=\"Mode\">\r\n    <md-option ng-repeat=\"possibleMode in codeModes\" value=\"{{possibleMode.path}}\">{{possibleMode.name}}</md-option>\r\n</md-select>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/code-mirror/tpls/latex-input.html', '	<div class=\"CodeMirrorPadded\">\r\n	    <textarea ui-codemirror=\"options\" ng-model=\"content\" placeholder=\"Write LaTeX math code in here. eg: e^{i \\pi} + 1 = 0\"></textarea>\r\n	</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/st-multi-select/tpls/st-select-option.html', '<a class=\"st-select-option\" layout=\"row\" layout-align=\"start center\" ng-click=\"select()\">\r\n    <md-icon class=\"s-15\" md-svg-icon=\"done\"></md-icon>\r\n    <div class=\"inner\" flex ng-transclude layout=\"row\" layout-align=\"start center\"></div>\r\n    <md-icon class=\"s-15\" md-svg-icon=\"navigation:close\"></md-icon>\r\n</a>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/back-button.html', '<md-button class=\"md-icon-button\" aria-label=\"back\" style=\"position:absolute;top:0;left:0;margin-left:-50px\" ng-click=\"back()\">\r\n    <md-icon md-svg-icon=\"arrow-back\" style=\"color: rgba(0, 0, 0, 0.15); width: 20px;\"></md-icon>\r\n</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/collapsed-section.html', '<div class=\"collapsed-section\" ng-style=\"sectionStyles\">\r\n    <ng-transclude></ng-transclude>\r\n    <div class=\"white-fader\" ng-hide=\"openStatus || disabled\"></div>\r\n</div>\r\n<div ng-hide=\"disabled\" layout=\"column\">\r\n    <a ng-show=\"!openStatus\" ng-click=\"openStatus = true\"  class=\"text-green m-v-10\">{{verb || \'See\'}} more...</a>\r\n    <a ng-show=\" openStatus\" ng-click=\"openStatus = false\" class=\"text-green m-v-10\">{{verb || \'See\'}} less...</a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/confirm-modal.html', '<md-dialog>\r\n    <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">{{ data.confirmTitle || \'Are you sure?\'}}</h1>\r\n            <p ng-bind-html=\"data.confirmBody || \'There will be no turning back.\'\"></p>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex></div>\r\n        <div>\r\n            <md-button ng-click=\"cancel()\">{{data.confirmNo || \'No\'}}</md-button>\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"confirm()\">{{data.confirmYes || \'Yes\'}}</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/edit-button1.html', '<div hidepublic class=\"edit-buttons\">\r\n    <div class=\"edit\">\r\n        <div ng-hide=\"form.$visible || hideEdit\">\r\n            <md-button ng-click=\"edit()\" class=\"md-circle md-sm\" aria-label=\"edit\">\r\n                <md-icon md-svg-src=\"edit\"></md-icon>\r\n                <md-tooltip>\r\n                    Edit\r\n                </md-tooltip>\r\n            </md-button>\r\n        </div>\r\n        <div ng-show=\"form.$visible\">\r\n            <md-button ng-click=\"cancel()\" class=\"md-circle md-sm\" aria-label=\"close\">\r\n                <md-icon md-svg-src=\"close\"></md-icon>\r\n                <md-tooltip>\r\n                    Close\r\n                </md-tooltip>\r\n            </md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/fat-tabs.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div layout=\"row\" class=\"md-content-container\" style=\"padding: 0px;\" ng-transclude>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/field-image.html', '<md-button class=\"md-circle field-image md-sm md-border-light\"\r\n    ui-sref=\"app.field.top({\'stub\': imageStub})\"\r\n    popup popup-content=\"<field-card id=\'{{imageId}}\' size=\'sm\'></field-card>\" popup-fixed-bottom=\"popupFixedBottom\"\r\n    aria-label=\"Field\"\r\n    style=\"background-image: url(\'{{src || \'/assets/images/default/square.png\'}}?size=thumb&crop=true\'); border-radius: 3px !important;\">\r\n</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/organisation-image.html', '<md-button class=\"md-circle organisation-image md-sm md-border-light\"\r\n    ui-sref=\"app.organisation.overview({\'stub\': imageStub})\"\r\n    popup popup-content=\"<organisation-card id=\'{{imageId}}\' size=\'sm\'></organisation-card>\" popup-fixed-bottom=\"popupFixedBottom\"\r\n    aria-label=\"Organisation\"\r\n    style=\"background-image: url(\'{{src || \'/assets/images/default/user-1.png\'}}?size=thumb\'); border-radius: 3px !important;\">\r\n</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/organisation-images.html', '<div class=\"organisation-images\">\r\n    <a ng-repeat=\"member in organisations | limitTo: limit\" popup popup-content=\"<card card-type=\'organisation\' card-id=\'{{member._id}}\'></card>\" ng-href=\"org/{{member.stub}}\" class=\"p-2 inline\">\r\n        <div class=\"avatar-square-contain\" style=\"background-image:url({{member.picture}}?size=thumb)\"></div>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/preview-gallery.html', '<div class=\"preview-gallery\">\r\n   <div class=\"rel-box overflow-box\">\r\n       <div layout=\"column\" ng-show=\"gallery.length > 0\">\r\n            <div class=\"preview\" ng-style=\"gallery[previewIndex].url && {\'background-image\':\'url(\'+gallery[previewIndex].url+\'?size=slider&crop=true)\'}\" lightbox=\"true\" lightbox-image=\"gallery[previewIndex].url\"></div>\r\n            <div layout=\"row\" ng-show=\"gallery.length > 1\">\r\n                <div class=\"thumb\" ng-repeat=\"item in gallery\" ng-style=\"item.url && {\'background-image\':\'url(\'+item.url+\'?size=slider&crop=true)\'}\" ng-mouseenter=\"$parent.previewIndex = $index\" lightbox=\"true\" lightbox-image=\"item.url\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/project-image.html', '<md-button class=\"md-circle project-image md-sm md-border-light\"\r\n    ui-sref=\"app.project.overview({\'stub\': imageStub})\"\r\n    popup popup-content=\"<creation-card entity-id=\'{{imageId}}\' size=\'small\'></creation-card>\" popup-fixed-bottom=\"popupFixedBottom\"\r\n    aria-label=\"Organisation\"\r\n    style=\"background-image: url(\'{{src || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\'); border-radius: 3px !important;\">\r\n</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/section-colour.html', '<div class=\"section\" ng-style=\"{background:colour}\">\r\n    <div class=\"container\">\r\n        <div class=\"row ng-transclude\">\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/settings-button.html', '<md-menu hidepublic md-position-mode=\"target-right target\" ng-class=\"{\'above\' : above}\">\r\n    <md-button class=\"md-circle md-xs no-margin\" aria-label=\"Settings\" ng-click=\"$mdOpenMenu();\">\r\n        <md-icon md-svg-src=\"more-h\"></md-icon>\r\n        <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Edit and Settings</md-tooltip>\r\n    </md-button>\r\n    <md-menu-content width=\"2\" ng-transclude>\r\n    </md-menu-content>\r\n</md-menu>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/team-images.html', '<div>\r\n   <div ng-if=\"link!=\'false\'\" class=\"team-images\" layout=\"row\">\r\n        <a ng-repeat=\"member in team | limitTo: limit-1\" popup popup-content=\"<card card-type=\'user\' card-id=\'{{member._id}}\'></card>\" ng-href=\"users/{{member.stub}}\" class=\"p-2 inline\">\r\n            <div class=\"avatar-circle\" style=\"background-image:url({{member.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true)\"></div>\r\n        </a>\r\n        <!-- If the limit is the same as length, we show the last member -->\r\n        <a ng-if=\"limit == team.length\" popup popup-content=\"<card card-type=\'user\' card-id=\'{{team[limit-1]._id}}\'></card>\" ng-href=\"users/{{team[limit-1].stub}}\" class=\"p-2 inline\">\r\n            <div class=\"avatar-circle\" style=\"background-image:url({{team[limit-1].picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true)\"></div>\r\n        </a>\r\n        <!-- Else, we show a counter -->\r\n        <a ng-if=\"team.length > limit\" class=\"p-2 inline\" ng-click=\"showMore()\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{team.length-limit+1}} more team members</md-tooltip>\r\n            <div class=\"avatar-circle text-lightgrey\" layout=\"column\" layout-align=\"center center\" style=\"background: rgb(230, 230, 230);\"><div>+{{team.length-limit+1}}</div></div>\r\n        </a>\r\n    </div>\r\n    <div ng-if=\"link==\'false\'\" class=\"team-images\" layout=\"row\">\r\n        <div ng-repeat=\"member in team | limitTo: limit-1\" class=\"p-2 inline\">\r\n            <div class=\"avatar-circle\" style=\"background-image:url({{member.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true)\"></div>\r\n        </div>\r\n        <!-- If the limit is the same as length, we show the last member -->\r\n        <div ng-if=\"limit == team.length\" class=\"p-2 inline\">\r\n            <div class=\"avatar-circle\" style=\"background-image:url({{team[limit-1].picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true)\"></div>\r\n        </div>\r\n        <!-- Else, we show a counter -->\r\n        <div ng-if=\"team.length > limit\" class=\"p-2 inline\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{team.length-limit+1}} more team members</md-tooltip>\r\n            <div class=\"avatar-circle text-lightgrey\" layout=\"column\" layout-align=\"center center\" style=\"background: rgb(230, 230, 230);\"><div>+{{team.length-limit+1}}</div></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/team-text.html', '<span ng-repeat=\"member in team | limitTo: limit\"><span ng-if=\"$last && team.length <= limit && $index != 0\">&nbsp;and&nbsp;</span><span ng-hide=\"$first || ($last && team.length <= limit)\">,&nbsp;</span><a popup popup-content=\"<card card-type=\'user\' card-id=\'{{member._id}}\'></card>\" ng-href=\"users/{{member.stub}}\">&nbsp;{{member.name}}</a></span>\r\n<span ng-if=\"team.length>limit\">\r\n    and {{team.length-limit}} more.\r\n</span>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/user-image.html', '<md-button class=\"md-circle user-image md-sm\" ng-if=\"imageId\"\r\n   ui-sref=\"app.user.profile({\'stub\': imageStub})\"\r\n   popup popup-content=\"<personcard id=\'{{imageId}}\' size=\'sm\'></personcard>\" popup-fixed-bottom=\"popupFixedBottom\"\r\n   aria-label=\"User\"\r\n   style=\"background-image: url(\'{{src || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\')\">\r\n</md-button>\r\n\r\n<md-button class=\"md-circle user-image md-sm no-pointer\" ng-if=\"!imageId\"\r\n   aria-label=\"User\"\r\n   style=\"background-image: url(\'{{src || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\')\">\r\n</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/components/tpls/user-input.html', '<div class=\"user-input\" ng-class=\"status.active ? \'active\' : \'inactive\'\" ng-click=\"status.active = true\">\r\n    <div class=\"header\" layout=\"row\" layout-align=\"start center\" authenticate style=\"outline: none;\">\r\n        <!--   ng-click=\"inputFn($event, inputFnData); inputFnParent()\"-->\r\n        <user-image class=\"m-r-15\" src=\"user.picture\"></user-image>\r\n        <div class=\"text-switch\" flex>\r\n            <div ng-class=\"{\'active\':status.active}\">\r\n                <p class=\"m-v-0 text-lightgrey\">{{::placeholder || typeInfo.inputPlaceholder || \'Ask a Question...\'}}</p>\r\n                <p class=\"m-v-0 text-green\">{{user.name}}<span class=\"text-lightgrey\">&nbsp;{{titleText}}</span></p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div ng-if=\"status.active\" class=\"collapse-details\">\r\n        <modular-editor class=\"editor-compact minimal\" editor-sections=\"sectionData\" editor-options=\"editorOptions\" edit=\"true\" focus=\"status.active\"></modular-editor>\r\n        <div ng-show=\"status.active\" class=\"anim-fade-quick\" layout=\"column\" layout-gt-sm=\"row\" layout-align-gt-sm=\"start center\">\r\n            <div flex>\r\n                <md-radio-group ng-if=\"radioDetails.options.length>1\" layout=\"row\" layout-align=\"start center\" ng-model=\"radioDetails.selected\">\r\n                    <md-radio-button ng-repeat=\"option in radioDetails.options\" value=\"{{option.val}}\">{{option.title}}</md-radio-button>\r\n                </md-radio-group>\r\n            </div>\r\n            <md-button class=\"md-raised md-accent md-flat md-cornered m-0\" ng-click=\"submit()\">{{::saveText || \'Submit\'}}</md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/contributors/tpls/contributors.html', '<div infinite-scroll=\"more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"loading\">\r\n    <div class=\"rel-box\">\r\n        <user-row ng-repeat=\"item in results\" item-id=\"{{item}}\"></user-row>\r\n    </div>\r\n    <div class=\"text-no-results\" ng-show=\"noMoreResults\">That\'s all there is.</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/core/tpls/core-entity-modal.html', '<md-dialog aria-label=\"dialog\">\r\n    <md-dialog-content>\r\n        <div class=\"md-content-container content-xs\">\r\n            <h1 class=\"md-headline m-t-0\">{{options.title || \'Entities\'}}</h1>\r\n            <row-view ng-repeat=\"item in enitities\" data=\"item\"></row-view>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/development/vertical-nav/vertical-nav.html', '<div class=\"vertical-nav {{menu[activeIndex].color}}\">\r\n    <div ng-repeat=\"item in menu\" du-scrollspy=\"{{item.id}}\" offset=\"{{halfWindowHeight}}\">\r\n        <a ng-href=\"#{{item.id}}\" du-smooth-scroll offset=\"0\">\r\n            <div class=\"dot\"></div>\r\n            <div class=\"tooltip\">{{item.name}}</div>\r\n        </a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/dynamic-footer/tpls/dynamic-footer.html', '<div class=\"dynamic-footer\" ng-if=\"$dynamicFooter.open && $dynamicFooter.enabled\" ng-transclude></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/dynamic-footer/tpls/entity-footer.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <!-- PUBLIC FOOTER -->\r\n    <div ng-if=\"entity.published && !showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n        <stat-button display-style=\"circle\" type=\"like\"   parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" count=\"entity.likes\" class=\"green\"></stat-button>\r\n        <a stat-display-modal               type=\"like\"   parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" class=\"text-lightgrey count\">{{entity.likes || 0}}</a>\r\n        <md-button class=\"md-icon-button md-sm m-0\" aria-label=\"comments\" scroll-highlight=\"reply\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Comment</md-tooltip>\r\n            <md-icon md-svg-icon=\"response\"></md-icon>\r\n        </md-button>\r\n        <a class=\"text-lightgrey count\" scroll-highlight=\"responses\">{{entity.posts.length || 0}}</a>\r\n        <stat-button hide-sm entity-text=\"{{altType}}\"  type=\"follow\" parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" count=\"entity.followers\" class=\"lg m-l-15\"></stat-button>\r\n        <div flex></div>\r\n        <social-share-buttons></social-share-buttons>\r\n    </div>\r\n    <!-- PRIVATE FOOTER -->\r\n    <div ng-if=\"entity.published && showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n        <stat-button display-style=\"circle\" type=\"like\"   parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" count=\"entity.likes\" class=\"green\"></stat-button>\r\n        <a stat-display-modal               type=\"like\"   parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" class=\"text-lightgrey count\">{{entity.likes || 0}}</a>\r\n        <md-button class=\"md-icon-button md-sm m-0\" aria-label=\"comments\" scroll-highlight=\"reply\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Comment</md-tooltip>\r\n            <md-icon md-svg-icon=\"response\"></md-icon>\r\n        </md-button>\r\n        <a class=\"text-lightgrey count\" scroll-highlight=\"responses\">{{entity.posts.length || 0}}</a>\r\n        <stat-button hide-sm entity-text=\"{{altType}}\"  type=\"follow\" parent-type=\"{{entity.type}}\" parent-id=\"{{entity._id}}\" count=\"entity.followers\" class=\"lg m-l-15\"></stat-button>\r\n        <div flex></div>\r\n        <md-button hide-sm class=\"md-accent md-border md-cornered\" ng-click=\"editFn()\">Edit</md-button>\r\n        <social-share-buttons></social-share-buttons>\r\n    </div>\r\n    <!-- PUBLISH FOOTER -->\r\n    <div ng-if=\"!entity.published && showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n        <div flex class=\"ellipsis text-lightgrey\"><b>Important:</b> This {{altType}} has not been published yet.</div>\r\n        <md-button class=\"md-accent md-border md-cornered\" ng-click=\"editFn()\">Edit</md-button>\r\n        <md-button hide-sm class=\"md-raised md-accent md-flat md-border-green md-cornered m-0\" ng-click=\"publishFn($event)\">Publish {{altType}}</md-button>\r\n        <md-button publish-share-link=\"{{entity._id}}\" class=\"md-icon-button m-0 md-grey md-sm\" aria-label=\"share\">\r\n            <md-icon md-svg-icon=\"share\"></md-icon>\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Share Private Link</md-tooltip>\r\n        </md-button>\r\n    </div>\r\n    <!-- PUBLISH FOOTER PUBLIC -->\r\n    <div ng-if=\"!entity.published && !showEdit\" class=\"md-content-container md-no-padding\" layout=\"column\" layout-align=\"center\">\r\n        <div class=\"ellipsis text-lightgrey text-center\">You have been given a private link to this page. Only people with the link can see it.</div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/edit-toolbar/tpls/edit-toolbar.html', '<div layout=\"row\" layout-align=\"start center\" ng-transclude></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/edit-toolbar/tpls/save-button.html', '<md-button ng-click=\"save()\" class=\"md-accent md-border md-cornered {{buttonClass}}\">\r\n    <span ng-show=\"status == \'unsaved\'\" ng-transclude></span>\r\n    <span ng-show=\"status == \'saved\'\">Saved</span>\r\n    <span ng-show=\"status == \'saving\'\">Saving<loading-dots></loading-dots></span>\r\n</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/editor/tpls/insert-link-modal.html', '<md-dialog>\r\n    <form novalidate name=\"LinkForm\" ng-submit=\"save()\">\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div style=\"width: 500px;\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px; margin-bottom: 40px;\">So, what\'s the Url?</h1>\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Website Url</label>\r\n                        <input name=\"link\" ng-model=\"link\" type=\"text\" focus-me=\"true\"\r\n                        required ng-minlength=\"10\" ng-maxlength=\"200\" ng-pattern=\"/((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)/\">\r\n                        <div ng-messages=\"LinkForm.link.$error\" ng-if=\"LinkForm.link.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                            <div ng-message=\"minlength\">A little short don\'t you think?</div>\r\n                            <div ng-message=\"maxlength\">Wow, that is a long Url... Too long...</div>\r\n                            <div ng-message=\"pattern\">Sorry, that isn\'t a valid Url... Make sure you include http://</div>\r\n                        </div>\r\n                    </md-input-container>\r\n            </div>\r\n        </md-dialog-content>\r\n        <div class=\"md-actions\" layout=\"row\">\r\n            <div flex></div>\r\n            <div>\r\n                <md-button type=\"button\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"LinkForm.$invalid\">Insert</md-button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/editor/tpls/reply-editor.html', '<div attention-animation animate-toggle=\"{{animate}}\" class=\"reply-editor content-md\" ng-class=\"{\'minimised\' : editor.minimised}\" ng-if=\"editor.visible\">\r\n    <md-container>\r\n        <div class=\"rel-box\">\r\n<!--            <user-image src=\"currentUser.picture\"></user-image>-->\r\n            <form novalidate name=\"replyForm\" ng-submit=\"submit()\" style=\"margin-top: 20px;\">\r\n                <div class=\"top-right\" layout=\"row\">\r\n                   	<div ng-show=\"editor.minimised\">\r\n						<md-button type=\"button\" class=\"md-circle md-xs no-margin\" ng-click=\"editor.show()\">\r\n							<md-icon md-svg-icon=\"add\"></md-icon>\r\n							<md-tooltip md-direction=\"top\" md-autohide=\"true\">Maximise</md-tooltip>\r\n						</md-button>\r\n                    </div>\r\n                    <div ng-hide=\"editor.minimised\">\r\n						<md-button type=\"button\" class=\"md-circle md-xs no-margin\" ng-click=\"editorOptions.showHelp = !editorOptions.showHelp\">\r\n							<md-icon md-svg-icon=\"help\"></md-icon>\r\n							<md-tooltip md-direction=\"top\" md-autohide=\"true\">Help with editor</md-tooltip>\r\n						</md-button>\r\n						<md-button type=\"button\" class=\"md-circle md-xs no-margin\" ng-click=\"editor.minimise()\">\r\n							<md-icon md-svg-icon=\"remove\"></md-icon>\r\n							<md-tooltip md-direction=\"top\" md-autohide=\"true\">Minimise</md-tooltip>\r\n						</md-button>\r\n					</div>\r\n                    <md-button type=\"button\" class=\"md-circle md-xs no-margin\" ng-click=\"closeFn()\">\r\n                        <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n                        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Close</md-tooltip>\r\n                    </md-button>\r\n                </div>\r\n                <modular-editor class=\"editor-compact md-content-container content-sm\" style=\"min-height: 120px; max-height: 90vh; margin: auto; overflow-y: auto;\" editor-sections=\"editor.model\" editor-options=\"editorOptions\" edit=\"true\"></modular-editor>\r\n                <div layout=\"row\">\r\n                    <div flex></div>\r\n                    <md-button type=\"submit\" class=\"md-accent md-raised no-margin\" ng-disabled=\"replyForm.$invalid\">{{editor.submitText}}</md-button>\r\n                </div>\r\n            </form>\r\n        </div>\r\n    </md-container>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/error-handling/tpls/error-modal.html', '<md-dialog aria-label=\"error\">\r\n    <md-dialog-content style=\"width: 500px;\">\r\n        <h1 class=\"md-headline\" style=\"margin-top: 0px;\">{{data.title}}</h1>\r\n        <p ng-bind-html=\"data.body\"></p>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex></div>\r\n        <div>\r\n            <md-button class=\"\" ng-click=\"cancel()\" ng-show=\"data.cancelText\">{{data.cancelText}}</md-button>\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"confirm()\">{{data.confirmText || \'Ok\'}}</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/explanation-modals/tpls/explanation-modal.html', '<md-dialog class=\"explanation-modal\">\r\n    <div class=\"banner\" style=\"background-color: #000031\" layout=\"row\" layout-align=\"center center\">\r\n        <img src=\"{{modal.image}}\">\r\n    </div>\r\n    <md-dialog-content>\r\n        <div layout=\"column\" layout-align=\"start center\">\r\n            <h1 class=\"md-headline m-0 text-center\">{{modal.title}}</h1>\r\n            <div class=\"content\" ng-bind-html=\"modal.body\"></div>\r\n            <md-button class=\"md-raised md-flat md-accent md-cornered md-md\" ng-click=\"cancel()\">{{modal.buttonText}}</md-button>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/card-feed.html', '<div class=\"card-feed m-b-60 rel-box overflow-x-box\">\r\n    <div layout=\"row\" layout-wrap style=\"margin: 0 -15px;\">\r\n        <creation-card flex=\"33\" flex-md=\"50\" flex-sm=\"100\" style=\"padding: 0 15px 30px;\" ng-repeat=\"item in query.results\" entity=\"item.data\"></creation-card>\r\n    </div>\r\n    <div ng-hide=\"query.notEnoughResults || hideMore\">\r\n        <a class=\"well-button\" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n            <div>{{query.noMoreResults ? messageNoMore : messageMore}}</div>\r\n        </a>\r\n    </div>\r\n    <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/feed-item.html', '<div class=\"rel-box\" id=\"{{id}}\" style=\"min-height: 130px;\">\r\n    <loading-feed ng-if=\"loading\"></loading-feed>\r\n    <div ng-if=\"!loading\" layout=\"column\">\r\n        <!-- HEADER BLOCK  -->\r\n        <div class=\"header-block\" hide-sm>\r\n            <span class=\"capitalise\">{{::altType}}</span>\r\n            <span ng-show=\"::fields.length>0\">&nbsp;tagged in:</span>\r\n            <item-fields fields=\"::fields\" limit=\"3\"></item-fields>\r\n        </div>\r\n        <!-- CONTENT BLOCK  -->\r\n        <div layout=\"row\" layout-sm=\"column\" >\r\n            <div flex flex-order-sm=\"2\">\r\n                <!-- TITLE BLOCK -->\r\n                <h2 class=\"item-title\">\r\n                    <a ui-sref=\"{{::sref}}\">{{::title}}</a>\r\n                </h2>\r\n                <!-- DESCRIPTION BLOCK -->\r\n                <div class=\"item-description\">\r\n                    <a ui-sref=\"{{::sref}}\" ng-bind-html=\"blurb\"></a>\r\n                </div>\r\n            </div>\r\n            <div flex-order-sm=\"1\">\r\n                <!-- IMAGE BLOCK -->\r\n                <item-image ng-if=\"::image\">\r\n                    <a ui-sref=\"{{::sref}}\"><div ng-style=\"::image && {\'background-image\': \'url(\'+image+\'?size=feed-sm&crop=true)\'}\"></div></a>\r\n                </item-image>\r\n            </div>\r\n        </div>\r\n        <!-- OWNER AND TIME BLOCK -->\r\n        <div layout=\"row\" layout-align=\"space-between center\">\r\n            <item-owner class=\"ellipsis-container\" flex avatar=\"{{avatar}}\" type=\"{{ownerType}}\" owner-stub=\"{{ownerStub}}\" owner-id=\"{{ownerId}}\">\r\n                <h3><a ui-sref=\"{{::ownerSref}}\" class=\"text-green ellipsis inline\">{{owner}}</a></h3>\r\n                <div class=\"sub ellipsis\">\r\n                    <a ng-if=\"subOwnerSref && subOwner\" ui-sref=\"{{::subOwnerSref}}\">{{::subOwner}}</a>\r\n                    <span ng-if=\"::subOwner\" class=\"interpunct\"></span>\r\n                    <a ui-sref=\"{{::sref}}\">{{::timeDesc}} <span am-time-ago=\"::time\"></span></a>\r\n                </div>\r\n            </item-owner>\r\n\r\n            <div class=\"stats\" layout=\"row\" layout-align=\"start center\">\r\n                <stat-button type=\"like\" parent-type=\"{{type}}\" parent-id=\"{{id}}\" count=\"likes.num\" display-style=\"circle\" class=\"green\" style=\"margin-right: -3px;\"></stat-button>\r\n                <a class=\"count\" stat-display-modal parent-id=\"{{::id}}\" parent-type=\"{{::type}}\" type=\"like\">\r\n                    {{likes.num || 0}}\r\n                </a>\r\n                <md-button class=\"md-icon-button md-sm\" aria-label=\"comments\" ui-sref=\"{{::srefComments}}\" style=\"margin-right: -3px;\">\r\n                    <md-icon md-svg-icon=\"response\"></md-icon>\r\n                </md-button>\r\n                <a class=\"count\" ui-sref=\"{{::srefComments}}\">{{::numPosts || 0}}</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/feed-loading.html', '<div class=\"loading-item\" style=\"margin-bottom: 20px;\">\r\n    <div class=\"loading-animation\" layout=\"column\">\r\n        <!-- HEADER BLOCK  -->\r\n        <div class=\"header-block\" hide-sm>\r\n            <div class=\"loading-text sm\"></div>\r\n        </div>\r\n        <!-- CONTENT BLOCK  -->\r\n        <div layout=\"row\" layout-sm=\"column\" >\r\n            <div flex flex-order-sm=\"2\">\r\n                <!-- TITLE BLOCK -->\r\n                <h2 class=\"item-title\">\r\n                    <div class=\"loading-text lg\"></div>\r\n                </h2>\r\n                <!-- DESCRIPTION BLOCK -->\r\n                <div class=\"item-description\">\r\n                    <div class=\"loading-text wide\"></div>\r\n                    <div class=\"loading-text wide\"></div>\r\n                    <div class=\"loading-text md\"></div>\r\n                </div>\r\n            </div>\r\n            <div flex-order-sm=\"1\">\r\n                <!-- IMAGE BLOCK -->\r\n                <item-image>\r\n                    <div class=\"loading\"></div>\r\n                </item-image>\r\n            </div>\r\n        </div>\r\n        <!-- OWNER AND TIME BLOCK -->\r\n        <div layout=\"row\" layout-align=\"start center\">\r\n            <div class=\"loading-avatar\" style=\"margin-right: 10px;\"></div>\r\n            <div layout=\"column\">\r\n                <div><div class=\"loading-text md\"></div></div>\r\n                <div><div class=\"loading-text sm\"></div></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/feed-recommend.html', '<md-menu-item show-if-admin>\r\n	<md-button ng-click=\"recommend()\">Recommend</md-button>\r\n</md-menu-item>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/feed-widget-timeline.html', '<div class=\"feed-widget-timeline\" layout=\"column\">\r\n    <div class=\"well-box\" layout=\"column\">\r\n        <div class=\"text-lightgrey\" ng-show=\"query.results.length == 0\">{{typeInfo.empty}} <a ng-show=\"showEdit\" ng-click=\"typeInfo.inputFn($event, inputFnData)\" class=\"text-green\">Add one.</a></div>\r\n        <div class=\"feed-widget-item anim-repeat-stagger-fade\" ng-repeat=\"item in query.results | limitTo: 3\" layout=\"row\">\r\n            <dot class=\"dot-lg\">\r\n<!--               ng-class=\"{\'green\' : $index == 1}\"-->\r\n                <md-tooltip md-direction=\"left\" md-autohide= \"true\">Updated <span am-time-ago=\"item.data.updated\"></span></md-tooltip>\r\n            </dot>\r\n            <a class=\"text\" flex ui-sref=\"{{item.data.sref}}\" layout=\"column\">\r\n                <div>{{item.data.name}}</div>\r\n                <div class=\"text-lightgrey\">{{item.data.owner.name}}</div>\r\n            </a>\r\n        </div>\r\n    </div>\r\n    <a ng-show=\"query.results.length > 3\" ui-sref=\"{{typeInfo.moreSref}}\" class=\"text-green text-right m-t-15\">See more</a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/feed-widget.html', '<div class=\"well\" style=\"margin-bottom: 20px;\" layout=\"column\">\r\n    <div ng-show=\"query.results.length > 0\" layout=\"column\">\r\n        <a ui-sref=\"{{typeInfo.moreSref}}\" class=\"heading underline capitalise\">\r\n            Latest {{type}}\r\n        </a>\r\n        <div>\r\n            <a class=\"feed-widget-item\" ng-repeat=\"item in query.results\"  ui-sref=\"{{item.data.sref}}\" md-ink-ripple>\r\n                <div clamp=\"2\">{{item.data.name}}</div>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"text-lightgrey meta\">\r\n                    <div flex am-time-ago=\"item.data.updated\"></div>\r\n                    <div>{{item.data.numComments + item.data.numPosts}}</div>\r\n<!--                    repl{{(item.data.numComments + item.data.numPosts == 1) ? \'y\' : \'ies\'}}-->\r\n                    <md-icon md-svg-icon=\"response\">\r\n                        <md-tooltip md-direction=\"right\" md-autohide=\"true\">Replies</md-tooltip>\r\n                    </md-icon>\r\n                </div>\r\n            </a>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"text-lightgrey\" ng-show=\"data.length == 0\">No {{type}} yet. <a ng-show=\"showEdit\" ng-click=\"typeInfo.inputFn($event, inputFnData)\" class=\"text-green\">Add one.</a></div>\r\n\r\n    <a ng-show=\"!showEdit && query.results.length >= 3\" ui-sref=\"{{typeInfo.moreSref}}\" class=\"text-green text-right\">See more</a>\r\n    <md-button ng-show=\"showEdit && query.results.length>0\" class=\"md-accent md-raised md-cornered capitalise no-margin\" ng-click=\"typeInfo.inputFn($event, inputFnData)\">\r\n        {{typeInfo.inputPlaceholder}}\r\n    </md-button>\r\n</div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/feed.html', '<md-container ng-if=\"!contained\">\r\n    <md-divider ng-if=\"!typeInfo.inputPlaceholder || parentType == \'user\'\"></md-divider>\r\n    <user-input ng-if=\" typeInfo.inputPlaceholder && parentType != \'user\' && ! hideInput\"\r\n    placeholder=\"{{typeInfo.inputPlaceholder}}\" section-data=\"sectionData\" save-fn=\"newEntitySubmit()\" save-text=\"Save Draft\" radio-details=\"radioDetails\"></user-input>\r\n</md-container>\r\n\r\n<div ng-if=\"!contained\" class=\"feed\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"query.loading || query.noMoreResults\">\r\n    <div ng-repeat=\"item in query.results\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container md-no-padding\">\r\n                <feed-item data=\"item\" size=\"{{size}}\"></feed-item>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div ng-if=\"query.loading && !query.noMoreResults\" layout=\"row\" layout-align=\"center\">\r\n        <md-progress-circular class=\"md-accent\" md-mode=\"indeterminate\"></md-progress-circular>\r\n    </div>\r\n\r\n    <md-container ng-show=\"querynoMoreResults\">\r\n        <div class=\"text-no-results\">\r\n            <span ng-show=\"query.results.length > 0\">{{typeInfo.noMoreMulti}}</span>\r\n            <span ng-hide=\"query.results.length > 0\">{{typeInfo.noMoreSingular}}</span>\r\n            <span ng-show=\"showEdit\" class=\"text-green\">\r\n				<a class=\"underlined\" ng-click=\"typeInfo.inputFn($event, inputFnData)\">\r\n					Create One\r\n				</a>\r\n            </span>\r\n        </div>\r\n    </md-container>\r\n</div>\r\n\r\n<div ng-if=\"contained\" class=\"feed\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"query.loading || query.noMoreResults\">\r\n<!--\r\n    <user-input ng-if=\" typeInfo.inputPlaceholder && parentType != \'user\' && ! hideInput\" class=\"m-b-15\"\r\n    placeholder=\"{{typeInfo.inputPlaceholder}}\" section-data=\"sectionData\" save-fn=\"newEntitySubmit()\" save-text=\"Save Draft\" radio-details=\"radioDetails\"></user-input>\r\n-->\r\n\r\n    <div ng-repeat=\"item in query.results\">\r\n        <feed-item  data=\"item\" size=\"{{size}}\"></feed-item>\r\n        <call-to-action ng-if=\"($index+1) % 10 == 0 && parentType != \'user\'\"></call-to-action>\r\n    </div>\r\n\r\n    <div ng-if=\"query.loading && !query.noMoreResults\" layout=\"row\" layout-align=\"center\">\r\n        <md-progress-circular class=\"md-accent\" md-mode=\"indeterminate\"></md-progress-circular>\r\n    </div>\r\n\r\n    <div ng-show=\"query.noMoreResults\">\r\n        <div class=\"text-no-results\">\r\n            <span ng-show=\"query.results.length > 0\">{{typeInfo.noMoreMulti}}</span>\r\n            <span ng-hide=\"query.results.length > 0\">{{typeInfo.noMoreSingular}}</span>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/item-fields.html', '<span ng-repeat=\"field in fields | limitTo: limit\"><span ng-show=\"$last && fields.length <= limit && $index != 0\">&nbsp;and&nbsp;</span><span ng-hide=\"$first || ($last && fields.length <= limit)\">,&nbsp;</span><a ui-sref=\"{{field.sref}}\" class=\"text-green\">{{field.name}}</a></span>\r\n<span ng-show=\"fields.length>limit\">\r\n    and {{fields.length-limit}} more.\r\n</span>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/item-image.html', '<div class=\"item-image\" md-ink-ripple ng-transclude>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/tpls/item-owner.html', '<div class=\"item-owner\" layout=\"row\">\r\n    <div class=\"image\">\r\n        <user-image         src=\"::avatar\" image-id=\"{{::ownerId}}\" image-stub=\"{{::ownerStub}}\" ng-if=\"type==\'user\'\"></user-image>\r\n        <organisation-image src=\"::avatar\" image-id=\"{{::ownerId}}\" image-stub=\"{{::ownerStub}}\" ng-if=\"type==\'organisation\'\"></organisation-image>\r\n        <project-image      src=\"::avatar\" image-id=\"{{::ownerId}}\" image-stub=\"{{::ownerStub}}\" ng-if=\"type==\'project\'\"></project-image>\r\n    </div>\r\n    <div class=\"ellipsis-container\" flex ng-transclude>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/widget-timeline/tpls/feed-widget-files.html', '');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/feed/widget-timeline/tpls/feed-widget-timeline.html', '<div class=\"feed-widget-timeline\" layout=\"column\">\r\n    <div class=\"well-box\" layout=\"column\">\r\n        <div class=\"text-lightgrey\" ng-show=\"query.results.length == 0\">{{typeInfo.empty}} <a ng-show=\"showEdit\" ng-click=\"typeInfo.inputFn($event, inputFnData)\" class=\"text-green\">Add one.</a></div>\r\n        <div class=\"feed-widget-item anim-repeat-stagger-fade\" ng-repeat=\"item in query.results | limitTo: 3\" layout=\"row\">\r\n            <dot class=\"dot-lg\">\r\n<!--               ng-class=\"{\'green\' : $index == 1}\"-->\r\n                <md-tooltip md-direction=\"left\" md-autohide= \"true\">Updated <span am-time-ago=\"item.data.updated\"></span></md-tooltip>\r\n            </dot>\r\n            <a class=\"text\" flex ui-sref=\"{{item.data.sref}}\" layout=\"column\">\r\n                <div>{{item.data.name}}</div>\r\n                <div class=\"text-lightgrey\">{{item.data.owner.name}}</div>\r\n            </a>\r\n        </div>\r\n    </div>\r\n    <a ng-show=\"query.results.length > 3\" ui-sref=\"{{typeInfo.moreSref}}\" class=\"text-green text-right m-t-15\">See more</a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/fields/tpls/field-card.html', '<div class=\"card field-card relative-box\" ng-class=\"{\'card-sm\' : (size==\'sm\'), }\">\r\n    <a class=\"banner\" ng-href=\"/fields/{{data.stub}}\">\r\n        <div class=\"bounding-box\" ng-style=\"data.banner.url && {\'background-image\':\'url(\'+data.banner.url+\'?size=banner-sm&crop=true)\'}\" ng-class=\"{\'background-gradient-1\' : !data.banner.url}\"></div>\r\n    </a>\r\n    <div class=\"content\">\r\n        <div class=\"name\">\r\n            <a ng-href=\"/fields/{{data.stub}}\">{{data.name}}</a>\r\n        </div>\r\n        <stat-button hide-stat=\"false\" size=\"sm\" type=\"follow\" parent-type=\"field\" parent-id=\"{{data._id}}\" count=\"data.followers\"></stat-button>\r\n        <a style=\"margin-left:5px;\" ng-href=\"/fields/{{data.stub}}?tab=projects\" class=\"btn btn-white btn-sm\">{{data.numProjects}} Project<span ng-hide=\"data.numProjects == 1\">s</span></a>\r\n    </div>\r\n    <div class=\"card-loading-overlay anim-fade\" ng-show=\"loading\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/fields/tpls/field-new-modal.html', '<md-dialog>\r\n    <form unsaved-warning-form novalidate name=\"NewFieldForm\">\r\n        <md-dialog-content>\r\n            <div class=\"md-content-container content-xs\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Add a new field</h1>\r\n                <br>\r\n                <br>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Field Name</label>\r\n                    <input name=\"name\" ng-model=\"data.name\"\r\n                    required ng-pattern=\"/[a-zA-Z0-9 !#.,\'\\-\\(\\)]*/\" ng-keyup=\"checkFieldExists(data.name)\">\r\n                    <div ng-messages=\"NewFieldForm.name.$error\" ng-if=\"NewFieldForm.name.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                        <div ng-message=\"pattern\">Sorry, that field name is invalid. You can\'t use the characters: / \\ [ ]</div>\r\n                        <div ng-message=\"fieldexists\">A field with that name already exists. Try another.</div>\r\n                    </div>\r\n                </md-input-container>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Description</label>\r\n                    <textarea name=\"blurb\" ng-model=\"data.blurb\" columns=\"1\" md-maxlength=\"500\" focus-me=\"true\"></textarea>\r\n                </md-input-container>\r\n                <div class=\"md-dialog-footer\" layout=\"row\">\r\n                    <div flex></div>\r\n                    <div>\r\n                        <md-button ng-click=\"cancel()\">Cancel</md-button>\r\n                        <md-button style=\"margin-right: 0px;\" class=\"md-accent md-raised\" ng-disabled=\"NewFieldForm.$invalid\" ng-click=\"save()\">Save</md-button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/following/tpls/following-detailed.html', '\r\n<div class=\"line-divider-bottom m-v-30\" layout=\"row\" ng-if=\"showDivider\">\r\n    <div class=\"md-subhead\" flex>{{typeInfo.typeTitle}}</div>\r\n</div>\r\n<row-view ng-repeat=\"item in query.results\" data=\"item\"></row-view>\r\n<div ng-hide=\"query.notEnoughResults || hideMore\">\r\n    <a class=\"well-button m-t-30\" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n        <div>{{query.noMoreResults ? \'No more results\' : \'Load more\'}}</div>\r\n    </a>\r\n</div>\r\n<!--<div class=\"text-no-results\" ng-show=\"noMoreResults\">No more results</div>-->\r\n\r\n<div ng-show=\"items.length==0\" class=\"text-lightgrey\">\r\n    <div ng-show=\"showEdit\">\r\n        You are not following any {{typeInfo.typeTitle}} yet.\r\n        <a ui-sref=\"{{typeInfo.followSome}}\" class=\"text-green\">Follow some!</a>\r\n    </div>\r\n    <div ng-show=\"!showEdit\">\r\n        Nothing here yet.\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/footer/tpls/footer.html', '<div class=\"main-footer\" layout=\"row\" layout-align=\"center\" ng-hide=\"LayoutOptions.footer.hideFooter\">\r\n    <div class=\"md-content-container md-no-padding\" layout=\"column\">\r\n        <div layout=\"row\" layout-align=\"center\" class=\"m-b-15\">\r\n            <div class=\"column\" layout=\"column\">\r\n                <h3 class=\"md-subhead\">Discover</h3>\r\n                <a href=\"/browse/projects\">Ongoing Projects</a>\r\n                <a href=\"/browse/threads\">Questions</a>\r\n                <a href=\"/browse/organisations\">Organisations</a>\r\n                <a href=\"/browse/fields\">Fields</a>\r\n                <a href=\"/browse/jobs\">Jobs</a>\r\n            </div>\r\n            <div class=\"column\" layout=\"column\">\r\n                <h3 class=\"md-subhead\">STEMN</h3>\r\n                <a href=\"/landing\">Landing Page</a>\r\n                <a href=\"/projects/stemn\">About</a>\r\n                <a href=\"/org/stemn/jobs\">Careers</a>\r\n            </div>\r\n            <div hide-sm class=\"column\" layout=\"column\">\r\n                <h3 class=\"md-subhead\">Community</h3>\r\n                <a href=\"/partners\">Partners</a>\r\n                <a href=\"/blogs/community\">Volunteer for STEMN</a>\r\n            </div>\r\n            <div hide-sm class=\"column\" layout=\"column\">\r\n                <h3 class=\"md-subhead\">Contact</h3>\r\n                <a href=\"/contact\">Say Hello</a>\r\n                <a href=\"/terms\">Terms and Privacy</a>\r\n            </div>\r\n        </div>\r\n        <md-divider class=\"m-v-30\"></md-divider>\r\n        <div layout=\"column\" layout-align=\"center\">\r\n            <div class=\"dark-grey text-center m-b-10\">Join Us On</div>\r\n            <div class=\"m-b-10\" layout=\"row\" layout-align=\"center center\">\r\n                <md-button href=\"https://www.facebook.com/stem.network\" class=\"md-icon-button md-sm m-0\" target=\"_blank\">\r\n                    <md-icon class=\"s30\" md-svg-icon=\"facebook\"></md-icon>\r\n                    <md-tooltip md-direction=\"left\" md-autohide=\"true\">Like us on Facebook</md-tooltip>\r\n                </md-button>\r\n                <md-button href=\"https://twitter.com/stem_network\" class=\"md-icon-button md-sm m-0\" target=\"_blank\">\r\n                    <md-icon class=\"s30\" md-svg-icon=\"twitter\"></md-icon>\r\n                    <md-tooltip md-direction=\"right\" md-autohide=\"true\">Like us on Twitter</md-tooltip>\r\n                </md-button>\r\n            </div>\r\n            <div class=\"dark-grey text-center\">© STEMN</div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/forum/thread-create-modal/tpls/thread-create-modal.html', '<md-dialog aria-label=\"Create Thread\">\r\n\r\n    <div class=\"md-modal-header\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"onboarding-steps\" layout=\"row\" layout-align=\"start center\">\r\n            <div ng-repeat=\"tab in tabs\" layout=\"row\" layout-align=\"start center\">\r\n                <a class=\"md-subhead\" ng-click=\"steps[tab].clickFn()\" ng-class=\"{\'active\' : activeTab.label == steps[tab].label, \'disabled\' : steps[tab].isDisabled()}\">{{steps[tab].label}}</a>\r\n                <md-icon md-svg-icon=\"chevron-right\" ng-hide=\"$last\"></md-icon>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <md-dialog-content class=\"bg-lightgrey overflow-x-box p-0\">\r\n        <div class=\"md-content-container content-md\" style=\"padding: 30px;\">\r\n            <div ng-include=\"activeTab.path\"></div>\r\n            <div layout=\"row\" class=\"m-t-30\">\r\n                <div flex></div>\r\n                <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-disabled=\"steps[activeTab.label].isDisabled()\" ng-click=\"steps[activeTab.label].nextFn()\">\r\n                    {{steps[activeTab.label].nextText}}\r\n                </md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/forum/thread-create-modal/tpls/thread-create-modal.overview.html', '<form name=\"forms.nameForm\">\r\n    <h2 class=\"md-display-1\">Create Thread</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Enter general display details such as name and type. You\'ll be able to add more information later.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Thread Name</div>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Name</label>\r\n                    <input name=\"name\" ng-model=\"thread.name\"\r\n                    required type=\"text\" focus-me=\"true\">\r\n                    <div ng-messages=\"forms.nameForm.name.$error\" ng-if=\"forms.nameForm.name.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                    </div>\r\n                </md-input-container>\r\n            </div>\r\n<!--\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Thread Type</div>\r\n                <md-select placeholder=\"Post type\" ng-model=\"thread.type\" class=\"block\" name=\"type\">\r\n                    <md-option value=\"question\">Question</md-option>\r\n                    <md-option value=\"general\">General Discussion</md-option>\r\n                    <md-option value=\"blog\">Blog</md-option>\r\n                </md-select>\r\n            </div>\r\n-->\r\n            <div class=\"card-z1 card-padding m-b-30\" ng-show=\"thread.fields.length > 0 || thread.organisations.length > 0 || thread.projects.length > 0\">\r\n                <div class=\"md-subhead m-b-15\" flex>Thread Tags</div>\r\n                <p class=\"body-small\">This thread will be linked to the following pages: (you can change this later)</p>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"thread.projects\" type=\"project\"></tags>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"thread.organisations\" type=\"organisation\"></tags>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"thread.fields\" type=\"field\"></tags>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/forum/thread-timeline/tpls/thread-timeline-item.html', '<div ng-if=\"item.event != \'post\'\" style=\"padding-left: 20px; margin-top: -15px;\">\r\n    <div class=\"timeline-item\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"timeline-marker\" layout=\"column\" layout-align=\"center center\"><md-icon md-svg-icon=\"{{iconMap[item.event]}}\"></md-icon></div>\r\n        <div ng-if=\"item.event == \'label\'\" class=\"timeline-content\" flex>\r\n            <b>{{item.user.name}}</b>\r\n            <span ng-show=\"item.added.length>0\">added the&nbsp;<span class=\"label\" label-style=\"{{label}}\" ng-repeat=\"label in item.added\">{{label}}</span>{{item.added.length == 1 ? \'label\' : \'labels\'}}</span>\r\n            <span ng-show=\"item.added.length>0 && item.removed.length>0\">&nbsp;and&nbsp;</span>\r\n            <span ng-show=\"item.removed.length>0\">removed the&nbsp;<span class=\"label\" label-style=\"{{label}}\" ng-repeat=\"label in item.removed\">{{label}}</span>{{item.removed.length == 1 ? \'label\' : \'labels\'}}</span>\r\n            <span>{{item.timestamp | amTimeAgo}}.</span>\r\n        </div>\r\n        <div ng-if=\"item.event == \'update\'\" class=\"timeline-content\" flex>\r\n            <b>{{item.user.name}}</b> updated the original post.\r\n        </div>\r\n        <div ng-if=\"item.event == \'open\'\" class=\"timeline-content\" flex>\r\n            <b>{{item.user.name}}</b> re-opened this thread.\r\n        </div>\r\n        <div ng-if=\"item.event == \'closed\'\" class=\"timeline-content\" flex>\r\n            <b>{{item.user.name}}</b> closed this thread.\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<post ng-if=\"item.event == \'post\'\" post=\"item\" parent=\"parent\" timeline=\"timeline\" class=\"block m-b-15\"></post>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/forum/thread-timeline/tpls/thread-timeline.html', '<div class=\"rel-box\" style=\"min-height: 80px;\">\r\n    <post-reply parent=\"parent\" timeline=\"timeline\"></post-reply>\r\n    <div class=\"timeline\">\r\n        <thread-timeline-item ng-repeat=\"item in timeline | orderBy: \'timestamp\'\" item=\"item\" parent=\"parent\" timeline=\"timeline\"></thread-timeline-item>\r\n    </div>\r\n    <loading-overlay ng-if=\"loading\" class=\"light-grey\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/forum/tpls/forum.html', '<div class=\"forum m-b-60 rel-box\" style=\"min-height: 60px;\">\r\n    <div ng-show=\"query.results.length > 0\" class=\"md-table text-center\">\r\n        <div class=\"table-head\">\r\n            <div class=\"table-row\">\r\n                <div style=\"width: 40px;\"></div>\r\n                <div class=\"text-left\">Topic</div>\r\n                <div style=\"width: 60px;\">Project</div>\r\n                <div style=\"width: 60px;\">Author</div>\r\n                <div style=\"width: 100px;\">Replies</div>\r\n<!--                <div style=\"width: 100px\">Activity</div>-->\r\n            </div>\r\n        </div>\r\n        <a set-entity-href=\"item.type || item.entityType\" entity-stub=\"item.stub\" class=\"table-row\" ng-repeat=\"item in query.results\">\r\n            <div style=\"padding: 15px 20px 15px 5px;\">\r\n                <div class=\"avatar avatar-square-cover\" ng-style=\"{ \'background-image\':\'url(\'+(item.picture || \'/assets/images/default/org.png\')+\'?size=thumb)\'}\"></div>\r\n            </div>\r\n            <div class=\"text-left\">\r\n                <div class=\"bold\">{{item.name | letters: 70}}&nbsp;<span class=\"label\" label-style=\"{{label}}\" ng-repeat=\"label in item.labels\">{{label}}</span></div>\r\n                <div>{{item.blurb | letters: 70}}</div>\r\n            </div>\r\n            <div>\r\n                <div ng-if=\"item.project.name\" class=\"avatar-square-cover avatar-sm m-a\" ng-style=\"{ \'background-image\':\'url(\'+(item.project.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\">\r\n                    <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">{{item.project.name}}</md-tooltip>\r\n                </div>\r\n            </div>\r\n            <div>\r\n                <div class=\"avatar-circle avatar-sm m-a\" ng-style=\"{ \'background-image\':\'url(\'+(item.owner.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\">\r\n                    <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">{{item.owner.name}}</md-tooltip>\r\n                </div>\r\n            </div>\r\n            <div>{{item.numPosts}}</div>\r\n<!--            <div>{{item.data.updated | amTimeAgo}}</div>-->\r\n        </a>\r\n    </div>\r\n\r\n    <div ng-if=\"query.notEnoughResults\" class=\"text-no-results m-t-15\">\r\n       {{query.results.length > 0 ? \'No more threads\' : \'No threads yet\'}}\r\n    </div>\r\n\r\n    <div ng-hide=\"query.notEnoughResults\" class=\"m-t-30\">\r\n        <a class=\"well-button\" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n            <div>{{query.noMoreResults ? \'No more discussions\' : \'Load more discussions\'}}</div>\r\n        </a>\r\n    </div>\r\n    <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/horizontal-menu/tpls/main-horizontal-menu.html', '<div ng-show=\"HorizontalMenuService.enabled\" class=\"horizontal-menu\" ng-class=\"{\'mobile\':$mdMedia(\'sm\') || $mdMedia(\'md\'), \'landing\' : LayoutOptions.header.landing}\">\r\n    <!-- MAIN MENU -->\r\n    <div class=\"fixed-menu\" stick-on-scroll-up>\r\n    	<top-banner></top-banner>\r\n		<div class=\"main-menu\" layout=\"row\" layout-align=\"start center\">\r\n            <!-- Left Section -->\r\n            <div flex layout=\"row\" layout-align=\"start center\">\r\n                <md-button analytics-track=\"HOME btn\" class=\"logo\" ui-sref=\"app.home\" aria-label=\"Home\">\r\n					<div style=\"width: 50px;\">\r\n						<img src=\"assets/images/logo80x80.png\"        alt=\"STEMN logo\" class=\"img-trans\" />\r\n					</div>\r\n				</md-button>\r\n            </div>\r\n            <!-- Center Section -->\r\n            <div class=\"md-content-container md-no-padding\" hide-sm hide-md>\r\n                <tabs layout=\"row\" layout-align=\"start center\">\r\n                    <div class=\"tab h-100\" layout=\"column\" ng-repeat=\"tab in MenuItems.main\"  ng-class=\"{\'active\':$state.includes(tab.parent || tab.sref)}\" hidepublic=\"{{tab.authenticate}}\">\r\n                        <a ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n                        <popup ng-if=\"tab.sub\" class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"-1px 0 0 0\" layout=\"column\">\r\n                            <a ng-repeat=\"item in tab.sub\" class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"{{item.sref}}\" ng-class=\"{\'divider\':item.divider}\">{{item.label}}</a>\r\n                        </popup>\r\n                    </div>\r\n                    <md-button ng-show=\"MenuItems.more.length > 0\" class=\"md-icon-button md-sm md-grey\" aria-label=\"more\">\r\n					    <md-icon md-svg-icon=\"navigation:more_horiz\"></md-icon>\r\n                        <popup class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"11px 0 0 0\" layout=\"column\">\r\n                            <a ng-repeat=\"item in MenuItems.more\" class=\"md-subhead\" ng-class=\"{\'divider\':item.divider}\" ui-sref=\"{{item.sref}}\" ui-sref-active=\"active\" hidepublic=\"{{item.authenticate}}\">{{item.label}}</a>\r\n                        </popup>\r\n					</md-button>\r\n                </tabs>\r\n            </div>\r\n            <!-- Faux Right Section -->\r\n            <div flex></div>\r\n            <!-- Absolute Right Section -->\r\n            <div class=\"right\" flex layout=\"row\" layout-align=\"end center\">\r\n				<md-button analytics-track=\"Create btn\" ng-if=\"user.isLoggedIn()\" hide-sm authenticate class=\"md-accent md-raised md-flat md-cornered no-margin hide-landing md-border-green\" style=\"min-width: 105px; height: 40px; line-height: 40px; margin-right:10px !important\" click-create-project>\r\n					New Project\r\n				</md-button>\r\n                <md-button analytics-track=\"Search btn\" ui-sref=\"app.search.all\" hide-gt-md class=\"md-icon-button\" aria-label=\"search\"><md-icon md-svg-icon=\"search\"></md-icon></md-button>\r\n				<site-search hide-sm hide-md class=\"hide-landing\"></site-search>\r\n				<notifications class=\"hide-landing\" ng-if=\"user.isLoggedIn()\"></notifications>\r\n				<user-settings-dropdown hide-sm ng-if=\"user.isLoggedIn()\"></user-settings-dropdown>\r\n				<md-button analytics-track=\"Sign In btn\" class=\"md-lower md-accent md-md\" ng-click=\"openLoginModal($event)\" style=\"margin-right: 5px\" ng-if=\"!user.isLoggedIn()\">\r\n					Sign in\r\n				</md-button>\r\n                <md-button analytics-track=\"Menu btn\" hide-gt-md class=\"md-icon-button\" ng-click=\"toggleMenu()\" aria-label=\"Menu\"><md-icon md-svg-icon=\"menu\"></md-icon></md-button>\r\n            </div>\r\n		</div>\r\n    </div>\r\n    <!-- SUB MENU -->\r\n    <div class=\"sub-menu\" hide-gt-md>\r\n        <div class=\"text-tabs tabs-black\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-repeat=\"tab in MenuItems.main\" hidepublic=\"{{tab.authenticate}}\" ui-sref=\"{{tab.sref}}\" ng-class=\"{\'active\':$state.includes(tab.sref)}\">{{tab.label}}</a>\r\n            <div ng-show=\"MenuItems.more.length > 0\" class=\"p-r-10\" layout=\"column\" layout-align=\"center\">\r\n                <md-icon md-svg-icon=\"navigation:more_horiz\"></md-icon>\r\n                <popup class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"11px 0 0 0\" layout=\"column\">\r\n                    <a ng-repeat=\"item in MenuItems.more\" class=\"md-subhead\" ng-class=\"{\'divider\':item.divider}\" ui-sref=\"{{item.sref}}\" ui-sref-active=\"active\" hidepublic=\"{{item.authenticate}}\">{{item.label}}</a>\r\n                </popup>\r\n            </div>\r\n        </div>\r\n    	<div class=\"highlight-overlay\" style=\"position: absolute\" ng-show=\"LayoutOptions.overlay.highlight\"></div>\r\n    </div>\r\n</div>\r\n<user-settings-sidebar></user-settings-sidebar>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/horizontal-menu/tpls/user-settings-dropdown.html', '<a class=\"avatar avatar-circle block m-r-10\" style=\"background-image: url(\'{{user.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\'); border: none;\"></a>\r\n<popup class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"11px 0 0 0\" layout=\"column\" style=\"min-width: 200px;\">\r\n    <a ng-repeat=\"item in menu\" class=\"md-subhead\" ng-class=\"{\'divider\':item.divider}\" ng-href=\"{{item.href}}\" ng-click=\"item.click($event)\">{{item.label}}</a>\r\n</popup>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/horizontal-menu/tpls/user-settings-sidebar.html', '<md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\">\r\n    <!-- IF LOGGED IN  -->\r\n    <div ng-show=\"user.isLoggedIn()\">\r\n       <div class=\"header\">\r\n            <md-button class=\"md-icon-button close-btn\" aria-label=\"Close\" ng-click=\"close()\"><md-icon md-svg-icon=\"arrow-back\"></md-icon></md-button>\r\n            <md-button class=\"md-circle\" aria-label=\"User Profile\" ui-sref=\"app.user.profile({\'stub\': user.stub})\"\r\n                style=\"background-image: url(\'{{user.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\');\">\r\n            </md-button>\r\n            <div class=\"md-body bold\">{{user.name}}</div>\r\n            <div class=\"md-body\">{{user.blurb}}</div>\r\n        </div>\r\n        <md-content ng-click=\"close()\">\r\n            <md-menu-item ng-repeat=\"item in MenuItems.main\">\r\n                <md-button ui-sref=\"{{item.sref}}\">\r\n                    <p>{{item.label}}</p>\r\n                </md-button>\r\n            </md-menu-item>\r\n            <md-menu-item ng-repeat=\"item in MenuItems.more\">\r\n                <md-button ui-sref=\"{{item.sref}}\">\r\n                    <p>{{item.label}}</p>\r\n                </md-button>\r\n            </md-menu-item>\r\n            <md-divider></md-divider>\r\n            <md-menu-item>\r\n                <md-button ng-click=\"user.logout(); popLogout()\">\r\n                    <md-icon md-svg-icon=\"exit_to_app\"></md-icon>\r\n                    <p>Sign out</p>\r\n                </md-button>\r\n            </md-menu-item>\r\n        </md-content>\r\n    </div>\r\n    <!-- IF NOT LOGGED IN  -->\r\n    <div ng-hide=\"user.isLoggedIn()\">\r\n        <div class=\"header\">\r\n            <md-button class=\"md-icon-button close-btn\" aria-label=\"Close\" ng-click=\"close()\"><md-icon md-svg-icon=\"arrow-back\"></md-icon></md-button>\r\n            <div class=\"md-headline\">You are not logged in.</div>\r\n        </div>\r\n        <md-content ng-click=\"close()\">\r\n            <md-menu-item>\r\n                <md-button ng-click=\"login($event)\">\r\n                    <md-icon md-svg-icon=\"person\"></md-icon>\r\n                    <p>Sign in</p>\r\n                </md-button>\r\n            </md-menu-item>\r\n            <md-divider></md-divider>\r\n            <md-menu-item ng-repeat=\"item in MenuItems.more\">\r\n                <md-button ui-sref=\"{{item.sref}}\" authenticate=\"item.authenticate\">\r\n                    <p>{{item.label}}</p>\r\n                </md-button>\r\n            </md-menu-item>\r\n        </md-content>\r\n    </div>\r\n</md-sidenav>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/invite/tpls/invite-link-modal.html', '<md-dialog>\r\n    <md-dialog-content>\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Copy the invite link below:</h1>\r\n            <p>Share this link with your team members. When they visit STEMN (or sign up) using this URL they will be automatically added to to your {{type}}.</p>\r\n            <br>\r\n            <div class=\"select-on-click-box\" select-on-click>\r\n            	{{url}}\r\n            </div>\r\n            <br>\r\n            <p><b>Important:</b><br>Anyone with this link will be able to join and edit this {{type}}. Be <b>very careful</b> who you send this to.</p>\r\n            <div layout=\"row\">\r\n            	<div flex></div>\r\n            	<md-button class=\"md-accent md-raised no-margin\" ng-click=\"cancel()\">Close</md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/application-rows.html', '<div class=\"application-rows\">\r\n    <user-row-detailed class=\"m-b-15\" ng-repeat=\"item in query.results\" user-id=\"{{item.child._id}}\" show-edit=\"showEdit\" button-text=\"See application\" button-href=\"applications/{{item._id}}\" job=\"job\"></user-row-detailed>\r\n    <div ng-hide=\"query.notEnoughResults || hideMore\">\r\n        <a class=\"well-button\" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n            <div>{{query.noMoreResults ? \'No more applications\' : \'Load more\'}}</div>\r\n        </a>\r\n    </div>\r\n    <div ng-show=\"query.results.length < 1\" class=\"text-lightgrey\">No applicants yet.</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/application-success-modal.html', '<md-dialog>\r\n    <md-dialog-content>\r\n        <div name=\"form\" class=\"md-content-container content-xs\">\r\n            <h1 class=\"md-headline\" style=\"margin: 0px 0 30px;\">Application received</h1>\r\n            <div class=\"md-subhead\"></div>\r\n            <p>Sit tight! Our Talent team will review your application and will be in touch shortly.</p>\r\n            <p>In the mean time, you can continue to polish up your applications and portfolio on your <a class=\"text-green\" ui-sref=\"app.applications\">my applications</a> page.</p>\r\n            <div layout=\"row\" class=\"m-t-15\">\r\n                <div flex></div>\r\n                <div>\r\n                    <md-button class=\"\" ng-click=\"cancel()\">Cancel</md-button>\r\n                    <md-button class=\"md-accent md-raised m-r-0\" ng-click=\"confirm()\">View Applications</md-button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/apply-button.html', '<a class=\"apply-button md-button md-accent md-border\" ng-click=\"jobApply($event)\" ng-class=\"{\'active\' : buttonStatus.status}\" authenticate>\r\n    <div ng-show=\"buttonStatus.status\">{{textApplied || \'Applied\'}}</div>\r\n    <div ng-hide=\"buttonStatus.status\">{{textApply || \'Apply\'}}</div>\r\n</a>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/create-job-modal.html', '<md-dialog>\r\n    <md-dialog-content>\r\n        <form name=\"form\" unsaved-warning-form novalidate class=\"md-content-container content-xs\">\r\n            <loading-overlay ng-if=\"queryOrganisations.loading\"></loading-overlay>\r\n\r\n            <h1 class=\"md-headline\" style=\"margin: 0px 0 30px;\">Create a new job listing</h1>\r\n\r\n\r\n            <div ng-show=\"queryOrganisations.results.length>0\">\r\n                <p class=\"text-lightgrey\">You can add jobs listing for any organisation you are a part of. Want to add a position for another organisation? <a class=\"text-green\" ng-click=\"createOrganisation($event)\">Click here</a> to create a new organisation.</p>\r\n\r\n                <md-input-container>\r\n                    <label>Job name</label>\r\n                    <input required type=\"text\" ng-model=\"entity.name\">\r\n                </md-input-container>\r\n\r\n                <md-input-container>\r\n                    <label>Organisations</label>\r\n                    <md-select required ng-model=\"entity.organisations[0]._id\" placeholder=\"Select your organisation\">\r\n                        <md-option ng-repeat=\"org in queryOrganisations.results\" value=\"{{org._id}}\">\r\n                            {{org.name}}\r\n                        </md-option>\r\n                    </md-select>\r\n                </md-input-container>\r\n            </div>\r\n            <div ng-hide=\"queryOrganisations.results.length>0\">\r\n                <div class=\"well\" layout=\"row\" layout-align=\"start center\">\r\n                    <p class=\"text-lightgrey\" flex>You can\'t add a job because you are not part of an organisation.</p>\r\n                    <md-button class=\"md-accent md-raised md-cornered md-flat md-md\" ng-click=\"createOrganisation($event)\">Create Organisation</md-button>\r\n                </div>\r\n            </div>\r\n\r\n            <div layout=\"row\" class=\"m-t-15\" ng-show=\"queryOrganisations.results.length>0\">\r\n                <div flex></div>\r\n                <div>\r\n                    <md-button class=\"\" ng-click=\"cancel()\">Cancel</md-button>\r\n                    <md-button class=\"md-accent md-raised m-r-0\" ng-click=\"confirm()\">Create</md-button>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/job-application-modal.coverletter.html', '\r\n<h2 class=\"md-display-1 m-t-0\">Cover Letter</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Introduce yourself. Why are you perfect for this position? What are your interest? Highlight any projects in your portfolio that are relevant.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div class=\"card-z1 card-padding m-b-30\">\r\n            <form name=\"forms.coverletterForm\">\r\n                <div class=\"md-subhead m-b-15\">Job Application Cover Letter</div>\r\n                <div required class=\"angular-medium-editor\" medium-editor name=\"blurb\" ng-model=\"application.coverLetter\" editor-type=\"text\" style=\"min-height: 300px;\"\r\n                placeholder=\"Why is this the perfect job for you? (Required)\"></div>\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/job-application-modal.html', '<md-dialog class=\"apply-for-job-modal\" aria-label=\"Job application\">\r\n\r\n    <div class=\"md-modal-header\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"onboarding-steps\" layout=\"row\" layout-align=\"start center\">\r\n            <div ng-repeat=\"tab in tabs\" layout=\"row\" layout-align=\"start center\">\r\n                <a class=\"md-subhead\" ng-click=\"tab.click()\" ng-class=\"{\'active\' : activeTab == tab.label, \'disabled\' : $index != 0 && isFailedRequirements()}\">{{tab.label}}</a>\r\n                <md-icon md-svg-icon=\"chevron-right\" ng-hide=\"$last\"></md-icon>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <md-dialog-content class=\"bg-lightgrey overflow-x-box p-0\">\r\n        <loading-overlay ng-if=\"projectsQuery.loading\"></loading-overlay>\r\n        <div ng-if=\"isFailedRequirements()\">\r\n            <div class=\"missing-fields\">\r\n                <div style=\"padding: 0 30px;\">You cannot apply for this job yet as you do not meet the requirements. See below.</div>\r\n            </div>\r\n        </div>\r\n        <div class=\"md-content-container content-md\" style=\"padding: 30px;\">\r\n\r\n            <div ng-if=\"activeTab == \'Requirements\'\" ng-include=\"\'app/modules/jobs/tpls/job-application-modal.requirements.html\'\"></div>\r\n            <div ng-if=\"activeTab == \'Cover Letter\'\" ng-include=\"\'app/modules/jobs/tpls/job-application-modal.coverletter.html\'\"></div>\r\n            <div ng-if=\"activeTab == \'Other Info\'\"   ng-include=\"\'app/modules/jobs/tpls/job-application-modal.other.html\'\"></div>\r\n\r\n            <div layout=\"row\" class=\"m-t-30\">\r\n                <div flex></div>\r\n                <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-disabled=\"steps[activeTab].isDisabled()\" ng-click=\"steps[activeTab].nextFn()\">\r\n                    {{steps[activeTab].nextText}}\r\n                </md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/job-application-modal.other.html', '<h2 class=\"md-display-1 m-t-0\">Other Info</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Add your contact details and citizenship info. This is very important as many Aerospace jobs have strict citizenship requirements.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <form name=\"forms.infoForm\">\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\">Contact Details</div>\r\n                <md-input-container class=\"md-block md-accent\">\r\n                    <label>Email*</label>\r\n                    <input required name=\"email\" ng-model=\"application.email\" type=\"email\">\r\n                </md-input-container>\r\n                <md-input-container class=\"md-block md-accent\">\r\n                    <label>Phone Number</label>\r\n                    <input name=\"phone\" ng-model=\"user.profile.phone\" type=\"text\">\r\n                </md-input-container>\r\n            </div>\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\">Nationality and Location</div>\r\n                <country-select placeholder=\"Citizenship\" ng-model=\"user.profile.citizenship\"></country-select>\r\n                <location-search placeholder=\"Current Location\" data=\"user.profile.location\" single=\"true\"></location-search>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/job-application-modal.requirements.html', '<h2 class=\"md-display-1 m-t-0\">Job Requirements</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">You must pass the following requirements to apply to {{job.organisations[0].name || \'this position\'}}. This will ensure your skills and experience are appropriate for the position.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div ng-if=\"job.requiredFields.length > 0\" class=\"card-z1 card-padding m-b-30\">\r\n            <div layout=\"row\" class=\"m-b-15\">\r\n                <div flex class=\"md-subhead\">Required Skills</div>\r\n                <div ng-show=\"isFailedRequiredFields()\" class=\"text-red\">Fail</div>\r\n                <div ng-hide=\"isFailedRequiredFields()\" class=\"text-green\">Pass</div>\r\n            </div>\r\n            <p class=\"body-small\" ng-show=\"isFailedRequiredFields()\">You do not have all the required skills. <a class=\"text-green\" click-create-project>Create another project</a> that evidences these skills or add them to <a class=\"text-green\" ng-click=\"cancel()\" ui-sref=\"app.user.profile({stub: user.stub, edit: \'SkillsForm\'})\">your profile</a>.</p>\r\n            <tags edit=\"false\" size=\"xs\" tags=\"job.requiredFields\" type=\"field\" status=\"true\"></tags>\r\n        </div>\r\n        <div ng-if=\"job.fields.length > 0\" class=\"card-z1 card-padding m-b-30\">\r\n            <div layout=\"row\" class=\"m-b-15\">\r\n                <div flex class=\"md-subhead\">Related Skills</div>\r\n                <div class=\"text-green\">Pass</div>\r\n            </div>\r\n            <tags edit=\"false\" size=\"xs\" tags=\"job.fields\" type=\"field\" status=\"true\"></tags>\r\n        </div>\r\n        <div class=\"card-z1 card-padding m-b-30\">\r\n            <div layout=\"row\" class=\"m-b-15\">\r\n                <div flex class=\"md-subhead\">2 Projects in portfolio</div>\r\n                <div ng-show=\"isFailedRequiredProjects()\" class=\"text-red\">Fail</div>\r\n                <div ng-hide=\"isFailedRequiredProjects()\" class=\"text-green\">Pass</div>\r\n            </div>\r\n            <p class=\"body-small\">You must have at least 2 projects in your portfolio before you can apply to <b>{{job.organisations[0].name || \'this position\'}}</b>.</p>\r\n            <md-button ng-show=\"isFailedRequiredProjects()\" class=\"md-accent md-raised md-cornered md-flat md-md m-0\" click-create-project>Create Project</md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/job-rows.html', '<div class=\"job-rows rel-box\" style=\"min-height: 100px;\">\r\n    <table class=\"md-table\" ng-show=\"query.results.length > 0\">\r\n        <thead>\r\n            <tr>\r\n                <td ng-if=\"parentType != \'organisation\'\" style=\"width: 40px;\"></td>\r\n                <td>Name</td>\r\n                <td class=\"text-center\">Location</td>\r\n                <td style=\"width: 100px;\" class=\"text-center\">Pay</td>\r\n                <td hide-sm style=\"width: 100px;\" class=\"text-center\">Level</td>\r\n                <td hide-sm style=\"width: 100px;\" class=\"text-center\">Type</td>\r\n                <td hide-sm style=\"width: 95px;\"></td>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n            <tr ng-repeat=\"item in query.results\" ng-hide=\"currentJobId == item._id\">\r\n                <td ng-if=\"parentType != \'organisation\'\" style=\"padding: 15px 20px 15px 5px;\">\r\n                    <a set-entity-href=\"\'organisation\'\" entity-stub=\"item.organisations[0].stub\">\r\n                        <div class=\"avatar avatar-square-contain\" ng-style=\"item.organisations[0].picture && { \'background-image\':\'url(\'+item.organisations[0].picture+\'?size=thumb)\'}\"></div>\r\n                    </a>\r\n                </td>\r\n                <td>\r\n                    <a set-entity-href=\"\'job\'\" entity-stub=\"item.stub\">\r\n                        <div ng-if=\"parentType != \'organisation\'\" class=\"bold\">{{item.organisations[0].name}}</div>\r\n                        <div>{{item.name}}</div>\r\n                    </a>\r\n                </td>\r\n                <td class=\"text-center\">{{item.location[0].name}}</td>\r\n                <td class=\"text-center\">\r\n                    <div ng-if=\"item.pay.from && item.pay.to\">{{item.pay.from | money : item.pay.currency}} to {{item.pay.to | money : item.pay.currency}}</div>\r\n                </td>\r\n                <td hide-sm class=\"text-center\">{{item.level}}</td>\r\n                <td hide-sm class=\"text-center\">{{item.jobType}}</td>\r\n                <td hide-sm class=\"text-right\"><apply-button job=\"item\" job-id=\"{{item._id}}\" job-stub=\"{{item.stub}}\" class=\"md-sm no-margin\" style=\"min-width: 70px;\" change-state=\"true\"></apply-button></td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n    <div ng-if=\"query.notEnoughResults\" class=\"text-no-results m-t-15\">\r\n       {{query.results.length > 0 ? \'No more jobs\' : \'No jobs\'}}\r\n    </div>\r\n    <div ng-hide=\"query.notEnoughResults || query.noMoreResults || hideMore\" class=\"m-t-30\">\r\n        <a class=\"well-button\" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n            <div>{{noMoreResults ? \'No more results\' : \'See more jobs\'}}</div>\r\n        </a>\r\n    </div>\r\n    <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/job-tile.html', '<div class=\"job-tile rel-box m-v-15 text-center\" style=\"min-height: 125px;\" layout=\"column\" layout-align=\"start center\">\r\n    <a ng-href=\"{{item.url}}\">\r\n        <div class=\"avatar avatar-square-contain avatar-md\" ng-style=\"item.organisations[0].picture && { \'background-image\':\'url(\'+item.organisations[0].picture+\'?size=thumb-lg)\'}\"></div>\r\n    </a>\r\n    <a ng-href=\"{{item.url}}\">\r\n        <div class=\"bold m-t-10\">{{item.organisations[0].name}}</div>\r\n        <div>{{item.name}}</div>\r\n    </a>\r\n    <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/jobs/tpls/resubmit-application-button.html', '<md-button ng-click=\"resubmitApplication()\" class=\"md-accent md-raised md-flat md-cornered md-md m-r-0\">Resubmit</md-button>\r\n<popup class=\"tooltip-popup\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" layout=\"column\">\r\n    <p>Your application is <b>\'Awaiting Profile Update\'</b> - Once you have updated your profile and projects you should re-submit your application for review.</p>\r\n</popup>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/lightbox/tpls/lightbox-modal.html', '<md-dialog class=\"md-full-screen\" aria-label=\"Image Lightbox\">\r\n    <md-toolbar style=\"background: white;\">\r\n        <div class=\"md-toolbar-tools\">\r\n            <span flex></span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <md-dialog-content layout=\"column\" layout-align=\"center center\" class=\"carousel-modal\">\r\n        <div class=\"controls\" ng-show=\"lightboxImages.length > 1\" layout=\"row\">\r\n            <div flex ng-click=\"prev()\" layout=\"row\" layout-align=\"start center\">\r\n                <md-button class=\"md-icon-button\"><md-icon md-svg-icon=\"chevron-left\"></md-icon></md-button>\r\n            </div>\r\n            <div flex ng-click=\"next()\" layout=\"row\" layout-align=\"end center\">\r\n                <md-button class=\"md-icon-button\"><md-icon md-svg-icon=\"chevron-right\"></md-icon></md-button>\r\n            </div>\r\n        </div>\r\n        <div>\r\n            <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n            <img ng-src=\"{{currentImage.image.url}}\" image-on-load=\"loading = false\">\r\n        </div>\r\n        <div ng-show=\"currentImage.caption\" style=\"max-width: 800px; margin-top:20px;\" class=\"angular-medium-editor text-center\" ng-bind-html=\"currentImage.caption\"></div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <md-button class=\"md-icon-button\" target=\"_self\" ng-href=\"{{currentImage.image.url}}\" download>\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Download Image</md-tooltip>\r\n            <md-icon md-svg-icon=\"file:file_download\" aria-label=\"Download Image\"></md-icon>\r\n        </md-button>\r\n        <md-button class=\"md-icon-button\" target=\"_self\" ng-href=\"{{currentImage.image.url}}\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Link Image</md-tooltip>\r\n            <md-icon md-svg-icon=\"link\" aria-label=\"Link Image\"></md-icon>\r\n        </md-button>\r\n        <div flex class=\"text-right\">\r\n            <span ng-if=\"lightboxImages.length>1\" class=\"text-lightgrey\">{{current+1}} / {{lightboxImages.length}}</span>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/location/tpls/country-select.html', '<div class=\"rel-box\" ng-repeat=\"model in ngModel track by $index\">\r\n    <md-select placeholder=\"{{placeholder || \'Select Country\'}}\" ng-model=\"ngModel[$index]\" class=\"md-accent\">\r\n        <md-option value=\"{{location.name}}\" ng-repeat=\"location in locations\">{{location.name}}</md-option>\r\n    </md-select>\r\n    <div class=\"md-select-buttons\">\r\n        <md-button class=\"md-icon-button\" ng-click=\"remove($index)\" ng-if=\"$index > 0\">\r\n            <md-icon class=\"r-45\" md-svg-icon=\"add\"></md-icon>\r\n            <md-tooltip md-autohide=\"true\">Delete</md-tooltip>\r\n        </md-button>\r\n        <md-button class=\"md-icon-button\" ng-click=\"addAnother()\" ng-if=\"$index == 0\">\r\n            <md-icon md-svg-icon=\"add\"></md-icon>\r\n            <md-tooltip md-autohide=\"true\">Add another</md-tooltip>\r\n        </md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/mapbox/tpls/mapbox.html', '');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/maps/tpls/map-display.html', '<div class=\"map-display\" layout=\"row\">\r\n    <ui-gmap-google-map flex=\"100\" center=\"map.center\" zoom=\"map.zoom\" draggable=\"true\" options=\"options\" bounds=\"map.bounds\">\r\n        <ui-gmap-markers models=\"points\" coords=\"\'self\'\" icon=\"\'icon\'\" click=\"onClick\" type=\"\'spider\'\" label-class=\"\'label\'\">\r\n        </ui-gmap-markers>\r\n    </ui-gmap-google-map>\r\n    <div class=\"map-tools\">\r\n       <md-button class=\"md-icon-button\" ng-click=\"getLocation()\">\r\n            <md-icon md-font-icon=\"fa-map-marker\" class=\"fa s32\"></md-icon>\r\n       </md-button>\r\n<!--\r\n       <md-button class=\"md-icon-button\" ng-click=\"nextStyle()\">\r\n            <md-icon md-font-icon=\"fa-paint-brush\" class=\"fa s32\"></md-icon>\r\n       </md-button>\r\n-->\r\n       <md-button class=\"md-icon-button\" ng-click=\"getLink()\">\r\n            <md-icon md-font-icon=\"fa-link\" class=\"fa s32\"></md-icon>\r\n       </md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/medium-editor-ext-mentions/tpls/mention-search.html', '<div list-keyboard-navigation enable=\"showPopup\" list=\"results\" active-index=\"activeIndex\" selector=\"list-nav-active\" esc-fn=\"hidePanel()\">\r\n    <a ng-repeat=\"item in results\" ng-click=\"mentionSelect(item._id, item.type, item.name)\" layout=\"row\" layout-align=\"start center\" ng-class=\"{\'list-nav-active\' : activeIndex == $index}\">\r\n        <div class=\"avatar-circle avatar-sm\" ng-style=\"{ \'background-image\':\'url(\'+(item.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\"></div>\r\n        <div flex=\"\" class=\"ellipsis\" ng-bind-html=\"item.name | typeaheadHighlightMatch: word.wordSearch\"></div>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/medium-editor/tpls/editor-link-modal.html', '<md-dialog>\r\n    <form novalidate name=\"LinkForm\" ng-submit=\"save()\">\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div style=\"width: 500px;\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px; margin-bottom: 40px;\">So, what\'s the Url?</h1>\r\n				<md-input-container class=\"md-accent\">\r\n					<label>Website Url</label>\r\n					<input name=\"link\" ng-model=\"data.link\" type=\"text\" focus-me=\"true\"\r\n					ng-minlength=\"10\" ng-maxlength=\"200\" ng-pattern=\"/((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)/\">\r\n					<div ng-messages=\"LinkForm.link.$error\" ng-if=\"LinkForm.link.$dirty\">\r\n						<div ng-message=\"minlength\">A little short don\'t you think?</div>\r\n						<div ng-message=\"maxlength\">Wow, that is a long Url... Too long...</div>\r\n						<div ng-message=\"pattern\">Sorry, that isn\'t a valid Url... Make sure you include http://</div>\r\n					</div>\r\n				</md-input-container>\r\n            </div>\r\n        </md-dialog-content>\r\n        <div class=\"md-actions\" layout=\"row\">\r\n            <div flex></div>\r\n            <div>\r\n                <md-button type=\"button\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"LinkForm.$invalid\">Confirm</md-button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/medium-editor/tpls/editor-video-modal.html', '<md-dialog>\r\n    <form novalidate name=\"LinkForm\" ng-submit=\"save()\">\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div style=\"width: 500px;\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px; margin-bottom: 40px;\">What\'s the link?</h1>\r\n                    <md-input-container class=\"md-accent\">\r\n                        <label>Youtube/Vimeo Url</label>\r\n                        <input name=\"link\" ng-model=\"link\" type=\"text\" focus-me=\"true\"\r\n                        required ng-minlength=\"10\" ng-maxlength=\"200\" ng-pattern=\"/(\\byoutu)|(\\bvimeo\\b)/\">\r\n                        <div ng-messages=\"LinkForm.link.$error\" ng-if=\"LinkForm.link.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                            <div ng-message=\"minlength\">A little short don\'t you think?</div>\r\n                            <div ng-message=\"maxlength\">Wow, that is a long Url... Too long...</div>\r\n                            <div ng-message=\"pattern\">Sorry, that is not a valid youtube/vimeo url.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n            </div>\r\n        </md-dialog-content>\r\n        <div class=\"md-actions\" layout=\"row\">\r\n            <div flex></div>\r\n            <div>\r\n                <md-button type=\"button\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"LinkForm.$invalid\">Insert</md-button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/missing-fields/tpls/missing-fields.html', '<div class=\"missing-fields\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-no-padding\">\r\n        <div class=\"md-title m-b-10\">Missing Fields</div>\r\n        <div ng-repeat=\"field in requiredFields\" ng-show=\"field.missing\" compile=\"field.title\"></div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/append-buttons/append-buttons.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"editor-section container\" layout=\"row\" layout-align=\"center\">\r\n        <md-button type=\"button\" ng-click=\"insertText($event)\" class=\"md-accent md-flat md-circle md-raised md-sm\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Section</md-tooltip>\r\n            <md-icon md-svg-icon=\"remove\"></md-icon>\r\n        </md-button>\r\n        <md-button type=\"button\" ng-click=\"insertImage($event)\" class=\"md-accent md-flat md-circle md-raised md-sm\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Photo</md-tooltip>\r\n            <md-icon md-svg-icon=\"insert-photo\"></md-icon>\r\n        </md-button>\r\n        <md-button type=\"button\" ng-click=\"insertVideo($event)\" class=\"md-accent md-flat md-circle md-raised md-sm\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Video</md-tooltip>\r\n            <md-icon md-svg-icon=\"video-collection\"></md-icon>\r\n        </md-button>\r\n        <md-button type=\"button\" ng-click=\"insertMath($event)\" class=\"md-accent md-flat md-circle md-raised md-sm\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Math</md-tooltip>\r\n            <md-icon md-svg-icon=\"functions\"></md-icon>\r\n        </md-button>\r\n        <md-button type=\"button\" ng-click=\"insertCode($event)\" class=\"md-accent md-flat md-circle md-raised md-sm\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Code</md-tooltip>\r\n            <md-icon md-svg-icon=\"memory\"></md-icon>\r\n        </md-button>\r\n        <md-button type=\"button\" ng-click=\"insertFiles($event)\" class=\"md-accent md-flat md-circle md-raised md-sm\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Files</md-tooltip>\r\n            <md-icon md-svg-icon=\"upload\"></md-icon>\r\n        </md-button>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/caption/edit/caption.html', '<div class=\"editor-caption\">\r\n    <div medium-editor editor-caption-element ng-model=\"section.caption\"\r\n    editor-sections=\"editorSections\"\r\n    editor-section-index=\"editorSectionIndex\"\r\n    editor-order=\"editorOrder\"\r\n    editor-type=\"{{::section.layout == \'full-width-banner-text\' ? \'caption-banner\' : \'caption\'}}\"\r\n    editor-options=\"editorOptions\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/caption/public/caption.html', '<div class=\"editor-caption\">\r\n    <div class=\"angular-medium-editor\" ng-bind-html=\"section.caption\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/help-footer/help-footer.html', '<div ng-if=\"editorOptions.showHelp && edit\" class=\"editor-help-footer\" layout=\"column\" layout-align=\"center center\">\r\n	<div layout=\"row\" layout-align=\"center center\" class=\"rel-box content-md\">\r\n		<div class=\"md-content-container\" layout=\"row\" layout-align=\"center center\">\r\n			<md-button type=\"button\" aria-label=\"previous\" class=\"md-icon-button\" ng-click=\"previous()\"><md-icon md-svg-icon=\"chevron-left\"></md-icon></md-button>\r\n			<div flex class=\"md-headine\" layout=\"column\" layout-align=\"start center\" ng-bind-html=\"helpSections[currentHelpSection].html\"></div>\r\n			<md-button type=\"button\" aria-label=\"next\" class=\"md-icon-button\" ng-click=\"next()\"><md-icon md-svg-icon=\"chevron-right\"></md-icon></md-button>\r\n		</div>\r\n	</div>\r\n	<md-button type=\"button\" class=\"md-icon-button close\" aria-label=\"close\" ng-click=\"close()\">\r\n		<md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n	</md-button>\r\n</div>\r\n\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/insert-buttons/insert-buttons.html', '<div class=\"editor-insert-buttons editor-buttons\" ng-show=\"showInsertButtons\" ng-class=\"{\'minimal\' : editorOptions.minimal}\">\r\n	<md-button type=\"button\" aria-label=\"insert\" ng-click=\"toggleInsertTools()\" class=\"insert-button md-icon-button\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert (Ctrl + I)</md-tooltip>\r\n		<md-icon md-svg-icon=\"add\" ng-class=\"{\'close\':showInsertTools}\"></md-icon>\r\n	</md-button>\r\n	<md-button type=\"button\" ng-click=\"insertImage($event)\" ng-show=\"showInsertTools\" class=\"md-icon-button ng-hide animate-throw throw-1\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Photo</md-tooltip>\r\n		<md-icon md-svg-icon=\"insert-photo\"></md-icon>\r\n	</md-button>\r\n	<md-button type=\"button\" ng-click=\"insertVideo($event)\" ng-show=\"showInsertTools\" class=\"md-icon-button ng-hide animate-throw throw-2\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Video</md-tooltip>\r\n		<md-icon md-svg-icon=\"video-collection\"></md-icon>\r\n	</md-button>\r\n	<md-button type=\"button\" ng-click=\"insertMath($event)\" ng-show=\"showInsertTools\" class=\"md-icon-button ng-hide animate-throw throw-3\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Math</md-tooltip>\r\n		<md-icon md-svg-icon=\"functions\"></md-icon>\r\n	</md-button>\r\n	<md-button type=\"button\" ng-click=\"insertCode($event)\" ng-show=\"showInsertTools\" class=\"md-icon-button ng-hide animate-throw throw-4\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Code</md-tooltip>\r\n		<md-icon md-svg-icon=\"memory\"></md-icon>\r\n	</md-button>\r\n	<md-button type=\"button\" ng-click=\"insertFiles($event)\" ng-show=\"showInsertTools\" class=\"md-icon-button ng-hide animate-throw throw-5\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Files</md-tooltip>\r\n		<md-icon md-svg-icon=\"upload\"></md-icon>\r\n	</md-button>\r\n	<md-button type=\"button\" ng-click=\"insertTextSection()\" ng-show=\"showInsertTools\" class=\"md-icon-button ng-hide animate-throw throw-6\">\r\n		<md-tooltip md-direction=\"top\" md-autohide=\"true\">Insert Section</md-tooltip>\r\n		<md-icon md-svg-icon=\"remove\"></md-icon>\r\n	</md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section-buttons/section-buttons.html', '<div class=\"editor-section-buttons\" ng-class=\"{\'minimal\' : editorOptions.minimal}\">\r\n<!--\r\n	<a class=\"button my-handle\" ng-mouseenter=\"highlightSections()\" ng-mouseleave=\"unhighlightSections()\">\r\n		<md-icon md-svg-icon=\"section-move\"></md-icon>\r\n	</a>\r\n-->\r\n    <div class=\"button my-handle\" realtime-editor-section=\"{{::editorOptions.realtime}}\" ng-mouseenter=\"highlightSections()\" ng-mouseleave=\"unhighlightSections()\">\r\n        <md-icon md-svg-icon=\"navigation:more_horiz\"></md-icon>\r\n        <popup class=\"tooltip-menu\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" layout=\"column\">\r\n            <a class=\"md-subhead\"\r\n                confirm ng-click=\"deleteSection()\" layout=\"row\" ng-mouseenter=\"deleteHighlight(editorSectionIndex)\" ng-mouseleave=\"deleteUnhighlight(editorSectionIndex)\">\r\n                Delete Section\r\n            </a>\r\n            <a class=\"md-subhead\" ng-if=\"checkMergeAbove()\"\r\n                ng-click=\"mergeWihAbove()\" ng-mouseenter=\"highlightSection(editorSectionIndex, mergeStyles); highlightSection(editorSectionIndex - 1, mergeStyles);\" ng-mouseleave=\"unhighlightSection(editorSectionIndex); unhighlightSection(editorSectionIndex - 1)\">\r\n                Merge Up\r\n            </a>\r\n            <a class=\"md-subhead\" ng-if=\"checkMergeBelow()\"\r\n                ng-click=\"mergeWithBelow()\" ng-mouseenter=\"highlightSection(editorSectionIndex, mergeStyles); highlightSection(editorSectionIndex + 1, mergeStyles);\" ng-mouseleave=\"unhighlightSection(editorSectionIndex); unhighlightSection(editorSectionIndex + 1)\">\r\n                Merge Down\r\n            </a>\r\n            <a class=\"md-subhead\" ng-if=\"editorSections[editorSectionId].type == \'image\'\"\r\n               ng-click=\"changeImage($event)\">\r\n                Change Image\r\n            </a>\r\n            <a class=\"md-subhead\" ng-if=\"editorSections[editorSectionId].type == \'file\'\"\r\n               ng-click=\"uploadFiles($event)\">\r\n                Upload Files\r\n            </a>\r\n            <a class=\"md-subhead\" ng-if=\"editorSections[editorSectionId].type == \'image\'\"\r\n                ng-click=\"createLink($event, editorSections[editorSectionId].linkUrl)\">\r\n                Create Link\r\n            </a>\r\n            <a class=\"md-subhead\" ng-if=\"editorSections[editorSectionId].type == \'video\'\"\r\n                ng-click=\"changeVideo($event)\">\r\n                Change Video\r\n            </a>\r\n        </popup>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/code/edit/code.html', '<div class=\"container editor-section CodeMirrorPadded\" editor-section-element>\r\n	<textarea editor-content-element ui-codemirror=\"options\" ng-model=\"section.code\" placeholder=\"Write your code here. Select the code-type below.\"></textarea>\r\n	<cm-code-mode mode=\"section.codeMode\" editor=\"cmEditor\"></cm-code-mode>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/code/public/code.html', '<div class=\"container editor-section\">\r\n	<div class=\"CodeMirrorPadded\" ui-codemirror=\"options\" ng-model=\"section.code\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/file/edit/file.html', '<div class=\"container editor-section\" editor-section-element>\r\n	<upload-files-display edit=\"true\" files=\"section.files\"></upload-files-display>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/file/public/file.html', '<div class=\"container editor-section\">\r\n	<upload-files-display edit=\"false\" files=\"section.files\"></upload-files-display>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/center.html', '<div class=\"editor-section container editor-image layout-center\" editor-section-element>\r\n    <div layout=\"column\" layout-align=\"center center\">\r\n        <a ng-href=\"{{section.linkUrl}}\" class=\"image-box\" editor-toolbar=\"true\">\r\n            <img ng-src=\"{{section.image.url}}?size=editor\" alt=\"\">\r\n        </a>\r\n        <editor-caption-edit editor-content-element></editor-caption-edit>\r\n        <editor-section-buttons></editor-section-buttons>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/full-width-banner-text.html', '<div flex=\"100\" class=\"editor-section editor-section-full-width editor-image layout-full-width-banner-text\" editor-section-element layout=\"column\">\r\n	<div class=\"image-box\"\r\n    ng-style=\"section.image.url && {\'background-image\':\'url(\'+(section.image.url)+\'?size=editor-banner)\'}\"></div>\r\n	<a ng-href=\"{{section.linkUrl}}\" class=\"overlay\" layout=\"row\" layout-align=\"center center\" editor-toolbar=\"true\">\r\n	    <editor-caption-edit editor-content-element></editor-caption-edit>\r\n	</a>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/full-width-banner.html', '<div flex=\"100\" class=\"editor-section editor-section-full-width editor-image layout-full-width-banner\" editor-section-element layout=\"column\">\r\n	<a ng-href=\"{{section.linkUrl}}\" class=\"image-box\"\r\n    ng-style=\"section.image.url && {\'background-image\':\'url(\'+(section.image.url)+\'?size=editor-banner)\'}\"\r\n    editor-toolbar=\"true\"></a>\r\n    <editor-caption-edit editor-content-element></editor-caption-edit>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/full-width.html', '<div flex=\"100\" class=\"editor-section editor-section-full-width editor-image layout-full-width\" editor-section-element layout=\"column\">\r\n	<a ng-href=\"{{section.linkUrl}}\" class=\"image-box\" editor-toolbar=\"true\">\r\n        <img ng-src=\"{{section.image.url}}?size=editor-banner\" alt=\"\">\r\n	</a>\r\n    <editor-caption-edit editor-content-element></editor-caption-edit>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/left.html', '<div class=\"editor-section container editor-image layout-left\" editor-section-element>\r\n    <div layout=\"row\" layout-align=\"start start\">\r\n        <a flex=\"70\" ng-href=\"{{section.linkUrl}}\" class=\"image-box\" editor-toolbar=\"true\">\r\n            <img ng-src=\"{{section.image.url}}?size=editor\" alt=\"\">\r\n        </a>\r\n        <editor-caption-edit editor-content-element></editor-caption-edit>\r\n    </div>\r\n    <editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/right.html', '<div class=\"editor-section container editor-image layout-right\" editor-section-element>\r\n    <div layout=\"row\" layout-align=\"end start\">\r\n        <editor-caption-edit editor-content-element></editor-caption-edit>\r\n        <a flex=\"70\" ng-href=\"{{section.linkUrl}}\" class=\"image-box\" editor-toolbar=\"true\">\r\n            <img ng-src=\"{{section.image.url}}?size=editor\" alt=\"\">\r\n        </a>\r\n    </div>\r\n    <editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/edit/wide.html', '<div class=\"editor-section container editor-image layout-wide\" editor-section-element>\r\n    <div layout=\"column\">\r\n        <div layout=\"row\">\r\n            <a flex=\"100\" ng-href=\"{{section.linkUrl}}\" class=\"image-box\" editor-toolbar=\"true\">\r\n                <img ng-src=\"{{section.image.url}}?size=editor\" alt=\"\">\r\n            </a>\r\n        </div>\r\n        <editor-caption-edit editor-content-element></editor-caption-edit>\r\n        <editor-section-buttons></editor-section-buttons>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/center.html', '<div class=\"editor-section container editor-image layout-center\">\r\n    <div layout=\"column\" layout-align=\"center center\">\r\n        <a ng-href=\"{{section.linkUrl}}\" class=\"image-box\" lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\">\r\n            <blur-load bg-src=\"{{section.image.url}}?size=editor\" bg-width=\"{{section.image.width}}\" bg-max-width=\"660\"></blur-load>\r\n        </a>\r\n        <editor-caption-public></editor-caption-public>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/full-width-banner-text.html', '<div flex=\"100\" class=\"editor-section editor-section-full-width editor-image layout-full-width-banner-text\" layout=\"column\">\r\n	<div class=\"image-box\"\r\n        blur-load-bg bg-src=\"{{section.image.url}}?size=editor-banner\"></div>\r\n	<a ng-href=\"{{section.linkUrl}}\" class=\"overlay\" layout=\"row\" layout-align=\"center center\" lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\">\r\n	    <editor-caption-public></editor-caption-public>\r\n	</a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/full-width-banner.html', '<div flex=\"100\" class=\"editor-section editor-section-full-width editor-image layout-full-width-banner\" layout=\"column\">\r\n	<a ng-href=\"{{section.linkUrl}}\" class=\"image-box\"\r\n    blur-load-bg bg-src=\"{{section.image.url}}?size=editor-banner\"\r\n    lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\"></a>\r\n    <editor-caption-public></editor-caption-public>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/full-width.html', '<div flex=\"100\" class=\"editor-section editor-section-full-width editor-image layout-full-width\" layout=\"column\">\r\n	<a ng-href=\"{{section.linkUrl}}\" class=\"image-box\" lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\">\r\n        <blur-load bg-src=\"{{section.image.url}}?size=editor-banner\"></blur-load>\r\n	</a>\r\n    <editor-caption-public></editor-caption-public>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/left.html', '<div class=\"editor-section container editor-image layout-left\">\r\n    <div layout=\"row\" layout-align=\"start start\">\r\n        <a flex=\"70\" ng-href=\"{{section.linkUrl}}\" class=\"image-box\" lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\">\r\n            <blur-load bg-src=\"{{section.image.url}}?size=editor\"></blur-load>\r\n        </a>\r\n        <editor-caption-public></editor-caption-public>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/right.html', '<div class=\"editor-section container editor-image layout-right\">\r\n    <div layout=\"row\" layout-align=\"end start\">\r\n        <editor-caption-public></editor-caption-public>\r\n        <a flex=\"70\" ng-href=\"{{section.linkUrl}}\" class=\"image-box\" lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\">\r\n            <blur-load bg-src=\"{{section.image.url}}?size=editor\"></blur-load>\r\n        </a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/image/public/wide.html', '<div class=\"editor-section container editor-image layout-wide\">\r\n    <div layout=\"column\">\r\n        <div layout=\"row\">\r\n            <a flex=\"100\" ng-href=\"{{section.linkUrl}}\" class=\"image-box\" lightbox=\"{{!section.linkUrl}}\" lightbox-image=\"section\">\r\n                <blur-load bg-src=\"{{section.image.url}}?size=editor\"></blur-load>\r\n            </a>\r\n        </div>\r\n        <editor-caption-public></editor-caption-public>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/math/edit/math.html', '<!--\r\n<div class=\"editor-image container editor-section\" editor-section-element>\r\n	<div layout=\"row\" layour-align=\"center center\">\r\n	    <div class=\"md-subhead\" style=\"margin: auto 10px auto 0px;\">Input:</div>\r\n	    <div flex><input editor-content-element placeholder=\"LaTeX style math input\" type=\"text\" ng-model=\"section.content\" class=\"editable\" style=\"padding: 5px;\"></div>\r\n	    <div class=\"md-subhead\" style=\"margin: auto 0px auto 20px;\" ng-show=\"section.content.length>0\">Output:</div>\r\n	    <div mathjax-bind=\"section.content\" style=\"text-align: center; margin: auto; padding: 0px 20px;\"></div>\r\n	</div>\r\n	<editor-caption></editor-caption>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n-->\r\n<div class=\"container editor-section\" editor-section-element>\r\n	<div layout=\"column\" layour-align=\"center center\">\r\n        <latex-input content=\"section.content\"></latex-input>\r\n	    <div mathjax-bind=\"section.content\" style=\"text-align: center; margin: auto; padding: 10px 20px;\"></div>\r\n	</div>\r\n	<editor-caption></editor-caption>\r\n	<editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/math/public/math.html', '<div class=\"container editor-section\">\r\n	<div layout=\"row\" layour-align=\"center center\">\r\n	    <div mathjax-bind=\"section.content\" style=\"text-align: center; margin: auto; padding: 0px 20px;\"></div>\r\n	</div>\r\n	<editor-caption></editor-caption>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/text/edit/text.html', '<div class=\"editor-section container\" editor-section-element>\r\n    <!-- It is important that everything that is clickable to active edit is in the editor-section-element-->\r\n    <div id=\"content-{{editorSectionId}}\" medium-editor editor-content-element ng-model=\"section.content\" placeholder=\"{{placeholder}}\"\r\n    editor-sections=\"editorSections\" editor-section-index=\"editorSectionIndex\" editor-section-id=\"editorSectionId\" editor-order=\"editorOrder\" editor-options=\"editorOptions\"></div>\r\n    <editor-section-buttons></editor-section-buttons>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/text/public/text.html', '<div class=\"editor-section container\">\r\n    <div render-inline-mathjax render-mentions class=\"angular-medium-editor\" ng-bind-html=\"section.content\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/video/edit/left.html', '<div class=\"editor-section container editor-image layout-left\" editor-section-element>\r\n	<div layout=\"row\" layout-align=\"start start\">\r\n	    <div flex=\"70\" class=\"image-box\" editor-toolbar=\"true\">\r\n	        <div class=\"embed-responsive embed-responsive-16by9\">\r\n	            <anguvideo class=\"embed-responsive-item\" ng-model=\"section.videoUrl\" width=\"100%\" height=\"100%\"></anguvideo>\r\n	            <editor-video-overlay></editor-video-overlay>\r\n	        </div>\r\n	    </div>\r\n	    <editor-caption-edit></editor-caption-edit>\r\n	    <editor-section-buttons></editor-section-buttons>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/video/edit/right.html', '<div class=\"editor-section container editor-image layout-right\" editor-section-element>\r\n	<div layout=\"row\" layout-align=\"end start\">\r\n	    <editor-caption-edit></editor-caption-edit>\r\n	    <div flex=\"70\" class=\"image-box\" editor-toolbar=\"true\">\r\n	        <div class=\"embed-responsive embed-responsive-16by9\">\r\n	            <anguvideo class=\"embed-responsive-item\" ng-model=\"section.videoUrl\" width=\"100%\" height=\"100%\"></anguvideo>\r\n	            <editor-video-overlay></editor-video-overlay>\r\n	        </div>\r\n	    </div>\r\n	    <editor-section-buttons></editor-section-buttons>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/video/edit/wide.html', '<div class=\"editor-section container editor-image\" editor-section-element>\r\n	<div layout=\"column\">\r\n	    <div class=\"image-box\" editor-toolbar=\"true\">\r\n	        <div class=\"embed-responsive embed-responsive-16by9\">\r\n	            <anguvideo class=\"embed-responsive-item\" ng-model=\"section.videoUrl\" width=\"100%\" height=\"100%\"></anguvideo>\r\n	            <editor-video-overlay></editor-video-overlay>\r\n	        </div>\r\n	    </div>\r\n	    <editor-caption-edit></editor-caption-edit>\r\n	    <editor-section-buttons></editor-section-buttons>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/video/public/left.html', '<div class=\"editor-section container editor-image layout-left\">\r\n	<div layout=\"row\" layout-align=\"start start\">\r\n	    <div flex=\"70\" class=\"image-box\" editor-toolbar=\"true\">\r\n	        <div class=\"embed-responsive embed-responsive-16by9\">\r\n	            <anguvideo class=\"embed-responsive-item\" ng-model=\"section.videoUrl\" width=\"100%\" height=\"100%\"></anguvideo>\r\n	        </div>\r\n	    </div>\r\n	    <editor-caption-public></editor-caption-public>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/video/public/right.html', '<div class=\"editor-section container editor-image layout-right\">\r\n	<div layout=\"row\" layout-align=\"end start\">\r\n	    <editor-caption-public></editor-caption-public>\r\n	    <div flex=\"70\" class=\"image-box\" editor-toolbar=\"true\">\r\n	        <div class=\"embed-responsive embed-responsive-16by9\">\r\n	            <anguvideo class=\"embed-responsive-item\" ng-model=\"section.videoUrl\" width=\"100%\" height=\"100%\"></anguvideo>\r\n	        </div>\r\n	    </div>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/section/video/public/wide.html', '<div class=\"editor-section container editor-image\">\r\n	<div layout=\"column\">\r\n	    <div class=\"image-box\" editor-toolbar=\"true\">\r\n	        <div class=\"embed-responsive embed-responsive-16by9\">\r\n	            <anguvideo class=\"embed-responsive-item\" ng-model=\"section.videoUrl\" width=\"100%\" height=\"100%\"></anguvideo>\r\n	        </div>\r\n	    </div>\r\n	    <editor-caption-public></editor-caption-public>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/toolbar/toolbar.html', '<div class=\"medium-editor-toolbar medium-editor-stalker-toolbar medium-toolbar-arrow-under\">\r\n	<ul class=\"medium-editor-toolbar-actions\">\r\n		<li  ng-repeat=\"layoutButton in layoutButtons\">\r\n			<button tabindex=\"0\" ng-class=\"{\'medium-editor-button-active\' : section.layout==layoutButton}\" ng-click=\"section.layout=layoutButton\">\r\n				<md-icon md-svg-icon=\"{{layoutButtonDetails[layoutButton].icon}}\" style=\"color: white;\"></md-icon>\r\n				<md-tooltip md-direction=\"top\" md-autohide=\"true\">{{layoutButtonDetails[layoutButton].tooltip}}</md-tooltip>\r\n			</button>\r\n		</li>\r\n	</ul>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/tpls/editor-divider.html', '<!-- NOT CONTAINED -->\r\n<div ng-if=\"!editorOptions.contained\">\r\n	<div layout=\"row\" layout-align=\"center\" ng-show=\"editorSections[editorOrder[editorSectionIndex]].type == \'text\' && editorSections[editorOrder[editorSectionIndex+1]].type == \'text\'\">\r\n		<div class=\"md-content-container \" layout=\"row\" layout-align=\"center\">\r\n			<md-divider style=\"width:200px; margin: 15px 0;\"></md-divider>\r\n		</div>\r\n	</div>\r\n</div>\r\n\r\n<!-- CONTAINED -->\r\n<div ng-if=\"editorOptions.contained\">\r\n	<div layout=\"row\" layout-align=\"center\" ng-show=\"editorSections[editorOrder[editorSectionIndex]].type == \'text\' && editorSections[editorOrder[editorSectionIndex+1]].type == \'text\'\">\r\n		<md-divider style=\"width:200px; margin: 15px 0;\"></md-divider>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/modular-editor/tpls/editor-sections.html', '<div ng-class=\"{\'editor-contained\':editorOptions.contained}\">\r\n    <div ng-if=\"!edit\">\r\n        <div ng-repeat=\"sectionId in editorSections.sectionOrder\" class=\"editor-section-row {{editorSections.sections[sectionId].type}}\">\r\n            <editor-section\r\n                section=\"editorSections.sections[sectionId]\"\r\n                editor-options=\"editorOptions\"\r\n                editor-order=\"editorSections.sectionOrder\"\r\n                editor-sections=\"editorSections.sections\"\r\n                editor-section-index=\"$index\"\r\n                editor-section-id=\"sectionId\"\r\n                edit=\"false\">\r\n            </editor-section>\r\n        </div>\r\n    </div>\r\n    <div ng-if=\"edit\">\r\n        <div ng-sortable=\"sortableConfig\">\r\n            <div ng-repeat=\"sectionId in editorSections.sectionOrder\" class=\"editor-section-row {{editorSections.sections[sectionId].type}}\">\r\n                <editor-section\r\n                    section=\"editorSections.sections[sectionId]\"\r\n                    editor-options=\"editorOptions\"\r\n                    editor-order=\"editorSections.sectionOrder\"\r\n                    editor-sections=\"editorSections.sections\"\r\n                    editor-section-index=\"$index\"\r\n                    editor-section-id=\"sectionId\"\r\n                    edit=\"true\"\r\n                    placeholder=\"{{$index == 0 ? placeholder : \'\'}}\"\r\n                    realtime-editor-section=\"{{editorOptions.realtime}}\">\r\n                </editor-section>\r\n                <realtime-editor-locked ng-if=\"editorOptions.realtime\"\r\n                    section=\"editorSections.sections[sectionId]\">\r\n                </realtime-editor-locked>\r\n            </div>\r\n        </div>\r\n        <editor-append-buttons ng-hide=\"editorOptions.minimal\" ng-class=\"{\'minimal\':editorOptions.minimal}\"></editor-append-buttons>\r\n        <editor-help-footer></editor-help-footer>\r\n    </div>\r\n</div>\r\n<!--\r\n		<editor-divider section=\"editorSections.sections[sectionId]\"\r\n            editor-options=\"editorOptions\"\r\n            editor-order=\"editorSections.sectionOrder\"\r\n            editor-sections=\"editorSections.sections\"\r\n            editor-section-index=\"$index\"\r\n            editor-section-id=\"sectionId\">\r\n        </editor-divider>\r\n-->\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/new-creations/tpls/new-something-modal.html', '<md-dialog aria-label=\"New Creation\">\r\n    <md-dialog-content class=\"bg-lightgrey overflow-x-box p-0\">\r\n        <div class=\"md-content-container content-md\" style=\"padding: 30px;\">\r\n            <div>\r\n                <h1 class=\"md-display-1 text-center m-t-30\">What would you like to create?</h1>\r\n                <div class=\"md-title text-grey light-font text-center m-b-60\">Select from the options below</div>\r\n\r\n                <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row-sm\">\r\n                    <div flex class=\"md-col-sm\">\r\n                        <a class=\"st-fancy-select-button text-center m-b-30\" style=\"min-height: 300px;\" layout=\"column\" layout-align=\"center center\" click-create-project>\r\n                            <img class=\"w-50\" src=\"/assets/images/explanation-modals/droid.svg\" alt=\"\">\r\n                            <div class=\"md-title m-b-15\">Create a project</div>\r\n                            <div class=\"text-subtitle-thin\">Access revision history, online previews and team collaboration tools.</div>\r\n                        </a>\r\n                    </div>\r\n                    <div flex class=\"md-col-sm\">\r\n                        <a class=\"st-fancy-select-button text-center m-b-30\" style=\"min-height: 300px;\" layout=\"column\" layout-align=\"center center\" click-create-thread>\r\n                            <img class=\"w-50\" src=\"/assets/images/explanation-modals/alien.svg\" alt=\"\">\r\n                            <div class=\"md-title m-b-15\">Create a Thread</div>\r\n                            <div class=\"text-subtitle-thin\">Post a Blog, Question or Discussion. Join the STEMN community.</div>\r\n                        </a>\r\n                    </div>\r\n                    <div flex class=\"md-col-sm\">\r\n                        <a class=\"st-fancy-select-button text-center m-b-30\" style=\"min-height: 300px;\" layout=\"column\" layout-align=\"center center\" click-create-organisation>\r\n                            <img class=\"w-50\" src=\"/assets/images/explanation-modals/deal.svg\" alt=\"\">\r\n                            <div class=\"md-title m-b-15\">New Organisation</div>\r\n                            <div class=\"text-subtitle-thin\">Create a new organisation. Access jobs and the admin panel.</div>\r\n                        </a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div layout=\"row\" class=\"m-t-30\">\r\n                <div flex></div>\r\n                <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-click=\"cancel()\">\r\n                    Cancel\r\n                </md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/notifications/tpls/notification.html', '<div class=\"notification\" layout=\"row\" layout-align=\"start\" ng-click=\"markRead(notification)\">\r\n    <div>\r\n        <a ng-href=\"{{notification.link1}}\"><img class=\"picture img-circle\" ng-src=\"{{notification.picture1 || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\"></a>\r\n    </div>\r\n    <div flex>\r\n        <a ng-href=\"{{notification.link2 || notification.link1}}\">\r\n            <strong>{{notification.name1}}</strong> {{notification.text}} <strong>{{notification.name2}}<span ng-if=\"notification.name2\">.</span></strong><br>\r\n            <div class=\"time\" am-time-ago=\"::notification.timestamp\"></div>\r\n        </a>\r\n    </div>\r\n    <div ng-if=\"notification.picture2\">\r\n        <a ng-href=\"{{notification.link2}}\">\r\n            <img class=\"picture\" ng-src=\"{{notification.picture2}}?size=thumb&crop=true\">\r\n        </a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/notifications/tpls/notifications.html', '<div>\r\n    <a class=\"notification-button md-button md-icon-button md-border-light\" aria-label=\"Notifications\" ui-sref=\"app.notifications.all\">\r\n        <span class=\"badge\" ng-if=\"(query.results | filter:{read:false}).length > 0\">{{(query.results | filter:{read:false}).length}}</span>\r\n        <md-icon md-svg-src=\"notification\"></md-icon>\r\n    </a>\r\n    <popup popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"10px 0 0 0\" layout=\"column\" class=\"notifications-dropdown\">\r\n        <div class=\"toolbar\" layout=\"row\" layout-align=\"start center\">\r\n            <div flex><strong>{{(query.results | filter:{read:false}).length}}</strong> new notifications.</div>\r\n            <div><a ng-click=\"markAllRead()\">Mark as read</a></div>\r\n            <md-button class=\"md-circle md-xs no-margin\" ng-click=\"goSettings()\" aria-label=\"Notification Settings\"><md-icon md-svg-icon=\"navigation:more_horiz\"></md-icon></md-button>\r\n        </div>\r\n        <md-content style=\"max-height: 250px;\">\r\n            <div ng-show=\"query.results.length == 0\" class=\"p-15 text-lightgrey\">Welcome! You have no notifications yet.</div>\r\n            <notification ng-repeat=\"notification in query.results\" ng-class=\"{\'unread\' : !notification.read}\" notification=\"notification\"></notification>\r\n        </md-content>\r\n        <div class=\"footer\" layout=\"row\" layout-align=\"start center\">\r\n            <div flex><a ui-sref=\"app.notifications.all\">See all notifications</a></div>\r\n        </div>\r\n    </popup>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/onboarding/tpls/checklist-complete-modal.html', '<md-dialog aria-label=\"Tasklist Complete\">\r\n    <md-dialog-content>\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Nice work {{user.firstname}}!</h1>\r\n            <p>You\'ve finished everything on the task-list. With any luck, you\'ve also grasped the site layout and how everything fits together.</p>\r\n            <img src=\"/assets/images/gifs/launch.gif\" alt=\"Liftoff\">\r\n            <p>One final way you can improve your STEMN experience is to <strong>help grow the community</strong>. Please like and share on social media and help us opensource science and engineering.</p>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex>\r\n            <md-button target=\"_blank\" href=\"https://www.facebook.com/stem.network\" class=\"md-icon-button\">\r\n                <md-icon md-font-icon=\"fa-facebook\"></md-icon>\r\n            </md-button>\r\n            <md-button target=\"_blank\" href=\"https://twitter.com/stem_network\" class=\"md-icon-button\">\r\n                <md-icon md-font-icon=\"fa-twitter\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n        <div>\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"cancel()\">Keep browsing</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/onboarding/tpls/feed-checklist.html', '<checklist-item ng-repeat=\"item in checklist\" item-complete=\"checklistItems[item].complete\" item-href=\"checklistItems[item].href\" item-click=\"checklistItems[item].click\">\r\n    {{checklistItems[item].text}}\r\n</checklist-item>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/onboarding/tpls/profile-checklist.html', '<div class=\"checklist\" ng-if=\"incomplete.status\">\r\n    <div class=\"item\" ng-repeat=\"item in checklist\" ng-class=\"{\'complete\':checklistItems[item].complete}\" layout=\"row\" layout-align=\"start center\">\r\n        <md-icon md-svg-icon=\"done\"></md-icon>\r\n        <div flex>\r\n            <a ng-href=\"{{checklistItems[item].href}}\" ng-click=\"checklistItems[item].click($event)\">{{checklistItems[item].text}}</a>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/onboarding/tpls/tip-banner.html', '<div class=\"tip-banner\" ng-hide=\"hideTip || !enableTip || tipHide\">\r\n	<div layout=\"row\">\r\n		<div flex ng-transclude></div>\r\n		<md-button class=\"close md-icon-button\" aria-label=\"close\" ng-click=\"close()\">\r\n			<md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n		</md-button>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/onboarding/tpls/tip-modal.html', '<md-dialog class=\"tipModal\">\r\n    <md-dialog-content>\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">{{data.title}}</h1>\r\n            <div ng-bind-html=\"data.body\"></div>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex class=\"text-lightgrey\">\r\n            Seen this before? <a class=\"underlined\" ng-click=\"optOut()\">Opt out of these tips.</a>\r\n        </div>\r\n        <div>\r\n<!--            <md-button ng-click=\"cancel()\">Tell me more</md-button>-->\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"confirm()\">Ok, I get it</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/organisations/tpls/organisation-cards.html', '<div class=\"rel-box overflow-x-box\">\r\n    <div layout=\"row\" layout-wrap style=\"margin: 0 -15px;\">\r\n        <organisation-card style=\"padding: 0 15px 15px;\" flex=\"25\" flex-sm=\"50\" ng-repeat=\"item in items\" entity=\"item\"></organisation-card>\r\n    </div>\r\n    <a class=\"well-button m-t-40\" layout=\"row\" layout-align=\"center center\" ng-disabled=\"noMoreResults\" ng-click=\"more()\" ng-hide=\"notEnoughResults || hideMore\">\r\n        <div>{{noMoreResults ? \'No more organisations\' : \'See more organisations\'}}</div>\r\n    </a>\r\n    <loading-overlay ng-if=\"loading\" ng-class=\"{\'translucent\' : items.length > 0}\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/organisations/tpls/organisation-groups.html', '<!-- If Editing  -->\r\n<div ng-if=\"edit\">\r\n    <div ng-sortable=\"sortConfig\">\r\n        <organisation-row class=\"my-handle block disable-href\" ng-repeat=\"organisation in organisations track by $index\" data=\"organisation\" show-edit=\"true\" show-role=\"true\" delete-fn=\"delete(organisations, $index)\"></organisation-row>\r\n    </div>\r\n    <organisation-search data=\"organisations\" placeholder=\"Add other organisations\" ng-style=\"organisations != 0 && {\'margin-left\' : \'67px\'}\" focus=\"edit\"></organisation-search>\r\n</div>\r\n\r\n<!-- If Not Editing  -->\r\n<div ng-if=\"!edit\">\r\n    <div ng-if=\"viewLayout!=\'tile\'\">\r\n        <organisation-row ng-repeat=\"organisation in organisations track by $index\" data=\"organisation\"></organisation-row>\r\n    </div>\r\n    <div ng-if=\"viewLayout==\'tile\'\" style=\"margin: 0px -10px;\" layout=\"row\" layout-align=\"start start\" layout-wrap>\r\n        <a ui-sref=\"app.organisation.overview({stub: item.stub})\" ng-repeat=\"item in organisations\" style=\"margin: 0 10px;\" layout=\"column\" layout-align=\"center center\">\r\n            <div class=\"avatar-square-contain m-b-10\" style=\"width: 109px; height: 109px;\" ng-style=\"item.picture && {\'background-image\':\'url(\'+item.picture+\'?size=thumb-lg)\'}\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{item.name}}</md-tooltip>\r\n            </div>\r\n            <div class=\"md-subhead text-center m-b-15\" style=\"width: 100px;\">{{item.role}}</div>\r\n        </a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/organisations/tpls/organisation-icon.html', '<a class=\"organisation-icon avatar-square-contain\" ui-sref=\"app.organisation.overview({stub: item.stub})\" style=\"background-image: url(\'{{item.picture || \'assets/images/default/org.png\'}}?size=thumb\')\">\r\n    <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{item.name}}</md-tooltip>\r\n</a>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/organisations/tpls/organisation-new-modal.html', '<md-dialog>\r\n    <form unsaved-warning-form novalidate name=\"NewOrganisationForm\">\r\n        <md-dialog-content>\r\n            <div class=\"md-content-container content-xs\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Add a new organisation</h1>\r\n                <br>\r\n                <br>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Organisation Name</label>\r\n                    <input name=\"name\" ng-model=\"data.name\"\r\n                    required ng-pattern=\"/[a-zA-Z0-9 !#.,\'\\-\\(\\)]*/\" ng-keyup=\"checkOrganisationExists(data.name)\" focus-me=\"true\">\r\n                    <div ng-messages=\"NewOrganisationForm.name.$error\" ng-if=\"NewOrganisationForm.name.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                        <div ng-message=\"pattern\">Sorry, that organisation name is invalid. You can\'t use the characters: / \\ [ ]</div>\r\n                        <div ng-message=\"exists\">A organisation with that name already exists. Try another.</div>\r\n                    </div>\r\n                </md-input-container>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Description</label>\r\n                    <textarea name=\"blurb\" ng-model=\"data.blurb\" columns=\"1\"></textarea>\r\n                </md-input-container>\r\n                <div class=\"md-dialog-footer\" layout=\"row\">\r\n                    <div flex></div>\r\n                    <div>\r\n                        <md-button ng-click=\"cancel()\">Cancel</md-button>\r\n                        <md-button style=\"margin-right: 0px;\" class=\"md-accent md-raised\" ng-disabled=\"NewOrganisationForm.$invalid\" ng-click=\"save()\">Save</md-button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/pagination/tpls/load-more.html', '<div class=\"title-divider rel-box\">\r\n    <span ng-if=\"!loading\">\r\n        <a class=\"btn btn-white btn-success-hover\" ng-click=\"loadMore()\">Load More</a>\r\n    </span>\r\n    <div class=\"inline vert-middle\" ng-if=\"loading\">\r\n<!--    <div class=\"inline vert-middle anim-spinner-fade\" ng-if=\"loading\">-->\r\n        <div class=\"sk-spinner sk-spinner-rotating-plane\" style=\"background-color: #E5E5E5;\"></div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/pagination/tpls/simple-pagination.html', '<div layout=\"row\" layout-align=\"center center\" style=\"margin-top: 60px;\">\r\n    <div>\r\n        <div class=\"inline\" ng-show=\"page > 1\">\r\n            <md-button class=\"md-fab md-mini md-accent \" ui-sref=\".({\'page\':prevPage})\" ng-click=\"prev()\" aria-label=\"Previous Page\">\r\n                <md-tooltip md-autohide=\"true\">Previous</md-tooltip>\r\n                <md-icon md-svg-src=\"chevron-left\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n        <div class=\"inline\" ng-hide=\"noMoreResults\">\r\n            <md-button class=\"md-fab md-mini md-accent\" ui-sref=\".({\'page\':nextPage})\" ng-click=\"next()\" aria-label=\"Next Page\">\r\n                <md-tooltip md-autohide=\"true\">Next</md-tooltip>\r\n                <md-icon md-svg-src=\"chevron-right\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/popup-cards/tpls/url-card.html', '<div class=\"card url-card\">\r\n    <p><strong>{{title}}</strong>{{subTitle}}</p>\r\n    <div class=\"select-on-click-box\" select-on-click>\r\n    	{{href}}#{{anchor}}\r\n    	<md-tooltip md-direction=\"top\" md-autohide=\"true\">Click to highlight URL</md-tooltip>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/posts/tpls/post-reply.html', '<div>\r\n    <user-input id=\"reply\" class=\"m-b-15\" placeholder=\"Write a response...\" section-data=\"reply.sectionData\" save-fn=\"submit()\" save-text=\"Reply\" status=\"postInputStatus\" title-text=\"{{inputTitle}}\"></user-input>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/posts/tpls/post-summary.html', '<div class=\"card-z1 m-b-15\">\r\n    <!-- Owner -->\r\n    <div>\r\n        <b>Posted in: </b>\r\n        <a ui-sref=\"{{sref}}\" class=\"text-green\">{{post.thread.name || post.project.name}}</a>\r\n        <span class=\"text-lightgrey\" am-time-ago=\"::post.timestamp\"></span>\r\n    </div>\r\n    <!-- Content -->\r\n    <a ui-sref=\"{{sref}}\" style=\"padding-top: 5px; display: block;\" ng-bind-html=\"post.blurb\"></a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/posts/tpls/post.html', '<div class=\"post card-z1\" id=\"{{post._id}}\" >\r\n   <div class=\"edit-box\">\r\n        <!-- Settings -->\r\n        <show-if-owner-or-admin owner=\"{{post.owner._id}}\">\r\n           <md-button class=\"md-circle md-xs md-grey pin-top-right\" style=\"margin: 0;\" aria-label=\"Settings\">\r\n                <md-icon md-svg-src=\"more-h\"></md-icon>\r\n                <popup class=\"tooltip-menu\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" layout=\"column\">\r\n                    <a class=\"md-subhead\" ng-click=\"editPost()\">Edit</a>\r\n                    <a class=\"md-subhead\" confirm ng-click=\"deletePost()\">Delete</a>\r\n                </popup>\r\n            </md-button>\r\n        </show-if-owner-or-admin>\r\n        <!-- Owner -->\r\n        <item-owner avatar=\"{{post.owner.picture}}\" type=\"user\" owner-id=\"{{post.owner._id}}\" owner-stub=\"{{post.owner.stub}}\">\r\n            <h3>\r\n                <a ui-sref=\"app.user.profile({\'stub\' : post.owner.stub })\" class=\"text-green\">{{::post.owner.name}}</a>\r\n                <span ng-show=\"post.isOwner || post.isTeam\" class=\"owner\">\r\n                    <md-tooltip ng-if=\"post.isOwner\" md-direction=\"top\" md-autohide=\"true\">Original Poster</md-tooltip>\r\n                    <md-tooltip ng-if=\"!post.isOwner\"  md-direction=\"top\" md-autohide=\"true\">Project Team Member</md-tooltip>\r\n                </span>\r\n            </h3>\r\n            <div class=\"sub\">\r\n                <a popup popup-width=\"400\" popup-content=\"<url-card title=\'Link this post\' sub-title=\'{{post.timestamp | date : \'h:mm a \\\'on\\\' d MMM y\'}}\' anchor=\'{{post._id}}\'></url-card>\">posted <span am-time-ago=\"::post.timestamp\"></span></a>\r\n            </div>\r\n        </item-owner>\r\n        <!-- Content -->\r\n        <div class=\"main\">\r\n            <modular-editor class=\"editor-compact\" editor-sections=\"post.sectionData\" editor-options=\"editorOptions\" edit=\"edit\"></modular-editor>\r\n            <div class=\"sub\" layout=\"row\" layout-align=\"start center\">\r\n				<div ng-if=\"!edit\" layout=\"row\" layout-align=\"start center\">\r\n					<stat-button  type=\"like\" parent-type=\"post\" parent-id=\"{{post._id}}\" count=\"post.likes\" display-style=\"circle\" class=\"green\"></stat-button>\r\n					<stat-counter type=\"like\" parent-type=\"post\" parent-id=\"{{post._id}}\" count=\"post.likes\" class=\"text-lightgrey\"></stat-counter>\r\n					<div flex></div>\r\n				</div>\r\n                <div flex></div>\r\n<!--\r\n                <md-button ng-if=\"!edit\" class=\"md-icon-button md-sm no-margin\" aria-label=\"reply\" authenticate ng-click=\"replyPost()\">\r\n                    <md-tooltip md-direction=\"top\" md-autohide=\"true\">Reply</md-tooltip>\r\n                    <md-icon md-svg-icon=\"reply\"></md-icon>\r\n                </md-button>\r\n-->\r\n                <md-button ng-if=\"edit\" ng-click=\"cancel()\" class=\"no-margin\" style=\"margin-right: 15px !important\">Cancel</md-button>\r\n                <md-button ng-if=\"edit\" ng-click=\"savePost()\" class=\"md-raised md-accent no-margin\">Save Edit</md-button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!--<post-reply ng-if=\"replyActive\" class=\"m-t-15 block\" parent=\"parent\" timeline=\"timeline\" parent-post=\"post._id\" reply-active=\"replyActive\"></post-reply>-->\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/posts/tpls/user-posts.html', '<md-container>\r\n    <post-summary ng-repeat=\"item in data | orderBy: \'timestamp\':true\" post=\"item\"></post-summary>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-cad/tpls/autodesk-preview.html', '\r\n<autodesk-element ng-if=\"initialiseAutodesk\" token=\"{{token}}\" urn64=\"{{urn64}}\" previewer=\"previewer\"></autodesk-element>\r\n\r\n\r\n<loading-overlay class=\"light-grey\" ng-if=\"status == \'pending\' || status == \'inprogress\'\">\r\n    <div class=\"m-t-15\">\r\n        <div ng-show=\"status == \'pending\'\">Pending Conversion</div>\r\n        <div ng-show=\"status == \'inprogress\'\">Rendering Model</div>\r\n    </div>\r\n</loading-overlay>\r\n<div flex layout=\"column\" layout-align=\"center center\" class=\"text-lightgrey text-center\" ng-if=\"status == \'failed\' || status == \'disabled\'\">\r\n    <div>\r\n        <md-icon class=\"s60 m-b-15\" md-svg-icon=\"error\"></md-icon>\r\n        <div ng-if=\"status == \'disabled\'\">WebGl is disabled or not supported by your browser.<br>Visit <a href=\"http://get.webgl.org/\" target=\"_blank\" class=\"text-green\">webgl.org</a> for more.</div>\r\n        <div ng-if=\"status == \'failed\'\">Something went wrong.<br>Model could not be displayed.</div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-code/tpls/preview-code.html', '<div class=\"CodeMirrorNumbered\" layout=\"row\" flex>\r\n    <loading-overlay ng-if=\"loading\" class=\"light-grey\"></loading-overlay>\r\n    <textarea ng-if=\"!previewer.edit\" ui-codemirror=\"optionsView\" ng-model=\"previewer.fileData\"></textarea>\r\n    <textarea ng-if=\" previewer.edit\" ui-codemirror=\"optionsEdit\" ng-model=\"previewer.fileData\"></textarea>\r\n\r\n<!--    <div style=\"border-left: 1px solid rgba(0, 0, 0, 0.2);\" flex=\"50\" markdown-to-html=\"previewer.fileData\"></div>-->\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-embed/tpls/preview-embed-modal.html', '<md-dialog aria-label=\"Select File\">\r\n    <div class=\"md-modal-header text-subtitle-thin\" layout=\"row\" layout-align=\"start center\">\r\n        <span class=\"text-black\">Embed File Preview</span>\r\n    </div>\r\n\r\n    <md-dialog-content class=\"overflow-x-box rel-box p-0\">\r\n        <div class=\"md-content-container content-sm bg-lightgrey\" style=\"padding: 30px;\">\r\n            <div class=\"card-z1 p-30\">\r\n                <div class=\"md-subhead m-b-15\">Embed Settings</div>\r\n                <p class=\"body-small\">What version of this file do you want to embed?</p>\r\n                <md-radio-group ng-model=\"version\" ng-change=\"change(version)\">\r\n                    <md-radio-button value=\"latest\" class=\"md-accent m-l-0\">\r\n                        Latest Version\r\n                    </md-radio-button>\r\n                    <md-radio-button value=\"specific\" class=\"md-accent m-l-0\">\r\n                        This version (Version {{fileMeta.revDecimal}})\r\n                    </md-radio-button>\r\n                </md-radio-group>\r\n                <div class=\"md-subhead m-b-15 m-t-30\">Iframe Embed Code</div>\r\n                <div class=\"text-lightgrey code-red p-15\" select-on-click>\r\n                    {{code}}\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n\r\n    <div class=\"md-modal-footer\" layout=\"row\" layout-align=\"start center\" flex-order=\"2\">\r\n        <div flex></div>\r\n        <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-click=\"save()\">Finish</md-button>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-files/tpls/preview-files.html', '<!-- Autodesk -->\r\n<div ng-if=\"previewer.type == \'autodesk\'\" flex class=\"bg-lightgrey rel-box\" layout=\"column\">\r\n    <preview-autodesk layout=\"column\" flex project=\"project\" file-meta=\"fileMeta\" previewer=\"previewer\"></preview-autodesk>\r\n</div>\r\n<!-- Image -->\r\n<div ng-if=\"previewer.type == \'image\'\" flex class=\"bg-lightgrey rel-box\" layout=\"column\" layout-align=\"center center\" ng-init=\"loading = true\">\r\n    <loading-overlay ng-if=\"loading\" class=\"light-grey\"></loading-overlay>\r\n    <img ng-src=\"api/v1/sync/download/{{fileMeta.endingUrl}}\" style=\"max-width: 100%; max-height: 100%;\" image-on-load=\"loading = false\">\r\n</div>\r\n<!-- PDF -->\r\n<div ng-if=\"previewer.type == \'pdf\'\" flex class=\"bg-lightgrey rel-box\" layout=\"row\">\r\n    <preview-pdf file-url=\"api/v1/sync/{{ fileMeta.fileType == \'pdf\' || fileMeta.provider == \'drive\' ? \'download\' : \'preview\'}}/{{fileMeta.endingUrl}}\" flex layout=\"row\"></preview-pdf>\r\n</div>\r\n<!-- Google -->\r\n<div ng-if=\"previewer.type == \'google\'\" flex class=\"bg-lightgrey rel-box\" layout=\"column\">\r\n    <iframe flex ng-src=\"{{\'https://docs.google.com/gview?url=http://\'+ hostDomain +\'/api/v1/sync/download/\' + fileMeta.endingUrl + \'&embedded=true\' | trustAsResourceUrl}}\" frameborder=\"0\"></iframe>\r\n</div>\r\n<!-- Code -->\r\n<div ng-if=\"previewer.type == \'code\'\" flex class=\"bg-lightgrey rel-box\" style=\"min-height: 200px; overflow-y: auto;\" >\r\n    <preview-code project=\"project\" file-meta=\"fileMeta\" previewer=\"previewer\"></preview-code>\r\n</div>\r\n<!-- Gerber -->\r\n<div ng-if=\"previewer.type == \'gerber\'\" flex class=\"bg-lightgrey rel-box noselect\" layout=\"column\">\r\n<!--    <iframe flex src=\"/assets/js/gerber/gerber-viewer.html\" frameborder=\"0\"></iframe>-->\r\n    <preview-gerber file-meta=\"fileMeta\" previewer=\"previewer\" flex layout=\"column\" style=\"overflow: auto;\"></preview-gerber>\r\n</div>\r\n<!-- PCB -->\r\n<div ng-if=\"previewer.type == \'pcb\'\" flex class=\"bg-lightgrey rel-box noselect\" layout=\"column\">\r\n    <preview-gerber file-meta=\"fileMeta\" previewer=\"previewer\" flex layout=\"column\" style=\"overflow: auto;\"></preview-gerber>\r\n</div>\r\n<!-- GDoc -->\r\n<div ng-if=\"previewer.type == \'gdoc\'\" flex class=\"bg-lightgrey rel-box\" layout=\"column\">\r\n    <iframe flex ng-src=\"{{fileMeta.webViewLink | trustAsResourceUrl}}\" frameborder=\"0\"></iframe>\r\n</div>\r\n<!-- Other -->\r\n<div ng-if=\"previewer.type == \'other\'\" flex class=\"bg-lightgrey rel-box\" layout=\"column\" layout-align=\"center center\">\r\n    <div layout=\"column\" layout-align=\"center center\">\r\n        <img class=\"m-b-15\" style=\"width: 70px;\" ng-src=\"/assets/images/vectors/filetype/{{fileMeta.fileType || \'folder\'}}.svg\" err-src=\"/assets/images/vectors/filetype/other.svg\">\r\n        <div class=\"text-subtitle-thin text-black m-b-10\">{{fileMeta.name}} <span ng-show=\"fileMeta.revDecimal\" class=\"interpunct\">Version {{fileMeta.revDecimal}}</span></div>\r\n    </div>\r\n    <div class=\"text-subtitle-thin m-b-10\">{{fileMeta.client_modified | amTimeAgo}}<span ng-show=\"fileMeta.size > 0\" class=\"interpunct\">{{fileMeta.size | bytes}}</span></div>\r\n    <a target=\"_self\" ng-href=\"api/v1/sync/download/{{fileMeta.endingUrl}}\" download=\"{{fileMeta.name}}\" class=\"text-green\">Download File</a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-gerber/tpls/preview-gerber.html', '<div flex class=\"canvas-parent\" layout=\"column\" layout-align=\"center center\"></div>\r\n<loading-overlay ng-if=\"loading\" class=\"light-grey\"></loading-overlay>\r\n<div class=\"pin-top-right\">\r\n    <div class=\"text-right\" style=\"margin-top: 5px; margin-right: 10px;\">\r\n        <a class=\"st-icon-button\" ng-click=\"flip()\">\r\n            <md-icon md-svg-icon=\"swap_horiz\"></md-icon>\r\n            <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Flip</md-tooltip>\r\n        </a>\r\n        <a class=\"st-icon-button\" ng-click=\"center()\">\r\n            <md-icon md-svg-icon=\"home\"></md-icon>\r\n            <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Reset</md-tooltip>\r\n        </a>\r\n    </div>\r\n<!--\r\n    <md-checkbox ng-repeat=\"layer in layers\" ng-model=\"layer.enabled\" ng-click=\"toggleLayer(layer)\" ng-show=\"layers.length > 1\">\r\n        {{layer.layerType}}\r\n    </md-checkbox>\r\n-->\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-pcb/tpls/preview-pcb.html', '\r\n<div layout=\"row\" style=\"position: absolute; top: 5px; right: 10px; left: 0;\">\r\n    <div flex></div>\r\n    <a class=\"st-icon-button\" ng-click=\"flipBoard()\">\r\n        <md-icon md-svg-icon=\"swap_horiz\"></md-icon>\r\n        <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Flip</md-tooltip>\r\n    </a>\r\n    <a class=\"st-icon-button\" ng-click=\"reset()\">\r\n        <md-icon md-svg-icon=\"home\"></md-icon>\r\n        <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Reset</md-tooltip>\r\n    </a>\r\n</div>\r\n<div flex layout=\"column\" layout-align=\"center center\">\r\n    <canvas class=\"canvas\"></canvas>\r\n<!--     style=\"width: 100%; height: 100%;\" -->\r\n</div>\r\n\r\n<loading-overlay ng-if=\"loading\" class=\"light-grey\"></loading-overlay>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/preview/preview-pdf/tpls/preview-pdf.html', '<iframe ng-if=\"fileUrl\" flex ng-src=\"{{\'assets/js/pdf/web/viewer-stemn.html?file=/\' + fileUrl | trustAsResourceUrl}}\" frameborder=\"0\"></iframe>\r\n<loading-overlay ng-if=\"loading\" class=\"light-grey\" style=\"top: 2px;\">\r\n    <div class=\"m-t-15\">Loading PDF</div>\r\n</loading-overlay>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/project/project-create-modal/tpls/project-create-modal.basic.html', '<form name=\"forms.generalForm\">\r\n    <h2 class=\"md-display-1\">Create Project</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Enter general display details such as project name and blurb. Remember to set a blurb if you want to open-source your project.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Project Name</div>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Name</label>\r\n                    <input name=\"name\" ng-model=\"project.name\"\r\n                    required type=\"text\" focus-me=\"true\">\r\n                    <div ng-messages=\"forms.nameForm.name.$error\" ng-if=\"forms.nameForm.name.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                    </div>\r\n                </md-input-container>\r\n            </div>\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Project Blurb</div>\r\n                <div class=\"angular-medium-editor\" medium-editor name=\"blurb\" ng-model=\"project.summary\" editor-type=\"text\" style=\"min-height: 100px;\" placeholder=\"What is this project investigating? Your project blurb should be simple yet specific.\"></div>\r\n            </div>\r\n            <div class=\"card-z1 card-padding m-b-30\" ng-show=\"project.fields.length > 0 || project.organisations.length > 0 || project.projects.length > 0\">\r\n                <div class=\"md-subhead m-b-15\" flex>Project Tags</div>\r\n                <p class=\"body-small\">This project will be linked to the following pages: (you can change this later)</p>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"project.projects\" type=\"project\"></tags>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"project.organisations\" type=\"organisation\"></tags>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"project.fields\" type=\"field\"></tags>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/project/project-create-modal/tpls/project-create-modal.html', '<md-dialog class=\"apply-for-job-modal\" aria-label=\"Job application\">\r\n\r\n    <div class=\"md-modal-header\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"onboarding-steps\" layout=\"row\" layout-align=\"start center\">\r\n            <div ng-repeat=\"tab in tabs\" layout=\"row\" layout-align=\"start center\">\r\n                <a class=\"md-subhead\" ng-click=\"tab.click()\" ng-class=\"{\'active\' : activeTab.label == tab.label, \'disabled\' : $index != 0 && steps[tabs[$index-1].label].isDisabled()}\">{{tab.label}}</a>\r\n                <md-icon md-svg-icon=\"chevron-right\" ng-hide=\"$last\"></md-icon>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <md-dialog-content class=\"bg-lightgrey overflow-x-box p-0\">\r\n        <div class=\"md-content-container content-md\" style=\"padding: 30px;\">\r\n            <div ng-include=\"activeTab.path\"></div>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-modal-footer\" layout=\"row\" layout-align=\"start center\" flex-order=\"2\">\r\n        <div flex></div>\r\n        <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-disabled=\"steps[activeTab.label].isDisabled()\" ng-click=\"steps[activeTab.label].nextFn()\">\r\n            {{steps[activeTab.label].nextText}}\r\n        </md-button>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/project/project-create-modal/tpls/project-create-modal.permissions.html', '<h2 class=\"md-display-1\">Project Permissions</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Select an appropriate project type and license. A public project with creative commons license is recommended.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div class=\"card-z1 card-padding m-b-30\">\r\n            <div class=\"md-subhead m-b-20\" flex>Project Type</div>\r\n            <project-type-radios></project-type-radios>\r\n        </div>\r\n        <div class=\"card-z1 card-padding m-b-30\" ng-show=\"project.permissions.projectType == \'public\'\">\r\n            <div class=\"md-subhead\" flex>Copyright License</div>\r\n            <p class=\"body-small\">Protect your work by selecting an appropriate license.</p>\r\n            <project-licenses></project-licenses>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/project/tpls/new-project-modal.html', '<md-dialog>\r\n    <md-dialog-content>\r\n        <form name=\"CreateProjectForm\" novalidate ng-submit=\"createProject()\" unsaved-warning-form class=\"md-content-container content-xs\">\r\n\r\n            <h1 class=\"md-headline\" style=\"margin: 0px 0 30px;\">Create your project.</h1>\r\n            <p class=\"text-lightgrey\">Give your project a title. Don\'t worry, you can change this later.</p>\r\n            <md-input-container class=\"md-accent\" style=\"margin-top:40px;\">\r\n                <label>Project Title</label>\r\n                <input name=\"projectTitle\" ng-model=\"project.name\" focus-me=\"true\">\r\n            </md-input-container>\r\n\r\n            <div ng-show=\"project.fields.length > 0 || project.organisations.length > 0 || project.projects.length > 0\">\r\n                <p class=\"text-lightgrey\">This project will be linked to the following pages: (you can change this later)</p>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"project.projects\" type=\"project\"></tags>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"project.organisations\" type=\"organisation\"></tags>\r\n                <tags edit=\"false\" size=\"sm\" tags=\"project.fields\" type=\"field\"></tags>\r\n            </div>\r\n\r\n            <div class=\"m-t-15\" layout=\"row\">\r\n                <div flex></div>\r\n                <div>\r\n                    <md-button type=\"button\" ng-click=\"cancel()\">Cancel</md-button>\r\n                    <md-button type=\"submit\" class=\"md-accent md-raised m-r-0\">Next</md-button>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/project/tpls/project-licenses.html', '<md-input-container>\r\n    <label>License</label>\r\n    <md-select class=\"block\" name=\"projectLicense\" ng-model=\"project.license\" placeholder=\"Select License\">\r\n        <md-option ng-repeat=\"license in licenses\" value=\"{{license.type}}\">\r\n            {{license.name}}\r\n        </md-option>\r\n    </md-select>\r\n</md-input-container>\r\n<div class=\"text-lightgrey\">\r\n    {{license.description}}&nbsp;<a ng-if=\"license.url\" ng-href=\"{{license.url}}\" target=\"_blank\" class=\"text-green\">Learn more.</a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/project/tpls/project-type-radios.html', '<md-radio-group ng-model=\"project.permissions.projectType\">\r\n    <md-radio-button value=\"public\" class=\"md-accent m-l-0\">\r\n        <div layout=\"row\">\r\n            <md-icon class=\"m-r-10 s30\" md-svg-icon=\"public\" style=\"color: #bbe8bb;\"></md-icon>\r\n            <div>\r\n                <div class=\"text-subtitle-thin text-black\">Public Project (recommended)</div>\r\n                <div class=\"text-lightgrey\">Everyone can see this project. You choose who can collaborate.</div>\r\n            </div>\r\n        </div>\r\n    </md-radio-button>\r\n    <md-radio-button value=\"private\" class=\"md-accent m-l-0\">\r\n        <div layout=\"row\">\r\n            <md-icon class=\"m-r-10 s30\" md-svg-icon=\"lock-outline\" style=\"color: #f5dbab\"></md-icon>\r\n            <div>\r\n                <div class=\"text-subtitle-thin text-black\">Private Project</div>\r\n                <div class=\"text-lightgrey\">You choose who can view and who can collaborate.</div>\r\n            </div>\r\n        </div>\r\n    </md-radio-button>\r\n</md-radio-group>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/projects/tpls/projects-filter-bar.html', '<div class=\"filter-bar\">\r\n    <div class=\"filter-left\">\r\n        <button ui-sref=\"{projectview:\'block\'}\" type=\"button\" class=\"btn btn-white\" style=\"width: 38px;\" ng-class=\"{\'active\' : view==\'block\'}\" ng-click=\"view=\'block\'\"\r\n           tooltip=\"Block view\" tooltip-placement=\"bottom\">\r\n            <icon class=\"fa-square-o\"></icon>\r\n        </button>\r\n        <button ui-sref=\"{projectview : \'map\'}\" class=\"btn btn-white hidden-xs\" style=\"width: 38px;\" ng-class=\"{\'active\' : view==\'map\'}\" ng-click=\"view=\'map\'\"\r\n           tooltip=\"Map view\" tooltip-placement=\"bottom\">\r\n            <icon class=\"fa-map-marker\"></icon>\r\n        </button>\r\n    </div>\r\n    <div class=\"filter-right\">\r\n        <div class=\"inline\" style=\"width: 200px; padding-left: 10px;\">\r\n            <ui-select ng-model=\"active.filter\" on-select=\"updateFilter()\">\r\n                <ui-select-match placeholder=\"Filter threads by:\">{{$select.selected.text}}</ui-select-match>\r\n                <ui-select-choices repeat=\"item in filters | filter: $select.search\">\r\n                    <div ng-bind-html=\"item.text | highlight: $select.search\"></div>\r\n                </ui-select-choices>\r\n            </ui-select>\r\n        </div>\r\n        <button style=\"width: 38px; margin-left: 10px;\" type=\"button\" class=\"btn btn-white\" ng-click=\"active.filter.reverse=!active.filter.reverse; updateFilter()\">\r\n            <icon class=\"fa-chevron-up\" ng-show=\"active.filter.reverse\"></icon>\r\n            <icon class=\"fa-chevron-down\" ng-hide=\"active.filter.reverse\"></icon>\r\n        </button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/prompt-overlay/tpls/prompt-overlay.html', '<div ng-show=\"PromptOverlayService.showPrompt\" class=\"prompt-overlay md-whiteframe-z3\" layout=\"row\">\r\n    <img ng-show=\"img\" class=\"img-circle\" ng-src=\"{{img}}\">\r\n    <div flex class=\"text\" ng-transclude></div>\r\n    <md-button class=\"md-icon-button close-btn\" aria-label=\"Close\" ng-click=\"close()\"><md-icon md-svg-icon=\"navigation:close\"></md-icon></md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/publish/tpls/publish-modal.html', '<md-dialog style=\"z-index: 1001\">\r\n    <md-dialog-content>\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Wait! This is unpublished.</h1>\r\n            <div>\r\n            	<p>It will not be visible to others until you publish it.</p>\r\n            	<p>You\'ll find the publish button in the bottom right corner of the page footer.</p>\r\n            	<img src=\"/assets/images/tips/publish.png\" alt=\"Publish Image\">\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex></div>\r\n        <div>\r\n            <md-button ng-click=\"cancel()\">Publish later</md-button>\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"confirm()\">Go back and publish</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/publish/tpls/publish-share-link-modal.html', '<md-dialog>\r\n    <md-dialog-content>\r\n        <div style=\"width: 500px;\">\r\n            <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Copy and share the link below:</h1>\r\n            <br>\r\n            <div class=\"select-on-click-box\" select-on-click>\r\n            	{{url}}\r\n            	<md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Click to highlight URL</md-tooltip>\r\n            </div>\r\n            <br>\r\n            <p><strong>Important:</strong><br>Anyone with this link will be able to view this page, even if it has not yet been published.</p>\r\n            <div layout=\"row\">\r\n            	<div flex></div>\r\n            	<md-button class=\"md-accent md-raised\" ng-click=\"cancel()\">Close</md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/publish/tpls/select-stub-modal.html', '<md-dialog>\r\n    <form novalidate name=\"Form\" ng-submit=\"save()\">\r\n        <md-dialog-content>\r\n            <div class=\"md-content-container content-xs\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Select a URL</h1>\r\n                <p>Finalise your {{urlType}}\'s name. This will determine the URL.</p>\r\n                <br>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label class=\"capitalise\">{{urlType}} name</label>\r\n                    <input name=\"title\" ng-model=\"entity.name\" required ng-minlength=\"5\" ng-maxlength=\"100\" ng-pattern=\"/[a-zA-Z0-9 !#.,\'\\-\\(\\)]*/\" ng-keyup=\"checkAvailability(entity.name)\" focus-me=\"true\">\r\n                    <div ng-messages=\"Form.title.$error\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                        <div ng-message=\"minlength\">The title has be more than 5 characters.</div>\r\n                        <div ng-message=\"maxlength\">Try keep your title under 100 characters.</div>\r\n                        <div ng-message=\"pattern\">Sorry, that title is invalid. You can\'t use the characters: / \\ [ ]</div>\r\n                        <div ng-message=\"notavailable\">A {{urlType}} with that title already exists. Try another.</div>\r\n                    </div>\r\n                </md-input-container>\r\n                <div>\r\n                    <p>After publishing, your {{urlType}} will be available at:</p>\r\n                    <p class=\"text-lightgrey\"><strong>stemn.com/</strong>{{urlType}}s/{{stub}}</p>\r\n                </div>\r\n                <div layout=\"row\">\r\n                    <div flex></div>\r\n                    <md-button class=\"\" ng-click=\"cancel()\">Cancel</md-button>\r\n                    <md-button class=\"md-accent md-raised\" ng-click=\"save()\" ng-disabled=\"Form.$invalid\">Publish</md-button>\r\n                </div>\r\n            </div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/realtime-editor/tpls/multiple-edit-modal.html', '<md-dialog aria-label=\"error\">\r\n    <md-dialog-content style=\"width: 500px;\">\r\n        <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Multiple Editors Error</h1>\r\n        <p>You are already editing this page. Usually this means that you have STEMN open in another browser or someone else is logged in to your account.</p>\r\n        <p>You won\'t be able to continue editing until this is fixed.</p>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\" style=\"padding-top: 0px;\">\r\n        <div flex></div>\r\n        <div>\r\n            <md-button class=\"md-warn md-raised\" ui-sref=\"app.creations.all\">Ok</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/realtime-editor/tpls/realtime-editor-locked.html', '<div class=\"realtime-editor-locked\" ng-if=\"RealtimeEditorService.edits[section.id]\" layout=\"row\" layout-align=\"center center\">\r\n	<div>\r\n		<user-icon user-id=\"{{RealtimeEditorService.edits[section.id]}}\" user=\"user\"></user-icon>\r\n		<md-tooltip>This section is currently being edited by {{user.name}}</md-tooltip>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/realtime-editor/tpls/save-toast.html', '<md-toast>\r\n	<span flex>{{message}}</span>\r\n	<md-progress-circular md-mode=\"indeterminate\" ng-hide=\"complete\"></md-progress-circular>\r\n<!--\r\n	<md-button ng-click=\"closeToast()\">\r\n		Close\r\n	</md-button>\r\n-->\r\n</md-toast>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/related/tpls/related-compact-feed.html', '<div ng-if=\"data.length > 0\">\r\n    <h3 class=\"md-subhead\">{{typeInfo.title}}</h3>\r\n    <md-divider class=\"m-b-30\"></md-divider>\r\n    <div ng-repeat=\"result in data\">\r\n        <feed-item data=\"result\" item-type=\"{{type}}\" size=\"sm\"></feed-item>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/related/tpls/related-tags.html', '<tags tags=\"data\" type=\"{{type}}\" edit=\"false\" size=\"sm\"></tags>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/row-views/tpls/field-row.html', '<div class=\"row-view\" layout=\"row\" layout-align=\"start center\">\r\n    <div class=\"avatar\">\r\n        <field-image src=\"data.picture\" image-id=\"{{data._id}}\" image-stub=\"{{data.stub}}\"></field-image>\r\n    </div>\r\n    <div flex class=\"ellipsis-container\">\r\n        <a class=\"text-green ellipsis\" ui-sref=\"app.field.top({\'stub\' : data.stub})\">{{data.name}}</a>\r\n        <div class=\"text-lightgrey ellipsis\">{{data.blurb}}</div>\r\n    </div>\r\n    <div>\r\n        <stat-button ng-hide=\"showEdit\" hide-stat=\"true\" size=\"sm\" hide-icon=\"true\" type=\"follow\" parent-type=\"field\" parent-id=\"{{data._id}}\" count=\"data.followers\"></stat-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/row-views/tpls/loading-row.html', '<div class=\"loading-overlay-fade\">\r\n    <div class=\"loading-animation row-view\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"avatar loading\"></div>\r\n        <div flex>\r\n            <div><div class=\"loading-text md\">  </div></div>\r\n            <div><div class=\"loading-text sm\">  </div></div>\r\n        </div>\r\n        <div class=\"loading-button\"></div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/row-views/tpls/org-user-row.html', '<div class=\"row-view\" layout=\"row\" layout-align=\"start center\">\r\n    <div class=\"avatar\">\r\n        <organisation-image ng-if=\"showOrg\"  src=\"picture\" image-id=\"{{itemId}}\" image-stub=\"{{stub}}\"></organisation-image>\r\n        <user-image         ng-if=\"!showOrg\" src=\"picture\" image-id=\"{{itemId}}\" image-stub=\"{{stub}}\"></user-image>\r\n    </div>\r\n    <div flex class=\"ellipsis-container\">\r\n        <div class=\"md-subhead\" contenteditable=\"{{showEdit || \'false\'}}\" ng-model=\"role\" placeholder=\"role\"></div>\r\n        <a class=\"text-green ellipsis\">{{name}}</a>\r\n        <div class=\"text-lightgrey ellipsis\">{{blurb}}</div>\r\n    </div>\r\n    <div>\r\n        <md-button ng-hide=\"showEdit\" class=\"md-accent md-border md-sm md-border md-lower no-hover\">Follow</md-button>\r\n        <md-button ng-show=\"showEdit\" class=\"md-warn   md-border md-sm md-border md-lower no-hover\">Delete</md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/row-views/tpls/organisation-row.html', '<div class=\"row-view\" layout=\"row\" layout-align=\"start center\">\r\n    <div class=\"avatar\">\r\n        <organisation-image src=\"data.picture\" image-id=\"{{data._id}}\" image-stub=\"{{data.stub}}\"></organisation-image>\r\n    </div>\r\n    <div flex>\r\n        <div class=\"md-subhead\" ng-show=\"showRole\">\r\n            <span  ng-hide=\"showEdit\">{{data.role}}</span>\r\n            <input ng-show=\"showEdit\" class=\"editable\" type=\"text\" ng-model=\"data.role\" placeholder=\"Role\" name=\"role\">\r\n        </div>\r\n        <a class=\"text-green\" ui-sref=\"app.organisation.overview({\'stub\' : data.stub})\">{{data.name}}</a>\r\n        <div class=\"text-lightgrey\">{{data.blurb | words: 20}}</div>\r\n    </div>\r\n    <div>\r\n        <stat-button ng-hide=\"showEdit\" hide-stat=\"true\" size=\"sm\" hide-icon=\"true\" type=\"follow\" parent-type=\"organisation\" parent-id=\"{{data._id}}\" count=\"data.followers\"></stat-button>\r\n        <md-button   ng-show=\"showEdit && !data.owner\" aria-label=\"delete\" class=\"md-warn md-border md-sm md-border md-lower no-hover\" ng-click=\"deleteFn()\">Delete</md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/row-views/tpls/row-view.html', '<loading-row ng-if=\"data.loading\"></loading-row>\r\n<div class=\"row-view\" layout=\"row\" layout-align=\"start center\">\r\n    <a ng-href=\"{{data.href}}\"\r\n    class=\"avatar {{avatarType}}\" ng-style=\"{ \'background-image\':\'url(\'+(data.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb)\'}\"></a>\r\n    <div flex class=\"ellipsis-container\">\r\n        <a class=\"text-green ellipsis\" ng-href=\"{{data.href}}\">{{data.name || \'Untitled \' + data.entityType}}</a>\r\n        <div class=\"text-lightgrey ellipsis\">{{data.blurb}}</div>\r\n    </div>\r\n    <div>\r\n        <stat-button  ng-if=\"data.entityType != \'job\'\" hide-stat=\"true\" size=\"sm\" hide-icon=\"true\" type=\"follow\" parent-type=\"{{data.entityType}}\" parent-id=\"{{data._id}}\" count=\"data.followers\"></stat-button>\r\n        <apply-button ng-if=\"data.entityType == \'job\'\" job=\"data\" job-id=\"{{data._id}}\" job-stub=\"{{data.stub}}\" class=\"md-sm no-margin\" style=\"min-width: 70px;\" change-state=\"true\"></apply-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/row-views/tpls/user-row.html', '<loading-row ng-if=\"loading\"></loading-row>\r\n<div class=\"row-view\" layout=\"row\" layout-align=\"start center\">\r\n    <div class=\"avatar avatar-circle\" ng-style=\"{ \'background-image\':\'url(\'+(data.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\">\r\n<!--        <user-image src=\"data.picture\" image-id=\"{{data._id}}\" image-stub=\"{{data.stub}}\"></user-image>-->\r\n    </div>\r\n    <div flex>\r\n        <div class=\"md-subhead\">\r\n            <span  ng-hide=\"showEdit\">{{data.role}}</span>\r\n            <input ng-show=\"showEdit\" class=\"editable\" type=\"text\" ng-model=\"data.role\" placeholder=\"Role\" name=\"role\">\r\n        </div>\r\n        <a class=\"text-green\" ui-sref=\"app.user.profile({\'stub\' : data.stub})\">{{data.name}}</a>\r\n        <div class=\"text-lightgrey\">{{data.blurb | words: 20}}</div>\r\n    </div>\r\n    <div>\r\n        <stat-button ng-hide=\"showEdit\" hide-stat=\"true\" size=\"sm\" hide-icon=\"true\" type=\"follow\" parent-type=\"user\" parent-id=\"{{data._id}}\" count=\"data.followers\"></stat-button>\r\n        <md-button   ng-show=\"showEdit && !data.owner\" aria-label=\"delete\" class=\"md-warn md-border md-sm md-border md-lower no-hover\" ng-click=\"deleteFn()\">Delete</md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/search/organisation-search/tpls/organisation-search.html', '<div class=\"rel-box\" flex=\"\">\r\n<!--\r\n    <md-button ng-show=\"searchText.length>1\" class=\"add-new-button md-accent md-border-green md-sm\" ng-click=\"create($event, searchText)\">\r\n        Create organisation\r\n    </md-button>\r\n-->\r\n   <md-autocomplete md-selected-item=\"selectedItem\" md-selected-item-change=\"processResult(selectedItem)\"  md-search-text=\"searchText\"\r\n        md-items=\"item in search(searchText)\" md-item-text=\"item.name\"\r\n        md-floating-label=\"{{placeholder || \'Organisations\'}}\" focus-me=\"{{focus}}\">\r\n        <md-item-template>\r\n            <span md-highlight-text=\"searchText\">{{item.name}}</span>\r\n        </md-item-template>\r\n<!--\r\n        <md-not-found>\r\n            <span>No more organisations found.</span>\r\n            <md-button ng-click=\"create($event,searchText)\" class=\"md-accent md-raised\">Click here to create one...</md-button>\r\n        </md-not-found>\r\n-->\r\n    </md-autocomplete>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/search/tpls/field-search.html', '<div class=\"rel-box\" flex=\"\">\r\n<!--\r\n    <md-button ng-show=\"searchText.length>1\" class=\"add-new-button md-accent md-border-green md-sm\" ng-click=\"create($event, searchText)\">\r\n        Create field\r\n    </md-button>\r\n-->\r\n   <md-autocomplete md-selected-item=\"selectedItem\" md-selected-item-change=\"processResult(selectedItem)\"  md-search-text=\"searchText\"\r\n        md-items=\"item in search(searchText)\" md-item-text=\"item.name\"\r\n        md-floating-label=\"{{placeholder || \'Fields\'}}\"\r\n        autocomplete=\"off\" focus-me=\"{{focus}}\">\r\n        <md-item-template>\r\n            <span md-highlight-text=\"searchText\">{{item.name}}</span>\r\n        </md-item-template>\r\n<!--\r\n        <md-not-found>\r\n            <span>No more fields found.</span>\r\n            <md-button ng-click=\"create($event,searchText)\" class=\"md-accent md-raised\">Click here to create one...</md-button>\r\n        </md-not-found>\r\n-->\r\n    </md-autocomplete>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/search/tpls/location-search.html', '<div flex=\"\">\r\n   <md-autocomplete md-selected-item=\"selectedItem\" md-selected-item-change=\"processResult(selectedItem)\"  md-search-text=\"searchText\"\r\n        md-items=\"item in getLocation(searchText)\" md-item-text=\"item.name\"\r\n        md-floating-label=\"{{placeholder || \'Location\'}}\"\r\n        autocomplete=\"off\" focus-me=\"{{focus}}\">\r\n        <md-item-template>\r\n            <span md-highlight-text=\"searchText\">{{item.name}}</span>\r\n        </md-item-template>\r\n        <md-not-found>\r\n            No more matches found.\r\n        </md-not-found>\r\n    </md-autocomplete>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/search/tpls/project-search.html', '<div flex=\"\">\r\n   <md-autocomplete md-selected-item=\"selectedItem\" md-selected-item-change=\"processResult(selectedItem)\"  md-search-text=\"searchText\"\r\n        md-items=\"item in search(searchText)\" md-item-text=\"item.name\"\r\n        md-floating-label=\"{{placeholder || \'Projects\'}}\"\r\n        autocomplete=\"off\" focus-me=\"{{focus}}\">\r\n        <md-item-template>\r\n            <span md-highlight-text=\"searchText\">{{item.name}}</span>\r\n        </md-item-template>\r\n        <md-not-found>\r\n            No more matches found.\r\n        </md-not-found>\r\n    </md-autocomplete>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/search/tpls/user-search.html', '<div flex=\"\">\r\n   <md-autocomplete md-no-cache=\"true\" md-selected-item=\"selectedItem\" md-selected-item-change=\"processResult(selectedItem)\"  md-search-text=\"searchText\"\r\n        md-items=\"item in search(searchText)\" md-item-text=\"item.name\"\r\n        md-floating-label=\"{{placeholder || \'Team members\'}}\" focus-me=\"{{focus}}\">\r\n        <md-item-template>\r\n            <user-image src=\"item.picture\" image-stub=\"{{item.stub}}\" style=\"margin-right:15px\" ng-hide=\"{{item.addNew}}\"></user-image>\r\n            <span md-highlight-text=\"searchText\">{{item.name}}</span>\r\n        </md-item-template>\r\n    </md-autocomplete>\r\n</div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/site-search/tpls/site-search.html', '<div class=\"search-box showResultsOnClick\" layout=\"row\" layout-align=\"start center\">\r\n    <a ui-sref=\"app.search.all({\'q\':search})\"><md-icon class=\"showResultsOnClick\" md-svg-icon=\"search\" style=\"color: rgba(0, 0, 0, 0.15); width: 20px;\"></md-icon></a>\r\n    <input flex class=\"showResultsOnClick\" type=\"text\" ng-model=\"search\" placeholder=\"Search STEMN\">\r\n</div>\r\n<div class=\"dropdown-results showResultsOnClick\" ng-show=\"showResults\"\r\n   list-keyboard-navigation enable=\"showResults\" list=\"fullResults\" active-index=\"activeIndex\" selector=\"list-nav-active\" esc-fn=\"hidePanel()\">\r\n    <div class=\"results-group\" ng-show=\"results.creations.length > 0\">\r\n        <div class=\"md-subhead\" ui-sref=\"app.search.creations({\'q\':search})\"><span>Creations</span><a class=\"float-right text-green\">MORE</a></div>\r\n        <a class=\"result ellipsis anim-repeat-slide\" ng-repeat=\"result in results.creations\" ng-click=\"goToResult(result.stub, result.type)\" ng-class=\"{\'list-nav-active\': fullResults[activeIndex]._id == result._id}\">\r\n            <img ng-src=\"{{result.picture || \'assets/images/default/org.png\'}}?size=thumb&crop=true\" alt=\"\">{{result.name}}\r\n        </a>\r\n    </div>\r\n    <div class=\"results-group\" ng-show=\"results.user.length > 0\">\r\n        <div class=\"md-subhead\" ui-sref=\"app.search.users({\'q\':search})\"><span>Users</span><a class=\"float-right text-green\">MORE</a></div>\r\n        <a class=\"result ellipsis anim-repeat-slide\" ng-repeat=\"result in results.user\" ng-click=\"goToResult(result.stub, \'user\')\" ng-class=\"{\'list-nav-active\': fullResults[activeIndex]._id  == result._id}\">\r\n            <img class=\"img-circle\" ng-src=\"{{result.picture || \'assets/images/default/user-1.png\'}}?size=thumb&crop=true\" alt=\"\">{{result.name}}\r\n        </a>\r\n    </div>\r\n    <div class=\"results-group\" ng-show=\"results.organisation.length > 0\">\r\n        <div class=\"md-subhead\" ui-sref=\"app.search.organisations({\'q\':search})\"><span>Organisations</span><a class=\"float-right text-green\">MORE</a></div>\r\n        <a class=\"result ellipsis anim-repeat-slide\" ng-repeat=\"result in results.organisation\" ng-click=\"goToResult(result.stub, \'organisation\')\" ng-class=\"{\'list-nav-active\': fullResults[activeIndex]._id  == result._id}\">\r\n            <img ng-src=\"{{result.picture || \'assets/images/default/user-1.png\'}}?size=thumb&crop=true\" alt=\"\">{{result.name}}\r\n        </a>\r\n    </div>\r\n    <div class=\"results-group\" ng-show=\"results.field.length > 0\">\r\n        <div class=\"md-subhead\" ui-sref=\"app.search.fields({\'q\':search})\"><span>Fields</span><a class=\"float-right text-green\">MORE</a></div>\r\n        <a class=\"result ellipsis anim-repeat-slide\" ng-repeat=\"result in results.field\" ng-click=\"goToResult(result.stub, \'field\')\" ng-class=\"{\'list-nav-active\': fullResults[activeIndex]._id  == result._id}\">\r\n            <img ng-src=\"{{result.picture || \'assets/images/default/user-1.png\'}}?size=thumb&crop=true\" alt=\"\">{{result.name}}\r\n        </a>\r\n    </div>\r\n    <div class=\"results-group\" ng-show=\"results.job.length > 0\">\r\n        <div class=\"md-subhead\" ui-sref=\"app.search.jobs({\'q\':search})\"><span>Jobs</span><a class=\"float-right text-green\">MORE</a></div>\r\n        <a class=\"result ellipsis anim-repeat-slide\" ng-repeat=\"result in results.job\" ng-click=\"goToResult(result.stub, \'job\')\" ng-class=\"{\'list-nav-active\': fullResults[activeIndex]._id  == result._id}\">\r\n            <img ng-src=\"{{result.picture || \'assets/images/default/user-1.png\'}}?size=thumb&crop=true\" alt=\"\">{{result.name}}\r\n        </a>\r\n    </div>\r\n    <!-- Show NOT FOUND if nothing found... -->\r\n    <div class=\"results-group\" ng-show=\"fullResults.length == 0\">\r\n        <div class=\"md-subhead\">No Results</div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/skills/tpls/evidenced-fields.html', '<!-- If Editing -->\r\n<div ng-if=\"edit\">\r\n    <div class=\"card-z1 m-b-30\">\r\n        <div class=\"md-subhead\">Skills and Fields</div>\r\n        <field-search id=\"skillsEdit\" data=\"user.profile.profileDetails.skills\" focus=\"focusTech\" ng-mouseenter=\"focusTech=true\" ng-mouseleave=\"focusTech=false\" placeholder=\"Skills and fields\"></field-search>\r\n        <tags edit=\"true\" size=\"sm\" tags=\"user.profile.profileDetails.skills\" type=\"field\" evidence=\"true\" drop-area=\"true\"></tags>\r\n    </div>\r\n    <div class=\"card-z1 m-b-30\">\r\n        <div class=\"md-subhead\">Technologies and Technical Languages</div>\r\n        <field-search id=\"technologiesEdit\" data=\"user.profile.profileDetails.technologies\" focus=\"focusField\" ng-mouseenter=\"focusField=true\" ng-mouseleave=\"focusField=false\" placeholder=\"Technologies, Programs and Languages\"></field-search>\r\n        <tags edit=\"true\" size=\"sm\" tags=\"user.profile.profileDetails.technologies\" type=\"field\" evidence=\"true\" drop-area=\"true\"></tags>\r\n    </div>\r\n    <div class=\"card-z1 m-b-15\">\r\n        <div class=\"md-subhead m-b-10\">Unclassified Skills</div>\r\n        <p class=\"text-lightgrey\">Drag and drop these into the sections above</p>\r\n        <tags tags=\"unclassifiedFields\" type=\"field\" size=\"sm\" edit=\"true\" evidence=\"true\" drop-area=\"true\"></tags>\r\n    </div>\r\n</div>\r\n\r\n<!-- If NOT Editing -->\r\n<div ng-if=\"!edit\">\r\n    <div class=\"m-b-15\" ng-show=\"user.profile.profileDetails.skills.length > 0\">\r\n        <div class=\"md-subhead m-b-10\">Skills and Fields</div>\r\n        <tags tags=\"user.profile.profileDetails.skills\" type=\"field\" size=\"sm\" edit=\"false\" evidence=\"true\"></tags>\r\n    </div>\r\n    <div class=\"m-b-15\" ng-show=\"user.profile.profileDetails.technologies.length > 0\">\r\n        <div class=\"md-subhead m-b-10\">Technologies and Technical Languages</div>\r\n        <tags tags=\"user.profile.profileDetails.technologies\" type=\"field\" size=\"sm\" edit=\"false\" evidence=\"true\"></tags>\r\n    </div>\r\n    <div class=\"m-b-15\" ng-show=\"unclassifiedFields.length > 0\">\r\n        <div class=\"md-subhead m-b-10\">Other Skills</div>\r\n        <tags tags=\"unclassifiedFields\" type=\"field\" size=\"sm\" edit=\"false\" evidence=\"true\"></tags>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/skills/tpls/user-skills.html', '<tags edit=\"false\" size=\"xs\" tags=\"tags\" type=\"field\" evidence=\"true\"></tags>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/social-media/tpls/social-links-modal.html', '<md-dialog>\r\n    <md-dialog-content style=\"width: 500px;\">\r\n        <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Edit Social Links</h1>\r\n        <social-links edit=\"true\" data=\"data\" type=\"{{type}}\"></social-links>\r\n        <div layout=\"row\" style=\"margin-top: 20px\">\r\n            <div flex></div>\r\n            <div>\r\n                <md-button class=\"no-margin-v\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button class=\"md-accent md-raised no-margin-v\" ng-click=\"confirm()\">Save</md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/social-media/tpls/social-links.html', '<div class=\"social-links rel-box\">\r\n    <edit-button ng-if=\"showEdit\" edit-fn=\"editModal($event)\"></edit-button>\r\n    <div ng-hide=\"edit\" ng-style=\"showEdit && {\'margin-right\':\'35px\'}\">\r\n        <md-button class=\"md-icon-button\" ng-repeat=\"key in linkOrder\" href=\"{{links[key].base}}{{data[key]}}\" target=\"_blank\" ng-show=\"data[key]\">\r\n            <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{links[key].base | stripHttp }}{{data[key]}}</md-tooltip>\r\n            <md-icon md-font-icon=\"{{links[key].icon}}\" class=\"fa s32\"></md-icon>\r\n        </md-button>\r\n    </div>\r\n    <div class=\"edit\" ng-show=\"edit\">\r\n        <div ng-repeat=\"key in linkOrder\">\r\n            <div class=\"input\" layout=\"row\">\r\n                <p class=\"text-lightgrey\">\r\n                    <span ng-if=\" links[key].alt\">{{links[key].alt}}</span>\r\n                    <span ng-if=\"!links[key].alt\" class=\"link-base\">{{links[key].base | stripHttp}}</span>\r\n                </p>\r\n                <p flex>\r\n                    <input class=\"editable\" type=\"text\" ng-model=\"data[key]\">\r\n                </p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/social-media/tpls/social-prompt-modal.html', '<md-dialog class=\"social-prompt-modal\" aria-label=\"social-prompt\">\r\n    <md-dialog-content>\r\n        <div class=\"md-content-container content-xs\">\r\n            <h1 class=\"md-headline m-t-0\">Last step: Share your {{ data.entity || \'project\'}}</h1>\r\n            <p>Want to get feedback faster? Help us grow the community by sharing this {{ data.entity || \'project\'}} with your friends and colleagues.</p>\r\n           <social-share-buttons class=\"block m-v-30\" tiles=\"true\"></social-share-buttons>\r\n            <div layout=\"row\">\r\n                <div flex></div>\r\n                <md-button ng-click=\"cancel()\" class=\"m-0\">Skip</md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/social-media/tpls/social-share-button.html', '<md-menu md-position-mode=\"target-right target\">\r\n    <md-button class=\"md-icon-button md-sm no-margin\" aria-label=\"Share To Networks\" ng-click=\"$mdOpenMenu()\">\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Share</md-tooltip>\r\n        <md-icon md-svg-src=\"share\"></md-icon>\r\n    </md-button>\r\n\r\n    <md-menu-content width=\"2\">\r\n        <md-menu-item ng-repeat=\"item in shares\">\r\n            <md-button href=\"{{item.href}}\" onclick=\"window.open(this.href, \'mywin\',\'left=20,top=20,width=500,height=500,toolbar=1,resizable=0\'); return false\">\r\n                <md-icon md-font-icon=\"{{item.icon}}\"></md-icon>\r\n                <p>{{item.title}}</p>\r\n            </md-button>\r\n        </md-menu-item>\r\n    </md-menu-content>\r\n</md-menu>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/social-media/tpls/social-share-buttons.html', '<div class=\"social-share-buttons\" ng-if=\"!tiles\">\r\n    <md-button ng-href=\"{{item.href}}\" ng-repeat=\"item in shares\" class=\"md-icon-button md-sm m-0\" onclick=\"window.open(this.href, \'mywin\',\'left=20,top=20,width=500,height=500,toolbar=1,resizable=0\'); return false\">\r\n        <md-icon md-svg-icon=\"{{item.icon}}\"></md-icon>\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{item.title}}</md-tooltip>\r\n    </md-button>\r\n</div>\r\n<div class=\"social-share-tiles\" layout=\"row\" ng-if=\"tiles\">\r\n    <a flex=\"33\" ng-repeat=\"item in shares\" ng-href=\"{{item.href}}\" onclick=\"window.open(this.href, \'mywin\',\'left=20,top=20,width=500,height=500,toolbar=1,resizable=0\'); return false\">\r\n        <img class=\"w-100\" src=\"assets/images/vectors/share-tiles/{{item.icon}}.svg\" alt=\"{{item.title}}\">\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/statistics/tpls/stat-button.html', '<div class=\"stat-button inline {{itemStatus.status ? \'active\' : \'inactive\'}}\">\r\n    <md-button authenticate ng-if=\"displayStyle==\'circle\'\" ng-click=\"clickButton()\" class=\"circle vert-middle md-icon-button md-sm no-margin\">\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{itemStatus.status ? types[type].active.usual.text : types[type].inactive.usual.text }}</md-tooltip>\r\n        <md-icon ng-show=\"itemStatus.status\"  md-svg-icon=\"{{types[type].active.hover.icon}}\"></md-icon>\r\n        <md-icon ng-show=\"!itemStatus.status\" md-svg-icon=\"{{types[type].inactive.hover.icon}}\"></md-icon>\r\n    </md-button>\r\n    <md-button authenticate ng-if=\"displayStyle!=\'circle\'\" ng-click=\"clickButton()\" class=\"rect vert-middle md-accent md-border md-sm no-margin\">\r\n        <div class=\"anim-button-text-block {{itemStatus.status ? \'active\' : \'inactive\'}} capitalise\">\r\n            <div>{{types[type].inactive.usual.text}}<span hide-sm>&nbsp;{{entityText}}</span></div>\r\n            <div>{{types[type].active.usual.text}}<span hide-sm>&nbsp;{{entityText}}</span></div>\r\n        </div>\r\n    </md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/statistics/tpls/stat-display-modal.html', '<md-dialog class=\"md-full-screen\">\r\n    <md-toolbar style=\"background: white;\">\r\n        <div class=\"md-toolbar-tools\">\r\n            <span flex></span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <md-dialog-content layout=\"row\" layout-align=\"center start\">\r\n        <div class=\"md-content-container content-sm\">\r\n            <div layout=\"row\">\r\n                <div class=\"md-headline\" flex>{{data.title}}</div>\r\n                <stat-button parent-id=\"{{data.parentId}}\" parent-type=\"{{data.parentType}}\" type=\"{{data.type}}\" count=\"numLikes\" ng-click=\"refresh()\"></stat-button>\r\n            </div>\r\n            <md-divider class=\"md-md\"></md-divider>\r\n            <stat-display    parent-id=\"{{data.parentId}}\" parent-type=\"{{data.parentType}}\" type=\"{{data.type}}\" refresh-callback=\"refresh\"></stat-display>\r\n        </div>\r\n    </md-dialog-content>\r\n    <div class=\"md-actions\" layout=\"row\">\r\n        <div flex></div>\r\n        <div>\r\n            <md-button class=\"md-accent md-raised\" ng-click=\"cancel()\">Back</md-button>\r\n        </div>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/statistics/tpls/stat-display.html', '<div infinite-scroll=\"more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"loading\">\r\n    <div class=\"rel-box\">\r\n        <user-row ng-repeat=\"item in results\" item-id=\"{{::item}}\"></user-row>\r\n    </div>\r\n    <div class=\"text-no-results\" ng-show=\"noMoreResults\">That\'s all there is.</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/sync-file-select/tpls/sync-file-select-modal.html', '<md-dialog aria-label=\"Select File\">\r\n    <div class=\"md-modal-header text-subtitle-thin\" layout=\"row\" layout-align=\"start center\">\r\n        <span class=\"text-black\">Select file</span>\r\n    </div>\r\n\r\n    <md-dialog-content class=\"overflow-x-box rel-box p-0\">\r\n        <div class=\"md-content-container content-sm\" style=\"padding: 0;\">\r\n            <sync-file-select path=\"path\" project=\"project\" provider=\"provider\" selected=\"selected\"></sync-file-select>\r\n        </div>\r\n    </md-dialog-content>\r\n\r\n    <div class=\"md-modal-footer\" style=\"border: none;\" layout=\"row\" layout-align=\"start center\" flex-order=\"2\">\r\n        <div flex></div>\r\n        <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-click=\"save()\" ng-disabled=\"!selected.name\">Select File</md-button>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/sync-file-select/tpls/sync-file-select.html', '<div class=\"sync-file-select\">\r\n    <div class=\"md-subhead bg-lightgrey p-15\" style=\"border-bottom: 1px solid #EEEEEE;\"><file-bread-crumbs bread-crumbs=\"breadCrumbs\" project=\"project\" select-fn=\"select\"></file-bread-crumbs></div>\r\n    <div class=\"rel-box\" style=\"min-height: 160px;\">\r\n        <table class=\"md-table\">\r\n            <tbody>\r\n                <tr ng-repeat=\"item in files\" ng-class=\"{\'selected\' : item.name == selected.name}\">\r\n                    <td style=\"width: 50px;\">\r\n                        <file-thumbnail ending-url=\"item.endingUrl\" file-type=\"item.fileType\" thumb-link=\"item.thumbLink\"></file-thumbnail>\r\n                    </td>\r\n                    <td>\r\n                        <a class=\"text-green\" ng-click=\"select(item)\">{{item.name}}&nbsp;<span class=\"label label-green label-md float-right\" style=\"margin-right: 15px;\" ng-show=\"item[\'.tag\'] == \'virtual\'\">Assembly File</span></a>\r\n                    </td>\r\n                    <td style=\"width: 100px;\">{{item.client_modified | amTimeAgo}}</td>\r\n                    <td style=\"width: 70px; padding-right: 10px;\">{{item.size | bytes}}</td>\r\n                </tr>\r\n                <tr ng-hide=\"files.length > 0\">\r\n                    <td colspan=\"4\">\r\n                        <div class=\"text-grey\">Empty Folder.</div>\r\n                    </td>\r\n                </tr>\r\n            </tbody>\r\n        </table>\r\n        <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/sync-folder-select/tpls/sync-folder-select-modal.html', '<md-dialog aria-label=\"Select File\">\r\n    <div class=\"md-modal-header text-subtitle-thin\" layout=\"row\" layout-align=\"start center\">\r\n        <span class=\"text-black\">Select project location</span>\r\n    </div>\r\n\r\n    <md-dialog-content class=\"bg-lightgrey overflow-x-box rel-box p-0\">\r\n        <div class=\"md-content-container content-sm\" style=\"padding: 30px;\">\r\n\r\n            <div class=\"card-z1 p-30 m-b-30\">\r\n                <div class=\"md-subhead m-b-15\">File location</div>\r\n                <p class=\"body-small\">Is this a new project or an existing project?</p>\r\n                <md-radio-group ng-model=\"folder.type\">\r\n                    <md-radio-button value=\"new\" class=\"md-accent m-l-0\">\r\n                        <div layout=\"row\">\r\n                            <md-icon class=\"m-r-10 s30\" md-svg-icon=\"create_new_folder\" style=\"color: #f5dbab;\"></md-icon>\r\n                            <div>\r\n                                <div class=\"text-subtitle-thin text-black\">New Project</div>\r\n                                <div class=\"text-lightgrey\">If this is a new project, a new project folder will be created.</div>\r\n                            </div>\r\n                        </div>\r\n                    </md-radio-button>\r\n                    <md-radio-button value=\"existing\" class=\"md-accent m-l-0\">\r\n                        <div layout=\"row\">\r\n                            <md-icon class=\"m-r-10 s30\" md-svg-icon=\"folder\" style=\"color: #bbe8bb\"></md-icon>\r\n                            <div>\r\n                                <div class=\"text-subtitle-thin text-black\">Existing Project</div>\r\n                                <div class=\"text-lightgrey\">If this is an existing project, navigate to its location to connect it.</div>\r\n                            </div>\r\n                        </div>\r\n                    </md-radio-button>\r\n                </md-radio-group>\r\n            </div>\r\n\r\n            <div ng-if=\"folder.type == \'new\'\" class=\"card-z1 p-30\">\r\n                <div class=\"md-subhead m-b-15\">Folder Path</div>\r\n                <p class=\"body-small\">A new project will be created in the folder:</p>\r\n                <p class=\"capitalise text-lightgrey\">{{provider}}/STEMN/{{projectName}}</p>\r\n            </div>\r\n\r\n            <div ng-if=\"folder.type == \'existing\'\" class=\"card-z1 p-30\">\r\n                <div class=\"md-subhead m-b-15\">Select folder path</div>\r\n                <p class=\"body-small\">If your project is already in your {{provider}}; select it. This folder will be linked to your STEMN project.</p>\r\n                <div class=\"rel-box\" style=\"min-height: 100px;\">\r\n                    <sync-folder-select item=\"item\" open=\"true\" selected=\"selected\" loading=\"loading\" provider=\"{{provider}}\"></sync-folder-select>\r\n                    <loading-overlay ng-if=\"loading.status\" class=\"translucent\"></loading-overlay>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n\r\n    <div class=\"md-modal-footer\" layout=\"row\" layout-align=\"start center\" flex-order=\"2\">\r\n        <div flex></div>\r\n        <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n        <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-click=\"save()\" ng-disabled=\"folder.type == \'existing\' && !selected.id\">{{folder.type == \'new\' ? \'Create Folder\' : \'Use Folder\'}}</md-button>\r\n    </div>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/sync-folder-select/tpls/sync-folder-select.html', '<div class=\"sync-folder-select\">\r\n    <div layout=\"row\" layout-align=\"start center\" ng-hide=\"open\" class=\"md-subhead display-row\" ng-class=\"{\'selected\': item.path == selected.path}\" style=\"padding-left: {{item.level * 28}}px;\">\r\n        <a ng-click=\"toggle(item.path)\">\r\n            <md-icon class=\"m-r-10\" md-svg-icon=\"expand-more\" ng-class=\"{\'r-180\' : item.showChildren, \'o-0\' : item.children.length == 0}\"></md-icon>\r\n        </a>\r\n        <a ng-click=\"select(item)\" flex>{{item.name || \'root\'}}</a>\r\n    </div>\r\n<!--    <div ng-show=\"item.path == selected.path\">Projectname</div>-->\r\n    <div ng-show=\"item.showChildren\">\r\n        <div ng-repeat=\"child in item.children\">\r\n            <sync-folder-select item=\"child\" selected=\"selected\" loading=\"loading\" provider=\"{{provider}}\"></sync-folder-select>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/sync-list-widget/tpls/sync-list-widget.html', '<div class=\"sync-list-widget rel-box\" style=\"min-height: 60px;\">\r\n    <a class=\"m-v-5\" ng-repeat=\"item in items | limitTo: 5\" layout=\"row\" ng-click=\"openFileFolder(item)\">\r\n        <file-thumbnail ending-url=\"item.endingUrl\" file-type=\"item.fileType\" thumb-link=\"item.thumbLink\"></file-thumbnail>\r\n        <div class=\"m-l-10\" flex layout=\"column\">\r\n            <div>{{item.name}}</div>\r\n            <div class=\"text-lightgrey\" style=\"font-size: 10px;\">{{(item.client_modified | amTimeAgo) || \'Folder\'}}</div>\r\n        </div>\r\n    </a>\r\n    <div class=\"text-lightgrey\" ng-show=\"!loading && items.length < 1\">No files.</div>\r\n    <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/sync-timeline/tpls/timeline.html', '<div class=\"timeline hide-last\">\r\n    <div class=\"timeline-item\" ng-repeat=\"item in timeline | orderBy: \'-timestamp\'\" layout=\"row\" style=\"padding-bottom: 15px;\">\r\n        <div class=\"timeline-marker\" layout=\"column\" layout-align=\"center center\"><md-icon md-svg-icon=\"{{iconMap[item.event]}}\"></md-icon></div>\r\n        <div class=\"timeline-content\" flex>\r\n            <div ng-if=\"item.event == \'update\'\">{{item.details.sharing_info.modified_by_name.split(\' \')[0]}} updated this file. <a ui-sref=\"app.preview({projectStub: item.details.parentProject, path: item.details.pathRev, children: item.details.childrenRev})\" class=\"label label-md\">V.{{item.details.revDecimal}}</a></div>\r\n            <div ng-if=\"item.event == \'create\'\">{{item.details.sharing_info.modified_by_name.split(\' \')[0]}} created {{item.details.name}} <a ui-sref=\"app.preview({projectStub: item.details.parentProject, path: item.details.pathRev, children: item.details.childrenRev})\" class=\"label label-md\">V.1</a></div>\r\n            <div class=\"text-lightgrey\">{{item.timestamp | amTimeAgo}}</div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/tpls/file-bread-crumbs.html', '<span ng-hide=\"breadCrumbs.length > 0\">{{showProjectName ? project.name : \'Home\'}}</span>\r\n<a ng-show=\"breadCrumbs.length > 0\" class=\"text-green\" ng-click=\"select({path: \'\',  parentProject: project.stub, \'.tag\': \'folder\'})\">{{showProjectName ? project.name : \'Home\'}}</a>\r\n<span ng-repeat=\"crumb in breadCrumbs\">\r\n    <span>/</span>\r\n    <span>\r\n        <a ng-hide=\"$last\" class=\"text-green\" ng-click=\"select({path: crumb.path, parentProject: project.stub, \'.tag\': \'folder\'})\">\r\n            {{crumb.name}}\r\n        </a>\r\n        <span ng-show=\"$last\">{{crumb.name}}</span>\r\n        <popup class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"{{showProjectName ? \'21px\' : \'10px\'}} 0 0 0\" layout=\"column\">\r\n            <file-list project=\"project\" path=\"breadCrumbs[$index-1].path\" class=\"{{showProjectName ? \'text-subtitle-thin\' : \'md-subhead\'}}\" select-fn=\"select\"></file-list>\r\n        </popup>\r\n    </span>\r\n</span>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/tpls/file-list.html', '<loading-overlay ng-if=\"loading\"></loading-overlay>\r\n<a ng-repeat=\"item in files\" ng-click=\"select(item)\"\r\nclass=\"ellipsis\" ng-class=\"{\'text-green\' : !item.isCurrent, \'divider\' : item.isDivider}\">{{item.name}}</a>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/tpls/file-readme.html', '<loading-overlay ng-if=\"readme.loading\" class=\"translucent\"></loading-overlay>\r\n<div markdown-to-html=\"readme.body\"></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/sync/tpls/file-thumbnail.html', '<img ng-if=\"!isImage\" class=\"file-icon\" ng-src=\"{{thumnailPath}}\" err-src=\"/assets/images/vectors/filetype/other.svg\">\r\n<div ng-if=\"isImage\" class=\"file-icon bg-img-cover\" style=\"border: 1px solid rgba(0, 0, 0, 0.1); background-image : url(\'{{thumnailPath}}\')\"></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tabs/tpls/tabs.html', '<div class=\"overflow-arrow overflow-arrow-left\" layout=\"column\" layout-align=\"center\">\r\n    <md-icon md-svg-icon=\"chevron-left\"></md-icon>\r\n</div>\r\n<div flex layout=\"row\" class=\"tabs-inner\" ng-transclude></div>\r\n<div class=\"overflow-arrow overflow-arrow-right\" layout=\"column\" layout-align=\"center\">\r\n    <md-icon md-svg-icon=\"chevron-right\"></md-icon>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/tags-edit-modal.html', '<md-dialog class=\"md-full-screen\">\r\n    <md-toolbar style=\"background: white;\">\r\n        <div class=\"md-toolbar-tools\">\r\n            <span flex></span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <form name=\"TagForm\">\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div class=\"md-content-container\">\r\n                <h1 class=\"md-headline\">Tag it, tag it good!</h1>\r\n                <field-search        data=\"data.fields\"></field-search>\r\n                <tags tags=\"data.fields\"        type=\"field\"        edit=\"true\" image=\"true\" size=\"sm\"></tags>\r\n                <organisation-search data=\"data.organisations\"></organisation-search>\r\n                <tags tags=\"data.organisations\" type=\"organisation\" edit=\"true\" image=\"true\" size=\"sm\"></tags>\r\n                <project-search      data=\"data.projects\"></project-search>\r\n                <tags tags=\"data.projects\"      type=\"project\"      edit=\"true\" image=\"true\" size=\"sm\"></tags>\r\n            </div>\r\n        </md-dialog-content>\r\n        <div class=\"md-actions\" layout=\"row\">\r\n            <div flex></div>\r\n            <div>\r\n                <md-button ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button class=\"md-accent md-raised\" ng-disabled=\"TagForm.$invalid\" ng-click=\"save()\">Save</md-button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/tags.html', '<div class=\"tags {{size}}\" ng-class=\"{\'oneLine\': oneLine}\">\r\n    <div ng-include=\" template \"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/types/field.html', '<div class=\"tag tag-hover anim-repeat-fade\" ng-class=\"{\'tag-active\': tag.active}\" ng-repeat=\"tag in tags | limitTo:limit\">\r\n    <md-tooltip ng-if=\"status && tag.active\" md-direction=\"top\" md-autohide=\"true\">This is one of your skills.</md-tooltip>\r\n    <div class=\"tag-inner\" layout=\"row\" layout-align=\"start center\" >\r\n        <a class=\"tag-content\" ui-sref=\"app.field.top({\'stub\': tag.stub})\" popup-field field-id=\"{{::tag._id}}\">\r\n            {{tag.name}}\r\n        </a>\r\n        <a class=\"tag-count\" ng-if=\"evidence && tag.evidence\" click-show-evidence=\"tag.evidence\" entity=\"tag\">\r\n            {{tag.evidence.length}}\r\n        </a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/types/location.html', '<div class=\"tag\" ng-repeat=\"tag in ::tags | limitTo:limit\">\r\n    <a class=\"tag-inner\">\r\n        <div class=\"tag-content\">\r\n            {{tag.name}}\r\n        </div>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/types/organisation.html', '<div class=\"tag tag-hover anim-repeat-fade\" ng-repeat=\"tag in tags | limitTo:limit\">\r\n    <a class=\"tag-inner\" layout=\"row\" layout-align=\"start center\" ui-sref=\"app.organisation.overview({\'stub\':tag.stub})\" popup-organisation organisation-id=\"{{tag._id}}\">\r\n        <div class=\"tag-image\" ng-if=\"image\">\r\n            <img ng-src=\"{{tag.picture}}?size=thumb&crop=true\">\r\n        </div>\r\n        <div class=\"tag-content\">\r\n            {{tag.name}}\r\n        </div>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/types/project.html', '<div class=\"tag tag-hover anim-repeat-fade\" ng-repeat=\"tag in tags | limitTo:limit\">\r\n    <a class=\"tag-inner\" layout=\"row\" layout-align=\"start center\" ui-sref=\"app.project.overview({\'stub\':tag.stub})\" popup-project project-id=\"{{::tag._id}}\">\r\n        <div class=\"tag-image\" ng-if=\"image\">\r\n            <img ng-src=\"{{tag.picture}}?size=thumb&crop=true\">\r\n        </div>\r\n        <div class=\"tag-content\">\r\n             {{::tag.name || \'Unpublished Project\'}}\r\n        </div>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/types/tag-edit.html', '<div class=\"tags-edit\">\r\n    <div ng-sortable=\"sortableConfig\">\r\n        <div class=\"tag-drop-area\" ng-if=\"tags.length == 0 && dropArea\">Drag and drop fields here</div>\r\n        <div class=\"tag my-handle\" ng-repeat=\"tag in tags track by $index\">\r\n            <div class=\"tag-inner\" layout=\"row\" layout-align=\"start center\">\r\n                <div class=\"tag-content\">\r\n                    {{tag.name}}\r\n                </div>\r\n                <div class=\"tag-count\" ng-if=\"evidence\" ng-class=\"{\'count-warn\': !tag.evidence.length>0}\">\r\n                    {{tag.evidence.length || 0}}\r\n                    <popup class=\"tooltip-popup\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" layout=\"column\">\r\n                        <p ng-if=\" tag.evidence.length > 0\">You have <b>{{tag.evidence.length}}</b> item{{tag.evidence.length == 1 ? \'\' : \'s\'}} in your portfolio tagged with <b>{{tag.name}}</b>.</p>\r\n                        <p ng-if=\"!tag.evidence.length > 0\">You have no portfolio evidence for <b>{{tag.name}}</b> yet. <b>Add a project</b> to your portfolio that demonstrated this skill.</p>\r\n                    </popup>\r\n                </div>\r\n                <a class=\"tag-delete\" ng-hide=\"tag.noDelete\" type=\"button\" ng-click=\"delTag($index)\">×</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/tags/tpls/types/user.html', '<div class=\"tag\" ng-repeat=\"tag in ::tags | limitTo:limit\">\r\n    <a class=\"tag-inner\" href=\"/users/{{tag.stub}}\" popup-user user-id=\"{{tag._id}}\">\r\n        <div ng-show=\"image\" ng-style=\"tag.picture && {\'background-image\':\'url(\'+tag.picture+\'?size=thumb&crop=true)\'}\" class=\"bounding-box picture profile-img\"></div>\r\n        <div class=\"tag-content\">\r\n            {{tag.name}}\r\n        </div>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/toc/tpls/toc.html', '<div class=\"toc-nav\">\r\n    <div class=\"content\">\r\n        <div ng-repeat=\"section in sections\">\r\n            <div class=\"section {{section.level}}\" du-scrollspy=\"{{section.id}}\">\r\n                <a class=\"ellipsis\" flex href=\"#{{section.id}}\" du-smooth-scroll data-offset=\"30\">{{section.label}}</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"markers\">\r\n        <div ng-repeat=\"section in sections\">\r\n            <div class=\"marker {{section.level}}\" du-scrollspy=\"{{section.id}}\"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/top-banner/tpls/top-banner.html', '<div hide-sm hide-md class=\"top-banner\" ng-show=\"TopBannerService.banner.open && !TopBannerService.banner.closed\">\r\n	<div layout=\"row\" layout-align=\"center center\" ng-show=\"!currentUser.isLoggedIn()\">\r\n		<div style=\"margin-right: 10px;\">New to STEMN?</div>\r\n		<md-button style=\"margin-right: 10px;\" class=\"md-border\" ng-click=\"signup($event)\">Sign up</md-button>\r\n		<div style=\"margin-right: 5px;\">or</div>\r\n		<md-button class=\"md-border\" ng-click=\"learnMore()\">Learn More</md-button>\r\n	</div>\r\n	<div layout=\"row\" layout-align=\"center center\" ng-show=\"!currentUser.verified\">\r\n		<div>One quick thing: We need you to verify your email address by clicking the link we sent.</div>\r\n		<md-button style=\"margin-left: 10px;\" class=\"md-border\" ng-click=\"resendVerification()\" ng-disabled=\"resendVerificationDisabled\">Send it again</md-button>\r\n		<div ng-show=\"resendVerificationCount >= 2\">(be sure to check your spam folder)</div>\r\n	</div>\r\n	<md-button class=\"md-icon-button close-btn\" ng-click=\"TopBannerService.closeBanner()\" aria-label=\"Close\"><md-icon md-svg-icon=\"navigation:close\"></md-icon></md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/upload-files/tpls/upload-files-display.html', '\r\n<div nv-file-drop=\"\" uploader=\"uploader\">\r\n	<div layout=\"row\" layout-wrap ng-sortable=\"sortableConfig\" style=\"margin: -15px; min-height: 50px;\">\r\n		<uploaded-file class=\"draggable\" flex=\"20\" flex-md=\"25\" flex-sm=\"50\" ng-repeat=\"file in files track by $index\"></uploaded-file>\r\n		<uploaded-file ng-if=\"edit && item.progress > 0 && item.progress < 100\" flex=\"20\" flex-md=\"25\" flex-sm=\"50\" ng-repeat=\"item in uploader.queue\"></uploaded-file>\r\n		<div flex=\"20\" flex-md=\"25\" flex-sm=\"50\" class=\"\" style=\"padding: 15px\" layout=\"column\" ng-if=\"edit\">\r\n			<label flex class=\"btn-upload drop\" nv-file-over uploader=\"uploader\" over-class=\"drag-over\" layout=\"column\" layout-align=\"center center\">\r\n				<input type=\"file\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\" multiple/>\r\n				<span class=\"text-lightgrey\">Upload files</span>\r\n			</label>\r\n		</div>\r\n	</div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/upload-files/tpls/uploaded-file-edit-modal.html', '<md-dialog>\r\n    <form novalidate name=\"LinkForm\" ng-submit=\"save()\">\r\n        <md-dialog-content layout=\"column\">\r\n            <div style=\"width: 500px;\">\r\n                <h1 class=\"md-headline\" style=\"margin-top: 0px; margin-bottom: 40px;\">Edit File Details</h1>\r\n				<md-input-container class=\"md-accent\">\r\n					<label>File Name</label>\r\n					<input md-autofocus=\"true\" name=\"name\" ng-model=\"data.name\" type=\"text\" focus-me=\"true\">\r\n				</md-input-container>\r\n<!--\r\n			   <label class=\"btn-upload\">\r\n					<input type=\"file\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\"/>\r\n					<span>Upload files</span>\r\n				</label>\r\n-->\r\n            </div>\r\n			<div layout=\"row\" style=\"margin: 25px 0 -10px 0\">\r\n				<div flex>\r\n					<md-button type=\"button\" class=\"md-raised md-warn no-margin\" ng-click=\"delete()\">Delete File</md-button>\r\n				</div>\r\n				<div>\r\n					<md-button type=\"button\" ng-click=\"cancel()\">Cancel</md-button>\r\n					<md-button type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"LinkForm.$invalid\">Save</md-button>\r\n				</div>\r\n			</div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/upload-files/tpls/uploaded-file.html', '\r\n<div class=\"md-whiteframe-z2 rel-box\" layout=\"column\" ng-if=\"edit\">\r\n	<md-button type=\"button\" class=\"md-circle md-xs md-raised md-accent edit\" ng-click=\"editFile($event)\" aria-label=\"edit\"><md-icon md-svg-icon=\"edit\"></md-icon></md-button>\r\n	<img ng-class=\"{\'my-handle\' : edit}\" ng-src=\"/assets/images/vectors/filetype/{{file.type || \'other\'}}.svg\" err-src=\"/assets/images/vectors/filetype/other.svg\">\r\n	<div>\r\n		<div class=\"ellipsis text-lightgrey name\">{{file.name}}</div>\r\n	</div>\r\n	<loading-overlay ng-if=\"item.progress\" determinate=\"{{item.progress}}\"></loading-overlay>\r\n</div>\r\n\r\n<a class=\"md-whiteframe-z2 rel-box\" layout=\"column\" ng-if=\"!edit\" ng-href=\"{{file.url}}\" target=\"_self\" download=\"{{file.name}}\">\r\n	<img  ng-src=\"/assets/images/vectors/filetype/{{file.type || \'other\'}}.svg\" err-src=\"/assets/images/vectors/filetype/other.svg\">\r\n	<div>\r\n		<div class=\"ellipsis text-lightgrey name\">{{file.name}}</div>\r\n	</div>\r\n	<loading-overlay ng-if=\"item.progress\" determinate=\"{{item.progress}}\"></loading-overlay>\r\n</a>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/uploads/tpls/crop-imageupload.html', '<div class=\"row\" nv-file-drop=\"\" uploader=\"uploader\">\r\n    <div class=\"col-md-12\">\r\n        <!-- Multi-Image Upload -->\r\n        <div ng-if=\"!options.singleImage\" nv-file-drop=\"\" uploader=\"uploader\">\r\n            <div nv-file-over=\"\" uploader=\"uploader\" over-class=\"drag-over\" class=\"drop\">\r\n                <label class=\"btn-upload btn btn-white\">\r\n                    <input type=\"file\" accept=\".png, .jpg, .jpeg, .gif\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\" multiple/>\r\n                    <span>Upload images</span>\r\n                </label>\r\n                <strong>OR</strong>\r\n                Drag and Drop your images here to upload\r\n            </div>\r\n        </div>\r\n        <!-- Single-Image Upload -->\r\n        <div ng-if=\"options.singleImage\" nv-file-drop=\"\" uploader=\"uploader\">\r\n            <div nv-file-over=\"\" uploader=\"uploader\" over-class=\"drag-over\" class=\"drop\">\r\n                <label class=\"btn-upload btn btn-white\">\r\n                    <input type=\"file\" accept=\".png, .jpg, .jpeg, .gif\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\"/>\r\n                    <span>Upload image</span>\r\n                </label>\r\n                <strong>OR</strong>\r\n                Drag and Drop an image here to upload\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class=\"row\">\r\n    <div ng-repeat=\"file in files\" class=\"edit-img\" ng-class=\"{\'col-md-4 edit-img-gallery\' : !options.singleImage, \'col-md-12 text-center\' : options.singleImage}\">\r\n        <div ng-hide=\"crop\">\r\n            <img ng-src=\"{{file.url}}\" />\r\n        </div>\r\n        <div ng-show=\"crop\">\r\n            <div class=\"cropArea\" ng-init=\"croppedImage=\'\'\">\r\n                <img-crop image=\"file.image || file.parent || file.url\" result-image=\"croppedImage\" area-type=\"{{cropShape}}\" result-image-size=\"imgSize\" result-image-aspect=\"{{aspect}}\"></img-crop>\r\n            </div>\r\n        </div>\r\n        <!-- If the file has already been cropped -->\r\n        <div>\r\n            <!-- If inline Crop  -->\r\n            <div ng-show=\"options.singleImage\" class=\"text-left\" style=\"margin-top: 50px;\">\r\n                <a class=\"btn btn-lg btn-default\" ng-show=\"crop\" ng-click=\"cancel()\">\r\n                    Cancel\r\n                </a>\r\n                <a ng-show=\"crop\" class=\"btn btn-lg btn-success pull-right\" ng-click=\"uploadCroppedImage(croppedImage, file.parent || file.url);\">\r\n                    Save\r\n                </a>\r\n            </div>\r\n            <!-- If modal Crop  -->\r\n            <div ng-hide=\"options.singleImage\" class=\"edit-buttons\">\r\n                <button type=\"button\" class=\"btn btn-default\" ng-click=\"openCropModal(file.parent || file.url, croppedImage, cropShape, imgSize, aspect)\" tooltip=\"Crop\" tooltip-placement=\"bottom\">\r\n                    <icon class=\"fa-crop\"></icon>\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div ng-repeat=\"item in uploader.queue\" ng-class=\"{\'col-md-4 edit-img-gallery\' : !options.singleImage, \'col-md-12 text-center\' : options.singleImage}\">\r\n<!--\r\n        <img ng-src=\"{{item.image}}\" />\r\n\r\n        <div class=\"cropArea\">\r\n            <img-crop image=\"file.image\" result-image=\"croppedImage\" area-type=\"{{cropShape}}\" result-image-size=\"imgSize\" result-image-aspect=\"{{aspect}}\"></img-crop>\r\n        </div>\r\n-->\r\n        <span ng-show=\"item.isSuccess\"><i class=\"glyphicon glyphicon-ok\"></i></span>\r\n        <span ng-show=\"item.isCancel\"><i class=\"glyphicon glyphicon-ban-circle\"></i></span>\r\n        <span ng-show=\"item.isError\"><i class=\"glyphicon glyphicon-remove\"></i></span>\r\n        <div class=\"progress\" style=\"margin-bottom: 0; height: 2px;\">\r\n            <div class=\"progress-bar progress-bar-success\" role=\"progressbar\" ng-style=\"{ \'width\': item.progress + \'%\' }\"></div>\r\n        </div>\r\n        <!--\r\n                            <button ng-if=\"item.allowCrop\" type=\"button\" ng-disabled=\"item.isUploading\" class=\"btn btn-success btn-xs\" ng-click=\"uploadCroppedImage(item.croppedImage, item.file.url)\">\r\n                                Crop and Upload\r\n                            </button>\r\n    -->\r\n    </div>\r\n</div>\r\n\r\n\r\n<div ng-hide=\"options.singleImage\" class=\"text-left\" style=\"margin-top: 50px;\">\r\n    <a class=\"btn btn-lg btn-default\" ng-click=\"cancel()\">\r\n        Cancel\r\n    </a>\r\n    <a class=\"btn btn-lg btn-success pull-right\" ng-click=\"save();\">\r\n        Save\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/uploads/tpls/crop-imageuploadmodal.html', '<div class=\"modal-header\">\r\n    <button type=\"button\" class=\"close\" ng-click=\"closeModal()\" aria-hidden=\"true\">&times;</button>\r\n    <h1 class=\"modal-title\">Upload Image</h1>\r\n</div>\r\n<div class=\"modal-body\">\r\n    <image-upload-crop files=\"files\" single=\"single\" force-crop=\"crop\" crop-shape=\"{{shape}}\" img-size=\"{{imgSize}}\" aspect=\"{{aspect}}\" cancel=\"closeModal()\" save=\"saveCloseModal()\"></image-upload-crop>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/uploads/tpls/crop.html', '\r\n<div class=\"modalCropArea\" ng-init=\"croppedImage=\'\'\">\r\n    <img-crop image=\"data.inputImage\" result-image=\"croppedImage\" area-type=\"{{data.cropShape}}\" result-image-size=\"data.imgSize\" result-image-aspect=\"{{data.aspect}}\"></img-crop>\r\n</div>\r\n<a ng-click=\"closeModal()\" class=\"btn\">Cancel</a>\r\n<a ng-click=\"saveCloseModal()\" class=\"btn btn-success pull-right\">Crop and Save</a>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/uploads/tpls/upload-files-modal.html', '<md-dialog class=\"upload-image-modal\">\r\n    <form>\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div class=\"md-content-container content-sm\">\r\n\r\n                <div nv-file-drop=\"\" uploader=\"uploader\" layout=\"row\" layout-align=\"center center\">\r\n                    <div nv-file-over=\"\" uploader=\"uploader\" over-class=\"drag-over\" class=\"drop text-center\">\r\n                        <label class=\"btn-upload\">\r\n                            <input type=\"file\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\" multiple />\r\n                            <span>Upload Files</span>\r\n                        </label>\r\n                        <strong style=\"padding-left: 5px;\">OR</strong>\r\n                        Drag and Drop files here to upload\r\n                    </div>\r\n                </div>\r\n                <loading-overlay ng-if=\"uploader.progress > 0 && uploader.progress < 100\" determinate=\"uploader.progress\">\r\n                    Files uploading\r\n                </loading-overlay>\r\n                <loading-overlay ng-if=\"uploader.progress == 100\">\r\n                    Processing. Please wait.\r\n                </loading-overlay>\r\n            </div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/uploads/tpls/upload-image-new-modal.html', '<md-dialog class=\"upload-image-modal\">\r\n    <form>\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div class=\"md-content-container content-sm\">\r\n                <md-button ng-if=\"currentImage\" class=\"remove-button md-warn md-cornered\" ng-click=\"remove()\">Remove Existing image</md-button>\r\n                <div nv-file-drop=\"\" uploader=\"uploader\" layout=\"row\" layout-align=\"center center\">\r\n                    <div nv-file-over=\"\" uploader=\"uploader\" over-class=\"drag-over\" class=\"drop text-center\">\r\n                        <label class=\"btn-upload\">\r\n                            <input type=\"file\" accept=\".png, .jpg, .jpeg, .gif\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\" />\r\n                            <span>Upload image</span>\r\n                        </label>\r\n                        <strong style=\"padding-left: 5px;\">OR</strong>\r\n                        Drag and Drop an image here to upload\r\n                    </div>\r\n                </div>\r\n\r\n\r\n<!--\r\n                <div ng-repeat=\"item in uploader.queue\" class=\"upload-progress\">\r\n                    <md-progress-linear class=\"md-accent\" md-mode=\"determinate\" value=\"{{item.progress}}\"></md-progress-linear>\r\n                </div>\r\n-->\r\n                <loading-overlay ng-if=\"uploader.progress > 0 && uploader.progress < 100\" determinate=\"uploader.progress\">\r\n                    Image uploading\r\n                </loading-overlay>\r\n                <loading-overlay ng-if=\"uploader.progress == 100\">\r\n                    Processing\r\n                </loading-overlay>\r\n            </div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/uploads/tpls/upload-images-new-modal.html', '<md-dialog class=\"md-full-screen upload-image-modal\">\r\n    <md-toolbar style=\"background: white;\">\r\n        <div class=\"md-toolbar-tools\">\r\n            <span flex></span>\r\n            <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\r\n                <md-icon md-svg-icon=\"navigation:close\" aria-label=\"Close dialog\"></md-icon>\r\n            </md-button>\r\n        </div>\r\n    </md-toolbar>\r\n    <form>\r\n        <md-dialog-content layout=\"row\" layout-align=\"center center\">\r\n            <div class=\"md-content-container content-sm\">\r\n                <h1 class=\"md-headline\">Arrange your images...</h1>\r\n                <br>\r\n                <br>\r\n\r\n                <div layout=\"row\" layout-wrap class=\"gallery-display\" ng-sortable=\"sortableConfig\">\r\n                    <div flex=\"20\" flex-md=\"25\" flex-sm=\"50\" ng-repeat=\"image in images\">\r\n                        <md-button class=\"md-circle md-xs md-raised\" ng-click=\"remove($index)\"><md-icon md-svg-icon=\"navigation:close\"></md-icon></md-button>\r\n                        <img class=\"md-whiteframe-z1\" ng-src=\"{{image.url}}\">\r\n                    </div>\r\n                </div>\r\n\r\n                <div nv-file-drop=\"\" uploader=\"uploader\" layout=\"row\" layout-align=\"center center\" style=\"margin: 40px 0;\">\r\n                    <div nv-file-over=\"\" uploader=\"uploader\" over-class=\"drag-over\" class=\"drop text-center\">\r\n                        <label class=\"btn-upload\">\r\n                            <input type=\"file\" accept=\".png, .jpg, .jpeg, .gif\" class=\"upload\" nv-file-select=\"\" uploader=\"uploader\" multiple/>\r\n                            <span>Upload images</span>\r\n                        </label>\r\n                        <strong style=\"padding-left: 5px;\">OR</strong>\r\n                        Drag and Drop an image here to upload\r\n                    </div>\r\n                </div>\r\n<!--\r\n                <div class=\"upload-progress\">\r\n                    <md-progress-linear class=\"md-accent\" md-mode=\"determinate\" value=\"{{uploader.progress}}\"></md-progress-linear>\r\n                </div>\r\n-->\r\n                <loading-overlay ng-if=\"uploader.progress > 0 && uploader.progress < 100\" determinate=\"uploader.progress\">Uploading...</loading-overlay>\r\n                <loading-overlay ng-if=\"uploader.progress == 100 && !uploader.queue[uploader.queue.length-1].file.url\">Processing...</loading-overlay>\r\n            </div>\r\n        </md-dialog-content>\r\n        <div class=\"md-actions\" layout=\"row\">\r\n            <div flex></div>\r\n            <div>\r\n                <md-button ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button class=\"md-accent md-raised\" ng-click=\"save()\">Save</md-button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/user-subdomain/tpls/user-subdomain-input.html', '<div ng-if=\"displayType != \'form\'\">\r\n    <form class=\"user-subdomain-input inline\" name=\"forms.GetSubdomainForm\" novalidate ng-submit=\"submit()\">\r\n        <div layout=\"row\" class=\"input-box md-whiteframe-z2\">\r\n            <div layout=\"row\" class=\"domain\" layout-align=\"start center\">\r\n                <input name=\"subdomain\" required minlength=\"5\" maxlength=\"40\" ng-model=\"formModel.username\" pu-elastic-input style=\"text-align:right;\" placeholder=\"yourname\" ng-keyup=\"checkUsernameExists(formModel.username)\">\r\n                <div>.stemn.com</div>\r\n            </div>\r\n            <md-button type=\"submit\" ng-class=\"forms.GetSubdomainForm.$valid || !forms.GetSubdomainForm.$dirty ? \'md-accent\' : \'md-warn\'\" class=\"md-raised md-flat md-lg no-margin md-cornered\">\r\n                <span hide-gt-md>Create</span>\r\n                <span hide-sm hide-md>Get Started</span>\r\n            </md-button>\r\n        </div>\r\n        <div class=\"messages\" ng-messages=\"forms.GetSubdomainForm.subdomain.$error\" ng-if=\"forms.GetSubdomainForm.subdomain.$dirty\">\r\n            <div ng-message=\"required\"><dot class=\"red\"></dot>This is required.</div>\r\n            <div ng-message=\"minlength\"><dot class=\"red\"></dot>Your domain must be more than 5 characters.</div>\r\n            <div ng-message=\"maxlength\"><dot class=\"red\"></dot>Try keep it under 20 characters.</div>\r\n            <div ng-message=\"nameexists\"><dot class=\"red\"></dot>That name is already taken</div>\r\n        </div>\r\n        <div class=\"messages\" ng-if=\"forms.GetSubdomainForm.$valid\">\r\n            <dot class=\"green\"></dot>That domain is available, you\'re good to go!\r\n        </div>\r\n        <div ng-if=\"formModel.username && loggedIn\" class=\"messages\" style=\"margin-top: 20px\">Your profile will also be available at: <span class=\"underlined\">stemn.com/users/{{formModel.username}}</span></div>\r\n    </form>\r\n</div>\r\n<div ng-if=\"displayType == \'form\'\">\r\n    <form name=\"forms.GetSubdomainForm\" novalidate ng-submit=\"submit()\">\r\n        <p>Your profile will also be available at: <span class=\"underlined\">stemn.com/users/{{formModel.username}}</span></p>\r\n        <md-input-container class=\"md-accent m-t-15\">\r\n            <label>Username</label>\r\n            <input name=\"subdomain\" required minlength=\"5\" maxlength=\"40\" ng-model=\"formModel.username\" ng-keyup=\"checkUsernameExists(formModel.username)\">\r\n            <div ng-messages=\"forms.GetSubdomainForm.subdomain.$error\" ng-if=\"forms.GetSubdomainForm.subdomain.$dirty\">\r\n                <div ng-message=\"required\">This is required.</div>\r\n                <div ng-message=\"minlength\">Your domain must be more than 5 characters.</div>\r\n                <div ng-message=\"maxlength\">Try keep it under 20 characters.</div>\r\n                <div ng-message=\"nameexists\">That name is already taken</div>\r\n            </div>\r\n        </md-input-container>\r\n        <div layout=\"row\">\r\n            <div flex></div>\r\n            <md-button type=\"submit\" class=\"md-raised md-accent md-cornered md-flat m-0 md-md\" ng-disabled=\"forms.GetSubdomainForm.$invalid\">Update username</md-button>\r\n        </div>\r\n    </form>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/user-widgets/tpls/user-completion-widget.html', '<div>\r\n    <a ng-hide=\"displayType == \'banner\'\" ng-click=\"checklistModal($event)\" class=\"md-subhead\">Improve your profile</a>\r\n    <md-progress-linear ng-click=\"checklistModal($event)\" class=\"md-accent m-v-10\" md-mode=\"determinate\" value=\"{{completionPercentage}}\"></md-progress-linear>\r\n    <div ng-hide=\"displayType == \'banner\'\" layout=\"row\">\r\n        <a ng-click=\"checklistModal($event)\" class=\"text-lightgrey\" flex>Your profile is {{completionPercentage}}% complete</a>\r\n        <a ng-click=\"checklistModal($event)\" class=\"text-green underlined\">See How</a>\r\n    </div>\r\n    <div ng-show=\"displayType == \'banner\'\" layout=\"row\">\r\n        <div flex>Your profile is {{completionPercentage}}% complete.</div>\r\n        <a ng-click=\"checklistModal($event)\">See how to improve</a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/user-widgets/tpls/user-organisations-widget.html', '<div class=\"preview-squares\" layout=\"row\">\r\n    <organisation-icon ng-repeat=\"item in organisations | limitTo: 3\" item-id=\"{{item._id}}\"></organisation-icon>\r\n    <a class=\"more\" ng-click=\"newOrganisation($event)\">\r\n        <md-icon md-svg-icon=\"add\"></md-icon>\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Add organisation</md-tooltip>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/user-widgets/tpls/user-portfolio-checklist-modal.html', '<md-dialog aria-label=\"checklist\">\r\n    <md-dialog-content style=\"width: 500px;\">\r\n        <h1 class=\"md-headline\" style=\"margin-top: 0px;\">Improve your profile</h1>\r\n        <div>\r\n            <md-progress-linear style=\"margin-bottom:10px;\" class=\"md-accent\" md-mode=\"determinate\" value=\"{{completionPecentage}}\"></md-progress-linear>\r\n            <div class=\"md-subhead\">{{completionPecentage}}% complete</div>\r\n        	<div style=\"margin: 20px 0;\">After reaching 100%, you should continue to add projects and blogs to improve the strength of your portfolio. </div>\r\n\r\n            <div class=\"well\" style=\"margin-bottom: 20px;\" ng-hide=\"(completionStatus | filter:{status:!true}).length == 0\">\r\n                <div class=\"md-subhead\">To Do:</div>\r\n                <checklist-item ng-repeat=\"item in completionStatus | filter:{status:!true}\"\r\n                item-complete=\"item.status\"\r\n                item-href=\"item.href\"\r\n                item-click=\"item.click\">\r\n                    {{item.message}}\r\n                </checklist-item>\r\n            </div>\r\n\r\n        	<div class=\"well\">\r\n                <div class=\"md-subhead\">Done:</div>\r\n                <checklist-item ng-repeat=\"item in completionStatus | filter:{status:true}\"\r\n                item-complete=\"item.status\"\r\n                item-href=\"item.href\"\r\n                item-click=\"item.click\">\r\n                    {{item.message}}\r\n                </checklist-item>\r\n            </div>\r\n\r\n        </div>\r\n        <div layout=\"row\">\r\n        	<div flex></div>\r\n			<md-button class=\"no-margin-h\" ng-click=\"cancel()\">Close</md-button>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/user-widgets/tpls/user-projects-widget.html', '<div class=\"preview-squares\" layout=\"row\">\r\n    <a ng-repeat=\"item in query.results | orderBy: \'-picture\' | limitTo: 3\" ui-sref=\"app.project.overview({stub: item.stub})\">\r\n        <img ng-src=\"{{item.picture || \'assets/images/default/org.png\'}}?size=thumb&crop=true\" alt=\"\">\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">{{item.name}}</md-tooltip>\r\n    </a>\r\n    <a class=\"more\" click-create>\r\n        <md-icon md-svg-icon=\"add\"></md-icon>\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Add project, blog or question</md-tooltip>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/user-widgets/tpls/user-recent-widget.html', '<div class=\"section-container\" ng-show=\"users\">\r\n	<div class=\"title-row\" layout=\"row\" style=\"margin-bottom: 10px;\">\r\n		<a href=\"\" class=\"active\">Recent Users (24h)</a>\r\n		<div flex></div>\r\n		<a ng-click=\"more()\" ng-disabled=\"noMoreResults\">More</a>\r\n	</div>\r\n    <a ng-repeat=\"userId in users\" ui-sref=\"app.user.profile({\'stub\': user.stub})\" class=\"anim-repeat-stagger-fade\">\r\n        <user-icon class=\"inline\" style=\"padding: 0 7px 7px 0;\" user-id=\"{{userId}}\" user=\"user\"></user-icon>\r\n        <md-tooltip>{{user.name}}</md-tooltip>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/add-row.html', '<div layout=\"row\" layout-align=\"center center\">\r\n    <div>\r\n        <md-button class=\"md-circle md-raised md-sm md-accent \" ng-click=\"addFn()\" aria-label=\"AddGroup\">\r\n            <md-tooltip md-autohide=\"true\">Add Group</md-tooltip>\r\n            <md-icon md-svg-src=\"add\"></md-icon>\r\n        </md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/empty-group.html', '<div layout=\"row\" layout-align=\"start center\">\r\n    <div flex class=\"text-lightgrey\">\r\n        This group is empty. Drag users into it.\r\n    </div>\r\n    <div>\r\n        <md-button class=\"md-warn md-border md-sm md-border md-lower no-hover\" ng-click=\"deleteFn()\">Delete</md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/personcard.html', '<div class=\"card card-centered person-card relative-box\" ng-class=\"{\'card-sm\' : (size==\'sm\')}\">\r\n    <a ng-href=\"/users/{{user.stub}}\">\r\n        <div class=\"banner\">\r\n            <div class=\"bounding-box\" ng-style=\"{\'background-image\':\'url(\'+(user.profile.banner.url || alternateBanner)+\'?size=banner-sm&crop=true)\'}\"></div>\r\n        </div>\r\n        <div>\r\n            <div ng-style=\"!!user.picture && {\'background-image\':\'url(\'+user.picture+\'?size=user&crop=true)\'}\" class=\"img-circle bounding-box profile-img picture\"></div>\r\n        </div>\r\n    </a>\r\n    <div class=\"content\">\r\n        <div class=\"name\">\r\n            <a ng-href=\"/users/{{user.stub}}\">{{user.name}}</a>\r\n        </div>\r\n        <div class=\"blurb\">\r\n            {{user.blurb || \'_\'}}\r\n        </div>\r\n        <hide-if-owner dr-class=\"vishidden\" owner=\"{{id || user._id}}\">\r\n            <stat-button hidepublic hide-stat=\"true\" hide-icon=\"true\" type=\"follow\" parent-type=\"user\" parent-id=\"{{user._id}}\" count=\"user.followers\"></stat-button>\r\n        </hide-if-owner>\r\n        <div class=\"stats\">\r\n            <div>\r\n                <h3>{{user.numProjects || 0}}</h3>\r\n                <small>projects</small>\r\n            </div>\r\n            <div stat-display-modal type=\"follow\" parent-type=\"user\" parent-id=\"{{user._id}}\" class=\"a\">\r\n                <h3>{{user.followers || 0}}</h3>\r\n                <small>followers</small>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"card-loading-overlay anim-fade\" ng-show=\"loading\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/user-icon.html', '<div style=\"background-image: url(\'{{user.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\')\"></div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/user-row-detailed.html', '<div class=\"user-row-detailed rel-box\" layout=\"column\" layout-gt-sm=\"row\">\r\n    <div class=\"avatar-circle avatar-lg m-r-30\" style=\"background-image: url(\'{{user.picture || \'/assets/images/default/user-1.png\'}}?size=thumb-lg&crop=true\'); border: none;\"></div>\r\n    <div flex class=\"item-col\">\r\n        <div class=\"md-title bold\">{{user.name}}</div>\r\n        <div>{{user.blurb}}</div>\r\n        <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-l-0 m-t-15\" href=\"{{ buttonHref || \'users/\'+user.stub }}\">{{buttonText || \'See Profile\'}}</md-button>\r\n    </div>\r\n    <div flex class=\"item-col\">\r\n<!--        <user-skills ng-if=\"user\" user=\"user\" active-fields=\"job.fields\"></user-skills>-->\r\n        <div class=\"md-subhead\">Education</div>\r\n        <div class=\"item\" ng-repeat=\"item in user.profile.profileDetails.education | limitTo: itemLimit\">\r\n            <div>{{item.degree}} {{item.fieldOfStudy}}</div>\r\n            <div class=\"text-grey\">{{item.school}} ({{item.isCurrent ? \'Current\' : item.endDate.year}})</div>\r\n        </div>\r\n        <a class=\"text-green\" ng-click=\"raiseLimit()\" ng-show=\"user.profile.profileDetails.education.length > itemLimit\">See More</a>\r\n    </div>\r\n    <div flex class=\"item-col\">\r\n        <div class=\"md-subhead\">Experience</div>\r\n        <div class=\"item\" ng-repeat=\"item in user.profile.profileDetails.experience | limitTo: itemLimit\">\r\n            <div>{{item.position}}</div>\r\n            <div class=\"text-grey\">{{item.company}} ({{item.isCurrent ? \'Current\' : item.endDate.year}})</div>\r\n        </div>\r\n        <a class=\"text-green\" ng-click=\"raiseLimit()\" ng-show=\"user.profile.profileDetails.experience.length > itemLimit\">See More</a>\r\n    </div>\r\n\r\n    <loading-row ng-if=\"loading\" class=\"translucent\"></loading-row>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/user-rows.html', '<div class=\"rel-box\">\r\n    <table class=\"md-table\">\r\n        <thead>\r\n            <tr>\r\n                <td style=\"width: 40px;\"></td>\r\n                <td>Name</td>\r\n                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"followers\" filter-query=\"query\" style=\"width: 100px;\" class=\"text-center\">Followers</td>\r\n                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"numProjects\" filter-query=\"query\" style=\"width: 100px;\" class=\"text-center\">Projects</td>\r\n                <td hide-sm style=\"width: 75px;\"></td>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n            <tr ng-repeat=\"item in query.results\">\r\n                <td style=\"padding: 15px 20px 15px 5px;\">\r\n                    <a ui-sref=\"app.user.profile({stub:item.stub})\">\r\n                        <div class=\"avatar-circle\" ng-style=\"{ \'background-image\':\'url(\'+(item.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\"></div>\r\n                        <popup class=\"card-popup\" popup-side=\"bottom\" popup-position=\"center\">\r\n                            <card card-type=\"user\" card-id=\"{{item._id}}\"></card>\r\n                        </popup>\r\n                    </a>\r\n                </td>\r\n                <td>\r\n                    <a ui-sref=\"app.user.profile({stub:item.stub})\">\r\n                        <div class=\"bold\">{{item.name}}</div>\r\n                        <div>{{item.blurb | letters: 70}}</div>\r\n                    </a>\r\n                </td>\r\n                <td class=\"text-center\">\r\n                    <a class=\"\" stat-display-modal type=\"follow\" parent-type=\"user\" parent-id=\"{{item._id}}\">{{item.followers}}</a>\r\n                </td>\r\n                <td class=\"text-center\">\r\n                    <a class=\"\" ui-sref=\"app.user.projects({stub:item.stub})\">{{item.numProjects}}</a>\r\n                </td>\r\n                <td hide-sm>\r\n                    <hide-if-owner owner=\"{{item._id}}\">\r\n                        <stat-button hide-stat=\"true\" size=\"sm\" type=\"follow\" parent-type=\"user\" parent-id=\"{{item._id}}\" count=\"item.followers\"></stat-button>\r\n                    </hide-if-owner>\r\n                </td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n    <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n    <div ng-hide=\"query.notEnoughResults\">\r\n        <a class=\"well-button m-v-40 \" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n            <div>{{query.noMoreResults ? \'No more users\' : \'See more users\'}}</div>\r\n        </a>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/users-groups.html', '<form name=\"PeopleGroupsForm\" class=\"edit-box\">\r\n    <div class=\"rel-box\">\r\n       <edit-button ng-show=\"showEdit\" inline=\"true\" form=\"PeopleGroupsForm\" save-fn=\"save()\"></edit-button>\r\n\r\n        <!-- If Empty -->\r\n        <div ng-if=\"!usersGroups.length > 0\">\r\n            <h3 class=\"md-subhead\">Team Members</h3>\r\n        </div>\r\n\r\n        <!-- If Editing  -->\r\n        <div ng-if=\"PeopleGroupsForm.$visible || edit\" ng-sortable=\"userGroupSortConfig\">\r\n            <div ng-repeat=\"group in usersGroups\" class=\"my-handle\">\r\n                <h3 class=\"md-subhead\"><input class=\"editable\" type=\"text\" ng-model=\"group.name\" placeholder=\"Group Name\" name=\"role\"></h3>\r\n                <div class=\"user-sort\" ng-sortable=\"userSortConfig\" ng-class=\"{\'empty\':group.members.length == 0}\">\r\n                    <user-row class=\"my-handle block disable-href\" ng-repeat=\"user in group.members track by $index\" data=\"user\" type=\"user\" show-edit=\"true\" delete-fn=\"delete(group.members, $index)\"></user-row>\r\n                    <empty-group ng-if=\"group.members.length == 0\" delete-fn=\"delete(usersGroups, $index)\"></empty-group>\r\n                </div>\r\n                <div class=\"rel-box\">\r\n                    <md-button ng-show=\"parent\" class=\"invite-button md-accent md-border-green md-sm\" show-invite-link-modal parent=\"parent\" group=\"{{group.name}}\" modal-callback=\"modalCallback()\">Get Invite Link</md-button>\r\n                    <user-search data=\"group.members\" placeholder=\"Search for more members (or add by email)\" ng-style=\"group.members.length != 0 && {\'margin-left\' : \'67px\'}\" focus=\"PeopleGroupsForm.$visible || edit\" parent=\"parent\" group=\"{{group.name}}\" modal-callback=\"modalCallback()\"></user-search>\r\n                </div>\r\n            </div>\r\n            <add-row add-fn=\"newGroup()\"></add-row>\r\n        </div>\r\n\r\n        <!-- If Not Editing  -->\r\n        <div ng-if=\"!(PeopleGroupsForm.$visible || edit)\">\r\n            <div ng-repeat=\"group in usersGroups\" ng-show=\"group.members.length > 0\">\r\n                <h3 class=\"md-subhead\">{{group.name || \'Core team\'}}</h3>\r\n                <div class=\"user-sort md-row\" layout=\"row\" layout-wrap>\r\n                    <user-row class=\"md-col\" flex=\"100\" flex-sm=\"100\" ng-repeat=\"user in group.members track by $index\" data=\"user\" type=\"user\"></user-row>\r\n                </div>\r\n                <md-divider style=\"margin: 20px 0 10px;\"></md-divider>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/users-new-modal.html', '<md-dialog>\r\n    <form unsaved-warning-form novalidate name=\"NewUserForm\" ng-submit=\"invite()\">\r\n        <md-dialog-content>\r\n            <div class=\"md-content-container content-xs\">\r\n                <h1 class=\"md-headline no-margin\">Invite someone to STEMN</h1>\r\n                <br>\r\n                <br>\r\n                <br>\r\n                <div layout=\"row\">\r\n                    <md-input-container flex=\"50\" class=\"md-accent\" focus-me=\"true\">\r\n                        <label>Name*</label>\r\n                        <input name=\"name\" ng-model=\"data.name\"\r\n                        required>\r\n                        <div ng-messages=\"NewUserForm.name.$error\" ng-if=\"NewUserForm.name.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <md-input-container flex=\"50\" class=\"md-accent\">\r\n                        <label>Email*</label>\r\n                        <input name=\"email\" ng-model=\"data.email\"\r\n                        required type=\"email\">\r\n                        <div ng-messages=\"NewUserForm.email.$error\" ng-if=\"NewUserForm.email.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                            <div ng-message=\"email\">Not a valid email</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                </div>\r\n                <md-input-container flex=\"50\" class=\"md-accent\">\r\n                    <label>Role (eg: Team Leader or Junior Engineer)</label>\r\n                    <input name=\"role\" ng-model=\"role\"\r\n                    type=\"text\">\r\n                </md-input-container>\r\n                <md-input-container flex=\"50\" class=\"md-accent\">\r\n                    <label>Group (eg: Marketing Team or Thermal Subsystem)</label>\r\n                    <input name=\"group\" ng-model=\"data.group\"\r\n                    type=\"text\">\r\n                </md-input-container>\r\n                <br>\r\n                <br>\r\n                <br>\r\n            </div>\r\n            <div layout=\"row\" layout-align=\"start center\">\r\n                <div flex class=\"text-lightgrey\">*required fields</div>\r\n                <div>\r\n                    <md-button ng-click=\"cancel()\">Cancel</md-button>\r\n                    <md-button type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"NewUserForm.$invalid\">Invite</md-button>\r\n                </div>\r\n            </div>\r\n        </md-dialog-content>\r\n    </form>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/tpls/users.html', '<h3 class=\"md-subhead\">{{typeInfo.title}}</h3>\r\n<user-row ng-repeat=\"user in users\" data=\"user\"></user-row>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/users-permissions-edit/tpls/users-permissions-edit-modal.html', '<md-dialog class=\"apply-for-job-modal\" aria-label=\"Job application\">\r\n    <div class=\"md-modal-header text-subtitle-thin\" layout=\"row\" layout-align=\"start center\">\r\n        <span class=\"text-black\">Edit User:</span>&nbsp;{{user.name}}\r\n    </div>\r\n\r\n    <md-dialog-content class=\"bg-lightgrey overflow-x-box p-0\">\r\n        <div class=\"md-content-container content-sm\" style=\"padding: 30px;\">\r\n\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\">User Role</div>\r\n                <md-input-container class=\"md-accent\">\r\n					<label>What is {{user.profile.firstname}}\'s role on the team?</label>\r\n					<input name=\"role\" ng-model=\"user.role\" type=\"text\">\r\n				</md-input-container>\r\n            </div>\r\n\r\n            <div class=\"card-z1 card-padding\"  ng-hide=\"user.owner\">\r\n                <div class=\"md-subhead m-b-30\">Edit Permissions</div>\r\n                <md-radio-group ng-model=\"user.permissions.role\">\r\n                    <md-radio-button value=\"{{item.value}}\" class=\"md-accent m-l-0\" ng-repeat=\"item in permissions\">\r\n                        <div layout=\"row\">\r\n                            <md-icon class=\"m-r-10 s30\" md-svg-icon=\"{{item.icon}}\"></md-icon>\r\n                            <div>\r\n                                <div class=\"text-subtitle-thin text-black\">{{item.title}}</div>\r\n                                <div class=\"text-lightgrey\">{{item.descriptionDetailed}}</div>\r\n                            </div>\r\n                        </div>\r\n                    </md-radio-button>\r\n                </md-radio-group>\r\n            </div>\r\n\r\n            <div layout=\"row\" class=\"m-t-30\">\r\n                <div flex></div>\r\n                <md-button class=\"m-0\" ng-click=\"cancel()\">Cancel</md-button>\r\n                <md-button class=\"md-accent md-raised\" style=\"margin: 0 0 0 10px;\" ng-click=\"save()\">Finish</md-button>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/modules/users/users-permissions-edit/tpls/users-permissions-edit.html', '<div ng-repeat=\"user in users\" layout=\"row\" layout-align=\"start center\" class=\"p-v-10\">\r\n    <div class=\"avatar-circle m-r-15\" style=\"background-image: url(\'{{user.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true\'); border: none;\"></div>\r\n    <div flex>\r\n        <div class=\"bold\">{{user.name}}</div>\r\n        <div class=\"text-lightgrey\">{{user.owner ? \'Owner: Can do everything\' : permissions[user.permissions.role].description}}</div>\r\n    </div>\r\n    <md-button class=\"md-circle md-xs md-grey\" aria-label=\"Settings\">\r\n        <md-icon md-svg-src=\"more-h\"></md-icon>\r\n        <popup class=\"tooltip-menu\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" layout=\"column\">\r\n            <a class=\"md-subhead\" ng-click=\"editUser($event, $index)\">Edit</a>\r\n            <a ng-if=\"!user.owner\" class=\"md-subhead\" ng-click=\"deleteUser($index)\">Delete</a>\r\n        </popup>\r\n    </md-button>\r\n</div>\r\n<div style=\"margin-left: 53px\">\r\n    <user-search data=\"users\" placeholder=\"Search for more members (or add by email)\" parent=\"parent\" pre-process-fn=\"userAddPreProcessFn\"></user-search>\r\n    <md-button class=\"md-accent md-raised md-flat md-md m-0 md-cornered\" show-invite-link-modal parent=\"parent\">Get Invite Link</md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/app/app.html', '<div layout=\"column\" style=\"min-height: 100vh\" class=\"appView\" layout-offset-top-banner=\"true\">\r\n    <main-horizontal-menu></main-horizontal-menu>\r\n    <div layout-offset-horizontal-menu>\r\n        <overlay-views class=\"contentView\">\r\n            <div ui-view class=\"rel-box\"></div>\r\n            <div view-cache ui-view=\"feed\" class=\"rel-box\"></div>\r\n            <overlay ng-hide=\"tab1\" view=\"tab1\"><div ui-view=\"tab1\"></div></overlay>\r\n            <overlay ng-hide=\"tab2\" view=\"tab2\"><div ui-view=\"tab2\"></div></overlay>\r\n            <overlay ng-hide=\"tab3\" view=\"tab3\"><div ui-view=\"tab3\"></div></overlay>\r\n            <overlay ng-hide=\"tab4\" view=\"tab4\"><div ui-view=\"tab4\"></div></overlay>\r\n            <overlay ng-hide=\"tab5\" view=\"tab5\"><div ui-view=\"tab5\"></div></overlay>\r\n            <overlay ng-hide=\"tab6\" view=\"tab6\"><div ui-view=\"tab6\"></div></overlay>\r\n            <overlay ng-hide=\"tabThread\" view=\"tab-thread\" class=\"layer2\"><div ui-view=\"tab-thread\"></div></overlay>\r\n\r\n        </overlay-views>\r\n        <!-- Fixed relative to inner  -->\r\n    </div>\r\n\r\n    <!-- Fixed relative to window  -->\r\n    <transition-overlay></transition-overlay>\r\n    <loading-overlay class=\"page\" ng-if=\"LayoutOptions.overlay.loading\"></loading-overlay>\r\n\r\n    <!-- Footer -->\r\n    <div flex=\"\"></div>\r\n    <footer></footer>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/applications/tpls/application.html', '<div class=\"applicationView\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\">\r\n\r\n<!--\r\n        <div ng-if=\"isAdmin\" >\r\n            <div class=\"md-subhead m-b-10\">Application Details</div>\r\n            <form name=\"ApplicationAdminEdit\" class=\"m-b-30\" style=\"background: rgba(0, 0, 0, 0.03); padding: 30px;\">\r\n                <div class=\"md-row\" layout=\"row\">\r\n                    <div flex=\"50\" class=\"md-col\">\r\n                        <md-input-container class=\"md-accent\">\r\n                            <label>Notes</label>\r\n                            <textarea ng-model=\"entity.notes\" rows=\"6\"></textarea>\r\n                        </md-input-container>\r\n                    </div>\r\n                    <div flex=\"50\" class=\"md-col\">\r\n                        <md-input-container>\r\n                            <label>Application Status</label>\r\n                            <md-select class=\"md-accent\" ng-model=\"entity.status.state\">\r\n                                <md-option ng-repeat=\"item in applicationStatuses\" value=\"{{item.model}}\">\r\n                                    {{item.name}}\r\n                                </md-option>\r\n                            </md-select>\r\n                        </md-input-container>\r\n                        <md-button class=\"md-accent md-raised\" ng-click=\"saveApplication()\">\r\n                            Save\r\n                        </md-button>\r\n                    </div>\r\n                </div>\r\n            </form>\r\n        </div>\r\n-->\r\n\r\n        <div class=\"md-subhead m-b-20\" ng-show=\"showEdit\">\r\n            <a ui-sref=\"app.applications\" class=\"text-green\">My Applications</a> / {{entity.parent.name}}\r\n        </div>\r\n        <div class=\"md-subhead m-b-20\" ng-show=\"isAdmin\">\r\n            <a ui-sref=\"app.organisation.overview({\'stub\': entity.organisations[0].stub})\" class=\"text-green\">{{entity.organisations[0].name}}</a> / <a ui-sref=\"app.organisation.jobs({\'stub\': entity.organisations[0].stub})\" class=\"text-green\">Jobs</a> / <a ui-sref=\"app.job({\'stub\': entity.parent.stub})\" class=\"text-green\">{{entity.parent.name}}</a> / {{entity.child.name}}\r\n        </div>\r\n\r\n        <tip-banner class=\"m-b-15\" local=\"true\" tip-hide=\"!showEdit || entity.resubmitted\">\r\n            <div layout=\"row\" layout-align=\"start center\">\r\n                <div flex ng-bind-html=\"statusMessage\"></div>\r\n                <div ng-show=\"entity.status.state == \'awaitingUpdate\'\"><div resubmit-application-button application=\"entity\" resubmitted=\"entity.resubmitted\"></div></div>\r\n            </div>\r\n        </tip-banner>\r\n\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <a ng-if=\"entity.organisations[0].picture\" ui-sref=\"app.organisation.jobs({\'stub\': entity.organisations[0].stub})\" class=\"avatar avatar-square-contain avatar-lg\" style=\"background-image:url({{entity.organisations[0].picture}}?size=logo-md)\"></a>\r\n        </div>\r\n        <h1 class=\"md-display-1 text-center m-t-15\">{{entity.parent.name}}</h1>\r\n        <div class=\"text-center\">\r\n            <a ui-sref=\"app.organisation.jobs({\'stub\': entity.organisations[0].stub})\" class=\"md-title text-grey light-font\">{{entity.organisations[0].name}}</a>\r\n        </div>\r\n\r\n        <div class=\"line-divider-bottom m-b-20 m-t-40\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Applicant Profile</div>\r\n        </div>\r\n        <user-row-detailed user-id=\"{{entity.child._id}}\" show-edit=\"showEdit\" button-text=\"{{showEdit ? \'Edit Profile\' : \'See Profile\'}}\"></user-row-detailed>\r\n\r\n        <form name=\"CoverLetterEdit\" class=\"edit-box\">\r\n            <edit-button ng-show=\"showEdit || isAdmin\" form=\"CoverLetterEdit\" inline=\"true\" save-fn=\"saveApplication()\"></edit-button>\r\n            <div class=\"line-divider-bottom m-b-20 m-t-40\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Application Cover Letter</div>\r\n            </div>\r\n            <div class=\"cover-letter\">\r\n                <div class=\"angular-medium-editor\" ng-hide=\"CoverLetterEdit.$visible || entity.coverLetter.length<1\" ng-bind-html=\"entity.coverLetter\"></div>\r\n                <div ng-if=\"CoverLetterEdit.$visible\">\r\n                    <div required class=\"angular-medium-editor\" medium-editor name=\"blurb\" ng-model=\"entity.coverLetter\" editor-type=\"text\" style=\"min-height: 300px;\"\r\n                    placeholder=\"Why is this the perfect job for you?\"></div>\r\n                </div>\r\n            </div>\r\n        </form>\r\n        <div ng-hide=\"entity.coverLetter.length>0\" class=\"text-lightgrey\">\r\n            No cover letter included\r\n        </div>\r\n        <div class=\"line-divider-bottom m-b-40 m-t-40\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Applicant\'s Project Portfolio</div>\r\n            <a class=\"text-green\" ng-show=\"showEdit\" click-create-project>Add another project</a>\r\n        </div>\r\n        <card-feed parent-id=\"{{entity.child._id}}\" parent-type=\"user\" type=\"projects\" items=\"projectItems\" size=\"12\"></card-feed>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/applications/tpls/applications.html', '<div class=\"applicationsView m-t-10\">\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container\">\r\n            <div layout=\"row\" layout-align=\"start center\">\r\n                <h1 flex class=\"md-display-2\">Your Job Applications</h1>\r\n            </div>\r\n            <md-divider class=\"m-t-40 md-divider-grey\"></md-divider>\r\n        </div>\r\n    </div>\r\n\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container rel-box\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"2\" infinite-scroll-disabled=\"query.loading || query.notEnoughResults || query.noMoreResults\">\r\n            <div ng-repeat=\"item in query.results\" class=\"card-z1 rel-box m-b-15\" layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\">\r\n                <div layout=\"column\" flex>\r\n                    <a class=\"md-title p-r-30 inline\" ng-href=\"{{item.href}}\"><b class=\"capitalise\">{{item.organisations[0].name}}</b>/{{item.parent.name}}</a>\r\n                    <div class=\"m-t-10\">\r\n                        <a class=\"text-lightgrey\" ng-href=\"{{item.href}}\">Applied <span am-time-ago=\"item.timestamp\"></span></a>\r\n                        <span class=\"interpunct\">Current Status:&nbsp;<span class=\"text-lightgrey\">{{resubmitted ? \'Re-submitted - Pending Review\' : item.mappedStatusText}}</span></span>\r\n                    </div>\r\n                </div>\r\n                <div ng-show=\"item.status.state == \'awaitingUpdate\'\">\r\n                    <div resubmit-application-button application=\"item\" resubmitted=\"resubmitted\"></div>\r\n                </div>\r\n            </div>\r\n            <div layout=\"row\" layout-align=\"center\" ng-hide=\"query.results.length>0\">\r\n                <div class=\"md-content-container content-sm text-center light-font\">\r\n                    <p>You have no job applications yet.</p>\r\n                </div>\r\n            </div>\r\n            <loading-overlay ng-if=\"query.loading && query.params.page==1\"></loading-overlay>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/auth/tpls/auth-dropbox.html', '<h1>AUTH DROPBOX</h1>\r\n<h3>Connect your Dropbox to STEMN</h3>\r\n<md-button class=\"md-lg md-border\" ng-click=\"authorize()\">Connect Dropbox</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/auth/tpls/auth-google.html', '<h1>AUTH GOOGLE</h1>\r\n<h3>Connect your Google Drive to STEMN</h3>\r\n<md-button class=\"md-lg md-border\" ng-click=\"authorize()\">Connect Google</md-button>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/auth/tpls/auth.html', '<div flex class=\"authView\" layout=\"column\" layout-align=\"center center\">\r\n    <ui-view></ui-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-all.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Browse</h1>\r\n        <div class=\"md-title text-grey light-font text-center m-b-60\">Explore STEMN.</div>\r\n\r\n        <!-- FIELDS -->\r\n        <!-- Put Fields here?  -->\r\n\r\n        <div ng-hide=\"projectQuery.results.length==0\">\r\n            <!-- PROJECTS -->\r\n            <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Newest Projects</div>\r\n                <a class=\"text-green\" ui-sref=\"app.browse.projects\">See more projects</a>\r\n            </div>\r\n            <card-feed type=\"projects\" query=\"projectQuery\"></card-feed>\r\n        </div>\r\n        <!-- Threads -->\r\n         <div ng-hide=\"discussionQuery.results.length==0\">\r\n           <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Newest Threads</div>\r\n                <a class=\"text-green\" ui-sref=\"app.browse.threads\">See more threads</a>\r\n            </div>\r\n            <forum size=\"4\" type=\"threads\" query=\"discussionQuery\"></forum>\r\n        </div>\r\n\r\n        <!-- JOBS -->\r\n        <div ng-hide=\"jobQuery.results.length==0\">\r\n            <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>New Jobs</div>\r\n                <a class=\"text-green\" ui-sref=\"app.browse.jobs\">See more jobs</a>\r\n            </div>\r\n            <job-rows size=\"4\" class=\"m-b-60\" query=\"jobQuery\"></job-rows>\r\n        </div>\r\n\r\n        <!-- ORGANISATIONS -->\r\n        <div ng-hide=\"organisationItems.length==0\">\r\n            <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Related Organisations</div>\r\n                <a class=\"text-green\" ui-sref=\"app.browse.organisations\">See more organisations</a>\r\n            </div>\r\n            <organisation-cards size=\"4\" class=\"m-b-60\" items=\"organisationItems\"></organisation-cards>\r\n        </div>\r\n\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-fields/browse-fields.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center center\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Fields</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Follow fields that interest you and they\'ll appear in your newsfeed. </div>\r\n        <a class=\"text-green text-center m-t-15\" show-explanation-modal=\"field\">What is a field?</a>\r\n    </div>\r\n</div>\r\n\r\n\r\n<!--\r\n<div class=\"infobar m-b-30 p-v-15 overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-row text-center\" layout=\"column\" layout-gt-sm=\"row\">\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Start a discussion</h2>\r\n            <p>Got news or an event coming up?<br>Post about something interesting.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Ask anything</h2>\r\n            <p>Link your project and ask a question. <br>Ask for help, feedback or collaborators.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Get your answer.</h2>\r\n            <p>Expect a response in less than 24 hrs. <br>Get your results faster.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n-->\r\n\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-t-15 overflow-x-box\">\r\n    <div class=\"md-content-container md-no-padding m-b-60 rel-box\" layout=\"column\">\r\n        <div class=\"md-row\" layout=\"row\">\r\n            <div hide-sm class=\"md-col\" style=\"width: 300px\">\r\n                <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Search Fields</div>\r\n                    <div class=\"well-input\">\r\n                        <input type=\"text\" ng-model=\"searchFilter.model\" ng-change=\"searchFilter.onChange()\" placeholder=\"Query fields\">\r\n                        <md-icon md-svg-icon=\"search\"></md-icon>\r\n                    </div>\r\n                </div>\r\n                <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Create a field</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            Want to start a discussion or project about a new topic?\r\n                        </div>\r\n                        <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ng-click=\"newField($event)\">Create a field</md-button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div flex class=\"md-col rel-box\" layout=\"column\">\r\n                <div class=\"rel-box\" style=\"min-height: 100px;\">\r\n                    <div class=\"md-subhead m-b-10\">Top fields</div>\r\n                    <table class=\"md-table\">\r\n                        <thead>\r\n                            <tr>\r\n                                <td style=\"width: 40px;\"></td>\r\n                                <td>Name</td>\r\n                                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"followers\" style=\"width: 100px;\" class=\"text-center\">Followers</td>\r\n                                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"numProjects\" style=\"width: 100px;\" class=\"text-center\">Projects</td>\r\n                                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"numJobs\" style=\"width: 100px;\" class=\"text-center\">Jobs</td>\r\n                                <td hide-sm style=\"width: 75px;\"></td>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <tr ng-repeat=\"item in query.results\">\r\n                                <td style=\"padding: 15px 20px 15px 5px;\">\r\n                                    <a ui-sref=\"app.field.top({stub:item.stub})\">\r\n                                        <div class=\"avatar-circle\" ng-style=\"item.picture && { \'background-image\':\'url(\'+item.picture+\'?size=thumb&crop=true)\'}\"></div>\r\n                                    </a>\r\n                                </td>\r\n                                <td>\r\n                                    <a ui-sref=\"app.field.top({stub:item.stub})\">{{item.name}}</a>\r\n                                </td>\r\n                                <td class=\"text-center\">\r\n                                    <a class=\"\" stat-display-modal type=\"follow\" parent-type=\"field\" parent-id=\"{{item._id}}\">{{item.followers}}</a>\r\n                                </td>\r\n                                <td class=\"text-center\">\r\n                                    <a class=\"\" ui-sref=\"app.field.projects({stub:item.stub})\">{{item.numProjects}}</a>\r\n                                </td>\r\n                                <td class=\"text-center\">\r\n                                    <a class=\"\" ui-sref=\"app.field.jobs({stub:item.stub})\">{{item.numJobs}}</a>\r\n                                </td>\r\n                                <td hide-sm>\r\n                                    <stat-button hide-stat=\"true\" size=\"sm\" type=\"follow\" parent-type=\"field\" parent-id=\"{{item._id}}\" count=\"item.followers\"></stat-button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n                    <div ng-hide=\"query.notEnoughResults\">\r\n                        <a class=\"well-button m-v-40 \" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n                            <div>{{query.noMoreResults ? \'No more fields\' : \'See more fields\'}}</div>\r\n                        </a>\r\n                    </div>\r\n                    <div ng-show=\"query.notEnoughResults\" class=\"text-lightgrey m-v-40\">\r\n                        No more results. <a class=\"underlined text-green\" ng-click=\"clearFilter()\">Clear filters</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-jobs/browse-jobs.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">STEMN Jobs</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Apply to hundreds of jobs with one profile · 100% free</div>\r\n        <a class=\"text-center text-green m-t-15\" show-explanation-modal=\"job\">How it works</a>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"infobar m-b-30 p-v-15 overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\">\r\n        <div ng-include=\"\'app/views/landing/landing-jobs/tpls/jobs-steps.html\'\"></div>\r\n    </div>\r\n</div>\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-t-15 overflow-x-box\">\r\n    <div class=\"md-content-container md-no-padding m-b-60 rel-box\" layout=\"column\" style=\"min-height: 100px\">\r\n\r\n        <div class=\"md-row\" layout=\"row\">\r\n            <div hide-sm class=\"md-col\" style=\"width: 300px\">\r\n\r\n                <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Search Jobs</div>\r\n                    <div class=\"well-input\">\r\n                        <input type=\"text\" ng-model=\"searchFilter.model\" ng-change=\"searchFilter.onChange()\" placeholder=\"Query jobs\">\r\n                        <md-icon md-svg-icon=\"search\"></md-icon>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"anim-fade m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Job Map</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            Want to find jobs in a specific location?\r\n                        </div>\r\n                        <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ui-sref=\"app.map({type: \'job\'})\">Explore job map</md-button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"md-subhead m-b-10\">Sort by field</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"fieldFilter.current\" ng-change=\"fieldFilter.change(fieldFilter.current)\">\r\n                        <md-radio-button value=\"\" class=\"md-accent\">All</md-radio-button>\r\n                        <md-radio-button ng-repeat=\"field in fieldFilter.options\" value=\"{{field._id}}\" class=\"md-accent\">{{field.name | letters: 23}} ({{field.numJobs}})</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n\r\n                <div ng-show=\"location && location.latitude && location.longitude\" class=\"anim-fade m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Location</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            <span ng-show=\"location.country_name\">It looks like you are from <span ng-show=\"location.city\"><b>{{location.city}}</b>, </span><b>{{location.country_name}}</b>. Want to see jobs close to you?</span>\r\n                            <span ng-hide=\"location.country_name\">Want to see jobs close to you?</span>\r\n                        </div>\r\n                        <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ng-click=\"sortByNear()\">Sort by proximity</md-button>\r\n                    </div>\r\n                </div>\r\n\r\n\r\n                <div class=\"anim-fade m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Add a new job</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            Are you part of an organisation looking to hire?\r\n                        </div>\r\n                        <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ng-click=\"create($event)\" authenticate>Add a job</md-button>\r\n                    </div>\r\n                </div>\r\n\r\n            </div>\r\n\r\n            <div flex class=\"md-col rel-box\" layout=\"column\">\r\n                <div class=\"md-subhead m-b-10\">Available Positions</div>\r\n\r\n                <table class=\"md-table\">\r\n                    <thead>\r\n                        <tr>\r\n                            <td style=\"width: 40px;\"></td>\r\n                            <td                 filter-column-order filter-object=\"orderFilter\" filter-reverse=\"true\" filter-model=\"organisations[0].name\">Name</td>\r\n                            <td                 filter-column-order filter-object=\"orderFilter\"                       filter-model=\"location[0].name\" style=\"width: 150px;\" class=\"text-center\">Location</td>\r\n                            <td hide-sm hide-md filter-column-order filter-object=\"orderFilter\" filter-reverse=\"true\" filter-model=\"rating\"           style=\"width: 100px;\" class=\"text-center\" ng-show=\"suggestedJobs\">Suitability</td>\r\n                            <td hide-sm hide-md filter-column-order filter-object=\"orderFilter\" filter-reverse=\"true\" filter-model=\"jobType\"          style=\"width: 100px;\" class=\"text-center\">Type</td>\r\n                            <td hide-sm hide-md style=\"width: 95px;\"></td>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr ng-repeat=\"item in query.results\">\r\n                            <td style=\"padding: 15px 20px 15px 5px;\">\r\n                                <a set-entity-href=\"\'organisation\'\" entity-stub=\"item.organisations[0].stub\">\r\n                                    <div class=\"avatar avatar-square-contain\" ng-style=\"item.organisations[0].picture && { \'background-image\':\'url(\'+item.organisations[0].picture+\'?size=thumb)\'}\"></div>\r\n                                </a>\r\n                            </td>\r\n                            <td>\r\n                                <a set-entity-href=\"\'job\'\" entity-stub=\"item.stub\">\r\n                                    <div class=\"bold\">{{item.organisations[0].name}}</div>\r\n                                    <div>{{item.name}}</div>\r\n                                </a>\r\n                            </td>\r\n                            <td class=\"text-center\">{{item.location[0].name}}</td>\r\n                            <td hide-sm hide-md class=\"text-center\" ng-show=\"suggestedJobs\">\r\n                               <div class=\"rating-pie pie-sm\" ng-style=\"{\'animation-delay\': \'-\'+item.rating+\'s\'}\">\r\n                                    <div class=\"number\">{{item.rating}}</div>\r\n                                    <popup class=\"tooltip-popup\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" style=\"max-width: 150px;\">\r\n                                        <p>Your skills include <b>{{item.numMatchingSkills}}/{{item.fields.length}}</b> of those listed on this job.</p>\r\n                                    </popup>\r\n                                </div>\r\n                            </td>\r\n                            <td hide-sm hide-md class=\"text-center\">{{item.jobType}}</td>\r\n                            <td hide-sm hide-md class=\"text-right\">\r\n                                <apply-button job=\"item\" job-id=\"{{item._id}}\" job-stub=\"{{item.stub}}\" class=\"md-sm no-margin\" style=\"min-width: 70px;\" change-state=\"true\"></apply-button>\r\n                            </td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n\r\n\r\n                <div ng-hide=\"query.notEnoughResults\" class=\"m-t-30\">\r\n                    <a class=\"well-button\" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n                        <div>{{noMoreResults ? \'No more results\' : \'See more jobs\'}}</div>\r\n                    </a>\r\n                </div>\r\n\r\n                <div ng-show=\"query.notEnoughResults\" class=\"text-lightgrey m-v-40\">\r\n                    No more results. <a class=\"underlined text-green\" ng-click=\"clearFilter()\">Clear filters</a>\r\n                </div>\r\n                <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-organisations/browse-organisations.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center center\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Organisations</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Browse top organisations - explore their projects, jobs and forum.</div>\r\n        <a class=\"text-green text-center m-t-15\" ng-click=\"newOrganisation($event)\">Create an organisation</a>\r\n    </div>\r\n</div>\r\n\r\n\r\n<!--\r\n<div class=\"infobar m-b-30 p-v-15 overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-row text-center\" layout=\"column\" layout-gt-sm=\"row\">\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Start a discussion</h2>\r\n            <p>Got news or an event coming up?<br>Post about something interesting.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Ask anything</h2>\r\n            <p>Link your project and ask a question. <br>Ask for help, feedback or collaborators.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Get your answer.</h2>\r\n            <p>Expect a response in less than 24 hrs. <br>Get your results faster.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n-->\r\n\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-t-15 overflow-x-box\">\r\n    <div class=\"md-content-container md-no-padding m-b-60 rel-box\" layout=\"column\">\r\n        <div class=\"md-row\" layout=\"row\">\r\n            <div hide-sm class=\"md-col\" style=\"width: 300px\">\r\n               <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Search Organisations</div>\r\n                    <div class=\"well-input\">\r\n                        <input type=\"text\" ng-model=\"searchFilter.model\" ng-change=\"searchFilter.onChange()\" placeholder=\"Query organisations\">\r\n                        <md-icon md-svg-icon=\"search\"></md-icon>\r\n                    </div>\r\n                </div>\r\n                <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Create an organisation</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            Is your team missing? Add your team or organisation and join the community making space happen.\r\n                        </div>\r\n                        <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ng-click=\"newOrganisation($event)\">Create an organisation</md-button>\r\n                    </div>\r\n                </div>\r\n                <div class=\"md-subhead m-b-10\">Sort by field</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"fieldFilter.current\" ng-change=\"fieldFilter.change(fieldFilter.current)\">\r\n                        <md-radio-button value=\"\" class=\"md-accent\">All</md-radio-button>\r\n                        <md-radio-button ng-repeat=\"field in fieldFilter.options\" value=\"{{field._id}}\" class=\"md-accent\">{{field.name | letters: 23}} ({{field.numOrganisations}})</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n                <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Organisation Map</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            Want to find organisations in a specific location?\r\n                        </div>\r\n                        <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ui-sref=\"app.map({type: \'organisation\'})\">Explore the map</md-button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div flex class=\"md-col rel-box\" layout=\"column\">\r\n                <div class=\"rel-box\" style=\"min-height: 100px;\">\r\n                    <div class=\"md-subhead m-b-10\">Top organisations</div>\r\n                    <table class=\"md-table\">\r\n                        <thead>\r\n                            <tr>\r\n                                <td style=\"width: 40px;\"></td>\r\n                                <td>Name</td>\r\n                                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"followers\" style=\"width: 100px;\" class=\"text-center\">Followers</td>\r\n                                <td filter-column-order filter-object=\"orderFilter\" filter-model=\"numProjects\" style=\"width: 100px;\" class=\"text-center\">Projects</td>\r\n                                <td hide-sm style=\"width: 75px;\"></td>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody>\r\n                            <tr ng-repeat=\"item in query.results\">\r\n                                <td style=\"padding: 15px 20px 15px 5px;\">\r\n                                    <a ui-sref=\"app.organisation.overview({stub:item.stub})\">\r\n                                        <div class=\"avatar-square-contain\" ng-style=\"item.picture && { \'background-image\':\'url(\'+item.picture+\'?size=thumb&crop=true)\'}\"></div>\r\n                                    </a>\r\n                                </td>\r\n                                <td>\r\n                                    <a ui-sref=\"app.organisation.overview({stub:item.stub})\">{{item.name}}</a>\r\n                                </td>\r\n                                <td class=\"text-center\">\r\n                                    <a class=\"\" stat-display-modal type=\"follow\" parent-type=\"organisation\" parent-id=\"{{item._id}}\">{{item.followers}}</a>\r\n                                </td>\r\n                                <td class=\"text-center\">\r\n                                    <a class=\"\" ui-sref=\"app.organisation.projects({stub:item.stub})\">{{item.numProjects}}</a>\r\n                                </td>\r\n                                <td hide-sm>\r\n                                    <stat-button hide-stat=\"true\" size=\"sm\" type=\"follow\" parent-type=\"organisation\" parent-id=\"{{item._id}}\" count=\"item.followers\"></stat-button>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n                    <loading-overlay ng-if=\"query.loading\" ng-class=\"{\'translucent\' : query.results.length > 0}\"></loading-overlay>\r\n                    <div ng-hide=\"query.notEnoughResults\">\r\n                        <a class=\"well-button m-v-40 \" layout=\"row\" layout-align=\"center center\" ng-click=\"query.more()\" ng-disabled=\"query.noMoreResults\">\r\n                            <div>{{query.noMoreResults ? \'No more organisations\' : \'See more organisations\'}}</div>\r\n                        </a>\r\n                    </div>\r\n                    <div ng-show=\"query.notEnoughResults\" class=\"text-lightgrey m-v-40\">\r\n                        No more results. <a class=\"underlined text-green\" ng-click=\"clearFilter()\">Clear filters</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-projects/browse-projects.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center center\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Projects</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Discover projects or start your own</div>\r\n        <a class=\"text-green m-v-15\" show-explanation-modal=\"project\">What is a project?</a>\r\n    </div>\r\n</div>\r\n<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-no-padding\">\r\n        <div class=\"line-divider-bottom m-b-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Featured Fields</div>\r\n        </div>\r\n        <fields-filter class=\"m-b-30\" filter=\"fieldFilter\"></fields-filter>\r\n    </div>\r\n</div>\r\n<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-no-padding rel-box\" layout=\"column\">\r\n        <div class=\"line-divider-bottom m-b-40\" layout=\"row\" layout-align=\"start end\">\r\n            <div class=\"md-subhead\" flex>Projects</div>\r\n            <div layout=\"row\" layout-align=\"start center\">\r\n                <md-select ng-model=\"sortFilter.current\" placeholder=\"Sort by\" class=\"no-margin md-subhead\">\r\n                    <md-option ng-repeat=\"filter in sortFilter.options\" value=\"{{filter.model}}\">{{filter.name}}</md-option>\r\n                </md-select>\r\n            </div>\r\n        </div>\r\n        <card-feed parent-id=\"{{fieldFilter.current}}\" parent-type=\"field\" type=\"projects\" sort=\"{{sortFilter.current}}\" size=\"12\"></card-feed>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-threads/browse-threads.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center center\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Threads and Discussions</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Contribute to project threads; help bring projects to life</div>\r\n        <a class=\"text-green text-center m-t-15\" show-explanation-modal=\"thread\">What is a thread?</a>\r\n    </div>\r\n</div>\r\n\r\n\r\n<div class=\"infobar m-b-30 p-v-15 overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-row text-center\" layout=\"column\" layout-gt-sm=\"row\">\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Start a discussion</h2>\r\n            <p>Got news or an event coming up?<br>Post about something interesting.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Ask anything</h2>\r\n            <p>Link your project and ask a question. <br>Ask for help, feedback or collaborators.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Get your answer.</h2>\r\n            <p>Expect a response in less than 24 hrs. <br>Get your results faster.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-t-15 overflow-x-box\">\r\n    <div class=\"md-content-container md-no-padding m-b-60 rel-box\" layout=\"column\" style=\"min-height: 100px\">\r\n\r\n        <div class=\"md-row\" layout=\"row\">\r\n            <div hide-sm class=\"md-col\" style=\"width: 300px\">\r\n\r\n                <div class=\"m-b-30\" >\r\n                    <div class=\"md-subhead m-b-10\">Start a discussion</div>\r\n                    <div class=\"well\" layout=\"column\">\r\n                        <div class=\"text-lightgrey m-b-15\">\r\n                            Got news or an event coming up? Post about something interesting.\r\n                        </div>\r\n                        <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ng-click=\"newThread($event, {type: \'general\'})\">Start a discussion</md-button>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"md-subhead m-b-10\">Sort by field</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"fieldFilter.current\" ng-change=\"fieldFilter.change(fieldFilter.current)\">\r\n                        <md-radio-button value=\"\" class=\"md-accent\">All</md-radio-button>\r\n                        <md-radio-button ng-repeat=\"field in fieldFilter.options\" value=\"{{field._id}}\" class=\"md-accent\">{{field.name | letters: 23}} ({{field.numThreads}})</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n                <div class=\"md-subhead m-b-10\">Reply status</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"statusFilter.current\" ng-change=\"statusFilter.change(statusFilter.current)\">\r\n                        <md-radio-button ng-repeat=\"item in statusFilter.options\" value=\"{{item.model}}\" class=\"md-accent\">{{item.name}}</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n                <div class=\"md-subhead m-b-10\">Thread type</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"typeFilter.current\" ng-change=\"typeFilter.change(typeFilter.current)\">\r\n                        <md-radio-button ng-repeat=\"item in typeFilter.options\" value=\"{{item.model}}\" class=\"md-accent\">{{item.label}}</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n<!--\r\n                <div class=\"md-subhead m-b-10\">Link to project</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"projectFilter.current\" ng-change=\"projectFilter.change(projectFilter.current)\">\r\n                        <md-radio-button ng-repeat=\"item in projectFilter.options\" value=\"{{item.model}}\" class=\"md-accent\">{{item.name}}</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n-->\r\n            </div>\r\n\r\n            <div flex class=\"md-col rel-box\" layout=\"column\">\r\n                <div class=\"md-subhead m-b-10\">Recent threads</div>\r\n                <forum query=\"query\" type=\"threads\"></forum>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse-users/browse-users.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center center\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">People</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Browse top users - explore their projects and profile.</div>\r\n<!--        <a class=\"text-green text-center m-t-15\" ng-click=\"newOrganisation($event)\">Go to your profile</a>-->\r\n    </div>\r\n</div>\r\n\r\n\r\n<!--\r\n<div class=\"infobar m-b-30 p-v-15 overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-row text-center\" layout=\"column\" layout-gt-sm=\"row\">\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Start a discussion</h2>\r\n            <p>Got news or an event coming up?<br>Post about something interesting.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Ask anything</h2>\r\n            <p>Link your project and ask a question. <br>Ask for help, feedback or collaborators.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Get your answer.</h2>\r\n            <p>Expect a response in less than 24 hrs. <br>Get your results faster.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n-->\r\n\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-t-15 overflow-x-box\">\r\n    <div class=\"md-content-container md-no-padding m-b-60 rel-box\" layout=\"column\">\r\n        <div class=\"md-row\" layout=\"row\">\r\n            <div hide-sm class=\"md-col\" style=\"width: 300px\">\r\n               <div class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-b-10\">Search People</div>\r\n                    <div class=\"well-input\">\r\n                        <input type=\"text\" ng-model=\"searchFilter.model\" ng-change=\"searchFilter.onChange()\" placeholder=\"Query users\">\r\n                        <md-icon md-svg-icon=\"search\"></md-icon>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"md-subhead m-b-10\">Looking for someone?</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <div class=\"text-lightgrey m-b-15\">\r\n                        Invite people to STEMN and you\'ll earn awesome prizes.\r\n                    </div>\r\n                    <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ui-sref=\"app.referrals\">Send referral</md-button>\r\n                </div>\r\n\r\n\r\n                <div class=\"md-subhead m-b-10\">Filter by University</div>\r\n                <div class=\"well m-b-30\" layout=\"column\">\r\n                    <md-radio-group class=\"md-compact\" ng-model=\"educationFilter.current\" ng-change=\"educationFilter.change(educationFilter.current)\">\r\n                        <md-radio-button value=\"\" class=\"md-accent\">All</md-radio-button>\r\n                        <md-radio-button ng-repeat=\"field in educationFilter.options\" value=\"{{field._id}}\" class=\"md-accent\">{{field.name | letters: 23}} ({{field.numEducations}})</md-radio-button>\r\n                    </md-radio-group>\r\n                </div>\r\n            </div>\r\n            <div flex class=\"md-col rel-box\" layout=\"column\">\r\n                <div class=\"rel-box\" style=\"min-height: 100px;\">\r\n                    <div class=\"md-subhead m-b-10\">Top users</div>\r\n                    <user-rows query=\"query\" sort=\"sort\"></user-rows>\r\n                    <div ng-show=\"query.notEnoughResults\" class=\"text-lightgrey m-v-40\">\r\n                        No more results. <a class=\"underlined text-green\" ng-click=\"clearFilter()\">Clear filters</a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/browse.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\" style=\"padding-bottom: 0px;\">\r\n        <!-- Bread Crumbs -->\r\n        <div class=\"md-subhead\" ng-hide=\"$state.is(\'app.browse.all\')\">\r\n            <a ui-sref=\"app.browse.all\" class=\"text-green\">Browse</a>\r\n            <span> / {{$state.current.data.name}}\r\n                <popup class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"10px 0 0 0\" layout=\"column\">\r\n                    <a class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"app.browse.projects\">Projects</a>\r\n                    <a class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"app.browse.threads\">Threads</a>\r\n                    <a class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"app.browse.jobs\">Jobs</a>\r\n                    <a class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"app.browse.fields\">Fields</a>\r\n                    <a class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"app.browse.organisations\">Organisations</a>\r\n                    <a class=\"md-subhead\" ui-sref-active=\"active\" ui-sref=\"app.browse.users\">Users</a>\r\n                </popup>\r\n            </span>\r\n        </div>\r\n    </div>\r\n</div>\r\n<ui-view layout=\"column\" class=\"browseView\"></ui-view>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/browse/tpls/fields-filter.html', '<div class=\"fields-filter\" layout=\"row\" layout-wrap>\r\n    <a ng-click=\"select(\'\')\" flex=\"25\" flex-md=\"33\" flex-sm=\"50\" layout=\"row\" layout-align=\"start center\" class=\"m-b-15\" ng-class=\"{\'active\':filter.current == \'\'}\">\r\n        <div class=\"avatar-circle m-r-15\" ng-style=\"{ \'background-image\':\'url(\'+\'/assets/images/default/user-1.png\'+\'?size=thumb&crop=true)\'}\" ng-class=\"{\'md-whiteframe-z2\':filter.current == \'\'}\"></div>\r\n        <div flex class=\"ellipsis\">All Fields</div>\r\n    </a>\r\n    <a ng-click=\"select(item._id)\" flex=\"25\" flex-md=\"33\" flex-sm=\"50\" layout=\"row\" layout-align=\"start center\" ng-repeat=\"item in filter.options\" class=\"m-b-15\" ng-class=\"{\'active\':filter.current == item._id}\">\r\n        <div class=\"avatar-circle m-r-15\" ng-style=\"{ \'background-image\':\'url(\'+(item.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\" ng-class=\"{\'md-whiteframe-z2\':filter.current == item._id}\"></div>\r\n        <div flex class=\"ellipsis\">{{item.name}}</div>\r\n    </a>\r\n<!--\r\n    <a ng-click=\"more()\" flex=\"25\" layout=\"row\" layout-align=\"start center\" class=\"m-b-15\">\r\n        <div class=\"avatar-circle m-r-15\" ng-style=\"{ \'background-image\':\'url(\'+\'/assets/images/default/user-1.png\'+\'?size=thumb&crop=true)\'}\"></div>\r\n        <div flex class=\"ellipsis\">More</div>\r\n    </a>\r\n-->\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/careers/careers.html', '<bannerheader colour=\"[\'#7332cb\', \'#00ff80\']\">\r\n    <h1>Join our mission.</h1>\r\n</bannerheader>\r\n\r\n<fat-tabs>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"{tab : \'leader\'}\">STEMN Leaders</a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"{tab : \'devs\'}\">Developers</a>\r\n</fat-tabs>\r\n\r\n<md-container class=\"static-page\">\r\n    <div ng-if=\"tab==\'leader\'\">\r\n        <div class=\"section-title\">\r\n            <h3>\"The sky calls to us. If we do not destroy ourselves, we will one day venture to the stars.\" -Carl Sagan</h3>\r\n        </div>\r\n        <p>Our plan is simple: take our species multi-planetary. It\'s a tall order for sure, but we\'re not ones to shy away from a challenge. </p><br>\r\n\r\n        <p>We believe it starts with the community. The keys to success of any mission are the people behind it. Scientists, Engineers, and makers around the world are all doing their bit to advance our understanding of the universe. But most are isolated within the sandbox of their immediate community; shielded from the knowledge and opportunities of those beyond.</p><br>\r\n\r\n        <p>At STEMN, we\'re looking for leaders. Leaders who dare question authority, who dare challenge tradition, who dare step outside the box. STEMN Leaders may not have experience, but they also don\'t have excuses. </p><br>\r\n\r\n        <p>STEMN Leaders inspire their communities and measure themselves by the number of minds they inspire and connect. STEMN Leaders bridge the gap between the industry leaders and the budding enthusiasts. STEMN Leaders are ambassadors to their community, and they take full responsibility for devising and executing a winning plan.</p><br>\r\n\r\n        <p>If you believe in our vision, and are up to the challenge (it will be a challenge), send your <strong>winning plan</strong> and a <strong>link to your STEMN profile</strong> to <strong><span style=\"color: #8DC63F\" >mars@stemn.com</span></strong>.</p>\r\n        <md-button ng-disabled=\"loading\" class=\"md-raised md-accent no-margin\" ng-click=\"authenticate(\'linkedin\');\">Apply with Linkedin</md-button>\r\n    </div>\r\n\r\n    <div ng-if=\"tab!=\'leader\'\">\r\n        <div class=\"section-title\">\r\n            <h3>We are looking for devs and interns</h3>\r\n        </div>\r\n        <h3><strong>JavaScript Web Developer</strong></h3>\r\n        <p>Welcome to STEMN. We’re building an Open Science ecosystem that is home to all STEM projects. We are a small team of gutsy&nbsp;engineers with a people-centric ethos. At STEMN, you’ll get the opportunity to turn your ideas into reality. Be a part of our fast-paced growing tech company that is accelerating scientific knowledge.</p>\r\n        <p>We’re looking for skilled software engineers who can not only handle the full MEAN stack, but also care about efficiency and maintainable software. We strive to create a fast and&nbsp;reliable application to continuously ship updates. You should be experienced with web development and Javascript.</p>\r\n        <h3>The Must Haves:</h3>\r\n        <ul>\r\n            <li>Expert knowledge of Javascript</li>\r\n            <li>Stellar software engineering principles in architecture and implementation</li>\r\n            <li>Comfortable taking the lead on projects and working without lots of oversight</li>\r\n        </ul>\r\n        <h3>The Nice to Haves:</h3>\r\n        <ul>\r\n            <li>Experience with Node.JS and&nbsp;AngularJS</li>\r\n            <li>Knowledge of storage systems such as MongoDB</li>\r\n            <li>History of full life cycle management of software projects, from inception to roll out</li>\r\n        </ul>\r\n        <p>Our development cycle is extremely fast; if you think you have what it takes, email your Github profile or previous project experience and resume to <strong>careers@stemn.com</strong>.</p>\r\n        <md-button ng-disabled=\"loading\" class=\"md-raised md-accent no-margin\" ng-click=\"authenticate(\'linkedin\');\">Apply with Linkedin</md-button>\r\n    </div>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/compare/tpls/compare-header.html', '<div class=\"toolbar-sm p-h-10\" layout=\"row\" layout-align=\"start center\" ng-hide=\"!previewer.enabled\">\r\n    <a class=\"text-subtitle-thin\" ng-click=\"openFileFolder(fileMeta)\" style=\"white-space: nowrap;\">\r\n        <span hide-sm class=\"text-black\">{{fileMeta.name}}&nbsp;</span>\r\n        <span hide-sm>V.{{fileMeta.revDecimal}}  </span>\r\n    </a>\r\n    <div flex></div>\r\n<!--\r\n    <a class=\"st-icon-button\">\r\n        <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Open version</md-tooltip>\r\n        <md-icon md-svg-icon=\"action:open_in_new\"></md-icon>\r\n    </a>\r\n-->\r\n    <a class=\"st-icon-button\" ng-click=\"closeWindow()\">\r\n        <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Close</md-tooltip>\r\n        <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/compare/tpls/compare-revision-timeline.html', '<div flex class=\"revision-dots text-center\" ng-show=\"fileMeta.revisions.length>1\">\r\n    <span ng-repeat=\"revision in fileMeta.revisions\">\r\n        <a class=\"revision-dot\" ng-class=\"{\'active\' : revision.rev == fileMeta.rev}\" ng-click=\"revisionChange(\'fileMeta\', revision)\"></a>\r\n        <popup class=\"tooltip-menu\" popup-side=\"top\" popup-position=\"center\" popup-padding=\"0 0 11px 0\" layout=\"column\">\r\n            <a class=\"md-subhead\">Version {{revision.revDecimal}} - {{revision.client_modified | amTimeAgo}}</a>\r\n        </popup>\r\n    </span>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/compare/tpls/compare-window.html', '<compare-header ng-if=\"compareType != \'onion\' && compareType != \'slider\'\" file-meta=\"fileMeta\" previewer=\"previewer\"></compare-header>\r\n<md-content layout=\"column\" flex>\r\n    <preview-files ng-if=\"previewer.enabled\" layout=\"column\" flex project=\"project\" file-meta=\"fileMeta\" previewer=\"previewer\"></preview-files>\r\n    <div ng-if=\"!previewer.enabled\" flex layout=\"column\" layout-align=\"center center\" class=\"bg-lightgrey text-center\">\r\n        <a class=\"st-icon-button\" ng-click=\"selectFile($event, \'2\')\"><md-icon class=\"s-80 m-b-15\" md-svg-icon=\"content:add_circle\"></md-icon></a>\r\n        <a ng-click=\"selectFile($event, \'2\')\" class=\"text-subtitle-thin text-black\">Add another file to compare.</a>\r\n        <div class=\"text-lightgrey\">You may compare with other <br>files or previous versions.</div>\r\n    </div>\r\n</md-content>\r\n<div ng-if=\"compareType == \'sideBySide\' || compareType == \'aboveAndBelow\'\" class=\"footer-toolbar p-h-15\" layout=\"row\" layout-align=\"start center\" ng-hide=\"!previewer.enabled\">\r\n    <compare-revision-timeline layout=\"row\" flex file-meta=\"fileMeta\" previewer=\"previewer\"></compare-revision-timeline>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/compare/tpls/compare.html', '<div class=\"previewView compareView\" style=\"width: 100vw; height: 100vh; overflow-x-box;\" layout=\"column\">\r\n    <!-- Toolbar -->\r\n    <div class=\"toolbar p-h-15\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"text-subtitle-thin ellipsis\">\r\n            <file-bread-crumbs bread-crumbs=\"breadCrumbs\" project=\"project\" show-project-name=\"true\"></file-bread-crumbs>\r\n        </div>\r\n        <div flex></div>\r\n        <div class=\"divider-v-dark m-10 h-50\"></div>\r\n        <md-button class=\"md-icon-button\" ng-click=\"closeCompare()\" aria-label=\"close\">\r\n            <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n        </md-button>\r\n    </div>\r\n\r\n    <div flex layout=\"column\" class=\"overflow-x-box\" style=\"min-height: 0;\" compare-slider=\"slider.width\">\r\n\r\n        <div ng-if=\"compareType == \'onion\' || compareType == \'slider\'\" layout=\"row\">\r\n            <compare-header file-meta=\"fileMeta1\" previewer=\"previewer1\" ng-style=\"slider.width < 50 && {\'min-width\': slider.width+\'%\'} || slider.width >= 50 && {\'width\': slider.width+\'%\'}\"></compare-header>\r\n            <compare-header flex file-meta=\"fileMeta2\" previewer=\"previewer2\" style=\"border-left: 1px solid rgba(0, 0, 0, 0.2); margin-left: -1px;\"></compare-header>\r\n        </div>\r\n\r\n        <div flex layout=\"{{compareType == \'sideBySide\' ? \'row\' : \'column\'}}\" style=\"min-height: 0\" class=\"rel-box\">\r\n            <!-- Main Content 2-->\r\n            <div flex style=\"min-width: 0;\" layout=\"column\" ng-style=\"compareType == \'onion\' && {\'opacity\' : slider.width/100}\r\n                || compareType == \'slider\' && {\'width\' : slider.width + \'%\'}\"\r\n               ng-class=\"{\'overlay-image\' : compareType == \'onion\' || compareType == \'slider\', \'onion\' : compareType == \'onion\'}\">\r\n                <compare-window layout=\"column\" flex project=\"project\" file-meta=\"fileMeta1\" previewer=\"previewer1\" compare-type=\"compareType\" provider=\"provider\" parent-folder=\"parentFolder\"></compare-window>\r\n            </div>\r\n            <!-- Main Content 1-->\r\n            <div flex style=\"min-width: 0;\" layout=\"column\" ng-style=\"compareType == \'sideBySide\' && {\'border-left\': \'1px solid rgba(0, 0, 0, 0.2)\'}\r\n                || compareType == \'aboveAndBelow\' && {\'border-top\': \'1px solid rgba(0, 0, 0, 0.2)\'}\">\r\n                <compare-window layout=\"column\" flex project=\"project\" file-meta=\"fileMeta2\" previewer=\"previewer2\" compare-type=\"compareType\" provider=\"provider\" parent-folder=\"parentFolder\"></compare-window>\r\n            </div>\r\n            <div ng-show=\"compareType == \'slider\'\" class=\"handle\" ng-style=\"compareType == \'slider\' && {\'left\' : slider.width + \'%\'}\"></div>\r\n        </div>\r\n\r\n        <div ng-if=\"compareType == \'onion\' || compareType == \'slider\'\" class=\"p-v-5\" layout=\"row\" style=\"border-top: 1px solid rgba(0, 0, 0, 0.2);\">\r\n            <input flex type=\"range\" min=\"0\" max=\"100\" step=\"0.1\" ng-model=\"slider.width\" style=\"cursor: move;\"/>\r\n        </div>\r\n        <div ng-if=\"compareType == \'onion\' || compareType == \'slider\'\" layout=\"row\">\r\n            <div class=\"footer-toolbar p-h-15\" layout=\"row\" layout-align=\"start center\" ng-style=\"slider.width < 50 && {\'min-width\': slider.width+\'%\'} || slider.width >= 50 && {\'width\': slider.width+\'%\'}\">\r\n                <compare-revision-timeline layout=\"row\" flex file-meta=\"fileMeta1\" previewer=\"previewer1\"></compare-revision-timeline>\r\n\r\n            </div>\r\n            <div flex class=\"footer-toolbar p-h-15\" layout=\"row\" layout-align=\"start center\" style=\"border-left: 1px solid rgba(0, 0, 0, 0.2);\">\r\n                <compare-revision-timeline layout=\"row\" flex file-meta=\"fileMeta2\" previewer=\"previewer2\"></compare-revision-timeline>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"footer-toolbar p-h-15\" layout=\"row\" layout-align=\"start center\">\r\n            <a class=\"st-icon-button\" ui-sref=\"app.preview({projectStub: project.stub, path: fileMeta1.path, children: fileMeta1.virtualChildrenMap.join(\',\'), rev: fileMeta1.rev})\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Preview</md-tooltip>\r\n                <md-icon md-svg-icon=\"compare-single\"></md-icon>\r\n            </a>\r\n            <span class=\"divider-v-dark m-10 h-50\"></span>\r\n            <a ng-show=\"compareModes.indexOf(\'sideBySide\') >= 0\" class=\"st-icon-button\" ng-click=\"setCompareType(\'sideBySide\')\" ng-class=\"{\'active\' : compareType == \'sideBySide\'}\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Compare Side By Side</md-tooltip>\r\n                <md-icon md-svg-icon=\"compare-side\"></md-icon>\r\n            </a>\r\n            <a ng-show=\"compareModes.indexOf(\'aboveAndBelow\') >= 0\" class=\"st-icon-button\" ng-click=\"setCompareType(\'aboveAndBelow\')\" ng-class=\"{\'active\' : compareType == \'aboveAndBelow\'}\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Compare Above and Below</md-tooltip>\r\n                <md-icon md-svg-icon=\"compare-top\"></md-icon>\r\n            </a>\r\n            <a ng-show=\"compareModes.indexOf(\'onion\') >= 0\" class=\"st-icon-button\" ng-click=\"setCompareType(\'onion\')\" ng-class=\"{\'active\' : compareType == \'onion\'}\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Compare Onion Skin</md-tooltip>\r\n                <md-icon md-svg-icon=\"compare-onion\"></md-icon>\r\n            </a>\r\n            <a ng-show=\"compareModes.indexOf(\'slider\') >= 0\" class=\"st-icon-button\" ng-click=\"setCompareType(\'slider\')\" ng-class=\"{\'active\' : compareType == \'slider\'}\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Compare Slider</md-tooltip>\r\n                <md-icon md-svg-icon=\"compare-slide\"></md-icon>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/contact/contact.html', '<bannerheader colour=\"[\'#FF7043\', \'#AB47BC\']\">\r\n    <h1>Let\'s have a chat</h1>\r\n</bannerheader>\r\n<md-container class=\"static-page\">\r\n    <h3 class=\"md-headline\">We\'re all ears!</h3>\r\n    <br>\r\n     <form name=\"forms.contactForm\" ng-submit=\"submitContactForm()\" novalidate>\r\n        <md-input-container class=\"md-accent\">\r\n            <label>What do we call you?</label>\r\n            <input name=\"name\" ng-model=\"contact.from_name\"\r\n            required>\r\n            <div ng-messages=\"forms.contactForm.name.$error\" ng-if=\"forms.contactForm.name.$dirty\">\r\n                <div ng-message=\"required\">This is required.</div>\r\n            </div>\r\n        </md-input-container>\r\n        <md-input-container class=\"md-accent\">\r\n            <label>Your email?</label>\r\n            <input name=\"email\" ng-model=\"contact.from_email\"\r\n            type=\"email\" required>\r\n            <div ng-messages=\"forms.contactForm.email.$error\" ng-if=\"forms.contactForm.email.$dirty\">\r\n                <div ng-message=\"required\">This is required.</div>\r\n                <div ng-message=\"email\">Not a valid email.</div>\r\n            </div>\r\n        </md-input-container>\r\n        <md-input-container class=\"md-accent\">\r\n            <label>What can we do for you?</label>\r\n            <textarea name=\"message\" ng-model=\"contact.text\"\r\n            required ng-minlength=\"20\"></textarea>\r\n            <div ng-messages=\"forms.contactForm.message.$error\" ng-if=\"forms.contactForm.message.$dirty\">\r\n                <div ng-message=\"required\">This is required.</div>\r\n                <div ng-message=\"minlength\">Bit longer than that please.</div>\r\n            </div>\r\n        </md-input-container>\r\n        <alert ng-if=\"alert.show\" class=\"anim-slide-alert\" type=\"{{alert.type}}\">{{alert.message}}</alert>\r\n        <div layout=\"row\">\r\n            <div flex></div>\r\n            <md-button type=\"submit\" class=\"md-accent md-raised\" ng-disabled=\"forms.contactForm.$invalid\">Send</md-button>\r\n        </div>\r\n    </form>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/creations/tpls/creations-all.html', '<!--<feed type=\"all\" parent-type=\"user\" parent-id=\"{{user._id}}\" size=\"sm\" published=\"\'both\'\"></feed>-->\r\n<my-creations published=\"both\"></my-creations>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/creations/tpls/creations-drafts.html', '<!--<feed type=\"all\" parent-type=\"user\" parent-id=\"{{user._id}}\" size=\"sm\" published=\"false\"></feed>-->\r\n<my-creations published=\"false\"></my-creations>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/creations/tpls/creations-published.html', '<!--<feed type=\"all\" parent-type=\"user\" parent-id=\"{{user._id}}\" size=\"sm\" published=\"true\"></feed>-->\r\n<my-creations published=\"true\"></my-creations>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/creations/tpls/creations.html', '<div class=\"creationsView m-t-10\">\r\n    <md-container>\r\n        <div layout=\"row\" layout-align=\"start center\">\r\n            <h1 flex class=\"md-display-2\">Your Creations</h1>\r\n            <!--			<md-button class=\"md-raised md-accent md-flat md-cornered\" click-create>Create something</md-button>-->\r\n        </div>\r\n        <div class=\"text-tabs text-tabs-top tabs-light-grey m-t-40\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n        </div>\r\n    </md-container>\r\n    <div ng-show=\"$state.is(\'app.creations.all\')\" ui-view=\"all\"></div>\r\n    <div ng-show=\"$state.is(\'app.creations.drafts\')\" ui-view=\"drafts\"></div>\r\n    <div ng-show=\"$state.is(\'app.creations.published\')\" ui-view=\"published\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/creations/tpls/my-creations.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-no-padding m-b-60 rel-box\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"2\" infinite-scroll-disabled=\"query.loading || query.notEnoughResults || query.noMoreResults\">\r\n        <!-- Items -->\r\n        <div ng-repeat=\"item in query.results\" class=\"card-z1 rel-box m-b-15\">\r\n<!--            <a ng-href=\"{{item.data.href}}\" class=\"avatar-square-cover avatar-lg\" ng-style=\"::item.data.picture && {\'background-image\': \'url(\'+item.data.picture+\'?size=avatar-lg&crop=true)\'}\"></a>-->\r\n            <a class=\"md-title p-r-30 inline\" ng-href=\"{{item.href}}\"><b class=\"capitalise\">{{item.typeText}}</b>/{{item.name}}</a>\r\n            <div class=\"m-t-10\" layout=\"row\" layout-align=\"start center\">\r\n                <a class=\"text-lightgrey m-r-10\" ng-href=\"{{item.href}}\">\r\n                    Last edited <span am-time-ago=\"item.updated\"></span>\r\n                </a>\r\n                <md-button class=\"md-circle md-xs md-grey pin-top-right\" style=\"margin: 15px 10px;\" aria-label=\"Settings\">\r\n                    <md-icon md-svg-src=\"more-h\"></md-icon>\r\n                    <popup class=\"tooltip-menu\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" layout=\"column\">\r\n                        <a class=\"md-subhead\" ng-click=\"edit(item)\">Edit</a>\r\n                        <a class=\"md-subhead\" confirm ng-click=\"deleteCreation(item._id, item.entityType)\">Delete</a>\r\n                    </popup>\r\n                </md-button>\r\n\r\n                <div flex></div>\r\n                <!-- If creation is a project || thread -->\r\n                <div ng-if=\"item.entityType == \'project\' || item.entityType == \'thread\'\" class=\"text-lightgrey\" layout=\"row\" layout-align=\"start center\">\r\n                    <stat-button type=\"like\" parent-type=\"{{item.entityType}}\" parent-id=\"{{item._id}}\" count=\"item.likes\" display-style=\"circle\" class=\"green\" style=\"margin-right: -3px;\"></stat-button>\r\n                    <a class=\"count\" stat-display-modal parent-id=\"{{item._id}}\" parent-type=\"{{item.entityType}}\" type=\"like\">\r\n                        {{item.likes || 0}}\r\n                    </a>\r\n                    <md-button class=\"md-icon-button md-sm md-grey\" aria-label=\"comments\" style=\"margin-right: -3px;\" ng-href=\"{{item.href}}?reply=true#reply\">\r\n                        <md-icon md-svg-icon=\"response\"></md-icon>\r\n                        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Replies</md-tooltip>\r\n                    </md-button>\r\n                    <a class=\"count\" ng-href=\"{{item.href}}#responses\">{{item.numPosts || item.numComments || 0}}</a>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Messsage -->\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container content-sm text-center light-font\">\r\n                <div ng-hide=\"query.results.length>0\" ng-bind-html=\"message\"></div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Loading -->\r\n        <loading-overlay class=\"light-grey\" ng-if=\"query.loading && query.params.page==1\"></loading-overlay>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/dashboard/tpls/dashboard-feed.html', '<div class=\"border-box-white p-30 text-center\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container content-sm\">\r\n        <img src=\"/assets/images/explanation-modals/moon-landing.svg\" alt=\"\" style=\"width: 200px;\">\r\n        <div class=\"md-title m-v-15\">This will be coming very soon.</div>\r\n        <div class=\"text-subtitle-thin m-t-30\">We are finalising the project change log now. This feature should be complete in the next week - July 2016. Contact the stemn beta team if you have any questions <a href=\"mailto:beta@stemn.com\" class=\"text-green\">beta@stemn.com</a></div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/dashboard/tpls/dashboard-projects.html', '<div class=\"rel-box\">\r\n\r\n    <!--No Projects-->\r\n    <div ng-hide=\"query.results.length > 0\" class=\"border-box-white p-30 text-center\" layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container content-sm\">\r\n           <img src=\"/assets/images/explanation-modals/droid.svg\" alt=\"\" style=\"width: 200px;\">\r\n\r\n            <div class=\"md-title m-b-15\">Create your first project</div>\r\n            <div class=\"text-subtitle-thin m-v-30\">Create an open-source or private project. Connect your project with STEMN Sync to get access to revision history and collaboration tools.</div>\r\n\r\n            <md-button class=\"md-accent md-border md-cornered md-flat md-md\" click-create-project>Create Project</md-button>\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <!--Some Projects-->\r\n    <div ng-show=\"query.results.length > 0\">\r\n<!--\r\n        <div layout=\"row\" class=\"m-b-30\">\r\n            <div flex></div>\r\n            <md-button class=\"md-accent md-cornered md-raised md-flat m-0\" click-create-project>New Project</md-button>\r\n        </div>\r\n-->\r\n        <div layout=\"row\" layout-wrap layout-align=\"center start\" class=\"md-row\">\r\n            <div class=\"md-col m-b-30\" ng-repeat=\"item in query.results\" flex=\"25\" flex-sm=\"50\" flex-md=\"33\">\r\n                <a class=\"folder-icon m-b-10\" ui-sref=\"app.project.overview({stub: item.stub})\">\r\n                    <div class=\"folder-top\">\r\n                        <div class=\"tab\"></div><div class=\"tab\"></div><div class=\"tab\"></div>\r\n                    </div>\r\n                    <div class=\"folder-bottom\" layout=\"column\" layout-align=\"center center\">\r\n                        <div style=\"background: white; border-radius: 50%; padding: 2px;\">\r\n                            <md-icon ng-hide=\"item.permissions.projectType == \'public\'\" class=\"s30\" md-svg-icon=\"lock-outline\" style=\"color: #f5dbab\"></md-icon>\r\n                            <md-icon ng-show=\"item.permissions.projectType == \'public\'\" class=\"s30\" md-svg-icon=\"public\" style=\"color: #bbe8bb;\"></md-icon>\r\n                        </div>\r\n                    </div>\r\n                </a>\r\n                <div class=\"text-center\">\r\n                    <div>{{item.name}}</div>\r\n                    <div class=\"text-lightgrey\">{{item.updated | amTimeAgo}}</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <loading-overlay ng-if=\"query.loading\" class=\"light-grey\"></loading-overlay>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/dashboard/tpls/dashboard.html', '<div layout=\"row\" layout-align=\"center\" class=\"dashboardView\">\r\n    <div class=\"md-content-container\">\r\n        <div class=\"text-tabs tabs-light-grey m-t-15 m-b-30\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n        </div>\r\n\r\n        <ui-view class=\"rel-box\"></ui-view>\r\n    </div>\r\n\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/error/error.html', '<div flex class=\"errorView\" layout=\"column\" layout-align=\"center center\">\r\n<!--    <img ng-if=\"image\" style=\"height: 20vh\" class=\"img-trans\" ng-src=\"{{image}}\">-->\r\n    <h1>{{title}}</h1>\r\n    <h3>{{description}}</h3>\r\n<!--    <md-button ng-if=\"buttontext\" class=\"md-border md-cornered md-md\" ui-sref=\"app.home\">{{buttontext}}</md-button>-->\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/faq/faq.html', '<bannerheader colour=\"[\'#3C3CCD\', \'#E03370\']\">\r\n    <h1>Frequently Asked Questions</h1>\r\n</bannerheader>\r\n\r\n\r\n<md-container class=\"\">\r\n    <h3 class=\"md-headline\">What does STEMN stand for? How do I say it?</h3>\r\n    <p>STEMN stands for <b>S</b>cience <b>T</b>echnology <b>E</b>ngineering <b>M</b>athmatics <b>N</b>etwork. The <b>MN</b> at the end is pronounced in the same was as \'CONDE<b>MN</b>\'</p>\r\n\r\n    <h3 class=\"md-headline\">What is STEMN? Where am I?</h3>\r\n    <p>Welcome to STEMN. Make yourself at home.\r\n        <br>\r\n        <br>STEMN connects the international space community through projects. It’s a place for space-loving scientists, engineers and explorers to geek out about the latest out-of-this-world research. Literally.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">What are projects?</h3>\r\n    <p>Each project page is like a Wikipedia article. It can be as long or short as you like. But enough to give the community a good idea of your skill set and what you are working on.\r\n        <br>\r\n        <br>Still stuck? Check out the <a class=\"text-green\" href=\"/browse/projects\">recent projects</a> for some inspiration.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">What kind of projects can I post on STEMN?</h3>\r\n    <p>Space is multidisciplinary, and it brings all the sciences together. So while the focus is on space projects, we welcome all projects in the STEM fields. Your STEMN profile is your own gallery, your platform, your voice.<a authenticate class=\"text-green\" ng-click=\"newSomething()\"> Tell us your story.</a>\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">What about ITAR?</h3>\r\n    <p>While the STEMN community is built around knowledge sharing, there are legal issues to be aware of. As a rule of thumb, only post information that you have permission to share. Your project page can include as much or as little detail as you like.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">Wow! This is much prettier / useful than LinkedIn!</h3>\r\n    <p>No one likes to use LinkedIn. We use it because we have to. Put a link of your STEMN page on your LinkedIn. Share your STEMN page with employers, and stand out from that dusty pile of CVs.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">Where are the easter eggs!?</h3>\r\n    <p>Well if we straight up told you, it wouldn’t really be an easter egg, would it? (At this stage, you can be pretty sure they are all bugs. If you find one, <a class=\"text-green\" ui-sref=\"app.field.threads({\'stub\':\'stemn-bugs\'})\">let us know</a>!)\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">I love STEMN. Are you on Facebook or Twitter?</h3>\r\n    <p>We sure are. Like us <a class=\"text-green\" href=\"http://www.facebook.com/stem.network\" target=\"_blank\">here</a> and follow us <a class=\"text-green\" href=\"https://twitter.com/stem_network\" target=\"_blank\">here</a>.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">How can I reach you?</h3>\r\n    <p>Feel free to reach us by email at founders@stemn.com or hit us up <a class=\"text-green\" href=\"/contact\">here</a>.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">Where can I find your Privacy Policy and Terms of Service?</h3>\r\n    <p>For your reading pleasure, review our <a class=\"text-green\" href=\"/privacy\">Privacy Policy</a> and <a class=\"text-green\" href=\"/terms\">Terms of Service</a>.\r\n    </p>\r\n\r\n    <h3 class=\"md-headline\">Who’s behind STEMN?</h3>\r\n    <p>We’re flattered you asked. :) Learn more about us <a class=\"text-green\" href=\"/projects/stemn\">here</a>.\r\n    </p>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/field.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <settings-button show-if-admin above=\"true\">\r\n        <md-menu-item>\r\n            <md-button confirm ng-click=\"deleteField()\">Delete</md-button>\r\n        </md-menu-item>\r\n        <md-menu-item>\r\n            <md-button ng-click=\"editStub($event)\">Advanced Edit</md-button>\r\n        </md-menu-item>\r\n    </settings-button>\r\n    <div class=\"md-content-container\">\r\n        <form name=\"FieldForm\" class=\"edit-box\" novalidate>\r\n            <edit-button show-if-admin form=\"FieldForm\" save-fn=\"save()\" inline=\"true\"></edit-button>\r\n            <!-- If Editing -->\r\n            <div ng-show=\"FieldForm.$visible\" layout=\"column\" layout-align=\"center center\" class=\"m-t-30\">\r\n                <upload-image icon=\"true\" name=\"image\" image=\"field.banner.url\" ng-model=\"field.banner.url\">\r\n                    <div class=\"avatar-circle avatar-lg\" style=\"background-image:url({{field.banner.url}}?size=logo-md)\"></div>\r\n                </upload-image>\r\n                <h1 class=\"md-display-1 text-center m-t-20 m-b-40\">\r\n                    <input name=\"name\" ng-model=\"field.name\" class=\"editable text-center\" placeholder=\"Field Name\"\r\n                    type=\"text\" required>\r\n                </h1>\r\n            </div>\r\n            <!-- If NOT Editing -->\r\n            <div ng-hide=\"FieldForm.$visible\">\r\n                <!-- Bread Crumbs -->\r\n                <div class=\"md-subhead m-b-20\">\r\n                    <a ui-sref=\"app.browse.fields\" class=\"text-green\">Fields</a>\r\n                    <span ng-if=\"!$state.is(\'app.field.top\')\">\r\n                        <span> / </span>\r\n                        <a ui-sref=\"app.field.top\" class=\"text-green\">{{field.name}}</a>\r\n                    </span>\r\n                    <span> / {{$state.current.data.name || field.name}}</span>\r\n                </div>\r\n            </div>\r\n            <div ng-hide=\"FieldForm.$visible\" layout=\"column\" layout-align=\"center center\" class=\"m-t-30\">\r\n                <div ng-show=\"field.banner.url\" class=\"avatar-circle avatar-lg\" style=\"background-image:url({{field.banner.url}}?size=logo-md)\" lightbox=\"true\" lightbox-image=\"field.banner.url\"></div>\r\n                <h1 class=\"md-display-1 text-center m-t-20\" text-center>\r\n                    {{field.name}}\r\n                    <span class=\"capitalise\"> {{$state.current.data.name}}</span>\r\n                </h1>\r\n                <a class=\"text-green m-v-30 m-t-10\" show-explanation-modal=\"field\">What is a field?</a>\r\n                <div layout=\"row\" layout-align=\"center center\" class=\"m-b-60\">\r\n                    <stat-button type=\"follow\" parent-type=\"field\" parent-id=\"{{field._id}}\" count=\"data.followers\" class=\"lg m-r-30\"></stat-button>\r\n                    <social-share-buttons style=\"margin-top: 3px;\"></social-share-buttons>\r\n                </div>\r\n            </div>\r\n        </form>\r\n        <ui-view></ui-view>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-blogs.html', '<div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Newest {{field.name}} Updates</div>\r\n</div>\r\n<card-feed parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"blogs\" size=\"12\" items=\"projectItems\"></card-feed>\r\n<!-- FIELDS -->\r\n<div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Related Fields</div>\r\n</div>\r\n<related class=\"m-b-60\" parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"field\"></related>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-jobs.html', '<div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Newest {{field.name}} Jobs</div>\r\n</div>\r\n<job-rows size=\"12\" parent-type=\"field\" parent-id=\"{{field._id}}\" class=\"m-b-60\" query=\"jobQuery\"></job-rows>\r\n\r\n<!-- FIELDS -->\r\n<div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Related Fields</div>\r\n</div>\r\n<related class=\"m-b-60\" parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"field\"></related>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-organisations.html', '<div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Latest {{field.name}} Organisations</div>\r\n</div>\r\n<organisation-cards size=\"12\" field=\"{{field._id}}\" class=\"m-b-60\" items=\"organisationItems\"></organisation-cards>\r\n<!-- FIELDS -->\r\n<div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Related Fields</div>\r\n</div>\r\n<related class=\"m-b-60\" parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"field\"></related>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-people.html', '<md-container>\r\n    <md-divider></md-divider>\r\n    <users parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"topProjects\"></users>\r\n    <md-divider></md-divider>\r\n    <users parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"topBloggers\"></users>\r\n    <md-divider></md-divider>\r\n    <users parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"topContributors\"></users>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-project.html', '<!-- PROJECTS -->\r\n<div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Newest {{field.name}} Projects</div>\r\n<!--            <a class=\"text-green\">See more projects</a>-->\r\n</div>\r\n<card-feed parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"projects\" size=\"12\" items=\"projectItems\"></card-feed>\r\n\r\n<!-- FIELDS -->\r\n<div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Related Fields</div>\r\n</div>\r\n<related class=\"m-b-60\" parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"field\"></related>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-threads.html', '<div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Newest {{field.name}} Questions and Discussions</div>\r\n</div>\r\n<forum size=\"20\" parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"discussions\" query=\"discussionQuery\"></forum>\r\n\r\n<!--<card-feed parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"discussions\" size=\"12\" items=\"discussiontItems\"></card-feed>-->\r\n<!-- FIELDS -->\r\n<div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Related Fields</div>\r\n</div>\r\n<related class=\"m-b-60\" parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"field\"></related>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/field/tpls/field-top.html', ' <!-- FIELDS -->\r\n<div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n    <div class=\"md-subhead\" flex>Related Fields</div>\r\n</div>\r\n<related class=\"m-b-60\" parent-type=\"field\" parent-id=\"{{field._id}}\" type=\"field\"></related>\r\n<div ng-hide=\"projectQuery.results.length==0\">\r\n    <!-- PROJECTS -->\r\n    <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n        <div class=\"md-subhead\" flex>Newest Projects</div>\r\n        <a class=\"text-green\" ui-sref=\"app.field.projects\">See more projects</a>\r\n    </div>\r\n    <card-feed parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"projects\" query=\"projectQuery\"></card-feed>\r\n</div>\r\n<!-- QUESTIONS -->\r\n <div ng-hide=\"discussionQuery.results.length==0\">\r\n   <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n        <div class=\"md-subhead\" flex>Newest Questions and Discussions</div>\r\n        <a class=\"text-green\" ui-sref=\"app.field.threads\">See more</a>\r\n    </div>\r\n    <forum size=\"4\" parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"discussions\" query=\"discussionQuery\"></forum>\r\n<!--    <card-feed parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"discussions\" items=\"discussiontItems\"></card-feed>-->\r\n</div>\r\n\r\n<!-- JOBS -->\r\n<div ng-hide=\"jobQuery.results.length==0\">\r\n    <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n        <div class=\"md-subhead\" flex>Related Jobs</div>\r\n        <a class=\"text-green\" ui-sref=\"app.field.jobs\">See more jobs</a>\r\n    </div>\r\n    <job-rows size=\"4\" parent-type=\"field\" parent-id=\"{{field._id}}\" class=\"m-b-60\" query=\"jobQuery\"></job-rows>\r\n</div>\r\n\r\n<!-- UPDATES -->\r\n<div ng-hide=\"updatesQuery.results.length==0\">\r\n    <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n        <div class=\"md-subhead\" flex>Newest Updates</div>\r\n        <a class=\"text-green\" ui-sref=\"app.field.blogs\">See more updates</a>\r\n    </div>\r\n    <card-feed parent-id=\"{{field._id}}\" parent-type=\"{{field.type}}\" type=\"blogs\" query=\"updatesQuery\"></card-feed>\r\n</div>\r\n\r\n<!-- ORGANISATIONS -->\r\n<div ng-hide=\"organisationItems.length==0\">\r\n    <div class=\"line-divider-bottom m-b-40\" layout=\"row\">\r\n        <div class=\"md-subhead\" flex>Related Organisations</div>\r\n        <a class=\"text-green\" ui-sref=\"app.field.organisations\">See more organisations</a>\r\n    </div>\r\n    <organisation-cards size=\"4\" field=\"{{field._id}}\" class=\"m-b-60\" items=\"organisationItems\"></organisation-cards>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/following/tpls/following-all.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container m-b-30\">\r\n<!--\r\n        <tip-banner local=\"true\" class=\"m-v-15\">\r\n            Followers will be notified when this organisation adds a new <b>project</b>, <b>blog</b> or <b>discussion</b>.\r\n        </tip-banner>\r\n-->\r\n        <h1 class=\"md-display-1\">Things you follow</h1>\r\n        <div class=\"line-divider-bottom m-v-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Fields</div>\r\n            <a class=\"md-subhead text-green\" ui-sref=\"app.following.fields\">See More</a>\r\n        </div>\r\n        <following-detailed hide-more=\"true\" size=\"3\" type=\"field\" ></following-detailed>\r\n\r\n\r\n        <div class=\"line-divider-bottom m-v-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Organisations</div>\r\n            <a class=\"md-subhead text-green\" ui-sref=\"app.following.organisations\">See More</a>\r\n        </div>\r\n        <following-detailed hide-more=\"true\" size=\"3\" type=\"organisation\" ></following-detailed>\r\n\r\n        <div class=\"line-divider-bottom m-v-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Projects</div>\r\n            <a class=\"md-subhead text-green\" ui-sref=\"app.following.projects\">See More</a>\r\n        </div>\r\n        <following-detailed hide-more=\"true\" size=\"3\" type=\"project\" ></following-detailed>\r\n\r\n        <div class=\"line-divider-bottom m-v-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Blogs and Questions</div>\r\n            <a class=\"md-subhead text-green\" ui-sref=\"app.following.threads\">See More</a>\r\n        </div>\r\n        <following-detailed hide-more=\"true\" size=\"3\" type=\"thread\" ></following-detailed>\r\n\r\n\r\n        <div class=\"line-divider-bottom m-v-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Users</div>\r\n            <a class=\"md-subhead text-green\" ui-sref=\"app.following.users\">See More</a>\r\n        </div>\r\n        <following-detailed hide-more=\"true\" size=\"3\" type=\"user\" ></following-detailed>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/following/tpls/following.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container m-b-30\">\r\n        <div class=\"md-subhead\">\r\n            <a href=\"/following\" class=\"text-green\">Things You Follow</a> / {{title}}\r\n        </div>\r\n        <h1 class=\"md-display-1\">{{title}} you follow</h1>\r\n        <md-divider class=\"m-v-30\"></md-divider>\r\n        <following-detailed type=\"{{type}}\"></following-detailed>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/home/home.html', '<div class=\"homeView overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\">\r\n        <div layout=\"row\" class=\"md-row-sm\">\r\n            <div flex class=\"md-col-sm\">\r\n                <feed type=\"all\" data=\"feedData\" size=\"sm\" contained=\"false\"></feed>\r\n            </div>\r\n            <div hide-sm hide-md class=\"md-col-sm\" style=\"width: 350px;\">\r\n                <!-- WELCOME -->\r\n                <div ng-if=\"!currentUser.isLoggedIn()\" class=\"card-z1 m-b-15\">\r\n                    <div class=\"md-subhead\">Welcome to STEMN</div>\r\n                    <div class=\"text-lightgrey m-v-10\">Sign up to find projects, ideas, people and jobs that matter.</div>\r\n                    <div layout=\"row\">\r\n                        <md-button type=\"button\" class=\"md-accent md-cornered md-raised md-flat\" authenticate style=\"margin-left: 0px;\">Sign up</md-button>\r\n                        <md-button type=\"button\" class=\"md-accent md-cornered md-border-green\" ng-click=\"learnMore()\">Learn more</md-button>\r\n                    </div>\r\n                </div>\r\n                <!-- USER -->\r\n                <div ng-if=\"currentUser.isLoggedIn()\" class=\"card-z1 m-b-15 user-widget\">\r\n                    <div layout=\"row\">\r\n                        <div flex layout=\"column\" class=\"p-r-15\">\r\n                            <a ui-sref=\"app.user.profile({stub: user.stub})\" flex class=\"md-headline\">{{user.name}}</a>\r\n                            <div class=\"text-lightgrey\">{{user.blurb | letters : 60}}</div>\r\n                        </div>\r\n                        <div>\r\n                            <a ui-sref=\"app.user.profile({stub: user.stub})\">\r\n                                <img class=\"profile-picture\" ng-src=\"{{user.picture || \'/assets/images/default/user-1.png\'}}?size=user&crop=true\" alt=\"\">\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"md-subhead m-b-15 m-t-30\">Your recent projects</div>\r\n                    <user-projects-widget></user-projects-widget>\r\n                    <div class=\"md-subhead m-b-15 m-t-30\">Your Organisations</div>\r\n                    <user-organisations-widget></user-organisations-widget>\r\n                </div>\r\n                <!-- CHECKLIST -->\r\n                <div class=\"card-z1 m-b-15\" ng-show=\"incomplete.status\">\r\n                    <div class=\"md-subhead m-b-15\">Welcome tasks</div>\r\n                    <feed-checklist incomplete=\"incomplete\"></feed-checklist>\r\n                </div>\r\n                <!-- COMPLETION -->\r\n                <div ng-if=\"currentUser.isLoggedIn()\" class=\"card-z1 m-b-15\" ng-hide=\"completionPercentage == 100\">\r\n                    <user-completion-widget completion-percentage=\"completionPercentage\"></user-completion-widget>\r\n                </div>\r\n                <!-- JOBS -->\r\n                <div class=\"card-z1 m-b-15 p-0\" style=\"min-height: 100px;\">\r\n                    <div class=\"md-subhead p-20\" style=\"padding-bottom: 10px;\" layout=\"row\">\r\n                        <div flex>Latest Jobs</div>\r\n                        <a class=\"text-green\" ng-click=\"jobQuery.more();\">More</a>\r\n                    </div>\r\n                    <a ng-repeat=\"item in jobQuery.results\" class=\"picture-row\" layout=\"row\" layout-align=\"start center\" ui-sref=\"app.job({stub: item.stub})\">\r\n                        <div class=\"avatar avatar-square-contain m-r-15\" ng-style=\"{\'background-image\':\'url(\'+(item.organisations[0].picture || \'/assets/images/default/user-1.png\')+\'?size=thumb)\'}\"></div>\r\n                        <div flex layout=\"column\" class=\"ellipsis-container\">\r\n                            <div flex class=\"semi-bold ellipsis\">{{::item.name}}</div>\r\n                            <div class=\"text-lightgrey ellipsis\">{{::item.organisations[0].name}}</div>\r\n                        </div>\r\n                    </a>\r\n                    <loading-overlay ng-if=\"jobQuery.loading\" ng-class=\"{\'translucent\' : jobQuery.results.length > 0}\"></loading-overlay>\r\n                </div>\r\n                <!-- PEOPLE -->\r\n                <div ng-if=\"currentUser.isLoggedIn()\" class=\"card-z1 m-b-15 p-0\" ng-show=\"peopleQuery.results.length > 0\" style=\"min-height: 100px;\">\r\n                    <div class=\"md-subhead p-20\" style=\"padding-bottom: 10px;\" layout=\"row\">\r\n                        <div flex>People you may know</div>\r\n                        <a class=\"text-green\" ng-click=\"peopleQuery.more();\" ng-hide=\"peopleQuery.noMoreResults\">More</a>\r\n                    </div>\r\n                    <div ng-repeat=\"item in peopleQuery.results\">\r\n                        <div class=\"picture-row\" layout=\"row\" layout-align=\"start center\">\r\n                            <a ui-sref=\"app.user.profile({stub: item.user.stub})\" class=\"avatar avatar-circle m-r-15\" ng-style=\"{\'background-image\':\'url(\'+(item.user.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb)\'}\"></a>\r\n                            <a ui-sref=\"app.user.profile({stub: item.user.stub})\" flex layout=\"column\" class=\"ellipsis-container\">\r\n                                <div flex class=\"semi-bold ellipsis\">{{::item.user.name}}</div>\r\n                                <div class=\"text-lightgrey ellipsis\">{{::item.why}}</div>\r\n                            </a>\r\n                            <stat-button class=\"m-l-15\" hidepublic hide-stat=\"true\" type=\"follow\" parent-type=\"user\" parent-id=\"{{item.user._id}}\" count=\"item.user.followers\"></stat-button>\r\n                        </div>\r\n                    </div>\r\n                    <loading-overlay ng-if=\"peopleQuery.loading\" ng-class=\"{\'translucent\' : peopleQuery.results.length > 0}\"></loading-overlay>\r\n                </div>\r\n                <!-- FACEBOOK CONNECT -->\r\n                <div ng-if=\"currentUser.isLoggedIn() && !currentUser.accounts.facebook\" class=\"card-z1 m-b-15\">\r\n                    <div class=\"md-subhead\">Connect to Facebook</div>\r\n                    <div class=\"text-lightgrey m-v-15\">By linking accounts you\'ll be able to login to STEMN using Facebook. This makes using STEMN on your mobile much easier.</div>\r\n                    <md-button class=\"md-social md-facebook md-cornered m-0 md-md\" ng-click=\"authenticate(\'facebook\')\">\r\n                        Connect to Facebook\r\n                    </md-button>\r\n                </div>\r\n                <!-- FOOTER -->\r\n                <div class=\"footer\">\r\n                    <a ng-repeat=\"item in footerItems\" ui-sref=\"{{item.sref}}\">{{item.text}}</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!--\r\n<md-button class=\"md-fab md-fab-fixed-bottom-right\" hide-gt-sm ui-sref=\"app.search.all\" aria-label=\"site-search\">\r\n    <md-icon md-svg-icon=\"search\"></md-icon>\r\n    <md-tooltip md-direction=\"left\" md-autohide=\"true\">Search</md-tooltip>\r\n</md-button>\r\n-->\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/index/tpls/jobs-index.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container overflow-x-box\" layout=\"column\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Browse Jobs</h1>\r\n        <div class=\"md-title text-grey light-font text-center m-b-30\">Apply to hundreds of jobs with one profile · 100% free</div>\r\n\r\n\r\n        <div class=\"flex-square-tile-row\" layout=\"row\" layout-wrap>\r\n            <div class=\"flex-square-tile\" flex=\"20\" flex-md=\"25\" flex-sm=\"50\" ng-repeat=\"item in fields\">\r\n                <div class=\"image-overlay\" ng-style=\"{\'background-image\':\'url(\'+(item.picture || \'/assets/images/default/square.png\')+\'?size=thumb-lg)\'}\"></div>\r\n                <a class=\"text-overlay\"\r\n                   ui-sref=\"app.jobsQuery({\'field\': item.stub})\" layout=\"column\" layout-align=\"center center\">\r\n                    <div>{{item.name}} Jobs</div>\r\n                </a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/index/tpls/jobs-query-field-location.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\">\r\n        <div class=\"md-subhead m-b-20\">\r\n            <a ui-sref=\"app.browse.jobs\" class=\"text-green\">Jobs</a> / <a ui-sref=\"app.jobsQuery({\'field\':field.stub})\" class=\"text-green\">{{field.name}}</a> / {{location.components[0].short_name}}\r\n        </div>\r\n        <h1 class=\"md-display-1 text-center m-t-50\">{{field.name}} jobs near {{location.components[0].long_name}}</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Apply to hundreds of jobs with one profile · 100% free</div>\r\n    </div>\r\n</div>\r\n\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n    <div class=\"md-content-container\" layout=\"column\">\r\n        <div class=\"md-subhead m-b-10\">Available Positions</div>\r\n        <job-rows parent-type=\"field\" query=\"jobQueryField\" parent-id=\"{{field._id}}\" size=\"10\" near=\"[location.geo.lng, location.geo.lat]\"></job-rows>\r\n        <div ng-if=\"jobQueryField.results.length && jobQueryField.results.length <= 3\">\r\n            <div class=\"md-subhead m-b-10 m-t-30\">Other Jobs near {{location.components[0].long_name}}</div>\r\n            <job-rows query=\"jobQuery\" size=\"10\" near=\"[location.geo.lng, location.geo.lat]\"></job-rows>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/index/tpls/jobs-query-field.html', '<div ng-if=\"$state.is(\'app.jobsQuery\')\">\r\n    <div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n        <div class=\"md-content-container\" layout=\"column\">\r\n            <div class=\"md-subhead m-b-20\">\r\n                <a ui-sref=\"app.browse.jobs\" class=\"text-green\">Jobs</a> / {{field.name}}\r\n            </div>\r\n            <h1 class=\"md-display-1 text-center m-t-50\">{{field.name}} jobs</h1>\r\n            <div class=\"md-title text-grey light-font text-center\">Apply to hundreds of jobs with one profile · 100% free</div>\r\n        </div>\r\n    </div>\r\n\r\n    <div layout=\"row\" layout-align=\"center\" class=\"m-b-30\">\r\n        <div class=\"md-content-container\" layout=\"column\">\r\n            <div class=\"md-subhead m-b-10\">Available Positions</div>\r\n            <job-rows parent-type=\"field\" query=\"jobQuery\" parent-id=\"{{field._id}}\" size=\"10\" near=\"[location.geo.lng, location.geo.lat]\"></job-rows>\r\n            <div class=\"md-subhead m-b-10 m-t-50\">Popular locations</div>\r\n            <div class=\"flex-square-tile-row\" layout=\"row\" layout-wrap>\r\n                <div class=\"flex-square-tile\" flex=\"20\" flex-md=\"25\" flex-sm=\"50\" ng-repeat=\"item in locations | limitTo: locationsLimit\">\r\n                   <div class=\"image-overlay\" ng-style=\"{\'background-image\':\'url(assets/images/default/square.png?size=thumb-lg)\'}\"></div>\r\n                    <a class=\"text-overlay\"\r\n                       ui-sref=\"app.jobsQuery.location({\'location\': item[0]})\" layout=\"column\" layout-align=\"center center\">\r\n                        <div>{{item[0]}}</div>\r\n                    </a>\r\n                </div>\r\n                <div class=\"flex-square-tile\" flex=\"20\" flex-md=\"25\" flex-sm=\"50\">\r\n                    <div class=\"image-overlay\" style=\"background-image:url(\'/assets/images/default/square.png\')\"></div>\r\n                    <a class=\"text-overlay\"  layout=\"column\" layout-align=\"center center\" ui-sref=\".({locations: locationsPage+1})\" ng-click=\"assignStateParams();\">\r\n                        <div>See More</div>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<ui-view></ui-view>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/job/tpls/job.html', '<div class=\"jobView\">\r\n    <missing-fields ng-hide=\"!publishAttempted || forms.JobForm.$completed || !forms.JobForm.$visible\" entity=\"entity\" required-fields=\"requiredFields\" form=\"forms.JobForm\"></missing-fields>\r\n\r\n    <form unsaved-warning-form novalidate name=\"forms.JobForm\" edit-toolbar data=\"entity\"\r\n        save-fn=\"save()\" edit-fn=\"editFn()\" end-edit-fn=\"endEditFn()\">\r\n        <div ng-if=\"!forms.JobForm.$visible\">\r\n            <tip-banner class=\"m-b-15 text-center\" local=\"true\" tip-hide=\"entity.published\">\r\n                This job has not been published yet. It will not be visible to others until it has been published. <a ng-click=\"forms.JobForm.$edit()\">Click here</a> to edit and publish this job listing.\r\n            </tip-banner>\r\n        </div>\r\n\r\n        <edit-toolbar ng-if=\"forms.JobForm.$visible\">\r\n            <div>\r\n                <b>Editing: </b>\r\n                <span>{{entity.name}}</span>\r\n            </div>\r\n            <div flex></div>\r\n            <md-button ng-click=\"forms.JobForm.$cancel()\" class=\"md-dark-grey md-cornered\">Cancel</md-button>\r\n            <md-button ng-hide=\"entity.published\" ng-click=\"forms.JobForm.$save()\" class=\"md-cornered md-dark-grey\">Save Draft</md-button>\r\n            <md-button ng-show=\"entity.published\" ng-click=\"forms.JobForm.$save()\" class=\"md-cornered md-raised md-accent md-flat\">Save</md-button>\r\n            <md-button ng-show=\"!entity.published\" ng-click=\"publish($event)\" class=\"md-raised md-accent md-flat md-cornered\">Publish</md-button>\r\n        </edit-toolbar>\r\n\r\n\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container\" layout=\"column\">\r\n                <div class=\"rel-box\" layout=\"column\">\r\n\r\n                    <settings-button ng-if=\"showEdit\" ng-hide=\"forms.JobForm.$visible\">\r\n                        <md-menu-item>\r\n                            <md-button ng-click=\"forms.JobForm.$edit()\">Edit</md-button>\r\n                        </md-menu-item>\r\n                        <md-menu-item>\r\n                            <md-button ng-click=\"deleteJob()\">Delete Job</md-button>\r\n                        </md-menu-item>\r\n                        <md-menu-item show-if-admin>\r\n                            <md-button click-unpublish entity=\"entity\" save-fn=\"forms.JobForm.$save()\">Unpublish</md-button>\r\n                        </md-menu-item>\r\n                    </settings-button>\r\n\r\n                    <!-- If Editing -->\r\n                    <div ng-if=\"forms.JobForm.$visible\">\r\n                        <h1 id=\"nameEdit\" class=\"md-display-1 text-center m-t-15\">\r\n                           <input name=\"name\" ng-model=\"entity.name\" class=\"editable text-center\" placeholder=\"Job title\"\r\n                        type=\"text\" required>\r\n                        </h1>\r\n                        <div class=\"md-title text-grey light-font text-center\">{{entity.organisations[0].name}}</div>\r\n                    </div>\r\n\r\n                    <!-- If NOT Editing -->\r\n                    <div ng-if=\"!forms.JobForm.$visible\">\r\n                        <div class=\"md-subhead m-b-20\">\r\n                            <a ui-sref=\"app.browse.jobs\" class=\"text-green\">Jobs</a> / <a ui-sref=\"app.organisation.jobs({\'stub\': entity.organisations[0].stub})\" class=\"text-green\">{{entity.organisations[0].name}}</a> / {{entity.name}}\r\n                        </div>\r\n                        <div layout=\"row\" layout-align=\"center\">\r\n                            <a ng-if=\"entity.organisations[0].picture\" ui-sref=\"app.organisation.jobs({\'stub\': entity.organisations[0].stub})\" class=\"avatar avatar-square-contain avatar-lg\" style=\"background-image:url({{entity.organisations[0].picture}}?size=logo-md)\"></a>\r\n                        </div>\r\n                        <h1 class=\"md-display-1 text-center m-t-15\">{{entity.name}}</h1>\r\n                        <div class=\"text-center\">\r\n                            <a ui-sref=\"app.organisation.jobs({\'stub\': entity.organisations[0].stub})\" class=\"md-title text-grey light-font\">{{entity.organisations[0].name}}</a>\r\n                        </div>\r\n                        <div layout=\"row\" layout-align=\"center\">\r\n                            <apply-button class=\"md-md md-raised md-flat md-cornered m-t-30 m-b-30\" job=\"entity\" job-id=\"{{entity._id}}\" job-stub=\"{{entity.stub}}\" text-apply=\"Apply for position\" button-status=\"applicationStatus\"></apply-button>\r\n                        </div>\r\n\r\n                        <!-- If current user has applied -->\r\n                        <div ng-if=\"applicationStatus.status\">\r\n                            <div class=\"line-divider-bottom m-t-60 m-b-30\" layout=\"row\">\r\n                                <div class=\"md-subhead\" flex>Your application</div>\r\n                            </div>\r\n                            <user-row-detailed class=\"m-b-15\" user-id=\"{{user._id}}\" show-edit=\"true\" button-text=\"See full application\" button-href=\"applications/{{applicationStatus.status}}\" job=\"entity\"></user-row-detailed>\r\n                        </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"center\" class=\"m-b-60\">\r\n            <div class=\"md-content-container md-no-padding\" layout=\"column\">\r\n                <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row\">\r\n                    <div class=\"md-col\" flex>\r\n\r\n                        <!-- If Editing -->\r\n                        <div id=\"descriptionEdit\" ng-if=\"forms.JobForm.$visible\" class=\"m-b-30\">\r\n                            <div class=\"line-divider-bottom m-b-40\" style=\"margin-top: 14px;\">\r\n                                <div class=\"md-subhead\">Job Description</div>\r\n                            </div>\r\n                            <div medium-editor name=\"description\" ng-model=\"entity.description\" editor-type=\"text-rich\" style=\"min-height: 100px;\" placeholder=\"Describe the position.\"></div>\r\n                            <popup class=\"tooltip-popup\" popup-side=\"right\" popup-position=\"start\" popup-padding=\"0 0 0 8px\">\r\n                                <p>Describe the job position here. As a guide, we recommend the following headings</p>\r\n                                <ul>\r\n                                    <li>Overview</li>\r\n                                    <li>Responsibilities</li>\r\n                                    <li>Basic Qualifications</li>\r\n                                    <li>Preferred Skills and Experience</li>\r\n                                </ul>\r\n                                <p>Consider adding some generic info about the position, including:</p>\r\n                                <ul>\r\n                                    <li>Perks</li>\r\n                                    <li>Downsides</li>\r\n                                    <li>How to apply</li>\r\n                                </ul>\r\n                            </popup>\r\n                        </div>\r\n                        <!-- If NOT Editing -->\r\n                        <div ng-if=\"!forms.JobForm.$visible\">\r\n                           <div class=\"line-divider-bottom m-b-40\">\r\n                                <div class=\"md-subhead\">Job Description</div>\r\n                            </div>\r\n                            <div class=\"angular-medium-editor\" ng-bind-html=\"entity.description\" render-mentions></div>\r\n                        </div>\r\n\r\n                    </div>\r\n                    <div class=\"md-col sidebar\">\r\n                        <!-- If Editing -->\r\n                        <div ng-if=\"forms.JobForm.$visible\">\r\n                            <div class=\"well m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Job Details</div>\r\n                                </div>\r\n                                <show-if-admin>\r\n                                    <organisation-search data=\"entity.organisations\" single=\"true\" placeholder=\"Organisation\"></organisation-search>\r\n                                </show-if-admin>\r\n                                <location-search id=\"locationEdit\" data=\"entity.location\" single=\"true\" placeholder=\"Location\"></location-search>\r\n                                <div id=\"salaryEdit\" layout=\"row\">\r\n                                    <md-input-container flex=\"33\">\r\n                                        <label>Currency</label>\r\n                                        <md-select required ng-model=\"entity.pay.currency\">\r\n                                            <md-option ng-repeat=\"type in currency\" value=\"{{type.code}}\">\r\n                                                {{type.name}}\r\n                                            </md-option>\r\n                                        </md-select>\r\n                                    </md-input-container>\r\n                                     <md-input-container flex=\"33\">\r\n                                        <label>Min Wage</label>\r\n                                        <input required type=\"number\" name=\"minPay\" ng-model=\"entity.pay.from\"/>\r\n                                    </md-input-container>\r\n                                    <md-input-container flex=\"33\">\r\n                                        <label>Max Wage</label>\r\n                                        <input required type=\"number\" name=\"maxPay\" ng-model=\"entity.pay.to\"/>\r\n                                    </md-input-container>\r\n                                </div>\r\n\r\n                                <md-input-container id=\"positingEdit\">\r\n                                    <label>Position Type</label>\r\n                                    <md-select ng-model=\"entity.jobType\">\r\n                                        <md-option ng-repeat=\"type in jobTypes\" value=\"{{type}}\">\r\n                                            {{type}}\r\n                                        </md-option>\r\n                                    </md-select>\r\n                                </md-input-container>\r\n                                <md-input-container id=\"visaEdit\">\r\n                                    <label>Visa Sponsorship</label>\r\n                                    <md-select ng-model=\"entity.visa.sponsorship\">\r\n                                        <md-option ng-repeat=\"type in visas\" value=\"{{type}}\">\r\n                                            {{type}}\r\n                                        </md-option>\r\n                                    </md-select>\r\n                                </md-input-container>\r\n                                <md-input-container id=\"deadlineEdit\">\r\n                                    <label>Submission Deadline</label>\r\n                                    <input ng-model=\"entity.deadline\" type=\"date\" name=\"deadline\" ng-change=\"formatDate(entity.deadline)\">\r\n                                </md-input-container>\r\n                            </div>\r\n                            <div class=\"well m-b-30\">\r\n                               <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Qualifications and skills</div>\r\n                                </div>\r\n                                <field-search id=\"requiredFieldsEdit\" data=\"entity.requiredFields\" placeholder=\"Required Skills\"></field-search>\r\n                                <tags edit=\"true\" size=\"xs\" tags=\"entity.requiredFields\" type=\"field\"></tags>\r\n                                 <field-search id=\"fieldsEdit\" data=\"entity.fields\" placeholder=\"Recommended Skills\"></field-search>\r\n                                <tags edit=\"true\" size=\"xs\" tags=\"entity.fields\" type=\"field\"></tags>\r\n                            </div>\r\n                            <!-- If Edit we add Source Url -->\r\n                            <show-if-admin>\r\n                                <div class=\"well m-b-30\">\r\n                                   <div class=\"line-divider-bottom m-b-15\">\r\n                                        <div class=\"md-subhead\">Admin Advanced Edit</div>\r\n                                    </div>\r\n                                    <md-input-container>\r\n                                        <label>Source Url</label>\r\n                                        <input type=\"text\" name=\"sourceUrl\" ng-model=\"entity.sourceUrl\"/>\r\n                                    </md-input-container>\r\n                                    <md-input-container>\r\n                                        <label>Source String</label>\r\n                                        <input type=\"text\" name=\"sourceKnownString\" ng-model=\"entity.sourceKnownString\"/>\r\n                                    </md-input-container>\r\n                                    <md-button ng-click=\"checkSourceValid()\" class=\"md-raised md-flat md-accent md-cornered m-0\">Check</md-button>\r\n                                </div>\r\n                            </show-if-admin>\r\n                        </div>\r\n                        <!-- If NOT Editing -->\r\n                        <div ng-if=\"!forms.JobForm.$visible\">\r\n                            <div ng-if=\"entity.pay.from && entity.pay.to\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Compensation</div>\r\n                                </div>\r\n                                <div>{{entity.pay.from | money : entity.pay.currency}} to {{entity.pay.to | money : entity.pay.currency}} Salary</div>\r\n                            </div>\r\n                            <div ng-if=\"entity.location[0].name\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Location</div>\r\n                                </div>\r\n<!--                                <mapbox class=\"map\" callback=\"mapCallback\"></mapbox>-->\r\n                                <div>{{entity.location[0].name}}</div>\r\n                            </div>\r\n                            <div ng-if=\"entity.jobType\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Job Type</div>\r\n                                </div>\r\n                                <div>{{entity.jobType}}</div>\r\n                            </div>\r\n                            <div ng-if=\"entity.level\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Important Qualifications</div>\r\n                                </div>\r\n                                <div>{{entity.level}}</div>\r\n                            </div>\r\n                            <div ng-if=\"entity.requiredFields.length>0\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Required Skills</div>\r\n                                </div>\r\n                                <tags edit=\"false\" size=\"xs\" tags=\"entity.requiredFields\" type=\"field\" status=\"true\"></tags>\r\n                            </div>\r\n                            <div ng-if=\"entity.fields.length>0\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Related Fields</div>\r\n                                </div>\r\n                                <tags edit=\"false\" size=\"xs\" tags=\"entity.fields\" type=\"field\" status=\"true\"></tags>\r\n                            </div>\r\n                            <div ng-if=\"entity.visa.sponsorship\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Visa Sponsorship</div>\r\n                                </div>\r\n                                <div class=\"capitalise\">{{entity.visa.sponsorship}}</div>\r\n                            </div>\r\n                            <div ng-if=\"entity.deadline\" class=\"m-b-30\">\r\n                                <div class=\"line-divider-bottom m-b-15\">\r\n                                    <div class=\"md-subhead\">Application Deadline</div>\r\n                                </div>\r\n                                <div class=\"capitalise\">{{entity.deadline | date : short}}</div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div ng-if=\"!forms.JobForm.$visible && showEdit\">\r\n                    <div class=\"line-divider-bottom m-t-60 m-b-30\" layout=\"row\">\r\n                        <div class=\"md-subhead\" flex>Recent Applicants</div>\r\n                    </div>\r\n                    <application-rows parent-type=\"job\" parent-id=\"{{entity._id}}\" job=\"entity\"></application-rows>\r\n                </div>\r\n                <div ng-if=\"!forms.JobForm.$visible\" ng-show=\"JobQuery.results.length > 1\"> <!-- Hide if equals 1 (API will return this job only) -->\r\n                    <div class=\"line-divider-bottom m-t-60 m-b-40\">\r\n                        <div class=\"md-subhead\">More Jobs at {{entity.organisations[0].name}}</div>\r\n                    </div>\r\n                    <job-rows ng-show=\"entity.organisations[0]._id\" parent-type=\"organisation\" parent-id=\"{{entity.organisations[0]._id}}\" current-job-id=\"{{entity._id}}\" query=\"JobQuery\"></job-rows>\r\n                </div>\r\n\r\n            </div>\r\n        </div>\r\n    </form>\r\n\r\n    <div ng-if=\"!forms.JobForm.$visible && !showEdit\" layout=\"row\" layout-align=\"center\" style=\"background: rgb(248, 248, 248);\" >\r\n        <div layout=\"row\" layout-align=\"center center\" class=\"md-content-container m-v-30\">\r\n            <md-button style=\"min-width: 140px;\" class=\"md-cornered md-md md-accent md-raised md-flat\" ui-sref=\"app.browse.jobs\">Browse all Jobs</md-button>\r\n            <span class=\"m-h-15 text-lightgrey\">or</span>\r\n            <md-button style=\"min-width: 140px;\" class=\"md-cornered md-md md-accent md-raised md-flat\" ng-click=\"createJob($event)\" authenticate>Post a job</md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-community/tpls/landing-community.html', '<div class=\"landingCommunityView\">\r\n   <div class=\"overflow-x-box\">\r\n        <div style=\"background-color: #2e4155; background-image: url(\'assets/images/landing/laptop-book-screen.png\'); min-height: 650px;\" class=\"bg-img-auto\" layout=\"column\" layout-align=\"center center\">\r\n           <div class=\"md-content-container md-no-padding text-center text-white\">\r\n                <h1 class=\"md-display-2\">Great Engineering is Open.</h1>\r\n                <h3 style=\"line-height: 1.6em;\">Explore open-source projects or contribute your own.<br>Get off to a flying start.</h3>\r\n                <md-button class=\"md-accent md-raised md-flat md-cornered md-lg m-t-30\" ng-click=\"login($event)\">Join the community</md-button>\r\n                <div class=\"uppercase font-light m-t-40\" style=\" letter-spacing: 3px; font-size: 16px;\">Signup now to join the beta.</div>\r\n           </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"section-md\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container\" layout=\"column\">\r\n                <div class=\"text-center\">\r\n                    <h2 class=\"md-headline uppercase\">Explore great Open-Source projects.</h2>\r\n                    <h3 class=\"section-sub\">Engineering & Science is not a solo affair - it is fundamentally collaborative.<br>Join the <a ui-sref=\"app.open\" class=\"text-green underlined\">open-source movement</a> and accelerate the pace of scientific development.</h3>\r\n                </div>\r\n                <div class=\"rel-box\">\r\n                    <div layout=\"row\" layout-wrap style=\"margin: 0 -15px;\">\r\n                        <creation-card flex=\"33\" flex-md=\"50\" flex-sm=\"100\" style=\"padding: 0 15px 30px;\" ng-repeat=\"item in [\'552d93f30a86e7e6480a7087\', \'56e06debf2fccd122d96cc54\', \'54ca29fda07984f8746ca132\']\" entity-id=\"{{item}}\" entity-type=\"project\"></creation-card>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <md-divider></md-divider>\r\n    <div class=\"section-md\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container\">\r\n                <div class=\"md-row\" layout=\"column\" layout-gt-sm=\"row\" layout-align-gt-sm=\"start center\">\r\n                    <div flex class=\"md-col\">\r\n                         <div class=\"md-whiteframe-z3 m-v-30\">\r\n                            <img src=\"/assets/images/landing/chrome-flat-browser-top.png\">\r\n                            <md-content style=\"max-height: 400px;\">\r\n                                <img src=\"assets/images/landing/project-demo.jpg\">\r\n                            </md-content>\r\n                        </div>\r\n                    </div>\r\n                    <div flex class=\"md-col\">\r\n                        <div class=\"md-headline uppercase\">Find and Discuss Incredible Projects</div>\r\n                        <p class=\"text-subtitle-thin\">Follow projects in your field. Keep updated on changes and explore the raw data, code and modelling files.</p>\r\n                        <p class=\"text-subtitle-thin\">Use resources in Open-Source projects to get off to a flying start.</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <md-divider></md-divider>\r\n    <div class=\"section-md\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container image-section\">\r\n                <div class=\"md-row\" layout=\"column\" layout-gt-sm=\"row\" layout-align-gt-sm=\"start center\">\r\n                    <div flex class=\"md-col\">\r\n                        <div class=\"md-headline uppercase\">Your Online Project Portfolio</div>\r\n                        <p class=\"text-subtitle-thin\">Better than a Linkedin profile. STEMN lets you create a project portfolio that accurately represents your skills and experience.</p>\r\n                        <p class=\"text-subtitle-thin\">Use your STEMN portfolio as your resume. Apply for positions directly through our job-board and find youre dream job.</p>\r\n                        <md-button class=\"text-lightgrey md-border md-cornered md-md m-l-0 md-arrow-button\" ui-sref=\"app.landing.jobs\">\r\n                            Learn more\r\n                            <md-icon md-svg-icon=\"arrow-back\"></md-icon>\r\n                        </md-button>\r\n\r\n                    </div>\r\n                    <div flex class=\"md-col rel-box\">\r\n                        <div class=\"md-whiteframe-z3 m-v-30 image-abs\">\r\n                            <img src=\"/assets/images/landing/chrome-flat-browser-top.png\">\r\n                            <md-content style=\"max-height: 400px;\">\r\n                                <img src=\"assets/images/landing/profile-md.jpg\">\r\n                            </md-content>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"section-md bg-lightgrey\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container\" layout=\"column\">\r\n                <div layout=\"row\" layout-align=\"center\">\r\n                    <div class=\"md-content-container content-xs md-no-padding text-center\">\r\n                        <h2 class=\"md-headline uppercase m-t-0\">Reserve your Username</h2>\r\n                        <h3 class=\"section-sub\" style=\"margin-bottom: 30px;\">Sign up for a free account. No strings attached.</h3>\r\n                        <md-button class=\"md-accent md-raised md-cornered md-flat md-lg\" ng-click=\"login($event)\">Pre-register now</md-button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-jobs/tpls/jobs-steps.html', '<div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row m-t-15\" layout-wrap>\r\n    <div flex=\"25\" flex-sm=\"100\" flex-md=\"50\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">1</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Create a portfolio</h2>\r\n            <p>Sign up for STEMN (It\'s 100% free). Showcase your projects, experience, and skills.</p>\r\n        </div>\r\n    </div>\r\n    <div flex=\"25\" flex-sm=\"100\" flex-md=\"50\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">2</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Find matching jobs</h2>\r\n            <p>Find aerospace jobs by location, visa requirements, experience, technology.</p>\r\n        </div>\r\n    </div>\r\n    <div flex=\"25\" flex-sm=\"100\" flex-md=\"50\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">3</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Application review</h2>\r\n            <p>We\'ll pair you with a member of our Talent Team to polish up your application for FREE!</p>\r\n        </div>\r\n    </div>\r\n    <div flex=\"25\" flex-sm=\"100\" flex-md=\"50\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">4</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Get an interview</h2>\r\n            <p>Over 64% of applicants via STEMN land interviews with our partner companies.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-jobs/tpls/landing-jobs.html', '<carousel class=\"text-white\" slide=\"\'/assets/images/satellite/brazil-satellite.jpg\'\" style=\"min-height: 650px;\">\r\n    <div class=\"md-content-container md-no-padding text-center\">\r\n        <h1 class=\"md-display-2\">New Space Jobs & Internships</h1>\r\n        <h3>Apply to hundreds of aerospace companies with one profile</h3>\r\n        <md-button authenticate class=\"md-border md-cornered md-lg wow flipInX m-t-30\" ui-sref=\"app.browse.jobs\">Find your job matches</md-button>\r\n    </div>\r\n</carousel>\r\n\r\n<div class=\"overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container content-lg section-md\" layout=\"column\">\r\n        <div class=\"md-title text-grey light-font text-center m-b-30\">How It Works</div>\r\n        <div ng-include=\"\'app/views/landing/landing-jobs/tpls/jobs-steps.html\'\"></div>\r\n    </div>\r\n</div>\r\n\r\n<div layout=\"row\" layout-align=\"center\" class=\"section-md\" style=\"background: rgba(0, 0, 0, 0.04);\">\r\n    <div class=\"md-content-container\">\r\n        <div class=\"md-title text-grey light-font text-center m-b-30\">Apply to hundreds of jobs with one profile </div>\r\n        <div layout=\"row\" layout-wrap>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56acaaa415a9671224f9d72a\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56ad960715a9671224fa0c79\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56bc0ab24fddf5b31055b582\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56bc4032ccb652193b831a03\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56ac9a9815a9671224f9cf7a\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56b4596880af28176d5e826a\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56ad8c17086dbea17acfda27\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56c18f5c91d7200462fba8e2\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56b001e0e55bee1b35907a61\"></job-tile>\r\n            <job-tile flex=\"20\" flex-sm=\"50\" flex-md=\"33\" entity-id=\"56ad92af15a9671224fa09f0\"></job-tile>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!--\r\n<div layout=\"column\" layout-align=\"center center\" class=\"p-v-60\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center center\">\r\n        <div class=\"m-b-15 md-title light-font\">Get a weekly email of the best New Space opportunities</div>\r\n        <div layout=\"row\">\r\n            <input class=\"input-bordered m-r-10\" style=\"width: 350px;\" type=\"text\">\r\n            <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-0\">Subscibe</md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n-->\r\n\r\n<div class=\"section-md\">\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container text-center\" layout=\"column\" layout-align=\"center\">\r\n            <div class=\"md-title light-font text-center m-b-10\">The most exciting space companies are hiring on STEMN</div>\r\n            <div class=\"md-title text-grey light-font text-center\">Create a profile to see them all</div>\r\n        </div>\r\n    </div>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <md-button class=\"md-accent md-raised md-flat md-cornered md-lg wow flipInX m-t-30\" authenticate ui-sref=\"app.browse.jobs\">Create your portfolio</md-button>\r\n    </div>\r\n</div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-pricing/tpls/landing-pricing.html', '<carousel class=\"text-white\" slide=\"\'/assets/images/satellite/brazil-satellite.jpg\'\" style=\"min-height: 650px;\">\r\n    <div class=\"md-content-container md-no-padding text-center\">\r\n        <h1 class=\"md-display-2\">Pricing</h1>\r\n<!--        <h3>Apply to hundreds of aerospace companies with one profile</h3>-->\r\n<!--        <md-button authenticate class=\"md-border md-cornered md-lg wow flipInX m-t-30\" ui-sref=\"app.browse.jobs\">Find your job matches</md-button>-->\r\n    </div>\r\n</carousel>\r\n\r\n<div class=\"overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container content-lg section-md\" layout=\"column\">\r\n        <div class=\"md-title text-grey light-font text-center m-b-30\">Open source public projects are completely free. Only pay for the private projects you work on.</div>\r\n\r\n        <div layout=\"row\">\r\n            <div flex class=\"pricing-table\" ng-repeat=\"item in [1,2,3]\">\r\n                <div class=\"pricing-header\">\r\n                    <h4 class=\"pricing-title\">Starter</h4>\r\n                    <div class=\"pricing-sub\">Ideal for individuals</div>\r\n                </div>\r\n                <div class=\"pricing-price\">\r\n                    <span class=\"pricing-currency\">$</span>\r\n                    <span class=\"pricing-total\">30.00</span>\r\n                    <span class=\"pricing-period\">/Month</span>\r\n                </div>\r\n                <div class=\"p-30\">\r\n                    <div class=\"m-b-15\">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero deserunt unde voluptatibus, dignissimos vero non dolore iste reiciendis laborum delectus ducimus in soluta sint laboriosam doloremque impedit ullam corrupti cupiditate!</div>\r\n                    <md-button class=\"md-accent md-raised md-flat md-cornered\">Choose Plan</md-button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-recruiting/landing-recruiting.html', '<div class=\"landingRecruitingView overflow-x-box\">\r\n    <carousel class=\"text-white\" slide=\"\'/assets/images/satellite/remote-sensing-5.jpg\'\" style=\"min-height: 650px;\">\r\n        <div class=\"md-content-container md-no-padding text-center\">\r\n            <h1 class=\"md-display-2\">Access the World\'s Best Aerospace Talent</h1>\r\n            <h3>Find scientists and engineers with the technical skills you need. Browse their portfolios.</h3>\r\n            <md-button class=\"md-border md-cornered md-lg wow flipInX m-t-30\" ng-click=\"loginRecruit($event)\">Get Early Access</md-button>\r\n        </div>\r\n    </carousel>\r\n\r\n    <div class=\"section-md\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container content-lg\" layout=\"column\">\r\n                <div class=\"md-title text-grey light-font text-center m-b-30\">How It Works</div>\r\n                <div ng-include=\"\'app/views/landing/landing-recruiting/tpls/recruiting-steps.html\'\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"section-md\" style=\"background: rgba(0, 0, 0, 0.03);\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container content-lg\">\r\n                <div class=\"md-title text-grey light-font text-center m-b-30\">Improve your hiring process with customised reports and recruiting software that your entire team will love</div>\r\n                <div class=\"md-whiteframe-z4\">\r\n                    <img src=\"/assets/images/landing/chrome-flat-browser-top.png\" alt=\"\">\r\n                    <div class=\"hover-parent rel-box\">\r\n                        <img src=\"assets/images/landing/ats/New-Applicants.png\" alt=\"\">\r\n                        <img style=\"position: absolute; top: 0; bottom: 0; right: 0; left: 0;\" class=\"hover-show\" src=\"assets/images/landing/ats/Profile.png\" alt=\"\">\r\n                    </div>\r\n                </div>\r\n                <!-- <div class=\"stat-section md-row\" layout=\"row\" layout-wrap>\r\n                    <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\" layout-align=\"center\">\r\n                        <div class=\"title\">Match</div>\r\n                        <div class=\"stat\">77%</div>\r\n                        <div class=\"description\">average match rating for job requirements</div>\r\n                    </div>\r\n                    <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\" layout-align=\"center\">\r\n                        <div class=\"title\">Quality</div>\r\n                        <div class=\"stat\">5%</div>\r\n                        <div class=\"description\">of candidate applications approved</div>\r\n                    </div>\r\n                    <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\" layout-align=\"center\">\r\n                        <div class=\"title\">Intent</div>\r\n                        <div class=\"stat\">67%</div>\r\n                        <div class=\"description\">of candidates agree to an interview</div>\r\n                    </div>\r\n                </div> -->\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"section-md\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container text-center\" layout=\"column\" layout-align=\"center\">\r\n                <div class=\"md-title text-grey light-font\">Every week, over 300 rocket scientists from the world\'s best universities join STEMN.</div>\r\n            </div>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <md-button class=\"md-accent md-raised md-flat md-cornered md-lg wow flipInX m-t-30\" ng-click=\"loginRecruit($event)\">Get Early Access</md-button>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"section-md\" style=\"background: rgba(0, 0, 0, 0.03);\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container\">\r\n                <div class=\"faq-section md-row\" layout=\"row\">\r\n                    <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\">\r\n                        <div class=\"md-title m-b-15\">Who are your candidates?</div>\r\n                        <p>We have a rapidly growing community of aerospace engineers and scientists from the world\'s best universities. Our mission is the connect you to the top 1% of aerospace talent from across the U.S. and Europe</p>\r\n                    </div>\r\n                    <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\">\r\n                        <div class=\"md-title m-b-15\">Why is STEMN different?</div>\r\n                        <p>STEMN is also a project publishing platform. We match candidates to jobs based on the skills demonstrated in their project portfolio. This means you spend less time on sourcing and more time interviewing & hiring.</p>\r\n                    </div>\r\n                    <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\">\r\n                        <div class=\"md-title m-b-15\">How do you make money?</div>\r\n                        <p>STEMN has 2 payment options. Traditionally we charge 15% of the hire\'s first year base salary (with a 100% money back guarantee for 90 days). Alternatively, you can choose to pay 1.5% of the hire\'s annual salary per month for their first 12 months of employment.</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-recruiting/tpls/recruiting-steps.html', '<div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row m-t-15\" layout-wrap>\r\n    <div flex=\"33\" flex-sm=\"100\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">1</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Create a company profile</h2>\r\n            <p>Tell the world about your company. Build up a following. Showcase your product and team. <a class=\"text-green\" ui-sref=\"app.organisation.overview({stub: \'saber-astronautics\'})\">See Example.</a></p>\r\n        </div>\r\n    </div>\r\n    <div flex=\"33\" flex-sm=\"100\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">2</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Post a job</h2>\r\n            <p>Tag required technical skills and experience. Your job will be distributed to matching candidates.</p>\r\n        </div>\r\n    </div>\r\n    <div flex=\"33\" flex-sm=\"100\" class=\"md-col\" layout=\"row\">\r\n        <div class=\"count-circle m-r-10\">3</div>\r\n        <div flex>\r\n            <h2 class=\"md-title bold m-t-0\">Match with candidates</h2>\r\n            <p>Get pre-qualified candidates with experience in the technologies you specified. Browse their project portfolio.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-sync/tpls/landing-sync.html', '<div class=\"landingSyncView overflow-x-box\">\r\n    <div style=\"background-color: rgba(0, 0, 0, 0.03); min-height: 700px; box-shadow: inset 0px -60px 50px -60px rgba(0,0,0,0.05);\" class=\"pattern\" layout=\"column\" layout-align=\"start center\">\r\n        <div class=\"md-content-container md-no-padding text-center m-t-60\">\r\n            <h1 class=\"md-display-2  m-t-60\">Painless Engineering Versioning</h1>\r\n            <h3 style=\"line-height: 1.6em;\">STEMN is smart engineering file management,<br>integrated seamlessly into your workflow.</h3>\r\n            <md-button class=\"md-accent md-raised md-flat md-cornered md-lg m-t-30\" ng-click=\"login($event)\">Get Started For Free</md-button>\r\n        </div>\r\n    </div>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"compare-laptop\">\r\n            <img class=\"laptop\" src=\"assets/images/landing/sync/laptop.png\" alt=\"\">\r\n            <div class=\"screen\" compare-slider=\"slider.width\">\r\n                <img class=\"slide-1\" src=\"assets/images/landing/sync/pcbv2-crop.jpg\" alt=\"\">\r\n                <div class=\"slide-2\" ng-style=\"{\'width\' : slider.width + \'%\'}\">\r\n                      <img src=\"assets/images/landing/sync/pcbv1-crop.jpg\" alt=\"\">\r\n                </div>\r\n                <div class=\"handle\" ng-style=\"{\'left\' : slider.width + \'%\'}\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div layout=\"row\" layout-align=\"center\" class=\"m-t-60\">\r\n        <div class=\"md-content-container content-sm text-center\">\r\n            <h2 class=\"md-headline uppercase  m-t-30\">Everything you need to stay on track</h2>\r\n            <div class=\"text-subtitle-thin\">Relax. STEMN keeps your team on the same page. Your design process is more robust, so you can be sure there’s no more nasty surprises.</div>\r\n        </div>\r\n    </div>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container text-center section\">\r\n            <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row-lg\">\r\n                <div flex class=\"md-col-lg m-v-15\">\r\n                    <img class=\"m-b-15\" src=\"assets/images/landing/sync/robot.png\">\r\n                    <div class=\"md-title m-b-15\">Visually Compare Changes</div>\r\n                    <div class=\"text-subtitle-thin\">See and compare design changes quickly. Stay updated on the latest. Revert your designs with a single click.</div>\r\n                </div>\r\n                <div flex class=\"md-col-lg m-v-15\">\r\n                    <img class=\"m-b-15\" src=\"assets/images/landing/sync/network.png\">\r\n                    <div class=\"md-title m-b-15\">Open Source Community</div>\r\n                    <div class=\"text-subtitle-thin\">STEMN is home to thousands of open source engineering projects. Find your inspiration and get started on your own.</div>\r\n                </div>\r\n                <div flex class=\"md-col-lg m-v-15\">\r\n                    <img class=\"m-b-15\" src=\"assets/images/landing/sync/shield.png\">\r\n                    <div class=\"md-title m-b-15\">Industry Level Security</div>\r\n                    <div class=\"text-subtitle-thin\">With industry standard AES-256 file encryption at rest and SSL in transit, rest assured that your data is safe and secure.</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <md-divider></md-divider>\r\n\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container section\">\r\n            <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row\">\r\n                <div flex-order-sm=\"2\" flex class=\"md-col\">\r\n                    <div class=\"md-whiteframe-z5 p-30\" style=\"max-width: 350px;\">\r\n                        <div class=\"text-tabs m-b-30\" layout=\"row\">\r\n                            <div class=\"md-subhead active\">Timeline</div>\r\n                        </div>\r\n                        <landing-timeline class=\"m-v-30\"></landing-timeline>\r\n                    </div>\r\n                </div>\r\n                <div flex-order-sm=\"1\" flex class=\"md-col\" layout=\"column\" layout-align=\"space-around\">\r\n                    <div class=\"m-v-15\">\r\n                        <h2 class=\"md-headline uppercase\">Automatic Version Control</h2>\r\n                        <div class=\"text-subtitle-thin\">All your work is automatically synced as you work. View any previous versions, complete with comments, with the automatic version control features. Revert your files with a single click.</div>\r\n                    </div>\r\n                    <div class=\"m-v-15\">\r\n                        <h2 class=\"md-headline uppercase\">No more miscommunication</h2>\r\n                        <div class=\"text-subtitle-thin m-b-15\">Simplify your feedback process by having clients, team members, and stakeholders comment directly on your models.</div>\r\n                        <div class=\"text-subtitle-thin\">Stay informed of discussions and project milestones as soon as they happen.</div>\r\n                    </div>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <md-divider></md-divider>\r\n\r\n    <div layout=\"row\" layout-align=\"center\" class=\"section-md\">\r\n        <div class=\"md-content-container md-no-padding\">\r\n            <div id=\"screens-section\" layout=\"column\" layout-gt-sm=\"row\" class=\"md-row\" layout-align=\"start center\">\r\n                <div flex class=\"md-col\">\r\n                    <div style=\"max-width: 350px;\">\r\n                        <h2 class=\"md-headline uppercase\">Access your files anywhere</h2>\r\n                        <div class=\"text-subtitle-thin m-b-15\">Whether you’re in the office, in the lab, or on the go, access your files in your browser, from any device.</div>\r\n                        <div class=\"text-subtitle-thin m-b-30\">Preview hundreds of different file-types directly in your web browser.</div>\r\n                        <div layout=\"row\" layout-align=\"start center\" layout-wrap class=\"fileTypeDemo\" style=\"margin-left: -6px;\">\r\n                            <img src=\"/assets/images/vectors/filetype/dxf.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/dwg.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/pdf.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/tex.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/xlsx.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/js.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/cpp.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/more.svg\">\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div flex class=\"md-col\">\r\n                    <img id=\"screens\" src=\"assets/images/landing/sync/screens.jpg\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div layout=\"row\" layout-align=\"center\" class=\"bg-lightgrey\">\r\n        <div class=\"md-content-container content-sm text-center section\">\r\n            <h2 class=\"md-headline uppercase\">Save like you always have</h2>\r\n            <div class=\"text-subtitle-thin m-b-30\">STEMN works with your existing tools. Connect once, always synced.</div>\r\n            <img src=\"assets/images/landing/sync/save-diagram.png\">\r\n        </div>\r\n    </div>\r\n\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container content-sm text-center section\">\r\n            <h2 class=\"md-headline uppercase\">Get your projects organised now</h2>\r\n            <div class=\"text-subtitle-thin\">Get started for free. Get your files organized in 2 minutes.</div>\r\n            <md-button class=\"md-accent md-raised md-flat md-cornered md-lg m-t-30\" ng-click=\"login($event)\">Get Started For Free</md-button>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing-sync/tpls/landing-timeline.html', '<div class=\"timeline hide-last\">\r\n    <div class=\"timeline-item\" ng-repeat=\"item in timeline | orderBy: \'-timestamp\'\" layout=\"row\" style=\"padding-bottom: 30px;\">\r\n        <div class=\"timeline-marker marker-sm marker-colored\" layout=\"column\" layout-align=\"center center\" ng-style=\"{\'background-color\': colorMap[item.event]}\">\r\n            <md-icon md-svg-icon=\"{{iconMap[item.event]}}\"></md-icon>\r\n        </div>\r\n        <div class=\"timeline-content\" flex layout=\"row\" style=\"padding-left: 15px; margin-top: -5px;\">\r\n            <div class=\"avatar-circle\" ng-style=\"{\'background-image\':\'url(\\\'\' +(item.user.picture)+ \'\\\')\'}\"></div>\r\n            <div class=\"m-l-15\" flex>\r\n                <div class=\"bold\">{{item.user.name}}</div>\r\n                <div ng-bind-html=\"item.html\"></div>\r\n                <div class=\"text-lightgrey\">{{item.timestamp | amTimeAgo}}</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/landing/landing.html', '<div class=\"landingView\">\r\n    <edit-toolbar class=\"absolute\" ng-style=\"$state.is(\'app.landing.sync\') && {\'color\':\'black\'}\">\r\n        <div flex>\r\n            <md-button ui-sref=\"app.home\" aria-label=\"Home\" class=\"md-sm m-0\" style=\"padding: 5px;\">\r\n                <div style=\"width: 50px;\">\r\n                    <img src=\"assets/images/logo80x80.png\" alt=\"STEMN logo\" class=\"img-trans\" />\r\n                </div>\r\n            </md-button>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"start center\" class=\"landingTopNav\">\r\n            <a hide-sm ng-repeat=\"item in menu\" ui-sref=\"{{item.sref}}\" ng-class=\"{\'active\': $state.includes(item.parent || item.sref) }\">{{item.label}}</a>\r\n            <a ng-click=\"login($event)\" style=\"opacity: 0.6;\">Login</a>\r\n            <md-button hide-gt-md class=\"md-icon-button\" ng-click=\"toggleMenu()\" aria-label=\"Menu\"><md-icon md-svg-icon=\"menu\"></md-icon></md-button>\r\n        </div>\r\n    </edit-toolbar>\r\n\r\n    <md-sidenav class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"landing\">\r\n        <div layout=\"column\">\r\n            <md-button ng-repeat=\"item in menu\" ui-sref=\"{{item.sref}}\" ng-click=\"toggleMenu()\" class=\"text-left m-0 md-cornered md-md\" ng-class=\"{\'active\': $state.includes(item.parent || item.sref) }\">\r\n                {{item.label}}\r\n            </md-button>\r\n        </div>\r\n    </md-sidenav>\r\n    <ui-view></ui-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/map/tpls/map.html', '<div class=\"MapView\">\r\n    <mapbox class=\"map\" layout=\"row\" callback=\"callback\"></mapbox>\r\n    <!--        <map-display flex=\"100\" class=\"rel-box\" data=\"results\" map=\"map\"></map-display>-->\r\n    <div class=\"content md-whiteframe-z3\">\r\n        <div class=\"header\">\r\n            <md-button ui-sref=\"app.home\" class=\"logo\" aria-label=\"home\"><img src=\"assets/images/logo80x80.png\" alt=\"STEMN logo\"></md-button>\r\n            <md-button class=\"tab\" ui-sref=\"app.map({type: \'project\'})\"      ng-class=\"{\'active\': query.type == \'project\'}\"      ng-click=\"setType(\'project\')\">Projects</md-button>\r\n            <md-button class=\"tab\" ui-sref=\"app.map({type: \'organisation\'})\" ng-class=\"{\'active\': query.type == \'organisation\'}\" ng-click=\"setType(\'organisation\')\">Organisations</md-button>\r\n            <md-button class=\"tab\" ui-sref=\"app.map({type: \'job\'})\"          ng-class=\"{\'active\': query.type == \'job\'}\"          ng-click=\"setType(\'job\')\">Jobs</md-button>\r\n            <md-button class=\"md-icon-button geolocate\" ng-click=\"geolocate()\" aria-label=\"geolocate\">\r\n                <md-icon md-svg-icon=\"gps-fixed\"></md-icon>\r\n                <md-tooltip md-direction=\"left\" md-autohide=\"true\">Geolocate</md-tooltip>\r\n           </md-button>\r\n        </div>\r\n        <div class=\"results\" hide-sm hide-md>\r\n            <div class=\"result anim-repeat-slide md\" ng-repeat=\"item in results | limitTo: displayLimit\">\r\n                <a ng-click=\"panToMarker(item.location[0].coords, item._id)\" layout=\"row\">\r\n                    <div class=\"text\" flex>\r\n                        <div class=\"bold\">{{item.name}}</div>\r\n                        <div>{{item.blurb}}</div>\r\n                    </div>\r\n                    <div ng-if=\"item.picture\" class=\"picture\" ng-class=\"{\'contain\':item.entityType == \'job\'}\" ng-style=\"::item.picture && {\'background-image\': \'url(\'+item.picture+\'?size=feed-sm)\'}\"></div>\r\n                </a>\r\n            </div>\r\n            <div class=\"loadMore\" layout=\"row\" ng-show=\"results.length > displayLimit && !hideLoadMore\">\r\n                <a class=\"text-green\" ng-click=\"hideLoadMore = true; displayLimit=9999\">Show More</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div hide-sm hide-md>\r\n        <prompt-overlay ng-show=\"query.type == \'project\'\" img=\"/assets/images/map/help-style.png\">\r\n            <h4 class=\"bold\">Working on an interesting project?</h4>\r\n            <span class=\"text-lightgrey\">Pin it on the map and join the community making space happen.</span>\r\n            <a class=\"text-green\" click-create-project>Pin my project.</a>\r\n        </prompt-overlay>\r\n        <prompt-overlay ng-show=\"query.type == \'organisation\'\" img=\"/assets/images/map/help-data.png\">\r\n            <h4 class=\"bold\">Your team missing?</h4>\r\n            <span class=\"text-lightgrey\">Add your team or organisation and join the community making space happen.</span>\r\n            <a class=\"text-green\" ng-click=\"newOrganisation($event)\">Add my organisation.</a>\r\n        </prompt-overlay>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/notifications/notifications-all.html', '<h2 class=\"md-display-1\">Updates</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"query.loading || query.noMoreResults\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">You will typically be notified when someone you follow creates a new project of if there are updates in a field, project or organisation you follow. You can <a class=\"text-green underlined\" ui-sref=\"app.usersettings.notifications\">change settings here.</a></div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <notification-cards query=\"query\" type=\"\"></notification-cards>\r\n        <div ng-show=\"query.results.length == 0\" class=\"card-z1 text-no-results text-center\">You have no notifications yet.</div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/notifications/notifications-applications.html', '<h2 class=\"md-display-1\">Application Status</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"query.loading || query.noMoreResults\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">When your job application changes status you will be notified here.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <notification-cards query=\"query\" type=\"[\'own-application-pendingReview\', \'own-application-underReview\', \'own-application-awaitingUpdate\', \'own-application-submitted\', \'own-application-rejected\', \'own-application-processLater\']\"></notification-cards>\r\n        <div ng-show=\"query.results.length == 0\" class=\"card-z1 text-no-results text-center\">You have no application notifications yet.<br>These will only show if you have submitted a job application</div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/notifications/notifications-invites.html', '<h2 class=\"md-display-1\">Accept Invites</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\" infinite-scroll=\"query.more()\" infinite-scroll-distance=\"1\" infinite-scroll-disabled=\"query.loading || query.noMoreResults\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">If you are invited to a project or organisations, your invite will appear here. You can <a class=\"text-green underlined\" ui-sref=\"app.usersettings.notifications({\'#\':\'Mentions\'})\">change settings here.</a></div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <notification-cards query=\"query\" type=\"[\'added-project\', \'added-organisation\', \'invite-accepted\']\"></notification-cards>\r\n        <div ng-show=\"query.results.length == 0\" class=\"card-z1 text-no-results text-center\">You have no invite notifications yet.</div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/notifications/notifications.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-t-10\">\r\n    <div class=\"md-content-container overflow-x-box\">\r\n        <h1 class=\"md-display-2\">Notifications</h1>\r\n        <div class=\"text-tabs text-tabs-top m-t-40 m-b-30\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n        </div>\r\n        <div ui-view=\"all\" ng-show=\"$state.includes(\'app.notifications.all\')\"></div>\r\n        <div ui-view=\"invites\" ng-show=\"$state.includes(\'app.notifications.invites\')\" ></div>\r\n        <div ui-view=\"applications\" ng-show=\"$state.includes(\'app.notifications.applications\')\" ></div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/notifications/tpls/notification-cards.html', '    <div class=\"card-z1 m-b-15\" layout=\"row\" ng-repeat=\"notification in query.results\">\r\n        <a class=\"m-r-15\" ng-href=\"{{notification.link1}}\">\r\n           <div class=\"avatar-square-cover avatar-md\" style=\"background-image:url({{notification.picture1 || \'/assets/images/default/user-1.png\'}}?size=thumb-lg&crop=true)\"></div>\r\n        </a>\r\n        <a flex ng-href=\"{{notification.link2 || notification.link1}}\" layout=\"column\">\r\n            <div flex><strong>{{notification.name1}}</strong> {{notification.text}} <strong>{{notification.name2}}<span ng-if=\"notification.name2\">.</span></strong></div>\r\n            <div class=\"text-lightgrey text-right\" am-time-ago=\"::notification.timestamp\"></div>\r\n        </a>\r\n    </div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/onboarding/onboarding-select/tpls/onboarding-select.html', '<div class=\"onboardingSelectView\">\r\n   <edit-toolbar class=\"white\"></edit-toolbar>\r\n\r\n    <div class=\"md-content-container overflow-x-box\">\r\n        <h1 class=\"md-display-1 text-center m-t-30\">How do you want to use STEMN?</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Select from the options below to get set up</div>\r\n        <md-divider class=\"m-v-60\"></md-divider>\r\n<!--\r\n        <div class=\"m-v-30\">\r\n            <a ng-repeat=\"item in options\" class=\"picture-list-large hover-parent\" layout=\"row\" layout-align=\"start center\" ng-click=\"item.clickFn($event)\">\r\n                <div class=\"avatar-circle avatar-md\" ng-style=\"::item.picture && {\'background-image\': \'url(\'+item.picture+\')\'}\"></div>\r\n                <div flex>\r\n                    <h4 class=\"bold\">{{::item.title}}</h4>\r\n                    <p class=\"no-margin\">{{::item.description}}</p>\r\n                </div>\r\n                <md-icon class=\"hover-show\" md-svg-icon=\"chevron-right\"></md-icon>\r\n            </a>\r\n        </div>\r\n-->\r\n\r\n        <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row-lg\">\r\n            <div flex class=\"md-col-lg\">\r\n                <a class=\"st-fancy-select-button text-center m-b-30\" style=\"min-height: 400px;\" layout=\"column\" layout-align=\"center center\" ui-sref=\"app.onboarding.sync.intro\">\r\n                    <img class=\"w-50\" src=\"/assets/images/explanation-modals/droid.svg\" alt=\"\">\r\n                    <div class=\"md-title m-b-15\">Sync a project</div>\r\n                    <div class=\"text-subtitle-thin\">Access revision history, online previews and team collaboration tools.</div>\r\n                </a>\r\n            </div>\r\n            <div flex class=\"md-col-lg\">\r\n                <a class=\"st-fancy-select-button text-center m-b-30\" style=\"min-height: 400px;\" layout=\"column\" layout-align=\"center center\" ui-sref=\"app.user-onboarding.intro\">\r\n                    <img class=\"w-50\" src=\"/assets/images/explanation-modals/deal.svg\" alt=\"\">\r\n                    <div class=\"md-title m-b-15\">Find job matches</div>\r\n                    <div class=\"text-subtitle-thin\">Create a project porfolio. Apply for jobs directly with your STEMN profile.</div>\r\n                </a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/onboarding/onboarding-sync/tpls/onboarding-sync-account.html', '<h2 class=\"md-display-1\">Connect Sync</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Connect your Dropbox or Google Drive. This allows your STEMN projects to Sync directly to your computer. </div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n       <form name=\"forms.sync\">\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\">Sync Accounts</div>\r\n                <p>Connect your dropbox or drive account to take advantage of STEMN Sync. This will automatically sync your project files to STEMN.</p>\r\n                <br>\r\n                <div layout=\"column\" layout-gt-sm=\"row\">\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : currentUser.accounts.dropbox.id }\" layout=\"row\" layout-align=\"start center\" ng-click=\"syncAuthorize(\'dropbox\')\">\r\n                        <md-icon md-svg-icon=\"dropbox\"></md-icon>\r\n                        {{currentUser.accounts.dropbox.id ? \'Connected to Dropbox\' : \'Connect to Dropbox\'}}\r\n                    </md-button>\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : currentUser.accounts.google.refreshToken }\" layout=\"row\" layout-align=\"start center\" ng-click=\"syncAuthorize(\'google\')\">\r\n                        <md-icon md-svg-icon=\"drive\"></md-icon>\r\n                        {{currentUser.accounts.google.refreshToken ? \'Connected to Drive\' : \'Connect to Drive\'}}\r\n                    </md-button>\r\n                </div>\r\n                <loading-overlay ng-if=\"syncAuthLoading\"></loading-overlay>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/onboarding/onboarding-sync/tpls/onboarding-sync-intro.html', '<h2 class=\"md-display-1\">About you</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Add some basic account info. You\'ll be able to add more details later.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n\r\n       <form name=\"forms.overview\">\r\n\r\n            <div class=\"card-z1 card-padding m-b-30 rel-box\">\r\n                <div class=\"md-subhead\">Want to get a head start?</div>\r\n                <p>Import your profile from Linkedin. This will automatically fill out your profile picture, education and experience.</p>\r\n                <md-button class=\"md-social md-linkedin md-md m-l-0 md-cornered\" ng-click=\"linkedinImport()\">Import from Linkedin</md-button>\r\n                <loading-overlay ng-if=\"linkedinLoading\"></loading-overlay>\r\n            </div>\r\n\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\">Profile Photo</div>\r\n                <div layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\" class=\"m-t-30\">\r\n                    <upload-image icon=\"true\" image=\"user.profile.picture\" ng-model=\"user.profile.picture\" circle=\"true\" name=\"ProfileImage\">\r\n                        <img class=\"avatar-circle avatar-xl\" ng-src=\"{{user.profile.picture || \'/assets/images/default/user-1.png\' }}?size=user&crop=true\">\r\n                    </upload-image>\r\n                    <div flex class=\"text-center\">\r\n                        <div ng-show=\"user.profile.picture\">\r\n                           <p ng-show=\"linkedinImported\">Your LinkedIn photo is low resolution. Consider uploading another now.</p>\r\n                           <p ng-hide=\"linkedinImported\">Looking good!</p>\r\n                        </div>\r\n                        <div ng-hide=\"user.profile.picture\">\r\n                            <p>Profiles with a photo get 78% more views</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Mini Resume</div>\r\n                    <div class=\"notes\">Required</div>\r\n                </div>\r\n                <p>Introduce yourself in 100 characters</p>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>e.g. MIT AeroAstro, Materials and Structures specialist; worked at SpaceX</label>\r\n                    <textarea required ng-model=\"user.blurb\" md-maxlength=\"100\"\r\n                    name=\"Blurb\"></textarea>\r\n                    <div ng-messages=\"forms.overview.Blurb.$error\" ng-if=\"forms.overview.Blurb.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                        <div ng-message=\"md-maxlength\">Your blurb has to be less than 100 characters long.</div>\r\n                    </div>\r\n                </md-input-container>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</div>\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/onboarding/onboarding-sync/tpls/onboarding-sync.html', '<edit-toolbar class=\"white p-h-15\">\r\n    <div flex></div>\r\n    <div class=\"md-content-container md-no-padding\" hide-sm hide-md>\r\n        <div class=\"onboarding-steps\" layout=\"row\" layout-align=\"start center\">\r\n            <div ng-repeat=\"tab in tabs\" ng-hide=\"steps[tab].hideCondition();\" layout=\"row\" layout-align=\"start center\">\r\n                <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(steps[tab].sref)}\" ng-click=\"steps[tab].clickFn()\">{{steps[tab].label}}</a>\r\n                <md-icon md-svg-icon=\"chevron-right\" ng-hide=\"$last\"></md-icon>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div flex></div>\r\n</edit-toolbar>\r\n<div class=\"main-horizontal-sub-menu\" hide-gt-md>\r\n    <div class=\"text-tabs\" layout=\"row\">\r\n        <a class=\"md-subhead\" ng-repeat=\"tab in tabs\" ng-click=\"steps[tab].clickFn()\" ng-class=\"{\'active\':$state.includes(steps[tab].sref)}\">{{steps[tab].label}}</a>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"md-content-container overflow-x-box\">\r\n    <h1 class=\"md-display-1 text-center m-t-30\">Setup Sync</h1>\r\n    <div class=\"md-title text-grey light-font text-center\">Nice! You\'ll have STEMN up and running very soon</div>\r\n    <md-divider class=\"m-v-60\"></md-divider>\r\n    <ui-view></ui-view>\r\n    <div layout=\"row\">\r\n        <div flex></div>\r\n        <md-button class=\"md-raised md-flat md-accent md-md md-cornered m-r-0\" ng-click=\"steps[$state.current.name].nextFn()\">{{steps[$state.current.name].nextText}}</md-button>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/onboarding/tpls/onboarding.html', '<div layout=\"row\" layout-align=\"center\" class=\"p-b-30 userOnboarding\" layout-offset-horizontal-menu-force ui-view>\r\n\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/open/open.html', '<img src=\"assets/images/landing/earth-half.png\" style=\"position: fixed; transform: translate(-50%); bottom: 0px; opacity: 0.2; left: 50%; width: 1000px;\">\r\n<div layout=\"row\" layout-align=\"center\" style=\"position: relative; z-index: 1;\">\r\n    <div class=\"md-content-container text-center\">\r\n        <h1 class=\"md-display-2 m-v-30\">Great engineering is open.</h1>\r\n        <div class=\"m-v-60 serif\">\r\n            <p class=\"text-subtitle-thin-lg\">Great science and engineering results from a process of constant iteration and relentless refinement. Engineering is fundamentally collaborative. We believe that the best ideas grow and expand with the input of others.</p>\r\n            <p class=\"text-subtitle-thin-lg\">Open engineering is not just about the final result. It is about sharing your process; the hours of missteps and false starts you tore through, the frustration and anguish you pushed beyond, before you arrived at that final iteration. Each of those false starts is a learning experience, a teachable moment to invite others to understand not just what you designed; but how you did so.</p>\r\n            <p class=\"text-subtitle-thin-lg\">Working in the open can be frightening. Exposing your work to critique requires bold effort. But with the collective, collaborative genius, together we can push the boundaries and create better work.</p>\r\n        </div>\r\n        <p class=\"md-title bold m-v-30\">Be open. Work together.</p>\r\n        <div layout=\"column\" layout-gt-sm=\"row\" layout-align=\"center\">\r\n            <md-button class=\"md-raised md-flat md-accent md-lg\" ng-click=\"login($event)\">Join the movement</md-button>\r\n            <md-button class=\"md-border md-accent md-lg\" href=\'https://twitter.com/home?status=Great engineering is open. @Stem_Network makes @OpenEngineering easy with Dropbox and Drive integration.\' onclick=\"window.open(this.href, \'mywin\',\'left=20,top=20,width=500,height=500,toolbar=1,resizable=0\'); return false\">#OpenEngineering</md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/organisation-settings/tpls/organisation-settings-overview.html', '<form name=\"forms.generalForm\" novalidate>\r\n    <h2 class=\"md-display-1\">General Details</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Basic display details such as organisation name and blurb.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"name\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Organisation Name</div>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Name</label>\r\n                    <input name=\"name\" ng-model=\"organisation.name\"\r\n                    required type=\"text\">\r\n                    <div ng-messages=\"forms.generalForm.name.$error\" ng-if=\"forms.generalForm.name.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                    </div>\r\n                </md-input-container>\r\n            </div>\r\n\r\n            <div id=\"summary\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Organisation Summary</div>\r\n                <div class=\"angular-medium-editor\" medium-editor name=\"blurb\" ng-model=\"organisation.blurb\" editor-type=\"text\" style=\"min-height: 100px;\" placeholder=\"What does this organisation do?\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n    <md-divider class=\"m-v-60\"></md-divider>\r\n    \r\n    <h2 class=\"md-display-1\">Images & Links</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Add your logo and pictures of your organisation. Add links to your website and social-media accounts.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n\r\n            <div id=\"banner\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Organisation Logo</div>\r\n                <p class=\"body-small\">Add your organisation logo to be displayed on all content relating to this organisation.</p>\r\n                <div ng-show=\"organisation.logo.url\" layout=\"row\">\r\n                    <upload-image class=\"block\" name=\"OrgLogo\" image=\"organisation.logo.url\" ng-model=\"organisation.logo.url\" direct=\"true\" icon=\"true\">\r\n                        <div class=\"avatar-square-contain avatar-lg\" style=\"background-image:url({{organisation.logo.url}}?size=logo-md)\"></div>\r\n                    </upload-image>\r\n                </div>\r\n                <div ng-hide=\"organisation.logo.url\">\r\n                    <md-button class=\"md-raised md-flat md-accent md-cornered md-md m-0\" click-upload-image image=\"organisation.logo.url\" ng-model=\"organisation.logo.url\" name=\"OrgLogo\">Select Image</md-button>\r\n                </div>\r\n            </div>            \r\n               \r\n            <div id=\"gallery\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Gallery Images</div>\r\n                <p class=\"body-small\">Add gallery images. These will be displayed at the top of your organisation page.</p>\r\n                <div layout=\"row\" class=\"md-row-sm\" layout-wrap ng-show=\"organisation.gallery.length > 0\">\r\n                    <div ng-repeat=\"image in organisation.gallery\" class=\"md-col-sm m-b-15\">\r\n                        <div class=\"avatar-square-cover avatar-lg\" style=\"background-image:url({{image.url}}?size=logo-md)\"></div>\r\n                    </div>\r\n                </div>\r\n                <md-button class=\"md-raised md-flat md-accent md-cornered md-md m-0\" ng-click=\"editGallery($event)\">Edit Gallery</md-button>\r\n            </div>\r\n\r\n            <div id=\"links\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Other Links</div>\r\n                <p class=\"body-small\">Add links to your website and other social-media accounts.</p>\r\n                <social-links show-edit=\"false\" edit=\"true\" data=\"organisation.socialLinks\" type=\"organisation\"></social-links>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n<!--\r\n    <div ng-if=\"userPermissions.isMin(\'admin\')\">\r\n        <md-divider class=\"m-v-60\"></md-divider>\r\n        <h2 class=\"md-display-1\">Danger Zone</h2>\r\n        <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n            <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n                <div class=\"text-subtitle-thin\">Tread carefully. It\'s a jungle out there.</div>\r\n            </div>\r\n            <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n                <div id=\"delete\" class=\"card-z1 card-padding m-b-30\">\r\n                    <div class=\"md-subhead\" flex>Delete Organisation</div>\r\n                    <p class=\"body-small m-b-15\">Once you delete a organisation, there is no going back. Please be certain..</p>\r\n                    <md-button class=\"md-warn md-raised md-cornered m-0 md-flat md-md\" confirm ng-click=\"deleteOrganisation()\">Delete Organisation</md-button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n-->\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/organisation-settings/tpls/organisation-settings-tags.html', '<form name=\"forms.tagsForm\" novalidate>\r\n    <h2 class=\"md-display-1\">Organisation Tags</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Tags allow your organisation to be classified and easily found. Add as many accurate tags as you can.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"fields\" class=\"card-z1 card-padding m-b-30\">\r\n                <div layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Fields Tags</div>\r\n                </div>\r\n                <p class=\"body-small\">Add related field tags. These should describe the areas this organisation operates in.</p>\r\n                <field-search data=\"organisation.fields\" focus=\"focusField\" ng-mouseenter=\"focusField=true\" ng-mouseleave=\"focusField=false\" placeholder=\"Add field tags\"></field-search>\r\n                <tags ng-if=\"organisation.fields.length>0\" edit=\"true\" size=\"xs\" tags=\"organisation.fields\" type=\"field\"></tags>\r\n            </div>\r\n            <div id=\"organisations\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Related Organisations</div>\r\n                <p class=\"body-small\">Does this organisation have branches or parent/child relationships with other organisations?</p>\r\n                <organisation-groups edit=\"true\" organisations=\"organisation.organisations\"></organisation-groups>\r\n            </div>\r\n            <div id=\"location\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Organisation Location</div>\r\n                <p class=\"body-small\">Where is this organisation based? This will display it on the <a class=\"text-green\" ui-sref=\"app.map({\'type\':\'organisation\'})\" target=\"_blank\">organisation map</a>.</p>\r\n                <location-search data=\"organisation.location\" single=\"true\" placeholder=\"Location\"></location-search>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/organisation-settings/tpls/organisation-settings-team.html', '<div ng-if=\"!userPermissions.isMin(\'admin\')\" class=\"border-box-white p-60 text-center\">\r\n    <div class=\"text-subtitle-thin\">You must be an Admin to change team settings.</div>\r\n</div>\r\n\r\n<form ng-if=\"userPermissions.isMin(\'admin\')\" name=\"forms.permissionsForm\" novalidate>\r\n    <h2 class=\"md-display-1\">Team & Permissions</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Invite other team members to help administer this organisation.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"team\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Add team members</div>\r\n                <users-permissions-edit users=\"organisation.team\" user-permissions=\"userPermissions\" parent=\"organisation\" type=\"organisation\"></users-permissions-edit>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/organisation-settings/tpls/organisation-settings.html', '<div class=\"organisationSettingsView rel-box\">\r\n    <!-- Bread Crumbs -->\r\n    <div class=\"md-subhead m-b-30\">\r\n        <a ui-sref=\"app.organisation.overview\" class=\"text-green\">{{organisation.name}}</a>\r\n        <span> / Settings</span>\r\n    </div>\r\n    <div layout=\"row\" layout-align=\"start center\">\r\n        <h1 flex class=\"md-display-2 m-b-30\">Organisation Settings</h1>\r\n        <save-button button-class=\"m-r-0 md-raised md-flat md-border-green\" save-fn=\"saveOrganisation()\" entity=\"organisation\">Save</save-button>\r\n    </div>\r\n    <div class=\"text-tabs tabs-light-grey text-tabs-top m-t-40 m-b-30\" layout=\"row\">\r\n        <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n    </div>\r\n    <div flex ui-view class=\"m-b-60\"></div>\r\n</div>\r\n\r\n<dynamic-footer>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container md-no-padding\" layout=\"row\">\r\n            <div flex></div>\r\n            <md-button ui-sref=\"app.organisation.overview\" class=\"md-grey md-border md-cornered m-r-0\">Back</md-button>\r\n            <save-button button-class=\"m-r-0 md-raised md-flat md-border-green\" save-fn=\"saveOrganisation()\" entity=\"organisation\">Save</save-button>\r\n        </div>\r\n    </div>\r\n</dynamic-footer>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/organisation.html', '<div class=\"organisationView\">\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container\">\r\n            <div ng-hide=\"$state.includes(\'app.organisation.settings\')\">\r\n                <!-- Bread Crumbs -->\r\n                <div class=\"md-subhead m-b-20 disable-when-edit\">\r\n                    <a ui-sref=\"app.browse.organisations\" class=\"text-green\">Organisations</a>\r\n                    <span ng-if=\"!$state.is(\'app.organisation.overview\')\">\r\n                        <span> / </span>\r\n                        <a ui-sref=\"app.organisation.overview\" class=\"text-green\">{{organisation.name}}</a>\r\n                    </span>\r\n                    <span> / {{$state.current.data.name || organisation.name}}</span>\r\n                </div>\r\n\r\n                <div layout=\"column\" layout-align=\"center center\" class=\"m-t-30\">\r\n                    <div ng-show=\"organisation.logo.url\" class=\"avatar-square-contain avatar-lg\" style=\"background-image:url({{organisation.logo.url}}?size=logo-md)\" lightbox=\"true\" lightbox-image=\"organisation.logo.url\"></div>\r\n                    <h1 class=\"md-display-1 text-center m-t-20 m-b-10\">\r\n                        {{organisation.name}}\r\n                    </h1>\r\n\r\n                    <a ng-hide=\"showEdit\" class=\"text-green\" authenticate click-request-ownership parent-type=\"organisation\" parent-id=\"{{organisation._id}}\">Request Ownership</a>\r\n                    <div layout=\"row\" layout-align=\"center center\" class=\"m-b-60 m-t-30\">\r\n                        <stat-button type=\"follow\" parent-type=\"organisation\" parent-id=\"{{organisation._id}}\" count=\"data.followers\" class=\"lg m-r-30\"></stat-button>\r\n                        <social-share-buttons style=\"margin-top: 3px;\"></social-share-buttons>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"text-tabs m-b-30\" layout=\"row\">\r\n                    <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.parent || tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n                    <div flex></div>\r\n                    <a ng-show=\"userPermissions.isMin(\'collaborator\')\" class=\"md-subhead\" ui-sref=\"app.organisation.settings.overview\">Settings</a>\r\n                </div>\r\n            </div>\r\n\r\n            <ui-view class=\"m-b-60\"></ui-view>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-about.html', '');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-alumni.html', '<user-rows sort=\"\'numProjects\'\" criteria=\"{\'profile.profileDetails.education.organisations\' : organisation._id}\"></user-rows>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-applications.html', '<!--<application-rows size=\"12\" parent-type=\"organisation\" parent-id=\"{{organisation._id}}\" class=\"m-b-60\" query=\"jobQuery\"></application-rows>-->\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-blogs.html', '<div class=\"well m-b-30\" layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\">\r\n    <p flex>Got some news? Post a project update or blog related to <b>{{organisation.name}}</b></p>\r\n    <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md\" ng-click=\"newThread($event, \'blog\')\">Add a blog / update</md-button>\r\n</div>\r\n<card-feed parent-id=\"{{organisation._id}}\" parent-type=\"organisation\" type=\"blogs\" size=\"12\"></card-feed>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-contributors.html', '<tip-banner local=\"true\" style=\"margin-bottom: 15px;\">\r\n    This organisation has <b>{{numContributorsString}}.</b> These are people that have contributed to a <b>project</b>, <b>blog</b> or <b>discussion</b>.\r\n</tip-banner>\r\n<contributors parent-type=\"organisation\" parent-id=\"{{organisation._id}}\"></contributors>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-followers.html', '<tip-banner local=\"true\" style=\"margin-bottom: 15px;\">\r\n    Followers will be notified when this organisation adds a new <b>project</b>, <b>blog</b> or <b>discussion</b>.\r\n</tip-banner>\r\n<stat-display parent-id=\"{{organisation._id}}\" parent-type=\"organisation\" type=\"follow\"></stat-display>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-forum.html', '<!--\r\n<div class=\"md-row\" layout=\"row\">\r\n    <div hide-sm class=\"md-col\" style=\"width: 300px\">\r\n        <div class=\"anim-fade m-b-30\">\r\n            <div class=\"well\" layout=\"column\">\r\n                <div class=\"text-lightgrey m-b-15\">\r\n                    Want to find jobs in a specific location?\r\n                </div>\r\n                <md-button class=\"md-accent md-raised md-flat md-cornered md-md m-0\" ui-sref=\"app.map({type: \'job\'})\">Explore job map</md-button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div flex class=\"md-col rel-box\" layout=\"column\">\r\n        <forum type=\"discussions\" parent-type=\"organisation\" parent-id=\"{{organisation._id}}\"></forum>\r\n    </div>\r\n</div>-->\r\n\r\n<div class=\"well m-b-30\" layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\">\r\n    <p flex>Got something to say? Post in the <b>{{organisation.name}}</b> forum.</p>\r\n    <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md\" ng-click=\"newThread($event, \'question\')\">Add a question or discussion</md-button>\r\n</div>\r\n<forum type=\"discussions\" parent-type=\"organisation\" parent-id=\"{{organisation._id}}\"></forum>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-jobs.html', '<div ng-if=\"showEdit\" class=\"well m-b-30\" layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\">\r\n    <p flex>As an administrator of <b>{{organisation.name}}</b>, you advertise job openings for free!</p>\r\n    <md-button class=\"md-accent md-raised md-flat md-cornered md-md\" ng-click=\"newJob($event)\">Create a job listing</md-button>\r\n</div>\r\n<job-rows size=\"12\" parent-type=\"organisation\" parent-id=\"{{organisation._id}}\" class=\"m-b-60\" query=\"jobQuery\"></job-rows>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-overview.html', '<div layout=\"row\" class=\"md-row\">\r\n    <div flex class=\"md-col\">\r\n        <preview-gallery class=\"m-b-30\" gallery=\"organisation.gallery\"></preview-gallery>\r\n        <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>About</div>\r\n        </div>\r\n        <div class=\"m-b-30\">\r\n            <div class=\"angular-medium-editor rel-box m-b-30\" style=\"min-height: 50px\" ng-show=\"organisation.blurb.length > 5\">\r\n                <div ng-bind-html=\"organisation.blurb\"></div>\r\n            </div>\r\n<!--            <p style=\"white-space: pre-wrap;\">{{organisation.blurb}}</p>-->\r\n            <p ng-show=\"organisation.location[0]\">\r\n                <span>Location:</span>\r\n                <a go-to-map location=\"organisation.location[0].geo\" location-type=\"organisation\" class=\"text-green\">{{organisation.location[0].name}}</a>\r\n            </p>\r\n        </div>\r\n\r\n        <div class=\"line-divider-bottom m-b-30\" layout=\"row\">\r\n            <div class=\"md-subhead\" flex>Recent Projects</div>\r\n            <a class=\"md-subhead text-green\" ui-sref=\"app.organisation.projects\">See All</a>\r\n        </div>\r\n        <div class=\"m-b-30\">\r\n            <div layout=\"row\" layout-align=\"start center\" style=\"margin: 0px -10px;\" layout-wrap>\r\n                <creation-card flex=\"33\" flex-md=\"50\" flex-sm=\"100\" style=\"padding: 0 10px 10px;\" ng-repeat=\"project in projects | orderBy : \'-picture\' | limitTo : 3\" entity=\"project.data\"></creation-card>\r\n                <div ng-show=\"projects.length==0\" class=\"text-lightgrey\" style=\"padding: 0 10px\">No projects yet. <a ng-click=\"newProject($event)\" class=\"text-green\">Add one.</a></div>\r\n            </div>\r\n        </div>\r\n\r\n        <div ng-show=\"organisation.organisations.length > 0\" class=\"m-b-30\">\r\n            <div class=\"line-divider-bottom m-b-30\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Related Organisations</div>\r\n            </div>\r\n            <organisation-groups organisations=\"organisation.organisations\" view-layout=\"tile\"></organisation-groups>\r\n        </div>\r\n\r\n        <div ng-show=\"organisation.fields.length > 0\" class=\"m-b-30\">\r\n            <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Related Fields</div>\r\n            </div>\r\n            <div class=\"m-b-30\">\r\n                <tags edit=\"false\" size=\"xs\" tags=\"organisation.fields\" type=\"field\"></tags>\r\n            </div>\r\n        </div>\r\n\r\n        <div ng-show=\"organisation.team.length > 0\">\r\n            <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n                <div class=\"md-subhead\" flex>Team Members</div>\r\n            </div>\r\n            <user-row class=\"md-col\" flex=\"100\" flex-sm=\"100\" ng-repeat=\"user in organisation.team\" data=\"user\" type=\"user\"></user-row>\r\n            <div ng-hide=\"userCanEdit\"><span class=\"text-lightgrey m-t-15\">Are you part of this organisation?</span> <a authenticate click-request-ownership parent-type=\"organisation\" parent-id=\"{{organisation._id}}\" class=\"text-green\">Request an invite</a></div>\r\n        </div>\r\n    </div>\r\n\r\n    <div hide-sm hide-md class=\"md-col feed-widgets\" layout=\"column\">\r\n<!--\r\n        <div class=\"md-subhead m-b-10\">Questions</div>\r\n        <feed-widget-timeline type=\"discussions\" parent-type=\"organisation\" parent-id=\"{{organisation._id}}\" parent=\"organisation\" show-edit=\"showEdit\"></feed-widget-timeline>\r\n        <div class=\"md-subhead m-b-10 m-t-15\">Updates</div>\r\n        <feed-widget-timeline type=\"blogs\"       parent-type=\"organisation\" parent-id=\"{{organisation._id}}\" parent=\"organisation\" show-edit=\"showEdit\"></feed-widget-timeline>\r\n\r\n-->\r\n        <div class=\"md-subhead m-b-10 m-t-15\">External Links</div>\r\n        <div class=\"border-box-white p-15\">\r\n            <social-links class=\"social-buttons\" show-edit=\"false\" edit=\"false\" data=\"organisation.socialLinks\" type=\"organisation\"></social-links>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-people.html', '<div class=\"text-tabs m-b-30\" layout=\"row\">\r\n    <a class=\"md-subhead\" ui-sref-active=\"active\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n</div>\r\n<ui-view></ui-view>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/organisation/tpls/organisation-projects.html', '\r\n<div class=\"well m-b-30\" layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\">\r\n    <p flex>Have a project related to <b>{{organisation.name}}</b>?</p>\r\n    <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md\" ng-click=\"newProject($event)\">Create project</md-button>\r\n</div>\r\n<card-feed parent-id=\"{{organisation._id}}\" parent-type=\"organisation\" type=\"projects\" size=\"12\"></card-feed>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/partners/partners.html', '<bannerheader colour=\"[\'#7332cb\', \'#00ff80\']\">\r\n    <h1>STEMN Partners</h1>\r\n</bannerheader>\r\n\r\n<md-container class=\"static-page\">\r\n\r\n	<div class=\"partnerRow\" layout=\"row\" ng-repeat=\"partner in partners\">\r\n		<a href=\"{{partner.url}}\"><img src=\"/assets/images/partners/{{partner.image}}\" alt=\"{{partner.name}} Logo\"></a>\r\n		<div flex href=\"{{partner.url}}\">\r\n			<div layout-sm=\"column\" layout=\"row\">\r\n				<a class=\"md-headline\" href=\"{{partner.url}}\">{{partner.name}}</a>\r\n				<div flex></div>\r\n				<div>\r\n					<social-links type=\"organisation\" data=\"partner.links\"></social-links>\r\n				</div>\r\n			</div>\r\n			<p>{{partner.desc}}</p>\r\n		</div>\r\n	</div>\r\n\r\n	<div class=\"text-lightgrey\">\r\n		Believe in our mission and want to become a partner? <br>\r\n		Email us at <a class=\"underlined\" href=\"mailto:partnerships@stemn.com\">partnerships@stemn.com</a>\r\n	</div>\r\n\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/password-reset/password-reset.html', '<form unsaved-warning-form novalidate name=\"UpdatePasswordForm\">\r\n\r\n    <div layout=\"column\" layout-align=\"center center\" style=\"min-height: 100vh\">\r\n        <div layout=\"column\">\r\n            <h1 class=\"md-display-1\" style=\"margin-bottom: 40px;\">Set your new password</h1>\r\n            <md-input-container class=\"md-accent\">\r\n                <label>New Password</label>\r\n                <input name=\"newpassword\" ng-model=\"password.newPassword\"\r\n                required type=\"password\" minlength=\"7\">\r\n                <div ng-messages=\"UpdatePasswordForm.newpassword.$error\" ng-if=\"UpdatePasswordForm.newpassword.$dirty\">\r\n                    <div ng-message=\"required\">This is required.</div>\r\n                    <div ng-message=\"pattern\">Sorry, that field name is invalid. You can\'t use the characters: / \\ [ ]</div>\r\n                    <div ng-message=\"minlength\">Bit short... 7 character minimum</div>\r\n                    <div ng-message=\"maxlength\">Wow! too long...</div>\r\n                </div>\r\n            </md-input-container>\r\n            <md-input-container class=\"md-accent\">\r\n                <label>Confirm new Password</label>\r\n                <input name=\"confirmPassword\" ng-model=\"password.confirmPassword\"\r\n                required type=\"password\" minlength=\"7\">\r\n                <div ng-messages=\"UpdatePasswordForm.confirmPassword.$error\" ng-if=\"UpdatePasswordForm.confirmPassword.$dirty\">\r\n                    <div ng-message=\"required\">This is required.</div>\r\n                    <div ng-message=\"pattern\">Sorry, that field name is invalid. You can\'t use the characters: / \\ [ ]</div>\r\n                    <div ng-message=\"minlength\">Bit short... 7 character minimum</div>\r\n                    <div ng-message=\"maxlength\">Wow! too long...</div>\r\n                </div>\r\n            </md-input-container>\r\n\r\n            <md-button type=\"submit\" class=\"md-raised md-accent no-margin\" ng-disabled=\"UpdatePasswordForm.$invalid\" ng-click=\"updatePassword()\" style=\"margin-top: 40px !important;\">\r\n                Update password\r\n            </md-button>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/preview/preview.html', '<div class=\"previewView\" style=\"width: 100vw; height: 100vh\" layout=\"column\">\r\n\r\n    <!-- Toolbar -->\r\n    <div class=\"toolbar p-h-15\" layout=\"row\" layout-align=\"start center\">\r\n        <div ng-hide=\"previewer.edit\" layout=\"row\" class=\"h-100\" layout-align=\"start center\">\r\n            <div class=\"text-subtitle-thin ellipsis\">\r\n                <file-bread-crumbs hide-sm bread-crumbs=\"breadCrumbs\" project=\"project\" show-project-name=\"true\"></file-bread-crumbs>\r\n                <div hide-gt-sm>{{fileMeta.name}}</div>\r\n            </div>\r\n        </div>\r\n        <div ng-if=\"previewer.edit\">\r\n            <span hide-sm class=\"text-subtitle-thin text-black\">Editing:</span>\r\n            <span hide-sm class=\"text-subtitle-thin\">{{project.name}}/{{fileMeta.path}}</span>\r\n            <div hide-gt-sm>{{fileMeta.name}}</div>\r\n        </div>\r\n        <div flex></div>\r\n        <div ng-if=\"previewer.edit\">\r\n            <save-button save-fn=\"saveFile()\" entity=\"previewer\">Save</save-button>\r\n            <md-button hide-sm ng-click=\"saveAndExit()\" class=\"md-raised md-border-green md-accent md-flat md-cornered p-h-15\">{{savePending ? \'Saving...\' : \'Save & Exit\'}}</md-button>\r\n        </div>\r\n        <div ng-hide=\"previewer.edit\" layout=\"row\" layout-align=\"start center\">\r\n            <md-button class=\"md-icon-button\" aria-label=\"more\">\r\n                <md-icon md-svg-icon=\"navigation:more_horiz\"></md-icon>\r\n                <popup class=\"tooltip-menu\" popup-side=\"bottom\" popup-position=\"center\" popup-padding=\"11px0 0 0 0\" layout=\"column\">\r\n                    <a class=\"md-subhead\" target=\"_self\" ng-href=\"{{fileMeta.downloadUrl}}\" download=\"{{fileMeta.name}}\">Download</a>\r\n                    <a hide-gt-sm class=\"md-subhead\" ng-click=\"sidebar.show = !sidebar.show\">Toggle Sidebar</a>\r\n                    <a class=\"md-subhead\" ng-click=\"embed($event, fileMeta)\">Embed Preview</a>\r\n                    <a ng-if=\"userPermissions.isMin(\'collaborator\')\" class=\"md-subhead\" ui-sref=\"app.project.settings.team({stub: project.stub})\">Visability Settings</a>\r\n                </popup>\r\n            </md-button>\r\n            <md-button hide-sm class=\"md-icon-button\" aria-label=\"download\" target=\"_self\" ng-href=\"{{fileMeta.downloadUrl}}\" download=\"{{fileMeta.name}}\">\r\n                <md-icon md-svg-icon=\"file:file_download\"></md-icon>\r\n            </md-button>\r\n            <md-button ng-show=\"userPermissions.isMin(\'collaborator\') && previewer.type == \'code\'\" hide-gt-sm class=\"md-icon-button\" aria-label=\"edit\" ng-click=\"previewer.edit = !previewer.edit\">\r\n                <md-icon md-svg-icon=\"edit\"></md-icon>\r\n            </md-button>\r\n            <md-button ng-show=\"userPermissions.isMin(\'collaborator\') && previewer.type == \'code\'\" hide-sm class=\"md-accent md-border md-cornered\" ng-click=\"previewer.edit = !previewer.edit\">Edit</md-button>\r\n        </div>\r\n        <div class=\"divider-v-dark m-10 h-50\"></div>\r\n        <md-button class=\"md-icon-button\" ng-click=\"closePreview()\" aria-label=\"close\">\r\n            <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n        </md-button>\r\n    </div>\r\n    <div flex layout=\"row\" style=\"min-height: 0\">\r\n        <!-- Main Content -->\r\n        <div layout=\"column\" flex style=\"min-width: 0;\">\r\n<!--           <md-button ng-click=\"goFullscreen()\">Doit - {{fullscreen.active}}</md-button>-->\r\n            <md-content layout=\"column\" flex fullscreen=\"fullscreen.active\" only-watched-property>\r\n                <preview-files layout=\"column\" flex project=\"project\" file-meta=\"fileMeta\" previewer=\"previewer\"></preview-files>\r\n            </md-content>\r\n            <!-- Footer -->\r\n            <div class=\"footer-toolbar\" ng-hide=\"previewer.edit\">\r\n                <md-content class=\"h-100 p-h-15\" layout=\"row\" layout-align=\"start center\">\r\n                    <div hide-sm ng-hide=\"fileMeta.revisions.length<1\" layout=\"row\" layout-align=\"start center\" class=\"h-100\">\r\n                        <a class=\"st-icon-button active\">\r\n                            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Preview</md-tooltip>\r\n                            <md-icon md-svg-icon=\"compare-single\"></md-icon>\r\n                        </a>\r\n                        <span class=\"divider-v-dark m-10 h-50\"></span>\r\n                        <a class=\"st-icon-button\" ng-click=\"compare(\'sideBySide\')\">\r\n                            <md-tooltip md-direction=\"top\" md-autohide=\"true\">Compare Mode</md-tooltip>\r\n                            <md-icon md-svg-icon=\"compare-side\"></md-icon>\r\n                        </a>\r\n                    </div>\r\n\r\n                    <div flex>\r\n                        <div flex class=\"revision-dots text-center\" ng-show=\"fileMeta.revisions.length>1\">\r\n                            <span ng-repeat=\"revision in fileMeta.revisions\">\r\n                                <a class=\"revision-dot\" ng-class=\"{\'active\' : revision.rev == fileMeta.rev}\" ng-click=\"revisionChange(revision)\"></a>\r\n                                <popup class=\"tooltip-menu\" popup-side=\"top\" popup-position=\"center\" popup-padding=\"0 0 11px 0\" layout=\"column\">\r\n                                    <a class=\"md-subhead\">Version {{revision.revDecimal}} - {{revision.client_modified | amTimeAgo}}</a>\r\n                                </popup>\r\n                            </span>\r\n                        </div>\r\n                    </div>\r\n                    <div hide-sm ng-show=\"fileMeta.revDecimal\" class=\"md-subhead m-l-15\">Version: {{fileMeta.revDecimal}}</div>\r\n\r\n                </md-content>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Sidebar -->\r\n        <div layout=\"column\" class=\"sidebar\" ng-hide=\"previewer.edit || (!sidebar.show && $mdMedia(\'sm\'))\">\r\n            <md-content layout=\"column\" flex class=\"p-30 p-b-0\">\r\n                <div class=\"text-tabs m-b-30\" layout=\"row\">\r\n                    <div class=\"md-subhead active\">Meta</div>\r\n                </div>\r\n                <table class=\"st-meta-table\">\r\n                    <tr>\r\n                        <td>Name</td>\r\n                        <td>{{fileMeta.name}}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td>Project</td>\r\n                        <td>{{project.name}}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td>Size</td>\r\n                        <td>{{fileMeta.size | bytes}}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <td>Last modified</td>\r\n                        <td>{{fileMeta.client_modified | amCalendar}}</td>\r\n                    </tr>\r\n                    <tr ng-show=\"fileMeta.revisions\">\r\n                        <td>Revisions</td>\r\n                        <td>{{fileMeta.revisions.length}}</td>\r\n                    </tr>\r\n                </table>\r\n                <div ng-if=\"fileMeta.virtualChildren && previewer.instance.layers\">\r\n                    <div class=\"text-tabs m-b-15 m-t-30\" layout=\"row\">\r\n                        <div class=\"md-subhead active\">Child Layers</div>\r\n                    </div>\r\n                    <div ng-repeat=\"child in fileMeta.virtualChildren\">\r\n                        <div layout=\"row\" layout-align=\"start center\">\r\n                            <a flex ng-click=\"openFileFolder(child)\" layout=\"row\" layout-align=\"start center\">\r\n                                <file-thumbnail ending-url=\"child.endingUrl\" file-type=\"child.fileType\" thumb-link=\"child.thumbLink\"></file-thumbnail>\r\n                                {{child.name}}\r\n                            </a>\r\n                            <md-checkbox ng-model=\"child.enabled\" ng-click=\"toggleLayer(child)\" aria-label=\"toggle layer\"></md-checkbox>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div ng-if=\"fileMeta.virtualParent\">\r\n                    <div class=\"text-tabs m-b-15 m-t-30\" layout=\"row\">\r\n                        <div class=\"md-subhead active\">Parent Assembly</div>\r\n                    </div>\r\n                    <a ng-click=\"openFileFolder(fileMeta.virtualParent)\" layout=\"row\" layout-align=\"start center\">\r\n                        <file-thumbnail ending-url=\"fileMeta.virtualParent.endingUrl\" file-type=\"fileMeta.virtualParent.fileType\" thumb-link=\"fileMeta.virtualParent.thumbLink\"></file-thumbnail>\r\n                        {{fileMeta.virtualParent.name}}\r\n                    </a>\r\n                </div>\r\n\r\n                <div ng-show=\"timeline.length > 1\">\r\n                    <div class=\"text-tabs m-b-30 m-t-30\" layout=\"row\">\r\n                        <div class=\"md-subhead active\">Timeline</div>\r\n                    </div>\r\n                    <sync-timeline timeline=\"timeline\"></sync-timeline>\r\n                </div>\r\n            </md-content>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/privacy/privacy.html', '<bannerheader colour=\"[\'#cb325b\', \'#8959ba\']\">\r\n    <h1>Privacy Policy</h1>\r\n</bannerheader>\r\n<fat-tabs>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.terms\">Terms </a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.privacy\">Privacy</a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.security\">Security</a>\r\n</fat-tabs>\r\n<md-container class=\"static-page\">\r\n    <h2>General Information</h2>\r\n    <p>\r\n        We collect the e-mail addresses of those who communicate with us via e-mail, aggregate information on what pages consumers access or visit, and information volunteered by the consumer (such as survey information and/or site registrations). The information we collect is used to improve the content of our Web pages and the quality of our service, and is not shared with or sold to other organisations for commercial purposes, except to provide products or services you\'ve requested, when we have your permission, or under the following circumstances:\r\n    </p>\r\n    <ul>\r\n        <li>It is necessary to share information in order to investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of <a href=\"/terms\">Terms of Service</a>, or as otherwise required by law.</li>\r\n        <li>We transfer information about you if STEMN is acquired by or merged with another company. In this event, STEMN will notify you before information about you is transferred and becomes subject to a different privacy policy.</li>\r\n    </ul>\r\n    <h2>Information Gathering and Usage</h2>\r\n    <ul>\r\n        <li>When you register for STEMN we ask for information such as your name and email address. If you sign up through Facebook, Google, or LinkedIn you may be asked for additional information.</li>\r\n        <li>While browsing the site, we collect information for analytics purposes. This information describes how you use our site, some of which is personally identifiable.</li>\r\n        <li>STEMN uses collected information for the following general purposes: products and services provision, identification and authentication, services improvement, contact, and research.</li>\r\n    </ul>\r\n    <h2>Data Storage</h2>\r\n    <p>\r\n        STEMN uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run STEMN. Although STEMN owns the code, databases, and all rights to the STEMN application, you retain all rights to your data.\r\n    </p>\r\n    <h2>Disclosure</h2>\r\n    <p>\r\n        STEMN may disclose personally identifiable information under special circumstances, such as to comply with subpoenas or when your actions violate the <a class=\"text-green\" href=\"/terms\">Terms of Service</a>.\r\n    </p>\r\n    <h2>Changes</h2>\r\n    <p>\r\n        STEMN may periodically update this policy. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your STEMN primary account holder account or by placing a prominent notice on our site.\r\n    </p>\r\n    <h2>Questions</h2>\r\n    <p>\r\n        Any questions about this Privacy Policy should be addressed to <a class=\"text-green\" href=\"mailto:sue@stemn.com\">sue@stemn.com</a>.\r\n    </p>\r\n    <br><br>\r\n    <small class=\"pull-right\">Last Updated: 11 March 2015</small>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-files/tpls/project-files.html', '<div layout=\"row\" layout-align=\"center\" class=\"ProjectFilesView m-b-15\">\r\n    <div class=\"rel-box md-content-container md-no-padding\">\r\n\r\n        <!-- If Project is linked but user is not -->\r\n        <div ng-show=\"showEdit && ((project.remote.provider == \'dropbox\' && !currentUser.accounts.dropbox.id) || (project.remote.provider == \'drive\' && !currentUser.accounts.google.refreshToken))\" class=\"border-box-white p-30 m-b-30 text-center\">\r\n            <div class=\"md-title m-b-15\">Connect your {{project.remote.provider == \'dropbox\' ? \'Dropbox\' : \'Drive\'}}</div>\r\n            <div class=\"text-subtitle-thin m-v-30\">In order to access these files you must connect your dropbox to STEMN.</div>\r\n            <md-button ng-show=\"project.remote.provider == \'dropbox\'\" class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : currentUser.accounts.dropbox.id }\" layout=\"row\" layout-align=\"start center\" ng-click=\"syncAuthorize(\'dropbox\')\">\r\n                <md-icon md-svg-icon=\"dropbox\"></md-icon>\r\n                {{currentUser.accounts.dropbox.id ? \'Connected to Dropbox\' : \'Connect to Dropbox\'}}\r\n            </md-button>\r\n            <md-button ng-show=\"project.remote.provider == \'drive\'\" class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : currentUser.accounts.google.refreshToken }\" layout=\"row\" layout-align=\"start center\" ng-click=\"syncAuthorize(\'google\')\">\r\n                <md-icon md-svg-icon=\"drive\"></md-icon>\r\n                {{currentUser.accounts.google.refreshToken ? \'Connected to Drive\' : \'Connect to Drive\'}}\r\n            </md-button>\r\n        </div>\r\n\r\n        <div ng-if=\"!project.remote.connected\">\r\n            <div ng-show=\"showEdit\" class=\"border-box-white text-center p-30\">\r\n                <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row\">\r\n                    <div class=\"md-col-lg m-v-30\" flex>\r\n                        <div class=\"md-title m-b-15\">Step 1: Connect Dropbox or Drive</div>\r\n                        <div class=\"text-subtitle-thin m-v-30\">Connect this project to your Dropbox or Google Drive. This will be used to sync your files so you can use STEMN\'s collaborative tools.</div>\r\n                        <md-button class=\"md-accent md-border md-cornered m-l-0 md-flat md-sm\" ng-class=\"{\'md-raised\' : project.remote.provider == \'dropbox\'}\" layout=\"row\" layout-align=\"start center\" ng-click=\"remoteLink($event, \'dropbox\')\">\r\n                            <md-icon md-svg-icon=\"dropbox\"></md-icon>\r\n                            {{project.remote.provider == \'dropbox\' ? \'Connected to Dropbox\' : \'Connect to Dropbox\'}}\r\n                        </md-button>\r\n                        <md-button class=\"md-accent md-border md-cornered m-l-0 md-flat md-sm\" ng-class=\"{\'md-raised\' : project.remote.provider == \'drive\'}\" layout=\"row\" layout-align=\"start center\" ng-click=\"remoteLink($event, \'drive\')\">\r\n                            <md-icon md-svg-icon=\"drive\"></md-icon>\r\n                            {{project.remote.provider == \'drive\' ? \'Connected to Drive\' : \'Connect to Drive\'}}\r\n                        </md-button>\r\n                    </div>\r\n                    <div class=\"md-col-lg m-v-30\" flex>\r\n                        <div class=\"md-title m-b-15\">Step 2: Upload files</div>\r\n                        <div class=\"text-subtitle-thin m-v-30\">A folder for this project will automatically appear in your dropbox or drive. Add files to that folder and they\'ll show up here.</div>\r\n                        <div layout=\"row\" layout-align=\"center center\" layout-wrap class=\"fileTypeDemo\">\r\n                            <img src=\"/assets/images/vectors/filetype/dxf.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/dwg.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/pdf.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/tex.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/xlsx.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/js.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/cpp.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/csv.svg\">\r\n                            <img src=\"/assets/images/vectors/filetype/more.svg\">\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Empty Message -->\r\n        <div ng-if=\"project.remote.connected && (showEdit && files.length < 2 && path == \'\')\" class=\"border-box-white text-center p-30 m-b-30 rel-box\">\r\n            <div class=\"md-title m-b-30\">Upload your files</div>\r\n            <div class=\"text-subtitle-thin\">A folder has been created for this project in your {{project.remote.provider}}.</div>\r\n            <div class=\"text-subtitle-thin m-b-30\">Add files to this folder and they will appear below.</div>\r\n            <div class=\"text-subtitle-thin m-b-30\">\r\n                <a ng-click=\"refreshList()\" class=\"text-green\">Refresh Folder</a>&nbsp;or&nbsp;<a ui-sref=\"app.project.settings.sync\" class=\"text-green\">Change Sync Settings</a>\r\n            </div>\r\n            <div layout=\"row\" layout-align=\"center center\" layout-wrap class=\"fileTypeDemo\">\r\n                <img src=\"/assets/images/vectors/filetype/dxf.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/dwg.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/pdf.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/tex.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/xlsx.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/js.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/cpp.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/csv.svg\">\r\n                <img src=\"/assets/images/vectors/filetype/more.svg\">\r\n            </div>\r\n            <loading-overlay ng-if=\"loading\"></loading-overlay>\r\n        </div>\r\n\r\n        <div ng-if=\"project.remote.connected && !(showEdit && files.length < 1 && path == \'\')\" class=\"file-explorer m-b-60\">\r\n            <div layout=\"row\">\r\n                <!-- Bread Crumbs -->\r\n                <div class=\"md-subhead m-b-20\" flex>\r\n                    <file-bread-crumbs bread-crumbs=\"breadCrumbs\" project=\"project\"></file-bread-crumbs>\r\n                    <span ng-show=\"searchActive\">\r\n                        <span class=\"interpunct\"></span>\r\n                        <input focus-me=\"{{searchActive}}\" type=\"text\" class=\"editable\" style=\"width: 200px; text-transform: uppercase; display: inline;\" placeholder=\"Search query\" ng-model=\"searchString\" ng-change=\"search(searchString)\">\r\n                    </span>\r\n                </div>\r\n                <div>\r\n                    <a ng-click=\"toggleSearch()\">\r\n                        <md-icon ng-hide=\"searchActive\" md-svg-icon=\"search\"></md-icon>\r\n                        <md-icon ng-show=\"searchActive\" md-svg-icon=\"navigation:close\"></md-icon>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <!-- Table -->\r\n            <div class=\"files-table border-box-white rel-box m-b-30 p-h-10\">\r\n                <table class=\"md-table\" ng-if=\"searchActive\">\r\n                    <thead>\r\n                        <tr>\r\n                            <td style=\"width: 40px;\"></td>\r\n                            <td>Name</td>\r\n                            <td style=\"width: 100px;\">Modified</td>\r\n                            <td style=\"width: 60px;\">Size</td>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr ng-repeat=\"item in matches\">\r\n                            <td>\r\n                               <file-thumbnail ending-url=\"item.endingUrl\" file-type=\"item.fileType\" thumb-link=\"item.thumbLink\"></file-thumbnail>\r\n                            </td>\r\n                            <td>\r\n                                <a class=\"text-green\" ng-click=\"openFileFolder(item)\" ng-bind-html=\"item.name | typeaheadHighlightMatch : searchString\"></a>\r\n                            </td>\r\n                            <td>{{item.client_modified | amTimeAgo}}</td>\r\n                            <td>{{item.size | bytes}}</td>\r\n                        </tr>\r\n                        <tr ng-hide=\"matches.length > 0\">\r\n                            <td colspan=\"4\">\r\n                                <div class=\"text-grey\" ng-show=\"searchString.length > 0\">\r\n                                    <span>No results. </span>\r\n                                    <a ng-hide=\"path == \'\'\" class=\"text-green\" ui-sref=\"app.project.files({path: \'\'})\">Search root folder.</a>\r\n                                </div>\r\n                                <div class=\"text-grey\" ng-hide=\"searchString.length > 0\">\r\n                                    Search this folder by file name or file type.\r\n                                </div>\r\n                            </td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n\r\n                <table class=\"md-table\" ng-if=\"!searchActive\">\r\n                    <thead>\r\n                        <tr>\r\n                            <td style=\"width: 40px;\"></td>\r\n                            <td>Name</td>\r\n                            <td></td>\r\n                            <td style=\"width: 100px;\"></td>\r\n                            <td style=\"width: 60px;\">Size</td>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr ng-repeat=\"item in files\">\r\n                            <td>\r\n                                <file-thumbnail ending-url=\"item.endingUrl\" file-type=\"item.fileType\" thumb-link=\"item.thumbLink\"></file-thumbnail>\r\n                            </td>\r\n                            <td>\r\n                                <a class=\"text-green\" ng-click=\"openFileFolder(item)\">{{item.name}}</a>\r\n                            </td>\r\n                            <td class=\"text-right\" style=\"padding-right: 10px; padding-right: 10pxl\">\r\n                                <span class=\"label label-green label-md\" style=\"margin-right: 10px;\" ng-show=\"item[\'.tag\'] == \'virtual\'\">Assembly File</span>\r\n                                <dot ng-show=\"item.previewType != \'other\'\" class=\"green\">\r\n                                    <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Preview In Browser</md-tooltip>\r\n                                </dot>\r\n                            </td>\r\n                            <td>{{item.client_modified | amTimeAgo}}</td>\r\n                            <td>{{item.size | bytes}}</td>\r\n                        </tr>\r\n                        <tr ng-hide=\"files.length > 0\">\r\n                            <td colspan=\"4\">\r\n                                <div class=\"text-grey\">Empty Folder.</div>\r\n                            </td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n            </div>\r\n\r\n            <div class=\"anim-fade\" ng-show=\"readme.body && !searchActive\">\r\n                <div class=\"m-b-15\" layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Readme.md</div>\r\n                    <a ng-show=\"showEdit\" ui-sref=\"app.preview({projectStub: project.stub, path: readme.path, edit: true})\"><md-icon class=\"s-20 text-lightgrey\" md-svg-icon=\"edit\"></md-icon></a>\r\n                </div>\r\n                <div class=\"files-table border-box-white p-30 angular-medium-editor rel-box\" style=\"min-height: 112px\">\r\n                    <file-readme project=\"project\" files=\"files\" readme=\"readme\"></file-readme>\r\n                </div>\r\n            </div>\r\n\r\n            <div ng-show=\"showEdit && !readme.body && !searchActive\">\r\n                <div class=\"text-lightgrey text-center\">Add a readme.md file to this folder to help others understand what is inside.</div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-settings/tpls/project-settings-options.html', '<form name=\"forms.generalForm\" novalidate>\r\n    <h2 class=\"md-display-1\">General Details</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Basic display details such as project name and blurb. Remember to set a blurb if you want to open-source your project.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"name\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Project Name</div>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Name</label>\r\n                    <input name=\"name\" ng-model=\"project.name\"\r\n                    required type=\"text\">\r\n                    <div ng-messages=\"forms.generalForm.name.$error\" ng-if=\"forms.generalForm.name.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                    </div>\r\n                </md-input-container>\r\n            </div>\r\n\r\n            <div id=\"banner\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Banner Image</div>\r\n                <p class=\"body-small\">The banner image will be featured on the main page of your project.</p>\r\n                <div ng-show=\"project.banner\" layout=\"row\">\r\n                    <upload-image flex class=\"block\" name=\"FeaturedImage\" image=\"project.banner\" ng-model=\"project.banner\" direct=\"true\" icon=\"project.banner\">\r\n                        <img ng-src=\"{{project.banner || \'\'}}?size=featured-md&crop=true\">\r\n                    </upload-image>\r\n                    <div flex></div>\r\n                </div>\r\n                <div ng-hide=\"project.banner\">\r\n                    <md-button class=\"md-raised md-flat md-accent md-cornered md-md m-0\" click-upload-image image=\"project.banner\" ng-model=\"project.banner\" name=\"FeaturedImage\">Select Image</md-button>\r\n                </div>\r\n            </div>\r\n\r\n            <div id=\"summary\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Project Summary</div>\r\n                <div class=\"angular-medium-editor\" medium-editor name=\"blurb\" ng-model=\"project.summary\" editor-type=\"text\" style=\"min-height: 100px;\" placeholder=\"What is this project investigating? Your project summary should be simple yet specific.\"></div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div ng-if=\"userPermissions.isMin(\'admin\')\">\r\n        <md-divider class=\"m-v-60\"></md-divider>\r\n        <h2 class=\"md-display-1\">Danger Zone</h2>\r\n        <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n            <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n                <div class=\"text-subtitle-thin\">Tread carefully. It\'s a jungle out there.</div>\r\n            </div>\r\n            <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n                <div id=\"delete\" class=\"card-z1 card-padding m-b-30\">\r\n                    <div class=\"md-subhead\" flex>Delete Project</div>\r\n                    <p class=\"body-small m-b-15\">Once you delete a project, there is no going back. Please be certain..</p>\r\n                    <md-button class=\"md-warn md-raised md-cornered m-0 md-flat md-md\" confirm ng-click=\"deleteProject()\">Delete Project</md-button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-settings/tpls/project-settings-sections.html', '<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div flex layout=\"column\" class=\"md-col m-b-60\">\r\n        <modular-editor id=\"contentEdit\" editor-sections=\"project.sectionData\" editor-options=\"editorOptions\" edit=\"true\"></modular-editor>\r\n    </div>\r\n\r\n    <div class=\"md-col sidebar\">\r\n        <div class=\"border-box-white text-lightgrey p-15\">\r\n            <p>Describe the details of your project here. We recommend you follow the scientific method.</p>\r\n            <ul>\r\n                <li>Aim</li>\r\n                <li>Method</li>\r\n                <li>Results</li>\r\n                <li>Conclusion</li>\r\n            </ul>\r\n            <p>Consider adding multimedia to fully describe your process. This section supports:</p>\r\n            <ul>\r\n                <li>Code</li>\r\n                <li>Images/Video</li>\r\n                <li>Equations</li>\r\n                <li>Files</li>\r\n            </ul>\r\n            <p>If you want to create a compelling project that gets you hired, <a class=\"text-green\" target=\"_blank\" ui-sref=\"app.thread({stub: \'how-to-create-a-compelling-project-that-gets-you-hired\'})\">read this blog</a>.</p>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-settings/tpls/project-settings-sync.html', '<div ng-if=\"!userPermissions.isMin(\'admin\')\" class=\"border-box-white p-60 text-center\">\r\n    <div class=\"text-subtitle-thin\">You must be an Admin to change sync settings.</div>\r\n</div>\r\n\r\n<div ng-if=\"userPermissions.isMin(\'admin\')\">\r\n    <h2 class=\"md-display-1\">Sync Settings</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\" >\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Sync this project with your Dropbox or Google Drive.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div ng-if=\"userPermissions.isMin(\'admin\')\">\r\n                <div class=\"card-z1 card-padding m-b-30\">\r\n                    <div class=\"md-subhead\" flex>Dropbox and Drive Sync</div>\r\n                    <p class=\"body-small m-b-15\">Connect a Dropbox or Drive to sync all project files. Only one Google Drive or one Dropbox can be connected to a project.</p>\r\n                    <table class=\"st-meta-table m-b-15\" ng-show=\"project.remote.connected && ownerInfo.data\">\r\n                        <tr>\r\n                            <td class=\"capitalise\">{{project.remote.provider}} Account</td>\r\n                            <td>{{ownerInfo.data.given_name}} {{ownerInfo.data.family_name}} - {{ownerInfo.data.email}}</td>\r\n                        </tr>\r\n                        <tr>\r\n                            <td>Folder Path</td>\r\n                            <td>{{ownerInfo.data.given_name}}\'s <span class=\"capitalise\">{{project.remote.provider}}</span>/{{project.remote.root.path}}</td>\r\n                        </tr>\r\n                    </table>\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-flat md-sm\" ng-class=\"{\'md-raised\' : project.remote.provider == \'dropbox\'}\" layout=\"row\" layout-align=\"start center\" ng-click=\"remoteLink($event, \'dropbox\')\">\r\n                        <md-icon md-svg-icon=\"dropbox\"></md-icon>\r\n                        {{project.remote.provider == \'dropbox\' ? \'Change Dropbox Path\' : \'Connect to Dropbox\'}}\r\n                    </md-button>\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-flat md-sm\" ng-class=\"{\'md-raised\' : project.remote.provider == \'drive\'}\" layout=\"row\" layout-align=\"start center\"   ng-click=\"remoteLink($event, \'drive\')\">\r\n                        <md-icon md-svg-icon=\"drive\"></md-icon>\r\n                        {{project.remote.provider == \'drive\' ? \'Change Drive Path\' : \'Connect to Drive\'}}\r\n                    </md-button>\r\n                    <loading-overlay ng-if=\"ownerInfo.loading\"></loading-overlay>\r\n                </div>\r\n\r\n                <div class=\"card-z1 card-padding m-b-30\" ng-show=\"project.remote.connected\">\r\n                    <div class=\"md-subhead\" flex>Unlink {{project.remote.provider == \'dropbox\' ? \'Dropbox\' : \'Google Drive\'}}</div>\r\n                    <p class=\"body-small m-b-15\">This will stop STEMN syncing files from your {{project.remote.provider == \'dropbox\' ? \'Dropbox\' : \'Google Drive\'}}.</p>\r\n                    <md-button ng-click=\"remoteUnlink(project.remote.provider)\" class=\"md-raised md-flat md-warn md-md md-cornered m-l-0\">Unlink {{project.remote.provider == \'dropbox\' ? \'Dropbox\' : \'Google Drive\'}}</md-button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-settings/tpls/project-settings-tags.html', '<form name=\"forms.tagsForm\" novalidate>\r\n    <h2 class=\"md-display-1\">Project Tags</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Tags allow your project to be classified and easily found. Add as many accurate tags as you can.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"fields\" class=\"card-z1 card-padding m-b-30\">\r\n                <div layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Fields Tags</div>\r\n                    <div class=\"notes\">5 Required</div>\r\n                </div>\r\n                <p class=\"body-small\">Add related field tags. These should describe the project and any skills and technologies demonstrated.</p>\r\n                <field-search data=\"project.fields\" focus=\"focusField\" ng-mouseenter=\"focusField=true\" ng-mouseleave=\"focusField=false\" placeholder=\"Add field tags\"></field-search>\r\n                <tags ng-if=\"project.fields.length>0\" edit=\"true\" size=\"xs\" tags=\"project.fields\" type=\"field\"></tags>\r\n            </div>\r\n            <div id=\"organisations\" class=\"card-z1 card-padding m-b-30\">\r\n                <div layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Organisation Tags</div>\r\n                </div>\r\n                <p class=\"body-small\">Tag any organisations associated with this project. This can be a university, company or research institution.</p>\r\n                <organisation-search data=\"project.organisations\" focus=\"focusOrg\" ng-mouseenter=\"focusOrg=true\" ng-mouseleave=\"focusOrg=false\" placeholder=\"Add organisations\"></organisation-search>\r\n                <tags ng-if=\"project.organisations.length>0\" edit=\"true\" size=\"xs\" tags=\"project.organisations\" type=\"organisation\"></tags>\r\n            </div>\r\n            <div id=\"location\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Project Location</div>\r\n                <p class=\"body-small\">Where is this project based? This will display it on the <a class=\"text-green\" ui-sref=\"app.map\" target=\"_blank\">project map</a>.</p>\r\n                <location-search data=\"project.location\" single=\"true\" placeholder=\"Location\"></location-search>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-settings/tpls/project-settings-team.html', '<div ng-if=\"!userPermissions.isMin(\'admin\')\" class=\"border-box-white p-60 text-center\">\r\n    <div class=\"text-subtitle-thin\">You must be an Admin to change team settings.</div>\r\n</div>\r\n\r\n<form ng-if=\"userPermissions.isMin(\'admin\')\" name=\"forms.permissionsForm\" novalidate>\r\n    <h2 class=\"md-display-1\">Team & Collaborators</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Invite your collaborators. If you\'ve connected your project with Dropbox, your team members will be invited to edit.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"team\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-15\" flex>Add team members</div>\r\n                <users-permissions-edit users=\"project.team\" user-permissions=\"userPermissions\" parent=\"project\"></users-permissions-edit>\r\n\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <md-divider class=\"m-v-60\"></md-divider>\r\n\r\n    <h2 class=\"md-display-1\">Permissions</h2>\r\n    <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n        <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n            <div class=\"text-subtitle-thin\">Select an appropriate project type and license. A public project with creative commons license is recommended.</div>\r\n        </div>\r\n        <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n            <div id=\"projectType\"  class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead m-b-20\" flex>Project Type</div>\r\n                <project-type-radios></project-type-radios>\r\n            </div>\r\n            <div id=\"link\" class=\"card-z1 card-padding m-b-30\" ng-show=\"project.permissions.projectType == \'private\'\">\r\n                <div class=\"md-subhead\" flex>Private Link</div>\r\n                <p class=\"body-small\">Only team members and people with the private link can view. If you create a new private link, the old link will stop working.</p>\r\n                <div class=\"select-on-click-box m-b-15\" select-on-click>\r\n                    {{secretUrl}}\r\n                    <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Click to highlight URL</md-tooltip>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <md-button ng-click=\"newSecretUrl()\" class=\"md-accent md-raised md-flat md-cornered md-md m-l-0\">Create new link</md-button>\r\n                </div>\r\n            </div>\r\n            <div id=\"license\" ng-show=\"project.permissions.projectType == \'public\'\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Copyright License</div>\r\n                <p class=\"body-small\">Protect your work by selecting an appropriate license.</p>\r\n                <project-licenses></project-licenses>\r\n            </div>\r\n            <div id=\"publish\" class=\"card-z1 card-padding m-b-30\" ng-show=\"project.permissions.projectType == \'public\' && !project.published\">\r\n                <div class=\"md-subhead\" flex>Publish Project</div>\r\n                <p class=\"body-small\">Your project will not be publicly available until it is published.</p>\r\n                <md-button ng-click=\"publish($event)\" class=\"md-accent md-raised md-flat md-cornered md-md m-l-0\">Publish Project</md-button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-settings/tpls/project-settings.html', '<div class=\"projectSettingsView\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"rel-box md-content-container\">\r\n        <!-- Bread Crumbs -->\r\n        <div class=\"md-subhead m-b-30\">\r\n            <a ui-sref=\"app.project.overview\" class=\"text-green\">{{project.name}}</a>\r\n            <span> / Settings</span>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"start center\">\r\n            <h1 flex class=\"md-display-2 m-b-30\">Project Settings</h1>\r\n            <save-button button-class=\"m-r-0 md-raised md-flat md-border-green\" save-fn=\"saveProject()\" entity=\"project\">Save</save-button>\r\n        </div>\r\n        <div class=\"text-tabs tabs-light-grey text-tabs-top m-t-40 m-b-30\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\" ng-hide=\"tab.isHidden()\">{{tab.label}}</a>\r\n        </div>\r\n        <div flex ui-view class=\"m-b-60\"></div>\r\n    </div>\r\n</div>\r\n\r\n<!--<missing-fields ng-hide=\"!publishAttempted\" entity=\"project\" required-fields=\"requiredFields\" form=\"forms.main\"></missing-fields>-->\r\n\r\n<dynamic-footer>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container md-no-padding\" layout=\"row\">\r\n            <div flex></div>\r\n            <md-button ng-click=\"backToProject();\" class=\"md-grey md-border md-cornered m-r-0\">Back</md-button>\r\n            <save-button button-class=\"m-r-0 md-raised md-flat md-border-green\" save-fn=\"saveProject()\" entity=\"project\">Save</save-button>\r\n        </div>\r\n    </div>\r\n</dynamic-footer>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-threads/tpls/project-threads.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"rel-box md-content-container md-no-padding\">\r\n        <div class=\"well m-b-30\" layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\">\r\n            <p flex>Got something to say? Post in the <b>{{project.name}}</b> forum.</p>\r\n            <md-button authenticate class=\"md-accent md-raised md-flat md-cornered md-md\" ng-click=\"newThread($event, \'question\')\">New thread</md-button>\r\n        </div>\r\n        <forum class=\"block w-100\" type=\"threads\" parent-type=\"project\" parent-id=\"{{project._id}}\" query=\"query\"></forum>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/project-wiki/tpls/project-wiki.html', '<!--\r\n<div layout=\"row\" layout-align=\"center\" class=\"m-b-15\">\r\n    <div class=\"rel-box md-content-container md-no-padding\">\r\n        <div class=\"border-box-white p-30 text-center\">\r\n            <div class=\"md-headline\">Welcome to the wiki!</div>\r\n            Wikis provide a place in your repository to lay out the roadmap of your project, show the current status, and document software better, together.\r\n            <md-button class=\"md-accent md-raised md-flat md-cornered\">Create the first page</md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n-->\r\n<toc-nav sections=\"toc.content\"></toc-nav>\r\n<div toc-content=\"toc.content\" toc-refresh=\"true\" toc-prepend=\"toc.prepend\" toc-append=\"toc.append\" >\r\n    <modular-editor class=\"m-b-60 m-t-30\" editor-sections=\"project.sectionData\" editor-options=\"editorOptions\" edit=\"false\"></modular-editor>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/tpls/project-blog.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"rel-box md-content-container md-no-padding\">\r\n        <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n            <div flex layout=\"column\" class=\"md-col\">\r\n                <feed type=\"blogs\" parent-type=\"project\" parent-id=\"{{project._id}}\" parent=\"project\" show-edit=\"showEdit\" contained=\"false\"></feed>\r\n            </div>\r\n            <div class=\"md-col sidebar\" layout=\"column\">\r\n<!--\r\n                <div class=\"md-subhead m-b-10\">Updates</div>\r\n                <feed-widget-timeline type=\"blogs\" parent-type=\"project\" parent-id=\"{{project._id}}\" parent=\"project\" show-edit=\"showEdit\"></feed-widget-timeline>\r\n-->\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/tpls/project-overview.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"rel-box md-content-container md-no-padding\">\r\n        <div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n            <!-- TABLE OF CONTENTS NAV -->\r\n            <toc-nav sections=\"toc.content\"></toc-nav>\r\n\r\n            <div flex layout=\"column\" class=\"md-col\">\r\n\r\n                <div ng-if=\"project.banner\" class=\"border-box m-b-30\">\r\n                    <a class=\"featured-image bg-img-cover\"\r\n                    blur-load-bg bg-src=\"{{project.banner}}?size=featured-md\"\r\n                    lightbox=\"true\" lightbox-image=\"project.banner\"></a>\r\n                </div>\r\n\r\n                <div ng-show=\"project.fields.length > 0\" class=\"m-b-30\">\r\n                    <div class=\"md-subhead m-v-10\">Fields</div>\r\n                    <tags tags=\"project.fields\" type=\"field\" edit=\"false\" size=\"sm\"></tags>\r\n                </div>\r\n\r\n                <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Summary</div>\r\n                    <a ng-show=\"showEdit\" ui-sref=\"app.project.settings.options({\'#\':\'summary\'})\"><md-icon class=\"s-20 text-lightgrey\" md-svg-icon=\"edit\"></md-icon></a>\r\n                </div>\r\n                <div class=\"angular-medium-editor rel-box m-b-30\" style=\"min-height: 50px\" ng-show=\"project.summary.length > 5\">\r\n                    <div ng-bind-html=\"project.summary\"></div>\r\n                </div>\r\n                <div ng-show=\"project.summary.length <= 5 && showEdit\" class=\"text-subtitle-thin m-b-30\">\r\n                    You have no project summary.\r\n                </div>\r\n<!--\r\n                <div ng-show=\"readme\">\r\n                    <div class=\"line-divider-bottom m-b-15 m-t-30\" layout=\"row\">\r\n                        <div class=\"md-subhead\" flex>Readme.md</div>\r\n                        <a class=\"text-green\"  ui-sref=\"app.preview({projectStub: project.stub, path: \'readme.md\', edit: true})\">Edit</a>\r\n                    </div>\r\n                    <div class=\"angular-medium-editor rel-box\" style=\"min-height: 112px\">\r\n                        <file-readme project=\"project\" path=\"readme.md\" readme=\"readme\"></file-readme>\r\n                    </div>\r\n                </div>\r\n-->\r\n                <div ng-if=\"isSectionContent()\">\r\n                    <div class=\"line-divider-bottom m-b-20 \" layout=\"row\">\r\n                        <div flex class=\"md-subhead\">Project Details</div>\r\n                        <a ng-show=\"showEdit\" ui-sref=\"app.project.settings.sections\"><md-icon class=\"s-20 text-lightgrey\" md-svg-icon=\"edit\"></md-icon></a>\r\n                    </div>\r\n                    <div toc-content=\"toc.content\" toc-refresh=\"true\" toc-prepend=\"toc.prepend\" toc-append=\"toc.append\">\r\n                        <modular-editor editor-sections=\"project.sectionData\" editor-options=\"editorOptions\" edit=\"false\"></modular-editor>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n\r\n            <div class=\"md-col sidebar\">\r\n                <div layout=\"column\">\r\n                    <div class=\"border-box-white p-15 m-b-30\" ng-if=\"project.remote.connected\"><sync-list-widget project=\"project\" path=\"\"></sync-list-widget></div>\r\n                    <div class=\"border-box-white p-15 m-b-30\">\r\n                        <table class=\"st-meta-table\">\r\n                            <tr>\r\n                                <td>Updated</td>\r\n                                <td>{{project.updated | amTimeAgo}}</td>\r\n                            </tr>\r\n                            <tr>\r\n                                <td>Created</td>\r\n                                <td>{{project.created | amTimeAgo}}</td>\r\n                            </tr>\r\n                            <tr ng-show=\"project.location[0].name\">\r\n                                <td>Location</td>\r\n                                <td>\r\n                                    <a go-to-map location=\"project.location[0].geo\">\r\n                                        {{project.location[0].name}}\r\n                                    </a>\r\n                               </td>\r\n                            </tr>\r\n                            <tr ng-hide=\"project.permissions.projectType == \'private\'\">\r\n                                <td>License</td>\r\n                                <td>\r\n                                    <a ng-if=\"license.url\" ng-href=\"{{license.url}}\" target=\"_blank\">{{license.name}}</a>\r\n                                </td>\r\n                            </tr>\r\n                        </table>\r\n                    </div>\r\n                    <div class=\"md-subhead m-b-10\">Threads</div>\r\n                    <feed-widget-timeline type=\"all\" parent-type=\"project\" parent-id=\"{{project._id}}\" parent=\"project\" show-edit=\"showEdit\" style=\"margin-bottom: 60px;\"></feed-widget-timeline>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/tpls/project-thumbs.html', '<div class=\"project-thumbs\" layout=\"row\">\r\n    <a ng-repeat=\"image in images | limitTo: 4\" flex=\"25\" lightbox=\"true\" lightbox-image=\"image\" lightbox-images=\"images\">\r\n        <img ng-src=\"{{image.image.url}}?size=thumb-lg&crop=true\" alt=\"\">\r\n<!--       <blur-load bg-src=\"{{image.image.url}}?size=thumb-lg&crop=true\" bg-width=\"{{section.image.width}}\" bg-max-width=\"300\"></blur-load>-->\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/project/tpls/project.html', '<dynamic-footer>\r\n    <div layout=\"row\" layout-align=\"center\" ng-if=\"project.permissions.projectType == \'private\'\">\r\n        <!-- PRIVATE FOOTER -->\r\n        <div ng-if=\"showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n            <div flex class=\"ellipsis text-lightgrey\"><b>Important:</b> This is a private project.</div>\r\n            <md-button class=\"md-grey md-border md-cornered\" ui-sref=\"app.project.settings.team({\'#\':\'projectType\'})\">Visibility</md-button>\r\n            <md-button class=\"md-accent md-border md-cornered m-0\" ui-sref=\"app.project.settings.options\">Settings</md-button>\r\n        </div>\r\n\r\n        <!-- PUBLISH FOOTER PUBLIC -->\r\n        <div ng-if=\"!project.published && !showEdit\" class=\"md-content-container md-no-padding\" layout=\"column\" layout-align=\"center\">\r\n            <div class=\"ellipsis text-lightgrey text-center\">You have been given a private link to this page. Only people with the link can see it.</div>\r\n        </div>\r\n    </div>\r\n    <div layout=\"row\" layout-align=\"center\" ng-if=\"project.permissions.projectType == \'public\'\">\r\n        <!-- PUBLIC FOOTER -->\r\n        <div ng-if=\"project.published && !showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n            <stat-button display-style=\"circle\" type=\"like\"   parent-type=\"{{project.type}}\" parent-id=\"{{project._id}}\" count=\"project.likes\" class=\"green\"></stat-button>\r\n            <a stat-display-modal               type=\"like\"   parent-type=\"{{project.type}}\" parent-id=\"{{project._id}}\" class=\"text-lightgrey count\">{{project.likes || 0}}</a>\r\n            <md-button class=\"md-icon-button md-sm m-0\" aria-label=\"comments\" scroll-highlight=\"reply\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Comment</md-tooltip>\r\n                <md-icon md-svg-icon=\"response\"></md-icon>\r\n            </md-button>\r\n            <a class=\"text-lightgrey count\" scroll-highlight=\"responses\">{{project.posts.length || 0}}</a>\r\n            <stat-button hide-sm entity-text=\"project\"  type=\"follow\" parent-type=\"{{project.type}}\" parent-id=\"{{project._id}}\" count=\"project.followers\" class=\"lg m-l-15\"></stat-button>\r\n            <div flex></div>\r\n            <social-share-buttons></social-share-buttons>\r\n        </div>\r\n\r\n        <!-- PRIVATE FOOTER -->\r\n        <div ng-if=\"project.published && showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n            <stat-button display-style=\"circle\" type=\"like\"   parent-type=\"{{project.type}}\" parent-id=\"{{project._id}}\" count=\"project.likes\" class=\"green\"></stat-button>\r\n            <a stat-display-modal               type=\"like\"   parent-type=\"{{project.type}}\" parent-id=\"{{project._id}}\" class=\"text-lightgrey count\">{{project.likes || 0}}</a>\r\n            <md-button class=\"md-icon-button md-sm m-0\" aria-label=\"comments\" scroll-highlight=\"reply\">\r\n                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Comment</md-tooltip>\r\n                <md-icon md-svg-icon=\"response\"></md-icon>\r\n            </md-button>\r\n            <a class=\"text-lightgrey count\" scroll-highlight=\"responses\">{{project.posts.length || 0}}</a>\r\n            <stat-button hide-sm entity-text=\"project\"  type=\"follow\" parent-type=\"{{project.type}}\" parent-id=\"{{project._id}}\" count=\"project.followers\" class=\"lg m-l-15\"></stat-button>\r\n            <div flex></div>\r\n            <md-button hide-sm class=\"md-accent md-border md-cornered\" ui-sref=\"app.project.settings.options\">Settings</md-button>\r\n            <social-share-buttons></social-share-buttons>\r\n        </div>\r\n\r\n        <!-- PUBLISH FOOTER -->\r\n        <div ng-if=\"!project.published && showEdit\" class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n            <div flex class=\"ellipsis text-lightgrey\"><b>Important:</b> This Project has not been published yet.</div>\r\n            <md-button class=\"md-accent md-border md-cornered\" ui-sref=\"app.project.settings.options\">Settings</md-button>\r\n            <md-button hide-sm class=\"md-raised md-accent md-flat md-border-green md-cornered m-0\" ui-sref=\"app.project.settings.team({\'#\':\'publish\'})\">Publish project</md-button>\r\n        </div>\r\n\r\n        <!-- PUBLISH FOOTER PUBLIC -->\r\n        <div ng-if=\"!project.published && !showEdit\" class=\"md-content-container md-no-padding\" layout=\"column\" layout-align=\"center\">\r\n            <div class=\"ellipsis text-lightgrey text-center\">You have been given a private link to this page. Only people with the link can see it.</div>\r\n        </div>\r\n    </div>\r\n</dynamic-footer>\r\n\r\n<div class=\"projectView overflow-x-box\">\r\n    <div ng-hide=\"$state.includes(\'app.project.settings\')\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"rel-box md-content-container md-no-padding\" layout=\"column\">\r\n                <settings-button show-if-admin>\r\n                    <feed-recommend></feed-recommend>\r\n                    <md-menu-item show-if-admin>Project id:\r\n                        <br>{{project._id}}\r\n                    </md-menu-item>\r\n                    <md-menu-item show-if-admin>\r\n                        <md-button click-unpublish entity=\"project\" save-fn=\"SaveProject()\">Unpublish</md-button>\r\n                    </md-menu-item>\r\n                </settings-button>\r\n                <div class=\"m-t-50\" layout=\"row\" layout-align=\"center center\">\r\n                    <div>\r\n                        <dot class=\"dot-lg green\"></dot>\r\n                        <md-tooltip md-direction=\"left\" md-autohide=\"true\">Updated in the last week</md-tooltip>\r\n                        <span class=\"md-subhead\">Active Project</span>\r\n                    </div>\r\n                    <div class=\"md-subhead\">&nbsp;|&nbsp;{{project.updated | date : short}}\r\n                        <md-tooltip md-direction=\"right\" md-autohide=\"true\"><span am-time-ago=\"project.updated\"></span></md-tooltip>\r\n                    </div>\r\n                </div>\r\n                <h1 id=\"entityTitle\" class=\"md-display-1 m-v-30 text-center\">{{project.name || \'No Title\'}}</h1>\r\n                <div class=\"team-text\" layout=\"column\" layout-align=\"center center\">\r\n                    <div class=\"m-b-10\">By<span team-text team=\"project.team\" limit=\"3\"></span></div>\r\n                    <div layout=\"row\">\r\n                        <a ng-show=\"showEdit\" class=\"p-2\" ui-sref=\"app.project.settings.tags({\'#\':\'organisations\'})\">\r\n                            <div class=\"avatar-square-contain st-dashed-button\" layout=\"column\" layout-align=\"center center\">+</div>\r\n                            <md-tooltip md-direction=\"left\" md-autohide=\"true\">Add Organisation</md-tooltip>\r\n                        </a>\r\n                        <organisation-images organisations=\"project.organisations\" limit=\"10\"></organisation-images>\r\n                        <div ng-if=\"project.organisations.length>0 || showEdit\" class=\"divider-v\"></div>\r\n                        <team-images team=\"project.team\" limit=\"10\" show-more=\"showTeam()\"></team-images>\r\n                        <a ng-show=\"showEdit\" class=\"p-2\" ui-sref=\"app.project.settings.team({\'#\':\'team\'})\">\r\n                            <div class=\"avatar-circle st-dashed-button\" layout=\"column\" layout-align=\"center center\">+</div>\r\n                            <md-tooltip md-direction=\"right\" md-autohide=\"true\">Add Team</md-tooltip>\r\n                        </a>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container md-no-padding\">\r\n                <div class=\"text-tabs m-b-30\" layout=\"row\">\r\n                    <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\" ng-hide=\"tab.isHidden();\">{{tab.label}}</a>\r\n                    <div flex></div>\r\n                    <a ng-show=\"showEdit\" class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(\'app.project.settings.options\')}\" ui-sref=\"app.project.settings.options\">Settings</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div ui-view></div>\r\n\r\n    <!-- Responses -->\r\n    <div ng-show=\"$state.is(\'app.project.overview\')\">\r\n<!--\r\n        <div class=\"replies\" id=\"responses\" ng-show=\"project.published\" layout=\"row\" layout-align=\"center\">\r\n            <div class=\"rel-box md-content-container md-no-padding\">\r\n                <div layout=\"row\" class=\"md-row\">\r\n                    <div flex layout=\"column\" class=\"md-col\">\r\n                        <posts parent=\"project\"></posts>\r\n                    </div>\r\n                    <div hide-sm hide-md class=\"md-col sidebar\" layout=\"column\"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n-->\r\n\r\n        <div class=\"related\" id=\"related\" ng-show=\"project.published\" layout=\"row\" layout-align=\"center\" hide-footer-when-visible>\r\n            <div class=\"rel-box md-content-container md-no-padding\">\r\n                <div layout=\"row\" class=\"md-row\">\r\n                    <div flex layout=\"column\" class=\"md-col\">\r\n                        <related parent-type=\"project\" parent-id=\"{{project._id}}\" type=\"project\" display-style=\"feed\"></related>\r\n                    </div>\r\n                    <div hide-sm hide-md class=\"md-col sidebar\" layout=\"column\"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/referrals/referrals.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\" layout=\"column\" layout-align=\"center\">\r\n        <h1 class=\"md-display-1 text-center m-t-50\">Referrals</h1>\r\n        <div class=\"md-title text-grey light-font text-center\">Refer your friends – Win awesome prizes!</div>\r\n        <a class=\"text-green text-center m-v-15\" show-explanation-modal=\"ambassador\">Become an ambassador</a>\r\n    </div>\r\n</div>\r\n\r\n\r\n<div class=\"infobar m-b-30 p-v-15 overflow-x-box\" layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container md-row text-center\" layout=\"column\" layout-gt-sm=\"row\">\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Win prizes</h2>\r\n            <p>Signup friends - get awesome prizes <br>including stickers and official t-shirts.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Accelerate science</h2>\r\n            <p>More people on STEMN means more<br>collaboration and knowledge sharing.</p>\r\n        </div>\r\n        <div flex=\"100\" flex-gt-sm=\"33\" class=\"md-col\" layout=\"column\">\r\n            <h2 class=\"md-title bold\">Become an ambassador</h2>\r\n            <p>Get paid $$$ for everyone you<br>signup at your company or university.</p>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container\">\r\n        <div layout=\"row\" class=\"md-row m-b-60\">\r\n\r\n            <div class=\"md-col\" flex>\r\n                <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Your Referral Code</div>\r\n                </div>\r\n                <div class=\"m-b-10 bold\">Get your friends to sign up with this unique URL:</div>\r\n                <div class=\"well well-select\" select-on-click>\r\n                    https://stemn.com?ref={{user.ref}}\r\n                    <md-tooltip md-direction=\"top\" md-autohide=\"true\">Click to highlight</md-tooltip>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"md-col\" style=\"width: 300px;\">\r\n                <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Social referrals</div>\r\n                </div>\r\n                <div class=\"m-b-10 bold\">Share to Social Networks:</div>\r\n                <social-share-buttons ref=\"{{user.ref}}\" root=\"true\" title=\"Sign up to STEMN\" summary=\"STEMN is probably the best Engineering Portfolio site out there. Apply for hundreds of jobs in just 1 click.\"></social-share-buttons>\r\n            </div>\r\n\r\n        </div>\r\n\r\n        <div layout=\"row\" class=\"md-row m-b-60\">\r\n\r\n            <div class=\"md-col rel-box\" flex>\r\n                <div class=\"line-divider-bottom\" layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Your Referrals</div>\r\n                    <div class=\"md-subhead\">Total: {{query.results[0].signups.length || 0}}</div>\r\n                </div>\r\n                <loading-overlay ng-if=\"query.loading\"></loading-overlay>\r\n                <table class=\"md-table\" ng-show=\"query.results[0].signups.length>=1\" style=\"min-height: 100px;\">\r\n                    <thead>\r\n                        <tr style=\"border-top: none;\">\r\n                            <td style=\"width: 40px;\"></td>\r\n                            <td>Name</td>\r\n                            <td style=\"width: 140px;\" class=\"text-center\">Signup</td>\r\n                            <td hide-sm style=\"width: 75px;\"></td>\r\n                        </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                        <tr ng-repeat=\"item in query.results[0].signups\">\r\n                            <td style=\"padding: 15px 20px 15px 5px;\">\r\n                                <a ui-sref=\"app.user.profile({stub:item.user.stub})\">\r\n                                    <div class=\"avatar-circle\" ng-style=\"{ \'background-image\':\'url(\'+(item.user.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\"></div>\r\n                                    <popup class=\"card-popup\" popup-side=\"bottom\" popup-position=\"center\">\r\n                                        <card card-type=\"user\" card-id=\"{{item.user._id}}\"></card>\r\n                                    </popup>\r\n                                </a>\r\n                            </td>\r\n                            <td>\r\n                                <a ui-sref=\"app.user.profile({stub:item.stub})\">\r\n                                    <div class=\"bold\">{{item.user.name}}</div>\r\n                                    <div>{{item.user.blurb | letters: 70}}</div>\r\n                                </a>\r\n                            </td>\r\n                            <td class=\"text-center\">\r\n                                {{item.timestamp | amTimeAgo}}\r\n                            </td>\r\n                            <td hide-sm>\r\n                                <hide-if-owner owner=\"{{item.user._id}}\">\r\n                                    <stat-button hide-stat=\"true\" size=\"sm\" type=\"follow\" parent-type=\"user\" parent-id=\"{{item.user._id}}\" count=\"item.user.followers\"></stat-button>\r\n                                </hide-if-owner>\r\n                            </td>\r\n                        </tr>\r\n                    </tbody>\r\n                </table>\r\n                <div class=\"text-no-results\" ng-hide=\"query.results[0].signups.length > 0\">\r\n                    You have no successful referrals yet.\r\n                </div>\r\n                <div ng-if=\"query.results[0].signups.length>=5\" class=\"m-t-15\">Email your <a href=\"mailto:swag@stemn.com.au\" class=\"text-green\">swag@stemn.com.au</a> to claim your prize.</div>\r\n            </div>\r\n\r\n            <div class=\"md-col\" style=\"width: 300px;\">\r\n                <div class=\"line-divider-bottom m-b-15\" layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Prizes</div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <div class=\"m-r-10\" style=\"width: 100px;\">\r\n                        <img class=\"w-100\" src=\"/assets/images/swag/stickers-mockup-edges-sm.jpg\" alt=\"STEMN Stickers\">\r\n                    </div>\r\n                    <div flex><b>Refer 5 friends</b> and we\'ll send you some STEMN stickers.</div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <div class=\"m-r-10\" style=\"width: 100px;\">\r\n                        <img class=\"w-100\" src=\"/assets/images/swag/white-shirt-sm.jpg\" alt=\"STEMN t-shirt\">\r\n                    </div>\r\n                    <div flex><b>Refer 10 friends</b> to receive an official STEMN t-shirt.</div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <div class=\"m-r-10\" style=\"width: 100px;\">\r\n                        <img class=\"w-100\" src=\"/assets/images/swag/blue-shirt-sm.jpg\" alt=\"STEMN t-shirt\">\r\n                    </div>\r\n                    <div flex><b>Refer 20 friends</b> to get another STEMN t-shirt. Keep it fresh. </div>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/scholarship/aerofutures.html', '<bannerheader colour=\"[\'#7332cb\', \'#00ff80\']\">\r\n    <h1>STEMN SGC Scholarship</h1>\r\n</bannerheader>\r\n<md-container class=\"static-page\">\r\n    <div class=\"section-title\">\r\n        <h3>Applications for Aerospace Futures delegates are now open.</h3>\r\n    </div>\r\n    <h3><strong>Attend Aerospace Futures 2015 for free</strong></h3>\r\n    <p>Aerospace Futures is an invaluable career experience for every budding aerospace engineer. STEMN wants to help one deserving delegate get there. </p>\r\n    <h3>What is the STEMN Futures Scholarship?</h3>\r\n\r\n    <h3>What is STEMN?</h3>\r\n    <p>STEMN is a project-based network for knowledge sharing and collaboration in the aerospace community. STEMN saves you valuable research time by centralising projects and teams on one platform. On STEMN you can:</p>\r\n    <ul>\r\n        <li>Find ideas and inspiration as you browse projects by subsystem, field or location.</li>\r\n        <li>Create your own beautiful project page in minutes.</li>\r\n        <li>Blog your progress and gain followers for your marketing or crowdfunding campaign.</li>\r\n        <li>Get your questions answered by experts in the community.</li>\r\n        <li>Build connections to launch your career in the space industry.</li>\r\n    </ul>\r\n    <p>Learn from the experience of the community. Don’t reinvent the wheel.</p>\r\n    <h3>The Must Haves:</h3>\r\n\r\n    <h3>The Nice to Haves:</h3>\r\n    <ul>\r\n        <li>Experience with Node.JS and&nbsp;AngularJS</li>\r\n        <li>Knowledge of storage systems such as MongoDB</li>\r\n        <li>History of full life cycle management of software projects, from inception to roll out</li>\r\n    </ul>\r\n    <p>Our development cycle is extremely fast; if you think you have what it takes, email your Github profile or previous project experience and resume to <strong>careers@stemn.com</strong>.</p>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/search/search.html', '<!--\r\n<md-container>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n            <br>{{resultsNum}} Results\r\n        </div>\r\n\r\n        <div class=\"col-md-9\">\r\n\r\n            <div class=\"filter-labels\">\r\n                <div class=\"filter-label\" ng-repeat=\"(filter, value) in query.check\">\r\n                    {{filter | capitaliseFirst}} : <span ng-repeat=\"(filterName, status) in value\" ng-show=\"status\">{{filterName}} </span>\r\n                    <a class=\"label-close\" ng-click=\"deleteFilterLabel(filter)\">×</a>\r\n                </div>\r\n                <div class=\"filter-label\" ng-repeat=\"(filter, value) in query.radio\">\r\n                    {{filter | capitaliseFirst}} : {{value}}\r\n                    <a class=\"label-close\" ng-click=\"deleteFilterLabel(filter)\">×</a>\r\n                </div>\r\n                   <div class=\"filter-label\" ng-repeat=\"(filter, value) in query.range\">\r\n                    {{filter | capitaliseFirst}} : {{value.min}} to {{value.max}}\r\n                    <a class=\"label-close\" ng-click=\"deleteFilterLabel(filter)\">×</a>\r\n                </div>\r\n                <button type=\"button\" class=\"btn\" ng-click=\"clearQuery()\">clear</button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-3\">\r\n            <div class=\"panel search-panel\">\r\n                <input type=\"search\" ng-model=\"query.filter.name\" class=\"form-control input-lg\" placeholder=\"Refine your search\">\r\n                <div class=\"search-icon vertical-center-parent\">\r\n                    <icon class=\"vertical-center-child fa-search\"></icon>\r\n                </div>\r\n            </div>\r\n            <accordion close-others=\"false\">\r\n                <accordion-group ng-repeat=\"filter in filtersOrder\" heading=\"{{filters[filter].title}}\" is-open=\"filters[filter].open\">\r\n                    <div ng-if=\"filters[filter].type == \'radio\'\">\r\n                        <div ng-repeat=\"item in filters[filter].items\">\r\n                            <label>\r\n                                <input type=\"radio\" name=\"{{filter}}\" ng-model=\"query.radio[filter]\" class=\"cbr\" value=\"{{item.label}}\">{{item.label}} ({{item.number}})\r\n                            </label>\r\n                        </div>\r\n                    </div>\r\n                    <div ng-if=\"filters[filter].type == \'checkbox\'\">\r\n                        <div ng-repeat=\"item in filters[filter].items\">\r\n                            <label>\r\n                                <input type=\"checkbox\" ng-model=\"query.check[filter][item.label]\" class=\"cbr\">{{item.label}} ({{item.number}})\r\n                            </label>\r\n                        </div>\r\n                    </div>\r\n                    <div ng-if=\"filters[filter].type == \'slider\'\">\r\n                        {{filters[filter].slider.max}}\r\n                        <div range-slider min=\"filters[filter].slider.min\" max=\"filters[filter].slider.max\" model-min=\"query.range[filter].min\" model-max=\"query.range[filter].max\" prefix=\"{{filters[filter].slider.prefix}}\" postfix=\"{{filters[filter].slider.postfix}}\" attach-handle-values=\"true\"></div>\r\n                    </div>\r\n                </accordion-group>\r\n            </accordion>\r\n        </div>\r\n        <div class=\"col-md-9\">\r\n\r\n            <table class=\"table\">\r\n                <thead>\r\n                    <tr>\r\n                        <th ng-click=\"query.orderBy.name = \'name\'; query.orderBy.down = !query.orderBy.down\">Details</th>\r\n                        <th ng-click=\"\">Interests</th>\r\n                        <th ng-click=\"\">Projects</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr ng-repeat=\"result in results\">\r\n                        <td>\r\n                            {{result.profile.firstname}}\r\n                            {{result.profile.lastname}}\r\n                            <br>\r\n                            {{result.numProjects}}\r\n                            {{result.followers}}\r\n                        </td>\r\n                        <td>\r\n                            <div ng-repeat=\"interest in result.profile.profileDetails.interests\">\r\n                                {{interest.text}}\r\n                            </div>\r\n                        </td>\r\n                        <td>\r\n                            <div ng-repeat=\"project in result.projects\">\r\n                                {{project}}\r\n                            </div>\r\n                        </td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n\r\n        </div>\r\n\r\n    </div>\r\n\r\n</md-container>\r\n-->\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/security/security.html', '<bannerheader colour=\"[\'#474747\', \'#037E20 \']\">\r\n    <h1>STEMN Security</h1>\r\n</bannerheader>\r\n<fat-tabs>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.terms\">Terms </a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.privacy\">Privacy</a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.security\">Security</a>\r\n</fat-tabs>\r\n<md-container class=\"static-page\">\r\n    <p>\r\n        We know your privacy is extremely important to you, and we\'re very protective of it.\r\n    </p>\r\n    <h3>Need to report a security vulnerability?</h3>\r\n    <p>\r\n        Please visit our <a href=\"/contact\" class=\"text-green\">contact page</a> and use the secure contact form to let us know.\r\n    </p>\r\n    <h3>Physical Security</h3>\r\n    <ul>\r\n        <li>Our servers are in an undisclosed location where no physical access is available.</li>\r\n    </ul>\r\n    <h3>System Security</h3>\r\n    <ul>\r\n        <li>System installation using hardened, patched OS.</li>\r\n        <li>Distributed Denial of Service (DDoS) mitigation services powered by industry-leading solutions.</li>\r\n    </ul>\r\n    <h3>Operational Security</h3>\r\n    <ul>\r\n        <li>Systems access logged and tracked for auditing purposes.</li>\r\n    </ul>\r\n    <h3>Communications</h3>\r\n    <p>\r\n        All data, public or private, exchanged with STEMN is always transmitted over SSL (which is why you see HTTPS and the padlock in your browser’s address bar).\r\n    </p>\r\n    <h3>File system and backups</h3>\r\n    <p>\r\n        Every piece of hardware we use has an identical copy ready and waiting for an immediate hot-swap in case of hardware or software failure. Every piece of data related to STEMN is saved on a minimum of three different servers, including an off-site backup. We do not retroactively remove data from backups when deleted by the user, as we may need to restore the data if it was removed accidentally.\r\n    </p>\r\n    <p>\r\n        We do not encrypt our data on disk because it would not be any more secure: the website and supporting data would need to be decrypted on demand, slowing down response times. Any user with shell access to the file system would have access to the decryption routine, thus negating any security it provides. Therefore, we focus on making our machines and network as secure as possible.\r\n    </p>\r\n    <h3>Maintaining security</h3>\r\n    <p>\r\n        All passwords are filtered from all our logs and are one-way encrypted in the database using <span class=\"code-red\">bcrypt</span>. Login information is always sent over SSL.\r\nAdd a comment to this line\r\n    </p>\r\n    <h3>Contact Us</h3>\r\n    <p>Have a question, concern, or comment about STEMN security? Please contact <a class=\"text-green\" href=\"mailto:security@stemn.com\">security@stemn.com</a>.</p>\r\n    <br>\r\n    <br>\r\n    <small class=\"pull-right\">Last Updated: 14 March 2015</small>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search-all.html', '<div class=\"results-block card-z1 m-b-15\" ng-show=\"results.field.length > 0\">\r\n    <a ui-sref=\"app.search.fields\"><div class=\"md-subhead m-b-15\">Fields <span class=\"pull-right text-green\">More</span></div></a>\r\n    <tags tags=\"results.field\" type=\"field\" size=\"sm\"></tags>\r\n</div>\r\n<div class=\"results-block card-z1 m-b-15\" ng-show=\"results.organisation.length > 0\">\r\n    <a ui-sref=\"app.search.organisations\"><div class=\"md-subhead m-b-15\">Organisations <span class=\"pull-right text-green\">More</span></div></a>\r\n    <row-view ng-repeat=\"result in results.organisation\" class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n</div>\r\n<div class=\"results-block card-z1 m-b-15\" ng-show=\"results.user.length > 0\">\r\n    <a ui-sref=\"app.search.users\"><div class=\"md-subhead m-b-15\">Users <span class=\"pull-right text-green\">More</span></div></a>\r\n    <row-view ng-repeat=\"result in results.user\" class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n</div>\r\n<div class=\"results-block card-z1 m-b-15\" ng-show=\"results.project.length > 0 || results.thread.length > 0\">\r\n    <a ui-sref=\"app.search.creations\"><div class=\"md-subhead m-b-15\">Creations <span class=\"pull-right text-green\">More</span></div></a>\r\n    <row-view ng-repeat=\"result in results.project\" class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n    <row-view ng-repeat=\"result in results.thread\"  class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n</div>\r\n<div class=\"results-block card-z1 m-b-15\" ng-show=\"results.job.length > 0\">\r\n    <a ui-sref=\"app.search.jobs\"><div class=\"md-subhead m-b-15\">Jobs <span class=\"pull-right text-green\">More</span></div></a>\r\n    <row-view ng-repeat=\"result in results.job\" class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search-creations.html', '<div class=\"results-block card-z1\" ng-show=\"results.thread.length > 0 || results.project.length > 0\">\r\n    <div class=\"md-subhead m-b-15\">Creations</div>\r\n    <row-view ng-repeat=\"result in results.thread\"  class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n    <row-view ng-repeat=\"result in results.project\" class=\"anim-repeat-slide sm\" data=\"result\"></row-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search-fields.html', '<div class=\"results-block card-z1\" ng-show=\"results.field.length > 0\">\r\n    <div class=\"md-subhead m-b-15\">Fields</div>\r\n    <row-view ng-repeat=\"result in results.field\" data=\"result\" class=\"anim-repeat-slide sm\"></row-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search-jobs.html', '<div class=\"results-block card-z1\" ng-show=\"results.job.length > 0\">\r\n    <div class=\"md-subhead m-b-15\">Jobs</div>\r\n    <row-view ng-repeat=\"result in results.job\" data=\"result\" class=\"anim-repeat-slide sm\"></row-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search-organisations.html', '<div class=\"results-block card-z1\" ng-show=\"results.organisation.length > 0\">\r\n    <div class=\"md-subhead m-b-15\">Organisations</div>\r\n    <row-view ng-repeat=\"result in results.organisation\" data=\"result\" class=\"anim-repeat-slide sm\"></row-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search-users.html', '<div class=\"results-block card-z1\" ng-show=\"results.user.length > 0\">\r\n    <div class=\"md-subhead m-b-15\">Users</div>\r\n    <row-view ng-repeat=\"result in results.user\" data=\"result\" type=\"user\" class=\"anim-repeat-slide sm\"></row-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/site-search/site-search.html', '<div layout=\"row\" layout-align=\"center start\" class=\"siteSearchView\">\r\n    <div layout=\"column\" class=\"md-content-container m-v-30\">\r\n        <div class=\"md-subhead m-b-15\">Search query:</div>\r\n        <input focus-me=\"true\" class=\"searchBox well capitalise\" placeholder=\"Search {{type}}\" type=\"search\" ng-model=\"query.string\" ng-change=\"searchQuery()\" ng-enter=\"scrollOnEnter()\">\r\n        <div class=\"text-tabs m-t-30 m-b-30\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n        </div>\r\n        <ui-view></ui-view>\r\n        <h3 ng-show=\"noMoreResults\" class=\"md-subhead\">No More Results</h3>\r\n        <div ng-show=\"!noMoreResults && query.string.length > 0 && type != \'all\'\" layout=\"row\" layout-align=\"center center\" style=\"margin-top:20px\">\r\n            <md-button class=\"md-circle md-accent md-raised md-sm\" ng-click=\"moreResults()\">\r\n                <md-icon md-svg-icon=\"add\"></md-icon>\r\n                <md-tooltip md-direction=\"bottom\" md-autohide=\"true\">Load more</md-tooltip>\r\n            </md-button>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/terms/terms.html', '<bannerheader colour=\"[\'#32cb79\', \'#deda63\']\">\r\n    <h1>Terms of Service</h1>\r\n</bannerheader>\r\n<fat-tabs>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.terms\">Terms </a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.privacy\">Privacy</a>\r\n    <a flex ui-sref-active=\"active\" ui-sref=\"app.security\">Security</a>\r\n</fat-tabs>\r\n<md-container class=\"static-page\">\r\n    <p>\r\n        <strong>\r\n        By using the stemn.com web site (\"Service\"), or any services of STEMN PTY. LTD. (\"STEMN\"), you are agreeing to be bound by the following terms and conditions (\"Terms of Service\").\r\n        </strong>\r\n    </p>\r\n    <br>\r\n    <br>\r\n    <p>\r\n        IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A COMPANY OR OTHER LEGAL ENTITY, YOU REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND SUCH ENTITY, ITS AFFILIATES AND ALL USERS WHO ACCESS OUR SERVICES THROUGH YOUR ACCOUNT TO THESE TERMS AND CONDITIONS, IN WHICH CASE THE TERMS \"YOU\" OR \"YOUR\" SHALL REFER TO SUCH ENTITY, ITS AFFILIATES AND USERS ASSOCIATED WITH IT. IF YOU DO NOT HAVE SUCH AUTHORITY, OR IF YOU DO NOT AGREE WITH THESE TERMS AND CONDITIONS, YOU MUST NOT ACCEPT THIS AGREEMENT AND MAY NOT USE THE SERVICES.\r\n    </p>\r\n    <p>\r\n        If STEMN makes material changes to these Terms, we will notify you by email or by posting a notice on our site before the changes are effective. Any new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service. Continued use of the Service after any such changes shall constitute your consent to such changes. You can review the most current version of the Terms of Service at any time at: <a class=\"text-green\" href=\"/terms\">https://stemn.com/terms</a>\r\n    </p>\r\n    <p>\r\n        Violation of any of the terms below will result in the termination of your Account. While STEMN prohibits such conduct and Content on the Service, you understand and agree that STEMN cannot be responsible for the Content posted on the Service and you nonetheless may be exposed to such materials. You agree to use the Service at your own risk.\r\n    </p>\r\n    <h2>A. Account Terms</h2>\r\n    <ol>\r\n        <li>You must be 13 years or older to use this Service.</li>\r\n        <li>You must be a human. Accounts registered by \"bots\" or other automated methods are not permitted.</li>\r\n        <li>You must provide your name, a valid email address, and any other information requested in order to complete the signup process.</li>\r\n        <li>You are responsible for maintaining the security of your account and password. STEMN cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</li>\r\n        <li>You are responsible for all Content posted and activity that occurs under your account.</li>\r\n        <li>You may not use the Service for any illegal or unauthorised purpose. You must not, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright or trademark laws).</li>\r\n    </ol>\r\n    <h2>B. Cancellation and Termination</h2>\r\n    <ol>\r\n        <li>You are solely responsible for properly cancelling your account. An email or phone request to cancel your account is not considered cancellation. You can cancel your account at any time from the user settings page.</li>\r\n        <li>All of your Content will be immediately deleted from the Service upon cancellation. This information can not be recovered once your account is cancelled.</li>\r\n        <li>STEMN, in its sole discretion, has the right to suspend or terminate your account and refuse any and all current or future use of the Service, or any other STEMN service, for any reason at any time. Such termination of the Service will result in the deactivation or deletion of your Account or your access to your Account, and the forfeiture and relinquishment of all Content in your Account. STEMN reserves the right to refuse service to anyone for any reason at any time.</li>\r\n        <li>In the event that STEMN takes action to suspend or terminate an account, we will make a reasonable effort to provide the affected account owner with a copy of their account contents upon request, unless the account was suspended or terminated due to unlawful conduct.</li>\r\n    </ol>\r\n    <h2>C. Modifications to the Service</h2>\r\n    <ol>\r\n        <li>STEMN reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.</li>\r\n        <li>STEMN shall not be liable to you or to any third-party for any modification, suspension or discontinuance of the Service.</li>\r\n    </ol>\r\n    <h2>D. Copyright and Content Ownership</h2>\r\n    <ol>\r\n        <li>We claim no intellectual property rights over the material you provide to the Service. Your profile and materials uploaded remain yours. However, this information will be made publically accessible which may, in some jurisdictions, affect your intellectual property rights.</li>\r\n        <li>It is your responsibility to properly license your content where applicable. STEMN can not be held liabile for incorrect implementation or ineffective content licenses.</li>\r\n        <li>STEMN does not pre-screen Content, but STEMN and its designee have the right (but not the obligation) in their sole discretion to refuse or remove any Content that is available via the Service.</li>\r\n        <li>You shall defend STEMN against any claim, demand, suit or proceeding made or brought against STEMN by a third-party alleging that Your Content, or Your use of the Service in violation of this Agreement, infringes or misappropriates the intellectual property rights of a third-party or violates applicable law, and shall indemnify STEMN for any damages finally awarded against, and for reasonable attorney’s fees incurred by, STEMN in connection with any such claim, demand, suit or proceeding; provided, that STEMN (a) promptly gives You written notice of the claim, demand, suit or proceeding; (b) gives You sole control of the defense and settlement of the claim, demand, suit or proceeding (provided that You may not settle any claim, demand, suit or proceeding unless the settlement unconditionally releases STEMN of all liability); and (c) provides to You all reasonable assistance, at Your expense.</li>\r\n        <li>The look and feel of the Service is copyright ©2015 STEMN PTY. LTD. All rights reserved. You may not duplicate, copy, or reuse any portion of the HTML/CSS, Javascript, or visual design elements or concepts without express written permission from STEMN.</li>\r\n    </ol>\r\n    <h2>E. General Conditions</h2>\r\n    <ol>\r\n        <li>Your use of the Service is at your sole risk. The service is provided on an \"as is\" and \"as available\" basis.</li>\r\n        <li>Support for STEMN services is only available in English, via email.</li>\r\n        <li>You understand that STEMN uses third-party vendors and hosting partners to provide the necessary hardware, software, networking, storage, and related technology required to run the Service.</li>\r\n        <li>You must not modify, adapt or hack the Service or modify another website so as to falsely imply that it is associated with the Service, STEMN, or any other STEMN service.</li>\r\n        <li>You give permissions for STEMN administrators to edit your content.</li>\r\n        <li>You may use the STEMN Pages static hosting service solely as permitted and intended to host your organisation pages, personal pages, or project pages, and for no other purpose. You may not use STEMN Pages in violation of STEMN\'s trademark or other rights or in violation of applicable law. STEMN reserves the right at all times to reclaim any STEMN subdomain without liability to you.</li>\r\n        <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without the express written permission by STEMN.</li>\r\n        <li>We may, but have no obligation to, remove Content and Accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party\'s intellectual property or these Terms of Service.</li>\r\n        <li>Verbal, physical, written or other abuse (including threats of abuse or retribution) of any STEMN customer, employee, member, or officer will result in immediate account termination.</li>\r\n        <li>You understand that the technical processing and transmission of the Service, including your Content, may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</li>\r\n        <li>You must not upload, post, host, or transmit unsolicited email, SMSs, or \"spam\" messages.</li>\r\n        <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>\r\n        <li>If your bandwidth usage significantly exceeds the average bandwidth usage (as determined solely by STEMN) of other STEMN customers, we reserve the right to immediately disable your account or throttle your file hosting until you can reduce your bandwidth consumption.</li>\r\n        <li>STEMN does not warrant that (i) the service will meet your specific requirements, (ii) the service will be uninterrupted, timely, secure, or error-free, (iii) the results that may be obtained from the use of the service will be accurate or reliable, (iv) the quality of any products, services, information, or other material purchased or obtained by you through the service will meet your expectations, and (v) any errors in the Service will be corrected.</li>\r\n        <li>You expressly understand and agree that STEMN shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses (even if STEMN has been advised of the possibility of such damages), resulting from: (i) the use or the inability to use the service; (ii) the cost of procurement of substitute goods and services resulting from any goods, data, information or services purchased or obtained or messages received or transactions entered into through or from the service; (iii) unauthorised access to or alteration of your transmissions or data; (iv) statements or conduct of any third-party on the service; (v) or any other matter relating to the service.</li>\r\n        <li>The failure of STEMN to exercise or enforce any right or provision of the Terms of Service shall not constitute a waiver of such right or provision. The Terms of Service constitutes the entire agreement between you and STEMN and govern your use of the Service, superseding any prior agreements between you and STEMN (including, but not limited to, any prior versions of the Terms of Service). You agree that these Terms of Service and Your use of the Service are governed under California law.</li>\r\n        <li>Questions about the Terms of Service should be sent to <a class=\"text-green\" href=\"mailto:sue@stemn.com\">sue@stemn.com</a>.</li>\r\n    </ol>\r\n    <br><br>\r\n    <small class=\"pull-right\">Last Updated: 20 April 2015</small>\r\n</md-container>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/test/test.html', '<div>\r\n\r\n	<form name=\"TestForm\">\r\n		<md-container>\r\n			<md-button ng-click=\"edit.enabled = !edit.enabled\">Toggle Edit - Status {{edit.enabled}}</md-button>\r\n			<realtime-editor-save-status></realtime-editor-save-status>\r\n		</md-container>\r\n<!--		<modular-editor editor-sections=\"sectionData\" editor-options=\"editorOptions\" edit=\"edit.enabled\"></modular-editor>-->\r\n		<modular-editor editor-sections=\"project.sectionData\" editor-options=\"editorOptions\" edit=\"edit.enabled\" realtime-editor entity-id=\"547db55af7f342380174e212\" entity-type=\"project\"></modular-editor>\r\n	</form>\r\n</div>\r\n\r\n\r\n\r\n<!--\r\n<md-container>\r\n	<div ng-repeat=\"post in posts\">\r\n		{{post._id}}\r\n		<post data=\"post\" parent=\"parent\"></post>\r\n	</div>\r\n</md-container>\r\n-->\r\n\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/test/test2.html', '<br>\r\n<br>\r\n<div ng-init=\"section = \'<p>This <a href=\\\'gooogle.com\\\'>Linky</a> is the test <mark class=\\\'math\\\'>x+2</mark> asf asf asff sa <mark class=\\\'math\\\'>\\\\cos \\\\theta + i \\\\sin \\\\theta</mark> and some more</p>\'\"></div>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n<div class=\"angular-medium-editor\" medium-editor ng-model=\"section\"></div>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n<div class=\"angular-medium-editor\" render-inline-mathjax render-mentions ng-bind-html=\"section\"></div>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n<br>\r\n{{section}}\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/thread/thread-edit/tpls/thread-edit.html', '<div layout=\"row\" layout-align=\"center\" class=\"m-b-60\">\r\n    <div class=\"md-content-container\">\r\n        <div class=\"rel-box\">\r\n            <form unsaved-warning-form novalidate name=\"forms.ThreadForm\">\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <div class=\"md-subhead\" flex>\r\n                        <a ui-sref=\"app.thread\" class=\"text-green\">{{thread.name | letters : 30}}</a>\r\n                        <span> / Edit Thread</span>\r\n                    </div>\r\n                </div>\r\n\r\n                <md-divider class=\"m-v-30\"></md-divider>\r\n\r\n                <!-- Title -->\r\n                <h1 id=\"nameEdit\" class=\"md-display-1\">\r\n                    <textarea msd-elastic rows=\"1\" class=\"editable\" ng-model=\"thread.name\" name=\"ThreadTitle\" type=\"text\" placeholder=\"Thread title\"></textarea>\r\n                </h1>\r\n\r\n                <md-divider class=\"m-v-30\"></md-divider>\r\n\r\n                <div ng-if=\"thread.banner\" class=\"border-box m-b-30\">\r\n                    <upload-image ng-show=\"thread.banner\" class=\"block\" name=\"FeaturedImage\" image=\"thread.banner\" ng-model=\"thread.banner\" direct=\"true\" icon=\"thread.banner\">\r\n                        <div class=\"featured-image bg-img-cover\" style=\"background-image: url(\'{{thread.banner}}?size=featured-md\')\"></div>\r\n                    </upload-image>\r\n                </div>\r\n\r\n                <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row\">\r\n                    <div flex class=\"md-col\">\r\n                        <modular-editor class=\"p-b-10\" editor-sections=\"thread.sectionData\" editor-options=\"editorOptions\" edit=\"true\" placeholder=\"Flesh out your thread here. Be sure to add images and code where you can.\"></modular-editor>\r\n                    </div>\r\n\r\n                    <div class=\"sidebar md-col\">\r\n                        <div class=\"m-b-15\" layout=\"column\" ng-if=\"!thread.banner\">\r\n                            <md-button class=\"md-raised md-flat md-accent md-cornered md-md m-0\" click-upload-image image=\"thread.banner\" ng-model=\"thread.banner\" name=\"FeaturedImage\">Add Featured Image</md-button>\r\n                        </div>\r\n                        <div class=\"border-box-white m-b-30\">\r\n                            <div class=\"md-subhead p-15\" style=\"padding-bottom: 5px;\">Thread Labels</div>\r\n                            <st-select-option ng-model=\"thread.labels\" active=\"item.active\" value=\"{{item.model}}\" ng-repeat=\"item in labels\" ng-style=\"item.active && {\'background-color\' : item.bgColor}\" ng-class=\"{\'active\': item.active}\">\r\n                                <span class=\"swatch\" style=\"background-color: {{item.color}}\"></span>\r\n                                {{item.label}}\r\n                            </st-select-option>\r\n                        </div>\r\n                        <div id=\"fieldTags\" class=\"border-box-white p-15 m-b-30\">\r\n                            <div class=\"md-subhead\">Related Tags</div>\r\n                            <project-search data=\"thread.projects\" focus=\"focusProject\" ng-mouseenter=\"focusProject=true\" ng-mouseleave=\"focusProject=false\"></project-search>\r\n                            <tags edit=\"true\" size=\"xs\" tags=\"thread.projects\" type=\"organisaion\"></tags>\r\n<!--                            <div class=\"md-subhead m-t-15\">Related Fields</div>-->\r\n                            <field-search data=\"thread.fields\" focus=\"focusField\" ng-mouseenter=\"focusField=true\" ng-mouseleave=\"focusField=false\"></field-search>\r\n                            <tags edit=\"true\" size=\"xs\" tags=\"thread.fields\" type=\"field\"></tags>\r\n<!--                            <div class=\"md-subhead m-t-15\">Related Organisations</div>-->\r\n                            <organisation-search data=\"thread.organisations\" focus=\"focusOrg\" ng-mouseenter=\"focusOrg=true\" ng-mouseleave=\"focusOrg=false\"></organisation-search>\r\n                            <tags edit=\"true\" size=\"xs\" tags=\"thread.organisations\" type=\"organisaion\"></tags>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<dynamic-footer>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container md-no-padding\" layout=\"row\" layout-align=\"start center\">\r\n            <md-button class=\"{{thread.closed ? \'md-warn md-border\' : \'md-warn md-raised\'}} md-flat md-cornered m-0\" ng-click=\"thread.closed = !thread.closed\">{{thread.closed ? \'Re-open Thread\' : \'Close Thread\'}}</md-button>\r\n            <div flex></div>\r\n            <md-button ui-sref=\"app.thread\" class=\"md-grey md-border md-cornered m-r-0\">Back</md-button>\r\n            <save-button button-class=\"m-r-0\" save-fn=\"saveThread()\" entity=\"thread\">Save</save-button>\r\n            <md-button class=\"m-r-0 md-accent md-cornered md-raised md-flat md-border-green\" style=\"min-width: 100px\" ng-click=\"saveAndExit($event)\">Save & Exit</md-button>\r\n        </div>\r\n    </div>\r\n</dynamic-footer>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/thread/tpls/thread.html', '<dynamic-footer>\r\n    <entity-footer entity=\"thread\" user-can-edit=\"userCanEdit\" show-edit=\"showEdit\" edit-fn=\"$state.go(\'app.thread.edit\')\" publish-fn=\"publish($event)\"></entity-footer>\r\n</dynamic-footer>\r\n\r\n<missing-fields ng-hide=\"!publishAttempted || forms.ThreadForm.$completed\" entity=\"thread\" required-fields=\"requiredFields\" form=\"forms.ThreadForm\"></missing-fields>\r\n\r\n<div class=\"threadView\" style=\"margin-bottom: 50px;\">\r\n    <div ng-if=\"$state.is(\'app.thread\')\">\r\n        <div layout=\"row\" layout-align=\"center\">\r\n            <div class=\"md-content-container\" style=\"padding-bottom: 0px;\">\r\n                <div class=\"rel-box\">\r\n                    <div ng-if=\"userPermissions.isMin(\'admin\')\">\r\n                        <settings-button>\r\n                            <md-menu-item>\r\n                                <md-button ui-sref=\"app.thread.edit\">Edit Thread</md-button>\r\n                            </md-menu-item>\r\n                            <md-menu-item>\r\n                                <md-button confirm ng-click=\"deleteThread()\">Delete Thread</md-button>\r\n                            </md-menu-item>\r\n                            <feed-recommend entity-type=\"thread\" entity-id=\"{{thread._id}}\"></feed-recommend>\r\n                            <md-menu-item show-if-admin>Thread id:\r\n                                <br>{{thread._id}}</md-menu-item>\r\n                        </settings-button>\r\n                    </div>\r\n\r\n                    <div class=\"md-subhead\">\r\n                        <a ui-sref=\"app.browse.all\" class=\"text-green\">Browse</a>\r\n                        /\r\n                        <a ui-sref=\"app.browse.threads\" class=\"text-green\">Threads</a>\r\n                        <span> / Thread</span>\r\n                    </div>\r\n\r\n                    <md-divider class=\"m-v-30\"></md-divider>\r\n\r\n                    <!-- Title -->\r\n                    <h1 class=\"md-display-1\">{{thread.name || \'No Title\'}}</h1>\r\n\r\n                    <md-divider class=\"m-v-30\"></md-divider>\r\n\r\n                    <div ng-if=\"thread.banner\" class=\"border-box m-b-30\">\r\n                        <a class=\"featured-image bg-img-cover\" blur-load-bg bg-src=\"{{thread.banner}}?size=featured-md\" lightbox=\"true\" lightbox-image=\"thread.banner\"></a>\r\n                    </div>\r\n\r\n                    <div layout=\"column\" layout-gt-sm=\"row\" class=\"md-row\">\r\n                        <div flex class=\"md-col\">\r\n                            <modular-editor class=\"p-b-10\" editor-sections=\"thread.sectionData\" editor-options=\"editorOptions\" edit=\"false\"></modular-editor>\r\n                            <md-divider class=\"m-t-30 m-b-15\"></md-divider>\r\n                            <thread-timeline parent=\"thread\" timeline=\"thread.timeline\" save-fn=\"saveThread()\" user-permissions=\"userPermissions\"></thread-timeline>\r\n                        </div>\r\n\r\n                        <div class=\"sidebar md-col\">\r\n                            <div sticky offset=\"31\">\r\n                                <div class=\"border-box-white p-15 m-b-30\">\r\n                                    <div class=\"md-subhead m-b-10\">Thread creator</div>\r\n                                    <a ui-sref=\"app.user.profile({stub:thread.owner.stub})\" layout=\"row\" layout-align=\"start center\">\r\n                                        <div class=\"avatar-circle\" ng-style=\"{ \'background-image\':\'url(\'+(thread.owner.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\"></div>\r\n                                        <div class=\"m-l-10 text-lightgrey\">{{thread.owner.name}}</div>\r\n                                    </a>\r\n                                </div>\r\n                                <div class=\"border-box-white p-15 m-b-30\">\r\n                                    <table class=\"st-meta-table\">\r\n                                        <tr>\r\n                                            <td>Updated</td>\r\n                                            <td>{{thread.updated | amTimeAgo}}</td>\r\n                                        </tr>\r\n                                        <tr>\r\n                                            <td>Created</td>\r\n                                            <td>{{thread.submitted | amTimeAgo}}</td>\r\n                                        </tr>\r\n                                        <tr ng-show=\"thread.fields.length > 0\">\r\n                                            <td>Fields</td>\r\n                                            <td>\r\n                                                <item-fields fields=\"thread.fields\" limit=\"10\"></item-fields>\r\n                                            </td>\r\n                                        </tr>\r\n                                        <tr ng-show=\"thread.labels.length > 0\">\r\n                                            <td>Labels</td>\r\n                                            <td>\r\n                                                <span class=\"label\" label-style=\"{{label}}\" ng-repeat=\"label in thread.labels\">{{label}}</span>\r\n                                            </td>\r\n                                        </tr>\r\n                                    </table>\r\n                                </div>\r\n                                <div class=\"border-box-white p-15 m-b-30\" ng-show=\"thread.projects.length > 0\">\r\n                                    <div class=\"md-subhead\">Related Projects</div>\r\n                                    <a ng-repeat=\"project in thread.projects\" ui-sref=\"app.project.overview({stub:project.stub})\" layout=\"row\" layout-align=\"start center\" class=\"m-t-10\">\r\n                                        <div class=\"avatar-square-cover\" ng-style=\"{ \'background-image\':\'url(\'+(project.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\"></div>\r\n                                        <div flex class=\"m-l-10 text-lightgrey\">{{project.name}}</div>\r\n                                    </a>\r\n                                </div>\r\n                                <div class=\"border-box-white p-15 m-b-30\" ng-show=\"thread.organisations.length > 0\">\r\n                                    <div class=\"md-subhead\">Related Organisations</div>\r\n                                    <a ng-repeat=\"organisation in thread.organisations\" ui-sref=\"app.organisation.overview({stub:organisation.stub})\" layout=\"row\" layout-align=\"start center\" class=\"m-t-10\">\r\n                                        <div class=\"avatar-square-contain\" ng-style=\"{ \'background-image\':\'url(\'+(organisation.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb)\'}\"></div>\r\n                                        <div flex class=\"m-l-10 text-lightgrey\">{{organisation.name}}</div>\r\n                                    </a>\r\n                                </div>\r\n                                <div class=\"border-box-white p-15 m-b-30\" ng-show=\"getParticipants().length > 0\">\r\n                                    <div class=\"md-subhead m-b-10\">Participants</div>\r\n                                    <div style=\"margin: 0 -3px;\" layout=\"row\" layout-wrap>\r\n                                        <a style=\"padding: 3px;\" ng-repeat=\"user in getParticipants()\" ui-sref=\"app.user.profile({stub:user.stub})\">\r\n                                            <div class=\"avatar-circle avatar-sm\" ng-style=\"{ \'background-image\':\'url(\'+(user.picture || \'/assets/images/default/user-1.png\')+\'?size=thumb&crop=true)\'}\"></div>\r\n                                            <md-tooltip>{{user.name}}</md-tooltip>\r\n                                        </a>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <ui-view></ui-view>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/track/tpls/edit-candidate-modal.html', '<md-dialog aria-label=\"Edit Candidate\">\r\n    <md-dialog-content class=\"overflow-x-box p-0\">\r\n        <div class=\"md-content-container content-md p-0\" layout=\"row\">\r\n            <md-content class=\"p-30\" flex>\r\n                <div layout=\"row\">\r\n                    <div class=\"avatar-circle avatar-md m-r-30\" style=\"background-image:url({{user.picture || \'/assets/images/default/user-1.png\'}}?size=thumb&crop=true)\"></div>\r\n                    <div flex>\r\n                        <div class=\"md-title bold\">{{user.name}}</div>\r\n                        <div>{{user.blurb}}</div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"line-divider-bottom m-b-15 m-t-30\" layout=\"row\">\r\n                    <div class=\"md-subhead\">Application Details</div>\r\n                </div>\r\n                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla hic iste fuga a sit saepe pariatur, sunt modi qui, eligendi, necessitatibus commodi quisquam! Dolore quam sint illum harum magni facere!\r\n\r\n                <div class=\"line-divider-bottom m-b-15 m-t-30\" layout=\"row\">\r\n                    <div class=\"md-subhead\">Candidate Details</div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"m-b-5\">\r\n                    <div class=\"md-subhead w-100x\">Email</div>\r\n                    <div flex>Email</div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"m-b-5\">\r\n                    <div class=\"md-subhead w-100x\">Phone</div>\r\n                    <div flex>{{user.profile.phone}}</div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"m-b-5\">\r\n                    <div class=\"md-subhead w-100x\">Citizenship</div>\r\n                    <div flex><span ng-repeat=\"item in user.profile.citizenship\">{{item}} </span></div>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"m-b-5\">\r\n                    <div class=\"md-subhead w-100x\">Location</div>\r\n                    <div flex>Location</div>\r\n                </div>\r\n\r\n                <div class=\"line-divider-bottom m-b-15 m-t-30\" layout=\"row\">\r\n                    <div class=\"md-subhead\">Candidate Profile</div>\r\n                </div>\r\n                <div>\r\n                    <br>\r\n                    <br> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla hic iste fuga a sit saepe pariatur, sunt modi qui, eligendi, necessitatibus commodi quisquam! Dolore quam sint illum harum magni facere!\r\n                    <br> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla hic iste fuga a sit saepe pariatur, sunt modi qui, eligendi, necessitatibus commodi quisquam! Dolore quam sint illum harum magni facere!\r\n                </div>\r\n            </md-content>\r\n            <div class=\"bg-lightgrey\" flex layout=\"column\">\r\n                <md-content flex>\r\n                    <div class=\"p-30\">\r\n                        <div class=\"text-tabs tabs-light-grey\" layout=\"row\">\r\n                            <a class=\"md-subhead\" ng-class=\"{\'active\': activeTab == tab.label}\" ng-repeat=\"tab in tabs\" ng-click=\"tab.click()\">{{tab.label}}</a>\r\n                        </div>\r\n                        <track-comments></track-comments>\r\n                    </div>\r\n                </md-content>\r\n                <traffic-buttons></traffic-buttons>\r\n            </div>\r\n        </div>\r\n    </md-dialog-content>\r\n</md-dialog>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/track/tpls/track-comments.html', '<textarea name=\"notes\" placeholder=\"Add a comment. This will only be seen by you and your team.\"></textarea>\r\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Optio facere magnam nam mollitia nesciunt veniam vel, nihil quibusdam sit labore, provident repudiandae reprehenderit perferendis atque omnis ullam ducimus aspernatur voluptates.\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/track/tpls/track.html', '<div class=\"trackView\">\r\n    <div class=\"track-header\" layout=\"row\" layout-align=\"start center\">\r\n        <div class=\"m-r-15\">Filter candidates:</div>\r\n        <md-select placeholder=\"Filter by job\" ng-model=\"filters.job\" class=\"md-accent\">\r\n            <md-option value=\"\">All Jobs</md-option>\r\n            <md-option value=\"{{job._id}}\" ng-repeat=\"job in jobs\">{{job.name}}</md-option>\r\n        </md-select>\r\n\r\n    </div>\r\n    <div class=\"track-content\" layout=\"row\">\r\n        <div class=\"track-col\" ng-repeat=\"column in trackColumns\">\r\n            <div class=\"track-title\">\r\n                <div class=\"title\">{{column.name}}</div>\r\n                <div>{{column.applicants.length}} Total</div>\r\n            </div>\r\n            <div class=\"track-col-inner\" layout=\"column\">\r\n                <div flex ng-sortable=\"sortableConfig\">\r\n                    <div ng-repeat=\"applicant in column.applicants\" class=\"track-card card-z1 m-b-10 my-handle\">\r\n                       <div class=\"card-header\">\r\n                           {{applicant.parent.name}}\r\n                       </div>\r\n                        <div>{{applicant.child.name}}</div>\r\n                        <div layout=\"row\" layout-align=\"start center\">\r\n                            <md-icon md-svg-icon=\"response\"></md-icon>\r\n                            <div flex>3</div>\r\n                        </div>\r\n\r\n                        <div class=\"card-footer\">\r\n                            <user-icon user-id=\"{{applicant.status.user}}\" user=\"user\"></user-icon>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/track/tpls/traffic-buttons.html', '<div layout=\"row\" class=\"text-white\" style=\"font-size: 15px;\">\r\n    <a class=\"p-15 hover-fade bg-red\" flex layout=\"row\" layout-align=\"start center\">\r\n        <md-icon class=\"md-icon-white\" md-svg-icon=\"chevron-left\"></md-icon>\r\n        <div class=\"p-h-15\" flex>Move to Archived</div>\r\n    </a>\r\n    <a class=\"p-15 hover-fade bg-green text-right\" flex layout=\"row\" layout-align=\"end center\">\r\n        <div flex></div>\r\n        <div class=\"p-h-15\" >Move to Hired</div>\r\n        <md-icon class=\"md-icon-white\" md-svg-icon=\"chevron-right\"></md-icon>\r\n    </a>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user-onboarding/tpls/user-onboarding.experience.html', '<h2 class=\"md-display-1\">Experience</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">What experiences can you bring to your dream job? What did you contribute previously? The more relevant and specific the better.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div ng-sortable=\"sortConfig\">\r\n            <div class=\"onboarding-edit-card card-z1 md-padding my-handle\" ng-repeat=\"item in user.profile.profileDetails.experience\">\r\n                <md-button confirm class=\"md-warn md-circle md-raised md-sm close\" ng-click=\"delRow(user.profile.profileDetails.experience, $index)\">\r\n                    <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n                    <md-tooltip md-direction=\"top\" md-autohide=\"true\">Remove row</md-tooltip>\r\n                </md-button>\r\n                <div layout=\"row\">\r\n                    <md-input-container flex class=\"md-accent\">\r\n                        <label>Position</label>\r\n                        <input name=\"position\" ng-model=\"item.position\">\r\n                    </md-input-container>\r\n                    <organisation-search single=\"true\" data=\"item.organisations\" search-text=\"item.company\" placeholder=\"Organisation\" organisation-type=\"company\"></organisation-search>\r\n                </div>\r\n                <date-range edit=\"true\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Description</label>\r\n                    <textarea name=\"notes\" ng-model=\"item.notes\" md-maxlength=\"500\"></textarea>\r\n                </md-input-container>\r\n            </div>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"center center\">\r\n            <add-another add-fn=\"addExperience()\" white=\"true\"></add-another>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<h2 class=\"md-display-1\">Education</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Where did you study? What relevant skills did you learn there? We\'ll use these to match you to positions that match your education level.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div ng-sortable=\"sortConfig\">\r\n            <div class=\"onboarding-edit-card card-z1 md-padding my-handle\" ng-repeat=\"item in user.profile.profileDetails.education\">\r\n\r\n                <md-button confirm class=\"md-warn md-circle md-raised md-sm close\" ng-click=\"delRow(user.profile.profileDetails.education, $index)\">\r\n                    <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n                    <md-tooltip md-direction=\"top\" md-autohide=\"true\">Remove row</md-tooltip>\r\n                </md-button>\r\n                <div layout=\"row\">\r\n                    <md-input-container flex class=\"md-accent\">\r\n                        <label>Degree / Certificatee</label>\r\n                        <input name=\"degree\" ng-model=\"item.degree\">\r\n                    </md-input-container>\r\n                    <organisation-search single=\"true\" data=\"item.organisations\" placeholder=\"School / University\" search-text=\"item.school\" organisation-type=\"school\"></organisation-search>\r\n                </div>\r\n                <date-range edit=\"true\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Description</label>\r\n                    <textarea name=\"notes\" ng-model=\"item.notes\" md-maxlength=\"500\"></textarea>\r\n                </md-input-container>\r\n            </div>\r\n        </div>\r\n        <div layout=\"row\" layout-align=\"center center\">\r\n            <add-another add-fn=\"addEducation()\" white=\"true\"></add-another>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<div layout=\"row\">\r\n    <div flex></div>\r\n    <md-button class=\"md-raised md-flat md-md md-cornered\" ui-sref=\"app.user-onboarding.intro\">Back</md-button>\r\n    <md-button class=\"md-raised md-flat md-accent md-md md-cornered\" ng-click=\"nextStep()\">Next: Find matches</md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user-onboarding/tpls/user-onboarding.final.html', '<h1 class=\"md-display-1 text-center m-t-30\">Recommended Positions</h1>\r\n<div class=\"md-title text-grey light-font text-center\">Here are the best jobs for you (based on your skills and experience)</div>\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<div ng-show=\"query.results[0].rating <= 60\">\r\n    <tip-banner local=\"true\" style=\"margin-bottom: 60px;\">\r\n        <b>Important: </b> Your best match has suitability rating of <b>{{query.results[0].rating}}%</b>. We recommend you <a ng-click=\"addMoreFields();\">add more skills</a> so we can match you to more appropriate jobs.\r\n    </tip-banner>\r\n</div>\r\n\r\n<div class=\"rel-box\" style=\"min-height: 100px;\">\r\n    <a class=\"card-z1 m-b-15 rel-box\" layout=\"row\" layout-align=\"start center\" ng-repeat=\"item in query.results\" set-entity-href=\"\'job\'\" entity-stub=\"item.stub\" style=\"font-size: 14px;\">\r\n        <div class=\"avatar-square-contain avatar-md m-r-15\" ng-style=\"item.organisations[0].picture && { \'background-image\':\'url(\'+item.organisations[0].picture+\'?size=thumb-lg)\'}\"></div>\r\n        <div flex>\r\n            <div class=\"bold\">{{item.organisations[0].name}}</div>\r\n            <div class=\"m-v-10\">{{item.name}}</div>\r\n            <div class=\"text-lightgrey\">{{item.location[0].name}}</div>\r\n        </div>\r\n\r\n        <div class=\"rating-pie\" ng-style=\"{\'animation-delay\': \'-\'+item.rating+\'s\'}\">\r\n            <div class=\"number\">{{item.rating}}</div>\r\n            <popup class=\"tooltip-popup\" popup-side=\"right\" popup-position=\"center\" popup-padding=\"0 0 0 8px\" style=\"max-width: 150px;\">\r\n                <p>Your skills include <b>{{item.numMatchingSkills}}/{{item.fields.length}}</b> of those listed on this job.</p>\r\n            </popup>\r\n        </div>\r\n    </a>\r\n    <loading-overlay ng-if=\"query.loading\" class=\"light-grey\"></loading-overlay>\r\n</div>\r\n\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<div layout=\"row\">\r\n    <div flex></div>\r\n    <md-button class=\"md-raised md-flat md-md md-cornered\" ui-sref=\"app.user-onboarding.experience\">Back</md-button>\r\n    <md-button class=\"md-border md-accent md-md md-cornered\" ui-sref=\"app.home\" ng-click=\"complete();\">Go to Newsfeed</md-button>\r\n    <md-button class=\"md-border-green md-raised md-flat md-accent md-md md-cornered\" ui-sref=\"app.browse.jobs\" ng-click=\"complete();\">See all Matches</md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user-onboarding/tpls/user-onboarding.html', '<div layout=\"row\" layout-align=\"center\" class=\"p-b-30 userOnboarding\" layout-offset-horizontal-menu-force>\r\n\r\n    <edit-toolbar class=\"white p-h-15\">\r\n        <div flex></div>\r\n        <div class=\"md-content-container md-no-padding\" hide-sm hide-md>\r\n            <div class=\"onboarding-steps\" layout=\"row\" layout-align=\"start center\">\r\n                <div ng-repeat=\"tab in tabs\" ng-hide=\"tab.hideCondition();\" layout=\"row\" layout-align=\"start center\">\r\n                    <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-click=\"tab.click()\">{{tab.label}}</a>\r\n                    <md-icon md-svg-icon=\"chevron-right\" ng-hide=\"$last\"></md-icon>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div flex></div>\r\n    </edit-toolbar>\r\n    <div class=\"main-horizontal-sub-menu\" hide-gt-md>\r\n        <div class=\"text-tabs\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\" ng-class=\"{\'active\':$state.includes(tab.sref)}\">{{tab.label}}</a>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"md-content-container overflow-x-box\">\r\n<!--\r\n        <div class=\"text-tabs text-tabs-top m-t-40 m-b-60\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ng-click=\"tab.click()\">{{tab.label}}</a>\r\n        </div>\r\n-->\r\n        <ui-view></ui-view>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user-onboarding/tpls/user-onboarding.intro.html', '<h1 class=\"md-display-1 text-center m-t-30\">Find a match</h1>\r\n<div class=\"md-title text-grey light-font text-center\">See jobs that match your skills and experience</div>\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n<h2 class=\"md-display-1\">About you</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Tell the companies about yourself or import from LinkedIn. We\'ll use your this to match you to jobs that match your skills and experience.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n\r\n       <form name=\"forms.overview\">\r\n\r\n            <div class=\"card-z1 card-padding m-b-30 rel-box\">\r\n                <div class=\"md-subhead\">Want to get a head start?</div>\r\n                <p>Import your profile from Linkedin. This will automatically fill out your profile picture, education and experience.</p>\r\n                <md-button class=\"md-social md-linkedin md-md m-l-0 md-cornered\" ng-click=\"linkedinImport()\">Import from Linkedin</md-button>\r\n                <loading-overlay ng-if=\"linkedinLoading\"></loading-overlay>\r\n            </div>\r\n\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\">Profile Photo</div>\r\n                <div layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\" class=\"m-t-30\">\r\n                    <upload-image icon=\"true\" image=\"user.profile.picture\" ng-model=\"user.profile.picture\" circle=\"true\" name=\"ProfileImage\">\r\n                        <img class=\"avatar-circle avatar-xl\" ng-src=\"{{user.profile.picture || \'/assets/images/default/user-1.png\' }}?size=user&crop=true\">\r\n                    </upload-image>\r\n                    <div flex class=\"text-center\">\r\n                        <div ng-show=\"user.profile.picture\">\r\n                           <p ng-show=\"linkedinImported\">Your LinkedIn photo is low resolution. Consider uploading another now.</p>\r\n                           <p ng-hide=\"linkedinImported\">Looking good!</p>\r\n\r\n                        </div>\r\n                        <div ng-hide=\"user.profile.picture\">\r\n                            <p>Profiles with a photo get 78% more views</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"card-z1 card-padding m-b-30\">\r\n                <div layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Mini Resume</div>\r\n                    <div class=\"notes\">Required</div>\r\n                </div>\r\n                <p>Introduce yourself in 100 characters</p>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>e.g. MIT AeroAstro, Materials and Structures specialist; worked at SpaceX</label>\r\n                    <textarea required ng-model=\"user.blurb\" md-maxlength=\"100\"\r\n                    name=\"Blurb\"></textarea>\r\n                    <div ng-messages=\"forms.overview.Blurb.$error\" ng-if=\"forms.overview.Blurb.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                        <div ng-message=\"md-maxlength\">Your blurb has to be less than 100 characters long.</div>\r\n                    </div>\r\n                </md-input-container>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</div>\r\n\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<h2 class=\"md-display-1\">Skills and knowledge</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">What technical languages and programs do you know? What are your key fields of interest? We\'ll use these to match you to the most appropriate jobs for your skills and abilities.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n\r\n       <form name=\"forms.skills\">\r\n            <div id=\"technologiesEdit\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\">Technologies and Technical Languages</div>\r\n                <p>Type and select each technology separately. E.g. Matlab, C++, SolidWorks. Later on, you\'ll need to add a few projects to your portfolio as evidence for these skills.</p>\r\n                <field-search data=\"user.profile.profileDetails.technologies\" focus=\"focusField\" ng-mouseenter=\"focusField=true\" ng-mouseleave=\"focusField=false\" placeholder=\"Technologies, Programs and Languages\"></field-search>\r\n                <tags ng-if=\"user.profile.profileDetails.technologies.length>0\" edit=\"true\" size=\"xs\" tags=\"user.profile.profileDetails.technologies\" type=\"field\"></tags>\r\n            </div>\r\n            <div id=\"skillsEdit\" class=\"card-z1 card-padding m-b-30\">\r\n               <div layout=\"row\">\r\n                    <div class=\"md-subhead\" flex>Skills and Fields</div>\r\n                    <div class=\"notes\">5 Required</div>\r\n                </div>\r\n                <p>Type and select each field separately. E.g. Avionics, Structural Analysis</p>\r\n                <field-search data=\"user.profile.profileDetails.skills\" focus=\"focusTech\" ng-mouseenter=\"focusTech=true\" ng-mouseleave=\"focusTech=false\" placeholder=\"Skills and fields\"></field-search>\r\n                <tags ng-if=\"user.profile.profileDetails.skills.length>0\" edit=\"true\" size=\"xs\" tags=\"user.profile.profileDetails.skills\" type=\"field\"></tags>\r\n            </div>\r\n            <div id=\"interestsEdit\" class=\"card-z1 card-padding m-b-30\">\r\n                <div class=\"md-subhead\" flex>Interests</div>\r\n                <p>Interests should be fields or technical hobbies. E.g. Drones, Arduino, 3D printing</p>\r\n                <field-search data=\"user.profile.profileDetails.interests\" focus=\"focusInterest\" ng-mouseenter=\"focusInterest=true\" ng-mouseleave=\"focusInterest=false\" placeholder=\"Interests\"></field-search>\r\n                <tags ng-if=\"user.profile.profileDetails.interests.length>0\" edit=\"true\" size=\"xs\" tags=\"user.profile.profileDetails.interests\" type=\"field\"></tags>\r\n            </div>\r\n        </form>\r\n    </div>\r\n</div>\r\n\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<div layout=\"row\">\r\n    <div flex></div>\r\n    <md-button class=\"md-raised md-flat md-accent md-md md-cornered m-r-0\" ng-click=\"nextStep()\">Next: Your experience</md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user/tpls/add-another.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <md-button class=\"md-circle md-raised md-sm\" ng-class=\"{\'md-accent\' : !white}\" ng-click=\"addFn()\">\r\n        <md-icon md-svg-icon=\"add\"></md-icon>\r\n        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Add another</md-tooltip>\r\n    </md-button>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user/tpls/date-range.html', '<div style=\"width: 100%;\">\r\n   <div ng-if=\"!edit\" class=\"date-range\">\r\n        {{start.year}} - <span ng-if=\"!current\">{{end.year}}</span><span ng-if=\"current\">current</span>\r\n        <!--{{months[start.month+1]}} -->\r\n    </div>\r\n    <div ng-if=\"edit\">\r\n        <div layout=\"row\" layout-align=\"start center\">\r\n            <md-select flex-order=\"1\" placeholder=\"Start Date\" ng-model=\"start.year\" class=\"md-accent\">\r\n                <md-option ng-repeat=\"year in ::years\" value=\"{{::year}}\">{{::year}}</md-option>\r\n            </md-select>\r\n            <div flex-order=\"2\" ng-hide=\"current\" style=\"padding: 0px 10px;\">to</div>\r\n            <md-select flex-order=\"3\" ng-hide=\"current\" placeholder=\"End Date\" ng-model=\"end.year\" class=\"md-accent\">\r\n                <md-option ng-repeat=\"year in ::years\" value=\"{{::year}}\">{{::year}}</md-option>\r\n            </md-select>\r\n            <div flex-order=\"4\" layout=\"row\" layout-align=\"start center\">\r\n                <md-checkbox\r\n                    ng-model=\"$parent.current\"\r\n                    class=\"md-accent\" aria-label=\"Is Current Checkbox\">\r\n                </md-checkbox>\r\n                Current?\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user/tpls/user-following.html', '<div layout=\"row\" layout-align=\"center\">\r\n    <div class=\"md-content-container m-b-30\">\r\n        <h1 class=\"md-display-1\">Things {{user.profile.firstname}} follows</h1>\r\n        <following-detailed class=\"block m-b-60\" user-id=\"{{user._id}}\" show-divider=\"true\" size=\"3\" type=\"field\" ></following-detailed>\r\n        <following-detailed class=\"block m-b-60\" user-id=\"{{user._id}}\" show-divider=\"true\" size=\"3\" type=\"organisation\"></following-detailed>\r\n        <following-detailed class=\"block m-b-60\" user-id=\"{{user._id}}\" show-divider=\"true\" size=\"3\" type=\"project\"></following-detailed>\r\n        <following-detailed class=\"block m-b-60\" user-id=\"{{user._id}}\" show-divider=\"true\" size=\"3\" type=\"thread\"></following-detailed>\r\n        <following-detailed class=\"block m-b0\"   user-id=\"{{user._id}}\" show-divider=\"true\" size=\"3\" type=\"user\"></following-detailed>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user/tpls/user-footer.html', '<div>\r\n    <!-- PRIVATE FOOTER -->\r\n    <div layout=\"row\" layout-align=\"space-between center\" ng-if=\"showEdit\">\r\n		<div hide-sm layout=\"row\" layout-align=\"center center\" style=\"margin-left: 15px\">\r\n			<div class=\"text-lightgrey\" style=\"margin-right:10px\">Your profile link:</div>\r\n			<div class=\"select-on-click-box text-lightgrey\" select-on-click>\r\n				{{user.stub}}.stemn.com\r\n				<md-tooltip md-direction=\"top\" md-autohide=\"true\">Click to highlight URL</md-tooltip>\r\n			</div>\r\n		</div>\r\n        <div flex></div>\r\n		<md-button hide-sm class=\"md-accent md-border\" ng-click=\"forms.OverviewForm.$edit()\">\r\n			Edit Images and Info\r\n		</md-button>\r\n		<md-button hide-sm class=\"md-grey md-border\" ng-click=\"togglePublicView()\">\r\n			Switch to public view\r\n		</md-button>\r\n  		<social-share-button></social-share-button>\r\n    </div>\r\n    <!-- PUBLIC FOOTER -->\r\n    <div layout=\"row\" layout-align=\"space-between center\" ng-if=\"!showEdit\">\r\n        <div hide-sm flex class=\"text-lightgrey\">\r\n        	This is what your profile will look like to the public. Why not share the link with your next job application?\r\n        </div>\r\n        <md-button class=\"md-grey md-border\" ng-click=\"togglePublicView()\" ng-show=\"userCanEdit\">\r\n			Switch back to edit view\r\n		</md-button>\r\n<!--        <stat-button hidepublic hide-stat=\"true\" type=\"follow\" parent-type=\"user\" parent-id=\"{{user._id}}\" count=\"user.followers\"></stat-button>-->\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user/user-profile.html', '<!------------------------------------------------------>\r\n<!--------------------- ABOUT BIO ---------------------->\r\n<!------------------------------------------------------>\r\n<md-container style=\"margin-bottom:50px\" ng-if=\"user.profile.profileDetails.summary || showEdit\">\r\n	<div ng-if=\"showEdit\">\r\n		<tip-banner ng-if=\"!completionPercentage == 100\" local=\"true\">\r\n            <div style=\"margin-bottom: 10px;\">Posting <b>projects</b> and <b>blogs</b> will increase the strength of your portfolio.</div>\r\n            <user-completion-widget display-type=\"banner\" completion-percentage=\"completionPercentage\"></user-completion-widget>\r\n		</tip-banner>\r\n	</div>\r\n    <form id=\"summary\" novalidate name=\"AboutForm\" class=\"edit-box\">\r\n        <edit-button ng-show=\"showEdit\" form=\"AboutForm\" inline=\"true\" save-fn=\"SaveUser()\"></edit-button>\r\n        <h2 class=\"md-headline\">About Me</h2>\r\n        <!-- If Editing -->\r\n        <p ng-show=\"AboutForm.$visible\"><textarea name=\"overview\" ng-model=\"user.profile.profileDetails.summary\" msd-elastic class=\"editable\" placeholder=\"What do you do and what are you interested in?\"></textarea></p>\r\n        <!-- If NOT Editing -->\r\n        <p ng-hide=\"AboutForm.$visible\" class=\"wrap-text\">{{user.profile.profileDetails.summary}}</p>\r\n    </form>\r\n</md-container>\r\n\r\n\r\n<div ng-if=\"projects.length > 0 || showEdit\" class=\"projects-section\" layout=\"column\" layout-align=\"center center\" >\r\n    <div class=\"title-block md-content-container md-no-padding\" layout=\"row\">\r\n    	<div class=\"md-subhead\">{{user.profile.firstname}}\'s Projects</div>\r\n    </div>\r\n	<div layout=\"row\" layout-align=\"center\">\r\n        <creation-card ng-repeat=\"project in projects | orderBy : \'-picture\' | limitTo : numProjectsToShow\" entity=\"project.data\" style=\"width: 300px;\"></creation-card>\r\n		<a ng-show=\"showEdit\" class=\"add-projects\" layout=\"column\" ng-click=\"newProject($event)\">\r\n			<div md-ink-ripple class=\"picture\" layout=\"column\" layout-align=\"center center\"><md-icon md-svg-icon=\"add\"></md-icon></div>\r\n			<div flex layout=\"column\" layout-align=\"center center\"><div class=\"text-lightgrey md-padding\">Add a project</div></div>\r\n		</a>\r\n\r\n		<a ng-show=\"projects.length > numProjectsToShow\" ui-sref=\"app.user.projects\" class=\"more-projects\" layout=\"column\" layout-align=\"center center\" md-ink-ripple>\r\n			<md-icon md-svg-icon=\"chevron-right\"></md-icon>\r\n			<md-tooltip md-direction=\"top\" md-autohide=\"true\">See all projects</md-tooltip>\r\n		</a>\r\n	</div>\r\n</div>\r\n\r\n<div class=\"content-lg\">\r\n    <!------------------------------------------------------>\r\n    <!--------------------- EXPERIENCE --------------------->\r\n    <!------------------------------------------------------>\r\n    <md-container style=\"margin: 50px 0;\" ng-if=\"showEdit\">\r\n        <form id=\"experience\" novalidate name=\"ExperienceForm\" class=\"edit-box\" >\r\n            <div layout=\"row\">\r\n                <div hide-sm flex=\"20\"></div>\r\n                <h2 flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\" class=\"md-headline rel-box\">\r\n                    <edit-button ng-show=\"showEdit\" form=\"ExperienceForm\" inline=\"true\" save-fn=\"SaveUser()\"></edit-button>\r\n                    My Experience\r\n                </h2>\r\n                <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n            </div>\r\n            <div ng-sortable=\"sortConfig\">\r\n                <div class=\"profile-item\" layout=\"row\" ng-repeat=\"item in user.profile.profileDetails.experience\" ng-show=\"showEdit || item.company || item.organisations[0].name\">\r\n                    <div hide-sm flex=\"20\" layout=\"column\" layout-align=\"start end\" ng-class=\"{\'my-handle\' : ExperienceForm.$visible==true}\">\r\n                        <date-range edit=\"false\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                    </div>\r\n                    <div flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\">\r\n                        <!-- If NOT Editing -->\r\n                        <div ng-hide=\"ExperienceForm.$visible\">\r\n                            <div class=\"md-subhead\" layout=\"row\" layout-align-gt-sm=\"start center\">\r\n                                <div flex><span>{{item.position}}</span><span class=\"inter\" ng-show=\"item.position || item.company || item.organisations[0].name\">·</span><span class=\"bold\">{{item.organisations[0].name || item.company}}</span></div>\r\n                                <a hide-sm ng-if=\"item.organisations[0].picture\" ui-sref=\"app.organisation.overview({stub:item.organisations[0].stub})\">\r\n                                    <div class=\"avatar-square-contain\" ng-style=\"{ \'background-image\':\'url(\'+item.organisations[0].picture+\'?size=thumb)\'}\"></div>\r\n                                </a>\r\n                            </div>\r\n                            <p class=\"wrap-text\">{{item.notes}}</p>\r\n                        </div>\r\n                        <!-- If Editing -->\r\n                        <div ng-show=\"ExperienceForm.$visible\">\r\n                            <md-button confirm ng-show=\"ExperienceForm.$visible\" class=\"md-warn md-circle md-raised md-sm bullet-button\" ng-click=\"delRow(user.profile.profileDetails.experience, $index)\">\r\n                                <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n                                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Remove row</md-tooltip>\r\n                            </md-button>\r\n                            <div layout=\"row\">\r\n                                <md-input-container flex class=\"md-accent\">\r\n                                    <label>Position</label>\r\n                                    <input name=\"positon\" ng-model=\"item.position\">\r\n                                </md-input-container>\r\n                                <organisation-search single=\"true\" data=\"item.organisations\" search-text=\"item.company\" placeholder=\"Organisation\" organisation-type=\"company\"></organisation-search>\r\n<!--\r\n                                <md-input-container flex class=\"md-accent\">\r\n                                    <label>Organisation</label>\r\n                                    <input required name=\"company\" ng-model=\"item.company\">\r\n                                </md-input-container>\r\n-->\r\n                            </div>\r\n                            <date-range edit=\"ExperienceForm.$visible\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                            <md-input-container class=\"md-accent\">\r\n                                <label>Description</label>\r\n                                <textarea name=\"notes\" ng-model=\"item.notes\" md-maxlength=\"500\"></textarea>\r\n                            </md-input-container>\r\n                        </div>\r\n                        <md-divider ng-hide=\"$last\"></md-divider>\r\n                    </div>\r\n                     <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n                </div>\r\n            </div>\r\n            <!-- If Editing -->\r\n            <div ng-if=\"ExperienceForm.$visible\" layout=\"row\">\r\n                <div hide-sm flex=\"20\"></div>\r\n                <div flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\"><add-another add-fn=\"addExperience()\"></add-another></div>\r\n                <div flex=\"20\" flex-sm=\"0\"></div>\r\n            </div>\r\n        </form>\r\n    </md-container>\r\n\r\n    <md-container style=\"margin: 50px 0;\" ng-if=\"!showEdit && !isEmptyExperience()\">\r\n        <div layout=\"row\">\r\n            <div hide-sm flex=\"20\"></div>\r\n            <h2 flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\" class=\"md-headline\">\r\n                My Experience\r\n            </h2>\r\n            <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n        </div>\r\n        <div class=\"profile-item\" layout=\"row\" ng-repeat=\"item in user.profile.profileDetails.experience\" ng-show=\"item.company || item.organisations[0].name\">\r\n            <div hide-sm flex=\"20\" layout=\"column\" layout-align=\"start end\">\r\n                <date-range edit=\"false\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n            </div>\r\n            <div flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\">\r\n                <div class=\"md-subhead\">\r\n                    <span>{{item.position}}</span><span class=\"inter\" ng-show=\"item.position || item.company || item.organisations[0].name\">·</span><span class=\"bold\">{{item.organisations[0].name || item.company}}</span>\r\n                </div>\r\n                <p class=\"wrap-text\">{{item.notes}}</p>\r\n                <md-divider ng-hide=\"$last\"></md-divider>\r\n            </div>\r\n             <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n        </div>\r\n    </md-container>\r\n\r\n\r\n	<!------------------------------------------------------>\r\n	<!--------------------- STATS BAR ---------------------->\r\n	<!------------------------------------------------------>\r\n\r\n	<div class=\"divider-bar\" style=\"background-position: center;\"\r\n	   ng-style=\"{\'background-image\':\'url(\'+(user.profile.banner.url || alternateBanner)+\'?size=banner-lg&crop=true)\'}\">\r\n		<md-container>\r\n			<div layout=\"row\" layout-align=\"center center\" style=\"color: white\">\r\n				<a ui-sref=\"app.user.projects\" flex layout=\"column\" layout-align=\"center center\">\r\n					<div class=\"stat-number wow\" count-to=\"{{user.numProjects || 0}}\" duration=\"1\"></div>\r\n					<div class=\"md-title\">Project<span ng-show=\"user.numProjects!=1\">s</span></div>\r\n				</a>\r\n				<a ui-sref=\"app.user.threads\" flex layout=\"column\" layout-align=\"center center\">\r\n					<div class=\"stat-number wow\" count-to=\"{{user.numQuestions + user.numGenerals || 0}}\" duration=\"1.5\"></div>\r\n					<div class=\"md-title\">Discussion<span ng-show=\"user.numQuestions + user.numGenerals!=1\">s</span></div>\r\n				</a>\r\n				<a ui-sref=\"app.user.blogs\" flex layout=\"column\" layout-align=\"center center\">\r\n					<div class=\"stat-number wow\" count-to=\"{{user.numBlogs || 0}}\" duration=\"1.5\"></div>\r\n					<div class=\"md-title\">Blog<span ng-show=\"user.numBlogs!=1\">s</span></div>\r\n				</a>\r\n				<a ui-sref=\"app.user.comments\" flex layout=\"column\" layout-align=\"center center\">\r\n					<div class=\"stat-number wow\" count-to=\"{{user.numComments + user.numPosts || 0}}\" duration=\"1\"></div>\r\n					<div class=\"md-title\">Comment<span ng-show=\"user.numComments + user.numPosts!=1\">s</span></div>\r\n				</a>\r\n			</div>\r\n		</md-container>\r\n	</div>\r\n\r\n\r\n\r\n    <!------------------------------------------------------>\r\n    <!--------------------- EDUCATION ---------------------->\r\n    <!------------------------------------------------------>\r\n    <md-container style=\"margin: 50px 0;\" ng-if=\"showEdit\">\r\n        <form id=\"education\" novalidate name=\"EducationForm\" class=\"edit-box\">\r\n            <div layout=\"row\">\r\n                <div hide-sm flex=\"20\"></div>\r\n                <h2 flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\" class=\"md-headline rel-box\">\r\n                    My Education\r\n                    <edit-button ng-show=\"showEdit\" form=\"EducationForm\" inline=\"true\" save-fn=\"SaveUser()\"></edit-button>\r\n                </h2>\r\n                <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n            </div>\r\n            <div ng-sortable=\"sortConfig\">\r\n                <div class=\"profile-item\" layout=\"row\" ng-repeat=\"item in user.profile.profileDetails.education\" ng-show=\"showEdit || item.school || item.organisations[0].name\">\r\n                    <div hide-sm flex=\"20\" layout=\"column\" layout-align=\"start end\" ng-class=\"{\'my-handle\' : EducationForm.$visible==true}\">\r\n                        <date-range edit=\"false\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                    </div>\r\n                    <div flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\">\r\n                        <!-- If NOT Editing -->\r\n                        <div ng-hide=\"EducationForm.$visible\">\r\n                            <div class=\"md-subhead\" layout=\"row\" layout-align-gt-sm=\"start center\">\r\n                               <div flex class=\"m-r-15\"><span>{{item.degree}}</span><span class=\"inter\" ng-show=\"item.degree && (item.school || item.organisations[0].name)\">·</span><span class=\"bold\">{{item.organisations[0].name || item.school}}</span></div>\r\n                                <a hide-sm ng-if=\"item.organisations[0].picture\" ui-sref=\"app.organisation.overview({stub:item.organisations[0].stub})\">\r\n                                    <div class=\"avatar-square-contain\" ng-style=\"{ \'background-image\':\'url(\'+item.organisations[0].picture+\'?size=thumb)\'}\"></div>\r\n                                </a>\r\n                            </div>\r\n                            <p class=\"wrap-text\">{{item.notes}}</p>\r\n                        </div>\r\n                        <!-- If Editing -->\r\n                        <div ng-show=\"EducationForm.$visible\">\r\n                            <md-button confirm ng-show=\"EducationForm.$visible\" class=\"md-warn md-circle md-raised md-sm bullet-button\" ng-click=\"delRow(user.profile.profileDetails.education, $index)\">\r\n                                <md-icon md-svg-icon=\"navigation:close\"></md-icon>\r\n                                <md-tooltip md-direction=\"top\" md-autohide=\"true\">Remove row</md-tooltip>\r\n                            </md-button>\r\n                            <div layout=\"row\">\r\n                                <md-input-container flex class=\"md-accent\">\r\n                                    <label>Degree / Certificatee</label>\r\n                                    <input name=\"degree\" ng-model=\"item.degree\">\r\n                                </md-input-container>\r\n                                <organisation-search single=\"true\" data=\"item.organisations\" placeholder=\"School / University\" search-text=\"item.school\" organisation-type=\"school\"></organisation-search>\r\n                            </div>\r\n                            <date-range edit=\"EducationForm.$visible\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                            <md-input-container class=\"md-accent\">\r\n                                <label>Description</label>\r\n                                <textarea name=\"notes\" ng-model=\"item.notes\" md-maxlength=\"500\"></textarea>\r\n                            </md-input-container>\r\n                        </div>\r\n                        <md-divider ng-hide=\"$last\"></md-divider>\r\n                    </div>\r\n                    <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n                </div>\r\n            </div>\r\n            <!-- If Editing -->\r\n            <div ng-if=\"EducationForm.$visible\" layout=\"row\">\r\n                <div hide-sm flex=\"20\"></div>\r\n                <div flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\"><add-another add-fn=\"addEducation()\"></add-another></div>\r\n                <div flex=\"0\"  flex-gt-md=\"20\"></div>\r\n            </div>\r\n        </form>\r\n    </md-container>\r\n\r\n    <md-container style=\"margin-bottom: 70px;\" ng-if=\"!showEdit && !isEmptyEducation()\">\r\n        <form novalidate name=\"EducationForm\">\r\n            <div layout=\"row\">\r\n                <div hide-sm flex=\"20\"></div>\r\n                <h2 flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\" class=\"md-headline rel-box\">\r\n                    My Education\r\n                </h2>\r\n                <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n            </div>\r\n            <div class=\"profile-item\" layout=\"row\" ng-repeat=\"item in user.profile.profileDetails.education\" ng-show=\"item.school || item.organisations[0].name\">\r\n                <div hide-sm flex=\"20\" layout=\"column\" layout-align=\"start end\">\r\n                    <date-range edit=\"false\" start=\"item.startDate\" end=\"item.endDate\" current=\"item.isCurrent\"></date-range>\r\n                </div>\r\n                <div flex-sm=\"100\" flex=\"80\" flex-gt-md=\"60\">\r\n                    <div ng-hide=\"EducationForm.$visible\">\r\n                        <div class=\"md-subhead\">\r\n                            <span>{{item.degree}}</span><span class=\"inter\" ng-show=\"item.degree && (item.school || item.organisations[0].name)\">·</span><span class=\"bold\">{{item.organisations[0].name || item.school}}</span>\r\n                        </div>\r\n                        <p class=\"wrap-text\">{{item.notes}}</p>\r\n                    </div>\r\n                    <md-divider ng-hide=\"$last\"></md-divider>\r\n                </div>\r\n                <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n            </div>\r\n        </form>\r\n    </md-container>\r\n\r\n    <!------------------------------------------------------>\r\n    <!---------------------- SKILLS ------------------------>\r\n    <!------------------------------------------------------>\r\n    <div layout=\"row\" layout-align=\"center\" id=\"skills\" class=\"edit-box\" style=\"background-color:rgba(0, 0, 0, 0.03); padding: 50px 0;\" ng-show=\"showEdit || user.profile.profileDetails.skills.length > 0 || user.profile.profileDetails.technologies.length>0\">\r\n        <div class=\"md-content-container\">\r\n            <form novalidate name=\"SkillsForm\">\r\n                <div layout=\"row\" >\r\n                    <div flex=\"20\" flex-sm=\"0\"></div>\r\n                    <div flex=\"80\" flex-sm=\"100\" flex-gt-md=\"60\" class=\"rel-box\">\r\n                        <h2 class=\"md-headline\">\r\n                            Skills and knowledge\r\n                            <edit-button ng-show=\"showEdit\" form=\"SkillsForm\" inline=\"true\" save-fn=\"SaveUser()\"></edit-button>\r\n                        </h2>\r\n\r\n                        <div ng-if=\"SkillsForm.$visible\">\r\n                            <tip-banner local=\"true\" class=\"m-b-30\">\r\n                                Add your skills and abilities. We\'ll use these to match you to the most appropriate jobs. These skills are <b>automatically populated</b> based on fields you\'ve tagged in your projects and blogs. You can <b>add additional skills here</b> but we recommend you add a project to your portfolio to act as evidence.\r\n                            </tip-banner>\r\n                        </div>\r\n                        <evidenced-fields user=\"user\" edit=\"SkillsForm.$visible\"></evidenced-fields>\r\n                    </div>\r\n                    <div flex=\"0\" flex-gt-md=\"20\"></div>\r\n                </div>\r\n            </form>\r\n\r\n        </div>\r\n    </div>\r\n\r\n\r\n    <!------------------------------------------------------>\r\n    <!---------------------- FOOTER ------------------------>\r\n    <!------------------------------------------------------>\r\n    <form id=\"social\" name=\"FooterForm\" ng-hide=\"!user.profile.socialLinks\">\r\n        <div hide-footer-when-visible=\"{{userCanEdit}}\" class=\"divider-bar edit-box\" style=\"margin-bottom: -50px; background-position: bottom;\"\r\n           ng-style=\"{\'background-image\':\'url(\'+(user.profile.banner.url || alternateBanner)+\'?size=banner-lg&crop=true)\'}\">\r\n            <div layout=\"column\" layout-align=\"center center\" style=\"padding: 0px;\">\r\n                <div class=\"md-content-container content-sm\">\r\n                    <div style=\"min-height: 200px;\" class=\"rel-box\" layout=\"column\" layout-align=\"center center\">\r\n                        <edit-button ng-show=\"showEdit\" form=\"FooterForm\" inline=\"true\" save-fn=\"SaveUser()\"></edit-button>\r\n                        <p><social-links edit=\"FooterForm.$visible\" data=\"user.profile.socialLinks\" type=\"user\"></social-links></p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </form>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/user/user.html', '<div class=\"userView\" ng-class=\"{\'profileTab\':$state.includes(\'app.user.profile\')}\">\r\n    <form unsaved-warning-form novalidate name=\"forms.OverviewForm\" class=\"edit-box\">\r\n        <!-- EDITING  -->\r\n        <div ng-if=\"forms.OverviewForm.$visible\">\r\n            <upload-image icon=\"true\" md-ink-ripple class=\"block\" image=\"user.profile.banner.url\" name=\"BannerImage\" ng-model=\"user.profile.banner.url\">\r\n                <div class=\"user-banner-top divider-bar\" style=\"background-position: top;\"\r\n                ng-style=\"{\'background-image\':\'url(\'+(user.profile.banner.url || alternateBanner)+\'?size=banner-lg&crop=true)\'}\">\r\n                    <div></div>\r\n                </div>\r\n            </upload-image>\r\n        </div>\r\n        <!-- NOT EDITING  -->\r\n        <div ng-if=\"!forms.OverviewForm.$visible\">\r\n            <div class=\"user-banner-top divider-bar\" style=\"background-position: top;\"\r\n               ng-style=\"{\'background-image\':\'url(\'+(user.profile.banner.url || alternateBanner)+\'?size=banner-lg&crop=true)\'}\">\r\n                <div class=\"headerTitle\" layout=\"row\" layout-align=\"center\">\r\n                    <div class=\"md-content-container\" layout=\"row\" layout-align=\"space-between center\" ng-hide=\"$state.includes(\'app.user.profile\')\">\r\n                        <h1 class=\"capitalise no-margin text-white md-display-1\">{{user.profile.firstname}}\'s {{tabName}}</h1>\r\n                        <hide-if-owner owner=\"{{user._id}}\">\r\n                            <stat-button hidepublic hide-stat=\"true\" type=\"follow\" parent-type=\"user\" parent-id=\"{{user._id}}\" count=\"user.followers\"></stat-button>\r\n                        </hide-if-owner>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <md-container ng-show=\"$state.includes(\'app.user.profile\')\">\r\n            <div class=\"rel-box\">\r\n\r\n                <edit-button ng-if=\"showEdit\" form=\"forms.OverviewForm\" save-fn=\"SaveUser()\" inline=\"true\" hide-edit=\"true\"></edit-button>\r\n                <settings-button ng-if=\"showEdit\" ng-hide=\"forms.OverviewForm.$visible\">\r\n                    <md-menu-item><md-button ng-click=\"forms.OverviewForm.$edit()\">Edit info and banner</md-button></md-menu-item>\r\n                    <md-menu-item><md-button ng-click=\"linkedinImport($event)\">Import from linkedin</md-button></md-menu-item>\r\n                    <md-menu-item ng-if=\"isAdmin\"><md-button ng-click=\"authenticateAsUser(user._id)\">Authenticate as user</md-button></md-menu-item>\r\n                </settings-button>\r\n\r\n                <div class=\"user-picture-area text-center\">\r\n                    <!-- EDITING  -->\r\n                    <div ng-show=\"forms.OverviewForm.$visible\">\r\n                        <upload-image image=\"user.profile.picture\" ng-model=\"user.profile.picture\"\r\n                        name=\"ProfileImage\" icon=\"true\">\r\n                            <img id=\"picture\" class=\"picture md-whiteframe-z1\" ng-src=\"{{user.profile.picture || \'/assets/images/default/user-1.png\'}}?size=user&crop=true\">\r\n                        </upload-image>\r\n                    </div>\r\n                     <!-- NOT EDITING  -->\r\n                    <div ng-show=\"!forms.OverviewForm.$visible\">\r\n                        <img lightbox=\"true\" lightbox-image=\"user.profile.picture\" class=\"picture md-whiteframe-z1\" ng-src=\"{{user.profile.picture || \'/assets/images/default/user-1.png\'}}?size=user&crop=true\" alt=\"{{user.name}}\">\r\n                    </div>\r\n                </div>\r\n                <!-- NOT EDITING  -->\r\n                <div ng-show=\"!forms.OverviewForm.$visible\">\r\n                    <div class=\"user-info-area text-center\">\r\n                        <h1>{{user.profile.firstname}} {{user.profile.lastname}}</h1>\r\n                        <h3>{{user.blurb}}</h3>\r\n                        <div class=\"user-stats\">\r\n                            <md-button class=\"no-hover\" ui-sref=\"app.user.followers\">\r\n                                <small>FOLLOWERS</small>\r\n                                <h3>{{user.followers || 0}}</h3>\r\n                            </md-button>\r\n                            <md-button class=\"no-hover\" ui-sref=\"app.user.following\">\r\n                                <small>FOLLOWING</small>\r\n                                <h3>{{user.following || 0}}</h3>\r\n                            </md-button>\r\n                            <md-button class=\"no-hover\" ui-sref=\"app.user.projects\">\r\n                                <small>PROJECTS</small>\r\n                                <h3>{{user.numProjects || 0}}</h3>\r\n                            </md-button>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"user-buttons text-center\" style=\"margin-bottom: 40px;\">\r\n                        <hide-if-owner owner=\"{{user._id}}\">\r\n                            <stat-button hidepublic hide-stat=\"true\" type=\"follow\" parent-type=\"user\" parent-id=\"{{user._id}}\" count=\"user.followers\"></stat-button>\r\n                        </hide-if-owner>\r\n                    </div>\r\n                </div>\r\n                <!-- EDITING  -->\r\n                <div ng-show=\"forms.OverviewForm.$visible\">\r\n                   <br>\r\n                   <br>\r\n                   <br>\r\n                   <div id=\"name\" layout=\"row\" layout-sm=\"column\">\r\n                        <md-input-container flex>\r\n                            <label>First name*</label>\r\n                            <input required ng-model=\"user.profile.firstname\"\r\n                            name=\"FirstName\">\r\n                            <div ng-messages=\"forms.OverviewForm.FirstName.$error\">\r\n                                <div ng-message=\"required\">This is required.</div>\r\n                            </div>\r\n                        </md-input-container>\r\n                        <md-input-container flex>\r\n                            <label>Last Name*</label>\r\n                            <input required ng-model=\"user.profile.lastname\"\r\n                            name=\"LastName\">\r\n                            <div ng-messages=\"forms.OverviewForm.LastName.$error\">\r\n                                <div ng-message=\"required\">This is required.</div>\r\n                            </div>\r\n                        </md-input-container>\r\n                    </div>\r\n                    <md-input-container id=\"blurb\">\r\n                        <label>Blurb* (example: Propulsion Engineer at SpaceX)</label>\r\n                        <input required ng-model=\"user.blurb\" md-maxlength=\"100\"\r\n                        name=\"Blurb\">\r\n                        <div ng-messages=\"forms.OverviewForm.Blurb.$error\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                            <div ng-message=\"md-maxlength\">Your blurb has to be less than 100 characters long.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <location-search data=\"user.profile.location\" single=\"true\"></location-search>\r\n<!--\r\n                    <md-input-container>\r\n                        <label>School / University</label>\r\n                        <input ng-model=\"user.profile.school\">\r\n                    </md-input-container>\r\n                    <md-input-container>\r\n                        <label>Company</label>\r\n                        <input ng-model=\"user.profile.company\">\r\n                    </md-input-container>\r\n-->\r\n                    <span class=\"text-lightgrey\">*required field</span>\r\n                </div>\r\n            </div>\r\n        </md-container>\r\n    </form>\r\n    <div layout=\"row\" layout-align=\"center\">\r\n        <div class=\"md-content-container md-no-padding\">\r\n            <div ng-hide=\"forms.OverviewForm.$visible\">\r\n                <div class=\"text-tabs m-t-40 m-b-30\" layout=\"row\">\r\n                    <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div ui-view=\"projects\" ng-show=\"$state.includes(\'app.user.projects\')\" class=\"m-b-60\"></div>\r\n    <div ui-view=\"profile\"  ng-show=\"$state.includes(\'app.user.profile\')\"  class=\"\"></div>\r\n    <div ui-view=\"blog\"     ng-show=\"$state.includes(\'app.user.blogs\')\"    class=\"m-b-60\"></div>\r\n    <div ui-view=\"threads\"  ng-show=\"$state.includes(\'app.user.threads\')\"  class=\"m-b-60\"></div>\r\n    <div ui-view=\"comments\" ng-show=\"$state.includes(\'app.user.comments\')\" class=\"m-b-60\"></div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/usersettings/usersettings-account.html', '<h2 class=\"md-display-1\">Login Details</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Manage basic account information – your email, password and social accounts. You can link your STEMN account with Facebook and Linkedin. This will import your information and make it easier to log in.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n\r\n        <div class=\"card-z1 card-padding m-b-30\" id=\"updateusername\">\r\n            <div class=\"md-subhead\">Username</div>\r\n            <user-subdomain-input display-type=\"form\" username=\"user.stub\"></user-subdomain-input>\r\n        </div>\r\n\r\n       <div class=\"card-z1 card-padding m-b-30\">\r\n            <form unsaved-warning-form novalidate name=\"UpdateEmailForm\">\r\n                <div class=\"md-subhead\">Change Email</div>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Email</label>\r\n                    <input name=\"email\" ng-model=\"user.email\"\r\n                    required type=\"email\">\r\n                    <div ng-messages=\"UpdateEmailForm.email.$error\" ng-if=\"UpdateEmailForm.email.$dirty\">\r\n                        <div ng-message=\"required\">This is required.</div>\r\n                        <div ng-message=\"email\">That is not a valid email.</div>\r\n                    </div>\r\n                </md-input-container>\r\n                <div layout=\"row\">\r\n                    <div flex></div>\r\n                    <md-button type=\"submit\" class=\"md-raised md-accent md-cornered m-0 md-flat md-md\" ng-disabled=\"UpdateEmailForm.$invalid\" ng-click=\"updateEmail()\">Update email</md-button>\r\n                </div>\r\n            </form>\r\n        </div>\r\n\r\n\r\n        <div class=\"card-z1 card-padding m-b-30\" ng-if=\"user.accounts.local.email\">\r\n            <form unsaved-warning-form novalidate name=\"UpdatePasswordForm\">\r\n                <div class=\"md-subhead\">Change Password</div>\r\n                <md-input-container class=\"md-accent\">\r\n                    <label>Old Password</label>\r\n                    <input name=\"oldpassword\" ng-model=\"password.oldPassword\" required type=\"password\">\r\n                    <div ng-messages=\"UpdatePasswordForm.oldpassword.$error\" ng-if=\"UpdatePasswordForm.oldpassword.$dirty\">\r\n                        <div ng-message=\"required\">If only the world was that simple... You\'ll need the password :)</div>\r\n                    </div>\r\n                </md-input-container>\r\n                <div layout=\"row\">\r\n                    <md-input-container flex=\"50\" class=\"md-accent\">\r\n                        <label>New Password</label>\r\n                        <input name=\"newpassword\" ng-model=\"password.newPassword\" required type=\"password\">\r\n                        <div ng-messages=\"UpdatePasswordForm.newpassword.$error\" ng-if=\"UpdatePasswordForm.newpassword.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                    <md-input-container flex=\"50\" class=\"md-accent\">\r\n                        <label>Confirm new Password</label>\r\n                        <input name=\"confirmPassword\" ng-model=\"password.confirmPassword\" required type=\"password\">\r\n                        <div ng-messages=\"UpdatePasswordForm.confirmPassword.$error\" ng-if=\"UpdatePasswordForm.confirmPassword.$dirty\">\r\n                            <div ng-message=\"required\">This is required.</div>\r\n                        </div>\r\n                    </md-input-container>\r\n                </div>\r\n                <div layout=\"row\">\r\n                    <div flex></div>\r\n                    <md-button type=\"submit\" class=\"md-raised md-accent md-cornered m-0 md-flat md-md\" ng-disabled=\"UpdatePasswordForm.$invalid\" ng-click=\"updatePassword()\">Update password</md-button>\r\n                </div>\r\n            </form>\r\n        </div>\r\n\r\n\r\n       <div class=\"card-z1 card-padding m-b-30\">\r\n            <form id=\"linkaccount\" novalidate name=\"LinkAccountsForm\">\r\n                <div class=\"md-subhead\">Link Accounts</div>\r\n                <p>By linking accounts you\'ll be able to login to STEMN using either Facebook and/or LinkedIn. LinkedIn login won\'t work on your mobile phone but Facebook works a treat.</p>\r\n                <br>\r\n                <div layout=\"column\" layout-gt-sm=\"row\">\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : user.accounts.linkedin}\" ng-click=\"linkedinImport($event)\" layout=\"row\" layout-align=\"start center\">\r\n                        <md-icon md-svg-icon=\"linkedin\" style=\"margin-bottom: 3px;\"></md-icon>\r\n                        {{user.accounts.linkedin ? \'Connected with Linkedin\' : \'Connect with Facebook\'}}\r\n                    </md-button>\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : user.accounts.facebook}\" ng-click=\"authenticate(\'facebook\')\" layout=\"row\" layout-align=\"start center\">\r\n                        <md-icon md-svg-icon=\"facebook\" style=\"margin-bottom: 3px;\"></md-icon>\r\n                        {{user.accounts.facebook ? \'Connected with Facebook\' : \'Connect with Facebook\'}}\r\n                    </md-button>\r\n                </div>\r\n            </form>\r\n        </div>\r\n\r\n        <div class=\"card-z1 card-padding m-b-30\">\r\n            <form id=\"syncAccount\" novalidate name=\"SyncAccountForm\">\r\n                <div class=\"md-subhead\">Sync Accounts</div>\r\n                <p>Connect your dropbox account to take advantage of STEMN Sync. This will automatically sync your project files to STEMN.</p>\r\n                <br>\r\n                <div layout=\"column\" layout-gt-sm=\"row\">\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : user.accounts.dropbox.id }\" layout=\"row\" layout-align=\"start center\" ng-click=\"syncAuthorize(\'dropbox\')\">\r\n                        <md-icon md-svg-icon=\"dropbox\"></md-icon>\r\n                        {{user.accounts.dropbox.id ? \'Connected to Dropbox\' : \'Connect to Dropbox\'}}\r\n                    </md-button>\r\n                    <md-button class=\"md-accent md-border md-cornered m-l-0 md-sm md-flat\" ng-class=\"{\'md-raised\' : user.accounts.google.refreshToken }\" layout=\"row\" layout-align=\"start center\" ng-click=\"syncAuthorize(\'google\')\">\r\n                        <md-icon md-svg-icon=\"drive\"></md-icon>\r\n                        {{user.accounts.google.refreshToken ? \'Connected to Drive\' : \'Connect to Drive\'}}\r\n                    </md-button>\r\n                </div>\r\n            </form>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<md-divider class=\"m-v-60\"></md-divider>\r\n\r\n<h2 class=\"md-display-1\">Profile Details</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">Edit your name, profile picture, blurb and more. You can edit all your profile details on your user profile page.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n       <div class=\"card-z1 card-padding m-b-30\">\r\n            <div class=\"md-subhead\">Edit Profile</div>\r\n            <p>Edit your profile details on your profile page.</p>\r\n            <br>\r\n            <md-button class=\"md-accent md-raised md-cornered m-0 md-flat md-md\" ui-sref=\"app.user.profile({stub:user.stub})\">Edit profile</md-button>\r\n        </div>\r\n        <div class=\"card-z1 card-padding m-b-30\">\r\n            <div class=\"md-subhead\">Delete your account</div>\r\n            <p>Want to permanently delete your STEMN account? Email us at <a class=\"text-green\" href=\"goodbye@stemn.com\">goodbye@stemn.com</a></p>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/usersettings/usersettings-email.html', '<h2 class=\"md-display-1\">Email Notifications</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">We\'ll send email updates when you have new followers or when people comment on your project. If you get overwhelmed by your popularity, you can disable them here.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div class=\"card-z1 card-padding m-b-30\" ng-repeat=\"section in emailsToggles\">\r\n            <div layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\" class=\"toggle-group\" id=\"{{section.name}}\">\r\n                <div flex>\r\n                    <div class=\"md-subhead\">{{section.title}}</div>\r\n                    <p>{{section.description}}</p>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <md-button ng-show=\"section.toggles.length > 1\" class=\"md-icon-button\" ng-click=\"showPanel = !showPanel\" aria-label=\"More Settings\" ng-disabled=\"emailsGroupStates[section.name] == undefined\">\r\n                        <md-icon md-svg-icon=\"navigation:more_horiz\" class=\"collapse-panel-toggle\" ng-class=\"{\'open\' : showPanel || emailsGroupStates[section.name] == undefined}\"></md-icon>\r\n                        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Advanced Toggles</md-tooltip>\r\n                    </md-button>\r\n                    <div>\r\n                        <md-switch class=\"md-lg\" ng-change=\"toggleGroup(settings.emails, section.toggles, emailsGroupStates[section.name])\" ng-model=\"emailsGroupStates[section.name]\" ng-disabled=\"emailsGroupStates[section.name] == undefined\" aria-label=\"Toggle All\"></md-switch>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <collapse-panel show-panel=\"showPanel || emailsGroupStates[section.name] == undefined\">\r\n                <md-divider class=\"m-v-15\"></md-divider>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"toggle\" ng-repeat=\"toggle in section.toggles\" id=\"{{toggle}}\">\r\n                    <div flex>\r\n                        <div class=\"md-subhead\">{{toggleData[toggle].name}}</div>\r\n                        <p>{{toggleData[toggle].description}}</p>\r\n                    </div>\r\n                    <md-switch ng-change=\"toggleEmails()\" ng-model=\"settings.emails[toggle]\" aria-label=\"{{toggleData[toggle].name}}\"></md-switch>\r\n                </div>\r\n            </collapse-panel>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/usersettings/usersettings-feed.html', '<h2 class=\"md-display-1\">News Feed</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">You can change what shows in your news-feed here. Click on the advanced button if you are after fine-grain settings.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div class=\"card-z1 card-padding m-b-30\" ng-repeat=\"section in feedToggles\">\r\n            <div layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\" class=\"toggle-group\" id=\"{{section.name}}\">\r\n                <div flex>\r\n                    <div class=\"md-subhead\">{{section.title}}</div>\r\n                    <p>{{section.description}}</p>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <md-button ng-show=\"section.toggles.length > 1\" class=\"md-icon-button\" ng-click=\"showPanel = !showPanel\" aria-label=\"More Settings\" ng-disabled=\"feedGroupStates[section.name] == undefined\">\r\n                        <md-icon md-svg-icon=\"navigation:more_horiz\" class=\"collapse-panel-toggle\" ng-class=\"{\'open\' : showPanel || feedGroupStates[section.name] == undefined}\"></md-icon>\r\n                        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Advanced Toggles</md-tooltip>\r\n                    </md-button>\r\n                    <div>\r\n                        <md-switch class=\"md-lg\" ng-change=\"toggleGroup(settings.feed, section.toggles, feedGroupStates[section.name])\" ng-model=\"feedGroupStates[section.name]\" ng-disabled=\"feedGroupStates[section.name] == undefined\" aria-label=\"Toggle All\"></md-switch>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <collapse-panel show-panel=\"showPanel || feedGroupStates[section.name] == undefined\">\r\n                <md-divider class=\"m-v-15\"></md-divider>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"toggle\" ng-repeat=\"toggle in section.toggles\" id=\"{{toggle}}\">\r\n                    <div flex>\r\n                        <div class=\"md-subhead\">{{toggleData[toggle].name}}</div>\r\n                        <p>{{toggleData[toggle].description}}</p>\r\n                    </div>\r\n                    <md-switch ng-change=\"toggleFeed()\" ng-model=\"settings.feed[toggle]\" aria-label=\"{{toggleData[toggle].name}}\"></md-switch>\r\n                </div>\r\n            </collapse-panel>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/usersettings/usersettings-notifications.html', '<h2 class=\"md-display-1\">Site Notifications</h2>\r\n<div layout=\"column\" layout-gt-md=\"row\" class=\"md-row\">\r\n    <div class=\"md-col m-b-30\" flex=\"100\" flex-gt-md=\"40\">\r\n        <div class=\"text-subtitle-thin\">You can adjust what events send site notifications here. This will change in-site notifications only. Go to the \'Emails\' sections to change email notifications.</div>\r\n    </div>\r\n    <div class=\"md-col\" flex=\"100\" flex-gt-md=\"60\">\r\n        <div class=\"card-z1 card-padding m-b-30\" ng-repeat=\"section in notificationToggles\">\r\n            <div layout=\"column\" layout-gt-sm=\"row\" layout-align=\"start center\" class=\"toggle-group\" id=\"{{section.name}}\">\r\n                <div flex>\r\n                    <div class=\"md-subhead\">{{section.title}}</div>\r\n                    <p>{{section.description}}</p>\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"start center\">\r\n                    <md-button ng-show=\"section.toggles.length > 1\" class=\"md-icon-button\" ng-click=\"showPanel = !showPanel\" aria-label=\"More Settings\" ng-disabled=\"notificationGroupStates[section.name] == undefined\">\r\n                        <md-icon md-svg-icon=\"navigation:more_horiz\" class=\"collapse-panel-toggle\" ng-class=\"{\'open\' : showPanel || notificationGroupStates[section.name] == undefined}\"></md-icon>\r\n                        <md-tooltip md-direction=\"top\" md-autohide=\"true\">Advanced Toggles</md-tooltip>\r\n                    </md-button>\r\n                    <div>\r\n                        <md-switch class=\"md-lg\" ng-change=\"toggleGroup(settings.notifications, section.toggles, notificationGroupStates[section.name])\" ng-model=\"notificationGroupStates[section.name]\" ng-disabled=\"notificationGroupStates[section.name] == undefined\" aria-label=\"Toggle All\"></md-switch>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <collapse-panel show-panel=\"showPanel || notificationGroupStates[section.name] == undefined\">\r\n                <md-divider class=\"m-v-15\"></md-divider>\r\n                <div layout=\"row\" layout-align=\"start center\" class=\"toggle\" ng-repeat=\"toggle in section.toggles\" id=\"{{toggle}}\">\r\n                    <div flex>\r\n                        <div class=\"md-subhead\">{{toggleData[toggle].name}}</div>\r\n                        <p>{{toggleData[toggle].description}}</p>\r\n                    </div>\r\n                    <md-switch ng-change=\"toggleNotification()\" ng-model=\"settings.notifications[toggle]\" aria-label=\"{{toggleData[toggle].name}}\"></md-switch>\r\n                </div>\r\n            </collapse-panel>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/usersettings/usersettings-profile.html', '<h1 class=\"md-headline\">Profile Settings</h1>\r\n<md-divider></md-divider>\r\n<p>Want to change your name, blurb, education and more? This can all be accomplished directly from your profile page. Follow the link below.</p>\r\n<br>\r\n<md-button class=\"md-accent md-raised no-margin\" ui-sref=\"app.user.profile({stub:user.stub, edit:true})\">Update profile</md-button>\r\n<md-divider></md-divider>\r\n');
    }]);
})();
(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/views/usersettings/usersettings.html', '<div layout=\"row\" layout-align=\"center start\" class=\"userSettingsView\">\r\n    <div layout=\"column\" class=\"md-content-container overflow-x-box\">\r\n        <h1 flex class=\"md-display-2\">Settings</h1>\r\n        <div class=\"text-tabs tabs-light-grey text-tabs-top m-t-40 m-b-30\" layout=\"row\">\r\n            <a class=\"md-subhead\" ng-class=\"{\'active\':$state.includes(tab.sref)}\" ng-repeat=\"tab in tabs\" ui-sref=\"{{tab.sref}}\">{{tab.label}}</a>\r\n        </div>\r\n        <div flex ui-view></div>\r\n    </div>\r\n</div>\r\n');
    }]);
})();

//# sourceMappingURL=templates.js.map