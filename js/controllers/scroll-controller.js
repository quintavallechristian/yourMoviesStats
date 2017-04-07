angular.module('yourMovieStats')
.controller('ScrollController', function($$window ) {
   angular.element($window).bind("scroll", function(e) {
       console.log('scroll')
   })
})