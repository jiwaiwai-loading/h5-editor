<template>
    <div id="driver-bar" class="ub ub-f1 upad-a04 uc-bg">
        <div class="ub ub-f1 ub-pc">
            <el-button @click="nodeStore.changeStep('back')" :disabled="nodeStore.nodeStepsIdx < 0 || nodeStore.nodeStepsIdx > nodeStore.nodeSteps.length - 1 || nodeStore.nodeSteps.length == 0" :disabled1="nodeStore.nodeSteps.length == 0 || (nodeStore.nodeSteps.length - 1 > 0 && nodeStore.nodeStepsIdx >= nodeStore.nodeSteps.length - 1)" link>
                <el-tooltip effect="dark" :content="settingStore.t('toolBar.back') + ' (Ctrl + Z)'" placement="top-start">
                    <el-icon class="uf-s12">
                        <RefreshLeft />
                    </el-icon>
                </el-tooltip>
            </el-button>

            <el-button @click="nodeStore.changeStep('recover')" :disabled="nodeStore.nodeStepsIdx <= 0" link>
                <el-tooltip effect="dark" :content="settingStore.t('toolBar.recover') + ' (Ctrl + Y)'" placement="top-start">
                    <el-icon class="uf-s12">
                        <RefreshRight />
                    </el-icon>
                </el-tooltip>
            </el-button>

            <el-divider direction="vertical" />

            <el-button @click="nodeStore.addNode({ type: 'text' })" link>
                <el-tooltip effect="dark" :content="settingStore.t('text.add')" placement="top-start">
                    <div class=" uicon-font uf-s15"></div>
                </el-tooltip>
            </el-button>

            <el-button @click="nodeStore.copyNode()" :disabled="!nodeStore.checkedNode.id" link>
                <el-tooltip effect="dark" :content="settingStore.t('toolBar.copy') + ' (Ctrl + C)'" placement="top-start">
                    <el-icon class="uf-s12">
                        <CopyDocument />
                    </el-icon>
                </el-tooltip>
            </el-button>

            <el-button @click="nodeStore.delNode()" :disabled="!nodeStore.checkedNode.id" link>
                <el-tooltip effect="dark" :content="settingStore.t('toolBar.delete') + ' (Delete)'" placement="top-start">
                    <el-icon class="uf-s12">
                        <Delete />
                    </el-icon>
                </el-tooltip>
            </el-button>

            <el-divider direction="vertical" />

            <div class="ub">
                <el-button @click="setScale(scale - 1)" :disabled="scale <= 30" link>
                    <el-icon>
                        <Minus />
                    </el-icon>
                </el-button>
                <div class="ub ub-ac ub-pc uf-s1 upad-rl04">
                    <el-dropdown @command="setScale">
                        <el-button link size="small">{{ scale }}%</el-button>
                        <template #dropdown>
                            <el-dropdown-item v-for="item in scaleSelect" :command="item">{{ item }}%</el-dropdown-item>
                            <el-dropdown-item divided command="default">{{ settingStore.t('toolBar.fitSize') }}</el-dropdown-item>
                        </template>
                    </el-dropdown>
                </div>
                <el-button @click="setScale(scale + 1)" :disabled="scale >= 200" link>
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-button>
            </div>

            <el-divider direction="vertical" />

            <el-dropdown @command="setReferLine">
                <el-button @click="preview" link>
                    <el-tooltip effect="dark" :content="settingStore.t('toolBar.refline')" placement="top-start">
                        <div class=" uicon-refline uf-s1"></div>
                    </el-tooltip>
                </el-button>
                <template #dropdown>
                    <el-dropdown-item command="row">{{ settingStore.t('toolBar.hrl') }}</el-dropdown-item>
                    <el-dropdown-item command="col">{{ settingStore.t('toolBar.vrl') }}</el-dropdown-item>
                    <el-dropdown-item divided command="del">{{ settingStore.t('toolBar.crl') }}</el-dropdown-item>
                </template>
            </el-dropdown>

            <el-divider direction="vertical" />

            <el-button @click="preview" link>
                <el-tooltip effect="dark" :content="settingStore.t('toolBar.preview')" placement="top-start">
                    <el-icon class="uf-s12">
                        <View />
                    </el-icon>
                </el-tooltip>
            </el-button>

            <el-button @click="nodeStore.playAnimate" link>
                <el-tooltip effect="dark" :content="settingStore.t(nodeStore.isAnimate ? 'toolBar.pause' : 'toolBar.play')" placement="top-start">
                    <el-icon class="uf-s12">
                        <VideoPlay v-if="nodeStore.isAnimate" />
                        <VideoPause v-else />
                    </el-icon>
                </el-tooltip>
            </el-button>

            <el-button @click="save(true)" link>
                <el-tooltip effect="dark" :content="settingStore.t('toolBar.save')" placement="top-start">
                    <div class=" uicon-save uf-s12"></div>
                </el-tooltip>
            </el-button>
            
        </div>
        <div class="ub">
            

        </div>
    </div>
</template>

<script setup>
import {
    ref,
} from 'vue';
import { useToolBarStore } from '@/stores/toolbar';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
const toolBarStore = useToolBarStore();
const nodeStore = useNodeStore();
const settingStore = useSettingStore();

const emit = defineEmits(['setScale']);
const props = defineProps({
    scale: {
        type: Number,
        default: 80
    },
});
const scaleSelect = ref([40, 60, 80, 100, 120, 150, 200]);
const setScale = res => {
    emit('setScale', res);
}

const setReferLine = res => {
    toolBarStore.referLineCommand = res;
    setTimeout(() => {
        toolBarStore.referLineCommand = '';
    }, 50);
}

const preview = res => {
    console.log(res)
}

const save = res => {
    nodeStore.save();
}
</script>

<style>
.page-navigator {
    position: absolute;
    right: 20px;
    bottom: 60px;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100px;
    height: 200px;
}
</style>