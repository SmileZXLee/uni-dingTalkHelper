//github地址:https://github.com/SmileZXLee/uni-dingTalkHelper

import config from '../config/index.js'

function openDingTalk(errback) {
	return new Promise(function(resolve, reject) {
		if (!isApp()) {
			reject('请在App中运行！');
		}else{
			if (plus.os.name === 'Android') {
				plus.runtime.launchApplication({
					pname: config.dingTalkPname
				}, (err) => {
					reject(err.message);
				});
				resolve();
			} else if (plus.os.name === 'iOS') {
				plus.runtime.launchApplication({
					action: config.dingTalkScheme
				}, (err) => {
					reject(err.message);
				});
				resolve();
			}
		}
	})
}

function isApp() {
	let isApp = false;
	//#ifdef APP-PLUS
	isApp = true;
	//#endif
	return isApp;
}

function isDingtalkInstalled() {
	if (plus.runtime.isApplicationExist({
			pname: config.dingTalkPname,
			action: config.dingTalkScheme
		})) {
		return true;
	} else {
		return false;
	}
}

function getNextClockFullTime(startMin, endMin, selectedWeeksArr) {
	const currentDate = getCurrentDate();
	const randomTime = getRandomMinAndSecond(startMin, endMin);
	const currentDateFullRandomMin = getCurrentDateForYYMMDD() + ' ' + randomTime;
	const diffTime = getDiffTimeToCurrentTime(currentDateFullRandomMin);
	if (diffTime > 0 && selectedWeeksArr.includes(currentDate.getDay())) {
		//如果今天的时间符合要求
		return currentDateFullRandomMin;
	}
	let nextDate = null;
	//寻找下一个符合要求的日期
	for (let i = 0; i < 7; i++) {
		//获取1周内的所有日期，寻找临近的符合要求的日期
		currentDate.setDate(currentDate.getDate() + 1);
		if (selectedWeeksArr.includes(currentDate.getDay())) {
			nextDate = currentDate;
			break;
		}
	}
	if (nextDate) {
		const nextDateFullRandomMin = getDateForYYMMDD(nextDate) + ' ' + randomTime;
		return nextDateFullRandomMin;
	}
	return '获取失败';

}

function getCurrentDate() {
	return new Date();
}

function getCurrentDateForYYMMDD() {
	const date = getCurrentDate();
	return getDateForYYMMDD(date);
}

function getDateForYYMMDD(date) {
	return `${date.getFullYear()}-${fillZero2Two(date.getMonth() + 1)}-${fillZero2Two(date.getDate())}`;
}

function getDateForYYMMDDHHMMSS() {
	const date = getCurrentDate();
	return `${date.getFullYear()}-${fillZero2Two(date.getMonth() + 1)}-${fillZero2Two(date.getDate())} ${fillZero2Two(date.getHours())}:${fillZero2Two(date.getMinutes())}:${fillZero2Two(date.getSeconds())}`;
}

function getDiffTimeToCurrentTime(dateStr) {
	dateStr = dateStr.replace(/-/, "/").replace(/-/, "/");
	var date1 = getCurrentDate();
	var date2 = new Date(dateStr);
	var disTime = date2.getTime() - date1.getTime();
	return disTime;
}

function getMinAndSecondDiff(startMin, endMin){
	const startMinArr = startMin.split(':');
	const startTotalMin = startMinArr.length === 2 ? (parseInt(startMinArr[0]) * 60 + parseInt(startMinArr[1])) : 0;
	const endMinArr = endMin.split(':');
	const endTotalMin = endMinArr.length === 2 ? (parseInt(endMinArr[0]) * 60 + parseInt(endMinArr[1])) : 0;
	return endTotalMin - startTotalMin;
}

function getRandomMinAndSecond(startMin, endMin) {
	const startMinArr = startMin.split(':');
	const startTotalMin = startMinArr.length === 2 ? (parseInt(startMinArr[0]) * 60 + parseInt(startMinArr[1])) : 0;
	const endMinArr = endMin.split(':');
	const endTotalMin = endMinArr.length === 2 ? (parseInt(endMinArr[0]) * 60 + parseInt(endMinArr[1])) : 0;
	if (endTotalMin <= startTotalMin) {
		return `${fillZero2Two(startMin)}:${fillZero2Two(getRandom(0,60))}`;
	}
	const randomMin = getRandom(startTotalMin, endTotalMin);
	return `${fillZero2Two(randomMin / 60)}:${fillZero2Two(randomMin % 60)}:${fillZero2Two(getRandom(0,60))}`;
}

function getCurrentDateFullRandomMin(startMin, endMin) {
	return getCurrentDateForYYMMDD() + ' ' + getRandomMinAndSecond(startMin, endMin);
}

function getRandom(start, end) {
	let random = Math.random()
	return parseInt((start + (end - start) * random))
}

function fillZero2Two(value) {
	value = parseInt(value);
	return value >= 10 ? value : '0' + value;
}


module.exports = {
	isApp,
	openDingTalk,
	isDingtalkInstalled,
	getRandomMinAndSecond,
	getNextClockFullTime,
	getDateForYYMMDDHHMMSS,
	getMinAndSecondDiff
}
