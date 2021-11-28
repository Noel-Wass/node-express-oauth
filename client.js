const express = require("express")
const bodyParser = require("body-parser")
const axios = require("axios").default
const { randomString, timeout } = require("./utils");
const url = require('url');

const config = {
	port: 9000,

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
	tokenEndpoint: "http://localhost:9001/token",
	userInfoEndpoint: "http://localhost:9002/user-info",
}
let state = ""

const app = express()
app.set("view engine", "ejs")
app.set("views", "assets/client")
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
Your code here
*/

app.get('/authorize', (req, res) => {
	state = randomString();

	const redirectURL = new URL(config.authorizationEndpoint);
	const searchParams = redirectURL.searchParams;

	searchParams.set('response_type', 'code');
	searchParams.set('client_id', config.clientId);
	searchParams.set('redirect_uri', config.redirectUri);
	searchParams.set('scope', 'permission:name permission:date_of_birth');
	searchParams.set('state', state);
	
	res.redirect(redirectURL);
})


app.get('/callback', (req, res) => {
	if (!req.query.state || req.query.state !== state) {
		res.status(403).send('Error: client has insufficent permissions to access resource');
		return;
    }
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

// for testing purposes

module.exports = {
	app,
	server,
	getState() {
		return state
	},
	setState(s) {
		state = s
	},
}
