<template>
  <el-input v-model.trim="keyword" @keyup.enter="search" placeholder="搜索素材">
    <template #append>
      <el-button @click="search" :disabled="keyword ? false : true" :icon="Search" />
    </template>
  </el-input>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue';
import { Search } from '@element-plus/icons-vue';
const emit = defineEmits(['search']);

const keyword = ref('');
const search = function () {
  if (keyword.value) {
    emit('search', keyword.value);
  }
}


defineExpose({})

onMounted(() => {
})

</script>
<style></style>
