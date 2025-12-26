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


            console.log("initialized sale transaction")
            console.log(res?.data?.sale)


            sale.value = res?.data?.sale
            router.push(`/sale-details/${res?.data?.sale._id}`)
            return { success: true, message: res?.data?.message }

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown initiate Transaction sale error"
            console.error(`initiate Sale error: ${msg}: ${err}`)
            return { success: false, message: msg }
        }
    }


    const fetchAllSaleTransaction = async () => {
        try {
            const res = await appClient.get("/sale/sale-transaction")



            allSales.value = res.data?.sales
            // console.log(res?.data?.sales)
            return { success: true, message: res.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown fetch Transaction sale error"
            console.error(`fetch transaction Sale error: ${msg}: ${err}`)
            return { success: false, message: msg }
        }
    }



    const fetchSaleTransaction = async (saleId) => {
        try {
            // console.log(saleId)
            // console.log(saleId)
            const res = await appClient(`/sale/sale-transaction/${saleId}`)



            sale.value = res?.data?.sale
            // console.log(sale.value)
            return { success: true, message: res?.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown fetch Transaction sale error"
            console.error(`fetch transaction Sale error: ${msg}: ${err}`)
            return { success: false, message: msg }
        }
    }




    const addItemToSale = async (saleId, sku) => {
        if (sale.value.status !== "OPEN") {
            return { message: "cannot edit this sale transaction" }
        }
        try {
            const res = await appClient.post(
                `/sale/sale-transaction/add-item/${saleId}`,
                { sku }
            )



            await fetchSaleTransaction(saleId)

            return { success: true, message: res.data?.message }

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Unknown add item to sale transaction error"

            console.error(`addItemToSale error: ${msg}: ${err}`)
            return { success: false, message: msg }

        }
    }




    const clearTransactionSaleItems = async (saleId) => {
        try {
            const res = await appClient.put(`/sale/sale-transaction/clear-items/${saleId}`)



            sale.value.items = []
            sale.value.subtotal = 0
            sale.value.tax = 0
            sale.value.grandTotal = 0
            return { success: true, message: res.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown clear transaction sale items error"
            console.error(`clareTransactionSaleItems error: ${msg}`)
            return { success: false, message: msg }
        }
    }


    const decrementItemQantity = async (saleId, sku) => {
        console.log(sale.value.status)
        if (sale.value.status !== "OPEN") {
            return { message: "cannot edit this sale transaction" }
        }

        try {
            const res = await appClient.put(`/sale/sale-transaction/decrement-item/${saleId}`, { sku })


            return { success: true, message: res.data?.message }

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown decrement transaction items quantity error"
            console.error(`decrementItemQuantity error: ${msg}: ${err}`)
            return { success: false, message: msg }
        }
    }



    const remoteItemFromSale = async (saleId, sku) => {
        if (sale.value.status !== "OPEN") {
            return { message: "cannot edit this sale transaction" }
        }
        try {
            const res = await appClient.put(`/sale/sale-transaction/remove-item/${saleId}`, { sku })

            return { success: true, message: res.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown RemoveItemFromSale error"
            console.error(`remove transaction sale items error: ${msg}`)
            return { success: false, message: msg }
        }
    }




    const updateSaleStatus = async (saleId, status) => {
        try {
            console.log(saleId)
            console.log(status)

            if (!saleId) {
                throw new Error(`saleId is ${saleId}`)
            }

            if (!status) {
                throw new Error(`statua is ${status}`)
            }

            const res = await appClient.put(`/sale/sale-transaction/update-sale-status/${saleId}`, { status })


            console.log(saleId)
            await fetchSaleTransaction(saleId)
            return { success: true, message: res.data?.message }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Unkown updateSaleStatus error"
            console.error(`updateSaleStatus error: ${msg}`)
            return { success: false, message: msg }
        }
    }


    const generateInvoice = async (saleId, status) => {
        try {

            const res = await updateSaleStatus(saleId, status)

            return { success: true, message: "Invoice generated successfully" }
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Unknown generateInvoice error"

            console.error(`generateInvoice error: ${msg}`)
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
        generateInvoice,
        updateSaleStatus
    }
})