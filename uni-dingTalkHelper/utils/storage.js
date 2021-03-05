import config from '../config/index.js'

function saveClockHistory(obj) {
	const dataJson = uni.getStorageSync(config.clockHistoryStorageKey);
	let dataArr = [];
	if (dataJson) {
		dataArr = JSON.parse(dataJson);
	}
	dataArr.push(obj);
	console.log('dataArr',dataArr);
	uni.setStorageSync(config.clockHistoryStorageKey, JSON.stringify(dataArr));
}

function getClockHistory() {
	const dataJson = uni.getStorageSync(config.clockHistoryStorageKey);
	if (dataJson) {
		return JSON.parse(dataJson).reverse();
	}
	return [];
}

function cleanClockHistory(){
	uni.removeStorageSync(config.clockHistoryStorageKey);
}

module.exports = {
	saveClockHistory,
	getClockHistory,
	cleanClockHistory
}
