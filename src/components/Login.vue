<template>
  <el-dialog v-model="data.loginVisible" key="login-dialog" :title="settingStore.t('user.login')" draggable :close-on-click-modal="true" :append-to-body="true" width="310px">
    <div v-if="data.env == 'mock'" class="ub ub-ac ub-pc">
      <el-button @click="login({ module: 'ledger' })" type="primary">{{ settingStore.t('user.login') }} - test</el-button>
    </div>
    <div v-else class="ub ub-ac ub-pc ub-ver">
      <div class="ub ub-ac ub-pc ub-ver" style="height: 200px;width: 200px;">
        <el-image :src="data.qrcode" style="height: 200px;width: 200px;" />
        <div v-if="data.loginStatus > 0" class="uabs ub ub-ac ub-pc">
          <div class="ub ub-ac ub-pc ubtn" style="height: 30px; width: 30px; border-radius: 100%; background-color: white;">
            <el-icon v-if="data.loginStatus == 1" class="uf-s2 uc-font-success">
              <Check />
            </el-icon>
            <el-icon v-else-if="data.loginStatus == 2" @click="data.requestCount = 0; data.loginStatus = ''" class="uf-s2 uc-font-warning">
              <RefreshLeft />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="umar-t2" style="width: 200px;">
        <span v-if="data.loginStatus == 2">二维码已过期，请点击刷新</span>
        <span v-else>
          <span>打开小程序 </span>
          <el-popover placement="top" width="210px" trigger="hover">
            <div>
              <img src="@/assets/images/ledger.jpg" style="height: 180px;width: 180px;">
              <p class="ut-c uf-s06">微信扫一扫打开小程序</p>
            </div>
            <template #reference>
              <el-link slot="reference" type="primary">往来礼记</el-link>
            </template>
          </el-popover>
          <span> ，扫上面二维码登录</span></span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  watch
} from 'vue';
import { myLogin } from '@/api/my.js';
import utils from '@/assets/js/utils.js';
import QRCode from 'qrcode';
import { useUserStore } from '@/stores/user';
import { useSettingStore } from '@/stores/setting';
const userStore = useUserStore();
const settingStore = useSettingStore();

const data = ref({
  loginVisible: false,
  qrcode: '',
  loginStatus: '',
  requestCount: 0,
  env: import.meta.env.MODE
});
const tryCount = 50;
let interval = null;

const login = function (params) {
  switch (params.module) {
    case 'system':
      cmsLogin(params);
      break;
    case 'ledger':
      miniprogramLogin(params);
      break;
  }
};

const cmsLogin = function (params) {
  if (data.value.requestCount < tryCount) {
    data.value.requestCount += 1;
    myLogin(params.module, {
      code: data.value.code,
      id: params && params.id,
      token: params && params.token
    }).then(res => {
      if (res.code == 0) {
        if (res.data) {
          userStore.user = res.data;
          data.value.loginStatus = 1;
          data.value.loginVisible = false;
          utils.setUser(res.data);
        }
      } else {
        ElMessage.error(res.msg);
      }
    }).catch(err => {
      console.log(err)
      ElMessage.error('系统错误');
    });
  } else {
    data.value.loginStatus = 2;
  }
}

const miniprogramLogin = function (params) {
  data.value.loginVisible = true;
  data.value.loginStatus = '';
  setTimeout(() => {
    createQRCode();
  }, 300);

  interval = setInterval(() => {
    cmsLogin(params);
  }, 3000);
}

const createQRCode = function () {
  const code = utils.randomNum(100000, 999999);
  data.value.code = code;
  QRCode.toDataURL("ledger_" + code + '_请在往来礼记小程序中扫码登录').then(url => {
    data.value.qrcode = url;
  }).catch(err => {
    ElMessage.error("生成二维码出错，请刷新再试！");
  });
};

const emit = defineEmits(['refreshMenu']);
defineExpose({ login });
watch(() => data.value.loginVisible, async (newVal, oldVal) => {
  if (!newVal) {
    clearInterval(interval);
  }
})
</script>
<style lang="less"></style>
