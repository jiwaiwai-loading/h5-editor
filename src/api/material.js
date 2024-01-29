import utils from '@/assets/js/utils.js'

/**
 * 获取资源类型
 */
export const getType = () => utils.ajax({
    url: 'letter/material/category/materialType'
});

/**
 * 获取资源预览合集
 * @param {string} cid 
 */
export const getUnion = (cid) => utils.ajax({
    url: 'letter/material/union/' + cid
});

/**
 * 获取资源详情
 * @param {string} cidOrType - 分类ID或资源类型
 * @param {number} [pageIndex=1] - 当前页
 * @param {string} [keyword] - 搜索关键词
 */
export const getCell = (cidOrType, pageIndex, keyword) => utils.ajax({
    url: 'letter/material/cell/' + cidOrType,
    params: {
        pageIndex: pageIndex?pageIndex:1,
        pageSize: 30,
        keyword: keyword
    }
})

/**
 * 获取属性资源，包括字体，mask-image
 * @returns []
 */
export const getAttr = () => utils.ajax({
    url: 'letter/material/attr'
})

