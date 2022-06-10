import {get, post, put, _delete } from '@/services/axios/axios'

class Blog {
    //获取所有友链
    async getAllFriends() {
        const res = await get('admin/blog/friend/friends')
        return res
    }

    //创建友链
    async createFriend(data) {
        const res = await post('admin/blog/friend', data)
        return res
    }

    //修改友链
    async changeFriend(id, data) {
        const res = await put(`admin/blog/friend?id=${id}`, data)
        return res
    }

    //删除
    async deleteFriend(id) {
        const res = await _delete(`admin/blog/friend?id=${id}`)
        return res
    }

}

export default new Blog()