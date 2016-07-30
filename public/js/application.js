angular.module('votaCampinas', ['ngRoute', 'satellizer'])
  .config(["$routeProvider", "$locationProvider", "$authProvider", function($routeProvider, $locationProvider, $authProvider) {
    skipIfAuthenticated.$inject = ["$location", "$auth"];
    loginRequired.$inject = ["$location", "$auth"];
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'partials/home/home.html'
      })
      .when('/home', {
        templateUrl: 'partials/home/home.html'
      })
      .when('/projeto', {
        templateUrl: 'partials/projeto/projeto.html'
      })
      .when('/como-funciona', {
        templateUrl: 'partials/comofunciona/como-funciona.html'
      })
      .when('/contact', {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login/login.html',
        controller: 'loginController',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/ranking', {
        templateUrl: 'partials/ranking/ranking.html',
        controller: 'rankingController',
        resolve: { loginRequired: loginRequired }
      })
      .when('/cadastro', {
        templateUrl: 'partials/cadastro/cadastro.html',
        controller: 'cadastroController',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/prioridades', {
        templateUrl: 'partials/prioridades/prioridades.html',
        controller: 'prioridadesController',
        resolve: { loginRequired: loginRequired }
      })
      .when('/perfil', {
        templateUrl: 'partials/perfil/perfil.html',
        controller: 'perfilController',
        resolve: { loginRequired: loginRequired }
      })
      .when('/perguntas', {
        templateUrl: 'partials/questoes/questoes.html',
        controller: 'questoesController',
        resolve: { loginRequired: loginRequired }
      })
      .when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'SignupCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/account', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: { loginRequired: loginRequired }
      })
      .when('/forgot', {
        templateUrl: 'partials/forgot.html',
        controller: 'ForgotCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .when('/reset/:token', {
        templateUrl: 'partials/reset.html',
        controller: 'ResetCtrl',
        resolve: { skipIfAuthenticated: skipIfAuthenticated }
      })
      .otherwise({
        templateUrl: 'partials/404.html'
      });

    $authProvider.loginUrl = '/login';
    $authProvider.signupUrl = '/signup';
    $authProvider.facebook({
      url: '/auth/facebook',
      clientId: '980220002068787',
      redirectUri: 'http://localhost:3000/auth/facebook/callback'
    });

    function skipIfAuthenticated($location, $auth) {
      if ($auth.isAuthenticated()) {
        $location.path('/');
      }
    }

    function loginRequired($location, $auth) {
      if (!$auth.isAuthenticated()) {
        $location.path('/login');
      }
    }
  }])
  .run(["$rootScope", "$window", function($rootScope, $window) {
    if ($window.localStorage.user) {
      $rootScope.currentUser = JSON.parse($window.localStorage.user);
    }
  }]);

angular.module('votaCampinas')
  .controller('ContactCtrl', ["$scope", "Contact", function($scope, Contact) {
    $scope.sendContactForm = function() {
      Contact.send($scope.contact)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('votaCampinas')
  .controller('ForgotCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.forgotPassword = function() {
      Account.forgotPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };
  }]);

angular.module('votaCampinas')
  .controller('HeaderCtrl', ["$scope", "$location", "$window", "$auth", function($scope, $location, $window, $auth) {
    $(".button-collapse").sideNav();

    $scope.closeNav = function() {
      $(".button-collapse").sideNav('hide');
    };
    
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.user;
      $location.path('/');
      $scope.closeNav();
    };
  }]);

angular.module('votaCampinas')
  .controller('LoginCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function($scope, $rootScope, $location, $window, $auth) {
    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function(response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);
angular.module('votaCampinas')
  .controller('ProfileCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", "Account", function($scope, $rootScope, $location, $window, $auth, Account) {
    $scope.profile = $rootScope.currentUser;

    $scope.updateProfile = function() {
      Account.updateProfile($scope.profile)
        .then(function(response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.changePassword = function() {
      Account.changePassword($scope.profile)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $window.scrollTo(0, 0);
          $scope.messages = {
            error: [response.data]
          };
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };

    $scope.deleteAccount = function() {
      Account.deleteAccount()
        .then(function() {
          $auth.logout();
          delete $window.localStorage.user;
          $location.path('/');
        })
        .catch(function(response) {
          $scope.messages = {
            error: [response.data]
          };
        });
    };
  }]);
angular.module('votaCampinas')
  .controller('ResetCtrl', ["$scope", "Account", function($scope, Account) {
    $scope.resetPassword = function() {
      Account.resetPassword($scope.user)
        .then(function(response) {
          $scope.messages = {
            success: [response.data]
          };
        })
        .catch(function(response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    }
  }]);

angular.module('votaCampinas')
  .controller('SignupCtrl', ["$scope", "$rootScope", "$location", "$window", "$auth", function ($scope, $rootScope, $location, $window, $auth) {
    $scope.signup = function () {
      console.log($scope.user)
      $auth.signup($scope.user)
        .then(function (response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function (response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function (response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function (response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  }]);

angular.module('votaCampinas')
  .factory('Account', ["$http", function($http) {
    return {
      updateProfile: function(data) {
        return $http.put('/account', data);
      },
      changePassword: function(data) {
        return $http.put('/account', data);
      },
      deleteAccount: function() {
        return $http.delete('/account');
      },
      forgotPassword: function(data) {
        return $http.post('/forgot', data);
      },
      resetPassword: function(data) {
        return $http.post('/reset', data);
      }
    };
  }]);
angular.module('votaCampinas')
  .factory('Contact', ["$http", function($http) {
    return {
      send: function(data) {
        return $http.post('/contact', data);
      }
    };
  }]);
(function () {
  'use strict';
  var app = angular.module('votaCampinas');
  var cadastroController = function ($scope, $rootScope, $location, $window, $auth) {
    $scope.user = {};
    $scope.required = true;

    $scope.enviar = function () {
      $scope.user.gender = $('#sexo').val();

      $auth.signup($scope.user)
        .then(function (response) {
          $auth.setToken(response);
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function (response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function (response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function (response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };

    $('select').material_select();
    $('#data-nascimento').mask('00/00/0000');
  };
  cadastroController.$inject = ["$scope", "$rootScope", "$location", "$window", "$auth"];

  app.controller('cadastroController', cadastroController);
}());

(function () {

  'use strict';

  var app = angular.module('votaCampinas');

  var loginController = function ($scope, $rootScope, $location, $window, $auth) {
    $scope.enviar = function () {
      $auth.login($scope.user)
        .then(function (response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/account');
        })
        .catch(function (response) {
          $scope.messages = {
            error: Array.isArray(response.data) ? response.data : [response.data]
          };
        });
    };

    $scope.authenticate = function (provider) {
      $auth.authenticate(provider)
        .then(function (response) {
          $rootScope.currentUser = response.data.user;
          $window.localStorage.user = JSON.stringify(response.data.user);
          $location.path('/');
        })
        .catch(function (response) {
          if (response.error) {
            $scope.messages = {
              error: [{ msg: response.error }]
            };
          } else if (response.data) {
            $scope.messages = {
              error: [response.data]
            };
          }
        });
    };
  };
  loginController.$inject = ["$scope", "$rootScope", "$location", "$window", "$auth"];

  app.controller('loginController', loginController);

}());

(function() {

  'use strict';

  var app = angular.module('votaCampinas');

  var perfilController = function($scope) {    
  }
  perfilController.$inject = ["$scope"];

  app.controller('perfilController', perfilController);

}());

(function() {

  'use strict';

  var app = angular.module('votaCampinas');

  var prioridadesController = function($scope) {    
  }
  prioridadesController.$inject = ["$scope"];

  app.controller('prioridadesController', prioridadesController);

}());
(function () {
  'use strict';

  var app = angular.module('votaCampinas');

  var questoesController = function ($scope, $timeout, perguntasFactory) {
    perguntasFactory.obterPerguntas()
    .success(function (perguntas) {
      $scope.perguntas = perguntas;
    });

  	var prioridades  = [],
  		inTransition = false;

  	$scope.model = {
  		prioridade: "",
  		selecionadas: {}
  	}

  	$scope.pagina = 0;

  	$scope.selecionadas = {};

    $scope.next = function () {
      perguntasFactory.salvarResposta($scope.perguntas[$scope.pagina])
      .success(function () {
        ++$scope.pagina;
      });
  		// if (!inTransition) {
  		// 	inTransition = true;
  		// 	$timeout(function (){
		  // 		prioridades.push($scope.model.prioridade);
			// 	$scope.model.prioridade = 0;
			// 	$scope.pagina += 1;
			// 	return inTransition = false;
			// }, 1200);
  		// }
  	}

  	$scope.back = function (){
  		prioridades.pop();
  		$scope.model.prioridade = 0;
		$scope.pagina -= 1;
  		console.log(prioridades);
  	}

  }
  questoesController.$inject = ["$scope", "$timeout", "perguntasFactory"];

  app.controller('questoesController', questoesController);

}());

(function () {
  'use strict';

  var app = angular.module('votaCampinas');

  var perguntasFactory = function ($rootScope, $http) {
    return {
      obterPerguntas: obterPerguntas,
      salvarResposta: salvarResposta
    };

    function obterPerguntas () {
      return $http.get('/api/perguntas');
    }

    function salvarResposta (pergunta) {
      console.log($rootScope);
      delete pergunta.pergunta;

      var obj = {
        usuarioId: $rootScope.currentUser.id,
        pergunta: pergunta
      };

      return $http.post('/api/respostas', obj);
    }
  };
  perguntasFactory.$inject = ["$rootScope", "$http"];

  app.factory('perguntasFactory', perguntasFactory);
})();

(function() {

  'use strict';

  var app = angular.module('votaCampinas');

  var rankingController = function ($scope) {
  };
  rankingController.$inject = ["$scope"];

  app.controller('rankingController', rankingController);

}());