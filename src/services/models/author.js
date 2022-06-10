import {get, post, put, _delete } from '@/services/axios/axios'
import { saveAllToken, saveToken } from '@/services/utils/cookie'
export default class Author {
    //登录获得token和刷新token
    static async getToken(username, password) {
        const token = await post('admin/author/login', {
            username,
            password
        })
        saveAllToken(token.accessToken, token.refreshToken)
        return token
    }

    //刷新令牌
    static async getRefreshToken() {
        const refToken = await get('admin/author/refresh')
        saveToken(refToken.accessToken)
    }

    //获取所有作者
    static async getAllAuthor() {
        return await get('admin/author/authors')
    }

    // 创建作者
    static async createAuthor(info) {
        const res = await post('admin/author', info)
        return res
    }

    // 获取当前作者的信息
    static async getAuthorInfo() {
        return await get('admin/author/info')
    }

    //更新作者信息
    static async updateAuthor(id, info) {
        const res = await put(`admin/author/info?id=${id}`, info)
        return res
    }

    //更新作者密码
    static async changeAuthorpwd(id, password) {
        const res = await put(`admin/author/password?id=${id}`, password)
        return res
    }

    //更新登陆者管理员自己的密码
    static async changeOwnpwd(data) {
        const res = await put(`admin/author/password/self`, data)
        return res
    }

    // 删除作者
    static async deleteAuthor(id) {
        const res = await _delete(`admin/author?id=${id}`)
        return res
    }
}