<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        size="small"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <!-- 文章频道列表 -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab :title="channel.name" :key="channel.id" v-for="channel in channels">
        <ArticleList :channel = 'channel' />
      </van-tab>
      <!-- 汉堡按钮把最后的位置占住了，解决办法就是在最后一个位置添加一个元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div slot="nav-right" @click="isChannelEditShow=true" class="wap-nav-wrap">
        <van-icon name="wap-nav"  />
      </div>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      closeable
      class="channel-edit-popup"
      close-icon-position="top-left"
      get-container="body"
      style="height: 100%"
    >
    <channel-edit
      :user-channels="channels"
      @close="isChannelEditShow = false"
      @update-active="active = $event"
      :active="active"
    />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/ArticleList'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'Home',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 弹出层是否显示
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 已经登录，请求获取线上的用户频道数据列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录，判断是否有本地存储的用户频道数据列表
        const localChannels = getItem('user-channels')
        // 如果有本地存储的频道列表则使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 没有登录，也没有本地存储，则请求默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中
      this.channels = channels
      // 请求获取频道数据
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels
    }
    // onUpdateActive (index) {
    //   console.log(index)
    //   this.active = index
    // }
  }
}
</script>

<style scoped lang="less">
.home-container {
  /deep/.van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    /deep/ .van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/ .van-tabs__line {
      bottom: 20px;
      width: 15px !important;
      height: 3px;
      background-color: #3296fa;
    }
  }
  .wap-nav-placeholder {
    width: 33px;
    height: 43px;
    flex-shrink: 0;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    opacity: .9;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 24px;
    }
  }
}
</style>
