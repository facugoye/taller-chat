angular.module('tallerChat', [])
.service('chat', ['$q', '$http', '$timeout', function($q, $http, $timeout){

    var self = this;
    var apiUrl = 'http://138.219.41.17:3001/ACTION?callback=JSON_CALLBACK';

    self.cid = '';
    self.me = {};
    self.users = [];
    self.messages = [];
    self.ready = false;
    self.monitorActive = false;


    self.feed = function(cid){
        self.cid = self.cid || cid;
        if (self.monitorActive) return false;
        return feedCycle();
    }

    var feedCycle = function(){

        self.monitorActive = true;

        return $q(function(resolve, reject){

            if (self.cid) {

                $http.jsonp(apiUrl.replace('ACTION', 'status'), {
                    params : {
                        cid : self.cid
                    },
                    timeout : 60000
                })
                    .then(function(res){

                        if (res.data.status === 'ok') {

                            self.users = res.data.users;
                            self.messages = res.data.messages;
                            self.me = res.data.me;

                            self.ready = true;
                            feedCycle(); //Ciclo recursivo
                            resolve();
                        } else {
                            self.monitorActive = false;
                            reject();
                            $timeout(function(){
                                self.feed();
                            }, 8000);
                        }

                    }, function(){
                        self.monitorActive = false;
                        reject();
                        $timeout(function(){
                            self.feed();
                        }, 8000);
                    });

                resolve();

            } else {
                self.monitorActive = false;
                reject();
                $timeout(function(){
                    self.feed();
                }, 8000);
            }
        });
    };

    self.sendMessage = function(message){
        $http.jsonp(apiUrl.replace('ACTION', 'chat'), {
            params : {
                from : self.model.token,
                message : message
            }
        });
    };

}]);