<template>
    <div v-show="boxSize.width" id="multiple_box" @click.stop.prevent="emit('getMultipleBox')" class="select-box-area" :style="boxSize">
        <SelectBar :show="true" :id="groupId" @zoom="(e, direction) => { emit('zoom', e, direction) }"></SelectBar>
    </div>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import { useNodeStore } from '@/stores/node';
import SelectBar from './SelectBar.vue';
const nodeStore = useNodeStore();
const emit = defineEmits(['getMultipleBox', 'zoom']);

const boxSize = ref({});
const groupId = ref('');
let [minLeft, maxLeft, minTop, maxTop] = [[], [], [], []];
const resetMultipleBox = () => {
    const multipleNode = nodeStore.multipleNode;
    boxSize.value = {};
    [minLeft, maxLeft, minTop, maxTop] = [[], [], [], []];

    for (let id in multipleNode) {
        const currentMinLeft = Math.min(...minLeft);
        const currentMaxLeft = Math.max(...maxLeft);
        const currentMinTop = Math.min(...minTop);
        const currentMaxTop = Math.max(...maxTop);
        let [left, top, leftAddWidth, topAddHeight] = [0, 0, 0, 0];

        try {
            const style = multipleNode[id].style;
            const width = Number(style.width.split('px')[0]);
            let height = 0;
            if (multipleNode[id].type == 'text') {
                const textDom = document.getElementById(id + '_text');
                height = textDom.offsetHeight;
            } else {
                height = Number(style.height.split('px')[0]);
            }
            left = Number(style.left.split('px')[0]);
            top = Number(style.top.split('px')[0]);
            leftAddWidth = left + width;
            topAddHeight = top + height;
        } catch (e) { }

        if (left < currentMinLeft) {
            minLeft.push(left);
        }

        if (top < currentMinTop) {
            minTop.push(top);
        }

        if (leftAddWidth > currentMaxLeft) {
            maxLeft.push(leftAddWidth);
        }

        if (topAddHeight > currentMaxTop) {
            maxTop.push(topAddHeight);
        }

        const boxLeft = Math.min(left, currentMinLeft);
        const boxTop = Math.min(top, currentMinTop);
        const boxWdth = Math.max(leftAddWidth, currentMaxLeft) - boxLeft;
        const boxHeight = Math.max(topAddHeight, currentMaxTop) - boxTop;
        boxSize.value = {
            left: boxLeft + 'px',
            top: boxTop + 'px',
            width: boxWdth + 'px',
            height: boxHeight + 'px'
        }
        if (!groupId.value) {
            groupId.value = multipleNode[id].group;
        }
    }
}

watch(() => nodeStore.multipleNode, async (newVal) => {
    if (!utils.isDefine(newVal)) {
        boxSize.value = {};
        groupId.value = '';
    }
});

watch(() => nodeStore.msgData, async (newVal) => {
    if (newVal.ac == 'changeGroup') {
        groupId.value = newVal.data.groupId;
        if (newVal.data.groupId) {
            resetMultipleBox();
        } else {
            boxSize.value = {};
            nodeStore.cancelSelectNode();
        }
    }
});

onMounted(() => {

})

defineExpose({ resetMultipleBox })
</script>

<style>
.select-box-area {
    position: absolute;
    top: 30px;
    height: 50px;
    width: 200px;
    cursor: move;
    z-index: 9999;
}
</style>