<template>
 <div class="search-suggestion">
   <van-cell icon="search" v-for="(str, index) in suggestions" :key="index" @click="$emit('search', str)">
     <div slot="title" v-html="highlight(str)"></div>
   </van-cell>
 </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {
  },
  watch: {
    // 属性名：要监视的数据名称
    // searchText () {
    //   console.log('hello')
    // }
    // 这才是监听的完整写法
    searchText: {
      handler: debounce(async function () { // 防抖效果
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 500),
      immediate: true // 该回调将会在侦听之后立即被调用
    }
  },
  methods: {
    highlight (str) {
      return str.replace(new RegExp(this.searchText, 'gi'), `<span style="color: red">${this.searchText}</span>`)
    }
  }
}

</script>

<style lang='less' scoped>

</style>
