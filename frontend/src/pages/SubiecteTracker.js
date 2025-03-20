import {useState, useEffect} from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { StarsComponent } from '../components/StarComponent';

const SubiecteTracker = () => {
    const {user} = useAuthContext();
    const [stele, setStele] = useState(0);

    const getStele = async () =>{
        const response = await fetch(`${process.env.REACT_APP_API}/api/subiecte/getSubiecteRezolvateTotale/${user.username}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if(response.ok){
            setStele(json.stele);
            console.log(stele);
        }
    }

    useEffect(() =>{
        getStele();
    }, [user])

    return (
        <div>
            <StarsComponent particleAmount={stele*20}/>
        </div>
    );
}
 
export default SubiecteTracker;