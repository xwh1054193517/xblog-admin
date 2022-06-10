<template>
  <div>
    <div class="title">作者板块</div>
    <div class="container">
      <el-card class="box-card">
        <el-table :data="authors" width="100%" v-loading="loading">
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="content" label="设置" width="140">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editAuthor(scope.row)">
                编辑</el-button
              >
              <el-button type="danger" size="mini" @click="deleteAuthor(scope.row)">
                删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 弹窗修改信息 -->
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <div class="diabody" v-if="dialogVisible">
        <el-tabs v-model="acTab">
          <el-tab-pane label="修改作者信息" name="authorinfo">
            <author-info ref="info" :isSubmit="false" :type="'edit'" :data="form" :id="id" @OnHandleInfoChange="HandleInfoChange" ></author-info>
          </el-tab-pane>
          <el-tab-pane label="修改作者密码" name="authorpwd">
            <author-pwd :id="id" ref="pwd" @OnHandlePwdChange="HandlePwdChange"></author-pwd>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span class="diafoot" slot="footer">
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import author from "@/services/models/author";
import authorPwd from './authorPwd.vue';
import AuthorInfo from './authorInfo.vue';
export default {
  components: { authorPwd, AuthorInfo },
  data() {
    return {
      acTab: "authorinfo",
      authors: [],
      id: 0,
      loading: false,
      dialogVisible: false,
      // form都是用来传参给子组件的
      form: {
        name: "",
        avatar: "",
        password: "",
        email: "",
        confirmPwd: "",
        description:"",
        auth:0,
      },
    };
  },
  methods: {
    //获取所有作者
    async getAuthors() {
      try {
        this.loading = true;
        this.authors = await author.getAllAuthor(this.currentPage - 1);
      
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    //删除作者
    deleteAuthor(data) {
      this.$confirm("此操作将从数据库删除作者（软删除）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            const res = await author.deleteAuthor(data.id);
            if (res.errorCode === 0) {
              this.loading = false;
              // 判断是不是每一个的最后一个数据 如果是删掉后要往前退一页
              if (this.total % this.pageSize === 1 && this.currentPage !== 1) {
                this.currentPage--;
              }
              await this.getAuthors();
              this.$message.success(`${res.msg}`);
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`);
            }
          } catch (error) {
            this.loading = false;
            console.log(error);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    //编辑作者
    editAuthor(data) {
      this.dialogVisible = true;
      this.form.name=data.name
      this.form.avatar=data.avatar
      this.form.email=data.email
      this.form.description=data.description
      this.form.auth=data.auth
      this.id=data.id
    },
    HandlePwdChange(success){
      if(success)this.dialogVisible=false
    },
    HandleInfoChange(success){
       this.dialogVisible=false
      if(success){
       
        this.getAuthors()
      }
    },
    // 编辑的确认 分区域确认
    confirm() {
    if(this.acTab=="authorinfo")this.$refs.info.submitForm('ruleForm')
      else this.$refs.pwd.submitForm('ruleForm')
    },
    // 编辑的重置
    reset() {
        if(this.acTab=="authorinfo")this.$refs.info.resetForm('ruleForm')
      else this.$refs.pwd.resetForm('ruleForm')
    },
  },
  created() {
    this.getAuthors();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/title.scss";

.box-card {
  margin: 20px 25px;
}
</style>
