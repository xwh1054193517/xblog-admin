<template>
  <ul class="commentsContainer">
    <li v-for="item in comments" :key="item.id">
      <div class="wrapper">
        <section>
          <header></header>
        </section>
      </div>
    </li>
     <div v-if="!comments.length">暂无评论</div>
  </ul>
 
</template>

<script>
import article from "@/services/models/author";
import utils from "@/services/utils/utils";
export default {
  props: {
    articleId: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      loading: false,
      comments: [],
    };
  },
  methods: {
    async getComments() {
      try {
        this.loading = true;
        const res = await article.getComment(this.articleId);
        res.forEach((item) => {
          item.createdDate = utils.FormatTime(item.createdDate);
          if (item.parent_id !== 0) {
            const reply = res.find((target) => target === item.parent_id);
            if (reply) {
              v.replyName = reply.nickname;
              v.replyContent = reply.content;
            } else {
              v.replyName = "";
              v.replyContent = "该评论已被删除";
            }
            this.comments = res;
            this.loading = false;
          }
        });
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async delComments() {
      this.$confirm("此操作将永久删除评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            const res = await article.deleteComment(id);
            if (res.errorCode === 0) {
              this.loading = false;
              await this.getComments();
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
    this.getComments();
  },
};
</script>

<style></style>
