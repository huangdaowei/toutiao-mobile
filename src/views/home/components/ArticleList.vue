<template>
  <div class="article-list">
    {{channel.name}}的内容
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less"></style>
