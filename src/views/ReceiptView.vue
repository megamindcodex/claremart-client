<script setup>
import { useSaleStore } from '@/stores/saleStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const saleId = route.params.saleId

const saleStore = useSaleStore()
const { fetchSaleTransaction } = saleStore
const { sale } = storeToRefs(saleStore)

onMounted(async () => {
  try {
    await fetchSaleTransaction(saleId)
    // console.log(sale.value)
  } catch (err) {
    console.error(err.message)
  }
})
</script>


<template>
  <div id="cont">
    <v-sheet
      class="sheet pa-4 text-center mx-auto mt-16 d-flex flex-column ga-4"
      elevation="12"
      max-width="450"
      rounded="lg"
      width="100%"
    >
      <div class="w-100 d-flex pa-2">
        <span>ID: {{ sale._id }}</span>
      </div>
      <v-table v-if="sale?.items?.length">
        <thead>
          <tr>
            <th>name</th>
            <th>unit-price</th>
            <th>quantity</th>
            <th>line-total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sale.items" :key="item.sku">
            <td>{{ item.name }}</td>
            <td>{{ item.unitPrice }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.lineTotal }}</td>
          </tr>
        </tbody>
      </v-table>
      <div class="divider"></div>
      <div id="info">
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
    </v-sheet>
  </div>
</template>

<style lang="css" scoped>
tbody tr td {
  text-align: start;
  font-size: 13px;
}

.divider {
  width: 100%;
  border: 1px solid #b0adad;
}

#info {
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 300px;
}

.col {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>