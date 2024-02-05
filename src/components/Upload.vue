<template>
    <el-upload action="#" :multiple="limit > 1" :limit="limit" v-model:file-list="fileList" list-type="picture-card" :auto-upload="false" :on-change="uploadChange" :on-exceed="handleExceed" :class="'picture-card-' + size">
        <el-icon>
            <Plus />
        </el-icon>
        <template #file="{ file }">
            <div v-loading="file.loading === true ? true : false" class="ub-fv ub-fh">
                <el-image class="el-upload-list__item-thumbnail" fit="contain" :src="parseUrl(file.url)" />
                <span class="el-upload-list__item-actions">
                    <span v-if="utils.fileType(file.name || file.url).type == 'img'" class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <el-icon><zoom-in /></el-icon>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </span>
                </span>

                <div v-if="file.name && (file.status == 'success' || file.status == 'error')" :class="file.status == 'error' ? 'uc-font-danger' : 'uc-font-white'" class="uabs-b uz1 ut-c uf-s06 upad-tb02" style="background-color: rgba(0,0,0,0.3);">{{ file.status == 'success' ? '上传成功' : '上传失败' }}</div>
            </div>
        </template>
    </el-upload>
    <div v-if="showUploadBtn" class="ub ub-f1 ub-ac umar-t02">
        <el-button @click="uploadFile()" :disabled="fileList.length > 0 ? false : true" class="ub-fh">确定上传</el-button>
    </div>

    <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" style="width: 100%;" />
    </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import utils from '@/assets/js/utils.js';
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    module: {
        type: String,
        default: 'system'
    },
    accept: {
        type: Array,
        default: ['jpg', 'jpeg', 'gif', 'png']
    },
    limit: {
        type: Number,
        default: 1
    },
    maxFileSize: { //文件最大尺寸，单位M
        type: Number,
        default: 2
    },
    size: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [Array, String],
        default: ''
    }
});
const fileList = ref([]);
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handleRemove = (file) => {
    for (let i = 0; i < fileList.value.length; i++) {
        if (file.url == fileList.value[i].url) {
            fileList.value.splice(i, 1);
            if (file.status == 'ready') {
                awaitUploadCount.value--;
            }
            return true;
        }
    }
}
const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}

const handleExceed = (files, uploadFiles) => {
    ElMessage.warning(`最多上传 ${props.limit} 个文件, 你选择了 ${files.length} 个文件`);
}
const showUploadBtn = ref(false);
const awaitUploadCount = ref(0);
const uploadChange = (file, files) => {
    awaitUploadCount.value = 1;
    for (let i = 0; i < fileList.value.length; i++) {
        if (fileList.value[i].name == file.name) {
            ElMessage.warning(`不能选择同名文件【${file.name}】`);
            handleRemove(file);
            return false;
        }
        if (fileList.value[i].status == 'ready') {
            awaitUploadCount.value++;
        }
    }

    fileList.value = files;
}
const uploadFile = async () => {
    return new Promise(async (resolve, reject) => {
        if (awaitUploadCount.value > 0) {
            for (let i = 0; i < fileList.value.length; i++) {
                let file = fileList.value[i];
                if (file.status == 'ready') {
                    file.loading = true;
                    utils.uploadFile({
                        url: 'common/upload/auth/' + props.module,
                        file: file,
                        suffix: props.accept,
                        maxSize: props.maxSize
                    }).then(res => {
                        if (res.code == 0) {
                            file.url = res.data.url;
                            file.status = 'success';
                            awaitUploadCount.value--;
                            if (awaitUploadCount.value == 0) {
                                const files = getFiles();
                                if (files) {
                                    emit('update:modelValue', files.urls);
                                    resolve(true);
                                } else {
                                    reject(false);
                                }
                            }
                        } else {
                            file.status = 'error';
                            reject(false);
                        }
                    }).catch(err => {
                        console.log(err)
                        file.status = 'error';
                        ElMessage.error(err.msg || '上传失败');
                        reject(false);
                    }).finally(() => {
                        file.loading = false;
                    });
                }
            }
        } else {
            resolve(true);
        }
    })
}

const getFiles = function () {
    let urls = [];
    for (let i = 0; i < fileList.value.length; i++) {
        if (fileList.value[i].status !== 'success') {
            ElMessage.warning('请删除未上传或上传错误的文件');
            return false;
        } else {
            urls.push(fileList.value[i].url);
        }
    }
    return {
        files: props.limit > 1 ? fileList.value : fileList.value[0],
        urls: props.limit > 1 ? urls : urls[0]
    };
}

const parseUrl = function (url) {
    if (url.indexOf('blob') == 0) {
        return url;
    }
    return utils.filePreviewIcon(url);
}

defineExpose({ getFiles, uploadFile });

//文件改变时动态绑定v-modle
watch(fileList, async (newVal, oldVal) => {
    let urls = [];
    for (let i = 0; i < newVal.length; i++) {
        urls.push(newVal[i].url);
    }
    emit('update:modelValue', urls.length > 0 ? (props.limit > 1 ? urls : urls[0]) : '');
}, { deep: true });

const isInit = ref(false);
watch(() => props.modelValue, async (newVal, oldVal) => {
    if (!isInit.value) {
        isInit.value = true;
        fileList.value = [];
        if (newVal) {
            if (typeof (newVal) == 'string') {
                fileList.value.push({
                    status: 'success',
                    url: newVal
                })
            } else {
                for (let i = 0; i < newVal.length; i++) {
                    fileList.value.push({
                        status: 'success',
                        url: newVal[i]
                    })
                }
            }
        }
    }
}, { immediate: true });

onMounted(() => {
    isInit.value = false;
})
</script>

<style>
.picture-card-small .el-upload-list--picture-card,
.picture-card-small .el-upload--picture-card {
    --el-upload-list-picture-card-size: 100px;
    --el-upload-picture-card-size: 100px;
}

.picture-card-big .el-upload-list--picture-card,
.picture-card-big .el-upload--picture-card {
    --el-upload-list-picture-card-size: 200px;
    --el-upload-picture-card-size: 200px;
}
</style>
