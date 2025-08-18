import axios from 'axios'

const AxiosService = axios.create({
    baseURL:"http://localhost:5003",
    headers:{
        "Content-Type":"application/json"
    }
})

AxiosService.interceptors.request.use(config=>{
    const token = sessionStorage.getItem('token')
    if(config.authenticate && token)
    {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default AxiosService