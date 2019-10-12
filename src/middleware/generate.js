const randopeep = require("randopeep");

function genObj(id, o) {
	const d = {
		driverId: id,
		driverName: randopeep.name(),
		carMake: randopeep.corporate.name("large", 1),
		location: randopeep.address.geo()
		// driverCityOrigin: randopeep.address.city(),
		// driverLanguage: ["de", "en", "nl", "fr", "es", "ar"][Math.floor(Math.random() * 7)],
		// driverPhone: randopeep.address.phone(),
		// driverGender: ["male", "female"][Math.floor(Math.random() * 2)],
		// driverInfo: randopeep.corporate.catchPhrase(1),
		// kmDriven: Math.floor(Math.random() * 100000),
	};
	const lat = parseFloat(d.location[0]);
	const long = parseFloat(d.location[1]);
	d.location = [long, lat];

	o.push(d);
}

module.exports = genObj;
