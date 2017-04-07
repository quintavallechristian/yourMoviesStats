angular.module('yourMovieStats')
.directive("scrollOnClick", function ($window, $location, $anchorScroll) {
    return{
		restrict: 'A',
		link: function(scope, $elm, attrs) {
			
			$(".app1").click(function() {
				$('html,body').animate({
					scrollTop: $("#second-row").offset().top},
					'slow');
			});
		}
    };
});