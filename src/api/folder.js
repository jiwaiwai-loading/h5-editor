import utils from '@/assets/js/utils.js'

/**
 * 获取模板分类
 */
export const getCategory = () => utils.ajax({
    url: 'letter/template/category'
});

/**
 * 删除
 * @param {number} id 
 */
export const delFloder = (id) => utils.ajax({
    url: 'letter/folder/del/' + id,
    method: 'post'
})

/**
 * 保存
 * @param {object} floder
 */
export const editFloder = (floder) => utils.ajax({
    url: 'letter/folder/edit',
    method: 'post',
    params: floder
})

/**
 * 获取文件夹列表
 * @returns []
 */
export const getFolder = () => utils.ajax({
    url: 'letter/folder/list'
});

/**
 * 获取我的上传
 * @param {number} cid - 文件夹ID
 * @param {number} [pageIndex=1] - 当前页
 * @param {number} [pageSize=30] - 每页条数
 * @returns 
 */
export const getMaterial = (cid, pageIndex, pageSize) => utils.ajax({
    url: 'letter/folder/material/list',
    params: {
        cid: cid,
        pageIndex: pageIndex || 1,
        pageSize: pageSize || 30
    }
});