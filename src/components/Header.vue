<template>
    <div class="ub ub-f1 ub-pc upad-a08 ubb">
        <img src="/logo.png" class="uradius-a03" style="width: 45px; height: 45px;">
        <div class="ub ub-f1 ub-ac ub-ver umar-l06">
            <div class="uf-s12 uf-bold">{{ settingStore.t('common.appName') }}</div>
            <div @click="save" class="uf-s08 uc-font-gray1">{{ settingStore.t('common.appDesc') }}</div>
        </div>
        <span id="driver-theme">
            <el-switch  v-model="settingStore.theme" @change="settingStore.switchTheme" inline-prompt :active-icon="Moon" active-value="dark" :inactive-icon="Sunny" inactive-value="light" size="small" width="35px" style="--el-switch-on-color: var(--el-border-color-light); --el-switch-off-color:var(--el-overlay-color-lighter);" />
        </span>
        <el-dropdown @command="settingStore.switchLanguage" class="umar-rl12">
            <svg id="driver-lang" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em" data-v-12008bb2="">
                <path fill="currentColor" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"></path>
            </svg>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item :disabled="settingStore.language.name=='zh-cn'" command="zh-cn">简体中文</el-dropdown-item>
                    <el-dropdown-item :disabled="settingStore.language.name=='en'" command="en">English</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <div id="driver-login" @click="changeLogin" slot="reference" class="ub ub-ac ub-pc ubtn">
            <el-avatar :src="userInfo.avatar" size="small">
                <el-icon class="uf-s1">
                    <User></User>
                </el-icon>
            </el-avatar>
            <span class="umar-l06 uf-s1">{{ userInfo.username ? userInfo.username : settingStore.t('user.login') }}</span>
        </div>
    </div>
    <Login ref="loginComp"></Login>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import Login from '@/components/Login.vue';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
const userStore = useUserStore();
const userInfo = ref(userStore.user);
userStore.$subscribe((mutation, state) => {
    if (state.user) {
        userInfo.value = state.user;
    }
});

const loginComp = ref();
const changeLogin = function () {
    if (utils.isDefine(userInfo.value)) {
        ElMessageBox.confirm(
            settingStore.t('user.quit'),
            settingStore.t('user.logout'),
            {
                type: 'warning',
            }).then(() => {
                userStore.user = {};
                utils.setUser();
            }).catch(() => { })
    } else {
        loginComp.value.login({ module: 'ledger' });
    }
};


onMounted(() => {

});
</script>

<style scoped></style>