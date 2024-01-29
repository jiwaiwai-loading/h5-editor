<template>
  <div :class="nodeStore.myTemplate.assets && nodeStore.myTemplate.assets.music==data.url?'music-active uradius-a03':''" class="ub union-card my-music uba ushadow uof">
    <div class="ub ub-f1 ub-ac ub-pc opt-btn">
      <div v-if="nodeStore.myTemplate.assets && nodeStore.myTemplate.assets.music==data.url" @click="nodeStore.playMusic()" :class="nodeStore.musicPlaying?' animate__animated animate__slower animate__linear animate__infinite animate__rotate':''" class="ub ub-ac ub-pc umar-a08 uba uradius-a100 ubtn  uc-bg-main-light uc-font-white" style="width: 20px;height: 20px;">
          <span class="uf-s1 uc-font-whit">♪</span>
          <div v-if="!nodeStore.musicPlaying" class="uabs uf-s12 ub ub-ac ub-pc uc-font-white" style="transform:scale(0.8) rotate(45deg);">|</div>
      </div>
      <el-icon v-else @click="nodeStore.updateAssets('music', data.url)" class="uf-s15 umar-b04 ubtn">
        <VideoPlay />
      </el-icon>
    </div>
    <div class="uabs-b ub" style="width: 1000%;">
      <div class="ub umar-a02">
        <div class="ani-marquee uf-s06">{{ data.keyword }}</div>
      </div>
      <div class="ub ub-f1"></div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch
} from 'vue';
import { useNodeStore } from '@/stores/node';
const nodeStore = useNodeStore();

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
});


watch(() => props.data, (val) => {
  console.log(data)
})
</script>
<style>
.my-music:hover .ani-marquee, .music-active .ani-marquee {
  width: 100%;
  animation: 3s linear 0s infinite alternate marquee;
}

.my-music:hover .opt-btn, .music-active .opt-btn {
  transition-duration: 300ms;
  transform: scale(1.5);
}

@keyframes marquee {
  from {
    margin-left: 00%;
  }

  to {
    margin-left: -100%;
  }
}
</style>
