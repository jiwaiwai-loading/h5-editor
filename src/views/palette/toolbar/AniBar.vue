<template>
    <div class="ani-area uof-x uof-y-s animate__animated animate__faster" :class="nodeStore.checkedNode.id ? 'animate__slideInRight' : 'animate__slideOutRight'" style="max-width: 320px;">
        <div class="uc-bg-gray ubb ubl uz3 bar-title">{{ settingStore.t('common.ani') }}</div>
        <div id="driver-ani" class="ub ubl ubb uc-bg uradius-bl06 uz2">
            <div v-if="aniIdx >= 0" class="ub ub-f1 ub-ver ubr ">
                <div class="ub ub-pc ubb upad-a06">
                    <div class="ani-setting-title uf-s08">{{ settingStore.t('ani.infinite') }}</div>
                    <el-radio-group v-model="animate.infinite" @change="val => updateAni('animate', 'infinite', val, true)" size="small">
                        <el-radio label="infinite" style="margin-right:10px;">{{ settingStore.t('common.yes') }}</el-radio>
                        <el-radio label="">{{ settingStore.t('common.no') }}</el-radio>
                    </el-radio-group>
                </div>
                <div class="ub ub-pc ubb upad-a06">
                    <div class="ani-setting-title uf-s08">{{ settingStore.t('ani.linear') }}</div>
                    <el-radio-group v-model="animate.linear" @change="val => updateAni('animate', 'linear', val, true)" size="small">
                        <el-radio label="linear" style="margin-right:10px;">{{ settingStore.t('common.yes') }}</el-radio>
                        <el-radio label="">{{ settingStore.t('common.no') }}</el-radio>
                    </el-radio-group>
                </div>
                <div class="ub ub-pc ubb upad-a06">
                    <div class="ani-setting-title uf-s08">{{ settingStore.t('ani.delay') }}</div>
                    <el-select v-model="animate.delay" @change="val => updateAni('animate', 'delay', val, true)" size="small" style="width: 100px;">
                        <el-option v-for="item in delay" :value="item + 's'" :label="item + ' ' + settingStore.t('ani.seconds')"></el-option>
                    </el-select>
                </div>
                <div class="ub ub-pc ubb upad-a06">
                    <div class="ani-setting-title uf-s08">{{ settingStore.t('ani.speed') }}</div>
                    <el-select v-model="animate.speed" @change="val => updateAni('animate', 'speed', val, true)" size="small" style="width: 100px;">
                        <el-option value="" :label="settingStore.t('common.default')"></el-option>
                        <el-option value="fastest" :label="settingStore.t('ani.fastest')"></el-option>
                        <el-option value="faster" :label="settingStore.t('ani.faster')"></el-option>
                        <el-option value="fast" :label="settingStore.t('ani.fast')"></el-option>
                        <el-option value="slow" :label="settingStore.t('ani.slow')"></el-option>
                        <el-option value="slower" :label="settingStore.t('ani.slower')"></el-option>
                        <el-option value="slowest" :label="settingStore.t('ani.slowest')"></el-option>
                    </el-select>
                </div>
                <div class="upad-a08">
                    <el-radio-group v-model="animate.animate" @change="val => updateAni('animate', 'animate', val, true)" class="ub ub-ver" size="small" style="align-items: flex-start;">
                        <el-radio label="empty" style="margin-right:0;"> {{ settingStore.t('common.cancel') }} </el-radio>
                        <el-radio v-for="item, idx in animateList[aniIdx].data" :key="idx" :label="item.value" :disabled="item.value == 'oneByOne' && nodeStore.checkedNode.type != 'text'" style="margin-right:0;">{{ settingStore.language.name == 'zh-cn' ? item.name : item.value }}</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="upad-a08">
                <el-radio-group v-model="aniIdx" class="ub ub-ver" size="small" style="align-items: flex-start;">
                    <el-radio v-for="item, idx in animateList" :key="idx" :label="idx" style="margin-right:0;">{{ settingStore.language.name == 'zh-cn' ? item.name : item.value }}</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div @click.stop="nodeStore.cancelSelectNode" class="uabs uz1"></div>
    </div>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import { animateList } from '@/assets/js/animate.js';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
const nodeStore = useNodeStore();
const aniIdx = ref();
const animateDefault = {
    infinite: '',
    linear: '',
    delay: '0s',
    speed: '',
    animate: ''
}
const delay = ref([]);
const animate = ref(utils.clone(animateDefault));

watch(() => nodeStore.checkedNode, async (newVal) => {
    if (newVal.id) {
        const ani = newVal.animate;
        animate.value = utils.clone(animateDefault);
        aniIdx.value = undefined;
        if (ani && ani.animate) {
            animate.value = Object.assign(utils.clone(animateDefault), ani);
            for (let i = 0; i < animateList.length; i++) {
                for (let j = 0; j < animateList[i].data.length; j++) {
                    if (animateList[i].data[j].value == ani.animate) {
                        aniIdx.value = i;
                        return;
                    }
                }
            }
        }
    }
});

/**
 * 更新动画
 * @param {String} nodeType 节点类型
 * @param {String} aniType 动画类型
 * @param {String} aniValue  动画值
 * @param {Boolean} isCache 是否缓存
 */
const updateAni = (nodeType, aniType, aniValue, isCache) => {
    nodeStore.updateNode({
        key: nodeType,
        value: {
            [aniType]: aniValue
        },
        isCache: isCache
    });
}

const delayValue = () => {
    for (let i = 0; i <= 5; i = i + 0.25) {
        delay.value.push(i);
    }
}

onMounted(() => {
    delayValue();
})

</script>

<style>
.ani-area {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
}

.ani-setting-title {
    width: 45px;

}
</style>