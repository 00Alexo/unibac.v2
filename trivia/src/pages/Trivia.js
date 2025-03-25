import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Brad } from '../models/Brad';
import { Environment } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';

const Trivia = () => {
    return (
        <div className='h-[calc(100vh-72px)] w-[100vw]'>
            <Canvas>
                <Environment preset="sunset" />
                <OrbitControls/>
                <Brad />
            </Canvas>
        </div>
    );
}
 
export default Trivia;