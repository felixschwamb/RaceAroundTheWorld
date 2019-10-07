// Elements
const startButton = document.getElementById("btn-startRace");
const stopButton = document.getElementById("btn-stopRace");
const iconPlus = document.getElementById("icon_plus");
const iconMinus = document.getElementById("icon_minus");
const lapSelector = document.getElementById("lap_counter");
const lapCount = document.getElementById("lap_count");
const lapCountTotal = document.getElementById("lap_count_total");
const lapCounter = document.getElementById("cont_lapCounter");

// request data from server
const loadObjects = async url => {
	let response = await fetch(url);
	let data = await response.json();
	// console.log(data);
	return data;
};

// function to transform latlong-position into pixel-position
const transformPosition = (long, lat) => {
	longTrans = ((long + 180) / 360) * 100;
	latTrans = (((lat - 90) * -1) / 180) * 100;

	posTrans = [longTrans, latTrans];
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

// Interval for setInterval function
let raceInterval;
let intervalIterations = 0;

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
		for (i = 0; i < data.length; i++) {
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
		// console.log("distance: ", distanceLap);
		// console.log("distance on item: ", item.totalDistance);
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
const createArr = createArrFunc[0];
const updateArr = createArrFunc[1];
const getArr = createArrFunc[2];
const resetArr = createArrFunc[3];

// function to create racer objects and store them in 'raceArr'
const createRacer = async () => {
	const data = await loadObjects("/get-objects");

	createArr(data);
	// console.log("RacerArr: ", getArr());

	const racerArr = getArr();

	const firstLatLongTrans = (item, i) => {
		const long = item.latLong[i][0];
		const lat = item.latLong[i][1];
		const newTransPos = transformPosition(long, lat);
		item.transformedPosition.push(newTransPos);
	};

	// adding pixel-position to each racer object, starting position and first position due to buffering
	racerArr.forEach(item => {
		firstLatLongTrans(item, 0);
		firstLatLongTrans(item, 1);
	});

	// long of pixel-location of long 0 degrees
	let firstStarter = racerArr[0].transformedPosition[0][0];

	// creation of html elements and starting position for each racer
	racerArr.forEach(item => {
		// creating starting position of each racer
		item.transformedPosition[0][0] = firstStarter;
		firstStarter += 2;

		// creation of html element for each racer
		createRacerElement(
			item.id,
			item.color,
			item.transformedPosition[0][0],
			item.transformedPosition[0][1]
		);

		// get starting rank of racer and use it in creation of initial ranking
		const rank = getRacerRank(item.id, racerArr);

		// creation of html element for each ranking card
		createRankingElementInitial(
			item.name,
			item.carMake,
			item.totalDistance,
			item.color,
			rank
		);
	});
};

// Creation of initial starting position
createRacer();

// function to create html element for each racer
const createRacerElement = (id, color, long, lat) => {
	const raceTrack = document.getElementById("race_track");
	const racer = document.createElement("i");
	racer.id = `racer${id}`;
	racer.classList.add("fa");
	racer.classList.add("fa-car");
	racer.classList.add("race_car");
	racer.style.color = color;
	racer.style.fontWeight = 900;
	racer.style.fontSize = "2.5vh";
	racer.style.top = `${lat}%`;
	racer.style.left = `${long}%`;
	raceTrack.appendChild(racer);
};

// transition of 5s is defined in app.css
const moveRacerElement = (id, long, lat) => {
	const racer = document.getElementById(`racer${id}`);
	racer.style.top = `${lat}%`;
	racer.style.left = `${long}%`;
};

// HTML structure of ranking cards, which are created dynamically with function below
// // div0
// <div class="cont_col ranking_card">
// 	// div1
// 	<div class="cont_row cont-ctn">
// 		// div2
// 		<div class="cont_col cont-name">
// 			// p0
// 			<p class="ranking_name">DriverOne</p>
// 			// p1
// 			<p class="ranking_make">Team DriverOne</p>
// 		</div>
// 		// div3
// 		<div class="cont_col cont-info">
// 			// div4
// 			<div class="cont_row cont-rank">
// 				// div5
// 				<div class="ranking_rank">1 /</div>
// 				// div6
// 				<div class="cont-rank-total">
// 					// div7
// 					<div class="ranking_rank_total">10</div>
// 				</div>
// 			</div>
// 			// div8
// 			<div class="cont_row cont-distance">
// 				// p2
// 				<p class="ranking_distance">1000000 km</p>
// 			</div>
// 		</div>
// 	</div>
// </div>;

// helper functions to create the html div- and p-elements, and to add the css classes to the html elements
const genDiv = (class1, class2) => {
	const d = document.createElement("div");
	d.classList.add(class1);
	if (class2) {
		d.classList.add(class2);
	}
	return d;
};

const genDivEle = () => {
	let classArr = [
		["cont_col", "ranking_card"],
		["cont_row", "cont-ctn"],
		["cont_col", "cont-name"],
		["cont_col", "cont-info"],
		["cont_row", "cont-rank"],
		["ranking_rank"],
		["ranking_rank_total"],
		["cont_row", "cont-distance"]
	];

	let divArr = [];
	for (let i = 0; i < classArr.length; i++) {
		if (classArr[i].length === 1) {
			divArr[i] = genDiv(classArr[i][0]);
		} else {
			divArr[i] = genDiv(classArr[i][0], classArr[i][1]);
		}
	}

	return divArr;
};

const genP = class1 => {
	const p = document.createElement("p");
	p.classList.add(class1);
	return p;
};

const genPEle = () => {
	let classArr = [["ranking_name"], ["ranking_make"], ["ranking_distance"]];
	let pArr = [];

	for (let i = 0; i < classArr.length; i++) {
		pArr[i] = genDiv(classArr[i][0]);
	}

	return pArr;
};

// function to create each ranking card (one per racer) as html element and append it to ranking-div
const createRankingElementInitial = (name, make, distance, color, rank) => {
	const divElements = genDivEle();
	const pElements = genPEle();

	document
		.getElementById("ranking")
		.appendChild(divElements[0])
		.appendChild(divElements[1])
		.appendChild(divElements[2])
		.appendChild(pElements[0]).innerHTML = name;

	divElements[2].appendChild(pElements[1]).innerHTML = `Team ${make}`;

	divElements[1]
		.appendChild(divElements[3])
		.appendChild(divElements[4])
		.appendChild(divElements[5]).innerHTML = `${rank} /`;

	divElements[4].appendChild(divElements[6]).innerHTML = "10";

	divElements[3]
		.appendChild(divElements[7])
		.appendChild(pElements[2]).innerHTML = `${Number(distance.toFixed(2))} km`;

	divElements[0].style.background = color;
};

const createRankingElement = () => {
	const racerArr = getArr();
	const sortedRacerArr = racerArr.sort(
		(a, b) => b.totalDistance - a.totalDistance
	);

	// console.log("sorted array: ", sortedRacerArr);

	sortedRacerArr.forEach(item => {
		const rank = getRacerRank(item.id, sortedRacerArr);
		createRankingElementInitial(
			item.name,
			item.carMake,
			item.totalDistance,
			item.color,
			rank
		);
	});
};

const getRacerRank = (id, racerArray) => {
	const index = racerArray.findIndex(item => item.id === id) + 1;

	return index;
};

const removeElements = cl => {
	const parent = document.getElementById(cl);
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

// function to perform one lap of the race
// load new location data, update location and pixel-location on racer object, update css position of racer
const performRaceLap = async () => {
	const data = await loadObjects("/get-newLocation");

	updateArr(data);
	const racerArr = getArr();

	racerArr.forEach(item => {
		// item is an object, transformedPosition is an array and a property on the object. Get the index of the last transformedPosition, which was added by updataArr()
		// -2 due to buffering
		const index = item.transformedPosition.length - 2;
		const newTransPos = item.transformedPosition[index];
		// console.log('pos: ', newTransPos)
		moveRacerElement(item.id, newTransPos[0], newTransPos[1]);
	});
};

const intervalLap = lapNum => {
	// clear the ranking field. Old cards get deleted, so new cards with current data can be shown
	removeElements("ranking");
	createRankingElement();

	intervalIterations++;
	performRaceLap();

	// show current lap in lap counter
	let currentLap = incCur();
	lapCount.innerHTML = `${currentLap} /`;

	// clear interval after the given number of laps (lapNum)
	if (intervalIterations >= lapNum - 1) {
		clearInterval(raceInterval);
		intervalIterations = 0;
	}
};

const startRace = () => {
	performRaceLap();

	// show current lap in lap counter, should show '1' immediately after race was started
	let currentLap = incCur();
	lapCount.innerHTML = `${currentLap} /`;

	// disable lap selector buttons after start of race
	iconMinus.classList.add("icon_disabled");
	iconPlus.classList.add("icon_disabled");
	iconMinus.removeEventListener("click", dec);
	iconPlus.removeEventListener("click", inc);

	//initialize reset-button and disable start-button
	stopButton.addEventListener("click", resetRace);
	stopButton.disabled = false;
	startButton.removeEventListener("click", startRace);
	startButton.disabled = true;

	const lapNum = get();
	const interval = lapNum * 5000;

	if (lapNum > 1) {
		raceInterval = setInterval(() => {
			intervalLap(lapNum);
		}, 5000);
	}

	timeout(interval);

	lapCounter.style.display = "flex";
	lapCountTotal.innerHTML = lapNum;
};

const timeout = interval => {
	setTimeout(function() {
		removeElements("ranking");
		createRankingElement();
	}, interval);
};

const resetRace = async () => {
	clearInterval(raceInterval);

	// adding first buffer location to resetted racerArr
	const data = await loadObjects("/get-newLocation");
	// rest of racerArr
	resetArr(data);

	// hide lap counter
	lapCounter.style.display = "none";

	// set selected number of laps (selection field) back to 0 and enable lap selector again
	reset();

	// set counter of current lap back to 0
	resetCur();

	removeElements("race_track");
	removeElements("ranking");

	const racerArr = getArr();
	// resetting positions of race cars
	racerArr.forEach(item => {
		createRacerElement(
			item.id,
			item.color,
			item.transformedPosition[0][0],
			item.transformedPosition[0][1]
		);

		const rank = getRacerRank(item.id, racerArr);

		createRankingElementInitial(
			item.name,
			item.carMake,
			item.totalDistance,
			item.color,
			rank
		);
	});
};

// function which contains all functions regarding increasing, decreasing, resetting number of laps and getting and resetting current lap
const lapNumfunc = () => {
	let lapNum = 0;
	let currentLap = 0;
	lapSelector.innerHTML = lapNum;
	iconMinus.classList.add("icon_disabled");
	stopButton.disabled = true;

	// increase number of laps via lap selector plus-button
	const incLapNum = () => {
		if (lapNum < 15) {
			lapNum++;
			lapSelector.innerHTML = lapNum;
			iconMinus.addEventListener("click", dec);
			iconMinus.classList.remove("icon_disabled");
			startButton.addEventListener("click", startRace);
			startButton.disabled = false;

			if (lapNum === 15) {
				iconPlus.classList.add("icon_disabled");
				iconPlus.removeEventListener("click", inc);
			}
		}
	};

	// decrease number of laps via lap selector minus-button
	const decLapNum = () => {
		if (lapNum > 0 && lapNum <= 15) {
			lapNum--;
			lapSelector.innerHTML = lapNum;
			iconPlus.addEventListener("click", inc);
			iconPlus.classList.remove("icon_disabled");
			if (lapNum === 0) {
				iconMinus.classList.add("icon_disabled");
				iconMinus.removeEventListener("click", dec);
				startButton.removeEventListener("click", startRace);
				startButton.disabled = true;
			}
		}
	};

	// reset number of laps
	const resetLapNum = () => {
		// reset selection field of lap counter
		lapNum = 0;
		lapSelector.innerHTML = lapNum;

		// enable lap selector plus-button after reset
		iconPlus.classList.remove("icon_disabled");
		iconPlus.addEventListener("click", inc);
		iconMinus.classList.add("icon_disabled");

		// disable reset-button after reset
		stopButton.removeEventListener("click", resetRace);
		stopButton.disabled = true;
	};

	// get number of laps
	const getLapNum = () => lapNum;

	// increase current lap by one
	const incCurrentLap = () => {
		currentLap++;
		return currentLap;
	};

	// reset current lap back to 0
	const resetCurrentLap = () => (currentLap = 0);

	// lapNumFunc returns the following functions
	return [
		incLapNum,
		decLapNum,
		resetLapNum,
		getLapNum,
		incCurrentLap,
		resetCurrentLap
	];
};

// function which are returned by lapNumfunc and which have access to lapNum and currentLap due to closure
const innerfunction = lapNumfunc();
const inc = innerfunction[0];
const dec = innerfunction[1];
const reset = innerfunction[2];
const get = innerfunction[3];
const incCur = innerfunction[4];
const resetCur = innerfunction[5];

// initialization of lap selector plus-button
iconPlus.addEventListener("click", inc);
