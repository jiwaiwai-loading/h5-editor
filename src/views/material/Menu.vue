<template>
    <div id="driver-menu" class="ub ub-ver uc-bg-gray uof-y-s no-drag ">
        <div v-for="item, idx in menu" :key="idx" :id="'driver-menu' + item.type" @click="changeMenu(item)" :class="menuType == item.type ? 'uc-bg uc-font-main' : 'ubr'" class="ub ub-ver ub-pc ubtn upad-tb1">
            <div :class="menuType == item.type ? 'uc-bg-main' : 'uc-bg-dark'" class="ub ub-ac ub-pc menu-icon uradius-a03 uc-font-white">
                <el-icon class="uf-s15">
                    <component :is="item.icon"></component>
                </el-icon>
            </div>
            <div class="uf-s08 umar-t04 umw5 ut-c">{{ settingStore.t(item.title) }}</div>
        </div>
    </div>
    <div id="driver-menuContent" class="ub ub-ver uc-bg uof-y-s" style="width: 250px;">
        <div v-show="menuType == 'my'" class="no-drag">
            <Template></Template>
        </div>
        <div v-show="menuType == 'template'" class="ub ub-f1 ub-ver">
            <Union :data="material.template && material.template.data" :type="menuType"></Union>
        </div>
        <div v-show="menuType == 'material'" class="ub ub-f1 ub-ver">
            <Union :data="material.material && material.material.data" :type="menuType"></Union>
        </div>
        <div v-show="menuType == 'background'" class="ub ub-f1 ub-ver">
            <Union :data="material.background && material.background.data" :type="menuType"></Union>
        </div>
        <div v-show="menuType == 'music'" class="ub ub-f1 ub-ver">
            <Union :data="material.music && material.music.data" :type="menuType"></Union>
        </div>
        <div v-show="!['my', 'template', 'material', 'background', 'music'].includes(menuType)" class="ub ub-f1 ub-ac ub-pc">
            <el-empty />
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import Template from '../my/Template.vue';
import Union from './Union.vue';
import { useMenuStore } from '@/stores/menu';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
const menuStore = useMenuStore();
const material = ref(menuStore.material);

const menuType = ref('my');
const menu = ref([{
    title: 'user.my',
    icon: 'CopyDocument',
    type: 'my'
}, {
    title: 'menu.template',
    icon: 'Star',
    type: 'template',
    isMaterial: true
}, {
    title: 'menu.material',
    icon: 'MoonNight',
    type: 'material',
    isMaterial: true
}, {
    title: 'menu.background',
    icon: 'Picture',
    type: 'background',
    isMaterial: true
}, {
    title: 'menu.music',
    icon: 'Headset',
    type: 'music',
    isMaterial: true
}, {
    title: 'menu.vfx',
    icon: 'MagicStick',
    type: 'effects'
}, {
    title: 'menu.map',
    icon: 'LocationInformation',
    type: 'map'
}, {
    title: 'menu.form',
    icon: 'Tickets',
    type: 'form'
}, {
    title: 'menu.upload',
    icon: 'Upload',
    type: 'upload'
}]);

const changeMenu = async function (item) {
    menuType.value = item.type;
    await menuStore.getMaterialUnion(item);
    material.value[item.type] = menuStore.material[item.type];
}

onMounted(() => {

});
</script>

<style>
.menu-icon {
    width: 35px;
    height: 35px;
}

.material-search {
    position: -webkit-sticky;
    position: sticky;
    top: 0px;
    z-index: 3;
    background-color: var(--el-bg-color);
}
</style>