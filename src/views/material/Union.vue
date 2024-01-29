<template>
  <div v-show="!showFluid" class="upad-rl06">
    <div class="upad-tb06 material-search">
      <MaterialSearch @search="search"></MaterialSearch>
    </div>

    <div v-for="item, idx in data" :key="idx">
      <div class="ub umar-l04 umar-t12">
        <div class="ub ub-f1">{{ item.name }}</div>
        <div class="uf-s08 uc-font-gray1">
          <el-button @click="getMore(item)" link size="small">
            {{ settingStore.t('common.all') }}
            <el-icon class="el-icon--right">
              <ArrowRight />
            </el-icon>
          </el-button>
        </div>
      </div>

      <div class="ub ub-wrap">
        <div v-for="li, i in item.material" :key="i" class="umar-a04">
          <template v-if="li.type == 'music'">
            <MusicBox :data="li"></MusicBox>
          </template>
          <el-image v-else @click="nodeStore.addNode(li)" @dragstart="nodeStore.dragNodeStart(li)" @dragend="nodeStore.dragend(li)" class="union-card img-hover uba ushadow" :src="li.url || li.thumbnailUrl" fit="scale-down">
            <template #error>
              <el-icon class="ub ub-ac ub-pc ub-fv ub-fh uc-font-gray2 uf-s2">
                <Picture />
              </el-icon>
            </template>
          </el-image>
        </div>
        <div v-if="item.material && item.material.length == 0" class="ub ub-fh ub-ac ub-pc">
          <el-empty :image-size="80"></el-empty>
        </div>
      </div>
    </div>
  </div>

  <div v-show="showFluid" class="uabs ub ub-ver ub-f1 uc-bg uz5">
    <div class="ub ub-pc upad-a06 ubb">
      <el-button @click="showFluid = false" :icon="Back" link>{{ settingStore.t('common.back') }}</el-button>
      <el-divider direction="vertical" />
      <span class="uc-font-gray1 uf-s1">{{ currentType.name ? currentType.name : settingStore.concatLang(['common.search', 'common.result']) }}</span>
    </div>
    <div class="ub ub-f1">
      <Fluid ref="fluidCom" :type="type" @getData="img => nodeStore.addNode(img)" @dragstart="img => nodeStore.dragNodeStart(img)" @dragend="nodeStore.dragend(li)"></Fluid>
    </div>
  </div>
</template>

<script setup>
import {
  ref
} from 'vue';
import { Back } from '@element-plus/icons-vue';
import MaterialSearch from './Search.vue';
import Fluid from './Fluid.vue';
import MusicBox from './MusicBox.vue';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
const nodeStore = useNodeStore();
const settingStore = useSettingStore();

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: []
  },
})

const showFluid = ref(false);
const fluidCom = ref();

const currentType = ref({});
const search = (res) => {
  currentType.value = {};
  showFluid.value = true;
  fluidCom.value.getMaterial(props.type, res);
}
const getMore = item => {
  currentType.value = item;
  showFluid.value = true;
  fluidCom.value.getMaterial(item.id + '', 'unset');
}

</script>
<style>
.union-card {
  width: 62px;
  height: 62px;
}

.img-hover:hover {
  transform: scale(1.05, 1.05);
  -webkit-transform: scale(1.05, 1.05);
  transition-duration: 300ms;
  opacity: 0.9;
  cursor: grab;
}
</style>
