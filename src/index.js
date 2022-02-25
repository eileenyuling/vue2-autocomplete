import Autocomplete from './component/autocomplete.vue';
/* istanbul ignore next */
Autocomplete.install = function(Vue) {
  Vue.component(Autocomplete.name, Autocomplete);
};

export default Autocomplete;
