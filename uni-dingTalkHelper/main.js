//github地址:https://github.com/SmileZXLee/uni-dingTalkHelper
import Vue from 'vue'
import App from './App'
import uView from 'uview-ui';
import utils from './utils/index.js'
import config from './config/index.js'
import storage from './utils/storage.js'

Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$config = config
Vue.prototype.$storage = storage
Vue.use(uView);
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
