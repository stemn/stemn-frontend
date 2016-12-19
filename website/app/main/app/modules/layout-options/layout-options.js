angular.module('modules.layout-options', []);
angular.module('modules.layout-options').


run(function ($timeout, $rootScope, LayoutOptions, HorizontalMenuService, TopBannerService, CoreLibrary) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // Reset all the layout options to false.
        LayoutOptions.default();

        var toStateDetailed = toState.$$state();

        // Set layout
        var layout = CoreLibrary.checkStateParents(toStateDetailed, 'layout');
        if(layout){
            if(layout.size         == 'lg')  {LayoutOptions.body.size = 'lg'}
            if(layout.size         == 'md')  {LayoutOptions.body.size = 'md'}
            if(layout.topBanner    === false){TopBannerService.hideBanner()}
            if(layout.footer       === true) {LayoutOptions.footer.hideFooter = false}
            if(layout.chat       === false){LayoutOptions.chat.hideButton = true}
            if(layout.hideOverflow === true){LayoutOptions.body.hideOverflow = true}
            if(layout.bgColor)              {LayoutOptions.body.color = layout.bgColor}
        }
        layout = layout || {};
        HorizontalMenuService.enable(layout.horizontalMenu)
    });
}).

service('LayoutOptions', function($timeout, TopBannerService, Authentication) {
    var lib = {
        header       : {},
        body         : {},
        footer       : {},
        overlay      : {},
        settings     : {},
        back         : {},
        chat       : {},
        // Default function is run on StateChange
        // Special layout are set from within sub-controllers
        default       : function (){
            lib.header.landing        = false;
            lib.body.hideOverflow     = false;
            lib.body.disableScroll    = false;
            lib.body.size             = 'sm';   // sm || md || lg - This adjusts the content container size
            lib.body.color            = '#fff';
            lib.footer.hideFooter     = true;
            lib.footer.hideSubFooter  = false;
            lib.footer.hideMainFooter = false;
            lib.overlay.highlight     = false;
            lib.overlay.loading       = false;
            lib.settings.showSettings = false;
            lib.chat.hideButton     = false;

            if(!Authentication.currentUser.isLoggedIn() || !Authentication.currentUser.verified){
                if(!TopBannerService.banner.closed){
                    TopBannerService.showBanner();
                }
            }
        },
    }
    return lib;
});
