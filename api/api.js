import axios from "axios";

const API_URL = "http://localhost:5070/api/";

export const Api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }, 
},[]);

const ApiWithFormData = axios.create({
    //  baseURL: apis,
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
})


export const createAndUpdateNavData  = (data) => Api.post('/navigation/', data)
export const getNavData  = () => Api.get('/navigation/all')
export const deleteNavData  = (slug) => Api.delete(`/navigation/${slug}`)