import axios from 'axios'

const baseUrl="http://localhost:3000/api"

export const movieList=()=>{
    return axios.get(`${baseUrl}/movies`)
    .then((res)=>res.data)
}

export const getMovieDetails=(movieId,cityId)=>{
    return axios.get(`${baseUrl}/movie/${movieId}?cityId=${cityId}`)
    .then((res)=>res.data)
}

export const getSeatAvailability=(movieId)=>{
    return axios.get(`${baseUrl}/seats/${movieId}`)
    .then((res)=>res.data)
}

export const getSeatPrice=(movieId,theatreId)=>{
    return axios.get(`${baseUrl}/price/${movieId}?theatreId=${theatreId}`)
    .then((res)=>res.data)
}