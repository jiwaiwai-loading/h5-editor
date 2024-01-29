<template>
    <div class="ub ub-fv uf-s08 no-drag">
        <div @click.stop="emit('show', data.show === false ? true : false)" class="ub ub-pc upad-rl02 ubr uc-font-gray ubtn">
            <el-icon v-if="data.show === false" class="uc-font-gray2">
                <Hide />
            </el-icon>
            <el-icon v-else class="uc-font-main">
                <View />
            </el-icon>
        </div>
        <div v-if="data.type == 'background' || data.type == 'material'" @click.stop="selectNode" class="ub ub-f1 ub-fv ub-ac">
            <el-image :src="data.src" fit="scale-down" lazy></el-image>
        </div>
        <div v-else-if="data.type == 'text'" :id="data.id + '_preview'" @click.stop="selectNode" @dblclick="edit" @blur="setContent" :contenteditable="isEdit" :class="isEdit ? 'text-input' : ''" class="ub ub-f1 ub-ac ub-pc uf-s1">
            {{ utils.trimAll(data.content, ' ') }}
        </div>
        <div v-else-if="data.type == 'map'" @click.stop="selectNode" class="ub ub-f1 ub-ac ub-pc ubtn">
            <img src="/images/map.jpg" style="min-height: 10px; max-height: 48px; max-width:99%;">
        </div>
        <div v-else-if="data.type == 'form'" @click.stop="selectNode" class="ub ub-f1 ub-ac ub-pc upad-a04 ubtn">表单</div>
        <div v-else-if="data.type == 'effects'" @click.stop="selectNode" class="ub ub-f1 ub-ac ub-pc upad-a04 ubtn">特效</div>
        <div @click.stop="nodeStore.delNode(data)" class="ub ub-fv ub-pc upad-rl02 ubl uc-font-gray uc-bg- ubtn">
            <el-icon class="uf-s08 uc-font-danger ">
                <Delete />
            </el-icon>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import utils from '@/assets/js/utils.js';
import { useNodeStore } from '@/stores/node';
const nodeStore = useNodeStore();
const emit = defineEmits(['show']);
const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
});

const selectNode = () => {
    nodeStore.selectNode(props.data);
}

const isEdit = ref(false);
const edit = ($event) => {
    isEdit.value = true;
    setTimeout(() => {
        $event.target.focus();
    }, 50)
}
const setContent = ($event) => {
    isEdit.value = false;
    let content = $event.target.innerText;
    if (content) {
        nodeStore.updateNode({
            node: props.data,
            key: 'content', 
            value: content 
        });
    } else {
        $event.target.innerText = nodeStore.checkedNode.content;
    }
}
onMounted(() => {

})

</script>

<style>
.text-input {
    cursor: text;
    padding: 3px;
    background-color: white;
}
</style>