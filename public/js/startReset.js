import { loadObjects } from "./loadData.js";

import { getArr, resetArr } from "./createRacerArray.js";

import {
	newRankingAfterLap,
	updateRankingElement,
	getRacerRank
} from "./createRanking.js";

import {
	inc,
	dec,
	reset,
	get,
	incCur,
	resetCur,
	iconPlus,
	iconMinus,
	startButton,
	stopButton
} from "./lapFunctions.js";

import {
	createRacer,
	createRacerElement,
	removeElements,
	performRaceLap,
	intervalLap
} from "./racerElement.js";

import { assignTop } from "./transitionValues.js";

import { infoEvent, expandEvent } from "./triggerViews.js";

// Elements
export const lapCount = document.getElementById("lap_count");
const lapCountTotal = document.getElementById("lap_count_total");
const lapCounter = document.getElementById("cont_lapCounter");

// Interval for setInterval function
export let raceInterval;

// Creation of initial starting position
createRacer();

// Adding event listener to info icon in select laps section, 
// and to arrow icons to expand/mimimize the ranking
infoEvent();
expandEvent();

export const startRace = () => {
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
		newRankingAfterLap();
	}, interval);
};

export const resetRace = async () => {
	clearInterval(raceInterval);

	// adding first buffer location to resetted racerArr
	try {
		const data = await loadObjects("/get-newLocation");
		// rest of racerArr
		resetArr(data);
	} catch (e) {
		console.log("Error: ", e);
	}

	// hide lap counter
	lapCounter.style.display = "none";

	// set selected number of laps (selection field) back to 0 and enable lap selector again
	reset();

	// set counter of current lap back to 0
	resetCur();

	removeElements("race_track");

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

		const itemElement = document.getElementById(item.id);
		assignTop(itemElement, rank, "ranking_card", ranking);
		// no new z-Index needed, as ranking was just reseted without animation
		updateRankingElement(itemElement, rank, item.totalDistance);
	});
};

// initialization of lap selector plus-button
iconPlus.addEventListener("click", inc);
