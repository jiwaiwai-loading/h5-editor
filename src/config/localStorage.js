import utils from '@/assets/js/utils.js';
/*****
myTheme: {
    expires: 100, //过期时间，毫秒, 默认不过期
    protect: false, //是否受保护，  默认false
}
*/
const keys = addProperty({
    myTheme: {
        protect: true
    },
    myLanguage: {
        protect: true
    },
    myDriver: {
        protect: true
    }
});
const myTheme = keys['myTheme']
const myLanguage = keys['myLanguage']
const myDriver = keys['myDriver']

export {
    myTheme,
    myLanguage,
    myDriver,
    delAll
}

const delAll = function () {
    for (const key in keys) {
        if (keys['protect'] !== true) {
            utils.localStorage.del(key)
        }
    }
}

function addProperty(keys) {
    let temp = {};
    for (const key in keys) {
        temp[key] = {};
        temp[key]['set'] = function (value) {
            utils.localStorage.set(key, value, keys[key]['expires'] ? keys[key]['expires'] : -1)
        }
        temp[key]['del'] = function () {
            utils.localStorage.del(key)
        }
        temp[key]['value'] = utils.localStorage.get(key)
    }
    return temp;
}
