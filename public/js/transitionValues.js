// // Calculate 'top' and 'z-Index' for each element and assign value to element

// Calculate item's total height (height + marginBottom)
const itemHeight = (itemClass, parentElement) => {
	const items = document.getElementsByClassName(itemClass).length;
	if (items) {
		const item = parentElement.firstElementChild;
		const height = item.offsetHeight;
		const marginBottom = Number(
			getComputedStyle(item).marginBottom.slice(0, -2)
		);
		const totalHeight = height + marginBottom;
		return totalHeight;
	}
};

// Calculate the 'top' of the item depending on item's rank
const itemTop = (rank, height) => {
	const rankStyleTop = (rank - 1) * height;
	const topPx = `${rankStyleTop}px`;
	return topPx;
};

// Assign position 'top' to each element in the array, so 'position: absoulte' in element class works
export const assignTop = (itemElement, rank, itemClass, parentElement) => {
	const height = itemHeight(itemClass, parentElement);
	const pos = itemTop(rank, height);
	// const itemEl = document.getElementById(item.id);
	itemElement.style.top = pos;
};

// Calculate z-Index
const itemZIndex = (arrLength, prevRank, rank) => {
	// up in ranking. The higher the new position, the more in the foreground
	if (prevRank > rank) {
		const index = arrLength * 2 - rank;
		return index;

		// down in ranking. The lower the new position, the more in the background
	} else if (prevRank < rank) {
		const index = arrLength + 1 - rank;
		return index;
	} else {
		return 0;
	}
};

// Assing 'z-index' value to each element. Going up in the front, then going down, then staying at the same place
export const assignZIndex = (itemElement, arrLength, prevRank, rank) =>
	(itemElement.style.zIndex = itemZIndex(arrLength, prevRank, rank));
