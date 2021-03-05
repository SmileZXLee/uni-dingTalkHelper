<template>
	<view class="content">
		<view class="subtitle">{{subTitle}}</view>
		<view class="title">{{title}}</view>
		<u-message-input ref="uMessageInput" class="message-input" :maxlength="6" :focus="true" :breathe="true" :dot-fill="true" @change="pwdChange"></u-message-input>
		<u-button class="confirm-btn my-confirm-btn" :disabled="!canNext" :ripple="true" type="primary" shape="circle" @click="confirmClick">{{confirmBtnText}}</u-button>
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
				messageInputValue: ''
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
		},
		computed: {
			canNext() {
				return this.title.length === 6;
			}
		},
		methods: {
			pwdChange(e) {
				this.title = e;
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
				}else if(this.type === 1){
					const pwd = this.$storage.getSecurityPwd();
					if(this.title === pwd){
						uni.navigateBack({
							delta: 1
						})
					}else{
						this.$refs.uTips.show({
							title: '密码错误，请重新输入',
							type: 'error',
							duration: '1000'
						})
						this.$refs.uMessageInput.reset();
					}
				}else if(this.type === 2){
					const pwd = this.$storage.getSecurityPwd();
					if(this.title === pwd){
						this.$storage.cleanSecurityPwd();
						uni.navigateBack({
							delta: 1
						})
					}else{
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
			font-size: 70rpx;
			font-weight: bold;
			letter-spacing: 8rpx;
		}

		.message-input {
			margin-top: 30rpx;
		}

		.my-confirm-btn {
			margin-top: 60rpx;
		}
	}
</style>
