<template>
    <div class="uabs-t ut-c uc-bg-gray bar-title">{{ settingStore.t('common.layer') }}</div>
    <div class="uabs ut-c uof-y-s ubt uc-border-gray node-list" style="top: 30px;">
        <template v-for="item, index in layerList">
            <div v-if="isGroup(item)" :key="'node' + index" :class="nodeStore.multipleNode[item[0].id] && nodeStore.multipleNode[item[0].id].group == item[0].group ? 'uba uc-border-main' : 'ubb'" class="ub">
                <div :data-id="item[0].group" :data-index="index" :data-zindex="item[item.length - 1].style['z-index']" @drop.stop="onDrop" @dragover.stop="onDragOver" class="insert-area" style="display: none;"></div>
                <div :data-id="item[0].group" :data-index="index" :data-zindex="item[0].style['z-index']" @dragstart.stop="onDragStart" class="ub ub-f1 ub-ver group-drag">
                    <div class="ub ub-pc upad-l02 uc-bg-gray">
                        <span @click="groupShow(item[0].group)" class="uf-s08 ubtn">
                            <el-icon v-if="layerGroup[item[0].group] && layerGroup[item[0].group].show === false" class="uc-font-gray2">
                                <Hide />
                            </el-icon>
                            <el-icon v-else class="uc-font-main">
                                <View />
                            </el-icon>
                        </span>
                        <div class="ub ub-f1 uof upad-rl06 uf-bold uf-s08"> {{ settingStore.t("toolBar.group") }} </div>
                        <span @click="groupFold(item[0].group)" class="ubtn">
                            <el-icon v-if="layerGroup[item[0].group] && layerGroup[item[0].group].fold === false">
                                <ArrowUp />
                            </el-icon>
                            <el-icon v-else>
                                <ArrowDown />
                            </el-icon>
                        </span>
                    </div>
                    <div v-show="layerGroup[item[0].group] && layerGroup[item[0].group].fold === false ? false : true">
                        <div class="ub">
                            <div class="ub uc-bg-gray" style="width: 5px;"></div>
                            <div class="ub ub-f1 ub-ver">
                                <div v-for="li, idx in item" :key="'li' + idx" class="node-type" :class="dragNode.groupIndex && dragNode.over === true && dragNode.id == li.id ? 'animate__animated animate__faster animate__zoomIn' : ''">
                                    <div :data-id="li.id" :data-index="index" :data-groupindex="idx" :data-zindex="li.style['z-index']" @drop.stop="onDrop" @dragover.stop="onDragOver" class="insert-area" style="display: none;"></div>
                                    <div draggable="true" class="node-drag" :data-id="li.id" :data-index="index" :data-groupindex="idx" :data-zindex="li.style['z-index']" @dragstart.stop="onDragStart">
                                        <Node :data="li" @show="nodeShow($event, index, idx)"></Node>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="node-type uof" :class="((nodeStore.checkedNode.id == item.id) ? 'uba uc-border-main uradius-a02' : 'uba') + ' ' + (!dragNode.groupIndex && dragNode.over === true && dragNode.id == item.id ? 'animate__animated animate__faster animate__zoomIn' : '')">
                <div @drop.stop="onDrop" @dragover.stop="onDragOver" :data-id="item.id" :data-index="index" :data-zindex="item.style['z-index']" class="insert-area" style="display: none;"></div>
                <div :id="'layer_' + item.id" @dragstart.stop="onDragStart" draggable="true" class="node-drag" :data-id="item.id" :data-index="index" :data-zindex="item.style['z-index']">
                    <Node :data="item" :key="'node' + index" @show="nodeShow($event, index)"></Node>
                </div>
            </div>
        </template>
        <div v-if="layerList.length == 0" class="umar-t2 ut-c uc-font-gray2">
            <img src="@/assets/images/empty.png" style="width: 100px;" />
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import Node from './Node.vue';
import utils from '@/assets/js/utils.js';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';

const nodeStore = useNodeStore();
const settingStore = useSettingStore();

const layerList = ref([]);
const layerGroup = ref({});
const init = () => {
    const currentPageNode = nodeStore.nodes[nodeStore.currentPage];
    let nodeList = [], group = {};
    for (let key in currentPageNode) {
        let target = currentPageNode[key];
        for (let i = 0; i < target.length; i++) {
            target[i]['type'] = key;
            if (target[i].style) {
                let groupKey = target[i].group;
                let zIndex = target[i].style['z-index'];
                if (groupKey) {
                    if (group[groupKey]) {
                        let position = getArrIdx(group[groupKey], zIndex);
                        group[groupKey].splice(position, 0, target[i]);
                    } else {
                        group[groupKey] = [target[i]];
                    }
                } else {
                    let position = getArrIdx(nodeList, zIndex);
                    nodeList.splice(position, 0, target[i]);
                }
            }
        }
    }

    for (let key in group) {
        let zIndex = group[key][0].style['z-index'];
        let position = getArrIdx(nodeList, zIndex, 'group');
        nodeList.splice(position, 0, group[key]);
    }
    layerList.value = nodeList;
    layerGroup.value = group;
}

const getArrIdx = (arr, val) => {
    let position = arr.length;
    for (let i = 0; i < arr.length; i++) {
        if (utils.typeof(arr[i]) == 'array') {
            if (val >= arr[i][0].style['z-index']) {
                return i;
            }
        } else {
            if (val >= arr[i].style['z-index']) {
                return i;
            }
        }
    }
    return Math.max(position, 0);
}

const nodeShow = (res, index, idx) => {
    if (utils.isDefine(idx)) {
        layerList.value[index][idx]['show'] = res;
        let groupShow = res ? true : false;
        for (let i = 0; i < layerList.value[index].length; i++) {
            if (!utils.isDefine(layerList.value[index][i].show) || layerList.value[index][i].show != res) {
                groupShow = true;
                break;
            }
        }

        let group = layerGroup.value[index] || {};
        if (utils.isDefine(group)) {
            layerGroup.value[index]['show'] = groupShow;
        } else {
            group[index] = {
                show: groupShow
            }
        }
    } else {
        layerList.value[index]['show'] = res;
    }
}

const groupShow = (groupId) => {
    let group = layerGroup.value[groupId] || {}, show;
    show = group.show === false ? true : false;
    layerGroup.value[groupId]['show'] = show;
    group.forEach(item => {
        item['show'] = show;
    });
}
const groupFold = (groupId) => {
    let group = layerGroup.value[groupId] || {};
    let fold = group.fold === false ? true : false;
    layerGroup.value[groupId]['fold'] = fold;
}

const dragNode = ref({});
const onDragStart = (ev) => {
    const id = ev.target.dataset.id;
    const index = ev.target.dataset.index;
    const groupIndex = ev.target.dataset.groupindex;
    const zIndex = ev.target.dataset.zindex;
    const clientY = ev.clientY;
    dragNode.value = {
        over: false,
        id: id,
        index: index,
        groupIndex: groupIndex,
        zIndex: zIndex,
        clientY: clientY
    };

    let type = '';
    if (utils.isDefine(groupIndex)) {
        type = 'groupNode';
    } else if (id.indexOf('group') >= 0) {
        type = 'group';
    }

    showInsertArea(id, type);
    ev.target.ondragend = function (e) {
        clearInsertArea();
        ev.target.style.opacity = '1';
    }
    ev.target.style.opacity = '0.15';
}
const insertNodeId = ref('');
const onDragOver = (ev) => {
    ev.preventDefault();
    let target = ev.target;
    let clientY = ev.clientY;
    let direction = dragNode.value.clientY - clientY;
    let nodeId = target.dataset.id;
    let currentIndex = target.dataset.index;
    let groupIndex = target.dataset.groupindex;
    if (utils.isDefine(groupIndex) || utils.isDefine(dragNode.value.groupIndex)) {
        if (dragNode.value.index != currentIndex) {
            clearInsertArea('border');
            return;
        } else {
            if (dragNode.value.id.indexOf('group') >= 0) {
                clearInsertArea('border');
                return;
            } else {
                showLine();
            }
        }
    } else {
        showLine();
    }
    insertNodeId.value = nodeId;
    function showLine() {
        if (insertNodeId.value != nodeId) {
            clearInsertArea('border');
        } else {
            if (direction > 0) {
                //向上
                target.style.borderTop = "2px solid var(--el-color-primary)";
            } else {
                //向下
                target.style.borderBottom = "2px solid var(--el-color-primary)";
            }
        }
    }
}
const onDrop = (ev) => {
    ev.preventDefault(ev);
    clearInsertArea();
    const dom = ev.target;
    const clientY = ev.clientY;
    const direction = dragNode.value.clientY - clientY;
    const currentId = dom.dataset.id;
    const currentZIndex = Number(dom.dataset.zindex);
    const currentIndex = Number(dom.dataset.index);
    const targetIndex = dragNode.value.index;
    let currentGroupIndex = dom.dataset.groupindex;

    if (utils.isDefine(currentGroupIndex) || utils.isDefine(dragNode.value.groupIndex)) {
        //组内
        currentGroupIndex = Number(currentGroupIndex);
        const targetGroupIndex = dragNode.value.groupIndex;
        if (dragNode.value.index == currentIndex) {
            resetZIndex(direction, layerList.value[targetIndex], currentGroupIndex, targetGroupIndex);
        }
    } else {
        resetZIndex(direction, layerList.value, currentIndex, targetIndex);
    }
}

/**
 * 图层z-index设置
 * @param {string} direction 方向
 * @param {object} nodeList 图层节点
 * @param {number} currentIndex 移动目标当前位置
 * @param {number} targetIndex 移动目标之前的位置
 */
const resetZIndex = (direction, nodeList, currentIndex, targetIndex) => {
    const target = nodeList.splice(targetIndex, 1)[0];
    nodeList.splice(currentIndex, 0, target);
    dragNode.value['over'] = true;
    for (let i = 0; i < nodeList.length; i++) {
        if (direction > 0) {
            //向上移
            if (i >= currentIndex && i <= targetIndex) {
                if (i == currentIndex) {
                    //移动目标
                    let zindex = 0;
                    let nextNode = nodeList[i + 1];
                    if (utils.typeof(nodeList[i]) == 'array') {
                        //移动目标是组
                        if (utils.typeof(nextNode) == 'array') {
                            //目标之前原来位置元素是组
                            zindex = nextNode[0].style['z-index'];
                        } else {
                            //目标之前位置原来位置
                            zindex = nextNode.style['z-index'];
                        }
                        //更改目标当前zindex
                        for (let j = 0; j < nodeList[i].length; j++) {
                            nodeList[i][j].style['z-index'] = zindex;
                            zindex--;
                        }
                    } else {
                        //移动目标不是组
                        if (utils.typeof(nextNode) == 'array') {
                            //目标之前原来位置元素是组
                            zindex = nextNode[0].style['z-index'];
                        } else {
                            //目标之前位置原来位置
                            zindex = nextNode.style['z-index'];
                        }
                        nodeList[i].style['z-index'] = zindex;
                    }
                } else {
                    //其它位置
                    if (utils.typeof(nodeList[i]) == 'array') {
                        //组
                        for (let j = 0; j < nodeList[i].length; j++) {
                            nodeList[i][j].style['z-index'] -= 1;
                        }
                    } else {
                        //非组
                        nodeList[i].style['z-index'] -= 1;
                    }
                }
            }
        } else {
            //向下移
            if (i >= targetIndex && i <= currentIndex) {
                if (i == currentIndex) {
                    //移动目标
                    let zindex = 0;
                    let preNode = nodeList[i - 1];
                    if (utils.typeof(nodeList[i]) == 'array') {
                        //移动目标是组
                        if (utils.typeof(preNode) == 'array') {
                            //目标之前原来位置元素是组
                            zindex = preNode[0].style['z-index'];
                        } else {
                            //目标之前位置原来位置
                            zindex = preNode.style['z-index'];
                        }
                        //更改目标当前zindex
                        for (let j = 0; j < nodeList[i].length; j++) {
                            zindex--;
                            nodeList[i][j].style['z-index'] = zindex;
                        }
                    } else {
                        //移动目标不是组
                        if (utils.typeof(preNode) == 'array') {
                            //目标之前原来位置元素是组
                            zindex = preNode[0].style['z-index'];
                        } else {
                            //目标之前位置原来位置
                            zindex = preNode.style['z-index'];
                        }
                        nodeList[i].style['z-index'] = zindex - 1;
                    }
                } else {
                    //其它位置
                    if (utils.typeof(nodeList[i]) == 'array') {
                        //组
                        for (let j = 0; j < nodeList[i].length; j++) {
                            nodeList[i][j].style['z-index'] += 1;
                        }
                    } else {
                        //非组
                        nodeList[i].style['z-index'] += 1;
                    }
                }
            }
        }
    }


}

const showInsertArea = (id, type) => {
    let insertArea = document.getElementsByClassName('insert-area');
    for (let i = 0; i < insertArea.length; i++) {
        let currentId = insertArea[i].dataset.id;
        if (id != currentId) {
            if (type == 'groupNode' && currentId.indexOf('group') >= 0) {

            } else {
                insertArea[i].style.display = 'block';
            }
        }
    }
}
const clearInsertArea = (type) => {
    let insertArea = document.getElementsByClassName('insert-area');
    for (let i = 0; i < insertArea.length; i++) {
        if (type != 'border') {
            insertArea[i].style.display = 'none';
        }
        insertArea[i].style.borderTop = 'unset';
        insertArea[i].style.borderBottom = 'unset';
    }
}

const isGroup = (item) => {
    return utils.typeof(item) == 'array';
}

watch(() => nodeStore.msgData, async (newVal) => {
    if (['addNode', 'delNode', 'copyNode', 'changePage', 'changeStep', 'changeGroup'].indexOf(newVal.ac) >= 0) {
        init();
    } else if (newVal.ac == 'zindex') {
        const checkedDom = document.getElementById('layer_' + nodeStore.checkedNode.id);
        if (checkedDom) {
            const targetIndex = parseInt(checkedDom.dataset.index);
            let currentIndex, direction;
            if (newVal.data.direction == 'up' || newVal.data.direction == 'top') {
                if (targetIndex <= 0) {
                    return;
                }
                direction = 1;
                currentIndex = newVal.data.direction == 'up' ? targetIndex - 1 : 0;
            } else if (newVal.data.direction == 'down' || newVal.data.direction == 'bottom') {
                if (targetIndex >= layerList.value.length - 1) {
                    return;
                }
                direction = -1;
                currentIndex = newVal.data.direction == 'down' ? targetIndex + 1 : layerList.value.length - 1;
            }
            resetZIndex(direction, layerList.value, currentIndex, targetIndex);
        }
    }
});

onMounted(() => {
    init();
})

</script>

<style>
.node-list .node-type {
    position: relative;
    min-height: 30px;
}

.node-list .node-type .node-drag {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: move;
    -webkit-user-drag: element !important;
    user-drag: element !important;
    user-select: none;
}

.node-list .node-type .node-drag:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.node-list .node-type .node-drag-active {
    background-color: rgba(0, 0, 0, 0.1);
}

.group-drag {
    width: 100%;
    cursor: move;
    -webkit-user-drag: element !important;
    user-drag: element !important;
    user-select: none;
}

.insert-area {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
}
</style>