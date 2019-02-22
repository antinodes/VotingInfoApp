'use strict';

vipApp.factory('$authService', function ($rootScope, $location, $timeout, $http, $appService, $appProperties, angularAuth0) {

  function login() {
    var opts = {};
    if (window.crypto === undefined) {
      console.log("setting up local nonce");
      opts = {nonce: getNonce()};
    }
    angularAuth0.authorize(opts);
  }

  function handleAuthentication() {
    console.log("handling Authentication");
    if (isAuthenticated()) {
      setupAuthentication();
    } else {
      var opts = {};
      if (window.crypto === undefined) {
        console.log("getting local nonce");
        opts = {nonce: getNonce()};
      }
      angularAuth0.parseHash(opts, function(err, authResult) {
        clearLocalState();
        if (authResult && authResult.accessToken && authResult.idToken) {
          console.log("handleAuthentication: success");
          setSession(authResult);
          setupAuthentication();
        } else if (err) {
          $timeout(function() {
            $location.url('/');
          });
          console.log(err);
        } else {
          $timeout(function() {
            $location.url('/');
          });
        }
      });
    }
  }

  function createLogoutUrl() {
    var returnTo = encodeURIComponent($location.absUrl().split('#')[0] + "#/logout");
    return "https://" + config.auth0.domain +"/v2/logout?returnTo=" + returnTo +
     "&client_id=" + config.auth0.clientID;
  }

  function setupAuthentication() {
    console.log("beginning of setupAuthentication");
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + getAccessToken();
    getUser($appService.setUserSuccess, $appService.setUserFailure);
    $rootScope.logoutUrl = createLogoutUrl();
    if($location.url() === "/" || $location.url() === "" ||
       $location.url() === "/login-callback") {
      $location.url("/feeds");
    }
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('auth0_access_token', authResult.accessToken);
    localStorage.setItem('auth0_id_token', authResult.idToken);
    localStorage.setItem('auth0_id_token_payload', JSON.stringify(authResult.idTokenPayload));
    localStorage.setItem('auth0_expires_at', expiresAt);
  }

  function clearLocalState() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('auth0_id_token');
    localStorage.removeItem('auth0_id_token_payload');
    localStorage.removeItem('auth0_expires_at');
    localStorage.removeItem('auth0_user');
    localStorage.removeItem('auth0_nonce');
    $http.defaults.headers.common['Authorization'] = null;
    $appService.clearUser();
  }

  function logout() {
    clearLocalState();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('auth0_expires_at'));
    var authenticated = new Date().getTime() < expiresAt;
    console.log("isAuthenticated: " + authenticated);
    return authenticated;
  }

  function getAccessToken() {
    return localStorage.getItem('auth0_access_token');
  }

  function getIdToken() {
    return localStorage.getItem('auth0_id_token');
  }

  function getLocalUser(){
    var storedUser = localStorage.getItem('auth0_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    } else {
      return null;
    }
  };

  function bin2string(array){
    var result = "";
    for(var i = 0; i < array.length; ++i){
      result+= (String.fromCharCode(array[i]));
    }
    return result;
  }

  function getNonce() {
    var nonce = localStorage.getItem('auth0_nonce');
    if (nonce == null) {
      var words = sjcl.random.randomWords(8,0);
      nonce = bin2string(words);
      localStorage.setItem('auth0_nonce', nonce);
    }
    return nonce;
  }

  function getUser(successCallback, failureCallback) {
    var storedUser = localStorage.getItem('auth0_user');
    if (storedUser) {
      successCallback(JSON.parse(storedUser));
    } else {
      $http.post($appProperties.servicesPath + "/getMetadata")
        .then(function onSuccess(response) {
          var metadata = response.data;
          var user = createUser(JSON.parse(localStorage.getItem("auth0_id_token_payload")),
                                metadata);
          console.log("Storing and returning user: " + JSON.stringify(user));
          localStorage.setItem('auth0_user', JSON.stringify(user));
          successCallback(user);
        }, function onError(response) {})
    }
  }

  function createUser(profile, metadata) {
    return {
            isAuthenticated: true,
            givenName: userToGivenName(metadata.user_metadata, profile),
            userName: profile["name"],
            email: profile["email"],
            fipsCodes: userToFips(metadata.app_metadata),
            roles: userToRoles(metadata.app_metadata),
						id: profile["sub"],
						apiKey: userToApiKey(metadata.user_metadata)
    }
  };

  function userToFips(metadata) {
    if (metadata && metadata.fipsCodes) {
      return Object.keys(metadata.fipsCodes);
    } else {
      return [];
    }
  };

  function userToRoles(metadata) {
    if (metadata && metadata.roles) {
      return metadata.roles;
    } else {
      console.log("no roles in metadata");
      return [];
    }
  };

  function userToGivenName(metadata, profile) {
    if (metadata && metadata.givenName) {
      return metadata.givenName;
    } else if (profile && profile.name) {
      return profile.name;
    } else if (profile && profile.nickname) {
      return profile.nickname;
    } else if (profile && profile.email) {
      return profile.email;
    } else {
      return "User";
    }
  };

	function userToApiKey(metadata) {
		if (metadata && metadata["api-key"]) {
			return metadata["api-key"];
		} else {
			console.log("no api-key in metadata");
			return "";
		}
	};


  function hasRole (roleName) {
    var user = getLocalUser();
    if (user) {
      var roles = user.roles;
      if (roles.indexOf(roleName) >= 0) {
        return true;
      }
    }
    return false;
  };

  return {
    login: login,
    handleAuthentication: handleAuthentication,
    setSession: setSession,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getAccessToken: getAccessToken,
    getIdToken: getIdToken,
    getUser: getUser,
    hasRole: hasRole
  }
});
