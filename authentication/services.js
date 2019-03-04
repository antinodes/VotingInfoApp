var config = require('../config');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const AuthenticationClient = require('auth0').AuthenticationClient;
var ManagementClient = require('auth0').ManagementClient;

// Create middleware for checking the JWT
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://" + config.auth0.domain + "/.well-known/jwks.json"
  }),

  // Validate the audience and the issuer.
  aud: config.auth0.audience,
  iss: "https://" + config.auth0.domain + "/",
  algorithms: ['RS256']
});

var authClient = new AuthenticationClient({
  domain:   config.auth0.domain,
  clientId:  config.auth0.clientID,
  clientSecret: config.auth0.secret
});

function getUserFromRequest(req) {
  return {"user_metadata":
           {"givenName": req.user["https://dashboard.votinginfoproject.org/givenName"],
            "api-key": req.user["https://dashboard.votinginfoproject.org/api-key"]},
          "app_metadata":
          {"fipsCodes": req.user["https://dashboard.votinginfoproject.org/fipsCodes"],
           "roles": req.user["https://dashboard.votinginfoproject.org/roles"]}};
};

function getUserFipsCodes(req) {
  var user = getUserFromRequest(req);
  return Object.keys(user["app_metadata"]["fipsCodes"]);
};

function getUserRoles(req) {
  var user = getUserFromRequest(req);
  return user["app_metadata"]["roles"];
}

function isSuperAdmin(req) {
  var roles = getUserRoles(req);
  return roles.indexOf("super-admin") >= 0;
}

function isStateAdmin(req) {
  var roles = getUserRoles(req);
  return roles.indexOf("state-admin") >= 0;
}

function registerAuthServices(app) {
  app.post('/services/getMetadata', checkJwt, function(req, res) {
    console.log(JSON.stringify(req.user));
    var metadata = getUserFromRequest(req);
    res.status(200).send(metadata);
  });
}

function obtainManagementToken(cb) {
  try {
    authClient.clientCredentialsGrant({
      audience: 'https://' + config.auth0.domain + '/api/v2/',
      scope: 'read:users read:users_app_metadata read:user_idp_tokens'
    }, function (err, response) {
      if (err) {
        // Handle error.
        console.log(err);
      }
      cb(response.access_token);
    });
  } catch (e) {
    console.log(e);
  };
};

function getUsersByFips(fips, cb) {
  obtainManagementToken(function (token) {
    var management = new ManagementClient({
      token: token,
      domain: config.auth0.domain
    });
    var params = {
      q: "app_metadata.fipsCodes." + fips + ": true"
    };
    management.getUsers(params, function(err, users) {
      if (err !== undefined) {
        console.log(err);
      } if (users !== undefined) {
        console.log(users);
      }
      cb(users);
    })
  });
};

exports.getUserFromRequest = getUserFromRequest;
exports.getUserFipsCodes = getUserFipsCodes;
exports.isSuperAdmin = isSuperAdmin;
exports.isStateAdmin = isStateAdmin;
exports.getUserRoles = getUserRoles;
exports.checkJwt = checkJwt;
exports.registerAuthServices = registerAuthServices;
exports.getUsersByFips = getUsersByFips;
