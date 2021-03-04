<!-- github地址:https://github.com/SmileZXLee/uni-dingTalkHelper -->
<template>
	<view class="content">
		<uni-list style="width: 100%;">
			<uni-list-item :title="item.title" clickable @click="weekItemClick(item,index)" v-for="(item,index) in weekArr" :key="index">
				<template slot="footer">
					<u-icon name="checkbox-mark" :class="item.checked?'check-mark-selected':'check-mark-unselected'"></u-icon>
				</template>
			</uni-list-item>
		</uni-list>

		<u-button class="confirm-btn" :ripple="true" type="primary" shape="circle" @click="confirmClick">保存</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weekArr: [{
					title: '周一',
					checked: false
				}, {
					title: '周二',
					checked: false
				}, {
					title: '周三',
					checked: false
				}, {
					title: '周四',
					checked: false
				}, {
					title: '周五',
					checked: false
				}, {
					title: '周六',
					checked: false
				}, {
					title: '周日',
					checked: false
				}]
			};
		},
		onLoad() {
			const weekStorage = uni.getStorageSync(this.$config.weekStorageKey);
			if (weekStorage) {
				this.weekArr = JSON.parse(weekStorage);
			}
		},
		methods: {
			weekItemClick(item, index) {
				item.checked = !item.checked;
			},
			confirmClick() {
				uni.setStorageSync(this.$config.weekStorageKey, JSON.stringify(this.weekArr));
				uni.$emit('update-week');
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		.check-mark-selected {
			color: $uni-color-primary;
		}

		.check-mark-unselected {
			color: $uni-text-color-disable;
		}
	}
</style>
