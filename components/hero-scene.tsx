"use client";

import { Component, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Group } from "three";

function Paper({ color, offset, angle }: { color: string; offset: [number, number, number]; angle: number }) {
  return <group position={offset} rotation={[0, 0, angle]}>
    <RoundedBox args={[2.38, 3.04, .065]} radius={.055} smoothness={4}>
      <meshStandardMaterial color={color} roughness={.55} metalness={.02} />
    </RoundedBox>
    <mesh position={[-.51,.89,.038]}><boxGeometry args={[.89,.105,.005]}/><meshBasicMaterial color="#318351"/></mesh>
    <mesh position={[.68,.94,.04]}><circleGeometry args={[.12,24]}/><meshBasicMaterial color="#d2e8d4"/></mesh>
    {Array.from({ length: 5 }).map((_,index) =>
      <mesh key={index} position={[-.09,.35-index*.32,.038]}>
        <boxGeometry args={[index % 2 === 0 ? 1.7 : 1.32,.045,.005]}/>
        <meshBasicMaterial color={index===0 ? "#92ba9c" : "#b7d4be"}/>
      </mesh>
    )}
    <mesh position={[-.39,-1.01,.038]}><boxGeometry args={[1.09,.23,.005]}/><meshBasicMaterial color="#dceedd"/></mesh>
  </group>;
}

function Machine() {
  const motion = useRef<Group>(null);
  const pointerRig = useRef<Group>(null);

  useEffect(() => {
    if (!motion.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      if (!motion.current) return;
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: ".hero", start: "top top", end: "+=850", scrub: 1.15,
      }});
      timeline.to(motion.current.rotation, { y: .95, x: -.12 }, 0)
        .to(motion.current.position, { y: -.7, x: .6, z: -1 }, 0);
    });
    return () => context.revert();
  }, []);

  useFrame(({ pointer }, delta) => {
    if (!pointerRig.current) return;
    const easing = Math.min(delta * 1.3, .06);
    pointerRig.current.rotation.y += (pointer.x * .1 - pointerRig.current.rotation.y) * easing;
    pointerRig.current.rotation.x += (-pointer.y * .06 - pointerRig.current.rotation.x) * easing;
  });

  return <group ref={pointerRig}><group ref={motion} rotation={[-.13,-.25,-.07]}>
    <Float speed={1.4} rotationIntensity={.13} floatIntensity={.24}>
      <group position={[0,-.4,0]}>
        {/* Finished printer body */}
        <RoundedBox args={[3.6,1.38,2.65]} radius={.18} smoothness={5} position={[0,-1.2,0]}>
          <meshStandardMaterial color="#e7f1e8" metalness={.18} roughness={.27}/>
        </RoundedBox>
        <RoundedBox args={[3.67,.35,2.76]} radius={.14} smoothness={5} position={[0,-.49,.01]}>
          <meshStandardMaterial color="#b4d2bd" roughness={.38} metalness={.3}/>
        </RoundedBox>
        <RoundedBox args={[3.07,.52,.15]} radius={.07} smoothness={3} position={[0,-1.03,1.36]}>
          <meshStandardMaterial color="#19412d" roughness={.36}/>
        </RoundedBox>
        <RoundedBox args={[2.7,.12,.32]} radius={.045} position={[0,-.82,1.31]}><meshStandardMaterial color="#092d1c"/></RoundedBox>
        <RoundedBox args={[2.1,.08,.5]} radius={.035} position={[0,-1.63,1.35]}><meshStandardMaterial color="#91b79b"/></RoundedBox>
        <mesh position={[1.3,-1.0,1.47]}><sphereGeometry args={[.056,16,16]}/><meshBasicMaterial color="#a5f182"/></mesh>
        <mesh position={[1.02,-1.0,1.47]}><sphereGeometry args={[.045,16,16]}/><meshBasicMaterial color="#87bba2"/></mesh>

        {/* Documents emerging above the printer */}
        <group position={[0,.89,.05]} rotation={[-.2,.15,.04]}>
          <Paper color="#f6fff4" offset={[-.3,.12,-.32]} angle={-.16}/>
          <Paper color="#d4f0d2" offset={[.23,.2,-.19]} angle={.19}/>
          <Paper color="#fffefd" offset={[0,.65,.11]} angle={-.055}/>
        </group>
        <mesh position={[0,-.35,.3]} rotation={[.12,0,0]}><boxGeometry args={[2.6,.024,2.2]}/><meshBasicMaterial color="#86d899" transparent opacity={.8}/></mesh>
      </group>
    </Float>
  </group></group>;
}

export default function HeroScene() {
  return <SceneErrorBoundary><div className="three-wrap" aria-hidden="true">
    <Canvas dpr={[1,1.5]} gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }} camera={{position:[0,1.25,8.4],fov:41}}>
      <ambientLight intensity={1.75}/>
      <directionalLight position={[3.5,6,5]} intensity={3.4} color="#f1ffec"/>
      <pointLight position={[-4,0,2]} intensity={75} distance={15} color="#9eeeaf"/>
      <pointLight position={[3,-1,-3]} intensity={90} distance={13} color="#82c4b4"/>
      <Machine/>
    </Canvas>
  </div></SceneErrorBoundary>;
}

class SceneErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
