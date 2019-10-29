// request data from server
export const loadObjects = async url => {
	try {
		let response = await fetch(url);
		let data = await response.json();
		return data;
	} catch (e) {
		console.log("error: ", e);
	}
};
