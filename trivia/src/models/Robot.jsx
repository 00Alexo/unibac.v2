/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 robot.glb 
Author: klava88 (https://sketchfab.com/klava88)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/vintage-robot-animated-1ccfb0b99b8a492d9f1144bb96d4a679
Title: Vintage Robot (Animated)
*/

import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import robot from './robot.glb'

export function Robot(props) {
  const group = React.useRef()
  const { scene, animations } = useGLTF(robot)
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.875}>
          <group name="480face7aa5e4998b0522398e167af16fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Object_4">
                  <primitive object={nodes._rootJoint} />
                  <group name="Object_6" scale={100} />
                  <group name="tmpod_duh7iply" scale={100} />
                  <skinnedMesh name="Object_7" geometry={nodes.Object_7.geometry} material={materials['Material.001']} skeleton={nodes.Object_7.skeleton} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/robot.glb')
