<template>
  <div class="container">
    <div class="title">标签管理</div>
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="标签列表" name="tag">
          <el-table :data="tags" width="100%" v-loading="loading">
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column label="设置"  width="140">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editTag(scope.row)">
                  修改</el-button
                >
                <el-button type="danger" size="mini" @click="deleteTag(scope.row)">
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加标签" name="addTag">
          <tag-editor @create="createTagSuccess"></tag-editor>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <div class="dialog-body">
        <tag-editor
          v-if="dialogVisible"
          ref="info"
          :isSubmit="false"
          :type="'edit'"
          :data="ruleForm"
          :id="id"
          @handleResult="onHandleTagResult"
        ></tag-editor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFrom">重置</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import tag from "@/services/models/tag";
import tagEditor from "./tagEditor.vue";
export default {
  components: { tagEditor },
  data() {
    return {
      activeName: "tag",
      tags: [],
      id: 0,
      dialogVisible: false,
      ruleForm: {
        name: "",
      },
      loading: false,
    };
  },
  methods: {
    //监听新增标签是否成功
    createTagSuccess(success) {
      if (success) this.getTags();
    },
    //监听修改标签结果
    onHandleTagResult(handle) {
      this.dialogVisible = false;
      if (handle) this.getTags();
    },
    //获取所有标签
    async getTags() {
      try {
        this.loading = true;
        this.tags = await tag.getAllTags();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    //修改编辑标签
    editTag(data) {
      console.log(data);
      this.id = data.id;
      this.ruleForm.name = data.name;
      this.dialogVisible = true;
    },
    //删除标签
    deleteTag(data) {
      this.$confirm("此操作将从数据库删除标签（软删除）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            const res = await tag.deleteTag(data.id);
            if (res.errorCode === 0) {
              this.loading = false;
              await this.getTags();
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

    //重置
    resetFrom() {
      this.$refs.info.resetForm("ruleForm");
    },
    confirm() {
      this.$refs.info.submitForm("ruleForm");
    },
  },
  created() {
    this.getTags();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/title.scss";

.box-card {
  margin: 20px 25px;
}

.demo-table-expand {
  font-size: 0;

  label {
    width: 90px;
  }

  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}
</style>
