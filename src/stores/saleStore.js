import { defineStore } from "pinia";
import appClient from "@/api/axiosConfig";
import { ref } from "vue";
import { useRouter } from "vue-router";

// import { useNavigatorStore } from "./navigator"


export const useSaleStore = defineStore("saleStore", () => {
    // const { navigateTo } = useNavigatorStore()
    const router = useRouter()

    const sale = ref({})
    const allSales = ref([])

    const isLoading = ref(false)


    const initiateTransactionSale = async () => {
        try {
            console.log("About to initiate store")
            const res = await appClient.post("/sale/initiate-sale")


            if (res.status !== 201) {
                return { success: false, message: res?.data?.message }
            }

            console.log("initialized sale transaction")
            console.log(res?.data?.sale)


            sale.value = res?.data?.sale
            router.push(`/sale-details/${res?.data?.sale._id}`)
            return { success: true, message: res?.data?.message }

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown initiate Transaction sale error"
            console.error(`initiate Sale error: ${msg}`)
            return { success: false, message: msg }
        }
    }


    const fetchAllSaleTransaction = async () => {
        try {
            const res = await appClient.get("/sale/sale-transaction")

            if (res.status !== 200) {
                return { success: false, message: res?.data?.message }
            }

            console.log(res?.data?.sales)

            allSales.value = res.data?.sales
            return { success: true, message: res.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown fetch Transaction sale error"
            console.error(`fetch transaction Sale error: ${msg}`)
            return { success: false, message: msg }
        }
    }



    const fetchSaleTransaction = async (saleId) => {
        try {
            console.log(saleId)
            console.log(saleId)
            const res = await appClient(`/sale/sale-transaction/${saleId}`)

            if (res.status !== 200) {
                console.error(res?.data?.message)
                return { success: false, message: res?.data?.message }
            }

            sale.value = res?.data?.sale
            // console.log(sale.value)
            return { success: true, message: res?.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown fetch Transaction sale error"
            console.error(`fetch transaction Sale error: ${msg}`)
            return { success: false, message: msg }
        }
    }




    const addItemToSale = async (saleId, sku) => {
        isLoading.value = true

        try {
            const res = await appClient.post(
                `/sale/sale-transaction/add-item/${saleId}`,
                { sku }
            )

            if (res.status !== 200) {
                return { success: false, message: res?.data?.message }
            }

            await fetchSaleTransaction(saleId)

            return { success: true, message: res.data?.message }

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Unknown add item to sale transaction error"

            console.error(`addItemToSale error: ${msg}`)
            return { success: false, message: msg }

        } finally {
            isLoading.value = false
        }
    }




    const clearTransactionSaleItems = async () => {
        try {

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown clear transaction sale items error"
            console.error(`clear transaction items Sale error: ${msg}`)
            return { success: false, message: msg }
        }
    }


    const decrementItemQantity = async (saleId, sku) => {
        try {
            const res = await appClient.put(`/sale/sale-transaction/decrement-item/${saleId}`, { sku })

            if (res.status !== 200) {
                console.log(res.data?.message)
                throw new Error(res.data?.message)
            }

            return { success: true, message: res.data?.message }

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown decrement transaction items quantity error"
            console.error(`decrement transaction items quantity error: ${msg}`)
            return { success: false, message: msg }
        }
    }



    const remoteItemFromSale = async (saleId, sku) => {
        try {
            const res = await appClient.put(`/sale/sale-transaction/remove-item/${saleId}`, { sku })

            if (res.status !== 200) {
                console.error(res.data?.message)
                throw new Error(res.data?.message)
            }

            return { success: true, message: res.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown remove transaction sale items error"
            console.error(`remove transaction sale items error: ${msg}`)
            return { success: false, message: msg }
        }
    }



    return {
        sale,
        allSales,
        isLoading,


        initiateTransactionSale,
        fetchSaleTransaction,
        fetchAllSaleTransaction,
        addItemToSale,
        clearTransactionSaleItems,
        decrementItemQantity,
        remoteItemFromSale,

    }
})