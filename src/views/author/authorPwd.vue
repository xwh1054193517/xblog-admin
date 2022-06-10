<template>
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
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
    </el-form>
  </div>
</template>

<script>
import author from "@/services/models/author";

export default {
  props: {
    id: {
      type: Number,
      default: undefined,
    },
  },

  data() {
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
      } else if (value !== this.ruleForm.newPwd) {
        cb(new Error("两次密码不同!"));
      } else {
        cb();
      }
    };
    return {
      loading: false,
      ruleForm: {
        newPwd: "",
        confirmPwd: "",
      },
      rules: {
        newPwd: [{ validator: checkPwd, trigger: "blur", required: true }],
        confirmPwd: [{ validator: checkConfirm, trigger: "blur", required: true }],
      },
    };
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const res = await author.changeAuthorpwd(this.id,this.ruleForm.newPwd);
            if (res.errorCode === 0) {
              this.loading = false;
              this.$message.success(`${res.msg}`);
              this.resetForm(formName);
              this.$emit("OnHandlePwdChange", true);
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`);
            }
          } catch (error) {
            this.loading = false;
            console.log(error);
          }
        } else {
          this.$message.error("请填写正确的信息");
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
