import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { saveTemplate } from '@/api/my.js'
import { useSettingStore } from '@/stores/setting';
import utils from '@/assets/js/utils.js';

export const useNodeStore = defineStore('nodeStore', () => {
  const settingStore = useSettingStore();
  const myTemplate = ref({});
  const nodes = ref([{}]);
  const zIndex = ref([]);
  const checkedNode = ref({});
  const multipleNode = ref({});
  const currentPage = ref(0);
  const msgData = ref({});
  const lockCtrl = ref(false);
  const isAnimate = ref(true);
  const musicPlaying = ref(false);

  /**
   * 单选选中节点
   * @param { node } node - 当前节点
   */
  const selectNode = (node) => {
    let type;
    if (node.group) {
      //组
      cancelSelectNode();
      getGroup(node.group);
      type = 'group';
    } else if (lockCtrl.value) {
      //多选
      selectMultipleNode(node);
      type = 'multiple';
    } else {
      //单选
      cancelSelectNode();
      checkedNode.value = node;
      type = "single";
    }
    zIndex.value = getZIndex();

    sendMsg('selectNode', {
      type: type,
      node: node
    });
  }

  /**
   * 多选选中节点
   * @param { node } node - 当前节点
   */
  const selectMultipleNode = (node) => {
    multipleNode.value[node.id] = node;
    if (utils.isDefine(checkedNode.value)) {
      multipleNode.value[checkedNode.value.id] = checkedNode.value;
      checkedNode.value = {};
    }
  }
  /**
   * 锁定与解锁组
   * @param {string} groupId - 组ID
   */
  const lockGroup = (groupId) => {
    if (groupId) {
      for (let id in multipleNode.value) {
        delete multipleNode.value[id]['group'];
      }
      groupId = '';
    } else {
      groupId = 'group_' + new Date().getTime();
      for (let id in multipleNode.value) {
        multipleNode.value[id]['group'] = groupId;
      }
    }

    sendMsg('changeGroup', {
      groupId: groupId
    });
  }
  /**
   * 获取组
   * @param {string} groupId - 组ID
   */
  const getGroup = (groupId) => {
    const currentPageNode = nodes.value[currentPage.value];
    let currentMultipleNode = {};
    for (let type in currentPageNode) {
      if (utils.typeof(currentPageNode[type]) == 'array') {
        currentPageNode[type].forEach(item => {
          if (item.group == groupId) {
            currentMultipleNode[item.id] = item;
          }
        })
      }
    }
    multipleNode.value = currentMultipleNode;
  }

  /**
   * 清除选中节点
   */
  const cancelSelectNode = () => {
    checkedNode.value = {};
    multipleNode.value = {};
  }

  /**
   * 保存nodes
   */
  const save = () => {
    ElMessage.success("保存内容已输出到控制台");
    myTemplate.value['content'] = nodes.value;
    console.log(myTemplate.value);
    saveTemplate(myTemplate.value).then(res => {

    })
  }

  /**
   * 添加模板
   * @param {object} template - 模板
   */
  const newNodes = (template) => {
    let hasData = false;
    for (let i = 0; i < nodes.value.length; i++) {
      if (utils.isDefine(nodes.value[i])) {
        hasData = true
        break;
      }
    }
    if (hasData) {
      ElMessageBox.confirm(settingStore.t('template.change'), settingStore.t('common.warning'), {
        type: 'warning'
      }).then(() => {
        resetNodes(template);
      }).catch(() => { });
    } else {
      resetNodes(template);
    }
  }

  const resetNodes = (template) => {
    let nodesData;
    if (template) {
      myTemplate.value['id'] = template.id;
      nodesData = template.content;
    }
    cancelSelectNode();
    currentPage.value = 0;
    nodes.value = nodesData ? nodesData : [{}];
    sendMsg('changePage');
  }

  /**
   * 动画暂停播放
   */
  const playAnimate = () => {
    isAnimate.value = !isAnimate.value;
  }

  /**
   * 音乐播放暂停
   */
  const playMusic = () => {
    let mp3 = document.getElementById('musiccontrol');
    console.log(mp3)
    if (mp3) {
      if (!musicPlaying.value) {
        mp3.src = myTemplate.value.assets.music;
        let promise = mp3.play();
        promise.then((res) => {
          musicPlaying.value = true;
        }).catch(err => {
          console.log(err)
          musicPlaying.value = false;
        });
      } else {
        musicPlaying.value = false;
        mp3.pause();
      }
    }
  }

  /**
   * 添加素材
   * @param { object } material - 素材
   */
  const addNode = (material) => {
    const type = material.type;
    const currentTime = new Date().getTime();
    if (type == 'template') {
      const template = JSON.parse(material.json);
      let groupId = 'group_' + currentTime;
      for (let key in template) {
        for(let i=0; i<template[key].length; i++) {
          template[key][i].id = key + '_' + i + '_' + currentTime;
          template[key][i].group = groupId;
        }
        let currentNodes = nodes.value[currentPage.value][key];
        if (!currentNodes) {
          currentNodes = nodes.value[currentPage.value][key] = [];
        }
        currentNodes.push(...template[key]);
      }
    } else {
      const maxZIndex = Math.max(...getZIndex(), 0);
      const id = type + '_' + currentTime;
      let currentNodes = nodes.value[currentPage.value][type];
      if (!currentNodes) {
        currentNodes = nodes.value[currentPage.value][type] = [];
      }
      switch (type) {
        case 'text':
          const text = {
            id: id,
            type: type,
            content: settingStore.t('text.edit'),
            style: {
              position: 'absolute',
              width: '260px',
              height: 'auto',
              left: Math.min(60 + currentNodes.length * 5, 250) + 'px',
              top: Math.min(300 + currentNodes.length * 10, 600) + 'px',
              'text-align': 'center',
              'font-size': '24px',
              'font-weight': 'bolder',
              'z-index': maxZIndex + 1
            }
          }
          currentNodes.push(text);
          break;
        case 'material':
        case 'image':
          const fit = utils.imgFit(material);
          const left = (material.left - fit.width / 2) || Math.min((375 - fit.width) / 2 + currentNodes.length * 5, 250);
          const top = (material.top - fit.height / 2) || Math.min((750 - fit.height) / 2 + currentNodes.length * 5, 650);
          const image = {
            id: id,
            type: type,
            src: material.url,
            style: {
              position: 'absolute',
              width: fit.width + 'px',
              height: fit.height + 'px',
              left: left + 'px',
              top: top + 'px',
              'z-index': maxZIndex + 1
            }
          }
          currentNodes.push(image);
          break;
        case 'background':
          const background = {
            id: id,
            type: type,
            src: material.url,
            style: {
              position: 'absolute',
              width: '377px',
              height: '752px',
              left: '-1px',
              top: '-1px',
              'z-index': 0
            }
          };
          nodes.value[currentPage.value][type] = [background];
          break;
      }

      cacheSteps('addNode', type);
    }
    
    sendMsg('addNode');
  }

  /**
   * 删除节点
   * @param {node} targetNode - 目标节点
   */
  const delNode = (targetNode) => {
    targetNode = targetNode ? targetNode : checkedNode.value;
    let nodeList = nodes.value[currentPage.value][targetNode.type];
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id == targetNode.id) {
        nodeList.splice(i, 1);
      }
    }
    cancelSelectNode();
    cacheSteps('delNode', targetNode.type, utils.clone(targetNode));
    sendMsg('delNode');
  }

  /**
   * 复制节点
   * @param {node} targetNode - 目标节点 
   */
  const copyNode = (targetNode) => {
    targetNode = targetNode ? targetNode : checkedNode.value;
    let copyTarget = utils.clone(targetNode);
    let id = copyTarget.id.split('_');
    let top = copyTarget.style.top.split('px')[0];
    let left = copyTarget.style.left.split('px')[0];
    id[id.length - 1] = new Date().getTime();
    copyTarget.id = id.join("_");
    let t = Number(top) + 10;
    let l = Number(left) + 10;
    copyTarget.style.top = t + 'px';
    copyTarget.style.left = l + 'px';
    nodes.value[currentPage.value][targetNode.type].push(copyTarget);

    cancelSelectNode();
    cacheSteps('copyNode', targetNode.type, copyTarget);
    sendMsg('copyNode');
  }

  /**
   * 拖动素材
   * @param { object } material - 素材
   */
  let dragMaterial = undefined;
  const dragNodeStart = (material) => {
    dragMaterial = {
      material: material
    };
    document.getElementById('drag-mask').style.display = 'block';
  }
  const dargNodeEnd = (e) => {
    e.preventDefault();
    if (dragMaterial) {
      let material = dragMaterial.material;
      material['left'] = e.offsetX;
      material['top'] = e.offsetY;
      addNode(material);
      dragMaterial = undefined;
    }
  }
  const dragend = () => {
    document.getElementById('drag-mask').style.display = 'none';
  }

  /**
   * 获取当前页面所有元素z-index
   * @returns []
   */
  const getZIndex = () => {
    const currentNode = nodes.value[currentPage.value];
    let zIndex = [];
    for (const key in currentNode) {
      if (utils.typeof(currentNode[key]) == 'array') {
        currentNode[key].forEach(element => {
          if (element.style && element.style['z-index']) {
            if (zIndex.indexOf(element.style['z-index']) == -1) {
              zIndex.push(element.style['z-index']);
            }
          }
        });
      }
    }
    return zIndex;
  }

  /**
   * 新增页面
   */
  const addPage = () => {
    if (nodes.value.length < settingStore.totalPage) {
      nodes.value.push({});
      currentPage.value = nodes.value.length - 1;
    } else {
      ElMessage.warning(settingStore.t('common.limitUp'));
    }
  }

  /**
  * 移动页面
  * @param {number} idx - 当前页面索引
  * @param {string} direction - 方向，up or down
  */
  const movePage = (idx, direction) => {
    const index = direction == 'up' ? idx - 1 : idx + 1;
    nodes.value[idx] = nodes.value.splice(index, 1, nodes.value[idx])[0];
    currentPage.value = index;
    sendMsg('changePage');
  }

  /**
   * 复制页面
   * @param {number} idx - 当前页索引
   */
  const copyPage = (idx) => {
    if (nodes.value.length < settingStore.totalPage) {
      let currentNode = utils.clone(nodes.value[idx]);
      delete currentNode.form;
      for (let key in currentNode) {
        let target = currentNode[key];
        for (let i = 0; i < target.length; i++) {
          target[i].id = utils.randomNum(1000, 9999) + '_' + i;
        }
      }
      nodes.value.splice(idx + 1, 0, currentNode);
      console.log(currentNode)
    } else {
      ElMessage.warning(settingStore.t('common.limitUp'));
    }
  }

  /**
   * 删除页面
   * @param { number} idx - 当前页索引
   */
  const delPage = (idx) => {
    ElMessageBox.confirm(settingStore.t('common.delPrompt'), settingStore.t('common.warning'), {
      type: 'warning'
    }).then(() => {
      if (nodes.value.length == 1) {
        ElMessage.warning(settingStore.t('toolBar.notEmpty'));
      } else {
        nodes.value.splice(idx, 1);
        if (currentPage.value >= idx) {
          currentPage.value = Math.max(0, currentPage.value - 1);
        }
        sendMsg('changePage');
      }
    }).catch(() => { });
  }

  /**
   * 移动图层
   * @param {string} direction - 方向
   */
  const changeZIndex = (direction) => {
    sendMsg('zindex', {
      direction: direction
    });
  }

  /**
   * 缓存操作步骤
   * @param {string} action - 动作
   * @param {string} type - 元素类型
   * @param {any} attr - 元素属性
   */
  let nodeSteps = ref([]);
  let nodeStepsIdx = ref(-1);
  const cacheSteps = (action, type, attr) => {
    if (nodeStepsIdx.value > 0) {
      nodeSteps.value.splice(0, nodeStepsIdx.value - 1);
      nodeStepsIdx.value = 0;
    } else {
      nodeStepsIdx.value = 0;
    }

    switch (action) {
      case 'change':
        nodeSteps.value.unshift({
          action: action,
          page: currentPage.value,
          materialType: checkedNode.value.type,
          nodeId: checkedNode.value.id,
          nodeType: type,
          attr: attr
        });
        break;
      case 'addNode':
        const nodeList = nodes.value[currentPage.value][type];
        const lastNode = utils.clone(nodeList.at(-1));
        nodeSteps.value.unshift({
          action: action,
          page: currentPage.value,
          materialType: type,
          nodeId: lastNode.id,
          node: lastNode
        });
        break;
      case 'delNode':
        nodeSteps.value.unshift({
          action: action,
          page: currentPage.value,
          materialType: type,
          nodeId: attr.id,
          node: attr
        });
        break;
    }
    if (nodeSteps.value.length > settingStore.cacheStepNumber) {
      nodeSteps.value.splice(settingStore.cacheStepNumber, nodeSteps.value.length - settingStore.cacheStepNumber);
    }
    // console.log(nodeSteps.value)
  }

  /**
   * 撤销与恢复操作步骤
   * @param {string} action=back|recover - back or recover
   */
  const changeStep = (action) => {
    if (action == 'back' && (nodeStepsIdx.value < 0 || nodeStepsIdx.value > nodeSteps.value.length - 1 || nodeSteps.value.length == 0)) {
      return;
    } else if (action == 'recover' && nodeStepsIdx.value <= 0) {
      return;
    }

    let currentStepsIdx = Math.min(Math.max(nodeStepsIdx.value, 0), nodeSteps.value.length - 1);
    let currentNodeSteps = [];
    if (['addNode', 'delNode'].indexOf(nodeSteps.value[currentStepsIdx].action) >= 0) {
      currentNodeSteps = nodeSteps.value[currentStepsIdx];
      currentStepsIdx = action == 'back' ? nodeStepsIdx.value + 1 : nodeStepsIdx.value - 1;
      nodeStepsIdx.value = currentStepsIdx;
    } else {
      currentStepsIdx = action == 'back' ? nodeStepsIdx.value + 1 : nodeStepsIdx.value - 1;
      nodeStepsIdx.value = currentStepsIdx;
      currentNodeSteps = nodeSteps.value[Math.max(currentStepsIdx, 0)];
    }

    // console.log(currentStepsIdx, nodeSteps.value);
    // console.log(currentNodeSteps)
    if (currentNodeSteps) {
      currentPage.value = currentNodeSteps.page;

      const nodeList = nodes.value[currentNodeSteps.page][currentNodeSteps.materialType];
      const idx = nodeIdx(nodeList, currentNodeSteps.nodeId);
      switch (currentNodeSteps.action) {
        case 'change':
          const attr = currentNodeSteps.attr;
          for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].id == currentNodeSteps.nodeId) {
              if (typeof (attr) == 'object') {
                Object.assign(nodeList[i][currentNodeSteps.nodeType], attr);
              } else {
                nodeList[i][currentNodeSteps.nodeType] = attr;
              }
              break;
            }
          }
          break;
        case 'addNode':
          if (action == 'back') {
            if (idx >= 0) {
              nodeList.splice(idx, 1);
            }
          } else {
            if (idx < 0) {
              nodeList.push(currentNodeSteps.node);
            }
          }
          break;
        case 'delNode':
          if (action == 'back') {
            if (idx < 0) {
              nodeList.push(currentNodeSteps.node);
            }
          } else {
            if (idx >= 0) {
              nodeList.splice(idx, 1);
            }
          }
          break;
      }
      sendMsg('changeStep');
      cancelSelectNode();
    }
  }

  const nodeIdx = (nodeList, id) => {
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 更新我的模板资源
   * @param {style} type - 更新的资源类型 
   * @param {any} data - 要更新的数据
   */
  const updateAssets = (type, data) => {
    if (!utils.isDefine(myTemplate.value.assets)) {
      myTemplate.value.assets = {};
    }
    myTemplate.value.assets[type] = data;
    switch (type) {
      case 'music':
        musicPlaying.value = true;
        playMusic();
        break;
    }
  }

  /**
   * 更新节点
   * @param {object} args 
   * @param { node } args.node - 节点
   * @param { string } args.key - 节点类形， style、content...
   * @param { any } args.value - 新属性
   * @param { boolean } [args.isCache=true] - 是否缓存步骤
   */
  const updateNode = (args) => {
    const node = checkedNode.value.id ? checkedNode.value : args.node;
    if (args.isCache !== false) {
      const lastNode = nodeSteps.value.at(-1);
      if (!lastNode || lastNode.nodeId != node.id) {
        cacheSteps('change', args.key, utils.clone(node[args.key] || args.value));
      }
      cacheSteps('change', args.key, args.value);
    }


    if (typeof (args.value) == 'object') {
      if (!node[args.key]) {
        node[args.key] = {};
      }


      for (let key in args.value) {
        if (!utils.isDefine(args.value[key])) {
          if (args.value[key] === null) {
            delete node[args.key][key];
          }
          delete args.value[key];
        } else if (args.value[key].toString().trim() == 'px') {
          delete args.value[key];
        }
      }
      Object.assign(node[args.key], args.value);
    } else {
      node[args.key] = args.value;
    }
  }

  /**
 * 发送通知，以便其它组件监听执行某些逻辑
 * @param {string} ac - 当前动作
 */
  const sendMsg = (ac, data) => {
    msgData.value = {
      ac: ac,
      data: data
    };
    setTimeout(() => {
      msgData.value = {};
    }, 10);
  }

  watch(currentPage, (newVal) => {
    sendMsg('changePage');
    cancelSelectNode();
  });

  return {
    nodes,
    myTemplate,
    zIndex,
    checkedNode,
    multipleNode,
    currentPage,
    msgData,
    nodeStepsIdx,
    nodeSteps,
    isAnimate,
    musicPlaying,
    lockCtrl,
    playAnimate,
    playMusic,
    save,
    newNodes,
    selectNode,
    selectMultipleNode,
    cancelSelectNode,
    addNode,
    delNode,
    copyNode,
    addPage,
    movePage,
    copyPage,
    delPage,
    updateNode,
    updateAssets,
    dragNodeStart,
    dargNodeEnd,
    dragend,
    getZIndex,
    changeZIndex,
    changeStep,
    lockGroup,
    getGroup,
    sendMsg
  }
})
