import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

export const useCreateClass = () =>{
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const createClass = async (creator, className, password, confirmPassword, subject, description, avatar, status, token) =>{
        setErrorFields(null);
        setIsLoading(true);
        setError(null);
        console.log(status);
        if(status === '$.0')
            status = 'private';
        else if (status === '$.1')
            status = 'public';
        console.log(status);

        const formdata = new FormData();

        formdata.append("file", avatar);
        formdata.append("upload_preset", "unibac07");
        formdata.append("cloud_name", "dopoxnlkb");
        const cloudinary = await fetch(`${process.env.REACT_APP_CLOUDINARY_API}`, {
            method: "post",
            body: formdata,
          })
        const js = await cloudinary.json();

        console.log(js);
        const avatarUrl = js.secure_url;

        const response = await fetch(`${process.env.REACT_APP_API}/api/class/createClass`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({creator, className, password, confirmPassword, subject, description, avatar: avatarUrl, status})
        })
        
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
            setErrorFields(json.errorFields);
            console.log(json.errorFields);
            setTimeout(()=>{
                setError(null);
            }, 7000)
        }

        if(response.ok){
            setIsLoading(false);
            navigate(`/clase/${json.classId}`, { state: { fromCreateClass: true } });
            setErrorFields(null);
        }
    }

    return {createClass, isLoading, error, errorFields}
}