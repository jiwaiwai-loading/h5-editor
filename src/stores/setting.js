import { ref, onMounted } from 'vue'
import { defineStore } from 'pinia'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useI18n } from 'vue-i18n';
import { myTheme, myLanguage } from '@/config/localStorage';

export const useSettingStore = defineStore('settingStore', () => {
  //设置主题, dark or light
  const theme = ref(myTheme.value == 'dark' ? 'dark' : 'light');
  //设置语言 zhCn or en
  const language = ref(zhCn);
  const { t, locale } = useI18n();
  //设置缓存步骤数 
  const cacheStepNumber = ref(20);
  //设置添加页数
  const totalPage = ref(10);

  const switchLanguage = (lang) => {
    let myLang = lang ? lang : (myLanguage.value || language.value.name);
    language.value = myLang == 'zh-cn' ? zhCn : en;
    locale.value = myLang;
    myLanguage.set(myLang);
  }
  const switchTheme = () => {
    let html = document.getElementsByTagName('html')[0];
    html.className = theme.value;
    myTheme.set(theme.value);
  }

  /**
   * 合并配置
   * @param {Array} array 
   */
  const concatLang = (array) => {
    let str = '';
    array.forEach(item => {
      str += t(item) + (language.value.name == 'en' ? ' ' : '');
    });
    return str;
  }

  onMounted(() => {
    switchTheme();
    switchLanguage();
  })

  return {
    language,
    theme,
    cacheStepNumber,
    totalPage,
    t,
    concatLang,
    switchLanguage,
    switchTheme,
  }
})
