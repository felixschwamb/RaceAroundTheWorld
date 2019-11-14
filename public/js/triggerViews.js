const showInfo = () => {
	const infoIcon = document.getElementById("icon_info");
	const infoText = document.getElementById("cont_lap_info");

	const triggerInfoText = () => {
		if (infoText.style.display === "inline-block") {
			hideInfoText();
			document.removeEventListener("click", hideWithOutsideClick);
		} else {
			showInfoText(event);
			document.addEventListener("click", hideWithOutsideClick);
		}
	};

	const showInfoText = event => {
		infoText.style.display = "inline-block";
		// The stopImmediatePropagation() method prevents other listeners of the same event from being called.
		event.stopImmediatePropagation();
	};

	const hideInfoText = () => {
		infoText.style.display = "none";
	};

	const hideWithOutsideClick = e => {
		if (e.target.closest("#cont_lap_info")) {
			return;
		}

		infoText.style.display = "none";
		document.removeEventListener("click", hideWithOutsideClick);
	};

	const infoEvent = () => {
		infoIcon.addEventListener("click", triggerInfoText);
	};

	return infoEvent;
};

export const infoEvent = showInfo();

const triggerExpandRanking = () => {
	const rankingContainer = document.getElementById("cont_ranking");
	const ranking = document.getElementById("ranking");
	const downIcon = document.getElementById("icon_arrowDown");
	const upIcon = document.getElementById("icon_arrowUp");

	const expMinRanking = (
		displayDown,
		displayUp,
		rankingContainerHeight,
		rankingHeight,
		rankingY,
		rankingX
	) => {
		downIcon.style.display = displayDown;
		upIcon.style.display = displayUp;

		rankingContainer.style.height = rankingContainerHeight;

		ranking.style.height = rankingHeight;
		ranking.style.overflowY = rankingY;
		ranking.style.overflowX = rankingX;
	};

	const expand = () => {
		expMinRanking("none", "block", "750px", "95%", null, null);
		upIcon.addEventListener("click", minimize);
		downIcon.removeEventListener("click", expand);
	};

	const minimize = () => {
		expMinRanking("block", "none", null, "200px", "scroll", "hidden");
		downIcon.addEventListener("click", expand);
		upIcon.removeEventListener("click", minimize);
	};

	const expandEvent = () => {
		if (!(downIcon.style.display === "none")) {
			downIcon.addEventListener("click", expand);
		} else {
			upIcon.addEventListener("click", minimize);
		}
	};

	return expandEvent;
};

export const expandEvent = triggerExpandRanking();
