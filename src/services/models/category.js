import {get, post, put, _delete } from '@/services/axios/axios'

class Category {

    //获取所有分类
    async getAllCategories() {
        const res = await get('admin/category/categories')
        return res
    }

    //创建分类
    async createCategory(data) {
        const res = await post('admin/category', data)
        return res
    }


    //更新分类
    async updateCategory(id, data) {
        const res = await put(`admin/category?id=${id}`, data)
        return res
    }


    //删除分类
    async deleteCategory(id) {
        const res = await _delete(`admin/category?id=${id}`)
        return res
    }


}

export default new Category()