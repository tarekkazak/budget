angular.module('budgetApp.service')
    .factory('templateService', ['$http', function($http){
	return (function() {
		
	    return {
	    	get : function(templatePath) {
		        return  $http.get(templatePath);
		      }
	    };
	}());
    
    }]);
