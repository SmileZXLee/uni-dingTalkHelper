<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.confirm-btn{
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		margin-top: 40rpx;
	}
</style>
