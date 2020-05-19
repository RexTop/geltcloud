/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	API_GELTCLOUD_GRAPHQLAPIENDPOINTOUTPUT
	API_GELTCLOUD_GRAPHQLAPIIDOUTPUT
	AUTH_GELTCLOUDDDDAACE8_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const AWS = require('aws-sdk');

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/bitso/v1', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/bitso/v1/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/bitso/v1', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/bitso/v1/*', async (req, res) => {
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
    const user = listUsersResponse.Users[0];
    // Add your code here
    res.json({success: 'post call succeed!', url: req.url, body: req.body, user});
  } catch (error) {
    console.log(error);
    res.json({error, message: 'get call failed'});
  }
});

/****************************
* Example put method *
****************************/

app.put('/bitso/v1', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/bitso/v1/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/bitso/v1', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/bitso/v1/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
