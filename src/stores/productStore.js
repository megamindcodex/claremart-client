import { defineStore } from "pinia";
import appClient from "@/api/axiosConfig";
import { ref } from "vue";



export const useProductStore = defineStore("productStore", () => {


    const products = ref([])




    const fetchAllProducts = async () => {
        try {
            const res = await appClient.get("/product/fetch-all-products")

            if (res.status !== 200) {
                throw new Error(res.data?.message || "fetch all product Failed") // Manually Throw Error into the catch block to be handled properly
            }

            products.value = res.data?.products
            return { success: true, message: res.data?.message }

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown fetchAllProduct error"
            console.error(`fetchAllProducts error: ${msg}`)
            return { success: false, message: msg }
        }
    }


    return { products, fetchAllProducts }
})