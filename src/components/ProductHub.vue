<script setup>
import { useProductStore } from '@/stores/productStore'
import { useSaleStore } from '@/stores/saleStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const saleStore = useSaleStore()
const { addItemToSale } = saleStore
const { notif } = saleStore

const productStore = useProductStore()
const { fetchAllProducts } = productStore
const { products } = storeToRefs(productStore)

const isLoading = ref(false)

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

    console.log(result.message)
  } catch (err) {
    console.log(err.message)
  }
}

onMounted(fetchAllProducts)
</script>


<template>
  <div id="cont">
    <div id="head" class="d-flex flex-column align-center pa-2">
      <span>products</span>
    </div>
    <div v-if="products?.length" id="p-cont" class="w-100">
      <div
        v-for="p in products"
        :key="p._id"
        class="item pa-1"
        :class="{ disabled: isLoading }"
        v-ripple="{ class: 'text-teal' }"
        @click="!isLoading && handleAddItem(p.sku)"
      >
        <span>name: {{ p.name }}</span>
        <span>sku: {{ p.sku }}</span>
        <span>$price: {{ p.price }}</span>
      </div>
    </div>
    <div v-else class="pa-4 text-center">No products available</div>

    <div class="over-loader" v-if="isLoading">
      <v-progress-circular :size="50" color="white" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<style lang="css" scoped>
#cont {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid red; */
}

#head {
  /* border-bottom: 1px solid #000; */
}

#p-cont {
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
</style>