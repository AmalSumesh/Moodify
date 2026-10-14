import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function InteractiveDots({
    color1 = "#C0C0C0",
    color2 = "#00e5ff",
}) {
    const { mouse, viewport } = useThree();
    const meshRef = useRef(null);

    const count = 2000;

    const [particleData] = useState(() => {
        const positions = new Float32Array(count * 3);
        const initialPositions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const x = (Math.random() - 0.5) * 45;
            const y = (Math.random() - 0.5) * 45;
            const z = (Math.random() - 0.5) * 15;

            positions[i3] = initialPositions[i3] = x;
            positions[i3 + 1] = initialPositions[i3 + 1] = y;
            positions[i3 + 2] = initialPositions[i3 + 2] = z;

            // 20% color2, 80% color1.
            const mixedColor = Math.random() > 0.8 ? c2 : c1;

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        return { positions, initialPositions, colors };
    });

    const { positions, initialPositions, colors } = particleData;

    useFrame((state) => {
        const mesh = meshRef.current;

        if (!mesh) return;

        const time = state.clock.getElapsedTime();
        const positionsAttr = mesh.geometry.attributes.position;
        const positionArray = positionsAttr.array;

        const isMouseActive = mouse.x !== 0 || mouse.y !== 0;
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = initialPositions[i3];
            const y = initialPositions[i3 + 1];

            const dx = mouseX - x;
            const dy = mouseY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Repel nearby particles from the pointer.
            if (isMouseActive && dist < 7) {
                const force = (7 - dist) / 7;
                positionArray[i3] -= dx * force * 0.4;
                positionArray[i3 + 1] -= dy * force * 0.4;
            }

            // Smoothly return particles to their original positions.
            positionArray[i3] +=
                (x - positionArray[i3]) * 0.08;
            positionArray[i3 + 1] +=
                (y - positionArray[i3 + 1]) * 0.08;

            // Keep the gentle floating effect.
            positionArray[i3 + 2] =
                initialPositions[i3 + 2] +
                Math.sin(time * 0.5 + i) * 0.5;
        }

        positionsAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>

            <pointsMaterial
                size={0.12}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}