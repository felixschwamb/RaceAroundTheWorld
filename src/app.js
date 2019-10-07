const express = require("express");
const hbs = require("hbs");
const randopeep = require('randopeep');
const path = require("path");

const genObj = require("../src/middleware/generate");

const app = express();


const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../public/views");
const partialPath = path.join(__dirname, "../public/views/partials");

app.use(express.static(publicPath));

app.use(express.json());

app.set("view engine", "hbs");
app.set("views", viewsPath);

hbs.registerPartials(partialPath);

// endpoints

app.get("/", function(req, res) {
	res.render("index");
});

let o = [];

app.get("/get-objects", async (req, res) => {
	try {

        o = []
		for (let i = 1; i < 11; i++) {
			genObj(i, o);
		}
		// console.log(o);
		res.status(200).send(o);
	} catch (e) {
		res.status(400).send(e);
	}
});

app.get('/get-newLocation', async (req, res) => {
    try {
        for (let i = 0; i < o.length; i++) {
            let location = randopeep.address.geo()
            const lat = parseFloat(location[0])
            const long = parseFloat(location[1])
            location = [long, lat]
            o[i].location = location
        }
        // console.log(o[0].location)
        res.status(200).send(o);
    
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = app;
