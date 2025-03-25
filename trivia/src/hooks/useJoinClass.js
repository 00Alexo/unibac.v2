import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

export const useJoinClass = () =>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [errorFields, setErrorFields] = useState(null);
    const [notification, setNotification] = useState(null);

    const joinClass = async(classId, password, username, token) =>{
        setIsLoading(true);
        setErrorFields(null);
        setError(null);

        const response = await fetch(`${process.env.REACT_APP_API}/api/class/joinClass`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({classId, username, password}),
        })
        const json = await response.json();

        if(!response.ok){
            console.log(json.error);
            setIsLoading(false);
            setError(json.error);
            console.log(json.errorFields)
            setErrorFields(json.errorFields);
            setTimeout(()=>{
                setError(null);
            }, 7000)
        }

        if(response.ok){
            setIsLoading(false);
            setNotification(json.msg);
            setTimeout(() =>{
                setNotification(null);
            }, 7000)
            navigate(`/clase/${classId}`);
            return true;
        }
        return false;
    }

    return {joinClass, isLoading, error, errorFields, notification}
}