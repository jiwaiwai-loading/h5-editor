//接口测试数据
import data from '@/api/mock/data.js';

const getData = (url) => {
    return {
        code: 0,
        data: data(url),
        message: 'success'
    }
}

export default getData;
