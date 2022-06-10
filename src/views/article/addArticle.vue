<template>
  <div class="container">
    <div class="title">
      {{ type === "add" ? "发布文章" : "编辑文章" }}
      <span v-if="type === 'edit'" class="back" @click="$emit('handleBack', false)">
        <i class="el-icon-back"></i>
        返回
      </span>
    </div>
    <el-card class="box-card" shadow="hover">
      <el-tabs v-model="activeName">
        <el-tab-pane label="文章信息" name="articleInfo">
          <div class="info-wrapper">
            <el-row>
              <el-col :lg="23" :md="23" :sm="24" :xs="24">
                <el-form
                  :model="Info"
                  ref="Info"
                  status-icon
                  v-loading="loading"
                  :rules="rules"
                  label-width="100px"
                  size="medium"
                >
                  <el-form-item label="文章标题" prop="title">
                    <el-input
                      v-model="Info.title"
                      size="medium"
                      placeholder="输入标题"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="文章封面" prop="cover">
                    <div class="button-wrapper">
                      <el-button type="primary">
                        Choose Picture(先确定标题)
                        <input
                          type="file"
                          accept="image/*"
                          class="fileInput"
                          ref="fileInput"
                          @change="InputFile"
                        />
                      </el-button>
                    </div>
                    <img v-if="preview!=null" class="cover" :src="preview" alt="" />
                    <el-input v-model="Info.cover"></el-input>
                  </el-form-item>
                  <el-form-item label="文章作者" prop="authors">
                    <el-select
                      multiple
                      filterable
                      allow-create
                      size="medium"
                      v-model="Info.authors"
                      placeholder="请选择作者"
                    >
                      <el-option
                        v
                        v-for="item in authors"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="文章标签" prop="tags">
                    <el-select
                      v-model="Info.tags"
                      multiple
                      filterable
                      size="medium"
                      placeholder="请选择标签"
                    >
                      <el-option
                        v-for="item in tags"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="文章分类" prop="categoryId">
                    <el-select
                      v-model="Info.categoryId"
                      filterable
                      size="medium"
                      placeholder="请选择分类"
                    >
                      <el-option
                        v-for="item in categories"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="发布时间" prop="createdDate">
                    <el-date-picker
                      v-model="Info.createdDate"
                      size="medium"
                      type="datetime"
                      :editable="false"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="公开文章" prop="public">
                    <el-switch
                      v-model="Info.public"
                      :active-value="1"
                      :inactive-value="2"
                    >
                    </el-switch>
                  </el-form-item>
                  <el-form-item label="是否发布" prop="public">
                    <el-radio-group v-model="Info.status">
                      <el-radio :label="1">已发布</el-radio>
                      <el-radio :label="2">存草稿</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否精选" prop="public">
                    <el-radio-group v-model="Info.star">
                      <el-radio :label="1">非精选</el-radio>
                      <el-radio :label="2">精选</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="文章简介" prop="description">
                    <el-input
                      size="medium"
                      clearable
                      v-model="Info.description"
                      auto-complete="off"
                      type="textarea"
                      :autosize="{ minRows: 5, maxRows: 7 }"
                      maxlength="100"
                      placeholder="请输入文章简介"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="正文部分" name="Content">
          <mavon-editor
            class="editor"
            ref="md"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
            :ishljs="true"
            v-model="Info.content"
          ></mavon-editor>
        </el-tab-pane>
      </el-tabs>
      <div class="btnwrapper">
        <el-button type="primary" @click.stop="submitForm('Info')">确定</el-button>
        <el-button type="info" @click="resetForm('Info')">重置</el-button>
        <el-button type="danger" @click.stop="uploadimg">上传(文章有上传图片)</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import author from "@/services/models/author";
import tag from "@/services/models/tag";
import category from "@/services/models/category";
import article from "@/services/models/article";
export default {
  props: {
    type: { type: String, default: "add" },
    data: { type: Object, default: () => {} },
    passCategories: { type: Array, default: () => [] },
    passTags: { type: Array, default: () => [] },
    passAuthors: { type: Array, default: () => [] },
  },
  data() {
    return {
      loading: false,
      activeName: "articleInfo",
      preview: null,
      Info: {
        title: "",
        authors: [],
        tags: [],
        content: "",
        categoryId: "",
        createdDate: "",
        cover: "",
        public: 1,
        status: 1,
        star: 1,
      },
      //用来选择的作者 分类和标签
      authors: [],
      categories: [],
      tags: [],
      img_file: {},
      p: 1,
      rules: {
        title: [{ trigger: "blur", message: "请输入标题", required: true }],
        authors: [
          { type: "array", trigger: "change", message: "请选择作者", required: true },
        ],
        description: [{ trigger: "blur", message: "请输入描述", required: true }],
        createdDate: [{ trigger: "blur", message: "请选择发布时间", required: true }],
        cover: [
          {
            type: "url",
            trigger: "blur",
            message: "请输入正确的封面url",
            required: true,
          },
        ],
        content: [{ trigger: "blur", message: "请输入文章内容", required: true }],
        categoryId: [
          { type: "number", trigger: "blur", message: "请选择分类", required: true },
        ],
        tags: [{ type: "array", message: "请选择标签", required: true }],
        public: [{ type: "number", message: "请选择公开或私密", required: true }],
        status: [{ type: "number", message: "请选择发布或草稿", required: true }],
        star: [{ type: "number", message: "请选择是否为精选", required: true }],
      },
    };
  },
  methods: {
    async getAllNeeds() {
      try {
        this.loading = true;
        this.categories = await category.getAllCategories();
        this.tags = await tag.getAllTags();
        this.authors = await author.getAllAuthor();
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.Info.content) this.$message.warning("没有正文内容！");
          else {
            if (this.type === "add") {
              // 新增文章;
              try {
                this.loading = true;
                const res = await article.createArticle(this.Info);
                if (res.errorCode === 0) {
                  this.loading = false;
                  this.$message.success(`${res.msg}`);
                  this.resetForm(formName);
                } else {
                  this.loading = false;
                  this.$message.error(`${res.msg}`);
                }
              } catch (e) {
                this.loading = false;
                console.log(e);
              }
            } else {
              //编辑文章 如果内容没变则返回
              if (this.noChange(this.Info, this.data)) {
                this.$emit("handleBack", false);
              } else {
                try {
                  this.loading = true;
                  const res = await article.updateArticle(this.Info);
                  if (res.errorCode === 0) {
                    this.$message.success(`${res.msg}`);
                    this.loading = false;
                    this.$emit("handleBack", true);
                  } else {
                    this.loading = false;
                    this.$message.error(`${res.msg}`);
                  }
                } catch (error) {
                  this.loading = false;
                  console.log(error);
                }
              }
            }
          }
        } else {
          this.$message.warning("请正确填写所有信息");
        }
      });
    },
    resetForm(formName) {
      if (this.type === "add") {
        this.Info.content = "";
        this.$refs[formName].resetFields();
        this.preview=null
        this.img_file = {};
      } else {
        
        this.Info = JSON.parse(JSON.stringify(this.data));
        this.preview=this.data.cover+'?'+new Date().getTime()
        this.img_file = {};
      }
    },
    //判断是否更改了文章的信息
    noChange(local, pass) {
      let equal = true;
      for (let key in local) {
        //如果是数组 转成字符来比较
        if (Array.isArray(local[key])) {
          if (local[key].join("") !== pass[key].join("")) {
            equal = false;
          }
        } else {
          if (local[key] !== pass[key]) {
            equal = false;
          }
        }
      }
      return equal;
    },

    //过滤其他页面传来的'全部'这个选项
    filterNeeds(array) {
      let res = [].concat(array);
      res.shift();
      return res;
    },
    async InputFile(event) {
      const imgFile = event.target.files[0];
      //控制文件大小
      if (imgFile.size > 1024 * 1024 * 5) {
        this.$message.warning("文件不得超过5m");
        this.clearFile(this.$refs.fileInput);
        return;
      }
      if (!this.Info.title) {
        this.$message.warning("需要先填写文章标题");
        return;
      }
      const file = new File([imgFile], `${this.Info.title}.jpg`, {
        type: "image/jpeg",
      });
      console.log(file);
      let form = new FormData();
      form.append("files", file);
      form.append("type", "articles");
      try {
        const res = await this.$axios({
          method: "post",
          url: "/admin/file/articles",
          data: form,
        });
        console.log(res);
        if (res.errorCode == 200) {
          this.clearFile(this.$refs.fileInput);
          this.$message.info("上传图片成功");
          this.Info.cover = res.url;
          this.preview=this.Info.cover+'?'+new Date().getTime()
        } else {
          this.$message.info("上传图片失败");
          return;
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    clearFile(e) {
      e.value = "";
    },

    //md函数

    $imgAdd(pos, $file) {
      // 缓存图片信息
      this.img_file[pos] = $file;
      console.log(this.img_file);
    },
    $imgDel(pos) {
      delete this.img_file[pos];
      console.log(this.img_file);
    },
    uploadimg() {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append("type", "content");
      for (var _img in this.img_file) {
        formdata.append("files", this.img_file[_img]);
        formdata.append("ID", _img);
      }
      this.$axios({
        url: "admin/file",
        method: "post",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        console.log(res);
        if (res.errorCode !== 0) {
          if (!Array.isArray(res)) {
            this.$message.error("文章内容中的图片上传失败");
            return;
          }
        }
        if (Array.isArray(res)) {
          for (var img in res) {
            this.$refs.md.$img2Url(res.msg[img].pos, res.msg[img].url);
          }
        } else {
          this.$refs.md.$img2Url(res.msg.pos, res.msg.url);
        }
      });
    },
  },

  created() {
    if (this.type === "add") this.getAllNeeds();
    else {
      this.categories = this.filterNeeds(this.passCategories);
      this.tags = this.filterNeeds(this.passTags);
      this.authors = this.filterNeeds(this.passAuthors);
      this.Info = JSON.parse(JSON.stringify(this.data));
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/title.scss";
.container {
  .box-card {
    margin: 15px 10px;

    @media screen and (max-width: 571px) {
      margin: 1rem 0.5rem;
    }
  }

  .info-wrapper {
    min-height: 50vh;
  }
  .editor {
    min-height: 60vh;
    border: 1px solid rgba(122, 121, 121, 0.2);
  }
  .btnwrapper {
    margin: 0 auto;
    margin-top: 1.52rem;
    display: flex;
    width: 80%;
    justify-content: space-around;
  }
}
.button-wrapper {
  position: relative;
  width: 0;
  height: 32px;
  margin-bottom: 1rem;
  cursor: pointer;
  .fileInput {
    position: absolute;
    top: 0;
    left: 0;
    width: 130px;
    height: 32px;
    outline: none;
    cursor: pointer;
    opacity: 0;
  }
}
.cover {
  width: 150px;
  height: 150px;
}
</style>
