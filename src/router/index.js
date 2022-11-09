import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/Home'
import { Config } from '@/config/index'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/about',
    children: [
      {
        path: '/about',
        name: 'info',
        component: () => import('@/views/about/about.vue'),
        meta: {
          title: '点滴成长',
          breadNav: ['点滴成长'],
        },
      },
      {
        path: '/article/addArticle',
        name: 'addArticle',
        component: () => import('@/views/article/addArticle.vue'),
        meta: {
          title: '发布文章',
          breadNav: ['文章管理', '发布文章'],
          // keepAlive: true,
        },
      },
      {
        path: '/article/article',
        name: 'article',
        component: () => import('@/views/article/article.vue'),
        meta: {
          // keepAlive: true,
          title: '文章板块',
          breadNav: ['文章管理', '文章板块'],
        },
      },
      {
        path: '/author/author',
        name: 'author',
        component: () => import('@/views/author/author.vue'),
        meta: {
          title: '作者板块',
          breadNav: ['作者管理', '作者板块'],
        },
      },
      {
        path: '/author/addAuthor',
        name: 'addAuthor',
        component: () => import('@/views/author/addAuthor.vue'),
        meta: {
          title: '添加作者',
          breadNav: ['作者管理', '添加作者'],
        },
      },
      {
        path: '/category/category',
        name: 'category',
        component: () => import('@/views/category/category.vue'),
        meta: {
          title: '管理类别',
          breadNav: ['分类管理', '管理类别'],
        },
      },
      {
        path: '/category/tag',
        name: 'tag',
        component: () => import('@/views/category/tag.vue'),
        meta: {
          title: '管理标签',
          breadNav: ['分类管理', '管理标签'],
        },
      },
      {
        path: '/message/message',
        name: 'message',
        component: () => import('@/views/message/message.vue'),
        meta: {
          title: '留言板块',
          breadNav: ['留言板块'],
        },
      },
      {
        path: '/friend/friend',
        name: 'friend',
        component: () => import('@/views/friend/friend.vue'),
        meta: {
          title: '友链设置',
          breadNav: ['友链设置'],
        },
      },
      {
        path: '/music/music',
        name: 'music',
        component: () => import('@/views/music/music.vue'),
        meta: {
          title: '音乐管理',
          breadNav: ['音乐管理'],
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/404',
    name: 'error',
    component: () => import('@/views/errorpage/404.vue'),
  },
  {
    redirect: '/404',
    path: '*',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/admin/',
  routes,
  scrollBehavior: () => ({ y: 0 }),
})

router.beforeEach((to, from, next) => {
  if (to.name != Config.notLoginRoute && !store.state.login) {
    next({ path: '/login' })
    return
  }

  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
