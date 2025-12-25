import axios from "axios"



// create Axios Instance
const appClient = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINT_URL, //base url, vuejs way of using .env
    timeout: 20000, //timeout in milliseconds
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

export default appClient