var App = angular.module('MyApp', []);

App.controller('Main', function($scope, $http, Auth){

    $scope.logueado = false;
    $scope.sending = false;
    $scope.error = false;

    $scope.log = function(){

        $scope.sending = true;
        $scope.error = false;

        var promise = Auth.conectar($scope.user, $scope.pass);
        promise.then(function(ok){
            $scope.logueado = true;
        }, function(){
            $scope.error = true;
        })
        .finally(function(){
            $scope.sending = false;
        })
    };

});




App.service('Auth', function($http, $q){

    this.conectar = function(user, pass) {

        var promise = $q(function(resolve, reject){

            $http.jsonp('http://138.219.41.17:3001/login?callback=JSON_CALLBACK', {
                params : {
                    user : user,
                    pass : pass
                }
            })
                .then(function(res){
                    if (res.data.status === 'ok') {
                        resolve();
                    } else {
                        reject();
                    }

                }, function(){
                    reject();
                });

        });


        return promise;
    };

}); 




angular.controller('LobbyController', function(){
    alert('HOILA!');
});