<template>
  <div v-if="type == 'music'" class="ub ub-ver ub-f1">
    <div class="ub ub-wrap">
      <div v-for="li, i in dataList.data" :key="i" class="umar-a06">
        <MusicBox :data="li"></MusicBox>
      </div>
    </div>
    <div class="ub ub-ac ub-pc">
      <div v-if="dataList.isReturn">
        <el-empty v-if="dataList.data.length == 0" :image-size="100"></el-empty>
      </div>
      <div v-else v-loading="true" class="umar-t2"></div>
    </div>
  </div>
  <template v-else>
    <Fluid ref="fluidCom" :col="3" :gutter="10" :data="dataList.data" :is-return="dataList.isReturn" :has-more="dataList.hasMore" @load-more="getMoreMaterial"></Fluid>
  </template>
</template>
<script setup>
import {
  ref,
  onMounted
} from 'vue';
import { getCell } from '@/api/material.js';
import utils from '@/assets/js/utils.js';
import MusicBox from './MusicBox.vue';
import Fluid from '@/components/Fluid.vue';

const emit = defineEmits([]);
const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const defaultData = {
  pageIndex: 1,
  hasMore: true,
  isReturn: false,
  data: []
}

const fluidCom = ref();
const materialType = ref();
const dataList = ref(utils.clone(defaultData));
const keyword = ref();
const getMaterial = (type, key) => {
  if (type) {
    if (materialType.value === type) return;
    materialType.value = type;
    initData();
  }
  if (key) {
    if (keyword.value === key) return;
    if (key == 'unset') {
      keyword.value = '';
    } else {
      keyword.value = key;
      initData();
    }
  }

  dataList.value.isReturn = false;
  getCell(materialType.value, dataList.value.pageIndex, keyword.value).then(res => {
    if (res.code == 0) {
      const data = res.data.data;
      if (data.length > 0) {
        dataList.value.data = dataList.value.data.concat(data);
        dataList.value.hasMore = true;
      } else {
        dataList.value.hasMore = false;
      }
    } else {
      ElMessage.error(res.msg);
    }
  }).catch(err => { }).finally(() => {
    dataList.value.isReturn = true;
  })
}
const initData = () => {
  if (props.type != 'music') fluidCom.value.init();
  dataList.value = utils.clone(defaultData);
}

const getMoreMaterial = () => {
  if (dataList.value.hasMore && dataList.value.isReturn) {
    dataList.value.pageIndex++;
    getMaterial();
  }
}

defineExpose({ getMaterial });

onMounted(() => {

});

</script>
<style></style>
