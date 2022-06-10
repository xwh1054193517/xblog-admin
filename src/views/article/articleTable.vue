<template>
  <div class="articleTable">
    <el-table
      :data="article"
      style="width: 100%"
      v-loading="loading"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="分类">
              <span>{{ props.row.category.name }}</span>
            </el-form-item>
            <el-form-item label="浏览次数">
              <span>{{ props.row.views }}</span>
            </el-form-item>
            <el-form-item label="赞">
              <span>{{ props.row.like }}</span>
            </el-form-item>
            <el-form-item label="封面">
              <img class="cover" :src="props.row.cover" alt="" />
            </el-form-item>
            <el-form-item label="简介">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章标题"> </el-table-column>
      <el-table-column prop="authors" label="作者"
        ><template slot-scope="scope">
          <span v-for="item in scope.row.authors" :key="item.id">{{ item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_date"
        label="发布时间"
        sortable
        width="170"
      ></el-table-column>
      <el-table-column
        prop="public"
        label="公开"
        :formatter="(row) => publicName[row.public]"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="(row) => statusName[row.status]"
      ></el-table-column>
      <el-table-column prop="star" label="设为精选">
        <template slot-scope="scope">
          <i
            :class="['star el-icon-star-off', scope.row.star === 2 ? 'star-on' : '']"
            @click="setArticleStar(scope.row)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <div class="btn">
            <el-button type="primary" size="mini" @click="editArticle(scope.row)"
              >编辑</el-button
            >
            <el-button type="primary" size="mini" @click="setPublic(scope.row)">{{
              scope.row.public == 1 ? "私人" : "公开"
            }}</el-button>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="checkComment(scope.row)"
              >评论</el-button
            >
            <el-button type="danger" size="mini" @click="delArticle(scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <comments v-if="dialogVisible" :articleId="articleId"></comments>
    </el-dialog>
  </div>
</template>

<script>
import article from "@/services/models/article";
import comments from "./comments.vue";
export default {
  components: { comments },
  props: {
    article: {
      tpye: Array,
      default: () => [],
    },
    nowPage: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      articleId: null,
      loading: false,
      publicName: { 1: "公开", 2: "私人" },
      statusName: { 1: "已发布", 2: "草稿" },
      dialogVisible: false,
    };
  },
  methods: {
    editArticle(data) {
      this.$emit("handleEdit", data);
    },
    async setPublic(data) {
      try {
        this.loading = true;
        const parmas = {
          publicId: data.public === 1 ? 2 : 1,
        };
        const res = await article.setState(data.id, parmas);
        if (res.errorCode === 0) {
          this.loading = false;
          this.$message.success(`${res.msg}`);
          this.$emit("handleChange", true);
        } else {
          this.loading = false;
          this.$message.error(`${res.msg}`);
        }
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async setArticleStar(data) {
      try {
        this.loading = true;
        const parmas = {
          starId: data.star === 1 ? 2 : 1,
        };
        const res = await article.setStar(data.id, parmas);
        console.log(res);
        if (res.errorCode === 0) {
          this.loading = false;
          this.$message.success(`${res.msg}`);
          this.$emit("handleChange", true);
        } else {
          this.loading = false;
          this.$message.error(`${res.msg}`);
        }
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    checkComment(data) {
      this.articleId = data.id;
      this.dialogVisible = true;
    },
    delArticle(data) {
      this.$confirm("此操作将从数据库删除文章（软删除）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            const res = await article.deleteArticle(data.id);
            if (res.errorCode === 0) {
              this.loading = false;
              this.$message.success(`${res.msg}`);
              this.$emit("handleChange", true);
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
  },
};
</script>

<style lang="scss" scoped>
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
.star {
  cursor: pointer;
  font-size: 22px;
  text-align: center;
}

.star-on {
  color: rgb(248, 38, 38);
}

.cover {
  max-height: 100px;
  max-width: 100px;
}

.btn {
 margin: 0.5rem;
}
</style>
