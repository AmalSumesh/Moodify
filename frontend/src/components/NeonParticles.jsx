
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function random01(seed) {
    let value = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
    value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
    value = (value ^ (value >>> 16)) >>> 0;
    return value / 4294967296;
}

export default function NeonParticles() {
    const ref = useRef(null);

    const positions = useMemo(() => {
        const arr = new Float32Array(5000 * 3);

        for (let i = 0; i < 5000; i++) {
            arr[i * 3] = (random01(i * 3 + 1) - 0.5) * 20;
            arr[i * 3 + 1] = (random01(i * 3 + 2) - 0.5) * 20;
            arr[i * 3 + 2] = (random01(i * 3 + 3) - 0.5) * 20;
        }

        return arr;
    }, []);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        ref.current.rotation.y = clock.getElapsedTime() * 0.05;
    });

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#22ff88"
                size={0.03}
                sizeAttenuation
                depthWrite={false}
            />
        </Points>
    );
}
