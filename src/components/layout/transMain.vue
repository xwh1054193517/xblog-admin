<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
      </transition>
    </div>
    
  </section>
</template>

<script>
export default {
  //页面切换动画
  name:'transMain'
}
</script>

<style lang='scss' scoped>
@import '@/assets/scss/animation.scss';
.container{
  .wrapper{
    width:100%;
    height: 100%;
    text-align: left;
  }
}

</style>