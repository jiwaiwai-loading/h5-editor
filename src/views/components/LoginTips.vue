<template>
    <div v-if="!userInfo.token" class="ub ub-ac ub-pc ub-ver upad-a1" style="margin-top: 100px;">
        <img src="@/assets/images/noauth.png" style="width: 150px;" />
        <div class="uf-s1 uc-font-gray1 ut-c"> {{ settingStore.t('user.logged') }}</div>
        <div class="umar-t2">
            <el-button @click="loginCom.login({ module: 'ledger' })" :icon="User" type="primary" plain size="small">{{ settingStore.t('user.login') }}</el-button>
        </div>
    </div>
    <Login ref="loginCom"></Login>
</template>

<script setup>
import {
    ref,
    watch,
    onMounted
} from 'vue';
import Login from '@/components/Login.vue';
import { useUserStore } from '@/stores/user';
import { useSettingStore } from '@/stores/setting';
import { User } from '@element-plus/icons-vue';
const emit = defineEmits(['login', 'logout']);
const userStore = useUserStore();
const userInfo = ref(userStore.user);
const settingStore = useSettingStore();
const loginCom = ref();

watch(() => userStore.user, async (user) => {
    if (user && user.token) {
        userInfo.value = user;
        emit('login', user);
    } else {
        userInfo.value = {};
        emit('logout', {});
    }
});

onMounted(() => {
    if (userInfo.value.token) {
        emit('login', userInfo.value);
    } else {
        emit('logout', {});
    }
})

</script>

<style></style>