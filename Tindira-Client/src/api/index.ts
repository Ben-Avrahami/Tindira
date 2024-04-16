import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from "axios";

////////////////////////////////////////////////
//                API SECTION
////////////////////////////////////////////////
class _API {
    service: AxiosInstance = axios;
    constructor() {
        let service = axios.create({
            baseURL: 'https://aa94or46cc.execute-api.us-east-2.amazonaws.com/prod',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": import.meta.env.VITE_X_API_KEY
            }
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