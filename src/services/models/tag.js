import {get, post, put, _delete } from '@/services/axios/axios'

class Tag {
    //创建标签
    async createTag(data) {
        const res = await post('admin/tag', data)
        return res
    }

    //获取所有标签
    async getAllTags() {
        const res = await get('admin/tag/tags')
        return res
    }

    //更新标签信息
    async updateTag(id, data) {
        const res = await put(`admin/tag?id=${id}`, data)
        return res
    }

    //删除标签
    async deleteTag(id) {
        const res = await _delete(`admin/tag?id=${id}`)
        return res
    }
}

export default new Tag()