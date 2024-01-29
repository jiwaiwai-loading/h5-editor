import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useToolBarStore = defineStore('toolBarStore', () => {
  const referLineCommand = ref('');

  return {
    referLineCommand
  }
})
