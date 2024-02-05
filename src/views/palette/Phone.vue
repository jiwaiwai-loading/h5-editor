<template>
    <div :style="'transform:scale(' + scale + ');'">
        <div @mousewheel.stop.prevent="" class="editor-area ub ub-ac ub-pc uradius-a03 uz2" :style="'width:' + size.width + 'px;height:' + size.height + 'px'">
            <div class="phone-bg ub-img5 "></div>
            <div v-if="nodeStore.myTemplate.assets && nodeStore.myTemplate.assets.music" class="uabs-tr uz2">
                <div @click="nodeStore.playMusic()" :class="nodeStore.musicPlaying ? ' animate__animated animate__slower animate__linear animate__infinite animate__rotate' : ''" class="ub ub-ac ub-pc music-btn umar-a08 uba uradius-a100 uof ubtn">
                    <span class="uf-s15 uc-font-white">♪</span>
                    <div v-if="!nodeStore.musicPlaying" class="uabs uf-s12 ub ub-ac ub-pc uc-font-white" style="transform:rotate(45deg);">|</div>
                </div>
            </div>
            <Panel :data="nodeStore.nodes[nodeStore.currentPage]"></Panel>
        </div>
        <ReferLine></ReferLine>
    </div>
</template>

<script setup>
import Panel from './Panel.vue';
import ReferLine from './ReferLine.vue';
import { useNodeStore } from '@/stores/node';
const nodeStore = useNodeStore();

const props = defineProps({
    scale: {
        type: Number,
        default: 1
    },
    size: {
        type: Object,
        default: {
            width: 375,
            height: 750
        }
    }
})

</script>

<style scoped>
.phone-bg {
    position: absolute;
    background-image: url('@/assets/images/phone.png');
    height: calc(100% + 125px);
    width: calc(100% + 20px);
    z-index: -9999;
}

.music-btn {
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.4);
}</style>