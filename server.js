#!/usr/bin/env node

// node modules
var path = require("path");
var fs = require("fs");

// npm modules
var ellipse = require("ellipse");

// clean up old socket
if (fs.existsSync(path.resolve(__dirname, "server.sock"))) fs.unlinkSync(path.resolve(__dirname, "server.sock"));

// load data
var data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "assets/data/data.json")));

// instance of app
var app = ellipse();

// tile route
app.get("/random/:z(\\d+)/:x(\\d+)/:y(\\d+)", function(req, res){
	res.redirect(data[Math.floor(Math.random()*data.length)].replace(/\{x\}/g, req.params.x).replace(/\{y\}/g, req.params.y).replace(/\{z\}/g, req.params.z));
});

// default route
app.get("*", function(req,res){
	res.status(404).end("nope");
});

// listen
module.exports = app.listen(path.resolve(__dirname, "server.sock"), function() {
	fs.chmod(path.resolve(__dirname, "server.sock"), 0777);
});
