/*********************************************************
This module is used to set the page title and description


A SEO object is required in the $stateProvider config
for each view. If no object is found it will look at the
parent state to see if it has seo function.

NOTES:
Make sure that the seo object is defined on the root state
(this is usually app)

The index.html must have page.title and page.description
interpolations to set the seo params

EXAMPLE:
seo: function(resolve){
    return {
        title       : resolve.blog.name,
        description : resolve.blog.blurb
    }
}

*********************************************************/
angular.module('modules.seo', [
]);
angular.module('modules.seo').
run(function ($rootScope, $state, CoreLibrary) {
    $rootScope.page = {};
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        var resolve = $state.$current.locals.resolve.$$values;
        var toStateDetailed = toState.$$state();
        var seoFnTitle = CoreLibrary.checkStateParentsSeo(toStateDetailed, 'seo', 'title', resolve);
        var seoFnPic = CoreLibrary.checkStateParentsSeo(toStateDetailed, 'seo', 'picture', resolve);
        var seoFnDesc = CoreLibrary.checkStateParentsSeo(toStateDetailed, 'seo', 'description', resolve);

        var seoFn = {
            title: seoFnTitle,
            picture: seoFnPic,
            description: seoFnDesc
        }

        setPageSeo(seoFn)

        ////////////////////////////////////////////

        function setPageSeo(seo){
            $rootScope.page.title       = seo.title;
            $rootScope.page.description = seo.description;
            $rootScope.page.picture     = seo.picture;
        }
    });
});
