angular.module('views.landing', [
    'views.landing.jobs',
    'views.landing.recruiting',
    'views.landing.pricing',
    'views.landing.sync',
    'views.landing.community',

    'modules.authentication',
    'modules.layout-options',
	'modules.user-subdomain',
    'modules.carousel',
]);
angular.module('views.landing').

config(function ($stateProvider) {
    $stateProvider.
    state('app.landing', {
		abstract: true,
        url: '/landing',
        templateUrl: 'app/views/landing/landing.html',
		controller: 'LandingViewCtrl',
        layout: {
            horizontalMenu: false,
            topBanner     : false,
        },
        seo: function(resolve){
            return {
                title       : 'Welcome to STEMN - Connecting the Aerospace Community',
            }
        },
    })
}).

controller('LandingViewCtrl', function ($scope, $state, Authentication, AuthenticationModalService, OnboardingService, $mdSidenav) {
    OnboardingService.beenLanding = true;

    $scope.toggleMenu = toggleMenu;
    $scope.login = function(event, state){
        if (!Authentication.currentUser.isLoggedIn()) {
            AuthenticationModalService.login(event)
        }
        else {
            $state.go(state||'app.home');
        }
    }

    $scope.menu = [{
        label : 'Sync',
        sref  : 'app.landing.sync',
    },{
        label : 'Community',
        sref  : 'app.landing.community',
    }]

    /////////////////////

    function toggleMenu(){
        $mdSidenav('landing').toggle().then(function(){
        })
    }


}).


directive('particles', function ($window) {
    /*****************************************
    Make sure to pass in an id on the element
    <particles id="stars-1"></particles>
    /****************************************/
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="particleJs"></div>',
        link: function (scope, element, attrs, fn) {
            var options = {
                "particles": {
                    "number": {
                        "value": 200,
                        "density": {
                            "enable": true,
                            "value_area": 600
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        },
                        "image": {
                            "src": "",
                            "width": 180,
                            "height": 240
                        }
                    },
                    "opacity": {
                        "value": 1,
                        "random": true,
                        "anim": {
                            "enable": true,
                            "speed": 1,
                            "opacity_min": 0,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 2,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 4,
                            "size_min": 0.3,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": false,
                        "distance": 150,
                        "color": "#ffffff",
                        "opacity": 0.05,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 0.5,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 600
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "repulse"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 80,
                            "line_linked": {
                                "opacity": 0.5
                            }
                        },
                        "bubble": {
                            "distance": 50,
                            "size": 0,
                            "duration": 2,
                            "opacity": 0,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 10
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            };

            if (attrs.altDisplay) {
                options = {
                  "particles": {
                    "number": {
                      "value": 80,
                      "density": {
                        "enable": true,
                        "value_area": 800
                      }
                    },
                    "color": {
                      "value": "#d8d8d8"
                    },
                    "shape": {
                      "type": "circle",
                      "stroke": {
                        "width": 0,
                        "color": "#000000"
                      },
                      "polygon": {
                        "nb_sides": 5
                      },
                      "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                      }
                    },
                    "opacity": {
                      "value": 0.5,
                      "random": false,
                      "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                      }
                    },
                    "size": {
                      "value": 3,
                      "random": true,
                      "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                      }
                    },
                    "line_linked": {
                      "enable": true,
                      "distance": 150,
                      "color": "#b4b4b4",
                      "opacity": 0.4,
                      "width": 1
                    },
                    "move": {
                      "enable": true,
                      "speed": 3,
                      "direction": "none",
                      "random": false,
                      "straight": false,
                      "out_mode": "out",
                      "bounce": false,
                      "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                      }
                    }
                  },
                  "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                      "onhover": {
                        "enable": true,
                        "mode": "grab"
                      },
                      "onclick": {
                        "enable": true,
                        "mode": "push"
                      },
                      "resize": true
                    },
                    "modes": {
                      "grab": {
                        "distance": 400,
                        "line_linked": {
                          "opacity": 1
                        }
                      },
                      "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                      },
                      "repulse": {
                        "distance": 159.84015984015983,
                        "duration": 0.4
                      },
                      "push": {
                        "particles_nb": 4
                      },
                      "remove": {
                        "particles_nb": 2
                      }
                    }
                  },
                  "retina_detect": true
                }

            }

            if(attrs.noInteractive){
                options.interactivity.events.onhover.enable = false;
                options.interactivity.events.onclick.enable = false;
                options.particles.move.speed = 0.5;
            }

            $window.particlesJS(attrs.id, options);

        }
    };
});
