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

function delClockHistoryWithTime(time) {
	const dataArr = getClockHistory();
	for (let i = 0; i < dataArr.length; i++) {
		if(dataArr[i].time === time){
			dataArr.splice(i, 1);
			i--;
		}
	}
	uni.setStorageSync(config.clockHistoryStorageKey, JSON.stringify(dataArr));
}

function getClockHistory() {
	const dataJson = uni.getStorageSync(config.clockHistoryStorageKey);
	if (dataJson) {
		return JSON.parse(dataJson).reverse();
	}
	return [];
}

function cleanClockHistory() {
	uni.removeStorageSync(config.clockHistoryStorageKey);
}

function saveSecurityPwd(pwd) {
	uni.setStorageSync(config.securityPwdKey, pwd);
}

function getSecurityPwd() {
	return uni.getStorageSync(config.securityPwdKey);
}

function cleanSecurityPwd() {
	uni.removeStorageSync(config.securityPwdKey);
}

module.exports = {
	saveClockHistory,
	delClockHistoryWithTime,
	getClockHistory,
	cleanClockHistory,
	saveSecurityPwd,
	getSecurityPwd,
	cleanSecurityPwd
}
