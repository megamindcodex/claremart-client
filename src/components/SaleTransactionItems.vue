<script setup>
import { useSaleStore } from '@/stores/saleStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useNotifyStore } from '@/stores/notifyStore'

import CancleIconSvg from '@/assets/icons/cancelIconSvg.vue'
import AddPluseIcon from '@/assets/icons/AddPluseIcon.vue'
import MinusIcon from '@/assets/icons/MinusIcon.vue'
import CloseIcon from '@/assets/icons/CloseIcon.vue'
import { ref } from 'vue'

const notifyStore = useNotifyStore()
const { displayNotification } = notifyStore

const saleStore = useSaleStore()
const { fetchSaleTransaction, addItemToSale, decrementItemQantity, remoteItemFromSale } = saleStore
const { sale } = storeToRefs(saleStore)

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
    displayNotification({ type: 'error', message: result.message })
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
    displayNotification({ type: 'info', message: result.message })

    console.log(result.message)
  } catch (err) {
    displayNotification({ type: 'error', message: result.message })
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

    displayNotification({ type: 'info', message: result.message })
    console.log(result.message)
  } catch (err) {
    displayNotification({ type: 'error', message: result.message })
    console.error(err.message)
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
          <th>#</th>
        </tr>
      </thead>
      <tbody v-if="sale.items?.length" id="item-cont">
        <tr v-for="item in sale.items" :key="item._id">
          <td>{{ item.name }}</td>
          <td>${{ item.unitPrice }}</td>
          <td>{{ item.quantity }}</td>
          <td>${{ item.lineTotal }}</td>
          <td>
            <div class="action d-flex">
              <AddPluseIcon
                id="add-plus-icon"
                v-ripple="{ class: 'text-black' }"
                @click="handleAddItem(item.sku)"
              />
              <MinusIcon id="minus-icon" @click="handleDecrementItemQantity(item.sku)" />
              <CloseIcon
                id="close-icon"
                v-ripple="{ class: 'text-black' }"
                @click="handleRemoteItemFromSale(item.sku)"
              />
            </div>
          </td>
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

.thead {
  border: 1px solid green;
}

#item-cont {
  width: 100%;
  height: 100%;
}

.table {
  border: 1px solid #000;
  width: 100%;
}

.action {
  position: relative;
  right: 15px;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
}

#add-plus-icon {
  width: 16px;
  height: 16px;
  stroke: #000000;
  stroke-width: 2.5;
  border: none;
}

#minus-icon {
  width: 16px;
  height: 16px;
  stroke: #000000;
  stroke-width: 2.5;
}

#close-icon {
  position: absolute;
  top: -6px;
  right: -30px;
  width: 16px;
  height: 16px;
  stroke-width: 1.5;
  stroke: #000000;
}

tbody {
  position: relative;
}

td {
  position: relative;
  font-size: 0.8em;
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