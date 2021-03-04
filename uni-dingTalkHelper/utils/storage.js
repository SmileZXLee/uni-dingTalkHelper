import config from '../config/index.js'

function saveClockHistory(obj) {
	const dataJson = uni.getStorageSync(config.clockHistoryStorageKey);
	let dataArr = [];
	if (dataJson) {
		dataArr = JSON.parse(dataJson);
	}
	dataArr.push(obj);
	uni.setStorageSync(config.clockHistoryStorageKey, JSON.stringify(dataArr));
}

function getClockHistory() {
	const dataJson = uni.getStorageSync(config.clockHistoryStorageKey);
	if (dataJson) {
		return JSON.parse(dataJson);
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
