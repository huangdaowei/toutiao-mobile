<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isRefreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item v-for="(article, index) in articles" :key="index" :article="article" />
        <!-- <van-cell v-for="(article, index) in articles" :key="index" :title="article.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的loading状态
      refreshSuccessText: '' // 下拉提示
    }
  },
  methods: {
    async onLoad () {
      // 1、请求获取数据、
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(), // 时间戳
        with_top: 1 // 1表示置顶，0表示不置顶
      })
      console.log(data)
      // 2、把数据放到list数组中
      const { results } = data.data
      this.articles.push(...results)
      // 3、设置本次加载状态结束，他才可以预判是否需要加载下一次，否则就会永远的停在这里
      this.loading = false
      // 4、数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把加载状态设置结束，不在出发触发加载更多
        this.finished = true
      }
    },
    async onRefresh () {
      // console.log('123')
      // 下拉刷新，组件自己就会展示loading状态
      // 1、请求获取数据、
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: Date.now(), // 时间戳
        with_top: 1 // 1表示置顶，0表示不置顶
      })
      // 2、把数据放到数据列表中（往顶部添加）
      const { results } = data.data
      this.articles.unshift(...results)
      // 3、关闭刷新的数据loading
      this.isRefreshLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
