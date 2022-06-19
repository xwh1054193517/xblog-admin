const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin');
const compress = new CompressionPlugin({
    test: /\.js$|\.html$|\.css/, // 匹配文件名
    threshold: 10240, // 对超过10kb的数据进行压缩
    deleteOriginalAssets: false // 是否删除原文件
})
module.exports = defineConfig({
    publicPath: '/admin/',
    transpileDependencies: true,
    lintOnSave: false,
    productionSourceMap: false, // 生产环境不产生未加密的map文件
    chainWebpack: (config) => {
        // 最小化代码
        config.optimization.minimize(true);
        // 分割代码
        config.optimization.splitChunks({
            chunks: 'all'
        });
        config.externals({
            'echarts': 'echarts'
        });
    },
    configureWebpack: {

        // 通过 compression-webpack-plugin 插件对js文件进行gzip压缩
        plugins: [compress]
    },

})


//生产环境标记
// const IS_PRODUCTION = process.env.NODE_ENV === 'production'
//     //配置引用cdn的js、css地址
// const cdn = {
//         css: [
//             // 'https://unpkg.com/element-ui@2.15.8/lib/theme-chalk/index.css'
//         ],
//         js: [
//             'https://cdn.bootcdn.net/ajax/libs/vue/2.6.14/vue.min.js',
//             'https://cdn.bootcdn.net/ajax/libs/vue-router/3.0.3/vue-router.min.js',
//             'https://cdn.bootcdn.net/ajax/libs/vuex/3.6.2/vuex.min.js',
//             'https://cdn.bootcdn.net/ajax/libs/axios/0.27.2/axios.min.js',
//             // 'https://unpkg.com/element-ui@2.15.8/lib/index.js',
//             // 'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.1/echarts.min.js'
//         ]
//     }
//     //配置打包时使用CDN节点（加入externals外部扩展）， 忽略打包的第三方库
//     //左面放package.json中的扩展的名称,右面放项目依赖的名称(项目初始化要用的名称)
// const externals = {
//     // 属性名称 vue, 表示遇到 import xxx from 'vue' 这类引入 'vue'的，不去 node_modules 中找，而是去找全局变量 Vue（其他的为VueRouter、Vuex、axios、ELEMENT、echarts，注意全局变量是一个确定的值，不能修改为其他值，修改为其他大小写或者其他值会报错，若有异议可留言）
//     vue: 'Vue',
//     "vue-router": 'VueRouter',
//     vuex: 'Vuex',
//     axios: 'axios',
//     // 'element-ui': 'ELEMENT',
//     // 'echarts': 'echarts'
// };

// chainWebpack = (config) => {
//     if (IS_PRODUCTION) {
//         config.plugin('html').tap(args => {
//                 args[0].cdn = cdn
//                 return args
//             })
//             //视为一个外部库，而不将它打包进来
//         config.externals(externals)
//     }
// }