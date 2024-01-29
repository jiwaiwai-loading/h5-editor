import { ref, onMounted, isVNode } from 'vue'
import { defineStore } from 'pinia'
import { getType, getUnion } from '@/api/material.js'
import utils from '@/assets/js/utils.js';

export const useMenuStore = defineStore('menuStore', () => {
  const material = ref({})

  onMounted(() => {
    getMaterialType()
  });

  //获取资源类型
  const getMaterialType = async function () {
    if (!utils.isDefine(material.value)) {
      await getType().then(res => {
        if (res.code == 0) {
          let data = {};
          const list = res.data.children;
          for (let i = 0; i < list.length; i++) {
            data[list[i].code] = {
              cid: list[i].id,
              isReturn: false,
              data: []
            };
          }
          material.value = data;
          return data;
        } else {
          ElMessage.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
        ElMessage.error('获取分类失败');
      })
    } else {
      return material.value;
    }
  }

  //获取资源合集
  const getMaterialUnion = async function (menu) {
    if (menu.isMaterial) {
      if (!material.value[menu.type]) {
        await getMaterialType();
      }
      if (material.value[menu.type].data.length == 0) {
        getUnion(material.value[menu.type].cid).then(res => {
          if (res.code == 0) {
            material.value[menu.type].data = res.data;
          } else {
            ElMessage.error(res.msg);
          }
        }).catch(err => {
          console.log(err);
          ElMessage.error('获取资源失败');
        })
      } else {
        return material.value[menu.type].data;
      }
    }
  }

  return {
    material,
    getMaterialUnion
  }
})
