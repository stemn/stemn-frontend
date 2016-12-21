import './partners.scss';
angular.module('views.partners', []);
angular.module('views.partners').

config(function ($stateProvider) {
    $stateProvider.
    state('app.partners', {
        url: '/partners',
        templateUrl: 'app/views/partners/partners.html',
        controller: function ($scope, $rootScope) {
			$scope.partners = [
				{
					name  : 'AmericaSpace',
					desc  : "AmericaSpace is a spaceflight news media outlet based out of Austin, Texas, with our staff of writers & photographers spread out across the country's many NASA centers and launch sites. We work hard to deliver the latest news & imagery to our viewers, with numerous aerospace journalists, photojournalists & experts from within the aerospace industry providing in-depth content on a daily basis.",
					url   : '/org/americaspace/overview',
					image : 'AmericaSpace.png',
					links : {
						facebook : "AmericaSpace.org/timeline",
						linkedin : "company/americaspace",
						twitter  : "americaspace",
						website  : "www.americaspace.com/",
						youtube  : "user/AmericaSpace",
					}
				},{
					name  : 'AYAA',
					desc  : "The Australian Youth Aerospace Association (AYAA) is a not-for-profit organisation managed by student volunteers and young professionals, who have the objective of promoting education, awareness and involvement in the aerospace industry to young Australians.",
					url   : '/org/australian-youth-aerospace-association-ayaa/overview',
					image : 'AYAA.jpg',
					links : {
						facebook : "YouthAeroAssoc",
						website  : "ayaa.com.au"
					}
				},{
					name  : 'SGAC',
					desc  : "The Space Generation Advisory Council (SGAC) works on the international, national and local level to link together university students and young professionals. SGAC has thousands of members in over 100 countries around the world.",
					url   : '/org/space-generation-advisory-council-sgac/overview',
					image : 'SGAC.jpg',
					links : {
						facebook : "spacegeneration",
						linkedin : "company/space-generation-advisory-council",
						twitter  : "sgac",
						website  : "spacegeneration.org/",
						youtube  : "user/spacegeneration",
					}
				},{
					name  : 'The University Of Sydney',
					desc  : "The University of Sydney is an Australian public university in Sydney. Founded in 1850, it is Australia's first university and is regarded as one of its most prestigious, ranked as the world's 27th most reputable university.",
					url   : '/org/the-university-of-sydney-usyd/overview',
					image : 'Usyd.jpg',
					links : {
						facebook : "sydneyuni",
						website  : "sydney.edu.au/",
						twitter  : "Sydney_Uni"
					}
				},{
					name  : 'SEDS - SJSU',
					desc  : "SEDS is an international organization whose primary goal is to promote the exploration of space through projects, education, and outreach. At SEDS SJSU, we specifically focus on project and technology development that will extend humanity’s reach into space.",
					url   : '/org/seds-san-jose-state-university-sjsu/overview',
					image : 'seds-sjsu.jpg',
					links : {
						facebook : "sedssjsu",
						website  : "seds-sjsu.org",
					}
				},
			]
        },
        layout:{
            footer: true,
        },
        seo: function(resolve){
            return {
                title       : "Become a Partner and Help the Mission - STEMN ",
            }
        }
    });
});
