<template>
    <div class="ub ub-f1 upad-tb04 upad-rl1 uc-font-gray">
        <div class="ub ub-pc ub-f1">
            <span id="driver-driver" @click="openDriver" class="ubtn uf-s08 umar-r12">{{ settingStore.t('footer.driver') }}</span>
            <el-popover :width="250">
                <template #reference>
                    <span class="ubtn uf-s08 umar-r12">{{ settingStore.t('footer.feedback') }}</span>
                </template>
                <template #default>
                    <div class="ub ub-ac ub-pc">
                        <div class="ub ub-ver ub-ac ub-pc umar-r1">
                            <img src="/images/wechat.jpg" class="feedback-box uba ushadow">
                            <div class="umar-t1">Wechat</div>
                        </div>
                        <div class="ub ub-ver ub-ac ub-pc">
                            <div class="feedback-box ub ub-ac ub-pc uba ushadow">zhifoukeji@qq.com</div>
                            <div class="umar-t1">Email</div>
                        </div>
                    </div>
                </template>
            </el-popover>
        </div>
        <div><span class="uf-s08">H5 Editor - V1.0.0</span></div>
    </div>
    <Driver ref="driver"></Driver>
</template>

<script setup>
import {
    ref
} from 'vue';
import Driver from '@/components/Driver.vue';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();

const driver = ref();
const openDriver = () => {
    driver.value.runDriver();
}
</script>

<style scoped>
.feedback-box {
    width: 100px;
    height: 100px;
    padding: 5px;
}
</style>