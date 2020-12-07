<template>
 <div class="search-result">
   <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
    <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
  </van-list>
 </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
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
  methods: {
    async onLoad () {
      // 请求获取数
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.searchText // 搜索字符
      })
      console.log(data)
      // 将数据放到数据列表中
      const { results } = data.data
      this.list.push(...results)
      // 关闭本次的loading
      this.loading = false
      // 判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}

</script>

<style lang='less' scoped>
.search-result {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
}
</style>
