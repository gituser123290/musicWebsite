import { Navigate } from "react-router-dom";

const token = sessionStorage.getItem('token')
if(!token){
    Navigate('/login');
}
export default token;