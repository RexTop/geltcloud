const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const AWS = require('aws-sdk');

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

const tapRoute = f => route => {
    route.use(f);
    return route;
};

const configureCors = route => {
    route.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    return route;
};

const injectUser = route => {
    route.use(async (req, res, next) => {
        try {
            const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/;
            const authProvider = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider;
            const [, , , userId] = authProvider.match(IDP_REGEX);
            const cognito = new AWS.CognitoIdentityServiceProvider();
            const listUsersResponse = await cognito
                .listUsers({
                    UserPoolId: process.env.AUTH_GELTCLOUDDDDAACE8_USERPOOLID,
                    Filter: `sub = "${userId}"`,
                    Limit: 1,
                })
                .promise();
            req.user = listUsersResponse.Users[0];
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    });
    return route;
};

const applyMiddleware = (route, ...middleware) =>
    pipe(
        tapRoute(bodyParser.json()),
        tapRoute(awsServerlessExpressMiddleware.eventContext()),
        configureCors,
        injectUser,
        ...middleware
    )(route);

module.exports = {
    applyMiddleware,
};
