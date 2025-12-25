
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useNavigatorStore = defineStore("navigatorStore", () => {

    const router = useRouter()

    const navigateTo = (path) => {
        console.log(path)
        router.push(path)
    }





    return { navigateTo }
})