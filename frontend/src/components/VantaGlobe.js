import { useEffect, useRef } from 'react';
import globe from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';

const VantaGlobe = () => {
    const vantaRef = useRef(null);
    useEffect(() => {
        let vantaEffect;
        if (vantaRef.current) {
            vantaEffect = globe({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x0e2cc5,
                color2: 0x312626,
                backgroundColor: 0xffffff
            });
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    return (
        <div>
            <div ref={vantaRef} className="w-full h-[calc(100vh-65px)]"></div>
        </div>
    );
}

export default VantaGlobe