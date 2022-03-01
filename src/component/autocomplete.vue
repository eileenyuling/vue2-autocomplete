<template>
  <div
    v-clickoutside="close"
    class="el-autocomplete"
    aria-haspopup="listbox"
    role="combobox"
    :aria-expanded="suggestionVisible"
    :aria-owns="id"
  >
    <el-input
      ref="input"
      v-bind="[$props, $attrs]"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
      @keydown.up.native.prevent="highlight(highlightedIndex - 1)"
      @keydown.down.native.prevent="highlight(highlightedIndex + 1)"
      @keydown.enter.native="handleKeyEnter"
      @keydown.native.tab="close"
    >
      <template v-if="$slots.prepend" slot="prepend">
        <slot name="prepend"></slot>
      </template>
      <template v-if="$slots.append" slot="append">
        <slot name="append"></slot>
      </template>
      <template v-if="$slots.prefix" slot="prefix">
        <slot name="prefix"></slot>
      </template>
      <template v-if="$slots.suffix" slot="suffix">
        <slot name="suffix"></slot>
      </template>
    </el-input>
    <el-autocomplete-suggestions
      :id="id"
      ref="suggestions"
      visible-arrow
      :class="[popperClass ? popperClass : '']"
      :popper-options="popperOptions"
      :append-to-body="popperAppendToBody"
      :placement="placement"
    >
      <li
        v-for="(item, index) in suggestions"
        :id="`${id}-item-${index}`"
        :key="index"
        :class="{'highlighted': highlightedIndex === index}"
        role="option"
        :aria-selected="highlightedIndex === index"
        @click="select(item)"
      >
        <slot :item="item">
          {{ item[valueKey] }}
        </slot>
      </li>
      <slot v-if="showNodata" name="noData"></slot>
    </el-autocomplete-suggestions>
  </div>
</template>
<script>
import debounce from 'throttle-debounce/debounce'
import ElInput from 'element-ui/packages/input'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import ElAutocompleteSuggestions from './autocomplete-suggestions.vue'
import Emitter from 'element-ui/src/mixins/emitter'
import Migrating from 'element-ui/src/mixins/migrating'
import { generateId } from 'element-ui/src/utils/util'
import Focus from 'element-ui/src/mixins/focus'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'TxAutocomplete',

  mixins: [Emitter, Focus('input'), Migrating],

  inheritAttrs: false,

  componentName: 'TxAutocomplete',

  components: {
    ElInput,
    ElAutocompleteSuggestions
  },

  directives: { Clickoutside },

  props: {
    valueKey: {
      type: String,
      default: 'value'
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    highlightFirstItem: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: String,
      default: ''
    },
    defaultSuggestions: {
      type: Array,
      default: () => {
        return []
      }
    },
    showEmptyContent: Function
  },
  data() {
    return {
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false,
      showNodata: false
    }
  },
  computed: {
    suggestionVisible() {
      const suggestions = this.suggestions
      const isValidData = (Array.isArray(suggestions) && suggestions.length > 0) || this.isEmpty
      return (isValidData || this.loading) && this.activated
    },
    id() {
      return `el-autocomplete-${generateId()}`
    }
  },
  watch: {
    suggestionVisible(val) {
      const $input = this.getInput()
      if ($input) {
        this.broadcast('ElAutocompleteSuggestions', 'visible', [val, $input.offsetWidth])
      }
    }
  },
  mounted() {
    this.debouncedGetData = debounce(this.debounce, this.getData)
    this.$on('item-click', item => {
      this.select(item)
    })
    const $input = this.getInput()
    $input.setAttribute('role', 'textbox')
    $input.setAttribute('aria-autocomplete', 'list')
    $input.setAttribute('aria-controls', 'id')
    $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
  },
  beforeDestroy() {
    this.$refs.suggestions.$destroy()
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'custom-item': 'custom-item is removed, use scoped slot instead.',
          'props': 'props is removed, use value-key instead.'
        }
      }
    },
    getData(queryString) {
      if (this.suggestionDisabled) {
        return
      }
      this.selected = false
      this.loading = true
      this.isEmpty = false
      this.fetchSuggestions(queryString, (suggestions) => {
        this.loading = false
        if (this.suggestionDisabled) {
          return
        }
        if (Array.isArray(suggestions)) {
          this.isEmpty = !suggestions.length
          this.suggestions = suggestions
          this.showNodata = this.showEmptyContent ? this.showEmptyContent(this) : false
          this.highlightedIndex = this.highlightFirstItem ? 0 : -1
        } else {
          console.error('[Element Error][Autocomplete]autocomplete suggestions must be an array')
        }
      })
    },
    handleInput(value) {
      this.inputValue = value
      this.$emit('input', value)
      this.suggestionDisabled = false
      if (!this.triggerOnFocus && !value) {
        this.suggestionDisabled = true
        this.suggestions = []
        return
      }
      this.debouncedGetData(value)
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    handleFocus(event) {
      this.activated = true
      this.$emit('focus', event)
      if (this.lastSuggestions) {
        this.suggestions = this.lastSuggestions
        return
      }
      if (this.triggerOnFocus) {
        this.debouncedGetData(this.value)
      }
    },
    handleBlur(event) {
      setTimeout(() => {
        if (!this.selected) { // 如果没有选择任何选项，则恢复上一次的选项
          this.$emit('input', this.lastSelectedValue)
          this.lastSuggestions && (this.suggestions = cloneDeep(this.lastSuggestions))
        }
      }, 300)
      this.$emit('blur', event)
    },
    handleClear() {
      this.activated = false
      this.$emit('clear')
    },
    close() {
      this.activated = false
    },
    handleKeyEnter(e) {
      if (this.suggestionVisible && this.highlightedIndex >= 0 && this.highlightedIndex < this.suggestions.length) {
        e.preventDefault()
        this.select(this.suggestions[this.highlightedIndex])
      } else if (this.selectWhenUnmatched) {
        this.$emit('select', { value: this.value })
        this.$nextTick(() => {
          this.suggestions = []
          this.highlightedIndex = -1
        })
      }
    },
    select(item) {
      this.selected = true
      this.$emit('input', item[this.valueKey])
      this.$emit('select', item)
      this.$nextTick(() => {
        this.suggestions = []
        this.highlightedIndex = -1
      })
      this.lastSelectedValue = item[this.valueKey]
      this.lastSuggestions = cloneDeep(this.suggestions)
      this.isEmpty = false
    },
    highlight(index) {
      if (!this.suggestionVisible || this.loading) { return }
      if (index < 0) {
        this.highlightedIndex = -1
        return
      }
      if (index >= this.suggestions.length) {
        index = this.suggestions.length - 1
      }
      const suggestion = this.$refs.suggestions.$el.querySelector('.el-autocomplete-suggestion__wrap')
      const suggestionList = suggestion.querySelectorAll('.el-autocomplete-suggestion__list li')

      const highlightItem = suggestionList[index]
      const scrollTop = suggestion.scrollTop
      const offsetTop = highlightItem.offsetTop

      if (offsetTop + highlightItem.scrollHeight > (scrollTop + suggestion.clientHeight)) {
        suggestion.scrollTop += highlightItem.scrollHeight
      }
      if (offsetTop < scrollTop) {
        suggestion.scrollTop -= highlightItem.scrollHeight
      }
      this.highlightedIndex = index
      const $input = this.getInput()
      $input.setAttribute('aria-activedescendant', `${this.id}-item-${this.highlightedIndex}`)
    },
    getInput() {
      return this.$refs.input.getInput()
    },
    setDefaultValue(defaultValue, defaultSuggestions) {
      this.$emit('input', defaultValue)
      this.lastSuggestions = defaultSuggestions
      this.lastSelectedValue = defaultValue
    }
  }
}
</script>
