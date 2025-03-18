import {useState, useEffect} from 'react';

export const useViewClass = (classId, username) =>{
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [classData, setClassData] = useState(null);

    const getClass = async(req, res) =>{
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API}/api/class/viewClass/${classId}?username=${username}`,{
            method: 'GET'
        });
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
            console.log(json.error);
            setIsLoading(false);
            if(json.error == 'Clasa privata'){
                console.log(json)
                setClassData({
                    msg: "Aceasta clasa este privata, alatura-te ca sa ai acces la ea.",
                    className: json.className
                });
            }
        }
        if(response.ok){
            console.log(json);
            setClassData(json);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if(username)
            getClass();
        else{
            setError('Clasa privata');
            setClassData({
                msg: "Aceasta clasa este privata, alatura-te ca sa ai acces la ea.",
                className: classId
            });
        }
    }, [username]);

    const refetchClass = () => {
        getClass();
    };

    return {classData, isLoading, error, refetchClass}
}