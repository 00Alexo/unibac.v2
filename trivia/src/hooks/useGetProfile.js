import {useState, useEffect} from 'react';

export const useGetProfile = (username) =>{
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [viewUser, setViewUser] = useState(null);

    const getProfile = async () =>{
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API}/api/user/getUserProfile/${username}`,{
            method: 'GET'
        });
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
            setIsLoading(false);
        }
        if(response.ok){
            setViewUser(json);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (username) {
            getProfile();
        }
    }, [username]);

    const refetchProfile = () => {
        getProfile();
    };

    return {viewUser, isLoading, error, refetchProfile}
}