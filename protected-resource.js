const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const { timeout } = require("./utils")
const jwt = require("jsonwebtoken");

const config = {
	port: 9002,
	publicKey: fs.readFileSync("assets/public_key.pem"),
}

const users = {
	user1: {
		username: "user1",
		name: "User 1",
		date_of_birth: "7th October 1990",
		weight: 57,
	},
	john: {
		username: "john",
		name: "John Appleseed",
		date_of_birth: "12th September 1998",
		weight: 87,
	},
}

const app = express()
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
Your code here
*/

app.get('/user-info', (req, res) => {
	var authorizationHeader = req.headers.authorization;
	if (!authorizationHeader) {
		res.status(401).send("Error: client not authorized.");
		return;
	}
	var split = authorizationHeader.split(' ');
	if (split.length !== 2 || ( split[0] !== 'bearer' && split[0] !== 'Bearer')) {
		res.status(401).send("Error: client not authorized.");
		return;
	}
	var tokenPayload = split[1];
	let userInfo = null;
	try {
		userInfo = jwt.verify(tokenPayload, config.publicKey,
			{
				algorithms: ["RS256"]
			})
	}
	catch (err) {
		res.status(401).send("Error: client not authorized.");
		return;
	}
	if (userInfo === null) {
		res.status(401).send("Error: client not authorized.");
		return;
	}

	const user = users[userInfo.username];
	const scope = userInfo.scope;
	const userWithRestrictedFields = {}
	console.log(`scope: ${scope}`)
	let scopes = scope.split(' ');
	for (let i = 0; i < scopes.length; i++) {
		let scopes2 = scopes[i].split(':');
		if (scopes2.length === 2 && scopes2[0] === 'permissions') {
			console.log('This point reached.')
			const field = scopes2[1];
			if (field in user)
				userWithRestrictedFields[field] = user[field];
		}		
    }
	return res.status(200).json(userWithRestrictedFields);
	
})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

// for testing purposes
module.exports = {
	app,
	server,
}
