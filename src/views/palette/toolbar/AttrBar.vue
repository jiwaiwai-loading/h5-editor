<template>
    <div class="attr-area uof-x uof-y-s animate__animated animate__faster" :class="nodeStore.checkedNode.id ? 'animate__slideInLeft' : 'animate__slideOutLeft'">
        <!--B 是否可被替换-->
        <div v-show="nodeStore.checkedNode.type == 'text' || nodeStore.checkedNode.type == 'image'" class="ub uc-bg ubr uz2">
            <div class="ub ub-pc upad-a06 ubb">
                <div class="ub ub-pc">
                    <span>{{ settingStore.t('toolBar.replace') }} </span>
                    <el-tooltip effect="dark" :content="settingStore.t('toolBar.replaceHint')" placement="top-start">
                        <el-icon>
                            <QuestionFilled />
                        </el-icon>
                    </el-tooltip>
                </div>
                <div class="umar-l08" style="transform: scale(0.8);">
                    <el-switch v-model="nodeStore.checkedNode.edit" :active-text="settingStore.t('common.yes')" :inactive-text="settingStore.t('common.no')"></el-switch>
                </div>
            </div>
        </div>
        <!-- E 是否可被替换-->
        <!-- B 文字处理区-->
        <div v-show="nodeStore.checkedNode.type == 'text'" class="ub ub-ver uc-bg ubr uz2">
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('text.fontFamily')" placement="top-start">
                        <img src="@/assets/images/font-family.png">
                    </el-tooltip>
                </div>
                <div class="ub ub-f1 umar-r06">
                    <el-dropdown @command="changeFontFamily" class="ub ub-f1">
                        <div class="ub ub-f1 ub-ac ub-pc">
                            <div class="ub ub-f1">
                                <el-image v-if="currentNodeFont.thumbnailUrl" :src="currentNodeFont.thumbnailUrl" fit="contain" style="width:120px"></el-image>
                                <span v-else>{{ settingStore.concatLang(['common.default','text.fontFamily']) }}</span>
                            </div>
                            <el-icon><arrow-down /></el-icon>
                        </div>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item :command="{keyword:null}">{{ settingStore.concatLang(['common.default','text.fontFamily']) }}</el-dropdown-item>
                                <el-dropdown-item :command="item" v-for="item in attrAssets.font" :key="item.id">
                                    <el-image v-if="item.thumbnailUrl" :src="item.thumbnailUrl" fit="contain" style="width:130px"></el-image>
                                    <span v-else>{{ item.keyword }}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('text.fontSize')" placement="top-start">
                        <img src="@/assets/images/font-size.png">
                    </el-tooltip>
                </div>
                <el-slider v-model="attr['font-size']" @change="val => updateAttr('style', 'font-size', val + 'px', true)" @input="val => updateAttr('style', 'font-size', val + 'px', false)" :min="10" :max="200" size="small" :format-tooltip="val => val + 'px'"></el-slider>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('text.letterSpacing')" placement="top-start">
                        <img src="@/assets/images/letter-spacing.png">
                    </el-tooltip>
                </div>
                <el-slider v-model="attr['letter-spacing']" @change="val => updateAttr('style', 'letter-spacing', val + 'px', true)" @input="val => updateAttr('style', 'letter-spacing', val + 'px', false)" :min="-10" :max="100" size="small" :format-tooltip="val => val + 'px'"></el-slider>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('text.font')" placement="top-start">
                        <img src="@/assets/images/font-more.png">
                    </el-tooltip>
                </div>
                <div>
                    <el-checkbox-button v-model="attr['font-weight']" @change="val => updateAttr('style', 'font-weight', val, true)" true-label="bolder" title="加粗"><span class="uicon-bolder"></span></el-checkbox-button>
                    <el-checkbox-button v-model="attr['font-style']" @change="val => updateAttr('style', 'font-style', val, true)" true-label="italic" title="斜体"><span class="uicon-italic"></span></el-checkbox-button>
                    <el-checkbox-button v-model="attr['text-decoration']" @change="val => updateAttr('style', 'text-decoration', val, true)" true-label="underline" title="下划线"><span class="uicon-underline"></span></el-checkbox-button>
                </div>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('text.textAlign')" placement="top-start">
                        <img src="@/assets/images/font-align.png">
                    </el-tooltip>
                </div>
                <el-radio-group v-model="attr['text-align']" @change="val => updateAttr('style', 'text-align', val, true)">
                    <el-radio-button label="left" title="left"><span class="uicon-li-left"></span></el-radio-button>
                    <el-radio-button label="center" title="center"><span class="uicon-li-center"></span></el-radio-button>
                    <el-radio-button label="right" title="right"><span class="uicon-li-right"></span></el-radio-button>
                </el-radio-group>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('text.fontColor')" placement="top-start">
                        <img src="@/assets/images/font-color.png">
                    </el-tooltip>
                </div>
                <div class="ub ub-pc ub-f1">
                    <div class="ub ub-f1">
                        <el-color-picker v-model="attr.color" @change="val => updateAttr('style', 'color', val, true)"></el-color-picker>
                        <el-color-picker v-if="nodeStore.checkedNode.gradient" v-model="attr.color2" @change="val => updateAttr('style', 'color2', val, true)"></el-color-picker>
                    </div>
                    <div class="ub ub-pc" style="transform: scale(0.8);">
                        <span class="uf-s06">{{ settingStore.t('text.rainbow') }}&nbsp;</span>
                        <el-switch v-model="nodeStore.checkedNode.gradient"></el-switch>
                    </div>
                </div>
            </div>
        </div>
        <!-- E文字处理区-->
        <div id="driver-attr" class="ub ub-ver uc-bg ubr ubb uradius-br06 uz2">
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('dom.bgc')" placement="top-start">
                        <img src="@/assets/images/bg-color.png">
                    </el-tooltip>
                </div>
                <Gradient v-model="attr['background']" @change="val => updateAttr('style', 'background', val, true)"></Gradient>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('dom.opacity')" placement="top-start">
                        <img src="@/assets/images/opacity.png">
                    </el-tooltip>
                </div>
                <el-slider v-model="attr.opacity" @change="val => updateAttr('style', 'opacity', val, true)" @input="val => updateAttr('style', 'opacity', val, false)" :step="0.01" :min="0" :max="1" size="small" :format-tooltip="val => (val * 100).toFixed(0) + '%'"></el-slider>
            </div>
            <div class="ub ub-pc ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('dom.radius')" placement="top-start">
                        <img src="@/assets/images/radius.png">
                    </el-tooltip>
                </div>
                <el-slider v-model="attr['border-radius']" @change="val => updateAttr('style', 'border-radius', val + '%', true)" @input="val => updateAttr('style', 'border-radius', val + '%', false)" :min="0" :max="50" :format-tooltip="val => val + '%'" size="small"></el-slider>
            </div>
            <div class="ub ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('dom.border')" placement="top-start">
                        <img src="@/assets/images/border.png">
                    </el-tooltip>
                </div>
                <div class="ub ub-ver">
                    <el-slider v-model="attr['border-width']" @change="val => updateBorder(val + 'px', true)" @input="val => updateBorder(val + 'px', false)" :min="0" :max="50" size="small" :format-tooltip="val => val + 'px'"></el-slider>
                    <div class="ub ub-pc umar-a04">
                        <el-color-picker v-model="attr['border-color']" :disabled="attr['border-width'] ? false : true" @change="val => updateAttr('style', 'border-color', val, true)" size="small"></el-color-picker>
                        <el-divider direction="vertical" />
                        <el-select v-model="attr['border-style']" :disabled="attr['border-width'] ? false : true" @change="val => updateAttr('style', 'border-style', val, true)" size="small">
                            <el-option :label="settingStore.t('dom.solid')" value="solid" />
                            <el-option :label="settingStore.t('dom.dashed')" value="dashed" />
                            <el-option :label="settingStore.t('dom.dotted')" value="dotted" />
                            <el-option :label="settingStore.t('dom.double')" value="double" />
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="ub ub-f1 ubb">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('dom.shadow')" placement="top-start">
                        <img src="@/assets/images/shadow.png">
                    </el-tooltip>
                </div>
                <div class="ub ub-ver ub-f1 ">
                    <div class="ub ub-pc">X:<el-slider v-model="createStyle.shadowX" @change="val => updateShadow(true)" @input="val => updateShadow(false)" :min="-100" :max="100" size="small" :show-tooltip="false"></el-slider></div>
                    <div class="ub ub-pc">Y:<el-slider v-model="createStyle.shadowY" @change="val => updateShadow(true)" @input="val => updateShadow(false)" :min="-100" :max="100" size="small" :show-tooltip="false"></el-slider></div>
                    <div class="ub ub-pc">Z:<el-slider v-model="createStyle.shadowZ" @change="val => updateShadow(true)" @input="val => updateShadow(false)" :min="0" :max="100" size="small" :show-tooltip="false"></el-slider></div>
                </div>
                <div class="ub ub-pc umar-r06">
                    <el-color-picker v-model="createStyle.shadowColor" @change="val => updateShadow(true)" size="small"></el-color-picker>
                </div>
            </div>
            <!-- B 形状设置-->
            <div v-if="nodeStore.checkedNode.type != 'map' && nodeStore.checkedNode.type != 'form'" class="ub ub-f1">
                <div class="ub ub-ac ub-pc uc-bg-gray attr-img">
                    <el-tooltip effect="dark" :content="settingStore.t('dom.shpape')" placement="top-start">
                        <img src="@/assets/images/shape.png">
                    </el-tooltip>
                </div>
                <div class="ub ub-f1 ub-wrap">
                    <template v-for="mask in attrAssets.mask">
                        <img @click="updateShape(mask.url)" :src="mask.thumbnailUrl" class="umar-a04 ubtn ushadow uradius-a03" style="width: 18px;height: 18px;">
                    </template>
                    <img @click="updateShape('forbid')" src="@/assets/images/forbid.png" class="umar-a04 ubtn" style="width: 18px;height: 18px;">
                </div>
            </div>
            <!-- E 形状设置-->
        </div>

        <div @click.stop="nodeStore.cancelSelectNode" class="uabs uz1"></div>
    </div>
</template>

<script setup>
import {
    ref,
    watch
} from 'vue';
import { getAttr } from '@/api/material.js'

import utils from '@/assets/js/utils.js';
import Gradient from '@/components/Gradient.vue';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
const nodeStore = useNodeStore();

//B 属性
const createStyleDefault = {
    shadowColor: '',
    shadowX: 0,
    shadowY: 0,
    shadowZ: 2,
};
const attrDefault = {
    'font-size': 16,
    'font-weight': '',
    'font-style': '',
    'font-family': '',
    'text-decoration': '',
    'text-align': '',
    'letter-spacing': 0,
    'color': '#000',
    'color2': '#fff',
    'background': '',
    'opacity': 1,
    'border-radius': 0,
    'border-width': 0,
    'border-color': '#eee',
    'border-style': 'solid',
    'text-shadow': '',
    'box-shadow': '',
}
const createStyle = ref(utils.clone(createStyleDefault));
const attr = ref(utils.clone(attrDefault));

watch(() => nodeStore.checkedNode, async (newVal) => {
    if (newVal.id) {
        //回显
        createStyle.value = utils.clone(createStyleDefault);
        attr.value = utils.clone(attrDefault);
        const style = newVal.style;
        for (let key in attr.value) {
            if (style[key]) {
                const regPX = /^\d+px$/gi;
                const regPer = /^\d+%$/gi;
                const regNumber = /^[0-9.]*$/g;
                if (regPX.test(style[key])) {
                    attr.value[key] = parseInt(style[key].split('px')[0]);
                } else if (regPer.test(style[key])) {
                    attr.value[key] = parseInt(style[key].split('%')[0]);
                } else if (regNumber.test(style[key])) {
                    attr.value[key] = Number(style[key]);
                } else if (key == 'text-shadow' || key == 'box-shadow') {
                    const shadow = style[key].split(' ');
                    createStyle.value.shadowX = Number(shadow[0].split('px')[0]);
                    createStyle.value.shadowY = Number(shadow[1].split('px')[0]);
                    createStyle.value.shadowZ = Number(shadow[2].split('px')[0]);
                    createStyle.value.shadowColor = shadow[3];
                } else if (key == 'font-family') {
                    setCurrentFont(style[key]);
                } else {
                    attr.value[key] = style[key];
                }
            }
        }
        getAttrAssets();
    }
});

/**
 * 更新属性
 * @param {String} nodeType 节点类型
 * @param {String} styleType 样式名
 * @param {String} styleValue  样式值
 * @param {Boolean} isCache 是否缓存
 */
const updateAttr = (nodeType, styleType, styleValue, isCache) => {
    nodeStore.updateNode({
        key: nodeType,
        value: {
            [styleType]: styleValue
        },
        isCache: isCache
    });
}

/**
 * 加载属性资源
 */
const attrAssets = ref({});
const getAttrAssets = async () => {
    let assets = {};
    if (!attrAssets.value.font) {
        const data = await getAttr();
        if (data.code == 0) {
            attrAssets.value = data.data;
            assets = data.data;
        }
    } else {
        assets = attrAssets.value;
    }
    return assets;
}

/**
 * 设置当前选中的文字字体
 * @param {string} fontName - 字体名
 */
const currentNodeFont = ref({});
const setCurrentFont = async (fontName) => {
    if (fontName) {
        const assets = await getAttrAssets();
        for (let i = 0; i < assets.font.length; i++) {
            if (assets.font[i].keyword == fontName) {
                changeFontFamily(assets.font[i]);
                return;
            }
        }
    } else {
        currentNodeFont.value = {};
    }
}

/**
 * 切换字体
 * @param {object} font - 字体信息
 */
const changeFontFamily = (font) => {
    if (font.keyword) {
        const hasFontFace = document.getElementById(font.keyword);
        if (!hasFontFace) {
            const fontFace = `@font-face { font-family: ${font.keyword};src: url('${font.url}'); }`;
            const head = document.getElementsByTagName("head")[0];
            let style = document.createElement("style");
            style.rel = "stylesheet";
            style.id = font.keyword;
            style.appendChild(document.createTextNode(fontFace));
            head.appendChild(style);
        }
    }
    if (nodeStore.checkedNode.id) {
        currentNodeFont.value = font;
        attr.value['font-family'] = font.keyword;
        updateAttr('style', 'font-family', font.keyword);
    }
}

/**
 * 更新边框
 * @param { String } val 修改值
 * @param { Boolean } isCache 是否缓存步骤
 */
const updateBorder = (val, isCache) => {
    if (!nodeStore.checkedNode.style['border-color']) {
        updateAttr('style', 'border-color', attr.value['border-color'], isCache);
    }
    if (!nodeStore.checkedNode.style['border-style']) {
        updateAttr('style', 'border-style', attr.value['border-style'], isCache);
    }
    updateAttr('style', 'border-width', val, isCache);
}

/**
 * 更新投影
 * @param { Boolean } isCache 是否缓存步骤
 */
const updateShadow = (isCache) => {
    let shadowType = 'box-shadow', arr = [];
    if (nodeStore.checkedNode.type == 'text') {
        shadowType = 'text-shadow';
    }
    if (!utils.isDefine(createStyle.value.shadowColor)) {
        createStyle.value.shadowColor = "#aaa";
    }
    arr = [createStyle.value.shadowX + 'px', createStyle.value.shadowY + 'px', createStyle.value.shadowZ + 'px', createStyle.value.shadowColor];
    updateAttr('style', shadowType, arr.join(" "), isCache);
}

/**
 * 设置图形
 * @param { String } type 
 */
const updateShape = (url) => {
    if (url == 'forbid') {
        updateAttr('style', 'mask-image', null, true);
    } else {
        updateAttr('style', 'mask-image', 'url(' + url + ')', true);
    }
}

</script>

<style>
.attr-area {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 200px;
}

.attr-img {
    padding: 10px 5px;
    margin-right: 10px;
}

.attr-img img {
    width: 25px;
}

.el-slider {
    transform: scale(0.8);
}
</style>