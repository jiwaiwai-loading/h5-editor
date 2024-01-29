<template>
    <div :id="fluidId" v-infinite-scroll="loadMore" :infinite-scroll-distance="20" :infinite-scroll-immediate="false" class="uabs uof-x uof-y-s">
        <div v-if="imgList.length > 0" class="ub ub-f1 upad-rl06">
            <div v-for="i in col" :key="i" class="ub ub-f1 ub-ver" :style="'margin-left:' + (i != 1 ? gutter : 0) + 'px'">
                <el-image v-for="img, idx in imgList[i - 1]" @click="emit('getData', img)" @dragstart="emit('dragstart', img)" @dragend="emit('dragend', img)" :key="idx" :src="img.url || img.thumbnailUrl" loading="lazy" fit="scale-down" class="img-hover uba ushadow" :style="'margin-top:' + gutter + 'px'">
                    <template #error>
                        <el-icon class="ub ub-ac ub-pc ub-fv ub-fh uc-font-gray2 uf-s2" style="height: 50px;">
                            <Picture />
                        </el-icon>
                    </template>
                </el-image>
            </div>
            <div class="uhide">
                <el-image v-for="img, idx in data" :key="idx" :src="img.url || img.thumbnailUrl" @load="load(img)" @error="error(img)" fit="scale-down"></el-image>
            </div>
        </div>
        <el-empty v-if="data.length==0 && isReturn" :image-size="100"></el-empty>
        <div v-else class="ub ub-ac ub-pc upad-t1">
            <el-button v-if="hasMore" type="info" link :loading="!loadOver" @click="loadMore">
                {{ loadOver ? 'more' : 'loading' }}
                <el-icon v-show="loadOver">
                    <ArrowDownBold />
                </el-icon>
            </el-button>
            <el-divider v-else><span class="uf-s06 uc-font-gray1">No more</span></el-divider>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import { ArrowDownBold } from '@element-plus/icons-vue';
const emit = defineEmits(['loadMore', 'getData', 'dragstart']);

const props = defineProps({
    col: {
        type: Number,
        default: 2
    },
    gutter: {
        type: Number,
        default: 10
    },
    data: {
        type: Array,
        default: []
    },
    hasMore: {
        type: Boolean,
        default: false
    },
    isReturn: {
        type: Boolean,
        default: false
    }
});
const fluidId = ref(new Date().getTime());
let colWidth = 0;
let imgTotalHeight = [];
const imgList = ref([]);
let loadCount = 0;
const loadOver = ref(false);
const load = (img) => {
    if (colWidth == 0) {
        const dom = document.getElementById(fluidId.value);
        colWidth = (dom.clientWidth / props.col) - (props.col - 1) * props.gutter;
    }
    const temImg = new Image();
    temImg.src = img.url || img.thumbnailUrl;
    
    temImg.onload = function () {
        const width = temImg.width;
        const height = temImg.height;
        const minTotalHeight = Math.min(...imgTotalHeight);
        const colIdx = imgTotalHeight.indexOf(minTotalHeight);
        img.width = width;
        img.height = height;
        imgTotalHeight[colIdx] += (height * colWidth) / width;
        imgList.value[colIdx].push(img);
        loadCount++
        if (loadCount == props.data.length) {
            loadOver.value = true;
        }
    }
}
const error = (img) => {
    const height = 50;
    const minTotalHeight = Math.min(...imgTotalHeight);
    const colIdx = imgTotalHeight.indexOf(minTotalHeight);
    imgTotalHeight[colIdx] += height;
    imgList.value[colIdx].push(img);
    loadCount++;
    if (loadCount == props.data.length) {
        loadOver.value = true;
    }
}

const loadMore = () => {
    if (props.hasMore) {
        loadOver.value = false;
        emit('loadMore', true);
    }
}

const init = () => {
    loadCount = 0;
    loadOver.value = false;
    imgTotalHeight = [];
    imgList.value = [];
    for (let i = 0; i < props.col; i++) {
        imgTotalHeight.push(0);
        imgList.value.push([]);
    }
}
defineExpose({ init });

onMounted(() => {
    init();
})
</script>

<style>
.fluid-img {
    border-radius: 5px;
    overflow: hidden;
    min-height: 30px;
}
</style>