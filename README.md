# vue2-el-autocomplete

## 需要配合`element-ui`使用，或者引入`element-ui`的css样式
基于`element-ui`的`el-autocomplete`, 弥补`el-autocomplete`一些不足：
1、`el-autocomplete`无法设置默认值；
2、不选择的时候，搜索文字仍旧被保留在输入框中；
3、没有搜索结果的时候，下拉框会消失，用户体验不好

解决：
1、新增`defaultValue`和`defaultSuggestions`, 作为默认值
2、不选择时，清除搜索文字，使用上一次的搜索结果
3、没有结果的时候，增加slot:noData, 可以自定义显示内容