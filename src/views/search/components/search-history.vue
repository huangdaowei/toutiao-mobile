<template>
 <div class="search-history">
   <van-cell title="搜索历史">
     <div v-if="isDeleteShow">
       <span
       @click="$emit('update-histories', [])">全部删除</span>
       &nbsp;&nbsp;
       <span @click="isDeleteShow = false">完成</span>
     </div>
     <van-icon v-else name="delete" @click="isDeleteShow = true" />
   </van-cell>
   <van-cell :title="history" v-for="(history, index) in searchHistories" :key="index" @click="onDelete(history, index)">
     <van-icon v-show="isDeleteShow" name="close" />
   </van-cell>
 </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false
    }
  },
  components: {
  },
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onDelete (history, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        return
      }
      // 非删除状态，则执行搜索
      this.$emit('search', history)
    }
  }
}

</script>

<style lang='less' scoped>

</style>
