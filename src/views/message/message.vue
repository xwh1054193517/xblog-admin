<template>
  <div class="container">
    <div class="title">留言板块</div>
    <el-card class="box-card">
      <el-table :data="message" width="100%" v-loading="loading">
        <el-table-column prop="nickname" label="名称" width="100"> </el-table-column>
        <el-table-column prop="content" label="留言" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="createTime" label="留言时间"> </el-table-column>
        <el-table-column label="设置"  width="60">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteMessage(scope.row)">
              删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :background="true"
          layout="total,prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import message from "@/services/models/message";
import utils from "@/services/utils/utils"
export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      total: 0,
      message: [],
      id: 0,
      loading: false,
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMessages();
    },
    //获取所有标签
    async getMessages() {
      try {
        this.loading = true;
        const res = await message.getAllMessages(this.currentPage - 1);
        res.result.forEach(item=>{
          item.createTime=utils.FormatTime(item.createTime)
        })
        this.message = res.result;
        this.total=res.total
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    //删除标签
    deleteMessage(data) {
      this.$confirm("此操作将从数据库删除留言（软删除）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            const res = await message.deleteMessage(data.id);
            if (res.errorCode === 0) {
              this.loading = false;
              // 判断是不是每一个的最后一个数据 如果是删掉后要往前退一页
              if(this.total%this.pageSize===1&&this.currentPage!==1){
                this.currentPage--
              }
              await this.getMessages();
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
  },
  created() {
    this.getMessages();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/title.scss";



.box-card {
  margin: 20px 25px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
  transition: all .5s linear
}
</style>
