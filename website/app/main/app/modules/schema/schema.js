angular.module('modules.schema', [
]);

angular.module('modules.schema').

directive('schemaJsonLd', function ($http) {
    return {
        restrict: 'E',
        replace: true,
		template: '<script type="application/ld+json"></script>',
        link : function (scope, element, attrs){
			var jsonLd = {
//			  "@context": "http://schema.org",
//			  "@type": "NewsArticle",
//			  "headline": "Article headline",
//			  "alternativeHeadline": "The headline of the Article",
//			  "image": [
//				"thumbnail1.jpg",
//				"thumbnail2.jpg"
//			  ],
//			  "datePublished": "2015-02-05T08:00:00+08:00",
//			  "description": "A most wonderful article",
			  "articleBody": "The full body of the article"
			}
			element[0].innerHTML = JSON.stringify(jsonLd);
        }
    };
});
