<template>
  <div class="container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      v-loading="loading"
      ref="ruleForm"
      label-width="100px"
      @submit.native.prevent
      status-icon
    >
      <el-form-item label="名称" prop="name">
        <el-input
          size="medium"
          clearable
          v-model="ruleForm.name"
          :disabled="!isSubmit"
        ></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input
          size="medium"
          clearable
          v-model="ruleForm.email"
          placeholder="请输入你的邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <!-- <el-input
          size="medium"
          clearable
          v-model="ruleForm.avatar"
          placeholder="请输入你的头像url"
        ></el-input> -->
        <upload :needCut="1" ref="upload" :picData="this.ruleForm" :type="'authors'"></upload>
      </el-form-item>
      <el-form-item v-if="type === 'add'" label="密码" prop="password">
        <el-input
          type="password"
          size="medium"
          clearable
          v-model="ruleForm.password"
          auto-complete="new-password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item v-if="type === 'add'" label="确认密码" prop="confirm">
        <el-input
          type="password"
          size="medium"
          clearable
          v-model="ruleForm.confirm"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input
          size="medium"
          clearable
          v-model="ruleForm.description"
          auto-complete="off"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 7 }"
          maxlength="100"
          placeholder="请输入个人简介"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item v-if="isSubmit">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import author from "@/services/models/author";
import Upload from "@/components/common/uploadPic.vue";
export default {
  components: { Upload },
  props: {
    //是否提交
    isSubmit: {
      type: Boolean,
      default: true,
    },

    // 操作类型
    type: {
      type: String,
      default: "add",
    },

    //修改时的原始值
    data: {
      type: Object,
      default: () => {},
    },

    //要修改的标签的id
    id: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    //定义验证器
    const checkName = (rule, value, cb) => {
      if (value === "") {
        cb(new Error("不能为空"));
      }
      cb();
    };
    const checkPwd = (rule, value, cb) => {
      if (value === "") {
        cb(new Error("输入密码"));
      } else if (value.length < 6) {
        cb(new Error("密码长度不能少于6位"));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]/.test(value)) {
        cb(new Error("密码由字母和数字组成"));
      } else {
        if (this.ruleForm.confirmPwd !== "") {
          this.$refs.ruleForm.validateField("confirmPwd");
        }
        cb();
      }
    };
    const checkConfirm = (rule, value, cb) => {
      if (value === "") {
        cb(new Error("再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        cb(new Error("两次密码不同!"));
      } else {
        cb();
      }
    };
    const checkDescription = (rule, value, cb) => {
      if (value === "") {
        cb(new Error("不能为空"));
      }
      cb();
    };
    return {
      loading: false,
      ruleForm: {
        name: "",
        avatar: "",
        email: "",
        password: "",
        confirm: "",
        description: "",
        auth:0,
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur", required: true }],
        email: [
          { type: "email", message: "输入正确的邮箱", trigger: "blur", required: true },
        ],
        password: [
          { validator: checkPwd, trigger: "blur", required: this.type === "add" },
        ],
        confirm: [
          { validator: checkConfirm, trigger: "blur", required: this.type === "add" },
        ],
        description: [{ validator: checkDescription, trigger: "blur", required: true }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // 先验证数据
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.$refs.upload.originImg == null) {
            this.$message.error("请上传头像");
          }
          //添加
          if (this.type === "add") {
            try {
              const pic = await this.$refs.upload.handleUpload(
                `${this.ruleForm.name}-avatar`
              );
              if (pic.errorCode !== 0) {
                this.$message.error("图片上传出错");
                return;
              }
              const data = {
                name: this.ruleForm.name,
                email: this.ruleForm.email,
                avatar: pic.result.url,
                description: this.ruleForm.description,
                password: this.ruleForm.password,
                auth: 4,
              };
              this.loading = true;
              const res = await author.createAuthor(data);
              if (res.errorCode == 0) {
                this.loading = false;
                this.$message.success(`${res.msg}`);
                this.resetForm(formName);
              } else {
                this.loading = false;
                this.$message.error(`${res.msg}`);
              }
            } catch (error) {
              this.loading = false;
              console.log(error);
            }
          } else {
            // 修改分类
            if (
              this.ruleForm.name === this.data.name &&
              this.ruleForm.avatar === this.$refs.upload.originImg &&
              this.ruleForm.email === this.data.email &&
              this.ruleForm.description === this.data.description
            ) {
              console.log("修改的值没变");
              this.$emit("OnHandleInfoChange", false);
              return;
            }
            try {
              const pic = await this.$refs.upload.handleUpload(
                `${this.ruleForm.name}-avatar`,
                "edit"
              );
              if (pic.errorCode !== 0) {
                this.$message.error("图片上传出错");
                return;
              }
              this.loading = true;
              const data = {
                name: this.ruleForm.name,
                email: this.ruleForm.email,
                avatar: pic.msg.url,
                description: this.ruleForm.description,
                auth: this.ruleForm.auth,
              };
              console.log(this.ruleForm);
              const res = await author.updateAuthor(this.id, data);
              if (res.errorCode === 0) {
                this.loading = false;
                this.$emit("OnHandleInfoChange", true);
                this.$message.success(`${res.msg}`);
                this.resetForm(formName);
              } else {
                this.loading = false;
                this.$message.error(`${res.msg}`);
              }
            } catch (error) {
              this.loading = false;
              console.log(error);
            }
          }
        } else {
          this.$message.error("请填写正确信息");
        }
      });
    },
    resetForm(formName) {
      //如果是修改,重置要变回原来的值
      if (this.type === "edit") {
        this.ruleForm.name = this.data.name;
        this.ruleForm.avatar = this.data.avatar;
        this.ruleForm.email = this.data.email;
        this.ruleForm.description = this.data.description;
        this.$refs.upload.reset();
      } else {
        this.$refs[formName].resetFields();
        this.$refs.upload.clearPic();
      }
    },
  },

  created() {
    if (this.type === "edit") {
      this.ruleForm.name = this.data.name;
      this.ruleForm.avatar = this.data.avatar;
      this.ruleForm.email = this.data.email;
      this.ruleForm.description = this.data.description;
      this.ruleForm.auth=this.data.auth
      console.log(this.data);
    }
  },
};
</script>

<style></style>
