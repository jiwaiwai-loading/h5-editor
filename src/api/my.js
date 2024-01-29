import utils from '@/assets/js/utils.js'

/**
 * 登录
 * @param {string} module - 登录模块
 * @param {object} args
 * @param {string} args.code - 扫码登录的二维码code
 * @param {number} [args.id] - 登录后要跳转的模板ID，后台管理端用到
 * @param {string} [args.token] - 用户token，后台管理端用到
 */
export const myLogin = (module, args) => utils.ajax({
    url: 'letter/user/login/' + module,
    method: 'post',
    params: {
        'code': args.code,
        'id': args.id,
        'token': args.token
    }
})

/**
 * 获取模板分类
 */
export const getCategory = () => utils.ajax({
    url: 'letter/template/category'
});

/**
 * 编辑分类
 * @param {object} category
 * @param {number} [category.id] - 分类ID
 * @param {string} category.name - 分类名称
 * @param {number} [category.sort] - 分类排序
 */
export const editCategory = (category) => utils.ajax({
    url: 'letter/template/category/edit',
    method: 'post',
    params: category
})

/**
 * 删除分类
 * @param {number} id - 分类ID
 */
export const delCategory = (id) => utils.ajax({
    url: 'letter/template/category/del/' + id,
    method: 'post'
})

/**
 * 保存模板
 * @param {object} template - 保存的模板数据
 */
export const saveTemplate = (template) => utils.ajax({
    url: 'letter/template/save',
    method: 'post',
    params: template
})

/**
 * 编辑模板
 * @param {object} args 
 * @param {number} args.id - 要编辑的模板ID
 * @param {number} [args.cid] - 要移动至的分类ID
 * @param {string} [args.title] - 要编辑的模板标题
 */
export const editTemplate = (args) => utils.ajax({
    url: 'letter/template/edit',
    method: 'post',
    params: args
})

/**
 * 删除模板
 * @param {number} id - 模板ID
 */
export const delTemplate = (id) => utils.ajax({
    url: 'letter/template/del/' + id,
    method: 'post'
})

/**
 * 模板列表
 * @param {number} cid - 分类ID
 * @param {number} [pageIndex=1] - 当前分页
 * @param {number} [pageSize=12] - 每页页数
 */
export const listTemplate = (cid, pageIndex, pageSize) => utils.ajax({
    url: 'letter/template/list',
    params: {
        cid: cid,
        pageIndex: pageIndex ? pageIndex : 1,
        pageSize: pageSize ? pageSize : 12
    }
})