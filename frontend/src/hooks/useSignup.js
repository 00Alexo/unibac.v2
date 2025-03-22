import {useState} from 'react';
import {useAuthContext} from './useAuthContext'
import {useNavigate} from 'react-router-dom';

export const useSignup = () =>{
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState(null);
    const {dispatch} = useAuthContext();

    const signup = async(username, email, password, confirmPassword, statut, judet) =>{
        setError(null);
        setIsLoading(true);
        if(statut === '$.0')
            statut = 'elev';
        else if(statut === '$.1')
            statut = 'profesor';

        const response = await fetch(`${process.env.REACT_APP_API}/api/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, email, statut, password, confirmPassword, judet})
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

    return {signup, isLoading, error, errorFields}
}