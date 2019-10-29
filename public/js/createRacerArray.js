// function to transform latlong-position into pixel-position
export const transformPosition = (long, lat) => {
	const longTrans = ((long + 180) / 360) * 100;
	const latTrans = (((lat - 90) * -1) / 180) * 100;

	const posTrans = [longTrans, latTrans];
	return posTrans;
};

//calculation of distance between two latlong positions
const distance = (lat1, long1, lat2, long2) => {
	if (lat1 == lat2 && long1 == long2) {
		return 0;
	} else {
		const radlat1 = (Math.PI * lat1) / 180;
		const radlat2 = (Math.PI * lat2) / 180;
		const theta = long1 - long2;
		const radtheta = (Math.PI * theta) / 180;
		let dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;

		return dist;
	}
};

// function which contains all functions regarding creating, upadating, getting and resetting of the racer-Array
// function also contains the state of the racer-Array, so it is no global variable and can only be manipulated by functions returned by this function
const createRacerArray = () => {
	// constructor of racer
	class Racer {
		constructor(id, name, carMake, color, latlong) {
			(this.id = id),
				(this.name = name),
				(this.carMake = carMake),
				(this.color = color),
				(this.latLong = [[0, 0], latlong]),
				(this.transformedPosition = []),
				(this.totalDistance = 0);
		}
	}

	const carColors = [
		"#f44336",
		"#e91e63",
		"#9c27b0",
		"#673ab7",
		"#3f51b5",
		"#4caf50",
		"#ffeb3b",
		"#ff5722",
		"#795548",
		"#009688"
	];

	// Array as collection of all racers
	let racerArr = [];

	const createRacerArr = data => {
		for (let i = 0; i < data.length; i++) {
			racerArr[i] = new Racer(
				data[i].driverId,
				data[i].driverName,
				data[i].carMake,
				carColors[i],
				data[i].location
			);
		}
	};

	const newLoc = (item, data) => {
		const index = data.findIndex(dataItem => dataItem.driverId === item.id);
		const newLocation = data[index].location;

		// Add new location to latLong array on eachobject
		const newLong = newLocation[0];
		const newLat = newLocation[1];
		item.latLong.push([newLong, newLat]);

		// transform long ang lat of new location into pixel-location and add to each new object
		const newTransPos = transformPosition(newLong, newLat);
		item.transformedPosition.push(newTransPos);
	};

	const calcDistance = item => {
		// calculate distance between old position (lat1, long1) and current position (lat2, long2)
		// -3 and -2 due to the buffer location, which should be used as previous location
		const numLocItems = item.latLong.length;
		const prevLoc = item.latLong[numLocItems - 3];
		const currLoc = item.latLong[numLocItems - 2];
		const lat1 = prevLoc[1];
		const long1 = prevLoc[0];
		const lat2 = currLoc[1];
		const long2 = currLoc[0];

		const distanceLap = distance(lat1, long1, lat2, long2);
		item.totalDistance += distanceLap;
	};

	const updateRacerArr = data => {
		racerArr.forEach(item => {
			newLoc(item, data);
			calcDistance(item);
		});
	};

	const getRacerArr = () => racerArr;

	const resetRacerArr = data => {
		racerArr.forEach(item => {
			// set latLong, transformedPosition and totalDistance back to initial state, or 0 respectively for each object
			item.latLong = [item.latLong[0]];
			item.transformedPosition = [item.transformedPosition[0]];
			item.totalDistance = 0;

			// add first buffer location to each object
			newLoc(item, data);
		});
	};

	return [createRacerArr, updateRacerArr, getRacerArr, resetRacerArr];
};

// functions which are returned by createRacerArray and which have access to racerArr due to closure
const createArrFunc = createRacerArray();
export const createArr = createArrFunc[0];
export const updateArr = createArrFunc[1];
export const getArr = createArrFunc[2];
export const resetArr = createArrFunc[3];
