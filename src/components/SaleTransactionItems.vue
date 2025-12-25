<script setup>
import { useSaleStore } from '@/stores/saleStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useNotifyStore } from '@/stores/notifyStore'

import CancleIconSvg from '@/assets/icons/cancelIconSvg.vue'
import { ref } from 'vue'

const notifyStore = useNotifyStore()
const { displayNotification } = notifyStore

const saleStore = useSaleStore()
const { fetchSaleTransaction, addItemToSale, decrementItemQantity, remoteItemFromSale } = saleStore
const { sale, notif } = storeToRefs(saleStore)

const route = useRoute()

const isLoading = ref()
const handleAddItem = async (sku) => {
  try {
    const saleId = route.params.saleId
    if (!saleId) {
      console.log(`saleId is ${saleId}`)
      return
    }

    isLoading.value = true
    const result = await addItemToSale(saleId, sku)
    isLoading.value = false

    displayNotification({ type: 'success', message: result.message })
    console.log(result.message)
  } catch (err) {
    console.log(err.message)
  }
}

const handleDecrementItemQantity = async (sku) => {
  try {
    const saleId = route.params.saleId
    if (!saleId) {
      console.log(`saleId is ${saleId}`)
    }

    isLoading.value = true
    const result = await decrementItemQantity(saleId, sku)
    isLoading.value = false

    await fetchSaleTransaction(saleId)
    displayNotification({ type: 'success', message: result.message })

    console.log(result.message)
  } catch (err) {
    console.error(err.message)
  }
}

const handleRemoteItemFromSale = async (sku) => {
  try {
    const saleId = route.params.saleId

    if (!saleId) {
      console.log(`saleId is ${saleId}`)
    }

    isLoading.value = true
    const result = await remoteItemFromSale(saleId, sku)
    isLoading.value = false

    await fetchSaleTransaction(saleId)
    displayNotification({ type: 'success', message: result.message })

    console.log(result.message)
  } catch (err) {
    // console.error(err.message)
  }
}

onMounted(async () => {
  await fetchSaleTransaction(route.params.saleId)
})
</script>


<template>
  <div class="cont">
    <div id="head" class="d-flex flex-column align-center pa-2">
      <span>The sales items section</span>
    </div>

    <v-table height="500px" fixed-header class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>unit-price</th>
          <th>quantity</th>
          <th>line-total</th>
        </tr>
      </thead>
      <tbody v-if="sale.items?.length" id="item-cont">
        <tr v-for="item in sale.items" :key="item._id">
          <td>{{ item.name }}</td>
          <td>${{ item.unitPrice }}</td>
          <td>{{ item.quantity }}</td>
          <td>${{ item.lineTotal }}</td>
          <div class="action">
            <button
              variant="outlined"
              v-ripple="{ class: 'text-black' }"
              @click="handleAddItem(item.sku)"
            >
              <span>+</span>
            </button>
            <button
              variant="outlined"
              v-ripple="{ class: 'text-black' }"
              @click="handleDecrementItemQantity(item.sku)"
            >
              <span>-</span>
            </button>
            <button
              variant="outlined"
              v-ripple="{ class: 'text-black' }"
              @click="handleRemoteItemFromSale(item.sku)"
            >
              <span>x</span>
            </button>
          </div>
        </tr>
        <div class="item-loader" v-if="isLoading">
          <v-progress-circular :size="50" color="white" indeterminate></v-progress-circular>
        </div>
      </tbody>
      <div v-else></div>
    </v-table>
  </div>
</template>


<style lang="css" scoped>
.cont {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
}

#head {
  width: 100%;
}

#item-cont {
  width: 100%;
  height: 100%;
}

.table {
  border: 1px solid #000;
}

.action {
  position: relative;
  top: 4px;
  width: 100%;
  /* height: 100%; */
  display: flex;
  gap: 4px;
  flex-direction: column;
}

.action button {
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  padding: 0px 5px;
}

tbody {
  position: relative;
}

td {
  font-size: 12px;
}

.item-loader {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0000001e;
}
</style>