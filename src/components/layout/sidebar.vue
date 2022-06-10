<template>
  <!-- 侧边栏 -->
  <div class="sidebar">
    <div class="title-box">
      <div class="title" v-if="!isCollapse">Xblog-Admin</div>
      <div class="title" v-else>Xblog</div>
    </div>
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#333"
      text-color="#bbb"
      active-text-color="#fff"
      router
    >
      <el-menu-item index="/about">
        <i class="el-icon-sunrise-1"></i>
        <span slot="title">点滴成长</span>
      </el-menu-item>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-reading"></i>
          <span slot="title">文章管理</span>
        </template>
        <el-menu-item index="/article/article">文章板块</el-menu-item>
        <el-menu-item index="/article/addArticle">发布文章</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span slot="title">作者管理</span>
        </template>
        <el-menu-item index="/author/author">作者板块</el-menu-item>
        <el-menu-item index="/author/addAuthor">添加作者</el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-collection-tag"></i>
          <span slot="title">类别管理</span>
        </template>
        <el-menu-item index="/category/category">分类管理</el-menu-item>
        <el-menu-item index="/category/tag">标签管理</el-menu-item>
      </el-submenu>

      <el-menu-item index="/message/message">
        <i class="el-icon-chat-line-square"></i>
        <span slot="title">留言板录</span>
      </el-menu-item>
      <el-menu-item index="/friend/friend">
        <i class="el-icon-setting"></i>
        <span slot="title">友链设置</span>
      </el-menu-item>
      <el-menu-item index="/music/music">
        <i class="el-icon-headset"></i>
        <span slot="title">音乐管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    isCollapse: Boolean,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  font-size: $font-size-extra-large;
  letter-spacing: 1px;
  color: #fff;
}
@media all and (max-width: 571px) {
  .el-menu--collapse {
    width: 0;
    overflow: hidden;
  }
}
.title-box {
  min-height: 10vh;
}
.el-menu-vertical-demo {
  min-height: 90vh;
  height: 100%;
}
</style>
