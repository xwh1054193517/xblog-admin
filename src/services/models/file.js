import {get, post, put, _delete } from '@/services/axios/axios'

class File {

    //获取所有分类
    async getAllFiles() {

    }

    //创建分类
    async createFile(data) {
        const res = await post('admin/file', data)
        return res
    }


    //更新分类
    async updateFile(data) {
        const res = await put('admin/file', data)
        return res
    }


    //删除分类
    async deleteFile(key) {
        const res = await _delete(`admin/file?key=${key}`)
        return res
    }


}

export default new File()