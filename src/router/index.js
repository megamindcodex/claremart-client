import { createRouter, createWebHistory } from 'vue-router'

import SaleTransacrionsView from '@/views/SaleTransacrionsView.vue'
import SaleDetail from '@/views/SaleDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sales-transactions',
    },
    {
      path: "/sales-transactions",
      name: "salesTransaction",
      component: SaleTransacrionsView
    },
    {
      path: '/sale-details/:saleId',
      name: 'sale-details',
      component: SaleDetail
    },
  ],
})

export default router
