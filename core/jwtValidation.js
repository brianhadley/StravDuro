const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
var checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://stravduro.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "http://localhost:4200",
  issuer: `https://stravduro.auth0.com/`,
  algorithms: ["RS256"]
});

//sollee: auth0|5ba6ac94dcd6892160019ca0
//brian: google-oauth2|104517979683877860028

module.exports = checkJwt;