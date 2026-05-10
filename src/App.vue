<template>
  <a-calendar v-model:value="value" @panelChange="onPanelChange" />
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dayjs } from 'dayjs'
const value = ref<Dayjs>()
const onPanelChange = (value: Dayjs, mode: string) => {
  console.log(value, mode)
}
</script>

<style scoped></style>
