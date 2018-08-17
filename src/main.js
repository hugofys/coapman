
import App from './App.vue'
import VueResource from 'vue-resource'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' 
// import 'material-design-icons/iconfont/material-icons.css'
// import 'typeface-roboto/index.css'
import '../static/common.css'


Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(Vuetify, {
  theme: {
    primary: '#00285e',
    secondary: '#00285e',
    accent: '#e95c38',

    error: '#FF5252',
    info: '#00285e',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
