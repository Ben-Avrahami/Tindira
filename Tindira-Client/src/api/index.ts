import type { SelectedFilters } from "@/stores/State.interface";
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import Message from "primevue/message";

////////////////////////////////////////////////
//                API SECTION
////////////////////////////////////////////////
class _API {
    service: AxiosInstance = axios;
    constructor() {
        let service = axios.create({
            //@ts-ignore
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
                //@ts-ignore
                "x-api-key": import.meta.env.VITE_X_API_KEY
            },
        });
        this.service = service;
    }

    handleSuccess(response: AxiosResponse) {
        return response;
    }

    handleError = (error: AxiosError) => {
        console.log(error?.response?.status + "error, the response message: " + error.response);
        return Promise.reject(error);
    };


    redirectTo = (document: { location: any; }, path: any) => {
        document.location = path;
    };


    async checkHealth() {
        let response = await this.service.get("/health");
        return response;
    }

    async getNextListings(amount: number, filters: SelectedFilters, username: string, ignoreIds: string[]) {
        let response = await this.service.get(`/listings/getNext?username=${username}&amount=${amount.toString()}&category=${filters.category}&listingId=0`);
        console.log(response)
        return response.data;
    }

    //dummy method to check connection to backend
    //to be removed later
    async checkLogin() {
        let response = await this.service.post("/login", {
            username: "galben",
            password: "abc"
        });
        return response;
    }

}

const API = new _API();
export default API;