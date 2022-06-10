import {get, _delete } from '@/services/axios/axios'

class Message {

    //获取所有留言
    async getAllMessages(page = 0) {
        const res = await get(`admin/message/messages?page=${page}&count=10`)
        return res
    }

    // 删除留言
    async deleteMessage(id) {
        const res = await _delete(`admin/message?id=${id}`)
        return res
    }
}

export default new Message()