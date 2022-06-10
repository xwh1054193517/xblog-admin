<template>
  <div class="container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      v-loading="loading"
      ref="ruleForm"
      label-width="60px"
      @submit.native.prevent
      status-icon
    >
      <el-form-item label="名称" prop="name">
        <el-input size="medium" clearable v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <!-- <el-input
          size="medium"
          clearable
          v-model="ruleForm.cover"
          placeholder="请输入封面的Url"
        ></el-input> -->
        <upload
          :Operate="this.type"
          ref="upload"
          :picData="this.ruleForm"
          :type="'category'"
        ></upload>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          size="medium"
          clearable
          v-model="ruleForm.description"
          auto-complete="off"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 7 }"
          maxlength="100"
          placeholder="请输入封面详情"
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
import category from "@/services/models/category";
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
        cover: "",
        description: "",
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur", required: true }],
        description: [{ validator: checkDescription, trigger: "blur", required: true }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      // 先验证数据
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          //添加分类
          if (this.$refs.upload.originImg == null) {
            this.$message.error("请选择封面!");
            return;
          }
          if (this.type === "add") {
            try {
              const pic = await this.$refs.upload.handleUpload(this.ruleForm.name);
              console.log(pic);
              if (pic.errorCode !== 0) {
                this.$message.error("图片上传出错!");
                return;
              }
              this.ruleForm.cover = pic.msg.url;
              this.loading = true;
              console.log(this.ruleForm);
              const res = await category.createCategory(this.ruleForm);
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
            // 修改分类
            if (
              this.ruleForm.name === this.data.name &&
              this.ruleForm.cover === this.$refs.upload.originImg &&
              this.ruleForm.description === this.data.description
            ) {
              console.log("修改的值没变");
              this.$emit("handleResult", false);
              return;
            }
            try {
              let pic;
              if (this.ruleForm.name !== this.data.name) {
                pic = await this.$refs.upload.handleUpload(this.ruleForm.name);
              } else if (
                this.ruleForm.name == this.data.name &&
                this.$refs.upload.originImg !== this.ruleForm.cover
              ) {
                pic = await this.$refs.upload.handleUpload(this.ruleForm.name, "edit");
              }
          
              console.log(pic);
              this.ruleForm.cover = pic ? pic.msg.url : this.ruleForm.cover;
              this.loading = true;
              const res = await category.updateCategory(this.id, this.ruleForm);
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
        this.ruleForm.cover = this.data.cover;
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
      this.ruleForm.cover = this.data.cover;
      this.ruleForm.description = this.data.description;
    }
  },
};
</script>

<style></style>
