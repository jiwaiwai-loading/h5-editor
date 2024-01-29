<template>
    <div class="ub ub-f1 ub-ver uof">
        <div class="ub ubb uz5">
            <TopBar :scale="scale" @set-scale="setScacle"></TopBar>
        </div>
        <div class="ub ub-f1">
            <div class="ub uz5">
                <AttrBar></AttrBar>
            </div>
            <div @click.prevent="nodeStore.cancelSelectNode" class="ub ub-f1 uc-bg-gray editor-bg">
                <div id="editor-view" @mousewheel.stop.prevent="onMousewheel" class="uabs ub ub-ac ub-pc">
                    <Phone :size="phoneSize" :scale="transform(scale)"></Phone>
                </div>
            </div>
            <div class="ub uz4">
                <AniBar></AniBar>
            </div>
            <div class="ub uz5">
                <div :class="isCollapse ? 'w0' : 'w250'" class="ub uc-bg ubl utransition">
                    <div id="driver-layer" class="ub ubr" style="width: 100px;">
                        <Layer></Layer>
                    </div>
                    <div id="driver-page" class="ub" style="width: 150px;">
                        <PageBar></PageBar>
                    </div>
                </div>
                <div @click="isCollapse = !isCollapse" class="my-fold uc-bg ubl ubt ubb ubtn ut-c uf-s08">
                    <el-icon v-if="isCollapse">
                        <DArrowLeft />
                    </el-icon>
                    <el-icon v-else>
                        <DArrowRight />
                    </el-icon>
                </div>
            </div>
        </div>
    </div>

    <audio id="musiccontrol" controls loop preload="auto" style="display: none;">
        <source src="" type="audio/mpeg">
        <embed src="">
    </audio>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import Phone from './Phone.vue';
import AttrBar from './toolbar/AttrBar.vue';
import AniBar from './toolbar/AniBar.vue';
import TopBar from './toolbar/TopBar.vue';
import PageBar from './toolbar/PageBar.vue';
import Layer from './toolbar/layer/Index.vue';
import { useNodeStore } from '@/stores/node';

const nodeStore = useNodeStore();
const isCollapse = ref(false)
const phoneSize = ref({
    width: 375,
    height: 750
});
const scale = ref(80);
const onMousewheel = ev => {
    let val = ev.detail || ev.wheelDelta;
    if (val < 0 && scale.value > 30) {
        scale.value -= 1;
    } else if (val > 0 && scale.value < 200) {
        scale.value += 1;
    }
}
const transform = val => {
    if (val >= 30 && val <= 200) {
        return val / 100;
    } else if (val < 30) {
        return 0.3;
    } else if (newVal > 200) {
        return 2;
    }
}
const setScacle = res => {
    if (res == 'default') {
        phoneDefaultScale();
    } else {
        scale.value = res;
    }
}
const phoneDefaultScale = () => {
    const editorPage = document.getElementById('editor-view');
    const editorPageHeight = editorPage.clientHeight || phoneSize.value.height;
    scale.value = parseInt(Math.abs(1 - (phoneSize.value.height - editorPageHeight * 0.8) / phoneSize.value.height) * 100);
}

const watchKeybord = () => {
    window.onkeydown = (e) => {
        const keyCode = e.keyCode;
        //console.log(keyCode)
        if (e.ctrlKey || e.metaKey) {
            if (e.altKey) {
                e.preventDefault();
                switch (keyCode) {
                    case 38:
                        // Ctrl + Alt + ↑ 移至顶层
                        if (nodeStore.checkedNode.id) {
                            nodeStore.changeZIndex('top');
                        }
                        break;
                    case 40:
                        // Ctrl + Alt + ↓ 移至底层
                        if (nodeStore.checkedNode.id) {
                            nodeStore.changeZIndex('bottom');
                        }
                        break;
                }
            } else {
                switch (keyCode) {
                    case 38:
                        e.preventDefault();
                        // Ctrl + ↑ 上移一层
                        if (nodeStore.checkedNode.id) {
                            nodeStore.changeZIndex('up');
                        }
                        break;
                    case 40:
                        e.preventDefault();
                        // Ctrl + ↓ 下移一层
                        if (nodeStore.checkedNode.id) {
                            nodeStore.changeZIndex('down');
                        }
                        break;
                    case 76:
                    case 85:
                        // Ctrl + L 锁定与解除组合
                        e.preventDefault();
                        for (let id in nodeStore.multipleNode) {
                            const groupId = nodeStore.multipleNode[id].group;
                            if (!groupId && keyCode == 76) {
                                nodeStore.lockGroup();
                            } else if (groupId && keyCode == 85) {
                                nodeStore.lockGroup(groupId);
                            }
                            break;
                        }
                        break;
                    case 83:
                        // Ctrl + S 保存
                        e.preventDefault();
                        nodeStore.save();
                        break;
                    case 86:
                        // Ctrl + V 粘贴
                        break;
                    case 89:
                        // Ctrl + Y 恢复
                        e.preventDefault();
                        nodeStore.changeStep('recover')
                        break;
                    case 90:
                        // Ctrl + Z 撤销
                        e.preventDefault();
                        nodeStore.changeStep('back')
                        break;
                }
            }
            nodeStore.lockCtrl = true;
        } else {
            switch (keyCode) {
                case 37:
                case 38:
                case 39:
                case 40:
                    if (nodeStore.checkedNode.id || utils.getJsonLength(nodeStore.multipleNode) > 0) {
                        nodeStore.sendMsg('moveDom', {
                            type: 'start',
                            keyCode: keyCode
                        });
                    }
                    break;
                case 46:
                    //删除
                    if (nodeStore.checkedNode.id) {
                        nodeStore.delNode();
                    }
                    break;
            }
        }
    }

    window.onkeyup = (e) => {
        const keyCode = e.keyCode;
        switch (keyCode) {
            case 17:
                nodeStore.lockCtrl = false;
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                if (nodeStore.checkedNode.id || utils.getJsonLength(nodeStore.multipleNode) > 0) {
                    nodeStore.sendMsg('moveDom', {
                        type: 'end',
                        keyCode: keyCode
                    });
                }
                break;
        }
    }
}

onMounted(() => {
    phoneDefaultScale();
    watchKeybord();
});
</script>

<style>
.editor-bg {
    background-image:
        linear-gradient(45deg, rgba(100, 100, 100, 0.1) 25%, transparent 0, transparent 75%, rgba(100, 100, 100, 0.1) 0),
        linear-gradient(45deg, rgba(100, 100, 100, 0.1) 25%, transparent 0, transparent 75%, rgba(100, 100, 100, 0.1) 0);
    background-position: 0 0, 10px 10px;
    background-size: 20px 20px;
}

.my-fold {
    position: absolute;
    top: 50%;
    left: -10px;
    width: 10px;
    height: 50px;
    line-height: 50px;
    margin-top: -25px;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    color: #666;
    z-index: 99;
}

.bar-title {
    height: 30px;
    line-height: 30px;
    letter-spacing: 3px;
    text-align: center;
    top: 0;
    position: sticky;
}

.w250 {
    width: 250px;
}

.w0 {
    width: 0px;
}
</style>