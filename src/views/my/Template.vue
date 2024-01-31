<template>
    <div class="category-more">
        <el-icon v-if="userInfo.token" @click="showCategory" class="ubtn upad-t1">
            <More />
        </el-icon>
    </div>
    <el-tabs v-if="userInfo.token" v-model="currentCategory" @tab-change="getMyInviteFromCategory('tabChange')" size="mini" class="invite">
        <el-tab-pane v-for="category, index in inviteCategory" :key="index" :label="category.name" :name="category.id">
            <div v-if="invite[category.id] && invite[category.id].data" class="ub umar-l04 ub-wrap">
                <div @click="nodeStore.newNodes()" class="ub ub-ac ub-pc uba-dashed uc-border-gray ubtn uc-bg-gray umar-a06" style="height: 200px; width: 100px;">
                    <el-icon class="uf-s2 uc-font-main">
                        <CirclePlusFilled />
                    </el-icon>
                </div>
                <div v-for="item, idx in invite[category.id].data" :key="idx" @click="nodeStore.newNodes(item)" class="ub uba ubtn uc-bg-gray umar-a06" style="height: 200px; width: 100px;">
                    <el-image :src="item.cover + '?v=' + random" fit="fill" class="ub ub-f1 ub-ac ub-pc">
                        <template #error>
                            <div class="uf-s06 uc-font-gray2">{{ settingStore.t('common.loadFailed') }}</div>
                        </template>
                    </el-image>
                    <div class="uabs invite-mask" style="background: linear-gradient(rgba(0,0,0,0) 60%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.3))">
                        <div class="uabs-tr upad-a02 edit-invite">
                            <el-dropdown @command="moveInvite($event, idx, item)" :hide-timeout="30">
                                <el-button @click.stop="" :icon="Rank" circle size="small" />
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item disabled class="ut-c uc-font-gray1 uf-s06">{{ settingStore.t('common.moveTo') }}</el-dropdown-item>
                                        <el-dropdown-item v-for="li, i in inviteCategory" :key="'move' + i" :command="li.id" :disabled="currentCategory == li.id" :divided="i == 0"> {{ li.name }} </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                            <el-button @click.stop="delInvite(idx, item)" :icon="Delete" circle size="small" />
                        </div>
                        <div class="uabs-b uf-s06 uc-font-white umar-a04">
                            <el-input v-if="item.edit == true" v-model.trim="item.title" @keyup.enter.native="editMyInviteTitle(item)" @blur="editMyInviteTitle(item)" autofocus :maxlength="25" size="small"></el-input>
                            <div v-else class="ut-hide2">
                                <div class="edit-invite uabs-br">
                                    <el-button @click.stop="item.edit = true" :icon="EditPen" circle size="small" />
                                </div>
                                {{ item.title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="ub ub-ac ub-pc" style="margin-top: 100px;">
                <div v-if="invite[category.id] && invite[category.id].isReturn" class="ub ub-ver ub-ac ub-pc">
                    <img src="@/assets/images/empty.png" style="width: 150px;" />
                    <div class="uf-s1 uc-font-gray1">该分类下暂无模板</div>
                    <div class="umar-t2"><el-button @click="nodeStore.newNodes()" icon="el-icon-circle-plus-outline" type="primary" plain size="small">{{ settingStore.concatLang(['common.add', 'menu.template']) }}</el-button></div>
                </div>
                <div v-else v-loading="true" class="uabs"></div>
            </div>
        </el-tab-pane>
    </el-tabs>
    <div v-else class="ub ub-ac ub-pc ub-ver upad-a1" style="margin-top: 100px;">
        <img src="@/assets/images/noauth.png" style="width: 150px;" />
        <div class="uf-s1 uc-font-gray1 ut-c"> {{ settingStore.t('user.logged') }}</div>
        <div class="umar-t2">
            <el-button @click="loginCom.login({ module: 'ledger' })" :icon="User" type="primary" plain size="small">{{ settingStore.t('user.login') }}</el-button>
        </div>
    </div>
    <Login ref="loginCom"></Login>
    <Category ref="categoryCom" @edit="onEditCategory" @delete="onDelCategory"></Category>
</template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import { getCategory, editTemplate, delTemplate, listTemplate } from '@/api/my.js';
import utils from '@/assets/js/utils.js';
import Login from '@/components/Login.vue';
import Category from './Category.vue';
import { User } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { useNodeStore } from '@/stores/node';
import { useSettingStore } from '@/stores/setting';
import { Rank, Delete, EditPen } from '@element-plus/icons-vue';
const random = ref(new Date().getTime());
const userStore = useUserStore();
const nodeStore = useNodeStore();
const userInfo = ref(userStore.user);
const settingStore = useSettingStore();
userStore.$subscribe((mutation, state) => {
    if (state.user) {
        userInfo.value = state.user;
        if (state.user.token) {
            getMyInviteCategory();
            getMyInviteFromCategory('reset');
        }
    }
});
const loginCom = ref();
const inviteCategory = ref([]);
const currentCategory = ref(0);
const invite = ref({
    0: {
        pageIndex: 1,
        isReturn: false,
        hasMore: true,
        data: []
    }
});

//展示模板分类
const categoryCom = ref();
const showCategory = function () {
    categoryCom.value.show(inviteCategory.value);
}

//获取模板分类
const getMyInviteCategory = function () {
    if (userInfo.value.token) {
        getCategory().then(res => {
            if (res.code == 0) {
                inviteCategory.value = res.data;
            } else {
                ElMessage.error(res.msg);
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error("获取分类失败");
        }).finally(() => {
            inviteCategory.value.unshift({
                id: 0,
                name: '默认'
            })
        });
    }
};

//监听模板分类编辑
const onEditCategory = function (item) {
    for (let i = 0; i < inviteCategory.value.length; i++) {
        if (inviteCategory.value[i].id == item.id) {
            inviteCategory.value[i] = item;
            return;
        }
    }
    inviteCategory.value.push(item);
}

//监听模板分类删除
const onDelCategory = function (id) {
    for (let i = 0; i < inviteCategory.value.length; i++) {
        if (inviteCategory.value[i].id == id) {
            inviteCategory.value.splice(i, 1);
            //通知更新编辑器
            break;
        }
    }
}

//移动模板
const moveInvite = function (id, idx, item) { //移动分类
    editTemplate({
        id: item.id,
        cid: id,
    }).then(res => {
        if (res.code == 0) {
            invite.value[currentCategory.value].data.splice(idx, 1);
            getMyInviteFromCategory('reset', id)
        } else {
            ElMessage.error(res.msg);
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error('出错了,请稍后再试！');
    });
}

//获取模板列表
const getMyInviteFromCategory = function (type, id) {
    if (userInfo.value.token) {
        const cid = id >= 0 ? id : currentCategory.value;
        if (!invite.value[cid] || type == 'reset') {
            invite.value[cid] = {
                pageIndex: 1,
                isReturn: false,
                hasMore: true,
                data: []
            }
        }
        if (type == 'tabChange' && invite.value[cid].data.length > 0) {
            return;
        }
        invite.value[cid].isReturn = false;

        listTemplate(cid, invite.value[cid].pageIndex).then(res => {
            if (res.code == 0) {
                if (res.data.count > 0) {
                    let data = res.data.data;
                    invite.value[cid].data = invite.value[cid].data.concat(data);
                    if (data.length < res.data.count) {
                        invite.value[cid].hasMore = true;
                    }
                } else {
                    invite.value[cid].hasMore = false;
                }
            } else {
                ElMessage.error(res.msg);
            }
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            invite.value[cid].isReturn = true;
        });
    }
};

//删除模板
const delInvite = function (idx, item) {
    ElMessageBox({
        title: '警告',
        message: '删除后不可恢复，确定要删除吗？',
        type: 'warning',
        showCancelButton: true
    }).then(() => {
        delTemplate(item.id).then(res => {
            if (res.code == '0') {
                ElMessage.success('删除成功！');
                invite.value[currentCategory.value].data.splice(idx, 1);
            } else {
                ElMessage.error(res.msg);
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error('出错了,请稍后再试！');
        });
    }).catch(() => { });
}

//修改模板名称
const editMyInviteTitle = function (item) {
    if (item.title) {
        item.edit = false;
        editTemplate({
            id: item.id,
            title: item.title
        }).then(res => {
            if (res.code == 0) {
            } else {
                ELmMessage.error(res.msg || '出错了,请稍后再试！');
            }
        }).catch(err => {
            console.log(err)
            ELmMessage.error('出错了,请稍后再试！');
        });
    }
}

onMounted(() => {
    getMyInviteCategory();
    getMyInviteFromCategory('reset');
});
</script>

<style>
.category-more {
    position: absolute;
    right: 5px;
    top: 0;
    bottom: 0;
    z-index: 10;
}

.category-more .ubtn,
.invite .el-tabs__header {
    position: -webkit-sticky;
    position: sticky;
    top: 0px;
    z-index: 3;
    background-color: var(--el-bg-color);
}

.invite-mask:hover .edit-invite,
.img-wraper:hover+.edit-invite,
.edit-invite:hover {
    display: inline-block;
}

.edit-invite {
    display: none;
}

.invite .el-tabs__nav-wrap {
    margin: 0 25px 0 5px !important;
}

.invite .el-tabs__item {
    padding: 0 10px;
}
</style>