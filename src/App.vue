<script setup>
import { storeToRefs } from 'pinia'
import { useProductStore } from './stores/productStore'
import { onMounted } from 'vue'

import { useNotifyStore } from './stores/notifyStore'

const notifyStore = useNotifyStore()
const { displayNotification } = notifyStore
const { display, notification } = storeToRefs(notifyStore)

const { fetchAllProducts } = useProductStore()
const productStore = useProductStore()
const { products } = storeToRefs(productStore)

onMounted(() => {
  fetchAllProducts()
})
</script>

<template>
  <!-- <button @click="displayNotification({ type: 'info', message: 'notify testing Testing' })">
    display notification
  </button> -->
  <div id="notification" v-if="display">
    <span :class="notification.type">{{ notification.message }}</span>
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
  border-radius: 20px;
}

.info {
  color: #9165f7;
  background-color: #e0d5f9;
}
.success {
  color: #26af58;
  background-color: #acf9c8;
}
.error {
  color: #f32424;
  background-color: #f09797;
}
</style>
