<template>
  <!-- 面包屑导航 -->
  <div class="breadNav">
    <a
      class="item"
      v-for="(item, index) in titleInfo"
      :key="index"
      style="cursor: default"
    >
      <p>{{ item }}</p>
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {
    titleInfo() {
        return this.$route.meta.breadNav
    },
  },
};
</script>

<style lang="scss" scoped>
.breadNav {
  display: flex;
  align-items: center;
  font-size: 14px;
  .item {
    color: #ccc;
    display: flex;
    align-items: center;
    padding-right: 18px;
    position: relative;

    &::after {
      content: "/";
      position: absolute;
      top: 0;
      right: 6px;
    }
  }

  .item:last-child {
    padding-right: 0;

    &:after {
      content: "";
    }
  }
}

@media all and (max-width: 479px) {
  .breadNav {
    width: 0;
    overflow: hidden;
  }
}

</style>
