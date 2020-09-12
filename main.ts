// @ts-ignore
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/tailwind.css'
import './assets/normalize.css';
import './assets/style.css';
import './assets/donate.css';
import './assets/poppups.css';

// @ts-ignore
import PortalVue from 'portal-vue'

Vue.config.productionTip = false;
Vue.use(PortalVue)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
