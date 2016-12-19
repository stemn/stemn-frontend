angular.module('views.app')
    .controller('AppViewCtrl', function (userdata, $scope, Authentication, $mdSidenav, $state) {
        // Set data to scope
        $scope.Authentication = Authentication;


        $scope.menu = [{
            name: 'Analytics',
            pages: [{
                name: 'Dashboard',
                sref: 'app.usage'
        }, {
                name: 'Growth Accounting',
                sref: 'app.growth'
        }, {
                name: 'Most Popular',
                sref: 'app.popular'
        }]
    }, {
            name: 'Entities',
            pages: [{
                name: 'Users',
                sref: 'app.users'
        }, {
                name: 'Fields',
                sref: 'app.fields'
        }, {
                name: 'Organisations',
                sref: 'app.organisations'
        }, {
                name: 'Projects',
                sref: 'app.projects'
        }, {
                name: 'Threads',
                sref: 'app.threads'
        }, {
                name: 'Jobs',
                sref: 'app.jobs'
        }]
    }, {
            name: 'Job Manager',
            pages: [{
                name: 'Applications',
                sref: 'app.job-manager.applications'
        }, {
                name: 'Applicants',
                sref: 'app.job-manager.applicants'
        }, {
                name: 'Companies',
                sref: 'app.job-manager.organisations'
        }]
    }, {
            name: 'CRM',
            pages: [{
                name: 'Emails',
                sref: 'app.emails'
        }, {
                name: 'CRM',
                sref: 'app.crm'
        }, {
                name: 'Reminders',
                sref: 'app.reminders'
        }]
    }, {
            name: 'Referrals',
            pages: [{
                name: 'Referrals',
                sref: 'app.referrals'
        }]
    }, {
            name: 'Channel Tools',
            pages: [{
                name: 'Github',
                sref: 'app.github'
        }]
    }]

        // Toggle Sidebar and swap icon -------------------------------------------------
        $scope.menuIcon = 'menu';
        $scope.toggleSidenav = function () {
            $mdSidenav('left').open();
        };
        // TODO : Try and remove this watch? Look into MD sidenav service
        $scope.$watch(
            function () {
                $scope.menuIcon = $mdSidenav('left').isOpen() ? 'close' : 'menu';
            }
        );
        $scope.$state = $state;
    });
