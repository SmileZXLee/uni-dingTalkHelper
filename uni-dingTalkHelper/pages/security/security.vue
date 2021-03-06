<template>
	<view class="content">
		<view class="subtitle">{{subTitle}}</view>
		<view class="title">{{title}}</view>
		<u-message-input ref="uMessageInput" class="message-input" :maxlength="6" :focus="messageInputFocus" :breathe="true"
		 :dot-fill="true" @change="pwdChange"></u-message-input>
		<u-button class="confirm-btn my-confirm-btn" :disabled="!canNext" :ripple="true" type="primary" shape="circle" @click="confirmClick">{{confirmBtnText}}</u-button>
		<view class="soter-authentication-view" @click="doSoterAuthentication(()=>{})" v-if="type!==0&&authMode.length">
			<image :src="authMode==='facial'?'../../static/finger.png':'../../static/finger_print.png'"></image>
			<view>{{authContent.replace('请','点击')}}</view>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				title: '',
				subTitle: '',
				confirmBtnText: '',
				messageInputValue: '',
				authFail: false,
				authMode: '',
				autoAuthentication: true
			};
		},
		onBackPress(options) {
			if (options.from === 'backbutton') {
				return this.type === 1;
			}
		},
		onLoad(options) {
			let type = options.type;
			type = parseInt(type);
			this.type = type;
			if(options.autoAuthentication != undefined){
				this.autoAuthentication = options.autoAuthentication == 'true';
			}
			if (type === 0) {
				//设置密码
				this.subTitle = '请设置访问密码';
				this.confirmBtnText = '确定';
				uni.setNavigationBarTitle({
					title: '设置密码'
				})
			} else if (type === 1) {
				//验证密码
				this.subTitle = '验证您的密码以继续访问';
				this.confirmBtnText = '验证';
				uni.setNavigationBarTitle({
					title: '验证密码'
				})
				// #ifdef APP-PLUS
				var page = this.$mp.page.$getAppWebview();
				page.setStyle({
					popGesture: 'none'
				});
				// #endif
			} else if (type === 2) {
				//关闭密码保护
				this.subTitle = '验证您的密码以关闭密码保护';
				this.confirmBtnText = '验证';
				uni.setNavigationBarTitle({
					title: '关闭密码保护'
				})
			}
			this.checkSoterAuthentication();
			if(this.autoAuthentication){
				this.doSoterAuthentication();
			}
		},
		computed: {
			canNext() {
				return this.title.length === 6;
			},
			authContent(){
				if(this.type === 0 || !this.authMode.length){
					return '';
				}
				const additionConetnt = this.type === 1 ? '以继续访问' : '以关闭密码保护';
				const authContent = this.authMode === 'facial' ? '请验证您的面容ID' : '请验证您的指纹';
				return authContent + additionConetnt;
			},
			messageInputFocus(){
				return this.type === 0 || this.authContent.length === 0 || this.authFail;
			}
		},
		methods: {
			pwdChange(e) {
				this.title = e;
			},
			checkSoterAuthentication(successCallback) {
				//#ifndef APP-PLUS
				return;
				//#endif
				if(this.type === 0){
					return;
				}
				const $this = this;
				uni.checkIsSupportSoterAuthentication({
					success(res) {
						if (res.supportMode.length) {
							const authMode = res.supportMode[0];
							uni.checkIsSoterEnrolledInDevice({
								checkAuthMode: authMode,
								success(res) {
									if (res.isEnrolled) {
										$this.authMode = authMode;
										if (successCallback) {
											successCallback(authMode);
										}
									}
								}
							})
						}
					}
				})
			},
			doSoterAuthentication(callback) {
				//#ifndef APP-PLUS
				if(callback){
					callback(false);
				}
				return;
				//#endif
				if(this.type === 0){
					return;
				}
				const $this = this;
				this.checkSoterAuthentication(() => {
					uni.startSoterAuthentication({
						requestAuthModes: [this.authMode],
						challenge: this.$storage.getSecurityPwd(),
						authContent: this.authContent,
						success(res) {
							if($this.type === 1){
								uni.navigateBack({
									delta: 1
								})
							}else if($this.type === 2){
								$this.$storage.cleanSecurityPwd();
								uni.navigateBack({
									delta: 1
								})
							}
							if(callback){
								callback(true);
							}
						},
						fail(err) {
							$this.authFail = true;
							if(callback){
								callback(false);
							}
						}
					})
				})
			},
			confirmClick() {
				if (this.type === 0) {
					uni.showModal({
						title: '开启密码保护',
						content: `您的设置的密码为：${this.title}，是否确认开启密码保护？`,
						success: (res) => {
							if (res.confirm) {
								this.$storage.saveSecurityPwd(this.title);
								this.$refs.uTips.show({
									title: '设置成功',
									type: 'success',
									duration: '1000'
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)

							}
						}
					});
				} else if (this.type === 1) {
					const pwd = this.$storage.getSecurityPwd();
					if (this.title === pwd) {
						uni.navigateBack({
							delta: 1
						})
					} else {
						this.$refs.uTips.show({
							title: '密码错误，请重新输入',
							type: 'error',
							duration: '1000'
						})
						this.$refs.uMessageInput.reset();
					}
				} else if (this.type === 2) {
					const pwd = this.$storage.getSecurityPwd();
					if (this.title === pwd) {
						this.$storage.cleanSecurityPwd();
						uni.navigateBack({
							delta: 1
						})
					} else {
						this.$refs.uTips.show({
							title: '密码错误，请重新输入',
							type: 'error',
							duration: '1000'
						})
						this.$refs.uMessageInput.reset();
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;

		.subtitle {
			margin-top: 50rpx;
			font-size: 32rpx;
		}

		.title {
			margin-top: 30rpx;
			font-size: 80rpx;
			font-weight: bold;
			letter-spacing: 5rpx;
		}

		.message-input {
			margin-top: 30rpx;
		}

		.my-confirm-btn {
			margin-top: 60rpx;
		}
		
		.soter-authentication-view{
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: absolute;
			bottom: 50rpx;
			image{
				width: 80rpx;
				height: 80rpx;
			}
			view{
				font-size: 22rpx;
				margin-top: 12rpx;
			}
		}
	}
</style>
