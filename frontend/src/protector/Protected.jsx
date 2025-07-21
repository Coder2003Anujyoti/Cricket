import {Navigate} from "react-router-dom";
import {useAutho} from  "./useAuth";
export default function Protected({ children }){
const {user} = useAutho();
if(!user){
    return <Navigate to="/login" replace={true } />
}
return children
}