<template>
  <div class="upload-container">
    <div class="button-wrapper">
      <el-button type="primary">
        Choose Picture
        <input
          type="file"
          accept="image/*"
          class="fileInput"
          ref="fileInput"
          @change="InputFile"
        />
      </el-button>
    </div>

    <div class="croppa-box" :style="cropStyle" v-show="showCroppa">
      <croppa
        ref="croppa"
        :width="cropRule.width"
        :height="cropRule.height"
        :placeholder="'Upload'"
        :zoom-speed="50"
        :disable-drag-and-drop="false"
        :show-remove-button="false"
        :prevent-white-space="true"
        :disable-click-to-choose="false"
        :disable-scroll-to-zoom="false"
        :disable-drag-to-move="false"
        :show-loading="true"
        :quality="quality"
        :initial-image="
          /^blob/.test(originImg) ? originImg : `${originImg}?${new Date().getTime()}`
        "
      >
      </croppa>
    </div>

    <div class="img-container" v-if="showPic">
      <img
        crossorigin="anonymous"
        :src="
          /^data/.test(originImg) ? originImg : `${originImg}?${new Date().getTime()}`
        "
        alt=""
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import croppa from "vue-croppa";
import "vue-croppa/dist/vue-croppa.css";
import utils from "@/services/utils/utils";
Vue.use(croppa);
export default {
  props: {
    type: {
      type: String,
      default: null,
    },
    picData: {
      type: Object,
      default: null,
    },
    width: {
      type: Number,
      default: 150,
    },
    height: {
      type: Number,
      default: 150,
    },
    Operate:{
      type: String,
      default: "add",
    },
    //0表示不剪裁，1表示剪裁
    needCut: {
      type: Number,
      defalut: 0,
    },
  },
  data() {
    return {
      showCroppa: false,
      quality: 1,
      originImg: null,
      showPic: false,
      fill: null,
      compress: null,
    };
  },
  computed: {
    cropRule() {
      return {
        width: this.width,
        height: this.height,
      };
    },
    cropStyle() {
      return {
        width: this.width + "px",
        height: this.height + "px",
      };
    },
  },

  methods: {
    async InputFile(event) {
      const imgFile = event.target.files[0];
      //控制文件大小
      if (imgFile.size > 1024 * 1024 * 5) {
        this.$message.warning("文件不得超过5m");
        this.clearFile(this.$refs.fileInput);
        return;
      }
      if (this.needCut) {
        //剪裁部分的处理
        let imgSrc = window.URL.createObjectURL(imgFile);
        this.originImg = imgSrc;
        this.showCroppa = true;
        if (this.$refs.croppa) this.$refs.croppa.refresh();
      } else {
        this.compress = await utils.compressFile(imgFile);
        this.originImg = this.compress.canvasDataUrl;
        this.showPic = true;
      }
    },
    clearFile(e) {
      e.value = "";
    },
    async handleUpload(name, type = "add") {
      let blob;
      if (this.needCut) {
        // 获得剪裁之后的数据
        blob = await this.$refs.croppa.promisedBlob("image/jpeg", 0.8);
      } else {
        blob = this.compress.file;
      }
      this.file = new File([blob], `${name}.jpg`, {
        type: "image/jpeg",
      });
      if (this.file == null) {
        this.$message.error("请选择图片!");
        return;
      }
      let form = new FormData();
      form.append("files", this.file);
      form.append("type", this.type);
      if (type == "add") {
        try {
          const res = await this.$axios({
            method: "post",
            url: "/admin/file",
            data: form,
          });
          this.clearPic();
          this.$message.info("上传图片成功");
          return res;
        } catch (error) {
          this.$message.error(error);
        }
      } else {
        try {
          const res = await this.$axios({
            method: "put",
            url: "/admin/file",
            data: form,
          });
          if (res.errorCode == 0) {
            this.clearPic();
            this.$message.info("更新图片成功");
          } else {
            this.$message.error(res.msg);
          }
          return res;
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
    clearPic() {
      this.clearFile(this.$refs.fileInput);
      this.originImg = null;
      this.showCroppa = false;
      this.showPic=false
    },
    reset() {
      this.originImg = this.picData.avatar || this.picData.cover || null;
      this.$refs.croppa.refresh();
      if (this.Operate=='add') {
        this.showPic = false;
        this.showCroppa = false;
      }
    },
  },
  created() {
    console.log(this.Operate);
    if (this.picData.avatar) {
      this.originImg = this.picData.avatar;
      this.showCroppa = true;
    } else if (this.picData.cover) {
      this.originImg = this.picData.cover;
      this.showPic = true;
    }
  },
  mounted() {
    if (this.showCroppa) this.$refs.croppa.refresh();
  },
};
</script>

<style lang="scss" scoped>
.upload-container {
  display: flex;
  flex-direction: column;
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

.croppa-box {
  .croppa-container {
    width: 150px;
    height: 150px;
  }
}
.img-container img {
  width: 150px;
  height: 150px;
}
</style>
