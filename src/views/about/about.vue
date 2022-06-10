<template>
  <div>
    <div class="container">
      <div class="card">
        <div class="coder">
          <div class="coder-wrapper">
            <img :src="imgSrc" alt="" />
            <span>Student in SCUT</span>
            <span>前端Learner</span>
          </div>
        </div>
        <div class="skill-graph" id="main"></div>
        <div class="dataShow">
          <div class="totalArticle">
            <svg
              t="1654446224529"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2197"
              width="200"
              height="200"
            >
              <path
                d="M168.9 169v686H855V169H168.9z m640.2 640H214.9V215H809v594z"
                p-id="2198"
                fill="#dbdbdb"
              ></path>
              <path
                d="M447.8 256.6H256.1v191.1h191.7V256.6z m-46 145.1h-99.7v-99.1h99.7v99.1zM512.1 265.2H768v46H512.1zM512.2 393h255.9v46H512.2zM255.9 553.3H768v46H255.9zM255.9 681.1H768v46H255.9z"
                p-id="2199"
                fill="#dbdbdb"
              ></path>
            </svg>
            <div class="info">
              <span>文章数量</span>
              <VueCountUp :start-value="0" :end-value="total" :duration="1" />
            </div>
          </div>
          <div class="totalView">
            <svg
              t="1654446288432"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3666"
              width="200"
              height="200"
            >
              <path
                d="M928.842245 512.091074c0-5.006014-0.846274-9.193383-1.086751-9.691733-0.182149-2.480494-1.028423-7.001461-1.815345-9.374508-0.210801-0.590448-0.484024-1.209548-0.724501-1.799996-0.424672-1.360997-0.876973-2.691295-1.390673-3.749394-76.871785-168.137395-242.376213-281.144168-411.782507-281.144168-169.375595 0-334.865697 112.902396-411.388535 280.130072-0.921999 1.815345-1.572822 3.553942-1.981121 5.066389-0.181125 0.49835-0.39295 0.967024-0.558725 1.406023-1.512447 4.430916-1.542122 7.514137-1.421372 6.712889-0.710175 3.251044-1.360997 9.722432-1.360997 9.722432-0.181125 1.949398-0.181125 3.50687 0.030699 5.442966 0 0 0.649799 5.65479 0.968048 6.80294 0.090051 1.602498 0.483001 3.931542 0.951675 6.048763l-0.030699 0c0.408299 1.814322 0.968048 3.568269 1.738597 5.291516 0.393973 1.330298 0.862647 2.570545 1.270946 3.507894 76.976162 168.166047 242.436588 281.20352 411.781484 281.20352 169.436994 0 334.941422-112.945375 410.936233-279.328823 1.177825-2.177596 1.935072-4.233418 2.448772-6.018064 0.2415-0.543376 0.454348-1.027399 0.604774-1.511423 1.331321-3.872191 1.602498-7.227612 1.481747-7.227612l-0.028653 0.029676C928.027693 520.921183 928.842245 516.89959 928.842245 512.091074zM872.717993 514.146896c-0.029676 0.121773-0.091074 0.272199-0.151449 0.393973-0.090051 0.36225-0.240477 0.785899-0.332575 1.209548-68.403926 147.420561-212.830293 246.337431-360.191502 246.337431-146.997935 0-291.168476-98.642624-360.252901-246.578931-0.166799-0.5137-0.287549-0.998747-0.468674-1.481747-0.030699-0.484024-0.12075-0.876973-0.150426-1.150196-0.060375-0.300852-0.12075-0.724501-0.166799-1.088798l0-0.3776c0.166799-0.620124 0.286526-1.239224 0.347924-1.919722 0.12075-0.36225 0.211824-0.710175 0.347924-1.103124C220.132094 360.89042 364.680235 261.928524 512.041444 261.928524c147.420561 0 291.940049 99.051947 360.161826 246.322082 0.060375 0.287549 0.121773 0.530073 0.212848 0.726547 0.060375 0.2415 0.119727 0.484024 0.240477 0.740874 0.151449 1.104147 0.272199 2.192945 0.423649 2.736321C872.899118 513.028423 872.809067 513.572822 872.717993 514.146896zM512.041444 373.060601c-76.598562 0-138.954749 62.325487-138.954749 138.939399 0 76.598562 62.356187 138.954749 138.954749 138.954749 76.598562 0 138.954749-62.356187 138.954749-138.954749C650.996193 435.386088 588.640006 373.060601 512.041444 373.060601zM512.041444 595.372849c-45.935192 0-83.371826-37.406958-83.371826-83.371826 0-45.950542 37.436634-83.356476 83.371826-83.356476 45.964868 0 83.373873 37.406958 83.373873 83.356476C595.414293 557.965891 558.006312 595.372849 512.041444 595.372849z"
                p-id="3667"
                fill="#cdcdcd"
              ></path>
            </svg>
            <div class="info">
              <span>总浏览量</span>
              <VueCountUp :start-value="0" :end-value="articlesNum" :duration="1" />
            </div>
          </div>
        </div>
        <div class="ist">
          <div id="wrapper">
            <div class="viewport">
              <div class="cube">
                <div class="side">
                  <div class="cube-image">1</div>
                </div>
                <div class="side">
                  <div class="cube-image">2</div>
                </div>
                <div class="side">
                  <div class="cube-image">3</div>
                </div>
                <div class="side">
                  <div class="cube-image">4</div>
                </div>
                <div class="side">
                  <div class="cube-image">5</div>
                </div>
                <div class="side">
                  <div class="cube-image active">6</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import article from "@/services/models/article";
import VueCountUp from 'vue-countupjs' //引入
export default {
  components:{VueCountUp},
  data() {
    return {
      articlesNum: 0,
      articles: null,
      total: 0,
    };
  },
  computed: {
    imgSrc() {
      return this.$store.getters.author.avatar;
    },
  },
  mounted() {
    this.myChart();
    this.getArticle();
  },
  methods: {
    myChart() {
      let chartDom = document.getElementById("main");
      let myChart = echarts.init(chartDom);
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{d}%",
        },

        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [
              {
                value: 30,
                name: "javascript",
              },
              { value: 16, name: "HTML-CSS" },
              { value: 24, name: "Vue" },
              { value: 13, name: "Webpack" },
              { value: 17, name: "Node" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
    },
    async getArticle() {
      let params = {
        categoryId: 0,
        authorId: 0,
        tagId: 0,
        publicId: 1,
        statusId: 1,
        starId: 1,
        page: 0,
      };

      try {
        const { articles, total } = await article.getAllArticle(params);
        this.total = total;
        console.log(articles);
        articles.forEach((item) => {
          this.articlesNum += item.views;
        });
        this.articles = articles;
      } catch (error) {
        this.tabelLoading = false;
        console.log(error);
      }
    },

  },
};
</script>

<style lang="scss" scope>
@keyframes rot {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.container {
  height: 100%;
  width: 100%;
  font-size: 1rem;
  .card {
    margin: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 571px) {
      grid-template-columns: 100%;
      grid-template-rows: repeat(4, 1fr);
    }
    .skill-graph {
      border: 1px solid rgb(246, 246, 246);
      border-radius: 10px;
      background-color: rgba(240, 209, 236, 0.622);
    }
    .coder {
      border-radius: 10px;
      background-color: rgb(230, 230, 230);
      img {
        border-radius: 50%;
        width: 10rem;
        height: 10rem;

        &:hover {
          animation: rot 0.8s linear 1 normal forwards;
        }
      }
    }
    .coder-wrapper {
      padding: 1rem;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.3);
      box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      transition: all 0.5s ease-in;
      &:hover {
        transform: translateY(-0.5rem);
      }
      span {
        letter-spacing: 0.1rem;
        margin-top: 1.1rem;
        transition: all 0.5s linear;
        &:hover {
          letter-spacing: 0.15rem;
        }
      }

      ::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        filter: blur(50px);
        z-index: -1;
      }
    }
  }

  .dataShow {
    display: grid;
    background-color: rgba(207, 231, 202, 0.5);
    padding: 0 1rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 0.2rem;
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
    place-items: center;
    font-size: 1rem;
    border-radius: 10px;
    @media (max-width: 571px) {
      font-size: 1rem;
    }
    @media (max-width: 370px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }

    .icon {
      height: 5rem;
      width: 5rem;
      margin-right: 0.8rem;
      @media (max-width: 571px) {
        height: 4rem;
        width: 3rem;
        margin-right: 0.5rem;
      }
    }
    .totalArticle,
    .totalView {
      display: flex;
      align-items: center;
      padding: 0.8rem;
      border-radius: 10px;
      color: white;
      background-color: rgb(73, 181, 114);
      .info {
        display: grid;
        grid-template-rows: 1fr 1fr;
        place-items: center;
        gap: 0.53rem;
      }
      span {
        display: inline-block;
        font-size: 1.5rem;
      }
    }
  }
}
</style>

<style scoped>
*,
*:before,
*:after {
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

body {
  background: #252525;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica,
    Arial, "Lucida Grande", sans-serif;
  font-weight: 300;
}

#wrapper {
  padding-top: 10%;
}

.viewport {
  -webkit-perspective: 800px;
  -moz-perspective: 800px;
  -ms-perspective: 800px;
  -o-perspective: 800px;
  perspective: 800px;
  -webkit-perspective-origin: 50% 200px;
  -moz-perspective-origin: 50% 200px;
  -ms-perspective-origin: 50% 200px;
  -o-perspective-origin: 50% 200px;
  perspective-origin: 50% 200px;
  -webkit-transform: scale(0.8, 0.8);
  -moz-transform: scale(0.8, 0.8);
  -ms-transform: scale(0.8, 0.8);
  -o-transform: scale(0.8, 0.8);
  transform: scale(0.8, 0.8);
  -webkit-box-reflect: below 170px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(0%, transparent), to(rgba(250, 250, 250, 0.1)));
}

.cube {
  position: relative;
  margin: 0 auto;
  height: 200px;
  width: 200px;
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  -ms-transform-style: preserve-3d;
  -o-transform-style: preserve-3d;
  transform-style: preserve-3d;
  -webkit-transform: rotateX(136deg) rotateY(1122deg);
  -moz-transform: rotateX(136deg) rotateY(1122deg);
  -ms-transform: rotateX(136deg) rotateY(1122deg);
  -o-transform: rotateX(136deg) rotateY(1122deg);
  transform: rotateX(136deg) rotateY(1122deg);
}

.cube > div {
  overflow: hidden;
  position: absolute;
  opacity: 0.9;
  height: 200px;
  width: 200px;
  background-image: url("https://jordizle.com/static/img/codepen/blank.png");
  -webkit-touch-callout: none;
  -moz-touch-callout: none;
  -ms-touch-callout: none;
  -o-touch-callout: none;
  touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.cube > div > div.cube-image {
  width: 200px;
  height: 200px;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
  line-height: 200px;
  font-size: 80px;
  text-align: center;
  color: #1b9bd8;
  -webkit-transition: color 600ms;
  -moz-transition: color 600ms;
  -ms-transition: color 600ms;
  -o-transition: color 600ms;
  transition: color 600ms;
}
.cube > div > div.cube-image.active {
  color: red;
}

.cube > div:hover {
  cursor: pointer;
}

.cube > div:active {
  cursor: pointer;
}

.cube > div:first-child {
  -webkit-transform: rotateX(90deg) translateZ(100px);
  -moz-transform: rotateX(90deg) translateZ(100px);
  -ms-transform: rotateX(90deg) translateZ(100px);
  -o-transform: rotateX(90deg) translateZ(100px);
  transform: rotateX(90deg) translateZ(100px);
  outline: 1px solid transparent;
}

.cube > div:nth-child(2) {
  -webkit-transform: translateZ(100px);
  -moz-transform: translateZ(100px);
  -ms-transform: translateZ(100px);
  -o-transform: translateZ(100px);
  transform: translateZ(100px);
  outline: 1px solid transparent;
}

.cube > div:nth-child(3) {
  -webkit-transform: rotateY(90deg) translateZ(100px);
  -moz-transform: rotateY(90deg) translateZ(100px);
  -ms-transform: rotateY(90deg) translateZ(100px);
  -o-transform: rotateY(90deg) translateZ(100px);
  transform: rotateY(90deg) translateZ(100px);
  outline: 1px solid transparent;
}

.cube > div:nth-child(4) {
  -webkit-transform: rotateY(180deg) translateZ(100px);
  -moz-transform: rotateY(180deg) translateZ(100px);
  -ms-transform: rotateY(180deg) translateZ(100px);
  -o-transform: rotateY(180deg) translateZ(100px);
  transform: rotateY(180deg) translateZ(100px);
  outline: 1px solid transparent;
}

.cube > div:nth-child(5) {
  -webkit-transform: rotateY(-90deg) translateZ(100px);
  -moz-transform: rotateY(-90deg) translateZ(100px);
  -ms-transform: rotateY(-90deg) translateZ(100px);
  -o-transform: rotateY(-90deg) translateZ(100px);
  transform: rotateY(-90deg) translateZ(100px);
  outline: 1px solid transparent;
}

.cube > div:nth-child(6) {
  -webkit-transform: rotateX(-90deg) rotate(180deg) translateZ(100px);
  -moz-transform: rotateX(-90deg) rotate(180deg) translateZ(100px);
  -ms-transform: rotateX(-90deg) rotate(180deg) translateZ(100px);
  -o-transform: rotateX(-90deg) rotate(180deg) translateZ(100px);
  transform: rotateX(-90deg) rotate(180deg) translateZ(100px);
  outline: 1px solid transparent;
}

object {
  opacity: 0.5;
}

object:hover {
  opacity: 1;
}

@media (max-width: 640px) {
  .viewport {
    -webkit-transform: scale(0.6, 0.6);
    -moz-transform: scale(0.6, 0.6);
    -ms-transform: scale(0.6, 0.6);
    -o-transform: scale(0.6, 0.6);
    transform: scale(0.6, 0.6);
  }
}
</style>
