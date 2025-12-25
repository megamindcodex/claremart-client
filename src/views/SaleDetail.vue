<script setup>
import { useSaleStore } from '@/stores/saleStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ProductHub from '@/components/ProductHub.vue'
import SaleTransactionItems from '@/components/SaleTransactionItems.vue'

const route = useRoute()

const saleStore = useSaleStore()
const { sale, notif } = storeToRefs(saleStore)
</script>

<template>
  <!-- <button @click="display_notif">notif</button> -->
  <div id="cont">
    <div id="head" class="pa-2">
      <h5>Sales processing for</h5>
      <span>ID: {{ sale._id }}</span>
    </div>

    <div id="content" class="d-flex">
      <div id="sale-items">
        <SaleTransactionItems />
      </div>
      <div id="products">
        <ProductHub />
      </div>
    </div>
  </div>
</template>


<style lang="css" scoped>
#cont {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

#head {
  border-bottom: 1px solid #000;
}

#content {
  display: flex;
  gap: 5px;
  max-width: 870px;
  /* flex-direction: column-reverse; */
}

#sale-items {
  width: 100%;
}

#products {
  width: 100%;
  max-width: 300px;
}

/* .cont span {
  font-size: 15;
} */

#notif {
  position: absolute;
  top: 10px;
  width: 100px;
  background-color: green;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  border-radius: 8px;
}

#notif span {
  padding: 10px;
}
</style>