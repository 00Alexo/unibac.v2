import {useState} from 'react';
import {useAuthContext} from './useAuthContext'
import {useNavigate} from 'react-router-dom';

export const useSignin = () =>{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const {dispatch} = useAuthContext();

    const signin = async(username, password) =>{
        setError(null);
        setErrorFields([]);
        setIsLoading(true);

        const response = await fetch(`${process.env.REACT_APP_API}/api/user/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
        const json = await response.json();
        if(!response.ok){
            console.log(json.error);
            console.log(json.errorFields);
            setIsLoading(false);
            setError(json.error);
            setErrorFields(json.errorFields);
        }
        if(response.ok){
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type: 'LOGIN', payload: json});
            setIsLoading(false);
            navigate('/home', { state: { fromSignup: true } });
        }
    }

    return {signin, isLoading, error, errorFields}
}