const attentionSeekers = {
  value: 'attentionSeekers',
  name: '引起注意',
  data: [{
    value: 'rotate',
    name: '旋转'
  }, {
    value: 'flash',
    name: '闪烁'
  }, {
    value: 'wobble',
    name: '摇晃'
  }, {
    value: 'swing',
    name: '摆动'
  }, {
    value: 'tada',
    name: '抖动'
  }, {
    value: 'pulse',
    name: '跳动'
  }, {
    value: 'heartBeat',
    name: '脉动'
  }, {
    value: 'jello',
    name: '果冻状弹动'
  }, {
    value: 'rubberBand',
    name: '橡皮筋弹动'
  }, {
    value: 'shakeX',
    name: '左右晃动'
  }, {
    value: 'shakeY',
    name: '上下晃动'
  }, {
    value: 'bounce',
    name: '掉落弹动'
  }, {
    value: 'oneByOne',
    name: '逐字显示'
  }]
}
const bouncingEntrances = {
  value: 'bouncingEntrances',
  name: '弹性进入',
  data: [{
    value: 'bounceIn',
    name: '弹入'
  }, {
    value: 'bounceInDown',
    name: '从上到下'
  }, {
    value: 'bounceInUp',
    name: '从下到上'
  }, {
    value: 'bounceInLeft',
    name: '从左到右'
  }, {
    value: 'bounceInRight',
    name: '从右到左'
  }]
}
const bouncingExits = {
  value: 'bouncingExits',
  name: '弹性退出',
  data: [{
    value: 'bounceOut',
    name: '弹出'
  }, {
    value: 'bounceOutDown',
    name: '从上到下'
  }, {
    value: 'bounceOutUp',
    name: '从下到上'
  }, {
    value: 'bounceOutLeft',
    name: '从左到右'
  }, {
    value: 'bounceOutRight',
    name: '从右到左'
  }]
}
const fadingEntrances = {
  value: 'fadingEntrances',
  name: '渐入',
  data: [{
    value: 'fadeIn',
    name: '渐入'
  }, {
    value: 'jackInTheBox',
    name: '抖动渐入'
  }, {
    value: 'fadeInZoom',
    name: '从小到大'
  }, {
    value: 'fadeInZoom2',
    name: '从大到小'
  }, {
    value: 'fadeInDown',
    name: '从上到下'
  }, {
    value: 'fadeInDownBig',
    name: '大幅从上到下'
  }, {
    value: 'fadeInLeft',
    name: '从左到右'
  }, {
    value: 'fadeInLeftBig',
    name: '大幅从左到右'
  }, {
    value: 'fadeInRight',
    name: '从右到左'
  }, {
    value: 'fadeInRightBig',
    name: '大幅从右到左'
  }, {
    value: 'fadeInUp',
    name: '从下到上'
  }, {
    value: 'fadeInUpBig',
    name: '大幅从下到上'
  }]
}
const fadingExits = {
  value: 'fadingExits',
  name: '渐出',
  data: [{
    value: 'fadeOut',
    name: '渐出'
  }, {
    value: 'fadeOutZoom',
    name: '缩放渐出'
  }, {
    value: 'fadeOutDown',
    name: '从上到下'
  }, {
    value: 'fadeOutDownBig',
    name: '大幅从上到下'
  }, {
    value: 'fadeOutLeft',
    name: '从左到右'
  }, {
    value: 'fadeOutLeftBig',
    name: '大幅从左到右'
  }, {
    value: 'fadeOutRight',
    name: '从右到左'
  }, {
    value: 'fadeOutRightBig',
    name: '大幅从右到左'
  }, {
    value: 'fadeOutUp',
    name: '从下到上'
  }, {
    value: 'fadeOutUpBig',
    name: '大幅从下到上'
  }]
}
const flippers = {
  value: 'flippers',
  name: '翻转',
  data: [{
    value: 'flip',
    name: '翻转'
  }, {
    value: 'flipInX',
    name: 'X轴翻入'
  }, {
    value: 'flipInY',
    name: 'Y轴翻入'
  }, {
    value: 'flipOutX',
    name: 'X轴翻出'
  }, {
    value: 'flipOutY',
    name: 'Y轴翻出'
  }]
}
const lightspeed = {
  value: 'lightspeed',
  name: '惯性',
  data: [{
    value: 'lightSpeedInLeft',
    name: '从左到右进入'
  }, {
    value: 'lightSpeedInRight',
    name: '从右到左进入'
  }, {
    value: 'lightSpeedOutRight',
    name: '从左到右退出'
  }, {
    value: 'lightSpeedOutLeft',
    name: '从右到左退出'
  }]
}
const rotatingEntrances = {
  value: 'rotatingEntrances',
  name: '旋转进入',
  data: [{
    value: 'rotateIn',
    name: '进入'
  }, {
    value: 'rotateInDownLeft',
    name: '左上进入'
  }, {
    value: 'rotateInDownRight',
    name: '右上进入'
  }, {
    value: 'rotateInUpLeft',
    name: '左下进入'
  }, {
    value: 'rotateInUpRight',
    name: '右下进入'
  }, {
    value: 'rollIn',
    name: '空翻进入'
  }]
}
const rotatingExits = {
  value: 'rotatingExits',
  name: '旋转退出',
  data: [{
    value: 'rotateOut',
    name: '退出'
  }, {
    value: 'rotateOutDownLeft',
    name: '左下退出'
  }, {
    value: 'rotateOutDownRight',
    name: '右下退出'
  }, {
    value: 'rotateOutUpLeft',
    name: '左上退出'
  }, {
    value: 'rotateOutUpRight',
    name: '右上退出'
  }, {
    value: 'rollOut',
    name: '空翻退出'
  }]
}
const sliders = {
  value: 'sliders',
  name: '滑动',
  data: [{
    value: 'slideInDown',
    name: '从上到下进入'
  }, {
    value: 'slideInUp',
    name: '从下到上进入'
  }, {
    value: 'slideInLeft',
    name: '从左到右进入'
  }, {
    value: 'slideInRight',
    name: '从右到左进入'
  }, {
    value: 'slideOutDown',
    name: '从上到下退出'
  }, {
    value: 'slideOutUp',
    name: '从下到上退出'
  }, {
    value: 'slideOutRight',
    name: '从左到右退出'
  }, {
    value: 'slideOutLeft',
    name: '从右到左退出'
  }]
}
const specials = {
  value: 'specials',
  name: '其它',
  data: [{
    value: 'hinge',
    name: '悬挂掉落'
  }]
}


const animateList = [
  attentionSeekers,
  bouncingEntrances,
  bouncingExits,
  fadingEntrances,
  fadingExits,
  flippers,
  lightspeed,
  rotatingEntrances,
  rotatingExits,
  sliders,
  specials
]

export {
  animateList
}
