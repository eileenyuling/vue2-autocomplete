import Vue from 'vue'
import App from './App.vue'
import Autocomplete from '../src'

Vue.config.productionTip = false

Vue.use(Autocomplete)
new Vue({
  render: h => h(App),
}).$mount('#app')
