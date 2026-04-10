import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function MainLayout({ children, scene, musicColors, musicCount, showNotes = true }) {
    return (
        <div className="relative min-h-screen bg-navy-900 text-white overflow-hidden">
            {/* Simple Dark Background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-navy-900 via-navy-900 to-surface-dark" />

            {/* 3D Canvas Background */}
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 0,
                }}
            >
                <color attach="background" args={["#0f0f1e"]} />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.3} />

                <Suspense fallback={null}>
                    {scene}
                </Suspense>

                <EffectComposer>
                    <Bloom intensity={0.15} luminanceThreshold={0.08} />
                </EffectComposer>
            </Canvas>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
}

