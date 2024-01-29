<template>
    <div class="uabs uof uc-bg">
        <div v-for="item, type in data" :key="'node_' + page + '_view_' + type" :id="'node_' + page + '_view_' + type">
            <template v-if="type == 'text'">
                <div v-for="node in item" v-show="node.show === false ? false : true" :key="node.id" :id="node.id" :style="parseOuterStyle(node, type)" @click.stop.prevent="nodeStore.selectNode(node)">
                    <SelectBar :id="node.id" :show="!disabled && nodeStore.checkedNode.id === node.id" :focus="nodeStore.checkedNode.focus" @zoom="(e, direction) => { zoomDom(e, direction, type, node.id) }">
                        <div class="animate__animated uinner" :class="((nodeStore.isAnimate) ? parseAnimate(node.animate) : '')" :style="parseInnerStyle(node)">
                            <div :id="node.id + '_' + type" :contenteditable="nodeStore.checkedNode.focus" :style="getGradientStyle(node)" :class="nodeStore.checkedNode.focus ? 'uz2' : ''" class="my-text">
                                <template v-if="node.animate && node.animate.animate == 'oneByOne' && !nodeStore.checkedNode.focus">
                                    <span v-for="font, idx in node.content" :key="'span' + idx" :class="nodeStore.isAnimate ? (node.animate && node.animate.animate == 'oneByOne' ? 'animate__animated animate__fadeIn' : '') : ''" :style="getSpanFontAni(text, idx, font)">{{ font }}</span>
                                </template>
                                <template v-else>{{ node.content }}</template>
                            </div>
                        </div>
                    </SelectBar>
                </div>
            </template>
            <template v-else-if="type == 'material' || type == 'background'">
                <div v-for="node in item" v-show="node.show === false ? false : true" :key="node.id" :id="node.id" :style="parseOuterStyle(node, type)" @click.stop.prevent="nodeStore.selectNode(node)">
                    <SelectBar :id="node.id" :show="!disabled && nodeStore.checkedNode.id === node.id" :focus="nodeStore.checkedNode.focus" @zoom="(e, direction) => { zoomDom(e, direction, type, node.id) }">
                        <img :src="node.src" class="animate__animated uinner " :class="((nodeStore.isAnimate) ? parseAnimate(node.animate) : '')" :style="parseInnerStyle(node)">
                    </SelectBar>
                </div>
            </template>
        </div>
        <template v-if="!disabled">
            <MultipleBox ref="multipleBox" @get-multiple-box="editDom('multiple_box', 'multipleBox')" @zoom="(e, direction) => { zoomDom(e, direction, 'multipleBox') }"></MultipleBox>
        </template>
    </div>
    <div id="drag-mask" @drop.stop="nodeStore.dargNodeEnd" @dragover.stop="e => e.preventDefault()" class="uabs uz5" style="display:none; background-color: rgba(200,200,200,0.1);"></div>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import SelectBar from './toolbar/SelectBar.vue';
import MultipleBox from './toolbar/MultipleBox.vue';
import { useNodeStore } from '@/stores/node';
const nodeStore = useNodeStore();
const emit = defineEmits([]);
const props = defineProps({
    page: {
        type: Number,
        default: 0
    },
    data: {
        type: Object,
        default: {}
    },
    disabled: {
        type: Boolean,
        default: false
    },
})


/**
 * 编辑
 * @param { String } id   元素ID
 * @param { String } type 选择类型
 */
const multipleBox = ref();
let dom = undefined, mouseUpTimeBefore = 0, clickCount = 0, multipleNode = {}, domLeft, domTop, oldX, oldY;
const editDom = (id, type) => {
    let distX = 0, distY = 0;
    dom = document.getElementById(id);
    setTimeout(() => {
        oldX = dom.offsetLeft;
        oldY = dom.offsetTop;
    }, 20);
    if (type == 'multipleBox') {
        multipleNode = {};
        for (let id in nodeStore.multipleNode) {
            const targetDom = document.getElementById(id);
            multipleNode[id] = {
                node: nodeStore.multipleNode[id],
                dom: targetDom,
                left: Number(targetDom.style.left.split('px')[0]),
                top: Number(targetDom.style.top.split('px')[0]),
                width: Number(targetDom.style.width.split('px')[0]),
                height: Number(targetDom.style.height.split('px')[0] || targetDom.clientHeight)
            }
        }
    } else if (type == 'text') {
        const text = document.getElementById(id + '_text');
        text.onblur = function (ev) {
            ev.preventDefault();
            text.onblur = null;
            const content = ev.target.innerText;
            if (id == nodeStore.checkedNode.id) {
                if (utils.isDefine(content)) {
                    if (nodeStore.checkedNode.content != content) {
                        nodeStore.updateNode({
                            key: 'content',
                            value: content
                        });
                    }
                } else {
                    text.innerText = nodeStore.checkedNode.content;
                }
            }

            setTimeout(() => {
                nodeStore.checkedNode['focus'] = false;
                clickCount = 0;
            }, 10);
            return;
        }
    }

    dom.onmousedown = function (oEvent) {
        let mouseDownTime = new Date().getTime();
        distX = oEvent.clientX - dom.offsetLeft;
        distY = oEvent.clientY - dom.offsetTop;
        document.onmousemove = function (ev) {
            if (type != 'multipleBox' && (nodeStore.checkedNode.focus || nodeStore.checkedNode.id != dom.id)) {
                return;
            }
            let x = ev.clientX - distX;
            let y = ev.clientY - distY;
            ev.preventDefault();
            moveStart(x, y, type);
        }

        document.onmouseup = function (ev) {
            let mouseUpTime = new Date().getTime();
            let duration = mouseUpTime - mouseDownTime;
            dom.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            if (duration >= 300 && (type == 'multipleBox' || (!nodeStore.checkedNode['focus'] && nodeStore.checkedNode.id == dom.id))) {
                //移动
                mouseUpTime = undefined;
                clickCount = 0;
                moveEnd(type);
            } else {
                //双击编辑文字
                if (mouseUpTime - mouseUpTimeBefore > 300) {
                    clickCount = 0;
                }
                mouseUpTimeBefore = mouseUpTime;
                if (type == 'text') {
                    if (ev.button == 2) {
                        return;
                    }
                    clickCount++;
                    if (clickCount == 2) {
                        clickCount = 0;
                        nodeStore.checkedNode['focus'] = true;
                        document.getElementById(id + '_text').focus();
                    }
                }
            }
        }
    }
}

/**
 * 移动元素
 * @param {number} x - x坐标
 * @param {number} y - 坐标
 * @param {string} type - 选择类型
 */
const moveStart = (x, y, type) => {
    if (x <= -dom.offsetWidth + 20) {
        x = -dom.offsetWidth + 20;
    } else if (x + dom.offsetWidth >= 375 + dom.offsetWidth - 20) {
        x = 375 - 20;
    }
    if (y <= -dom.offsetHeight + 20) {
        y = -dom.offsetHeight + 20;
    } else if (y + dom.offsetHeight >= 750 + dom.offsetHeight - 20) {
        y = 750 - 20;
    }
    dom.style.left = x + 'px';
    dom.style.top = y + 'px';
    domLeft = x;
    domTop = y;

    if (type == 'multipleBox') {
        for (let id in multipleNode) {
            let target = multipleNode[id];
            let newLeft = (target.left - oldX + domLeft) + 'px';
            let newTop = (target.top - oldY + domTop) + 'px';
            target.dom.style.left = newLeft;
            target.dom.style.top = newTop;
            target['newLeft'] = newLeft;
            target['newTop'] = newTop;
        }
    }
}

/**
 * 移动结束
 * @param {string} type - 选择类型
 */
const moveEnd = (type) => {
    if (type == 'multipleBox') {
        for (let id in multipleNode) {
            const target = multipleNode[id];
            nodeStore.updateNode({
                node: target.node,
                key: 'style',
                value: {
                    left: target.newLeft,
                    top: target.newTop
                }
            });
        }
    } else {
        nodeStore.updateNode({
            key: 'style',
            value: {
                left: domLeft + 'px',
                top: domTop + 'px'
            }
        });
    }
}

/**
 * 缩放
 * @param { Document } e 
 * @param { String } direction 
 * @param { String } type 
 * @param { String } id 
 */
const zoomDom = (e, direction, type, id) => {
    let dom, multipleNode = {};
    if (type == 'multipleBox') {
        dom = document.getElementById('multiple_box');
        for (let id in nodeStore.multipleNode) {
            const targetDom = document.getElementById(id);
            const node = nodeStore.multipleNode[id];
            let fontSize = 12;
            if (node.type == 'text') {
                fontSize = Number(node.style['font-size'].split('px')[0]);
            }
            multipleNode[id] = {
                node: node,
                dom: targetDom,
                left: Number(targetDom.style.left.split('px')[0]),
                top: Number(targetDom.style.top.split('px')[0]),
                width: Number(targetDom.style.width.split('px')[0]),
                height: Number(targetDom.style.height.split('px')[0] || targetDom.clientHeight),
                fontSize: fontSize
            }
        }
    } else {
        dom = document.getElementById(id);
    }

    let oldWidth = dom.offsetWidth;
    let oldHeight = dom.offsetHeight;
    let oldX = e.clientX;
    let oldY = e.clientY;
    let oldLeft = dom.offsetLeft;
    let oldTop = dom.offsetTop;
    let width = '',
        height = '',
        minWidth = 20,
        minHeight = 20,
        maxWidth = 1000,
        maxHeight = 2000,
        minLeft = -5,
        minTop = -5,
        left = '',
        top = '',
        rotate = '';
    if (type == 'map' || type == 'form') {
        minWidth = 200;
        minHeight = 200;
    }

    document.onmousemove = function (oEv) {
        let disX = oldLeft + oEv.clientX - oldX;
        let disY = oldTop + oEv.clientY - oldY;
        switch (direction) {
            case 'tl':
                width = oldWidth - (oEv.clientX - oldX);
                height = oldHeight - (oEv.clientX - oldX);
                left = disX;
                top = disY;
                break;
            case 'tr':
                width = oldWidth + (oEv.clientX - oldX);
                height = oldHeight + (oEv.clientX - oldX);
                top = disY;
                break;
            case 'bl':
                width = oldWidth + (oEv.clientY - oldY);
                height = oldHeight + (oEv.clientY - oldY);
                left = disX;
                break;
            case 'br':
                width = oldWidth + (oEv.clientX - oldX);
                height = oldHeight + (oEv.clientX - oldX);
                break;
            case 't':
                height = oldHeight - (oEv.clientY - oldY);
                top = disY;
                break;
            case 'b':
                height = oldHeight + (oEv.clientY - oldY);
                break;
            case 'l':
                width = oldWidth - (oEv.clientX - oldX);
                left = disX;
                break;
            case 'r':
                width = oldWidth + (oEv.clientX - oldX);
                break;
            case 'rotate':
                const cx = oldWidth / 2 + oldLeft, cy = oldHeight / 2 + oldTop;
                const x1 = disX + oldWidth, y1 = disY + oldHeight + 45;
                const deg = parseInt((Math.atan2((y1 - cy), (x1 - cx)) * (180 / Math.PI)) - 90);
                rotate = 'rotate(' + (deg) + 'deg)';
                break;
        }

        if (direction == 'tl' || direction == 'tr' || direction == 'br' || direction == 'bl') {
            if ((oldLeft + width >= maxWidth) || (width <= minWidth)) {
                document.onmousedown = null;
                document.onmousemove = null;
                document.onmouseup = null;
                return;
            }
            if ((oldTop + height >= maxHeight) || (height <= minHeight)) {
                document.onmousedown = null;
                document.onmousemove = null;
                document.onmouseup = null;
                return;
            }
        }

        if (utils.isDefine(width)) {
            if (type == 'text') {
                try {
                    let fontSize = nodeStore.checkedNode.style['font-size'].split('px')[0];
                    if (width < fontSize) {
                        width = fontSize;
                    }
                } catch (e) { }
            } else {
                if (width <= minWidth) {
                    width = minWidth;
                } else if (width > maxWidth) {
                    width = maxWidth;
                }
            }
        }
        if (utils.isDefine(height)) {
            if (height <= minHeight && height <= oldHeight) {
                return;
            } else if (height > maxHeight && height >= oldHeight) {
                return;
            }
        }
        if (utils.isDefine(left)) {
            if (left <= minLeft) {
                left = minLeft;
            } else if (left + width > maxWidth) {
                left = maxWidth - width;
            }
        }
        if (utils.isDefine(top)) {
            if (top <= minTop) {
                top = minTop;
            } else if (top + height > maxHeight) {
                top = maxHeight - height;
            }
        }

        let args = {
            width: width,
            oldWidth: oldWidth,
            height: height,
            oldHeight: oldHeight,
            left: left,
            oldLeft: oldLeft,
            top: top,
            oldTop: oldTop,
            rotate: rotate,
        }
        if (type == 'multipleBox') {
            //多选
            for (let id in multipleNode) {
                if (oldWidth > width && multipleNode[id].width <= minWidth) {
                    //宽度缩小到临界值
                    document.onmousemove = null;
                    return;
                }
                if (oldHeight > height && (multipleNode[id].node.type != 'text' && multipleNode[id].height <= minHeight)) {
                    //高度缩小到临界值
                    document.onmousemove = null;
                    return;
                }
                resetDom(multipleNode[id], args, 'multipleNode');
            }
            resetDom(dom, args, type);
        } else {
            resetDom(dom, args, type, id);
        }
    };

    document.onmouseup = function (ev) {
        ev.preventDefault();
        document.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        if (type == 'multipleBox') {
            //多选
            for (let id in multipleNode) {
                let target = multipleNode[id];
                let attr = {
                    width: target.newWidth ? target.newWidth + 'px' : '',
                    height: target.newHeight ? target.newHeight + 'px' : '',
                    left: target.newLeft ? target.newLeft + 'px' : '',
                    top: target.newTop ? target.newTop + 'px' : '',
                    'font-size': target.newFontSize ? target.newFontSize + 'px' : '',
                    transform: rotate ? rotate : ''
                };
                nodeStore.updateNode({
                    node: target.node,
                    key: 'style',
                    value: attr,
                    isCache: false
                });
            }
        } else {
            let newLeft = left, newTop = top;
            if (utils.isDefine(left)) {
                newLeft = oldLeft - (width - oldWidth);
            }
            if (utils.isDefine(top)) {
                newTop = oldTop - (height - oldHeight);
            }
            let attr = {
                width: width + 'px',
                height: height + 'px',
                left: newLeft + 'px',
                top: newTop + 'px'
            };
            if (utils.isDefine(rotate)) {
                attr['transform'] = rotate;
            }
            if (utils.isDefine(dom.style.fontSize)) {
                attr['font-size'] = dom.style.fontSize;
            }
            nodeStore.updateNode({
                key: 'style',
                value: attr
            });
        }
    };

    function resetDom(target, args, type) {
        let currentDom = target;
        if (type == 'multipleNode') {
            currentDom = target.dom;
        }
        if (utils.isDefine(args.width)) {
            let diff = args.width - args.oldWidth;
            let newWidth = args.width;
            if (type == 'multipleNode') {
                let zoom = args.width / args.oldWidth;
                let newLeft = diff > 0 ? (target.left * zoom - args.oldLeft * (zoom - 1) - (utils.isDefine(args.left) ? diff : 0)) : (target.left * zoom + args.oldLeft * (1 - zoom) - (utils.isDefine(args.left) ? diff : 0));
                newWidth = target.width * zoom;
                target['newWidth'] = Math.round(newWidth);
                target['newLeft'] = Math.round(newLeft);
                target.dom.style.left = target['newLeft'] + 'px';
            }
            currentDom.style.width = newWidth + 'px';
            if (utils.isDefine(args.left) && type != 'multipleNode') {
                currentDom.style.left = (args.oldLeft - diff) + 'px';
            }
        }
        if (utils.isDefine(args.height)) {
            let diff = args.height - args.oldHeight;
            let zoom = args.height / args.oldHeight;
            let newHeight = args.height;
            let targetType = '';
            if (type == 'multipleNode') {
                let newTop = diff > 0 ? (target.top * zoom - args.oldTop * (zoom - 1) - (utils.isDefine(args.top) ? diff : 0)) : (target.top * zoom + args.oldTop * (1 - zoom) - (utils.isDefine(args.top) ? diff : 0));
                targetType = target.node.type;
                newHeight = target.height * zoom;
                target['newHeight'] = Math.round(newHeight);
                target['newTop'] = Math.round(newTop);
                target.dom.style.top = target['newTop'] + 'px';
            }
            if (type == 'text' || targetType == 'text') {
                try {
                    let fontSize = 12;
                    if (type == 'multipleNode') {
                        fontSize = Math.max(target.fontSize * zoom, 12);
                        target['newFontSize'] = Math.round(fontSize);
                    } else {
                        fontSize = Math.max((nodeStore.checkedNode.style['font-size'].split('px')[0]) * zoom, 12);
                    }
                    currentDom.style.fontSize = Math.round(fontSize) + 'px';
                } catch (e) {
                    console.log(currentDom, e)
                }
            } else {
                currentDom.style.height = newHeight + 'px';
                if (utils.isDefine(args.top) && type != 'multipleNode') {
                    currentDom.style.top = (args.oldTop - diff) + 'px';
                }
            }
        }
        if (utils.isDefine(args.rotate)) {
            currentDom.style['transform'] = args.rotate;
        }
    }
}

const specialStyle = ['border-radius', 'border-width', 'border-color', 'border-style', 'box-shadow', 'clip-path', 'mask-image'];
/**
 * 解析外层样式
 * @param { Object } node 
 * @param { String } type 
 */
const parseOuterStyle = (node, type) => {
    const style = node.style;
    let res = '';
    if (utils.isDefine(style)) {
        let exclude = [...specialStyle];
        if (type == 'text') {
            exclude.push('height');
        }
        for (let key in style) {
            if (style[key] && exclude.indexOf(key) < 0) {
                res += parseStyle(key, style[key], style);
            }
        }
    }
    // console.log(node.id)
    return res;
}

/**
 * 解析内层样式
 * @param { Object } node 
 */
const parseInnerStyle = (node) => {
    const style = node.style;
    let res = '';
    if (utils.isDefine(style)) {
        let include = specialStyle;
        for (let key in style) {
            if (style[key] && include.indexOf(key) >= 0) {
                if (key == 'mask-image') {
                    res += parseStyle('-webkit-mask-image', style[key]);
                }
                res += parseStyle(key, style[key], style);
            }
        }
    }
    return res;
}

/**
 * 生成样式
 * @param { String } key 
 * @param { String } value 
 * @param { Object } style 
 */
const parseStyle = (key, value, style) => {
    if (utils.constant.platform == 'mobile') {
        let res = '';
        let templateWidth = 375;
        let templateHight = 750;
        let screenWidth = window.innerWidth || 375;
        let screenHeight = window.innerHeight || 750;
        console.log(screenWidth, screenHeight)
        let x = ['left', 'right', 'width',];
        let y = ['top', 'bottom', 'height'];
        value = value + ''
        if (value.slice(-3) == 'rpx') {
            let rpx = utils.trim(value.split('rpx')[0]);
            res = (key + ':' + (rpx / 2) + 'px;');
        } else if (value.slice(-2) == 'px') {
            let px = parseInt(utils.trim(value.split('px')[0]));
            if (x.indexOf(key) >= 0) {
                px = (screenWidth * px / templateWidth) + 'px;';
            } else if (y.indexOf(key) >= 0) {
                let w1 = style.width;
                let top = style.top;
                if (key == 'height' && utils.isDefine(w1)) {
                    let wpx1 = parseInt(utils.trim(w1.split('px')[0]));
                    if (Math.abs(wpx1 - px) <= 8) {
                        px = (screenWidth * px / templateWidth) + 'px;';
                    } else {
                        let wpx2 = (screenWidth * wpx1) / templateWidth;
                        if (utils.isDefine(top)) {
                            top = parseInt(utils.trim(top.split('px')[0]));
                            if (top + px >= templateHight / 1.7) {
                                px = (screenHeight * px / templateHight) + 'px;';
                            } else {
                                px = (wpx2 * px / wpx1) + 'px;';
                            }
                        } else {
                            px = (screenHeight * px / templateHight) + 'px;';
                        }
                    }
                } else {
                    px = (screenHeight * px / templateHight) + 'px;';
                }
            } else {
                px = px + 'px;'
            }
            res = (key + ':' + px);
        } else if (value.slice(-1) == '%' && key != 'border-radius') {
            let val = utils.trim(value.split('%')[0]);
            res = (key + ':' + ((val / 100) * screenWidth) + 'px;');
        } else {
            res = (key + ':' + value + ';');
        }
        return res;
    } else {
        return key + ':' + value + ';';
    }
}

/**
 * 添加动画样式
 * @param {string} animate 
 */
const parseAnimate = (animate) => {
    if (utils.isDefine(animate)) {
        let res = '';
        if (typeof (animate) == 'object') {
            for (let key in animate) {
                if (key == 'delay') {
                    res += 'animate__delay-' + animate[key].replace('.', '-') + ' ';
                } else {
                    res += 'animate__' + animate[key] + ' ';
                }
            }
            return res;
        } else {
            return animate;
        }
    } else {
        return ' ';
    }
}

/**
 * 文字渐变动画
 * @param {Object} text 
 */
const getGradientStyle = (text) => {
    if (text.gradient === true && text.style) {
        let color1 = text.style.color || "#000000";
        let color2 = text.style.color2 || "#ffffff";
        let color = 'linear-gradient(to right, ' + color2 + ', ' + color1 + ' 25%, ' + color2 + ' 50%, ' + color1 + ' 75%, ' + color2 + ')';
        let style = 'background-clip:text;-webkit-background-clip:text;background-image:-webkit-' + color + ';background-image:' + color + ';-webkit-text-fill-color:transparent;text-fill-color:transparent;-webkit-background-size: 200% 100%;background-size: 200% 100%;-webkit-animation: gradientAnimation 3s infinite linear;animation: gradientAnimation 3s infinite linear;';
        return style;
    }
    return '';
}

watch(() => nodeStore.msgData, async (newVal) => {
    if (newVal.ac == 'selectNode') {
        if (newVal.data.type == 'single') {
            editDom(newVal.data.node.id, newVal.data.node.type);
        } else {
            if (multipleBox.value) {
                multipleBox.value.resetMultipleBox();
            }
            editDom('multiple_box', 'multipleBox');
        }
    } else if (newVal.ac == 'moveDom') {
        if (dom) {
            let checkedType = '';
            domLeft = dom.offsetLeft;
            domTop = dom.offsetTop;
            if (!nodeStore.checkedNode.id) {
                checkedType = 'multipleBox';
            }

            switch (newVal.data.keyCode) {
                case 37:
                    domLeft--;
                    break;
                case 38:
                    domTop--;
                    break;
                case 39:
                    domLeft++;
                    break;
                case 40:
                    domTop++;
                    break;
            }
            if (newVal.data.type == 'start') {
                moveStart(domLeft, domTop, checkedType);
            } else {
                moveEnd(checkedType);
                domLeft = undefined;
                domTop = undefined;
            }
        }
    }
});
onMounted(() => {
});
</script>

<style>
.uinner {
    height: 100%;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    transform: matrix(1, 0, 0, 1, 0, 0);
    word-break: break-all;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-size: contain;
    mask-position: center;
    -webkit-mask-position: center;
    user-select: none;
}

.my-text {
    position: relative;
    border-style: unset;
}

.snowflake {
    position: absolute;
    top: -30px;
}

.snowflake:nth-child(6n) {
    -webkit-filter: blur(1px);
    filter: blur(1px);
}

.snowflake:nth-child(12n) {
    -webkit-filter: blur(3px);
    filter: blur(3px);
}

@keyframes snowfall {
    0% {
        -webkit-transform: translate3d(var(--left-ini), 0, 0) rotate(var(--rotate));
        transform: translate3d(var(--left-ini), 0, 0) rotate(var(--rotate));
    }

    100% {
        -webkit-transform: translate3d(var(--left-end), 110vh, 0);
        transform: translate3d(var(--left-end), 110vh, 0);
    }
}

@keyframes gradientAnimation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -100% 0;
    }
}
</style>