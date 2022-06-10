<template>
  <div style="height: 100%">
    <el-container class="container">
      <div v-if="phone">
        <menu-drawer></menu-drawer>
      </div>
      <div v-if="!phone">
        <el-aside :width="sidebarWidth" class="aside">
          <sidebar :isCollapse="collapse"></sidebar>
        </el-aside>
      </div>
      <el-container>
        <el-header class="header" height="3rem">
          <div class="header-box">
            <div class="left">
              <div class="sidebar-button" @click="changeSideBar">
                <i :class="sidebarButton"> </i>
              </div>
              <BreadNav></BreadNav>
            </div>
            <div class="right"><NavBar /></div>
          </div>
        </el-header>
        <el-main>
          <trans-main />
        </el-main>
        <el-footer class="foot">
          <p>copyright@xwh</p>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  Sidebar,
  BreadNav,
  NavTab,
  TransMain,
  NavBar,
  menuDrawer,
} from "@/components/layout/index.js";
export default {
  name: "Home",
  components: {
    Sidebar,
    BreadNav,
    NavTab,
    TransMain,
    NavBar,
    menuDrawer,
  },
  inject: ["eventBus"],
  data() {
    return {
      phone: false,
      sidebarWidth: "170px",
      screenwidth: 0,
    };
  },
  computed: {
    sidebarButton() {
      return this.collapse ? "el-icon-s-unfold" : "el-icon-s-fold";
    },
    collapse() {
      return this.$store.getters.collapse;
      
    },
  },
  watch: {
    collapse() {
      this.sidebarWidth = this.collapse ? "65px" : "170px";
    },
    screenwidth() {
      if (!this.timer) {
        this.timer = true;
        setTimeout(() => {
          this.phone = this.screenwidth < 571 ? true : false;
          this.timer = false;
        }, 400);
      }
    },
  },
  methods: {
    changeSideBar() {
      this.$store.commit("SET_COLLAPSE", !this.collapse);
    },
  },
  mounted() {
    
  },
  created() {
    this.screenwidth=document.body.clientWidth
    this.phone=this.screenwidth<571?true:false
    window.addEventListener("resize", () => {
      this.screenwidth = document.body.clientWidth;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.container {
  height: 100%;

  .aside {
    overflow: hidden;
    z-index: 1;
    background: $background-color-sidebar;
    transition: all 0.4s linear;
    //隐藏滚动条
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (max-width: 430) {
      width: 0 !important;
      overflow: hidden;
    }
  }
}

.header {
  display: flex;
  flex-direction: column;
  padding: 0;
  border-bottom: 1px solid $border-color-light;
  background-color: $background-color-header;
  box-shadow: 0 0 3px #eaecef;

  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 30px;
    transition: height 0.3s linear;

    .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;

      .sidebar-button {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin-right: 1rem;
        cursor: pointer;

        i {
          color: $font-color-gray;
          font-size: 2rem;
        }
      }
    }
  }
}

.foot {
  background-color: rgb(70, 70, 70);
  display: grid;
  place-items: center;

  p {
    color: #eaecef;
  }
}
</style>
