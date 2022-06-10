<template>
  <div v-if="!isEdit" class="container">
    <div class="title add">
      <span>文章板块</span>
      <div class="search-box">
        <el-input
          size="medium"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          clearable
          v-model="keyword"
          maxlength="15"
        ></el-input>
        <el-button type="primary" size="medium" class="searchBtn" @click="search"
          >Search</el-button
        >
      </div>
    </div>
    <el-card class="filter-box" v-loading="loading">
      <dl class="filter-row">
        <dt class="filter-dt">作者：</dt>
        <div class="dd-box">
          <dd
            class="filter-dd"
            :class="{ isActive: item.id == authorId }"
            v-for="item in authors"
            :key="item.id"
            @click="selectConditon('authorId', item.id)"
          >
            {{ item.name }}
          </dd>
        </div>
      </dl>
      <dl class="filter-row">
        <dt class="filter-dt">类别：</dt>
        <div class="dd-box">
          <dd
            class="filter-dd"
            :class="{ isActive: item.id == categoryId }"
            v-for="item in categories"
            :key="item.id"
            @click="selectConditon('categoryId', item.id)"
          >
            {{ item.name }}
          </dd>
        </div>
      </dl>
      <dl class="filter-row">
        <dt class="filter-dt">标签：</dt>
        <div class="dd-box">
          <dd
            class="filter-dd"
            :class="{ isActive: item.id == tagId }"
            v-for="item in tags"
            :key="item.id"
            @click="selectConditon('tagId', item.id)"
          >
            {{ item.name }}
          </dd>
        </div>
      </dl>
      <dl class="filter-row">
        <dt class="filter-dt">公开：</dt>

        <div class="dd-box">
          <dd
            class="filter-dd"
            :class="{ isActive: item.id == publicId }"
            v-for="item in publicList"
            :key="item.id"
            @click="selectConditon('publicId', item.id)"
          >
            {{ item.name }}
          </dd>
        </div>
      </dl>
      <dl class="filter-row">
        <dt class="filter-dt">状态：</dt>
        <div class="dd-box">
          <dd
            class="filter-dd"
            :class="{ isActive: item.id == statusId }"
            v-for="item in statusList"
            :key="item.id"
            @click="selectConditon('statusId', item.id)"
          >
            {{ item.name }}
          </dd>
        </div>
      </dl>
      <dl class="filter-row">
        <dt class="filter-dt">精选：</dt>
        <div class="dd-box">
          <dd
            class="filter-dd"
            :class="{ isActive: item.id == starId }"
            @click="selectConditon('starId', item.id)"
            v-for="item in starList"
            :key="item.id"
          >
            {{ item.name }}
          </dd>
        </div>
      </dl>
    </el-card>

    <el-card class="article-list" v-loading="tabelLoading">
      <article-table
        :total="total"
        :article="articles"
        :nowPage="page"
        @handleChange="OnHandleChange"
        @handleEdit="OnHandleEdit"
      ></article-table>
    </el-card>
  </div>
  <div class="edit-container" v-else>
    <add-article
      :type="'edit'"
      :data="form"
      :passAuthors="authors"
      :passCategories="categories"
      :passTags="tags"
      @handleBack="onHandleBack"
    ></add-article>
  </div>
</template>

<script>
import author from "@/services/models/author";
import tag from "@/services/models/tag";
import category from "@/services/models/category";
import article from "@/services/models/article";
import ArticleTable from "./articleTable.vue";
import utils from "@/services/utils/utils";
import AddArticle from "./addArticle.vue";
export default {
  components: { ArticleTable, AddArticle },
  data() {
    return {
      keyword: "",
      loading: false,
      tabelLoading: false,
      starList: [
        {
          id: 0,
          name: "全部",
        },
        {
          id: 2,
          name: "精选",
        },
        {
          id: 1,
          name: "非精",
        },
      ],
      publicList: [
        {
          id: 0,
          name: "全部",
        },
        {
          id: 1,
          name: "公开",
        },
        {
          id: 2,
          name: "私人",
        },
      ],
      statusList: [
        {
          id: 0,
          name: "全部",
        },
        {
          id: 1,
          name: "发布",
        },
        {
          id: 2,
          name: "草稿",
        },
      ],
      tags: [],
      categories: [],
      authors: [],
      articles: [],
      categoryId: 0,
      authorId: 0,
      tagId: 0,
      publicId: 0,
      statusId: 0,
      starId: 0,
      page: 0,
      total: 0,
      form: {},
      isEdit: false,
    };
  },
  methods: {
    //改变筛选条件
    selectConditon(name, id) {
      if (id === this[name]) return;
      this[name] = id;
      this.getArticle();
    },
    search() {
      if (!this.keyword) {
        this.$message.warning("搜索内容不能为空");
        return;
      }
      this.getArticle();
    },

    //获取数据
    async getAuthors() {
      try {
        const res = await author.getAllAuthor();
        res.unshift({ id: 0, name: "全部" });
        this.authors = res;
      } catch (error) {
        // this.$message.warning("获取作者信息失败")
      }
    },
    async getTags() {
      try {
        const res = await tag.getAllTags();
        res.unshift({ id: 0, name: "全部" });
        this.tags = res;
      } catch (error) {
        // this.$message.warning("获取标签信息失败")
      }
    },
    async getCategories() {
      try {
        const res = await category.getAllCategories();
        res.unshift({ id: 0, name: "全部" });
        this.categories = res;
      } catch (error) {
        // this.$message.warning("获取分类信息失败")
      }
    },
    async getArticle() {
      let params = {
        categoryId: this.categoryId,
        authorId: this.authorId,
        tagId: this.tagId,
        publicId: this.publicId,
        statusId: this.statusId,
        starId: this.starId,
        page: this.page,
      };
      if (this.keyword) {
        params.search = this.keyword;
      }
      try {
        this.tabelLoading = true;
        const { articles, total } = await article.getAllArticle(params);
        this.total = total;
        // console.log(articles);
        articles.forEach((item) => {
          item.created_date = utils.FormatTime(item.created_date);
        });
        this.articles = articles;
        this.tabelLoading = false;
      } catch (error) {
        this.tabelLoading = false;
        console.log(error);
      }
    },

    //处理事件监听
    // 表单上的按钮改变
    OnHandleChange(change) {
      if (change) this.getArticle();
    },
    //编辑文章回退的事件
    onHandleBack(change) {
      this.isEdit = false;
      if (change) this.getArticle();
    },
    //文章列表是没有内容的 点编辑在获取
    async OnHandleEdit(data) {
      let edit = {
        id: data.id,
        title: data.title,
        description: data.description,
        authors: data.authors.map((item) => item.id),
        createdDate: data.created_date,
        cover: data.cover,
        content: "",
        categoryId: data.category.id,
        tags: data.tags.map((item) => item.id),
        public: data.public,
        status: data.status,
        star: data.star,
      };
      try {
        const res = await article.getArticleInfo(data.id);
        edit.content = res.content;
        this.form = edit;
        this.isEdit = true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.loading = true;
    this.getAuthors();
    this.getTags();
    this.getCategories();
    this.getArticle();
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/title.scss";
.container {
  .add {
    justify-content: space-between;
  }
  .search-box {
    display: flex;
    justify-content: flex-start;
    @media (max-width:571px) {
      width: 14rem;
    }
  }
  .searchBtn {
    margin: 0 0 0 5px;
    border-radius: 5px;
  }

  .filter-box {
    margin: 1.2rem 1.5rem;
    font-size: 1rem;
    color: $theme-primary;

    .filter-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid $border-color-light;

      &:last-child {
        border-bottom: none;
      }

      .filter-dt {
        margin: 10px 0;
        padding: 5px;
        flex-shrink: 0;
      }

      .dd-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .filter-dd {
          box-sizing: border-box;
          margin: 5px 5px;
          padding: 5px 15px;
          @media (max-width: 571px) {
            margin: 2px;
            padding: 3px 8px;
          }
          cursor: pointer;
          transition: all 0.8s linear;
        }
      }

      .isActive {
        background-color: rgb(77, 170, 241);
        color: #fff;
        border-radius: 10px;
        
      }
    }
  }
}
</style>
