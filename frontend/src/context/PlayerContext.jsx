import { createContext, useState, useRef, useEffect, useCallback } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.85);
    const [isMuted, setIsMuted] = useState(false);
    const [audioFrequencyData, setAudioFrequencyData] = useState(new Uint8Array(32));

    const audioRef = useRef(new Audio());
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const animationFrameRef = useRef(null);

    const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");

    // Connect Web Audio API Analyser
    const setupAudioAnalyser = () => {
        try {
            if (!audioContextRef.current) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                audioContextRef.current = new AudioCtx();
            }

            if (audioContextRef.current.state === "suspended") {
                audioContextRef.current.resume();
            }

            if (!analyserRef.current && audioContextRef.current) {
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 64;
                analyserRef.current.smoothingTimeConstant = 0.8;
            }

            if (!sourceNodeRef.current && analyserRef.current && audioContextRef.current) {
                audioRef.current.crossOrigin = "anonymous";
                sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                sourceNodeRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
            }
        } catch {
            // If crossOrigin or audio context creation is blocked, visualizer falls back to smooth simulated frequency wave
        }
    };

    // Frequency analysis loop
    const updateFrequencyData = useCallback(() => {
        if (!isPlaying) {
            setAudioFrequencyData(new Uint8Array(32));
            return;
        }

        if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            setAudioFrequencyData(dataArray);
        } else {
            // Simulated rhythmic frequency wave fallback
            const simulated = new Uint8Array(32);
            const time = Date.now() / 150;
            for (let i = 0; i < 32; i++) {
                const val = Math.sin(time + i * 0.45) * 50 + Math.cos(time * 0.8 + i * 0.3) * 60 + 110;
                simulated[i] = Math.max(20, Math.min(255, Math.floor(val)));
            }
            setAudioFrequencyData(simulated);
        }

        animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            setAudioFrequencyData(new Uint8Array(32));
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, updateFrequencyData]);

    // Audio element event bindings
    useEffect(() => {
        const audio = audioRef.current;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const onLoadedMetadata = () => {
            setDuration(audio.duration || 0);
        };

        const onEnded = () => {
            nextSong();
        };

        const onError = (e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("error", onError);

        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("error", onError);
        };
    }, [playlist, currentSong]);

    // Play specific song
    const playSong = (song, newPlaylist = null) => {
        if (!song) return;

        if (newPlaylist && Array.isArray(newPlaylist)) {
            setPlaylist(newPlaylist);
        }

        setCurrentSong(song);
        const fullAudioUrl = song.audioUrl.startsWith("http")
            ? song.audioUrl
            : `${BASE_URL}${song.audioUrl}`;

        if (audioRef.current.src !== fullAudioUrl) {
            audioRef.current.src = fullAudioUrl;
        }

        setupAudioAnalyser();

        audioRef.current
            .play()
            .then(() => {
                setIsPlaying(true);
            })
            .catch((err) => {
                console.warn("Autoplay was prevented or audio failed:", err);
                setIsPlaying(false);
            });
    };

    // Toggle Play/Pause
    const togglePlay = () => {
        if (!currentSong) return;

        setupAudioAnalyser();

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((err) => console.warn("Playback error:", err));
        }
    };

    // Seek track
    const seek = (timeInSeconds) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = timeInSeconds;
        setCurrentTime(timeInSeconds);
    };

    // Next Track
    const nextSong = () => {
        if (!playlist || playlist.length === 0 || !currentSong) return;
        const currentIndex = playlist.findIndex((s) => s._id === currentSong._id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        playSong(playlist[nextIndex], playlist);
    };

    // Previous Track
    const prevSong = () => {
        if (!playlist || playlist.length === 0 || !currentSong) return;
        const currentIndex = playlist.findIndex((s) => s._id === currentSong._id);
        const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        playSong(playlist[prevIndex], playlist);
    };

    // Volume adjustment
    const setVolume = (val) => {
        const clamped = Math.max(0, Math.min(1, val));
        setVolumeState(clamped);
        audioRef.current.volume = clamped;
        if (clamped > 0 && isMuted) {
            setIsMuted(false);
            audioRef.current.muted = false;
        }
    };

    // Mute toggle
    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.muted = false;
            setIsMuted(false);
        } else {
            audioRef.current.muted = true;
            setIsMuted(true);
        }
    };

    // Close / clear active song
    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        setCurrentSong(null);
    };

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                playlist,
                isPlaying,
                currentTime,
                duration,
                volume,
                isMuted,
                audioFrequencyData,
                playSong,
                togglePlay,
                seek,
                nextSong,
                prevSong,
                setVolume,
                toggleMute,
                closePlayer,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}
