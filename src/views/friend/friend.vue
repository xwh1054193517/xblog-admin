<template>
  <div class="container">
    <div class="title">友链管理</div>
    <el-card class="box-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="友链列表" name="friend">
          <el-table :data="friends" width="100%" v-loading="loading">
            <el-table-column type="expand">
              <template slot-scope="prop">
                <el-form>
                  <el-form-item label="链接">
                    <span>{{ prop.row.link }}</span>
                  </el-form-item>
                  <el-form-item label="头像">
                    <img
                      class="cover"
                      :src="`${prop.row.avatar}?${new Date().getTime()}`"
                      alt=""
                    />
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column label="设置" width="160">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editFriend(scope.row)">
                  编辑</el-button
                >
                <el-button type="danger" size="mini" @click="deleteFriend(scope.row)">
                  删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加友链" name="addFriend">
          <friend-editor @create="createFriendSuccess"></friend-editor>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <div class="dialog-body">
        <friend-editor
          v-if="dialogVisible"
          ref="info"
          :isSubmit="false"
          :type="'edit'"
          :data="ruleForm"
          :id="id"
          @handleResult="onHandleFriendResult"
        ></friend-editor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFrom">重置</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import friend from "@/services/models/blog";
import friendEditor from "@/views/friend/friendEditor.vue";
import file from "@/services/models/file";
export default {
  components: { friendEditor },
  data() {
    return {
      activeName: "friend",
      friends: [],
      id: 0,
      dialogVisible: false,
      ruleForm: {
        name: "",
        link: "",
        avatar: "",
      },
      loading: false,
    };
  },
  methods: {
    //监听新增友链是否成功
    createFriendSuccess(success) {
      if (success) this.getFriends();
    },
    //监听修改友链结果
    onHandleFriendResult(handle) {
      this.dialogVisible = false;
      if (handle) this.getFriends();
    },
    //获取所有友链
    async getFriends() {
      try {
        this.loading = true;
        this.friends = await friend.getAllFriends();
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    //修改编辑友链
    editFriend(data) {
      this.id = data.id;
      this.ruleForm.name = data.name;
      this.ruleForm.link = data.link;
      this.ruleForm.avatar = data.avatar;
      this.dialogVisible = true;
    },
    //删除友链
    deleteFriend(data) {
      this.$confirm("此操作将从数据库删除友链（软删除）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            const DelRes = await file.deleteFile(`authors/${data.name}-avatar.jpg`);
            const res = await friend.deleteFriend(data.id);
            if (res.errorCode === 0 && DelRes.errorCode === 0) {
              this.loading = false;
              await this.getFriends();
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
    this.getFriends();
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
  max-width: 100px;
  max-height: 100px;
}
</style>
