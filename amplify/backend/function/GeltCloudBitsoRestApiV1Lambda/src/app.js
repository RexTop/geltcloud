/* Amplify Params - DO NOT EDIT
	API_GELTCLOUD_GRAPHQLAPIENDPOINTOUTPUT
	API_GELTCLOUD_GRAPHQLAPIIDOUTPUT
	AUTH_GELTCLOUDDDDAACE8_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const express = require('express');
const applyMiddleware = require('./middleware').applyMiddleware;

const app = express();
applyMiddleware(app);

app.get('/bitso/v1', function (req, res) {
    res.json({success: 'get call succeed!', url: req.url, user: req.user});
});

app.get('/bitso/v1/*', function (req, res) {
    res.json({success: 'get call succeed!', url: req.url, user: req.user});
});

app.post('/bitso/v1', function (req, res) {
    res.json({success: 'post call succeed!', url: req.url, body: req.body, user: req.user});
});

app.post('/bitso/v1/*', async (req, res) => {
    res.json({success: 'post call succeed!', url: req.url, body: req.body, user: req.user});
});

app.put('/bitso/v1', function (req, res) {
    res.json({success: 'put call succeed!', url: req.url, body: req.body, user: req.user});
});

app.put('/bitso/v1/*', function (req, res) {
    res.json({success: 'put call succeed!', url: req.url, body: req.body, user: req.user});
});

app.delete('/bitso/v1', function (req, res) {
    res.json({success: 'delete call succeed!', url: req.url, user: req.user});
});

app.delete('/bitso/v1/*', function (req, res) {
    res.json({success: 'delete call succeed!', url: req.url, user: req.user});
});

app.listen(3000, function () {
    console.log("App started")
});

module.exports = app;
