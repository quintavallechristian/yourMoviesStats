angular.module('yourMovieStats')
.directive("scroll", function ($window, $location, $anchorScroll) {
    return{
		restrict: 'A',
		link: function(scope, $elm, attrs) {
			scrollPos = $(window).scrollTop();			
			angular.element($window).bind("scroll", function() {
				opacity = 1 - scrollPos/500;
				$("#headerContainer").css("background", "rgba(1,87,155,"+opacity+" )");
				if($(window).scrollTop() >scrollPos){
					$("nav").slideUp();
					$("#logo").css("text-shadow", "2px 2px 1px rgba(0,0,0,0.2)");
					$("#logo").css("opacity", Math.max(opacity, 0.2));
					$("#searchContainer").css("opacity", "0");
					$("#searchContainer .form-control").css("cursor", "default");
					$("#headerContainer").css("box-shadow", "0px 0px 0px rgba(0,0,0,.2)");
				}
				else{
					$("nav").slideDown();
					$("#logo").css("text-shadow", "0px 0px rgba(0,0,0,0.2)");
					$("#logo").css("opacity", "1");
					$("#searchContainer").css("opacity", "1");
					$("#searchContainer .form-control").css("cursor", "auto");
					$("#headerContainer").css("box-shadow", "0px 3px 0px rgba(0,0,0,.2)");
					$("#headerContainer").css("background", "#01579B");
				}
				scrollPos = $(window).scrollTop();
				var rowPos = $("#second-row").offset().top - $(window).scrollTop();
				console.log(rowPos);
				if(rowPos < 400){
					$('.rotating').each(function(){
							$(this).removeClass("undisplayed");
							$(this).removeClass("animated rotateOut");
							$(this).addClass("animated rotateIn");
					});
					$('.fading').each(function(){
							$(this).removeClass("undisplayed");
							$(this).removeClass("animated fadeOut");
							$(this).addClass("animated fadeIn");
					});
					$('.fadingInUp').each(function(){
							$(this).removeClass("undisplayed");
							$(this).removeClass("animated fadeOutUp");
							$(this).addClass("animated fadeInUp");
					});
					$('.fadingInRight').each(function(){
							$(this).removeClass("undisplayed");
							$(this).removeClass("animated fadeOutRight");
							$(this).addClass("animated fadeInRight");
					});
				}
				else{
					$('.rotating').each(function(){
							$(this).removeClass("animated rotateIn");
							$(this).addClass("animated rotateOut");
					});
					$('.fading').each(function(){
							$(this).removeClass("animated fadeIn");
							$(this).addClass("animated fadeOut");
					});
					$('.fadingInUp').each(function(){
							$(this).removeClass("animated fadeInUp");
							$(this).addClass("animated fadeOutUp");
					});
					$('.fadingInRight').each(function(){
							$(this).removeClass("animated fadeInRight");
							$(this).addClass("animated fadeOutRight");
					});
				}
			});
		}
    };
});