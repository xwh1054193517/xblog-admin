<template>
  <!-- 右上角用户展示区 -->
  <div class="user-container">
    <fullscreen></fullscreen>
    <div class="user-info">
      <span class="name">{{ author.name }}</span>
      <user-area></user-area>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Fullscreen from "../common/fullscreen.vue";
import userArea from "./userArea.vue";
export default {
  components: { userArea, Fullscreen },
 
  data() {
    return {};
  },
  computed:{
     ...mapGetters(["author"]),
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.user-container {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  color: #ccc;
}

.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.name {
  margin-right: 1.5rem;
  font-size: 1rem;
}
</style>
