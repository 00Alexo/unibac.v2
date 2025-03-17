import {useState, useEffect} from 'react';

export const useGetSubiect = (subId) =>{
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [viewSubiect, setViewSubiect] = useState(null);
    const [subiect, setSubiect] = useState(null);

    const getSubiect = async () =>{
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getSubiect/${subId}`,{
            method: 'GET'
        });
        const json = await response.json();
        if(!response.ok){
            setError(json.error);
            setIsLoading(false);
        }
        if(response.ok){
            console.log(json);
            setViewSubiect(json);
            setIsLoading(false);
        }
    }

    const downloadSubiect = async () =>{
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/downloadSubiect/${subId}`,{
            method: 'GET'
        });
        const blob = await response.blob();
        if(!response.ok){
            setError(blob.error);
            setIsLoading(false);
        }
        if(response.ok){
            console.log(blob);
            const pdfUrl = window.URL.createObjectURL(blob);
            setSubiect(pdfUrl);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (subId) {
            getSubiect();
            downloadSubiect();
        }
    }, [subId]);

    const refetchSubiect = () => {
        getSubiect();
        downloadSubiect();
    };

    return {viewSubiect, subiect, isLoading, error, refetchSubiect}
}