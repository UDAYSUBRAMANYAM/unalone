import api from './api';

export const signUpUser = async (signUpData) =>{

    try{
        const response = await api.post("/auth/signup",signUpData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}