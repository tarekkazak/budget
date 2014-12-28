angular.module('budgetApp.service')
    .factory('templateService', ['$http', function($http){
	return (function() {
	    var promise;
		
	    return {
	    	get : function(templatePath) {
			  if(!promise) {
			      promise = $http.get(templatePath);
			  }
			  return promise;
		      }
	    };
	}());
    
    }]);
