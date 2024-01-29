import { createI18n } from 'vue-i18n'

const messages = {
    'zh-cn': {
        common: {
            appName: 'H5 编辑器',
            appDesc: '通过拖拉拽生成漂亮的HTML页面，并支持各种动画效果。可制作各类邀请函、请柬、活动宣传页面等。',
            add: '新增',
            del: '删除',
            copy: '复制',
            up: '上移',
            down: '下移',
            warning: '注意',
            yes: '是',
            no: '否',
            page: '页面',
            search: '搜索',
            result: '结果',
            ok: '确定',
            cancel: '取消',
            tips: '提示',
            delPrompt: '此操作将永久删除, 是否继续?',
            loadFailed: '加载失败',
            moveTo: '移动到',
            limitUp: '不能再多了',
            limitDown: '不能再少了',
            color: '颜色',
            default: '默认',
            back: '返回',
            all: '全部',
            ani: '动画',
            layer: '图层',
            lock: '锁定',
            unlock: '解锁',
            group: '组合',
        },
        user: {
            my: '我的',
            login: '登录',
            logout: '退出',
            logged: '您还未登录，登录后查看模板',
            quit: '您确定要退出登录吗？',
        },
        menu: {
            template: '模板',
            common: '常用',
            material: '素材',
            background: '背景',
            vfx: '特效',
            music: '音乐',
            map: '地图',
            form: '表单',
            upload: '上传'
        },
        template: {
            classify: '分类',
            change: '确定要覆盖当前模板吗？'
        },
        text: {
            h1: '点击添加标题文字',
            h2: '点击添加副标题文字',
            h3: '点击添加正文文字',
            fontFamily: '字体',
            fontSize: '字号',
            letterSpacing: '字间距',
            font: '加粗、斜体、下划线',
            textAlign: '对齐方式',
            fontColor: '字体颜色',
            rainbow: '彩虹',
            add: '添加文字',
            edit: '双击编辑文字',
        },
        dom: {
            bgc: '背景颜色',
            opacity: '透明度',
            radius: '圆角',
            border: '边框',
            solid: '实线',
            dashed: '虚线',
            dotted: '点虚线',
            double: '双实线',
            shadow: '投影',
            shpape: '形状'
        },
        toolBar: {
            refline: '参考线',
            hrl: '横向',
            vrl: '竖向',
            crl: '清除',
            preview: '预览',
            save: '保存',
            notEmpty: '至少保留一页',
            replace: '可被替换',
            replaceHint: '选择是，则在小程序、APP端可被修改',
            fitSize: '适屏尺寸',
            back: '撤销',
            recover: '恢复',
            delete: '删除',
            copy: '复制',
            play: '播放',
            pause: '暂停',
            up: '上移一层',
            down: '下移一层',
            top: '置于顶层',
            bottom: '置于底层',
            replaceImage: '替换图片',
            editImage: '编辑图片',
            delNode: '删除图层',
            group: '组',
        },
        ani: {
            seconds: '秒',
            delay: '延迟',
            infinite: '持续',
            linear: '匀速',
            speed: '速度',
            fastest: '急速',
            faster: '非常快速',
            fast: '快速',
            slow: '缓慢',
            slower: '非常缓慢',
            slowest: '急慢',
        },
        footer: {
            driver: '操作指引',
            feedback: '反馈与建议',
            aboutUs: '关于我们'
        },
        driver: {
            close: '确定要关闭操作指引吗？',
            button: {
                next: '下一步',
                prev: '上一步',
                done: '完成'
            },
            theme: {
                title: '白天黑夜模式',
                desc: '点击这里切换白天黑夜模式'
            },
            lang: {
                title: '切换语言',
                desc: '点击这里切换语言'
            },
            login: {
                title: '登录',
                desc: '点击这里登录'
            },
            menu: {
                title: '菜单',
                desc: '点击相应选项选择素材进行模板制作'
            },
            menumaterial: {
                title: '添加素材',
                desc: '点击素材试试？',
            },
            menuContent: {
                title: '菜单内容',
                desc: '点击图片素材，将素材添加到模板制作区',
            },
            palette: {
                title: '模板制作区',
                desc: '选中刚添加的素材，通过拖拉拽的方式进行模板制作',
            },
            layer: {
                title: '图层',
                desc: '点击刚添加的素材元素，可拖动元素改变元素展示层级等快捷操作',
            },
            attr: {
                title: '素材属性',
                desc: '选择相应的属性，可改变素材的外观形状等，不妨点击试试？'
            },
            ani: {
                title: '添加动画',
                desc: '选择相应动画，添加元素动画'
            },
            bar: {
                title: '常用操作',
                desc: '这里可对编辑器进行常用操作，如撤销、恢复、复制、删除、添加文字、缩放编辑器、预览、保存等操作'
            },
            page: {
                title: '模板页面',
                desc: '这里可以切换当前要制作的页面及新增模板页面',
            },
            driver: {
                title: '操作指引',
                desc: '再次观看操作指引请点击这里'
            }
        }
    },
    'en': {
        common: {
            appName: 'H5 Editor',
            appDesc: 'Generate beautiful HTML pages through drag-and-drop, with support for various animation effects. It can be used to create various invitations, cards, event promotional pages, and more.',
            add: 'Add',
            del: 'Delete',
            copy: 'Copy',
            up: 'Up',
            down: 'Down',
            warning: 'Warning',
            yes: 'Yes',
            no: 'No',
            page: 'Page',
            search: 'Search',
            result: 'Result',
            ok: 'Ok',
            cancel: 'Cancel',
            tips: 'Tips',
            delPrompt: 'This operation will permanently delete. Do you want to continue?',
            loadFailed: 'Loading failed',
            moveTo: 'Move to',
            limitUp: 'Limit reached',
            limitDown: 'Lower limit reached',
            color: 'Color',
            default: 'Default',
            back: 'Back',
            all: 'All',
            ani: 'Animation',
            layer: 'Layer',
            lock: 'Lock',
            unlock: 'Unlock',
            group: 'Group',
        },
        user: {
            my: 'My',
            login: 'Login',
            logout: 'Logout',
            logged: 'You are not logged in yet, Please log in to view the template',
            quit: 'Are you sure you want to quit?'
        },
        text: {
            h1: 'Click Add title text',
            h2: 'Click Add subtitle text',
            h3: 'Click Add body text',
            fontFamily: 'Font family',
            fontSize: 'Font size',
            letterSpacing: 'Letter spacing',
            font: 'Font weight、Italic、Decoration',
            textAlign: 'Text align',
            fontColor: 'Font color',
            rainbow: 'Rainbow',
            add: 'Add text',
            edit: 'Double click edit text',
        },
        template: {
            classify: 'Classify',
            change: 'Are you sure you want to overwrite the current template?'
        },
        dom: {
            bgc: 'Background color',
            opacity: 'Opacity',
            radius: 'Border radius',
            border: 'Border',
            solid: 'Solid',
            dashed: 'Dashed',
            dotted: 'Dotted',
            double: 'Double',
            shadow: 'Shadow',
            shpape: 'Shpape'
        },
        menu: {
            template: 'Template',
            common: 'Common',
            material: 'Material',
            background: 'BG',
            vfx: 'VFX',
            music: 'Music',
            map: 'Map',
            form: 'Form',
            upload: 'Upload'
        },
        toolBar: {
            refline: 'Refline',
            hrl: 'Horizontal',
            vrl: 'Vertical',
            crl: 'Clear',
            preview: 'Preview',
            save: 'Save',
            notEmpty: 'Reserve at least one page',
            replace: 'Replace',
            replaceHint: 'If "Yes" is selected, it can be modified on the mini-program or app side',
            fitSize: 'Fit size',
            back: 'Back',
            recover: 'Recover',
            delete: 'Delete',
            copy: 'Copy',
            play: 'Play',
            pause: 'Pause',
            up: 'Move up',
            down: 'Move down',
            top: 'Move top',
            bottom: 'Move bottom',
            replaceImage: 'Replace Img',
            editImage: 'Edit Img',
            delNode: 'Delete node',
            group: 'Group'
        },
        ani: {
            seconds: 'Seconds',
            delay: 'Delay',
            infinite: 'Infinite',
            linear: 'Linear',
            speed: 'Speed',
            fastest: 'Fastest',
            faster: 'Faster',
            fast: 'Fast',
            slow: 'Slow',
            slower: 'Slower',
            slowest: 'Slowest',
        },
        footer: {
            driver: 'Driver',
            feedback: 'Feedback',
            aboutUs: 'AboutUs'
        },
        driver: {
            close: 'Are you sure you want to quit?',
            button: {
                next: 'Next',
                prev: 'Prev',
                done: 'Done'
            },
            theme: {
                title: 'Day and night mode',
                desc: 'Click here to toggle between day and night mode.'
            },
            lang: {
                title: 'Switch language',
                desc: 'Click here to switch language.'
            },
            login: {
                title: 'Login',
                desc: 'Click here to log in.'
            },
            menu: {
                title: 'Menu',
                desc: 'Click on the respective option to choose materials for template creation.'
            },
            menumaterial: {
                title: 'Add materials',
                desc: 'Click on the material to give it a try.',
            },
            menuContent: {
                title: 'Menu content',
                desc: 'Click on the image material to add it to the template creation area.',
            },
            palette: {
                title: 'Template creation area',
                desc: 'Select the recently added material and use drag-and-drop to create the template in the template creation area.',
            },
            layer: {
                title: 'Layer',
                desc: 'Click on the recently added material element. You can drag the element to change its position and perform other quick operations to modify the display hierarchy.',
            },
            attr: {
                title: 'Material properties',
                desc: 'Select the appropriate properties to change the appearance and shape of the material. Feel free to click and give it a try!'
            },
            ani: {
                title: 'Add animation',
                desc: 'Select the appropriate animation to add dynamic effects to the element.'
            },
            bar: {
                title: 'Common operations',
                desc: 'Here, you can perform common operations on the editor, such as undo, redo, copy, delete, add text, zoom in/out of the editor, preview, save, etc.'
            },
            page: {
                title: 'Template page',
                desc: 'Here, you can switch to the current page being edited and add new template pages.',
            },
            driver: {
                title: 'Operational guidance',
                desc: 'To view the operational guidance again, please click here.'
            }
        }
    }
}

const i18n = createI18n({
    legacy: false,
    locale: 'zh-cn',
    fallbackLocale: 'en',
    messages
})

export default i18n;