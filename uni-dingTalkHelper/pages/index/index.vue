<!-- github地址:https://github.com/SmileZXLee/uni-dingTalkHelper -->
<template>
	<view class="content" v-if="showContent">
		<u-navbar :is-back="false" title-color="#ffffff" :background="{background: '#007aff'}" title="">
			<view class="nav-main">
				<view class="nav-left" style="margin-left: 20rpx;font-size: 22rpx;margin-bottom: -10rpx;">
					<!--  #ifdef APP-PLUS -->
					<view>
						<text>V</text> <text style="font-size: 30rpx;margin-left: 5rpx;">{{version}}</text>
					</view>
					<!--  #endif -->
				</view>
				<view class="nav-title">钉钉打开测试工具</view>
				<view class="nav-right" style="margin-bottom: -10rpx;">
					<u-icon name="lock" style="margin-right: 20rpx;font-size: 36rpx;color: white;" @click="checkShouldShowSecurity(true)"></u-icon>
				</view>
			</view>
			<!-- <u-icon name="lock" slot="right" style="margin-right: 20rpx;font-size: 36rpx;color: white;" @click="checkShouldShowSecurity(true)"></u-icon> -->
		</u-navbar>
		<view class="time-view" v-if="currentTime.length" :style="{top: `${navbarHeight}px`}">
			<u-icon name="clock"></u-icon>
			<view class="time-view-text">运行中，当前时间：{{currentTime}}</view>
		</view>
		<uni-list style="width: 100%;">
			<uni-section title="状态"></uni-section>
			<uni-list-item title="就绪状态">
				<template slot="footer">
					<view :class="status==='已就绪'?'list-item-subtitle status-enable':'list-item-subtitle status-disable'">{{status}}</view>
				</template>
			</uni-list-item>
			<uni-section title="钉钉打开测试1"></uni-section>
			<uni-list-item title="钉钉打开测试1起始时间" clickable @click="gotoStartTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gotoStartTimerPickerConfig.value.length?gotoStartTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>

			<uni-list-item title="钉钉打开测试1结束时间" clickable @click="gotoEndTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gotoEndTimerPickerConfig.value.length?gotoEndTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="钉钉打开测试1下次打开时间" clickable @click="updateGotoTime">
				<template slot="footer">
					<view class="list-item-subtitle">{{gotoTime}}</view>
				</template>
			</uni-list-item>
			<uni-section title="钉钉打开测试2"></uni-section>
			<uni-list-item title="钉钉打开测试2起始时间" clickable @click="gooffStartTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gooffStartTimerPickerConfig.value.length?gooffStartTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="钉钉打开测试2结束时间" clickable @click="gooffEndTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gooffEndTimerPickerConfig.value.length?gooffEndTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="钉钉打开测试2下次打开时间" clickable @click="updateGooffTime">
				<template slot="footer">
					<view class="list-item-subtitle">{{gooffTime}}</view>
				</template>
			</uni-list-item>
			<uni-section title="重复星期"></uni-section>
			<uni-list-item title="星期" to="/pages/week-select/week-select" showArrow="true">
				<template slot="footer">
					<view class="list-item-subtitle">{{weekDesc}}</view>
				</template>
			</uni-list-item>
			<uni-section title="功能测试"></uni-section>
			<uni-list-item title="测试打开钉钉" clickable showArrow="true" @click="openDingtalkClick">

			</uni-list-item>
			<uni-section title="其他"></uni-section>
			<uni-list-item title="操作记录" to="/pages/clock-history/clock-history" showArrow="true">
			</uni-list-item>
			<uni-list-item title="密码保护" clickable @click="securityClick">
				<template slot="footer">
					<view class="list-item-subtitle">{{pwdStatus===0?'未开启':'已开启'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="使用说明(必看)" to="/pages/instruction/instruction" showArrow="true">
			</uni-list-item>
			<uni-list-item title="开源地址" clickable @click="copyOpenSourceUrl">
				<template slot="footer">
					<view class="list-item-subtitle">点击复制</view>
				</template>
			</uni-list-item>
			<uni-list-item title="加入反馈QQ群" clickable @click="openQQGroup" showArrow="true">
			</uni-list-item>
		</uni-list>
		<u-picker @confirm="e=>{timePickerConfirm(e,1)}" mode="time" :title="gotoStartTimerPickerConfig.title" :default-time="gotoStartTimerPickerConfig.value.length?gotoStartTimerPickerConfig.value:gotoStartTimerPickerConfig.default"
		 :params="{'hour': true,'minute': true}" v-model="gotoStartTimerPickerConfig.show"></u-picker>
		<u-picker @confirm="e=>{timePickerConfirm(e,2)}" mode="time" :title="gotoEndTimerPickerConfig.title" :default-time="gotoEndTimerPickerConfig.value.length?gotoEndTimerPickerConfig.value:gotoEndTimerPickerConfig.default"
		 :params="{'hour': true,'minute': true}" v-model="gotoEndTimerPickerConfig.show"></u-picker>
		<u-picker @confirm="e=>{timePickerConfirm(e,3)}" mode="time" :title="gooffStartTimerPickerConfig.title" :default-time="gooffStartTimerPickerConfig.value.length?gooffStartTimerPickerConfig.value:gooffStartTimerPickerConfig.default"
		 :params="{'hour': true,'minute': true}" v-model="gooffStartTimerPickerConfig.show"></u-picker>
		<u-picker @confirm="e=>{timePickerConfirm(e,4)}" mode="time" :title="gooffEndTimerPickerConfig.title" :default-time="gooffEndTimerPickerConfig.value.length?gooffEndTimerPickerConfig.value:gooffEndTimerPickerConfig.default"
		 :params="{'hour': true,'minute': true}" v-model="gooffEndTimerPickerConfig.show"></u-picker>

		<u-top-tips ref="uTips" :navbarHeight="navbarHeight"></u-top-tips>
		<u-toast ref="uToast" />
	</view>
	<empty-view v-else emptyText="需授权后访问"></empty-view>
</template>

<script>
	let systemInfo = uni.getSystemInfoSync();
	const openSourceUrl = 'https://github.com/SmileZXLee/uni-dingTalkHelper';
	const qqGroupUrl = 'https://jq.qq.com/?_wv=1027&k=vU2fKZZH';
	export default {
		data() {
			return {
				show: true,
				timer: null,
				gotoStartTimerPickerConfig: {
					title: '选择钉钉打开测试1起始时间',
					show: false,
					default: '09:00',
					value: uni.getStorageSync(this.$config.gotoStartTimeStorageKey)
				},
				gotoEndTimerPickerConfig: {
					title: '选择钉钉打开测试1结束时间',
					show: false,
					default: '09:30',
					value: uni.getStorageSync(this.$config.gotoEndTimeStorageKey)
				},
				gooffStartTimerPickerConfig: {
					title: '选择钉钉打开测试2开始时间',
					show: false,
					default: '17:30',
					value: uni.getStorageSync(this.$config.gooffStartTimeStorageKey)
				},
				gooffEndTimerPickerConfig: {
					title: '选择钉钉打开测试2结束时间',
					show: false,
					default: '18:00',
					value: uni.getStorageSync(this.$config.gooffEndTimeStorageKey)
				},
				weekDesc: '',
				selectedWeeksArr: [],
				gotoTime: '',
				gooffTime: '',
				currentTime: '',
				pwdStatus: 0,
				showContent: false,
				version: ''
			}
		},
		computed: {
			status() {
				// if(!this.$utils.isDingtalkInstalled()){
				// 	return '请先安装钉钉';
				// }
				if (!this.$utils.isApp()) {
					return '请在App中运行';
				}
				const time1 = this.gotoStartTimerPickerConfig.value;
				const time2 = this.gotoEndTimerPickerConfig.value;;
				const time3 = this.gooffStartTimerPickerConfig.value;;
				const time4 = this.gooffEndTimerPickerConfig.value;;
				if (!((time1 && time2) || (time3 && time4))) {
					if (!time1) {
						return `请${this.gotoStartTimerPickerConfig.title}`;
					}
					if (!time2) {
						return `请${this.gotoEndTimerPickerConfig.title}`;
					}
					if (!time3) {
						return `请${this.gooffStartTimerPickerConfig.title}`;
					}
					if (!time4) {
						return `请${this.gooffEndTimerPickerConfig.title}`;
					}
				}
				if (this.weekDesc === '点击选择') {
					return '请选择星期';
				}
				return '已就绪';
			},
			navbarHeight() {
				// #ifdef APP-PLUS || H5
				return 44 + systemInfo.statusBarHeight;
				// #endif
				// #ifdef MP
				let height = systemInfo.platform == 'ios' ? 44 : 48;
				return height + systemInfo.statusBarHeight;
				// #endif
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			uni.setKeepScreenOn({
				keepScreenOn: true
			});
			this.version = plus.runtime.version;
			console.log(this.version);
			// #endif
			this.updateWeekDesc(false);
			uni.$on('update-week', () => {
				this.updateWeekDesc(true);
			})
			this.pwdStatus = this.$storage.getSecurityPwd().length === 0 ? 0 : 1;
			if (this.pwdStatus === 0) {
				this.showContent = true;
			}
			this.checkShouldShowSecurity();
			uni.$on('appshow', () => {
				this.checkShouldShowSecurity();
			})
			if (!uni.getStorageSync(this.$config.iosOpenedDingtalkKey)) {
				uni.showModal({
					title: '请允许首次打开钉钉',
					content: '为了避免打开钉钉失败，请允许此应用打开钉钉，点击【下一步】后若系统提示是否允许“钉钉打开测试工具”打开“钉钉”，请点击允许，若直接跳转钉钉也是正常的。',
					success: (res) => {
						if (res.confirm) {
							this.openDingTalk();
						}
					}
				});
			}
		},
		onShow() {
			this.updateGotoTime();
			this.updateGooffTime();
			this.pwdStatus = this.$storage.getSecurityPwd().length === 0 ? 0 : 1;
		},
		methods: {
			updateWeekDesc(shouldUpdateTime) {
				let weekStorage = uni.getStorageSync(this.$config.weekStorageKey);
				let selectedWeeksArr = [];
				if (weekStorage) {
					weekStorage = JSON.parse(weekStorage);
					let weekDesc = '';
					let everyday = true;
					let workday = true;
					weekStorage.forEach((item, index) => {
						if (item.checked) {
							weekDesc += item.title + '、';
							if (index >= 5) {
								workday = false;
							}
							selectedWeeksArr.push(index + 1);
						} else {
							everyday = false;
							if (index < 5) {
								workday = false;
							}
						}
					})
					if (selectedWeeksArr.length) {
						const last = selectedWeeksArr[selectedWeeksArr.length - 1];
						if (last === 7) {
							selectedWeeksArr.pop();
							selectedWeeksArr.unshift(0);

						}
					}
					this.selectedWeeksArr = selectedWeeksArr;
					if (shouldUpdateTime) {
						this.updateGotoTime();
						this.updateGooffTime();
					}
					if (everyday) {
						this.weekDesc = '每天';
						return;
					} else if (workday) {
						this.weekDesc = '每工作日';
						return;
					} else {
						if (weekDesc.length) {
							this.weekDesc = weekDesc.substring(0, weekDesc.length - 1);
							return;
						}
					}
				}
				this.weekDesc = '点击选择';
			},
			startTimer() {
				if (this.status === '已就绪' && !this.timer) {
					this.timerRun();
					this.timer = setInterval(this.timerRun, 1000)
				}
			},
			timerRun() {
				const currentTime = this.$utils.getDateForYYMMDDHHMMSS();
				if (currentTime === this.gotoTime || currentTime === this.gooffTime) {
					this.openDingtalkAndSave(currentTime);
				}
				this.currentTime = currentTime;
			},
			openDingtalkAndSave(currentTime) {
				const clockData = {
					time: currentTime,
					status: false
				};
				this.$utils.openDingTalk().then(() => {
					clockData.status = true;
					this.$storage.saveClockHistory(clockData);
					uni.setStorageSync(this.$config.iosOpenedDingtalkKey, true);
				}).catch((err) => {
					clockData.status = false;
					this.$storage.saveClockHistory(clockData);
				});
			},
			openDingTalk() {
				this.$utils.openDingTalk().then(() => {
					uni.setStorageSync(this.$config.iosOpenedDingtalkKey, true);
					this.$refs.uTips.show({
						title: '打开钉钉成功',
						type: 'success',
						duration: '2000'
					})
				}).catch((err) => {
					this.$refs.uTips.show({
						title: '打开钉钉失败，请检查是否安装了钉钉',
						type: 'error',
						duration: '2000'
					})
				});
			},
			timePickerConfirm(e, type) {
				const time = `${e.hour}:${e.minute}`;
				if (type === 1) {
					if (this.gotoEndTimerPickerConfig.value && this.$utils.getMinAndSecondDiff(this.gotoEndTimerPickerConfig.value,
							time) >= 0) {
						this.$refs.uTips.show({
							title: `${this.gotoStartTimerPickerConfig.title.replace('选择','')}不得大于${this.gotoEndTimerPickerConfig.title.replace('选择','')}`,
							type: 'error',
							duration: '4000'
						})
						return;
					}
					this.gotoStartTimerPickerConfig.value = time;
					uni.setStorageSync(this.$config.gotoStartTimeStorageKey, time);
				} else if (type === 2) {
					if (this.gotoStartTimerPickerConfig.value && this.$utils.getMinAndSecondDiff(this.gotoStartTimerPickerConfig.value,
							time) <= 0) {
						this.$refs.uTips.show({
							title: `${this.gotoEndTimerPickerConfig.title.replace('选择','')}不得小于${this.gotoStartTimerPickerConfig.title.replace('选择','')}`,
							type: 'error',
							duration: '4000'
						})
						return;
					}
					this.gotoEndTimerPickerConfig.value = time;
					uni.setStorageSync(this.$config.gotoEndTimeStorageKey, time);
				} else if (type === 3) {
					if (this.gooffEndTimerPickerConfig.value && this.$utils.getMinAndSecondDiff(this.gooffEndTimerPickerConfig.value,
							time) >= 0) {
						this.$refs.uTips.show({
							title: `${this.gooffStartTimerPickerConfig.title.replace('选择','')}不得大于${this.gooffEndTimerPickerConfig.title.replace('选择','')}`,
							type: 'error',
							duration: '6000'
						})
						return;
					}
					this.gooffStartTimerPickerConfig.value = time;
					uni.setStorageSync(this.$config.gooffStartTimeStorageKey, time);
				} else if (type === 4) {
					if (this.gooffStartTimerPickerConfig.value && this.$utils.getMinAndSecondDiff(this.gooffStartTimerPickerConfig.value,
							time) <= 0) {
						this.$refs.uTips.show({
							title: `${this.gooffEndTimerPickerConfig.title.replace('选择','')}不得小于${this.gooffStartTimerPickerConfig.title.replace('选择','')}`,
							type: 'error',
							duration: '6000'
						})
						return;
					}
					this.gooffEndTimerPickerConfig.value = time;
					uni.setStorageSync(this.$config.gooffEndTimeStorageKey, time);
				}
				this.updateGotoTime();
				this.updateGooffTime();
			},
			getTimePickerConfig(index) {
				const configs = [this.gotoStartTimerPickerConfig, this.gotoEndTimerPickerConfig, this.gooffStartTimerPickerConfig,
					this.gooffEndTimerPickerConfig
				];
				return configs[index];
			},
			updateGotoTime() {
				this.gotoTime = this.getGotoTime();
			},
			updateGooffTime() {
				this.gooffTime = this.getGooffTime();
			},
			getGotoTime() {
				if (!this.selectedWeeksArr.length) {
					return '请选择星期';
				}
				if (!this.gotoStartTimerPickerConfig.value || !this.gotoEndTimerPickerConfig.value) {
					return '在选定区域内随机';
				}
				this.startTimer();
				return this.$utils.getNextClockFullTime(this.gotoStartTimerPickerConfig.value, this.gotoEndTimerPickerConfig.value,
					this.selectedWeeksArr);
			},
			getGooffTime() {
				if (!this.selectedWeeksArr.length) {
					return '请选择星期';
				}
				if (!this.gooffStartTimerPickerConfig.value || !this.gooffEndTimerPickerConfig.value) {
					return '在选定区域内随机';
				}
				this.startTimer();
				return this.$utils.getNextClockFullTime(this.gooffStartTimerPickerConfig.value, this.gooffEndTimerPickerConfig.value,
					this.selectedWeeksArr);
			},
			openDingtalkClick() {
				uni.showModal({
					title: '防误触提示',
					content: '请再次确定您要打开钉钉吗？',
					success: (res) => {
						if (res.confirm) {
							this.openDingTalk();
						}
					}
				});

			},
			copyOpenSourceUrl() {
				uni.setClipboardData({
					data: openSourceUrl
				})
			},
			openQQGroup() {
				//#ifdef H5
				window.location.href = qqGroupUrl;
				//#endif
				//#ifndef APP-PLUS
				return;
				//#endif
				//#ifdef APP-PLUS
				plus.runtime.openURL(qqGroupUrl, () => {
					this.$refs.uTips.show({
						title: '链接打开失败',
						type: 'error',
						duration: '2000'
					})
				});
				//#endif
			},
			securityClick() {
				if (this.pwdStatus === 0) {
					//开启密码保护
					uni.navigateTo({
						url: '../security/security?type=0'
					})
				} else {
					//关闭密码保护
					uni.navigateTo({
						url: '../security/security?type=2'
					})
				}

			},
			checkShouldShowSecurity(showTipWhenErr = false) {
				if (this.pwdStatus === 1) {
					let pages = getCurrentPages();
					let route = pages[pages.length - 1].route;
					if (route.indexOf('security') === -1) {
						this.showSecurity(!showTipWhenErr);
					}
				} else {
					if (showTipWhenErr) {
						this.$refs.uTips.show({
							title: '请先开启密码保护',
							type: 'error',
							duration: '2000'
						})
					}
				}
			},
			showSecurity(autoAuthentication = true) {
				uni.navigateTo({
					url: '../security/security?type=1&autoAuthentication=' + autoAuthentication,
					animationType: 'slide-in-bottom',
					animationDuration: 200
				})
				setTimeout(() => {
					this.showContent = true;
				}, 500)
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.nav-main{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: white;
			.nav-left,.nav-right{
				width: 200rpx;
			}
			.nav-right{
				display: flex;
				justify-content: flex-end;
			}
		}
		.time-view {
			z-index: 100;
			position: sticky;

			.time-view-text {
				font-size: 25rpx;
				margin-left: 5rpx;
			}

			width: 100%;
			height: 70rpx;
			background-color: $uni-color-success;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.list-item-subtitle {
			font-size: 26rpx;
		}

		.status-enable {
			color: $uni-color-success;
		}

		.status-disable {
			color: $uni-color-error;
		}
	}
</style>
