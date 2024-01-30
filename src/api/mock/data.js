const material1 = [
    {
        "id": 1,
        "url": "/h5-editor/mock/images/1.png", 
        "type": "material",
    },
    {
        "id": 2,
        "url": "/h5-editor/mock/images/2.png",
        "type": "material",
    },
    {
        "id": 3,
        "url": "/h5-editor/mock/images/3.png",
        "type": "material",
    },
    {
        "id": 4,
        "url": "/h5-editor/mock/images/4.png",
        "type": "material",
    },
    {
        "id": 5,
        "url": "/h5-editor/mock/images/5.png",
        "type": "material",
    },
    {
        "id": 6,
        "url": "/h5-editor/mock/images/6.png",
        "type": "material",
    }
];
const material2 = [
    {
        "id": 1,
        "url": "/h5-editor/mock/images/10.png",
        "type": "material",
    },
    {
        "id": 2,
        "url": "/h5-editor/mock/images/11.png",
        "type": "material",
    },
    {
        "id": 3,
        "url": "/h5-editor/mock/images/12.png",
        "type": "material",
    },
    {
        "id": 4,
        "url": "/h5-editor/mock/images/13.png",
        "type": "material",
    },
    {
        "id": 5,
        "url": "/h5-editor/mock/images/14.png",
        "type": "material",
    },
    {
        "id": 6,
        "url": "/h5-editor/mock/images/15.png",
        "type": "material",
    }
];
const background = [
    {
        "id": 1,
        "url": "/h5-editor/mock/images/21.jpg",
        "type": "background",
    },
    {
        "id": 2,
        "url": "/h5-editor/mock/images/22.jpg",
        "type": "background",
    },
    {
        "id": 3,
        "url": "/h5-editor/mock/images/23.jpg",
        "type": "background",
    },
    {
        "id": 4,
        "url": "/h5-editor/mock/images/24.jpg",
        "type": "background",
    },
    {
        "id": 5,
        "url": "/h5-editor/mock/images/25.jpg",
        "type": "background",
    },
    {
        "id": 6,
        "url": "/h5-editor/mock/images/26.jpg",
        "type": "background",
    }
];
const group = [{
    "id": 1,
    "thumbnailUrl": "/h5-editor/mock/images/30.jpg",
    "type": "template",
    "json": `{
        "material": [
            {
                "id": "material_0_1706515793584",
                "type": "material",
                "src": "/h5-editor/mock/images/1.png",
                "style": {
                    "position": "absolute",
                    "width": "316px",
                    "height": "141px",
                    "left": "-9px",
                    "top": "187px",
                    "z-index": 1
                },
                "show": true,
                "animate": {
                    "animate": "fadeInLeft"
                },
                "group": "group_1706515870124"
            },
            {
                "id": "material_1_1706515793584",
                "type": "material",
                "src": "/h5-editor/mock/images/3.png",
                "style": {
                    "position": "absolute",
                    "width": "174px",
                    "height": "218px",
                    "left": "5px",
                    "top": "190px",
                    "z-index": 2
                },
                "show": true,
                "animate": {
                    "animate": "fadeInLeft",
                    "delay": "1s"
                },
                "group": "group_1706515870124"
            },
            {
                "id": "material_2_1706515793584",
                "type": "material",
                "src": "/h5-editor/mock/images/2.png",
                "style": {
                    "position": "absolute",
                    "width": "79px",
                    "height": "60px",
                    "left": "318px",
                    "top": "-9px",
                    "z-index": 3
                },
                "animate": {
                    "animate": "fadeInDown",
                    "delay": "1.25s"
                },
                "group": "group_1706515870124"
            }
        ],
        "text": []
    }`
}, {
    "id": 2,
    "thumbnailUrl": "/h5-editor/mock/images/31.jpg",
    "type": "template",
    "json": `{
        "material": [
            {
                "id": "material_1706515394601",
                "type": "material",
                "src": "/h5-editor/mock/images/5.png",
                "style": {
                    "position": "absolute",
                    "width": "122px",
                    "height": "82px",
                    "left": "-4px",
                    "top": "408px",
                    "z-index": 2
                },
                "animate": {
                    "animate": "fadeInLeft"
                },
                "group": "group_1706515653651"
            },
            {
                "id": "material_1706515436671",
                "type": "material",
                "src": "/h5-editor/mock/images/4.png",
                "style": {
                    "position": "absolute",
                    "width": "155px",
                    "height": "197px",
                    "left": "221px",
                    "top": "554px",
                    "z-index": 3
                },
                "animate": {
                    "animate": "fadeInUp"
                },
                "group": "group_1706515653651"
            }
        ],
        "text": [
            {
                "id": "text_1706515474600",
                "type": "text",
                "content": "鹤",
                "style": {
                    "position": "absolute",
                    "width": "57px",
                    "height": "38px",
                    "left": "148px",
                    "top": "707px",
                    "text-align": "center",
                    "font-size": "29px",
                    "font-weight": "bolder",
                    "z-index": 4,
                    "font-family": "CangErXiaoWanZi",
                    "color": "#075B3E"
                },
                "focus": false,
                "gradient": true,
                "animate": {
                    "animate": "fadeInZoom"
                },
                "group": "group_1706515653651"
            }
        ]
    }`
}];
const music = [{
    "id": 1,
    "url": "/h5-editor/mock/music/1.mp3",
    "keyword": "Adventures of Flying Jack.mp3",
    "type": "music",
},
{
    "id": 2,
    "url": "/h5-editor/mock/music/2.mp3",
    "keyword": "Advertime.mp3",
    "type": "music"
}];

const switchData = (url) => {
    if (url.search('materialType') > 0) {
        return {
            "id": 1,
            "pid": 0,
            "code": "materialType",
            "name": "素材分类",
            "children": [
                {
                    "id": 2,
                    "pid": 1,
                    "code": "template",
                    "name": "模板",
                    "children": [
                        {
                            "id": 3,
                            "pid": 2,
                            "name": "表达问候",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 4,
                    "pid": 1,
                    "code": "material",
                    "name": "素材",
                    "children": [
                        {
                            "id": 5,
                            "pid": 4,
                            "name": "植物鲜花",
                            "children": []
                        },
                        {
                            "id": 6,
                            "pid": 4,
                            "name": "水墨国风",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 7,
                    "pid": 1,
                    "code": "background",
                    "name": "背景",
                    "children": [
                        {
                            "id": 8,
                            "pid": 7,
                            "name": "简约背景",
                            "children": []
                        },
                        {
                            "id": 9,
                            "pid": 7,
                            "name": "手绘卡通",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 10,
                    "pid": 1,
                    "name": "音乐",
                    "code": "music",
                    "children": [
                        {
                            "id": 16,
                            "pid": 10,
                            "name": "轻快的",
                            "children": []
                        },
                        {
                            "id": 17,
                            "pid": 10,
                            "name": "舒缓的",
                            "children": []
                        }
                    ]
                },
                {
                    "id": 13,
                    "pid": 1,
                    "name": "字体",
                    "code": "font",
                    "children": [
                        {
                            "id": 14,
                            "pid": 13,
                            "name": "商用免费",
                            "children": []
                        }
                    ]
                }
            ]
        };
    } else if (url.search('attr') > 0) {
        return {
            "font": [
                {
                    "id": 1,
                    "keyword": "CangErXiaoWanZi",
                    "url": "/h5-editor/mock/fonts/CangErXiaoWanZi.ttf",
                    "thumbnailUrl": "/h5-editor/mock/fonts/CangErXiaoWanZi.png",
                }, {
                    "id": 2,
                    "keyword": "SuCaiJiShiKuFangTi",
                    "url": "/h5-editor/mock/fonts/SuCaiJiShiKuFangTi.ttf",
                    "thumbnailUrl": "/h5-editor/mock/fonts/SuCaiJiShiKuFangTi.png",
                }
            ],
            "mask": [
                {
                    "id": 1,
                    "url": "/h5-editor/mock/images/mask/1.png",
                    "thumbnailUrl": "/h5-editor/mock/images/mask/icon/1.png",
                }, {
                    "id": 2,
                    "url": "/h5-editor/mock/images/mask/2.png",
                    "thumbnailUrl": "/h5-editor/mock/images/mask/icon/2.png",
                }, {
                    "id": 3,
                    "url": "/h5-editor/mock/images/mask/3.png",
                    "thumbnailUrl": "/h5-editor/mock/images/mask/icon/3.png",
                }
            ]
        };
    } else if (url.search('union/2') > 0) {
        return [{
            "id": 11,
            "name": "表达问候",
            "module": "material",
            "material": group
        }]
    } else if (url.search('union/4') > 0) {
        return [{
            "id": 12,
            "pid": 11,
            "name": "水墨国风",
            "module": "material",
            "material": material1
        }, {
            "id": 13,
            "pid": 11,
            "name": "植物鲜花",
            "module": "material",
            "material": material2
        }];
    } else if (url.search('union/7') > 0) {
        return [{
            "id": 14,
            "pid": 7,
            "name": "简约背景",
            "material": background
        }, {
            "id": 15,
            "pid": 7,
            "name": "手绘卡通",
            "material": []
        }];
    } else if (url.search('union/10') > 0) {
        return [{
            "id": 16,
            "pid": 10,
            "name": "轻快的",
            "material": music
        }, {
            "id": 17,
            "pid": 10,
            "name": "舒缓的",
            "material": []
        }];
    } else if (url.search('cell/11') > 0) {
        return {
            count: 1,
            data: group
        };
    } else if (url.search('cell/12') > 0) {
        return {
            count: 6,
            data: material1
        };
    } else if (url.search('cell/13') > 0) {
        return {
            count: 6,
            data: material2
        };
    } else if (url.search('cell/14') > 0) {
        return {
            count: 6,
            data: background
        };
    } else if (url.search('cell/15') > 0) {
        return {
            count: 6,
            data: background
        };
    } else if (url.search('cell/16') > 0) {
        return {
            count: 2,
            data: music
        };
    } else if (url.search('login') > 0) {
        return {
            "id": 1,
            "uuid": "6507b5543bda08.69798764",
            "username": "Mock",
            "avatar": "/logo.png",
            "module": "ledger",
            "token": "659dfc8513c60734567015"
        };
    } else if (url.search('template/category') > 0) {
        return [{
            "id": 1,
            "name": "category1"
        }];
    } else if (url.search('template/list') > 0) {
        return {
            count: 1,
            data: [{
                "id": 1,
                "cid": 0,
                "title": "一行白鹭上青天",
                "cover": "/h5-editor/mock/images/20.jpg",
                "content": [
                    {
                        "background": [
                            {
                                "id": "background_1704874019142",
                                "type": "background",
                                "src": "/h5-editor/mock/images/20.jpg",
                                "style": {
                                    "position": "absolute",
                                    "width": "377px",
                                    "height": "752px",
                                    "left": "-1px",
                                    "top": "-1px",
                                    "z-index": 0
                                }
                            }
                        ],
                        "material": [
                            {
                                "id": "material_1704874027661",
                                "type": "material",
                                "src": "/h5-editor/mock/images/6.png",
                                "style": {
                                    "position": "absolute",
                                    "width": "387px",
                                    "height": "376px",
                                    "left": "-8px",
                                    "top": "379px",
                                    "z-index": 2
                                },
                                "animate": {
                                    "animate": "fadeInUp",
                                    "speed": "slow",
                                    "delay": "0.5s"
                                }
                            },
                            {
                                "id": "material_1704874046106",
                                "type": "material",
                                "src": "/h5-editor/mock/images/2.png",
                                "style": {
                                    "position": "absolute",
                                    "width": "142px",
                                    "height": "85px",
                                    "left": "266px",
                                    "top": "1px",
                                    "z-index": 4
                                },
                                "animate": {
                                    "animate": "fadeIn",
                                    "speed": "slow"
                                }
                            },
                            {
                                "id": "material_1704874066950",
                                "type": "material",
                                "src": "/h5-editor/mock/images/5.png",
                                "style": {
                                    "position": "absolute",
                                    "width": "167px",
                                    "height": "106px",
                                    "left": "47px",
                                    "top": "328px",
                                    "z-index": 4
                                },
                                "animate": {
                                    "animate": "fadeInLeft",
                                    "speed": "slower",
                                    "delay": "0.75s"
                                },
                                "group": "group_1704876057568"
                            },
                            {
                                "id": "material_1704874077722",
                                "type": "material",
                                "src": "/h5-editor/mock/images/4.png",
                                "style": {
                                    "position": "absolute",
                                    "width": "88px",
                                    "height": "123px",
                                    "left": "290px",
                                    "top": "209px",
                                    "z-index": 5
                                },
                                "animate": {
                                    "animate": "fadeInRight",
                                    "delay": "0.5s"
                                },
                                "group": "group_1704876057568"
                            }
                        ],
                        "text": [
                            {
                                "id": "text_1704874151586",
                                "type": "text",
                                "content": "一行白鹭上青天",
                                "style": {
                                    "position": "absolute",
                                    "width": "49px",
                                    "height": "36px",
                                    "left": "14px",
                                    "top": "23px",
                                    "text-align": "center",
                                    "font-size": "28px",
                                    "font-weight": "bolder",
                                    "font-family": "CangErXiaoWanZi",
                                    "z-index": 1,
                                    "color": "#F5913F"
                                },
                                "focus": false,
                                "animate": {
                                    "animate": "fadeInLeft",
                                    "delay": "1.5s",
                                    "speed": "slow"
                                },
                                "gradient": true
                            }
                        ]
                    }
                ]
            }]
        };
    }
}

export default switchData