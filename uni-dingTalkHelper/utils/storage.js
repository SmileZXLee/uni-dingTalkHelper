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
		return JSON.parse(dataJson).reverse();
	}
	return [];
}

function cleanClockHistory(){
	uni.removeStorageSync(config.clockHistoryStorageKey);
}

function saveSecurityPwd(pwd){
	uni.setStorageSync(config.securityPwdKey,pwd);
}

function getSecurityPwd(){
	return uni.getStorageSync(config.securityPwdKey);
}

function cleanSecurityPwd(){
	uni.removeStorageSync(config.securityPwdKey);
}

module.exports = {
	saveClockHistory,
	getClockHistory,
	cleanClockHistory,
	saveSecurityPwd,
	getSecurityPwd,
	cleanSecurityPwd
}
