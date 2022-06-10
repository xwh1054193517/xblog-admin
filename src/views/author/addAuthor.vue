<template>
  <div class="container">
    <div class="title">
      <span>添加作者</span>
    </div>
    <el-card class="box-card">
      <author-info></author-info>
    </el-card>
  </div>
</template>

<script>
import authorInfo from "./authorInfo.vue";
export default {
  components: { authorInfo },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/title.scss";

.box-card{
  margin: 20px 30px;
}
</style>
