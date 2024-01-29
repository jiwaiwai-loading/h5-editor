<template>
    <el-popover :visible="visible" :width="250" @hide="parseBGColor">
        <template #reference>
            <div @click="visible = !visible" class="el-color-picker el-tooltip__trigger el-tooltip__trigger ubtn" role="button" aria-label="el.colorpicker.defaultLabel" aria-description="el.colorpicker.description" tabindex="0" id="el-id-9970-62"><!--v-if-->
                <div class="el-color-picker__trigger">
                    <span class="el-color-picker__color is-alpha" :style="'background:' + background"></span>
                </div>
                <div class="uabs ub ub-ac ub-pc">
                    <el-icon v-if="background" class="uc-font-white">
                        <ArrowDown />
                    </el-icon>
                    <el-icon v-else class="uc-font-gray2">
                        <Close />
                    </el-icon>
                </div>
            </div>
        </template>
        <div class="ub ub-ver">
            <div class="ub">
                <div :style="'background:' + background" class="uc-bg-gray uba uc-border-gray upad-rl12 ub ub-ac ub-pc uc-font-gray3">preview</div>
                <div class="ub ub-f1 ub-ver umar-l1">
                    <div v-for="color, idx in bgColor" :key="idx" class="ub ub-pc umar-tb06">
                        <el-color-picker v-model="color.value" show-alpha @change="updateBGColor"></el-color-picker>
                        <div class="ub ub-f1 ub-ac">
                            <div @click="setAngle($event, idx)" class="circle-slider ub ub-ac ub-pc">
                                <div @click.stop="" class="circle-slider-bar ub ub-pe" :style="'transform:rotate(' + color.deg + 'deg)'">
                                    <div class="circle-slider-bar-point"></div>
                                </div>
                                <div @click.stop="" class="circle-slider-deg uabs ub ub-ac ub-pc uc-font-gray1">
                                    <div :contenteditable="true" @input="inputDeg($event, idx)">{{ color.deg }}</div>
                                    <span>°</span>
                                </div>
                            </div>
                        </div>
                        <el-button @click="delBGColor(idx)" type="danger" :icon="Delete" plain circle size="small" />
                    </div>
                    <el-button @click="addBGColor" :icon="Plus">{{ settingStore.concatLang(['common.add', 'common.color']) }}</el-button>
                </div>
            </div>
            <div class="ub ub-ae umar-t12">
                <el-button @click="cancel" text plain size="small">{{ settingStore.t('common.cancel') }}</el-button>
                <el-button @click="change" plain size="small">{{ settingStore.t('common.ok') }}</el-button>
            </div>
        </div>
    </el-popover>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import { Delete, Plus } from '@element-plus/icons-vue';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
const emit = defineEmits(['change', 'cancel', 'update:modelValue']);
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
});
const visible = ref(false);
const background = ref('');
const bgColor = ref([]);
const addBGColor = () => {
    if (bgColor.value.length < 5) {
        bgColor.value.push({
            value: 'rgba(' + utils.randomNum(0, 255) + ',' + utils.randomNum(0, 255) + ',' + utils.randomNum(0, 255) + ',0.8)',
            deg: utils.randomNum(0, 359)
        });
        updateBGColor();
    } else {
        ElMessage.warning(settingStore.t('common.limitUp'));
    }
}
const delBGColor = (idx) => {
    bgColor.value.splice(idx, 1);
    updateBGColor();
}
const updateBGColor = () => {
    if (bgColor.value.length == 0) {
        background.value = null;
    } else if (bgColor.value.length == 1) {
        background.value = bgColor.value[0].value;
    } else {
        let bg = '';
        for (let i = 0; i < bgColor.value.length; i++) {
            let currentColor = bgColor.value[i], beginColor, endColor;
            if (currentColor.value) {
                let arr = currentColor.value.split(',');
                beginColor = currentColor.value;
                if (arr[3].trim() == '1)') {
                    arr[3] = '0.8)';
                    beginColor = arr.join(',');

                }
                arr[3] = '0)';
                endColor = arr.join(',');
                bg += 'linear-gradient(' + currentColor.deg + 'deg,' + beginColor + ',' + endColor + '),';
            }
        }
        background.value = utils.trim(bg, ',');
    }
}

const setAngle = (e, idx) => {
    const angle = getAngle(15, 15, e.offsetX, e.offsetY);
    bgColor.value[idx].deg = parseInt(angle);
    updateBGColor();
}

const getAngle = (cx, cy, x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI - 90;
    if (angleDeg < 0) {
        angleDeg += 360;
    }
    return angleDeg;
}

const inputDeg = (e, idx) => {
    let deg = e.target.innerText;
    let newDeg = deg.replace(/[^\d]/g, '');
    if (newDeg > 365) {
        newDeg = 365;
    } else if (newDeg < 0) {
        newDeg = 0;
    }
    e.target.innerText = newDeg;
    bgColor.value[idx].deg = newDeg;
    updateBGColor();
}

const parseBGColor = () => {
    const deg = /\d+(?=deg)/gi;
    const rgba = /rgba*\(\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*\d*\.*[1-9]+)*\)/gi;
    const resDeg = props.modelValue.match(deg) || [];
    const resRgba = props.modelValue.match(rgba) || [];
    bgColor.value = [];
    for (let i = 0; i < resRgba.length; i++) {
        bgColor.value.push({
            value: resRgba[i],
            deg: resDeg[i] || 0
        })
    }
    updateBGColor()
}

const cancel = () => {
    visible.value = false;
    parseBGColor();
    emit('cancel', 'cancel');
}
const change = () => {
    visible.value = false;
    emit('change', background.value);
    emit('update:modelValue', background.value);
}

watch(() => props.modelValue, (newVal, oldVal) => {
    if (newVal) {
        parseBGColor();
    } else {
        bgColor.value = [];
        background.value = '';
        visible.value = false;
    }
}, { immediate: true });

defineExpose({});

onMounted(() => {

})
</script>

<style>
.gradient-btn {
    width: 25px;
    height: 25px;
    border-radius: 3px;
}

.circle-slider {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #aaa;
}

.circle-slider-bar {
    width: 5px;
    height: 25px;
}

.circle-slider-bar-point {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #555;
}

.circle-slider-deg {
    font-size: 12px;
    transform: scale(0.7);
}
</style>