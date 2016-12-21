import restangular from 'restangular';

angular.module('modules.restangular', [
    'restangular',
    'modules.authentication',
]);
angular.module('modules.restangular').

run(function (Restangular, $mdToast, Authentication) {
    Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
        if (response.status === 401) {
            if (response.config.url === '/api/v1/notifications') {
                // TODO: investigate further
                // log the user out if they can't get their notification rather than prompting them
                // that they can't. i'm guessing this is happening because they have logged out, but
                // another tab is open where the state of the app hasn't changed, but localstorage has
                Authentication.currentUser.logout();
            } else {
                $mdToast.show(
                    $mdToast.simple().
                    theme('warn').
                    content(response.data.error || 'You\'re not authorized to do that!')
                );
            }
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content(response.data.error || 'You\'re not authorized to do that!')
            );
        } else if (response.status === 404) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content(response.data.error || 'Couldn\'t find that, sorry.')
            );
        } else if (response.status === 480) { // custom stemn error code
                        $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('Can\'t do that '+ response.data.error)
            );
        } else if (response.status === 422) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('Oops... '+ response.data.error)
            );
        } else {
            return false;
        }
    });
}).

config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/v1');
    RestangularProvider.setRestangularFields({
        id: '_id',
    });

    // transform textual response of 'true' to boolean true and textual 'false' to boolean false for http responses
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        if (data === 'false') {
            data = false;
        } else if (data === 'true') {
            data = true;
        } else if (data === 'null') {
            data = null;
        }
        return data;
    });
});
