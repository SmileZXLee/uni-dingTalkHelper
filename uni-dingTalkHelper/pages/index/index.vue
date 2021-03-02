<!-- github地址:https://github.com/SmileZXLee/uni-dingTalkHelper -->
<template>
	<view class="content">
		<uni-list style="width: 100%;">
			<uni-section title="状态"></uni-section>
			<uni-list-item title="就绪状态">
				<template slot="footer">
					<view :class="status==='已就绪'?'list-item-subtitle status-enable':'list-item-subtitle status-disable'">{{status}}</view>
				</template>
			</uni-list-item>
			<uni-section title="【上班】自动打卡时间"></uni-section>
			<uni-list-item title="【上班】打卡起始时间" clickable @click="gotoStartTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gotoStartTimerPickerConfig.value.length?gotoStartTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			
			<uni-list-item title="【上班】打卡结束时间" clickable @click="gotoEndTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gotoEndTimerPickerConfig.value.length?gotoEndTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="【上班】下次打卡时间" clickable @click="updateGotoTime">
				<template slot="footer">
					<view class="list-item-subtitle">{{gotoTime}}</view>
				</template>
			</uni-list-item>
			<uni-section title="【下班】自动打卡时间"></uni-section>
			<uni-list-item title="【下班】打卡起始时间" clickable @click="gooffStartTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gooffStartTimerPickerConfig.value.length?gooffStartTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="【下班】打卡结束时间" clickable @click="gooffEndTimerPickerConfig.show=true">
				<template slot="footer">
					<view class="list-item-subtitle">{{gooffEndTimerPickerConfig.value.length?gooffEndTimerPickerConfig.value:'点击设置'}}</view>
				</template>
			</uni-list-item>
			<uni-list-item title="【下班】下次打卡时间" clickable @click="updateGooffTime">
				<template slot="footer">
					<view class="list-item-subtitle">{{gooffTime}}</view>
				</template>
			</uni-list-item>
			<uni-section title="打卡星期"></uni-section>
			<uni-list-item title="星期" to="/pages/week-select/week-select" showArrow="true">
				<template slot="footer">
					<view class="list-item-subtitle">{{weekDesc}}</view>
				</template>
			</uni-list-item>
			<uni-section title="功能测试"></uni-section>
			<uni-list-item title="测试打开钉钉" clickable showArrow="true" @click="openDingtalkClick">
				
			</uni-list-item>
		</uni-list>
		<u-picker @confirm="e=>{timePickerConfirm(e,1)}" mode="time" :title="gotoStartTimerPickerConfig.title" :default-time="gotoStartTimerPickerConfig.value.length?gotoStartTimerPickerConfig.value:gotoStartTimerPickerConfig.default" :params="{'hour': true,'minute': true}" v-model="gotoStartTimerPickerConfig.show"></u-picker>
		<u-picker @confirm="e=>{timePickerConfirm(e,2)}" mode="time" :title="gotoEndTimerPickerConfig.title" :default-time="gotoEndTimerPickerConfig.value.length?gotoEndTimerPickerConfig.value:gotoEndTimerPickerConfig.default" :params="{'hour': true,'minute': true}" v-model="gotoEndTimerPickerConfig.show"></u-picker>
		<u-picker @confirm="e=>{timePickerConfirm(e,3)}" mode="time" :title="gooffStartTimerPickerConfig.title" :default-time="gooffStartTimerPickerConfig.value.length?gooffStartTimerPickerConfig.value:gooffStartTimerPickerConfig.default" :params="{'hour': true,'minute': true}" v-model="gooffStartTimerPickerConfig.show"></u-picker>
		<u-picker @confirm="e=>{timePickerConfirm(e,4)}" mode="time" :title="gooffEndTimerPickerConfig.title" :default-time="gooffEndTimerPickerConfig.value.length?gooffEndTimerPickerConfig.value:gooffEndTimerPickerConfig.default" :params="{'hour': true,'minute': true}" v-model="gooffEndTimerPickerConfig.show"></u-picker>
	</view>
</template>

<script> 
	export default {
		data() {
			return {
				show:true,
				timer: null,
				gotoStartTimerPickerConfig:{
					title: '选择【上班】打卡起始时间',
					show: false,
					default: '09:00',
					value: uni.getStorageSync(this.$config.gotoStartTimeStorageKey)
				},
				gotoEndTimerPickerConfig:{
					title: '选择【上班】打卡结束时间',
					show: false,
					default: '09:30',
					value: uni.getStorageSync(this.$config.gotoEndTimeStorageKey)
				},
				gooffStartTimerPickerConfig:{
					title: '选择【下班】打卡开始时间',
					show: false,
					default: '17:30',
					value: uni.getStorageSync(this.$config.gooffStartTimeStorageKey)
				},
				gooffEndTimerPickerConfig:{
					title: '选择【下班】打卡结束时间',
					show: false,
					default: '18:00',
					value: uni.getStorageSync(this.$config.gooffEndTimeStorageKey)
				},
				weekDesc: '',
				selectedWeeksArr: [],
				gotoTime: '',
				gooffTime: ''
			}
		},
		computed:{
			status(){
				// if(!this.$utils.isDingtalkInstalled()){
				// 	return '请先安装钉钉';
				// }
				if(!this.$utils.isApp()){
					return '请在App中运行';
				}
				const time1 = uni.getStorageSync(this.$config.gotoStartTimeStorageKey);
				const time2 = uni.getStorageSync(this.$config.gotoStartTimeStorageKey);
				const time3 = uni.getStorageSync(this.$config.gotoStartTimeStorageKey);
				const time4 = uni.getStorageSync(this.$config.gotoStartTimeStorageKey);
				if(!((time1 && time2) || (time3 && time4))){
					if(!time1){
						return `请${this.gotoStartTimerPickerConfig.title}`;
					}
					if(!time2){
						return `请${this.gotoEndTimerPickerConfig.title}`;
					}
					if(!time3){
						return `请${this.gooffStartTimerPickerConfig.title}`;
					}
					if(!time4){
						return `请${this.gooffEndTimerPickerConfig.title}`;
					}
				}
				if(this.weekDesc === '点击选择'){
					return '请选择星期';
				}
				return '已就绪';
			}
		},
		onLoad() {
			uni.setKeepScreenOn({
			    keepScreenOn: true
			});
			this.updateWeekDesc(false);
			uni.$on('update-week',()=>{
				this.updateWeekDesc(true);
			})
		},
		onShow() {
			this.updateGotoTime();
			this.updateGooffTime();
			console.log(this.$utils.getDateForYYMMDDHHMMSS())
		},
		methods: {
			updateWeekDesc(shouldUpdateTime){
				let weekStorage = uni.getStorageSync(this.$config.weekStorageKey);
				let selectedWeeksArr = [];
				if(weekStorage){
					weekStorage = JSON.parse(weekStorage);
					let weekDesc = '';
					let everyday = true;
					let workday = true;
					weekStorage.forEach((item,index)=>{
						if(item.checked){
							weekDesc += item.title + '、';
							if(index >= 5){
								workday = false;
							}
							selectedWeeksArr.push(index + 1);
						}else{
							everyday = false;
							if(index < 5){
								workday = false;
							}
						}
					})
					if(selectedWeeksArr.length){
						const last = selectedWeeksArr[selectedWeeksArr.length-1];
						if(last === 7){
							selectedWeeksArr.pop();
							selectedWeeksArr.unshift(0);
							
						}
					}
					this.selectedWeeksArr = selectedWeeksArr;
					if(shouldUpdateTime){
						this.updateGotoTime();
						this.updateGooffTime();
					}
					if(everyday){
						this.weekDesc = '每天';
						return;
					}else if(workday){
						this.weekDesc = '每工作日';
						return;
					}else{
						if(weekDesc.length){
							this.weekDesc = weekDesc.substring(0,weekDesc.length - 1);
							return;
						}
					}
				}
				this.weekDesc = '点击选择';
			},
			startTimer(){
				if(this.status === '已就绪' && !this.timer){
					this.timer = setInterval(()=>{
						const currentTime = this.$utils.getDateForYYMMDDHHMMSS();
						if(currentTime === this.gotoTime){
							this.$utils.openDingTalk((err) => {
								console.log(err);
							});
						}else if(currentTime === this.gooffTime){
							this.$utils.openDingTalk((err) => {
								console.log(err);
							});
						}
					},1000)
				}
			},
			timePickerConfirm(e,type){
				if(type === 1){
					this.gotoStartTimerPickerConfig.value=`${e.hour}:${e.minute}`;
					uni.setStorageSync(this.$config.gotoStartTimeStorageKey,`${e.hour}:${e.minute}`);
				}else if(type === 2){
					this.gotoEndTimerPickerConfig.value=`${e.hour}:${e.minute}`;
					uni.setStorageSync(this.$config.gotoEndTimeStorageKey,`${e.hour}:${e.minute}`);
				}else if(type === 3){
					this.gooffStartTimerPickerConfig.value=`${e.hour}:${e.minute}`;
					uni.setStorageSync(this.$config.gooffStartTimeStorageKey,`${e.hour}:${e.minute}`);
				}else if(type === 4){
					this.gooffEndTimerPickerConfig.value=`${e.hour}:${e.minute}`;
					uni.setStorageSync(this.$config.gooffEndTimeStorageKey,`${e.hour}:${e.minute}`);
				}
				
				if(type === 1 || type === 2){
					this.updateGotoTime();
				}
			},
			getTimePickerConfig(index){
				const configs = [this.gotoStartTimerPickerConfig,this.gotoEndTimerPickerConfig,this.gooffStartTimerPickerConfig,this.gooffEndTimerPickerConfig];
				return configs[index];
			},
			updateGotoTime(){
				this.gotoTime = this.getGotoTime();
			},
			updateGooffTime(){
				this.gooffTime = this.getGooffTime();
			},
			getGotoTime(){
				if(!this.selectedWeeksArr.length){
					return '请选择星期';
				}
				if(!this.gotoStartTimerPickerConfig.value || !this.gotoEndTimerPickerConfig.value){
					return '在选定区域内随机';
				}
				this.startTimer();
				return this.$utils.getNextClockFullTime(this.gotoStartTimerPickerConfig.value,this.gotoEndTimerPickerConfig.value,this.selectedWeeksArr);
			},
			getGooffTime(){
				if(!this.selectedWeeksArr.length){
					return '请选择星期';
				}
				if(!this.gooffStartTimerPickerConfig.value || !this.gooffEndTimerPickerConfig.value){
					return '在选定区域内随机';
				}
				this.startTimer();
				return this.$utils.getNextClockFullTime(this.gooffStartTimerPickerConfig.value,this.gooffEndTimerPickerConfig.value,this.selectedWeeksArr);
			},
			openDingtalkClick() {
				uni.showModal({
				    title: '防误触提示',
				    content: '请再次确定您要打开钉钉吗？',
				    success: (res) => {
				        if (res.confirm) {
				            this.$utils.openDingTalk((err) => {
				            	console.log(err);
				            });
				        }
				    }
				});

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
		.list-item-subtitle{
			font-size: 26rpx;
		}
		.status-enable{
			color: $uni-color-success;
		}
		.status-disable{
			color: $uni-color-error;
		}
	}
</style>
