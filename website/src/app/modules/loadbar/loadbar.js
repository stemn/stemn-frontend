import './loadbar.scss';
import 'angular-loading-bar';
import 'angular-loading-bar/src/loading-bar.css';

angular.module('modules.loadbar', ['angular-loading-bar']);
angular.module('modules.loadbar').

config(function ($httpProvider, cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    $httpProvider.interceptors.unshift(function() {
        return {
            request: function(config) {
                // disable the angular loading bar for certain urls
                if (config.url.indexOf('api/v1/notifications') > -1 ||
                    config.url.indexOf('api/v1/search') > -1        ||
                    config.url.indexOf('api/v1/events') > -1        ||
                    config.url.indexOf('maps.googleapis.com') > -1  ||
                    config.url.indexOf('autodesk.com') > -1         ||
                    config.url.indexOf('api/v1/geolocate') > -1     ){
                    config.ignoreLoadingBar = true;
                }
                return config;
            }
        };
    });
});
