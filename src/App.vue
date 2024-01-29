<template>
    <el-config-provider :locale="settingStore.language">
        <div class="uabs ub ub-ver uof uc-bg" @contextmenu.stop="e => e.preventDefault()">
            <!--B Header-->
            <div id="test-element" class="ub uc-bg no-drag uz2">
                <Header></Header>
            </div>
            <!--E Header-->
            <!--B Content -->
            <div class="ub ub-f1 uof-y-s uof-x-s">
                <router-view></router-view>
            </div>
            <!--E Content -->
            <!--B Footer-->
            <div class="ub uc-bg no-drag uz2">
                <Footer></Footer>
            </div>
            <!--E Footer-->
        </div>
    </el-config-provider>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
</script>

<style scoped></style>
