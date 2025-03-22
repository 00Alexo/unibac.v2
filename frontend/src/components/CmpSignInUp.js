import { useEffect, useRef } from 'react';
import rings from 'vanta/dist/vanta.rings.min';
import * as THREE from 'three';

const CmpSignInUp = () => {
    const vantaRef = useRef(null);
    useEffect(() => {
        let vantaEffect;
        if (vantaRef.current) {
            vantaEffect = rings({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                backgroundColor: 0xffffff, 
                size: 1.50
            });
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    return (
        <div>
            <div ref={vantaRef} className='max-h-[1000px] h-[calc(100vh-65px)]'></div>
        </div>
    );
};

export default CmpSignInUp;