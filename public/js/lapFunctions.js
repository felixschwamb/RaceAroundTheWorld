import { startRace, resetRace } from "./startReset.js";

// Elements
export const startButton = document.getElementById("btn-startRace");
export const stopButton = document.getElementById("btn-stopRace");
export const iconPlus = document.getElementById("icon_plus");
export const iconMinus = document.getElementById("icon_minus");

// function which contains all functions regarding increasing, decreasing, resetting number of laps and getting and resetting current lap
// function also contains the state of number of laps selected and the current lap, so they are no global variable and can only be manipulated by functions returned by this function
const lapNumfunc = () => {
	let lapNum = 0;
	let currentLap = 0;

	const lapSelector = document.getElementById("lap_counter");

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

// functions which are returned by lapNumfunc and which have access to lapNum and currentLap due to closure
const innerfunction = lapNumfunc();
export const inc = innerfunction[0];
export const dec = innerfunction[1];
export const reset = innerfunction[2];
export const get = innerfunction[3];
export const incCur = innerfunction[4];
export const resetCur = innerfunction[5];
