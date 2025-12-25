import { defineStore } from "pinia";
import { ref } from "vue";




export const useNotifyStore = defineStore("notifyStore", () => {


    // const notification = ref([])
    const display = ref(false)
    const notification = ref({})



    const displayNotification = (data) => {
        if (display.value === true) {
            display.value = false
            notification.value = {}
        }

        notification.value = data
        display.value = true

        setTimeout(() => display.value = false, 2000)
    }



    return { display, notification, displayNotification }
})