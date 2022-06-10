import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import { Config } from '@/config/index'
import { removeAlltoken } from "@/services/utils/cookie";
Vue.use(Vuex)

//使用插件，刷新存入LocalStorage
const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    //只保存以下
    reducer: state => ({
        login: state.login,
        author: state.author
    })
})

export default new Vuex.Store({
    state: {
        login: false,
        author: null,
        HomeRoute: Config.route,
        option: null,
        // true为收进去
        collapse: false,
    },


    getters: {
        author: state => state.author,
        collapse: state => state.collapse
    },


    mutations: {
        //提交登陆状态
        SET_LOGIN(state) {
            console.log('提交登陆状态')
            state.login = true
        },

        //提交退出登录
        SET_LOGINOUT(state) {
            state.login = false
            state.author = null
        },

        //提交登陆者信息
        SET_AUTHOR(state, info) {
            console.log('提交登陆者')
            state.author = info
        },

        //保存请求信息
        SET_REQOPTIONS(state, option) {
            state.opton = option
        },
        //侧边栏
        SET_COLLAPSE(state, collapse) {
            state.collapse = collapse
            localStorage.setItem('collapse', collapse)
        }
    },

    actions: {
        //登录并设置作者信息
        SetLoginandAuthor({ commit }, info) {
            commit("SET_LOGIN", true)
            commit("SET_AUTHOR", info)
        },

        //登出
        LoginOut({ commit }) {
            commit("SET_LOGINOUT")
            removeAlltoken()
        },
        //侧边栏
        Collapse({ commit }, collapse) {
            commit("SET_COLLAPSE", collapse)
        }
    },

    plugins: [vuexLocal.plugin]
})