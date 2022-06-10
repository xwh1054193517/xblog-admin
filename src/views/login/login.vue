<template>
  <div class="login">
    <div class="mask"></div>
    <el-card
      class="card"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      <header class="logo">XBlog-点滴成长</header>
      <form class="form-box" @submit.prevent="login">
        <div class="form-item">
          <input
            type="text"
            v-model="form.username"
            autocomplete="off"
            placeholder="用户名"
            required
          />
        </div>
        <div class="form-item">
          <input
            type="password"
            v-model="form.password"
            autocomplete="off"
            placeholder="密码"
            required
          />
        </div>
        <button class="submit-btn" type="submit">登录</button>
      </form>
    </el-card>
  </div>
</template>

<script>
import author from "@/services/models/author";
import { mapActions } from "vuex";


export default {
  name: "login",

  data() {
    return {
      loading: false,
      wait: 2000,
      throttleLogin: null,
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["SetLoginandAuthor"]),
    // async login(){
    //   const res=await author.getAuthorInfo()
    //   console.log(res)
    // }
    async login() {
      const { username, password } = this.form;
      try {
        this.loading = true;
        await author.getToken(username, password);
        const res = await author.getAuthorInfo();
        this.SetLoginandAuthor(res);
        this.loading = false;
        this.$router.push("/about");
        this.$message.success("成功登录");
      } catch (error) {
        this.loading = false;
        this.$message.error("登录失败");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url("../../assets/images/bg.jpeg") no-repeat center center;
  background-size: cover;

  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .card {
    transform: translateY(-40%);
  }
}

.logo {
  padding: 10px 0;
  font-size: $font-size-extra-large;
  color: $font-color-base;
  text-align: center;
}

.form-box {
  width: 320px;

  .form-item {
    margin-top: 20px;

    input {
      box-sizing: border-box;
      width: 100%;
      height: 35px;
      font-size: $font-size-base;
      color: $font-color-base;
      line-height: normal;
      outline: none;
      border-width: 0 0 1px 0;
      border-style: solid;
      border-color: $border-color-base;
      transition: all 0.3s;

      &:hover,
      &:focus {
        border-color: $border-color-dark;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 36px;
    margin: 36px 0 10px;
    padding: 0;
    font-size: $font-size-base;
    color: #fff;
    text-align: center;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: $primary-light-0;
    transition: all 0.5s;
  }
}
</style>
