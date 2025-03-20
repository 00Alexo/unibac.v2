import {useState, useEffect} from 'react';
import { StarsComponent } from '../components/StarComponent';

const SubiecteTracker = () => {
    const [puncte, setPuncte] = useState(0);

    return (
        <div>
            <StarsComponent particleAmount={20}/>
        </div>
    );
}
 
export default SubiecteTracker;