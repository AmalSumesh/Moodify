
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const DEFAULT_COLORS = ["#00ff88"];
const NOTES = ["♪", "♫", "♩", "♬", "♭", "♯", "♮", "𝄞", "𝄢", "𝅘𝅥𝅮", "𝅘𝅥𝅯"];
const RANGE = 25;

// Deterministic pseudo-random value between 0 and 1.
function random01(seed) {
    let value = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b);
    value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
    value = (value ^ (value >>> 16)) >>> 0;
    return value / 4294967296;
}

export default function MusicNetwork({
    colors = DEFAULT_COLORS,
    count = 80,
}) {
    const groupRef = useRef(null);

    const notes = useMemo(() => {
        const availableColors = colors.length > 0 ? colors : DEFAULT_COLORS;

        return Array.from({ length: count }, (_, i) => {
            const seed = i + 1;

            return {
                position: new THREE.Vector3(
                    (random01(seed * 6 + 1) - 0.5) * RANGE,
                    (random01(seed * 6 + 2) - 0.5) * RANGE,
                    (random01(seed * 6 + 3) - 0.5) * RANGE
                ),
                velocity: new THREE.Vector3(
                    (random01(seed * 6 + 4) - 0.5) * 0.03,
                    (random01(seed * 6 + 5) - 0.5) * 0.03,
                    (random01(seed * 6 + 6) - 0.5) * 0.03
                ),
                char: NOTES[Math.floor(random01(seed * 17) * NOTES.length)],
                color:
                    availableColors[
                        Math.floor(random01(seed * 23) * availableColors.length)
                    ],
            };
        });
    }, [count, colors]);

    useFrame((state) => {
        const group = groupRef.current;
        if (!group) return;

        const time = state.clock.getElapsedTime();

        group.children.forEach((child, i) => {
            const note = notes[i];
            if (!note) return;

            note.position.add(note.velocity);

            if (Math.abs(note.position.x) > RANGE / 2) {
                note.velocity.x *= -1;
            }
            if (Math.abs(note.position.y) > RANGE / 2) {
                note.velocity.y *= -1;
            }
            if (Math.abs(note.position.z) > RANGE / 2) {
                note.velocity.z *= -1;
            }

            child.position.copy(note.position);
            child.position.y += Math.sin(time + i) * 0.005;
            child.rotation.y += 0.01;
            child.rotation.z += 0.005;
        });
    });

    return (
        <group ref={groupRef}>
            {notes.map((note, i) => (
                <Text
                    key={i}
                    fontSize={1.2}
                    color={note.color}
                    anchorX="center"
                    anchorY="middle"
                    material-toneMapped={false}
                >
                    {note.char}
                </Text>
            ))}
        </group>
    );
}
