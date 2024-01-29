<template></template>

<script setup>
import {
    ref,
    onMounted
} from 'vue';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";
import { myDriver } from '@/config/localStorage';
import { useSettingStore } from '@/stores/setting';
const settingStore = useSettingStore();

const runDriver = () => {
    const steps = ['theme', 'lang', 'login', 'menu', 'menumaterial', 'menuContent', 'palette', 'layer', 'attr', 'ani', 'bar', 'page', 'driver'];
    let stepsObj = [];
    for (let i = 0; i < steps.length; i++) {
        stepsObj.push({
            element: '#driver-' + steps[i],
            popover: {
                title: settingStore.t('driver.' + steps[i] + '.title'),
                description: settingStore.t('driver.' + steps[i] + '.desc')
            }
        })
    }
    const driverObj = new driver({
        showProgress: true,
        showButtons: [
            'next',
            'previous',
            'close'
        ],
        nextBtnText: settingStore.t('driver.button.next'),
        prevBtnText: settingStore.t('driver.button.prev'),
        doneBtnText: settingStore.t('driver.button.done'),
        steps: stepsObj,
        onDestroyed: () => {
            myDriver.set(true);
        },
        onDestroyStarted: () => {
            if (!driverObj.hasNextStep() || confirm(settingStore.t('driver.close'))) {
                driverObj.destroy();
            }
        }
    });
    driverObj.drive();
}

const hasDriver = () => {
    if (myDriver.value !== true) {
        runDriver()
    }
}

defineExpose({
    runDriver
})


onMounted(() => {
    setTimeout(() => {
        hasDriver();
    }, 1000);
});

</script>

<style scoped></style>