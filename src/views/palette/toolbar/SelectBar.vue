<template>
    <el-popover :visible="popoverVisible" trigger-="contextmenu" popper-style="padding:0;" :offset="offset" @before-enter="setOffset">
        <template #reference>
            <div v-show="show" @contextmenu.stop="showPopover" @click="popoverVisible = false;" :class="focus ? '' : 'uz1'" class="editor-bar editor-bar-active">
                <div @mousedown.stop.prevent="zoom($event, 'r')" class="editor-bar-v uz5" style="right: -6px;"></div>
                <div @mousedown.stop.prevent="zoom($event, 'l')" class="editor-bar-v uz5" style="left: -6px;"></div>
                <div @mousedown.stop.prevent="zoom($event, 't')" class="editor-bar-h uz5" style="top: -6px;"></div>
                <div @mousedown.stop.prevent="zoom($event, 'b')" class="editor-bar-h uz5" style="bottom: -6px;"></div>
                <div @mousedown.stop.prevent="zoom($event, 'br')" class="editor-bar-br uz5"></div>
                <div @mousedown.stop.prevent="zoom($event, 'bl')" class="editor-bar-bl uz5"></div>
                <div @mousedown.stop.prevent="zoom($event, 'tr')" class="editor-bar-tr uz5"></div>
                <div @mousedown.stop.prevent="zoom($event, 'tl')" class="editor-bar-tl uz5"></div>
                <div @mousedown.stop.prevent="zoom($event, 'rotate')" class="editor-refresh uz5">
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </div>
            </div>
        </template>
        <div v-if="nodeStore.checkedNode.id" class="ub ub-ver uf-s08 uc-font-gray">
            <el-link @click.stop="nodeStore.changeZIndex('up')" :disabled="nodeStore.checkedNode.style['z-index'] >= Math.max(...nodeStore.zIndex)" :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.up') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+↑</div>
            </el-link>
            <el-link @click.stop="nodeStore.changeZIndex('down')" :disabled="nodeStore.checkedNode.style['z-index'] <= Math.min(...nodeStore.zIndex)" :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.down') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+↓</div>
            </el-link>
            <el-link @click.stop="nodeStore.changeZIndex('top')" :disabled="nodeStore.checkedNode.style['z-index'] >= Math.max(...nodeStore.zIndex)" :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.top') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+Alt+↑</div>
            </el-link>
            <el-link @click.stop="nodeStore.changeZIndex('bottom')" :disabled="nodeStore.checkedNode.style['z-index'] <= Math.min(...nodeStore.zIndex)" :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.bottom') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+Alt+↓</div>
            </el-link>
            <el-link v-if="nodeStore.checkedNode.type == 'material'" @click.stop="editCurrentNode('replace')" :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.replaceImage') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+Alt+R</div>
            </el-link>
            <el-link v-if="nodeStore.checkedNode.type == 'material'" @click.stop="editCurrentNode('edit')" :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.editImage') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+Alt+E</div>
            </el-link>
            <el-link :underline="false" class="uf-s1 upad-a06 ubb">
                <div class="ub ub-f1">{{ settingStore.t('toolBar.delNode') }}</div>
                <div class="popover-tips uc-font-gray3">Delete</div>
            </el-link>
        </div>
        <div v-else-if="Object.keys(nodeStore.multipleNode).length > 1" class="ub ub-ver uf-s08 uc-font-gray">
            <el-link @click.stop="lockGroup" :underline="false" class="uf-s1 upad-a06">
                <div class="ub ub-f1">{{ settingStore.t(id ? 'common.unlock' : 'common.lock') }}{{ settingStore.t('common.layer') }}</div>
                <div class="popover-tips uc-font-gray3">Ctrl+{{ id ? 'U' : 'L' }}</div>
            </el-link>
        </div>
    </el-popover>
    <slot></slot>
    <div v-show="!focus" :class="{ 'editor-bar-selected': nodeStore.multipleNode[id], 'show-editor-bar': show }" class="editor-bar"></div>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
const nodeStore = useNodeStore();
const settingStore = useSettingStore();

const emit = defineEmits(['zoom']);
const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    show: {
        type: Boolean,
        default: false
    },
    focus: {
        type: Boolean,
        default: false
    }
});

const popoverVisible = ref(false);
const offset = ref(-10);
const setOffset = () => {
    const barHeight = document.getElementsByClassName('show-editor-bar')[0].offsetHeight;
    offset.value = -(barHeight / 2) || -10;
}
const showPopover = (e) => {
    e.preventDefault();
    popoverVisible.value = !popoverVisible.value;
}

const editCurrentNode = () => {

}
const lockGroup = () => {
    nodeStore.lockGroup(props.id);
    popoverVisible.value = false;
}

/**
 * 缩放
 * @param { Document } e 
 * @param { String } direction 
 */
const zoom = (e, direction) => {
    emit('zoom', e, direction);
}

watch(() => nodeStore.checkedNode, newVal => {
    popoverVisible.value = false;
})

onMounted(() => {

})

</script>

<style>
.editor-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.editor-bar:hover,
.editor-bar-selected {
    border: 1px solid #f5afaf;
    border-radius: 3px;
}

.editor-bar-active {
    cursor: move;
    border: 2px solid red !important;
}

.editor-bar-v,
.editor-bar-h {
    position: absolute;
    background-color: aliceblue;
    border: 1px solid #aaaaaa;
    border-radius: 3px;
}

.editor-bar-v {
    width: 8px;
    height: 40%;
    top: 30%;
    cursor: e-resize;
}

.editor-bar-h {
    width: 40%;
    height: 8px;
    left: 30%;
    cursor: s-resize;
}

.editor-bar-br,
.editor-bar-bl,
.editor-bar-tr,
.editor-bar-tl {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    background-color: aliceblue;
    border: 1px solid #aaaaaa;
}

.editor-bar-br {
    right: -8px;
    bottom: -8px;
    cursor: nw-resize;
}

.editor-bar-bl {
    left: -8px;
    bottom: -8px;
    cursor: ne-resize;
}

.editor-bar-tr {
    right: -8px;
    top: -8px;
    cursor: sw-resize;
}

.editor-bar-tl {
    left: -8px;
    top: -8px;
    cursor: nw-resize;
}

.editor-refresh {
    position: absolute;
    bottom: -45px;
    left: 50%;
    margin-left: -10px;
    text-align: center;
    font-size: 16px;
    width: 25px;
    height: 25px;
    line-height: 28px;
    border-radius: 25px;
    background-color: aliceblue;
    border: 1px solid #aaaaaa;
    cursor: grab;
}

.popover-tips {
    text-align: right;
}

.el-link__inner {
    flex: 1;
}
</style>