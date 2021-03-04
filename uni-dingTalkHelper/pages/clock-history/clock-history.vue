<template>
	<view class="content">
		<uni-list style="width: 100%;" v-if="list.length">
			<uni-list-item :title="item.time" v-for="(item,index) in list" :key="index">
				<template slot="footer">
					<view :class="item.status?'status-view status-view-success':'status-view status-view-error'">{{item.status?'成功':'失败'}}</view>
				</template>
			</uni-list-item>
		</uni-list>
		<u-empty v-else text="无打卡记录" mode="history" icon-size="120"></u-empty>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			this.list = this.$storage.getClockHistory();
		},
		onNavigationBarButtonTap() {
			if (!this.list.length) {
				this.$refs.uTips.show({
					title: '暂无打卡记录',
					type: 'warning',
					duration: '2000'
				})
				return;
			}
			uni.showModal({
				title: '提示',
				content: '确定清空定时打卡记录吗？',
				success: (res) => {
					if (res.confirm) {
						this.$storage.cleanClockHistory();
						this.list = this.$storage.getClockHistory();
						this.$refs.uTips.show({
							title: '清除成功',
							type: 'success',
							duration: '2000'
						})
					}
				}
			});
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		width: 100%;

		.status-view {
			padding: 5rpx 15rpx;
			font-size: 24rpx;
			border-radius: 5rpx;
			color: white;
		}

		.status-view-success {
			background-color: $uni-color-success;
		}

		.status-view-error {
			background-color: $uni-color-error;
		}
	}
</style>
