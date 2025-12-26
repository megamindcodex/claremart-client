<script setup>
import { useSaleStore } from '@/stores/saleStore'

import PluseIconSvg from '../assets/icons/PluseIconSvg.vue'
import { storeToRefs } from 'pinia'
import { useNavigatorStore } from '@/stores/navigator'
import { onMounted } from 'vue'
import { useNotifyStore } from '@/stores/notifyStore'
import { ref } from 'vue'

const { navigateTo } = useNavigatorStore()

const notifyStore = useNotifyStore()
const { displayNotification } = notifyStore

const saleStore = useSaleStore()
const { initiateTransactionSale, fetchAllSaleTransaction } = saleStore
const { allSales } = storeToRefs(saleStore)

const isLoading = ref(false)

const handle_initiatTransactionSale = async () => {
  try {
    isLoading.value = true
    const result = await initiateTransactionSale()
    isLoading.value = false

    displayNotification({ type: 'info', message: result.message })
  } catch (err) {
    console.error(err.message)
    displayNotification({ type: 'error', message: err.message })
  }
}

onMounted(async () => {
  try {
    await fetchAllSaleTransaction()

    console.log(allSales.value)
  } catch (err) {
    console.error('Failed to fetch sales:', err)
  }
})
</script>

<template>
  <div class="cont pt-5 px-4">
    <div id="new-sale-cont" @click="handle_initiatTransactionSale()">
      <PluseIconSvg v-show="!isLoading" />
      <span v-show="!isLoading">new sale</span>
      <span v-show="isLoading">Initiating new sale transaction...</span>
    </div>
    <div class="col" v-if="allSales?.length > 0">
      <v-card
        v-for="sale in allSales"
        :key="sale._id"
        variant="outlined"
        class="saleCard pa-2"
        @click="navigateTo(`/sale-details/${sale._id}`)"
      >
        <div>
          <small id="id-txt">ID: {{ sale._id }}</small>
        </div>
        <div id="status" class="d-flex flex-row ga-2 w-100">
          <span>status</span>
          <v-chip :class="sale.status" variant="outlined">{{ sale.status }}</v-chip>
        </div>
        <div id="sum">
          <span>sub: {{ sale.subtotal }}</span>
          <span>sale: {{ sale.tax }}</span>
          <span>gTotal: {{ sale.grandTotal }}</span>
        </div>
      </v-card>
    </div>
    <div v-else id="no-sale-cont">
      <span>No Sales</span>
      <span>Click Above to add new sales</span>
    </div>
  </div>
</template>



<style lang="css" scoped>
.cont {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.col {
  width: 100%;
  display: flex;
  flex-direction: column;
}

#new-sale-cont {
  width: 100%;
  /* max-width: 300px; */
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed green;
  border-radius: 18px;
}

#no-sale-cont {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 1px solid #000;
  background-color: #f7f1f0;
}

.col {
  width: 100%;
  display: flex;
  gap: 1rem;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
}

.saleCard {
  width: 100%;
  max-width: 160px;
  height: 180px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  justify-content: center;
}

#status {
  display: flex;
  align-items: center;
  border-radius: 5px;
  font-size: 12px;
}

#id-txt {
  font-size: 10px;
  font-weight: bold;
}

#sum span {
  font-size: 13px;
}

.saleCard div {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.CANCELED {
  background-color: #8b8888;
  color: #fff;
}

.CLOSED {
  background-color: #2c80c5;
  color: #fff;
}

.OPEN {
  background-color: #2eb556;
  color: #fff;
}
</style>