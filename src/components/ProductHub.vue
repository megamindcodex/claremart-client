<script setup>
import { useProductStore } from '@/stores/productStore'
import { useSaleStore } from '@/stores/saleStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifyStore } from '@/stores/notifyStore'
import { useNavigatorStore } from '@/stores/navigator'

const route = useRoute()

const navigateStore = useNavigatorStore()
const { navigateTo } = navigateStore

const notifyStore = useNotifyStore()
const { displayNotification } = notifyStore

const saleStore = useSaleStore()
const { addItemToSale, clearTransactionSaleItems, generateInvoice, updateSaleStatus } = saleStore
const { sale } = storeToRefs(saleStore)

const productStore = useProductStore()
const { fetchAllProducts } = productStore
const { products } = storeToRefs(productStore)

const isLoading = ref(false)
const isClearing = ref(false)
const isgenerating = ref(false)
const isCanceling = ref(false)

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
    displayNotification({ type: 'error', message: err.message })
    console.error(err.message)
  }
}

const handle_clearTransactionSaleItems = async () => {
  try {
    const saleId = route.params.saleId
    if (!saleId) {
      console.log(`saleId is ${saleId}`)
      return
    }
    isClearing.value = true
    const result = await clearTransactionSaleItems(saleId)
    isClearing.value = false
    displayNotification({ type: 'info', message: result.message })
  } catch (err) {
    displayNotification({ type: 'error', message: err.message })
    console.error(err.message)
  }
}

const handle_generateInvoice = async () => {
  try {
    const saleId = route.params.saleId
    if (!saleId) {
      console.log(`saleId is ${saleId}`)
      return
    }
    isgenerating.value = true
    const result = await generateInvoice(saleId, 'CLOSED')
    isgenerating.value = false

    setTimeout(() => {
      navigateTo('/invoice')
    }, 3000)

    displayNotification({ type: 'success', message: result.message })
  } catch (err) {
    console.error('handle_generatInvoice error', err.message)
    displayNotification({ type: 'error', message: err.message })
    return
  }
}

const handle_cancleSaleTransaction = async () => {
  try {
    const saleId = route.params.saleId
    if (!saleId) {
      console.log(`saleId is ${saleId}`)
      return
    }

    isCanceling.value = true
    const result = await updateSaleStatus(saleId, 'CANCELED')
    isCanceling.value = false

    displayNotification({ type: 'info', message: result.message })
  } catch (err) {
    console.error('handle_cancleTransactionSale', err.message)
    displayNotification({ type: 'error', message: err.message })
  }
}

onMounted(fetchAllProducts)
</script>


<template>
  <div id="cont">
    <div id="head" class="d-flex flex-column align-center pa-2">
      <span>products</span>
    </div>
    <div v-if="products?.length" class="p-cont w-100">
      <div
        v-for="p in products"
        :key="p._id"
        class="item pa-2 ga-1"
        :class="{ disabled: isLoading }"
        v-ripple="{ class: 'text-teal' }"
        @click="!isLoading && handleAddItem(p.sku)"
        disabled
      >
        <div class="d-flex justify-space-between">
          <span>name: </span><span>{{ p.name }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>sku:</span><span>{{ p.sku }}</span>
        </div>
        <div class="d-flex justify-space-between">
          <span>price:</span><span>${{ p.price }}</span>
        </div>
      </div>
    </div>
    <div v-else class="p-cont pa-4 text-center">No products available</div>

    <div class="over-loader" v-if="isLoading">
      <v-progress-circular :size="50" color="white" indeterminate></v-progress-circular>
    </div>
  </div>
  <div id="cont-2" class="mt-2">
    <div class="info pa-2">
      <div class="col">
        status:
        <span :class="sale?.status">{{ sale.status }}</span>
      </div>
      <div class="col">
        sub:
        <span>${{ sale.subtotal }}</span>
      </div>
      <div class="col">
        tax
        <span>${{ sale.tax }}</span>
      </div>
      <div class="col">
        grandTotal:
        <span>${{ sale.grandTotal }}</span>
      </div>
    </div>
    <div class="actions" v-if="sale?.status === 'OPEN'">
      <div class="a-child">
        <button
          variant="outlined"
          class="rounded-0"
          :class="{ 'btn-disabled': sale.items?.length <= 0 }"
          density="compact"
          :disabled="sale.items?.length <= 0"
          @click="handle_clearTransactionSaleItems()"
        >
          clear items
          <v-progress-circular
            :size="20"
            :width="2"
            color="info"
            indeterminate
            v-show="isClearing"
          ></v-progress-circular>
        </button>
        <button
          variant="outlined"
          class="rounded-0"
          density="compact"
          @click="handle_cancleSaleTransaction()"
        >
          cancle sale
          <v-progress-circular
            :size="20"
            :width="2"
            color="info"
            indeterminate
            v-show="isCanceling"
          ></v-progress-circular>
        </button>
      </div>
      <v-btn
        variant="outlined"
        class="rounded-0"
        :class="{ 'btn-disabled': sale.items?.length <= 0 }"
        :disabled="sale.items?.length <= 0"
        @click="handle_generateInvoice()"
      >
        generate invoice
        <v-progress-circular
          :size="20"
          :width="2"
          color="info"
          indeterminate
          v-show="isgenerating"
        ></v-progress-circular>
      </v-btn>
    </div>
  </div>
</template>

<style lang="css" scoped>
#cont {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid red; */
}

#head {
  /* border-bottom: 1px solid #000; */
}

.p-cont {
  overflow: scroll;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
}

.item {
  width: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  border: 1px solid #aca9a9;
}

.item span {
  font-size: 11px;
}

.over-loader {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #00000057;
}

#cont-2 {
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.info {
  width: 100%;
  height: auto;
  border: 1px solid #000;
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.col {
  /* width: 100%; */
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.actions {
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
}

.a-child {
  width: 100%;
  display: flex;
  gap: 8px;
}

.a-child button {
  font-family: sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  width: 100%;
  padding: 5px 5px;
  border: 1px solid black;
}

.btn-disabled {
  color: #676565;
  background-color: #d8d4d4;
}

.OPEN {
  color: green;
}

.CANCELED {
  color: gray;
}
</style>