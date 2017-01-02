import './home.scss';

angular.module('views.home', []);
angular.module('views.home').

//value('HelloComponent', React.createClass({
//  render: function() {
//    return (
//        <div>
//            <div>asffsasfafs</div>
//            <div>asffsasfafs</div>
//            <div>asffsasfafs</div>
//            <div>asffsasfafs</div>
//            <div>asffsasfafs</div>
//            <div>asffsasfafs</div>
//            <div>asffsasfafs</div>
//        </div>
//    );
//  }
//})).

config(function ($stateProvider) {
    $stateProvider.
    state('app.home', {
        url: '/?type&projectview&location',
//        resolve: {
//            userdata: function (userdata) {
//                return userdata;
//            },
//        },
        template: require('./home.html'),
        controller: 'HomeViewCtrl',
        layout:{
//            chat: false,
            topBanner: false,
            bgColor : 'rgba(0, 0, 0, 0.03)',
            size    : 'md'
        },
        seo: function(resolve){
            return {
                title       : "STEMN - The Largest Community for Space Projects, Questions and Answers",
                description : "STEMN is a network connecting the knowledge of the international space community. Showcase your projects, get recognition for your research, and discover what the rest of the community is creating. Let's build space. Together."
            }
        }
    });
}).

controller('HomeViewCtrl', function (OnboardingService, $mdToast, FooterService, $scope, $state, Authentication, NewCreationsService, UserService, HttpQuery, EntityService) {

    // Scoped Data
    $scope.footerItems = FooterService.items;
    $scope.currentUser = Authentication.currentUser;

    // Scoped function
    $scope.newSomething = NewCreationsService.createModal; // function($event)
    $scope.learnMore    = OnboardingService.goToLanding   ; // function()
    $scope.authenticate = authenticate;                    // function(provider)

    UserService.getUser(Authentication.currentUser._id, 'lg').then(function(user){
        $scope.user = user;

        $scope.peopleQuery = HttpQuery({
            url: '/api/v1/users/'+user._id+'/peopleYouMayKnow',
            params: {
                size : 4,
            },
            requerySize: 12,
            onSuccess: function(results){
                // Remove self
                _.forEach(results, function(result){
                    EntityService.get('user', result._id, 'sm').then(function(user){
                        result.user = user;
                    })
                })

                return results
            }
        });
        $scope.peopleQuery.more();
    });
    var randomLetter = String.fromCharCode(97 + new Date().getHours()); // Character code of a = 97, will get a letter from A - W
    $scope.jobQuery = HttpQuery({
        url: '/api/v1/search',
        params: {
            type       : 'job',
            size       : 3,
            key        : 'name',
            select     : ['name','stub', 'organisations'],
            sort       : 'numApplications',
            criteria   : {
                name   : '/'+randomLetter+'/i'
            },
        }
    });
    $scope.jobQuery.more();



    // If the user is not authenticated send them to landing (if they haven't been there already)
    // If they have location state params, dont redirect
    if (!Authentication.currentUser.isLoggedIn() && !OnboardingService.beenLanding) {
        OnboardingService.goToLanding();
    }

    ////////////////////////////////////////////////

    function authenticate(provider) {
        Authentication.authenticate(provider).then(function(response) {
            $mdToast.show(
                $mdToast.simple().
                content('You can now log in to this account using ' + provider + '!')
            );
        }).catch(function(response) {
            $mdToast.show(
                $mdToast.simple().
                theme('warn').
                content('Oops... '+response.data.message || response.data)
            );
        });
    }
});