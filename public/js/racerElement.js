import { loadObjects } from "./loadData.js";

import {
	createArr,
	getArr,
	updateArr,
	transformPosition
} from "./createRacerArray.js";

import {
	getRacerRank,
	createRankingElementInitial,
	createRankingElement
} from "./createRanking.js";

import { lapCount, raceInterval } from "./startReset.js";

import { incCur } from "./lapFunctions.js";

// Interval for setInterval function
let intervalIterations = 0;

// function to create racer objects and store them in 'raceArr'
export const createRacer = async () => {
	try {
		const data = await loadObjects("/get-objects");
		createArr(data);
	} catch (e) {
		console.log("Error: ", e);
	}

	const racerArr = getArr();
	// console.log('Data: ', racerArr)

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

// function to create html element for each racer
export const createRacerElement = (id, color, long, lat) => {
	const raceTrack = document.getElementById("race_track");
	const racer = document.createElement("i");
	racer.id = `racer${id}`;
	racer.classList.add("fa");
	racer.classList.add("fa-car");
	racer.classList.add("race_car");
	racer.style.color = color;
	// racer.style.fontWeight = "bold";
	racer.style.fontSize = "4vh";
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

export const removeElements = cl => {
	const parent = document.getElementById(cl);
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
};

// function to perform one lap of the race
// load new location data, update location and pixel-location on racer object, update css position of racer
export const performRaceLap = async () => {
	try {
		const data = await loadObjects("/get-newLocation");
		updateArr(data);
	} catch (e) {
		console.log("Error: ", e);
	}

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

export const intervalLap = lapNum => {
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
