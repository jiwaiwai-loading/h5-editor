<template>
  <div v-if="userInfo.token" class="uabs ub ub-ver">
    <div v-loading="loading" class="ub ub-f1 uof-y-s">
      <div v-if="!currentFolder.name">
        <div v-for="item, idx in myFolder" :key="idx" class="folder-area umar-a04">
          <div @click="openFolder(item)" class="folder uc-bg-gray ub ub-ac ub-pc uradius-a03 ubtn template-mask">
            <el-icon class="uf-s3 uc-font-warning">
              <FolderOpened />
            </el-icon>
            <div v-if="item.id !== 0" class="uabs-tr upad-a02 edit-folder">
              <el-dropdown @command="editFolder($event, idx, item)" size="middle">
                <el-button :icon="MoreFilled" circle size="small" />
                <template #dropdown>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="item.id > 0" command="rename">{{ settingStore.t('floder.rename') }}</el-dropdown-item>
                    <el-dropdown-item command="del">{{ settingStore.t('common.del') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div v-if="item.edit === true" class="umar-t02">
            <el-input v-model="item.name" @blur="editFolder('submit', idx, item)" size="small" :placeholder="settingStore.t('floder.placeholder')" :maxlength="15"></el-input>
          </div>
          <div v-else class="uf-s08 umar-t02 ut-c ut-hide1" :title="item.name">{{ item.name }}</div>
        </div>
        <div class="folder-area umar-a04">
          <div @click="addFolder" class="folder uc-bg-gray ub ub-ac ub-pc uradius-a03 uba-dashed uc-border-gray ubtn">
            <el-icon class="uf-s2 uc-font-gray1">
              <FolderAdd />
            </el-icon>
          </div>
        </div>
      </div>
      <div v-else class="ub ub-f1 ub-ver">
        <div class="ub ub-pc upad-a06 ubb">
          <el-button @click="currentFolder = {}" :icon="Back" link>{{ settingStore.t('common.back') }}</el-button>
          <el-divider direction="vertical" />
          <span class="uc-font-gray1 uf-s1">{{ currentFolder.name }}</span>
        </div>
        <div class="ub ub-f1">
          <Fluid ref="fluidCom" :col="3" :gutter="10" :data="dataList.data" :is-return="dataList.isReturn" :has-more="dataList.hasMore" @load-more="getMyMaterial"></Fluid>
        </div>
      </div>
    </div>
    <div class="ub ub-ver ubt upad-a06">
      <div v-if="currentFolder.name" class="ub ub-ac ub-pc umar-b1">
        <el-popconfirm @confirm="delMyMaterial" title="确定要删除吗？删除后不可恢复，但不影响已使用过的模板！" :width="80">
          <template #reference>
            <el-button :disabled="checkedMyMaterial.length > 0 ? false : true" type="danger" plain :icon="Delete" size="small">删除</el-button>
          </template>
        </el-popconfirm>
        <el-divider direction="vertical"></el-divider>
        <div class="ub">
          <el-dropdown @command="moveMyMaterial($event)">
            <el-button :disabled="checkedMyMaterial.length > 0 ? false : true" type="warning" plain :icon="Rank" size="small">移动</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item, idx in myFolder" :key="idx" :command="item.id" :disabled="item.id == myMaterial.categoryId">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-divider direction="vertical"></el-divider>
        <el-button :icon="Upload" size="small">上传</el-button>
      </div>

      <div class="ub ub-f1">
        <el-progress :text-inside="true" :stroke-width="16" color="#f00000" :percentage="50" :format="val => val >= 100 ? '已用空间100%' : '已用空间' + val + '%'" status="success" class="ub-fh"></el-progress>
        <div class="uf-s1 uc-font-gray"> 100M</div>
      </div>
    </div>
  </div>
  <LoginTips @login="login" @logout="userInfo = {}"></LoginTips>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import Fluid from '@/components/Fluid.vue';
import LoginTips from '@/views/components/LoginTips.vue';
import { delFloder, editFloder, getFolder, getMaterial } from '@/api/folder.js'
import { MoreFilled, Back, Delete, Rank, Upload } from '@element-plus/icons-vue';
import { useSettingStore } from '@/stores/setting';
const emit = defineEmits(['edit', 'delete']);
const userInfo = ref({});
const settingStore = useSettingStore();
const myFolder = ref([]);

const login = (user) => {
  userInfo.value = user;
  getMyFolder();
}

const addFolder = () => {
  if (utils.isDefine(myFolder.value[myFolder.value.length - 1].id)) {
    myFolder.value.push({
      id: '',
      name: '',
      edit: true
    })
  } else {
    ElMessage.warning(settingStore.t('floder.placeholder'));
  }
}

const editFolder = (ac, idx, floder) => {
  switch (ac) {
    case 'submit':
      if (utils.isDefine(floder.name)) {
        editFloder(floder).then(res => {
          if (res.code == '0') {
            floder.edit = false;
            myFolder.value[idx]['id'] = res.data.id;
          } else {
            ElMessage.error(res.msg);
          }
        }).catch(err => {
          console.log(err)
          ElMessage.error(err);
        })
      } else {
        ElMessage.warning(settingStore.t('floder.placeholder'));
      }
      break;
    case 'rename':
      myFolder.value[idx]['edit'] = true;
      break;
    case 'del':
      if (floder.id) {
        ElMessageBox.confirm(settingStore.t('floder.delFloder'), settingStore.t('common.warning'), {
          type: 'warning'
        }).then(() => {
          delFloder(floder.id).then(res => {
            if (res.code == '0') {
              myFolder.value.splice(idx, 1);
            } else {
              ElMessage.error(res.msg);
            }
          }).catch(err => {
            ElMessage.error(err);
          })
        }).catch(err => { });
      } else {
        myFolder.value.splice(idx, 1);
      }
      break;
  }
}

const loading = ref(false);
const getMyFolder = () => {
  loading.value = true;
  getFolder().then(res => {
    if (res.code == '0') {
      let data = res.data;
      data.unshift({
        id: 0,
        name: settingStore.t('floder.default')
      });
      myFolder.value = data;
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    ElMessage.error(err);
  }).finally(() => {
    loading.value = false;
  });
  getFolderSpace();
}


const defaultData = {
  pageIndex: 1,
  hasMore: true,
  isReturn: false,
  data: []
}

const fluidCom = ref();
const dataList = ref(utils.clone(defaultData));
const currentFolder = ref({});
const openFolder = (folder) => {
  currentFolder.value = folder;
  getMyMaterial();
}

const getMyMaterial = () => {
  loading.value = true;
  getMaterial(currentFolder.value.id, dataList.pageIndex).then(res => {
    console.log(res)
    if (res.code == '0') {
      dataList.value.data = res.data.data;
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => {
    ElMessage.error(err);
  }).finally(() => {
    dataList.value.isReturn = true;
    loading.value = false;
  });
}

const checkedMyMaterial = ref([]);
const delMyMaterial = () => {

}
const moveMyMaterial = () => {

}

const getFolderSpace = () => {

}

defineExpose({})

onMounted(() => {

})

</script>
<style scoped>
.folder-area {
  float: left;
  width: 72px;
  height: 95px;
}

.folder {
  height: 72px;
}

.folder:hover .edit-folder {
  display: inline-block;
}

.edit-folder {
  display: none;
}
</style>
