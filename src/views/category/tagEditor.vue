<template>
  <div class="container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      v-loading="loading"
      ref="ruleForm"
      label-width="70px"
      @submit.native.prevent
      status-icon
    >
      <el-form-item label="名称" prop="name">
        <el-input size="medium" clearable v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item v-if="isSubmit">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import tag from "@/services/models/tag";
export default {
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
    return {
      loading: false,
      ruleForm: {
        name: "",
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur", required: true }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // 先验证数据
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //添加标签
          if (this.type === "add") {
            try {
              this.loading = true;
              const res = await tag.createTag(this.ruleForm);
              if (res.errorCode == 0) {
                this.loading = false;
                this.$emit("create", true);
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
            // 修改标签
            if (this.ruleForm.name === this.data.name) {
              console.log("修改的值没变");
              this.$emit("handleResult", false);
              return;
            }
            try {
              this.loading = true;
              const res = await tag.updateTag(this.id, this.ruleForm);
              if (res.errorCode === 0) {
                this.loading = false;
                this.$emit("handleResult", true);
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
      } else {
        this.$refs[formName].resetFields();
      }
    },
  },

  created() {
    if (this.type === "edit") {
      this.ruleForm.name = this.data.name;
    }
  },
};
</script>

<style></style>
