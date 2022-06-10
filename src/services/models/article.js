import {get, post, put, _delete } from '@/services/axios/axios'


class Article {


    //创建文章
    async createArticle(data) {
        const res = await post('admin/article', data)
        return res
    }

    //更新文章
    async updateArticle(data) {
        const res = await put('admin/article', data)
        return res
    }

    //获取文章详情
    async getArticleInfo(id) {
        const res = await get(`admin/article?id=${id}`)
        return res
    }

    //获取所有文章
    async getAllArticle(params) {
        const res = await get('admin/article/articles', params)
        return res
    }

    //删除文章
    async deleteArticle(id) {
        const res = await _delete(`admin/article?id=${id}`)
        return res
    }


    //设置文章公开或者私密
    async setState(id, params) {
        const res = await put(`admin/article/public?id=${id}`, params)
        return res
    }

    //设置文章精选或者非精选
    async setStar(id, params) {
        const res = await put(`admin/article/star?id=${id}`, params)
        return res
    }

    //获取文章下的全部评论
    async getComment(id) {
            const res = await get(`admin/article/get/comment?articleId=${id}`)
            return res
        }
        //删除某条评论
    async deleteComment(id) {
        const res = await _delete(`admin/article/del/comment?id=${id}`)
        return res
    }
}
export default new Article()