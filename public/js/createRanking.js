import { getArr } from "./createRacerArray.js";

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

// const genP = class1 => {
// 	const p = document.createElement("p");
// 	p.classList.add(class1);
// 	return p;
// };

const genPEle = () => {
	let classArr = [["ranking_name"], ["ranking_make"], ["ranking_distance"]];
	let pArr = [];

	for (let i = 0; i < classArr.length; i++) {
		pArr[i] = genDiv(classArr[i][0]);
	}

	return pArr;
};

// function to create each ranking card (one per racer) as html element and append it to ranking-div
export const createRankingElementInitial = (
	name,
	make,
	distance,
	color,
	rank
) => {
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

export const createRankingElement = () => {
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

export const getRacerRank = (id, racerArray) => {
	const index = racerArray.findIndex(item => item.id === id) + 1;

	return index;
};
