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
      <el-form-item label="链接" prop="link">
        <el-input
          size="medium"
          clearable
          v-model="ruleForm.link"
          placeholder="请输入友链的Url"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
  
        <upload :Operate="this.type" :needCut="1" ref="upload" :type="'authors'" :picData="this.ruleForm"></upload>
      </el-form-item>

      <el-form-item v-if="isSubmit">
        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import friend from "@/services/models/blog";
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

    return {
      loading: false,
      ruleForm: {
        name: "",
        link: "",
        avatar: "",
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur", required: true }],
        link: [
          { type: "url", message: "输入正确的url", trigger: "blur", required: true },
        ],
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
          //添加友链
          if (this.type === "add") {
            try {
              this.loading = true;
              const pic = await this.$refs.upload.handleUpload(
                `${this.ruleForm.name}-avatar`
              );
              if (pic.errorCode !== 0) {
                this.$message.error("图片上传出错");
                return;
              }
              this.ruleForm.avatar = pic.msg.url;
              const res = await friend.createFriend(this.ruleForm);
              console.log(res);
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
            // 修改友链
            if (
              this.ruleForm.name === this.data.name &&
              this.ruleForm.link === this.data.link &&
              this.$refs.upload.originImg === this.data.avatar
            ) {
              console.log("修改的值没变");
              this.$emit("handleResult", false);
              return;
            }
            try {
              this.loading = true;
              let pic;
               if (this.ruleForm.name !== this.data.name) {
                pic = await this.$refs.upload.handleUpload(`${this.ruleForm.name}-avatar`);
              } else if (
                this.ruleForm.name == this.data.name &&
                this.$refs.upload.originImg !== this.ruleForm.avatar
              ) {
                pic = await this.$refs.upload.handleUpload(`${this.ruleForm.name}-avatar`, "edit");
              }
              // if (pic.errorCode !== 0) {
              //   this.$message.error("图片上传出错");
              //   return;
              // }
              console.log(pic);
              this.ruleForm.avatar = pic ? pic.msg.url : this.ruleForm.avatar;
              const res = await friend.changeFriend(this.id, this.ruleForm);
              console.log(res);
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
        this.ruleForm.link = this.data.link;
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
      this.ruleForm.link = this.data.link;
      this.ruleForm.avatar = this.data.avatar;
    }
  },
};
</script>

<style></style>
