<template>
  <el-dialog :title="settingStore.t('template.classify')" v-model="visible" draggable :close-on-click-modal="true" :modal-append-to-body="false" width="300px">
    <template v-for="item, idx in category">
      <div v-if="item.id !== 0" :key="idx" class="ub ub-ac ub-pc ub-fh umar-b1">
        <div class="ub ub-f1">
          <el-input v-model.trim="item.name" :disabled="item.edit === true ? false : true" placeholder="please enter" :maxlength="10">
            <template #append>
              <el-button v-if="item.edit === true" @click="finished(item)" type="primary" :icon="Finished" link class="uf-s12"></el-button>
              <el-button v-else @click="item.edit = true" :icon="Edit" type="warning" link class="uf-s12"></el-button>
              <div class="umar-rl1">
                <el-divider direction="vertical"></el-divider>
              </div>
              <el-popconfirm v-if="item.id" @confirm="del(item, idx)" icon-color="red" width="130" hide-icon title="确定要删除该分类吗？删除后分类下的模板会自动移到默认分类下。">
                <template #reference>
                  <el-button :icon="Delete" type="danger" link class="uf-s12"></el-button>
                </template>
              </el-popconfirm>
              <el-button v-else @click="del(item, idx)" type="danger" :icon="Delete" link class="uf-s12"></el-button>
            </template>
          </el-input>
        </div>
      </div>
    </template>
    <div class="ub ub-f1 ub-fh umar-t2">
      <el-button @click="add" type="primary" :icon="Plus" plain class="ub-fh">{{ settingStore.concatLang(['common.add', 'template.classify']) }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue';
import { editCategory, delCategory } from '@/api/my.js';
import utils from '@/assets/js/utils.js';
import { Plus, Finished, Edit, Delete } from '@element-plus/icons-vue';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();
const emit = defineEmits(['edit', 'delete']);
const visible = ref(false);
const category = ref([]);

const show = function (data) {
  visible.value = true;
  category.value = utils.clone(data);
}

const add = function () {
  if (category.value.length < 10) {
    category.value.push({
      name: '',
      edit: true
    });
  } else {
    ElMessage.warning("最多可添加10个分类");
  }
}

const finished = function (item) {
  if (item.name) {
    editCategory(item).then(res => {
      if (res.code == '0') {
        item.id = res.data.id;
        item.edit = false;
        emit("edit", item);
      } else {
        ElMessage.warning(res.msg);
      }
    }).catch(err => {
      ElMessage.error(item.id ? '编辑失败' : '添加失败');
    })
  } else {
    ElMessage.warning("请输入分类名称");
  }
}

const del = function (item, idx) {
  if (item.id > 0) {
    delCategory(item.id).then(res => {
      if (res.code == '0') {
        emit("delete", item.id);
        category.value.splice(idx, 1);
      } else {
        ElMessage.error(res.msg);
      }
    }).catch(err => {
      ElMessage.error('删除失败');
    })
  } else {
    category.value.splice(idx, 1);
  }
}

defineExpose({ show })
onMounted(() => {
})

</script>
<style></style>
