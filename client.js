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

	

	//redirectUrl.searchParams = new URLSearchParams();
	
	const params = new URLSearchParams();
	params.set('response_type', 'code');
	params.set('client_id', config.clientId);
	params.set('redirect_uri', config.redirectUri);
	params.set('scope', 'permission:name permission:date_of_birth');
	params.set('state', state);

	//const redirectUrl = url.parse(config.authorizationEndpoint);
	//const redirectUrl = new URL()
	const redirectUrl = new URL(config.authorizationEndpoint);
	redirectUrl.searchParams = params;

	res.redirect(encodeURI(redirectUrl));
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
