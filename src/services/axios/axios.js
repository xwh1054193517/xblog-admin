import Vue from 'vue'
import axios from 'axios'
import { getToken } from '@/services/utils/cookie'
import store from '@/store'
import { Config } from '@/config/index'
import author from '@/services/models/author'

// 定义axios的配置
const config = {
    baseURL: Config.baseUrl,
    crossDomain: true,
    timeout: 5000,
    validateStatus(status) {
        return status >= 200 && status < 500
    }
}

const myaxios = axios.create(config)

// 请求拦截器 发送请求之前需要做的事情
myaxios.interceptors.request.use(cfg => {
    const reqConfig = {...cfg }

    //没有携带URL
    if (!reqConfig.url) {
        throw new Error({
            message: 'no url'
        })
    }

    //没有指定方法默认用get
    if (!reqConfig.method) {
        reqConfig.method = 'get'
    }

    //防止字段大写
    reqConfig.method = reqConfig.method.toLowerCase()

    //防止GET POST错误传参
    if (reqConfig.method === 'get') {
        if (!reqConfig.params) {
            reqConfig.params = reqConfig.data || {}
        }
    } else if (reqConfig.method === 'post') {
        if (!reqConfig.data) {
            reqConfig.data = reqConfig.params || {}
        }
    }

    // 发送请求携带jwt Bearer + hash
    if (reqConfig.url === 'admin/author/refresh') {
        const RefreshToken = getToken('refreshToken')
        if (RefreshToken) reqConfig.headers.Authorization = RefreshToken
    } else {
        const accessToken = getToken('accessToken')
        if (accessToken) reqConfig.headers.Authorization = accessToken
    }
    return reqConfig
}, error => {
    Promise.reject(error)
})


// 相应拦截器
myaxios.interceptors.response.use(async(res) => {
    if (res.status.toString().charAt(0) === '2') {
        return res.data
    }

    return new Promise(async(resolve, reject) => {
        const { url, method, params } = res.config
            //保存此次的请求设置信息
        store.commit('SET_REQOPTIONS', { url, params, method })

        let { errorCode, msg } = res.data
            //获取错误信息
        if (msg instanceof Object) {
            let show = ''
                //返回所有属性名
            Object.getOwnPropertyNames(msg).forEach((key, index) => {
                if (index === 0) show = msg[key]
            })
            msg = show
        }
        //令牌无效 或者令牌过期 重新刷新令牌
        if (errorCode === 10020 || errorCode === 10030) {
            //刷新令牌 再去执行之前失败的请求
            await author.getRefreshToken()
            const result = await myaxios(store.state.option)
            resolve(result)
            return
        }

        //令牌认证失败或者刷新出错 就要退出登录
        if (errorCode === 10010 || errorCode === 10100) {
            setTimeout(() => {
                store.dispatch('LoginOut')
                console.log('退出登录')
                const { origin } = window.location
                window.location.href = origin + '/admin'
            }, 2000);
        }

        Vue.prototype.$message({
            message: msg || '发生错误',
            type: 'error'
        })
        reject(res.data)
    })
}, error => {
    console.log(error)
})


export function get(url, params = {}) {
    return myaxios({
        method: 'get',
        url,
        params
    })
}
export function post(url, data = {}, params = {}) {
    return myaxios({
        method: 'post',
        url,
        data,
        params,
    })
}
export function put(url, data = {}, params = {}) {
    return myaxios({
        method: 'put',
        url,
        data,
        params,

    })
}
export function _delete(url, params = {}) {
    return myaxios({
        method: 'delete',
        url,
        params
    })
}

// 将axios挂载到Vue的原型方法中
Vue.axios = myaxios
window.axios = myaxios
Object.defineProperties(Vue.prototype, {
    axios: {
        get() {
            return myaxios
        },
    },
    $axios: {
        get() {
            return myaxios
        }
    }

})

export default myaxios