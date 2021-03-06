<template>
	<view class="content">
		<z-paging ref="paging" @query="updateList" :list.sync="list" :use-custom-refresher="true" style="height: 100%;">
			<empty-view slot="empty"></empty-view>
			<uni-list style="width: 100%;" v-if="list.length">
				<uni-swipe-action>
					<uni-swipe-action-item v-for="(item, index) in list" :right-options="swipeActionOptions" @click="swipeActionDelClick">
						<uni-list-item :title="item.time">
							<template slot="footer">
								<view :class="item.status?'status-view status-view-success':'status-view status-view-error'">{{item.status?'成功':'失败'}}</view>
							</template>
						</uni-list-item>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</uni-list>
		</z-paging>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				swipeActionOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			};
		},
		methods: {
			updateList() {
				const list = this.$storage.getClockHistory();
				this.$refs.paging.setLocalPaging(list);
			},
			swipeActionDelClick(e) {
				this.$storage.delClockHistoryWithTime(this.list[e.index].time);
				this.$refs.paging.reload();
			}
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
						this.$refs.paging.reload();
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
