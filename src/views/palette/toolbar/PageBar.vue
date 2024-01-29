<template>
    <div class="uabs-t ut-c uc-bg-gray bar-title">{{ settingStore.t('common.page') }}</div>
    <div class="uabs ubt uc-border-gray ut-c uof-y-s" style="top: 30px;">
        <div v-for="item, index in nodeStore.nodes" :key="index" class="uabs" :style="'top:' + ((index * 240) + 10) + 'px;'" style="width: 375px; height: 750px; margin-left:20px; transform-origin: left top; transform: scale(0.3);">
            <div @click="nodeStore.currentPage = index" :class="nodeStore.currentPage == index ? ' uba2 uc-border-main' : 'uba2 uc-border-gray'" class="uabs uz2 page-mask uradius-a12">
                <div class="uabs uof page-mask-btn animate__animated anumate__faster animate__fadeIn">
                    <div class="uabs-l ub ub-ver animate__animated anumate__faster animate__fadeInLeft">
                        <el-button v-if="index > 0" @click.slef.stop="nodeStore.movePage(index, 'up')" type="primary" :icon="ArrowUpBold" plain circle :title="settingStore.t('common.up')" class="mask-btn" />
                        <el-button v-if="index < nodeStore.nodes.length - 1" @click.slef.stop="nodeStore.movePage(index, 'down')" type="primary" :icon="ArrowDownBold" :title="settingStore.t('common.down')" plain circle class="mask-btn" />
                        <el-button @click.slef.stop="nodeStore.copyPage(index)" type="primary" :icon="DocumentCopy" plain circle :title="settingStore.t('common.copy')" class="mask-btn" />
                    </div>
                    <div class="uabs-r animate__animated anumate__faster animate__fadeInRight">
                        <el-button @click.slef.stop="nodeStore.delPage(index)" type="danger" :icon="Delete" plain circle :title="settingStore.t('common.del')" class="mask-btn" />
                    </div>
                </div>
            </div>
            <div class="uabs uc-bg-gray uz1 page-list">
                <Panel :data="item" :page="index" :disabled="true"></Panel>
                <div class="uabs-b uc-font-white ub ub-ac ub-pc " style="width: 60px; height: 60px;border-top-right-radius:50%; font-size: 40px; background-color: rgba(0,0,0,0.3);">{{ index + 1 }}</div>
            </div>
        </div>
        <el-button @click="nodeStore.addPage" type="primary" :icon="Plus" plain round :style="'margin-top:' + (nodeStore.nodes.length * 240 + 10) + 'px;margin-bottom:20px;'">{{ settingStore.concatLang(['common.add', 'common.page']) }}</el-button>
    </div>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import { ArrowUpBold, ArrowDownBold, DocumentCopy, Delete, Plus } from '@element-plus/icons-vue';
import Panel from '../Panel.vue';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
const nodeStore = useNodeStore();
const settingStore = useSettingStore();
</script>

<style>
.page-mask:hover .page-mask-btn {
    display: block;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
}

.page-mask-btn {
    display: none;
}

.mask-btn {
    transform: scale(1.5);
    margin-left: 30px !important;
    margin-right: 30px !important;
    margin-top: 30px;
}
</style>