<template>
  <div class="container">
    <div class="title">分类管理</div>
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="分类列表" name="category">
          <el-table :data="category" width="100%" v-loading="loading">
            <!-- 显示详情 -->
            <el-table-column type="expand">
              <template slot-scope="prop">
                <el-form>
                  <el-form-item label="详情">
                    <span>{{ prop.row.description }}</span>
                  </el-form-item>
                  <el-form-item label="封面">
                    <img
                      class="cover"
                      :src="`${prop.row.cover}?${new Date().getTime()}`"
                      alt=""
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column label="设置" width="140">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editCategory(scope.row)">
                  编辑</el-button
                >
                <el-button type="danger" size="mini" @click="deleteCategory(scope.row)">
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加分类" name="addCategory">
          <category-editor :type="'add'" @create="createCategorySuccess"></category-editor>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <div class="dialog-body">
        <category-editor
          v-if="dialogVisible"
          ref="info"
          :isSubmit="false"
          :type="'edit'"
          :data="ruleForm"
          :id="id"
          @handleResult="onHandleCategoryResult"
        ></category-editor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFrom">重置</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import category from "@/services/models/category";
import categoryEditor from "@/views/category/categoryEditor.vue";
import file from "@/services/models/file";
export default {
  components: { categoryEditor },
  data() {
    return {
      activeName: "category",
      category: [],
      id: 0,
      dialogVisible: false,
      ruleForm: {
        name: "",
        cover: "",
        description: "",
      },
      loading: false,
    };
  },
  methods: {
    //监听新增分类是否成功
    createCategorySuccess(success) {
      if (success) this.getCategory();
    },
    //监听修改分类结果
    onHandleCategoryResult(handle) {
      this.dialogVisible = false;
      if (handle) this.getCategory();
    },
    //获取所有分类
    async getCategory() {
      try {
        this.loading = true;
        this.category = await category.getAllCategories();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    //修改编辑分类
    editCategory(data) {
      this.id = data.id;
      this.ruleForm.name = data.name;
      this.ruleForm.cover = data.cover;
      this.ruleForm.description = data.description;
      this.dialogVisible = true;
    },
    //删除分类
    deleteCategory(data) {
      this.$confirm("此操作将从数据库删除分类（软删除）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            console.log(data.name);
            const DelRes = await file.deleteFile(`category/${data.name}.jpg`);
            const res = await category.deleteCategory(data.id);
            console.log(DelRes);
            if (res.errorCode === 0 && DelRes.errorCode === 0) {
              this.loading = false;
              await this.getCategory();
              this.$message.success(`${res.msg}`,`${DelRes.msg}`);
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`,`${DelRes.msg}`);
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
    this.getCategory();
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

.cover {
  max-width: 120px;
  max-height: 120px;
}
</style>
