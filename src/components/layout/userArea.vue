<template>
  <div class="author">
    <el-dropdown trigger="click">
      <i
        class="avatar-icon"
        :style="{ backgroundImage: `url(${author.avatar}?${new Date().getTime()})` }"
      ></i>
      <el-dropdown-menu slot="dropdown" class="author-wrapper">
        <ul class="author-wrapper">
          <div class="authorInfo">
            <div class="bg"></div>
            <i
              class="avatar"
              :style="{
                backgroundImage: `url(${author.avatar}?${new Date().getTime()})`,
              }"
            >
              <i class="edit el-icon-edit"></i>
              <input
                class="file"
                ref="avatarFile"
                type="file"
                accept="image/*"
                @change="fileChange"
            /></i>
            <span class="name">{{ author.name }}</span>
          </div>
          <div class="setting-wrapper">
            <li @click="changePassword">
              <i class="el-icon-lock"></i>
              <span>修改密码</span>
            </li>
            <li @click="loginOut">
              <i class="el-icon-circle-close"></i>
              <span>登 出</span>
            </li>
          </div>
        </ul>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <el-dialog append-to-body :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="100px"
        v-loading="loading"
        @submit.native.prevent
      >
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input
            type="password"
            size="medium"
            clearable
            v-model="ruleForm.oldPwd"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            size="medium"
            clearable
            v-model="ruleForm.newPwd"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            type="password"
            size="medium"
            clearable
            v-model="ruleForm.confirmPwd"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('ruleForm')">重 置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改头像弹窗 -->
    <el-dialog
      title="剪裁"
      append-to-body
      width="300px"
      :visible.sync="cropVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="croppa-dialog"
      center
    >
      <div class="avatar-croppa-container">
        <div class="croppa-wrapper">
          <croppa
            ref="croppa"
            :width="cropRule.width"
            :height="cropRule.height"
            :placeholder="'loading'"
            :zoom-speed="30"
            :disable-drag-and-drop="false"
            :show-remove-button="false"
            :prevent-white-space="true"
            :disable-click-to-choose="false"
            :disable-scroll-to-zoom="false"
            :show-loading="true"
            :quality="quality"
            :initial-image="cropImg"
          >
          </croppa>
        </div>
        <div style="margin-top: 1em">通过鼠标滚轮调节头像大小</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCrop" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Author from "@/services/models/author";
import Vue from "vue";
import Croppa from "vue-croppa";
import "vue-croppa/dist/vue-croppa.css";

Vue.use(Croppa);

export default {
  data() {
    const checkOldPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("原始密码不能为空"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位数"));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/.test(value)) {
        callback(new Error("密码需要由字母和数字组成"));
      }
      callback();
    };
    const checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不能少于6位数"));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/.test(value)) {
        callback(new Error("密码需要由字母和数字组成"));
      } else {
        if (this.ruleForm.confirmPassword !== "") {
          this.$refs.ruleForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    const confirmPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      dialogVisible: false,
      ruleForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      rules: {
        oldPwd: [{ validator: checkOldPassword, trigger: "blur", required: true }],
        newPwd: [{ validator: checkPassword, trigger: "blur", required: true }],
        confirmPwd: [{ validator: confirmPassword, trigger: "blur", required: true }],
      },

      cropVisible: false,
      cropRule: {
        width: 200,
        height: 200,
      },
      imgRule: {
        minWidth: 200,
        minHeight: 200,
      },
      cropImg: "",
      imgInfo: null,
      quality: 1,
    };
  },

  computed: {
    ...mapGetters(["author"]),
  },

  methods: {
    ...mapActions(["LoginOut", "SetLoginandAuthor"]),

    fileChange(evt) {
      if (evt.target.files.length !== 1) {
        this.clearFile(this.$refs.avatarFile);
        return;
      }
      const imgFile = evt.target.files[0];
      // 验证文件大小是否符合要求, 不大于 2M
      if (imgFile.size > 1024 * 1024 * 3) {
        this.$message.error("文件过大超过3M");
        // 清空输入框
        this.clearFile(this.$refs.avatarFile);
        return;
      }

      // 验证图像是否符合要求
      const imgSrc = window.URL.createObjectURL(imgFile);
      const image = new Image();
      image.src = imgSrc;
      image.onload = () => {
        // 验证通过, 打开裁剪框
        this.cropImg = imgSrc;
        this.cropVisible = true;
        if (this.$refs.croppa) {
          this.$refs.croppa.refresh();
        }
        this.clearFile(this.$refs.avatarFile);
      };
      image.onerror = () => {
        this.$message.error("获取本地图片出现错误, 请重试");
        // 清空输入框
        this.clearFile(this.$refs.avatarFile);
      };
    },

    async handleCrop() {
      // 获取剪裁数据
      const blob = await this.$refs.croppa.promisedBlob("image/jpeg", 0.8);
      // 构造为文件对象
      const file = new File([blob], `${this.author.name}-avatar.jpg`, {
        type: "image/jpeg",
      });
      let form = new FormData();
      form.append("files", file);
      form.append("type", "authors");
      console.log(form.get("files"));
      return this.$axios({
        method: "put",
        url: "/admin/file",
        data: form,
      }).then((res) => {
        // 清空输入框
        this.clearFile(this.$refs.avatarFile);
        console.log(res);
        if (res.errorCode !== 0) {
          this.$message.error("头像上传失败, 请重试");
          return;
        }

        return this.$axios({
          method: "put",
          url: "/admin/author/avatar",
          data: {
            avatar: res.msg.url,
          },
        }).then((res) => {
          if (res.errorCode === 0) {
            this.$message({
              type: "success",
              message: "更新头像成功",
            });
            this.cropVisible = false;
            // 触发重新获取用户信息
            this.getAuthorInfo();
          } else {
            return Promise.reject(new Error("更新头像失败"));
          }
        });
      });
    },

    //获取本作者的信息
    async getAuthorInfo() {
      try {
        const author = await Author.getAuthorInfo();
        console.log(author);
        this.SetLoginandAuthor(author);
      } catch (e) {
        console.log(e);
      }
    },

    loginOut() {
      this.LoginOut();
      window.location.reload(true);
    },

    changePassword() {
      this.dialogVisible = true;
    },

    handleClose() {
      this.dialogVisible = false;
      this.cropVisible = false;
    },

    submitForm(formName) {
      if (
        this.ruleForm.oldPwd === "" &&
        this.ruleFormorm.newPwd === "" &&
        this.ruleForm.confirmPwd === ""
      ) {
        this.dialogVisible = false;
        return;
      }
      if (this.ruleForm.oldPwd === this.ruleForm.newPwd) {
        this.$message.error("新密码不能与原始密码一样");
        return;
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            this.loading = true;
            const data = {
              oldPassword: this.ruleForm.oldPwd,
              password: this.ruleForm.confirmPwd,
            };
            const res = await Author.changeSelfPassword(data);
            if (res.errorCode === 0) {
              this.loading = false;
              this.$message.success(`${res.msg}`);
              this.resetForm(formName);
              this.dialogVisible = false;
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`);
            }
          } catch (e) {
            this.loading = false;
            // eslint-disable-next-line no-console
            console.log(e);
          }
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    clearFile(ele) {
      ele.value = "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables.scss";
.author {
  font-size: 1.5rem;
}
.avatar-icon {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  outline: none;
}

.author-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 300px;
  padding: 0;
  border: none;
  overflow: hidden;
  @media screen and (max-width: 479px) {
    width: 200px;
  }

  .authorInfo {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    width: 100%;
    height: 150px;
    padding: 20px;
    @media screen and (max-width: 479px) {
      height: 100px;
    }
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: url("../../assets/images/bg.jpeg") center center no-repeat;
      background-size: cover;
      filter: brightness(0.7);
    }

    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 80px;
      height: 80px;
      margin-right: 46px;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      cursor: pointer;
      transition: all 0.2s linear;
      z-index: $index-popper;
      @media (max-width: 571px) {
        width: 60px;
        height: 60px;
        margin: auto;
      }

      .edit {
        opacity: 0;
        transition: all 0.2s linear;
      }

      &:hover {
        filter: brightness(0.6);

        .edit {
          opacity: 1;
        }
      }

      > input {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
    }

    .name {
      font-size: 1.5rem;
      font-weight: $font-weight-bold;
      color: #fff;
      z-index: 2000;
      @media (max-width: 571px) {
        display: none;
      }
    }
  }

  .setting-wrapper {
    padding: 20px;

    > li {
      margin-bottom: 20px;
      cursor: pointer;

      &:hover {
        color: $menu-item-hover;
        transform: translateY(-5px);
      }

      > i {
        margin-right: 10px;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.avatar-croppa-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .croppa-wrapper {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    border: 2px dashed;
  }
}
</style>
