import Autocomplete from './src/autocomplete.vue';
// import './style.css'
/* istanbul ignore next */
Autocomplete.install = function(Vue) {
  Vue.component(Autocomplete.name, Autocomplete);
};

export default Autocomplete;
