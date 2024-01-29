<template>
    <div class="uabs ub ub-ac ub-pc">
        <div v-for="val,idx in referLine.row" :key="val" @mousedown="moveReferLine($event, 'refer-line-row_' + idx)" :id="'refer-line-row_' + idx" class="ubb uc-border-main row-line"></div>
        <div v-for="val,idx in referLine.col" :key="val" @mousedown="moveReferLine($event, 'refer-line-col_' + idx)" :id="'refer-line-col_' + idx" class="ubr uc-border-main col-line"></div>
    </div>
</template>

<script setup>
import {
    ref,
    watch
} from 'vue';
const props = defineProps({});

import { useToolBarStore } from '@/stores/toolbar';
const toolBarStore = useToolBarStore();

watch(()=>toolBarStore.referLineCommand, (newValue, oldValue)=>{
    setReferLine(newValue);
})

const referLine = ref({
    row: [],
    col: []
});
const setReferLine = res => {
    if (res == 'del') {
        referLine.value = {
            row: [],
            col: []
        }
    } else if(res) {
        referLine.value[res].push(new Date().getTime());
    }
}

const moveReferLine = (ev, id) => {
    let dom = document.getElementById(id);
    let oEvent = ev;
    let distX = oEvent.clientX - dom.offsetLeft;
    let distY = oEvent.clientY - dom.offsetTop;
    let left, top;
    document.onmousemove = function (ev) {
        let oEvent = ev;
        oEvent.preventDefault();
        let x = oEvent.clientX - distX;
        let y = oEvent.clientY - distY;
        if (id.indexOf('refer-line-row') >= 0) {
            dom.style.top = y + 'px';
            top = y;
        } else {
            dom.style.left = x + 'px';
            left = x;
        }
    }
    document.onmouseup = function () {
        dom.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
        let idx = id.split('_')[1];
        if (left < -5 || left > 375) {
            referLine.value.col.splice(idx,1);
        }
        if (top < -5 || top > 755) {
            referLine.value.row.splice(idx,1);
        }
    }
}

</script>

<style>
.row-line {
    position: absolute;
    left: -10000px;
    right: -10000px;
    height: 6px;
    z-index: 2;
    transform: scale(0.5);
    cursor: row-resize;
}

.col-line {
    position: absolute;
    top: -10000px;
    bottom: -10000px;
    width: 6px;
    z-index: 2;
    transform: scale(0.5);
    cursor: col-resize;
}
</style>