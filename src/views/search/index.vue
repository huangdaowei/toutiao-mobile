<template>
 <div class="search-container">
   <!-- 搜索栏 -->
   <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
   <form action="/">
    <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch(searchText)"
      @cancel="$router.back()"
      @focus="isResultShow = false"
    />
   </form>

   <!-- 搜索结果 -->
   <search-result v-if="isResultShow" :search-text="searchText" />

   <!-- 联想建议 -->
   <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch" />

   <!-- 历史记录 -->
   <search-history
    v-else
    :search-histories="searchHistories"
    @search="onSearch"
    @update-histories="searchHistories = $event"
  />

 </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'
export default {
  name: 'Search',
  data () {
    return {
      searchText: '', // 输入框的内容
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('search-histories') || [] // 搜索历史数据
    }
  },
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  watch: {
    searchHistories () {
      setItem('search-histories', this.searchHistories)
    }
  },
  computed: {
    ...mapState(['user'])

  },
  created () {
    this.loadSearchHistores()
  },
  methods: {
    onSearch (searchText) {
      // console.log('onSearch')
      this.searchText = searchText

      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) {
        // 把重复项移除
        this.searchHistories.splice(index, 1)
      }
      // 把最新的历史搜索记录放到顶部
      this.searchHistories.unshift(searchText)

      // setItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHistores () {
      let searchHistories = getItem('search-histories') || []
      if (this.user) {
        const { data } = await getSearchHistories()
        searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      }
      console.log(searchHistories)
      this.searchHistories = searchHistories
    }
  }
}

</script>

<style lang='less' scoped>

</style>
