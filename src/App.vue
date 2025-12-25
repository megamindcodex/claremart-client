<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from './stores/productStore'
import { onMounted } from 'vue'

import { useNotifyStore } from './stores/notifyStore'

const notifyStore = useNotifyStore()
// const { displayNotification } = notifyStore
const { display, notification } = storeToRefs(notifyStore)

const { fetchAllProducts } = useProductStore()
const productStore = useProductStore()
const { products } = storeToRefs(productStore)

onMounted(() => {
  fetchAllProducts()
})
</script>

<template>
  <!-- <button @click="display = !display">display notification</button> -->
  <div id="notification" v-if="display">
    <span>{{ notification.message }}</span>
  </div>
  <RouterView />
</template>

<style lang="css" scoped>
#notification {
  position: absolute;
  top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

#notification span {
  padding: 5px 20px;
  background-color: red;
  border-radius: 20px;
}
</style>
