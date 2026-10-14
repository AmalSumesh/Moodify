
import { createContext, useState, useRef, useEffect, useCallback } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(0.85);
    const [isMuted, setIsMuted] = useState(false);
    const [audioFrequencyData, setAudioFrequencyData] = useState(
        () => new Uint8Array(32)
    );

    const audioRef = useRef(new Audio());
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const animationFrameRef = useRef(null);
    const frequencyLoopRef = useRef(null);
    const isPlayingRef = useRef(isPlaying);

    const BASE_URL = (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
    ).replace("/api", "");

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    const setupAudioAnalyser = useCallback(() => {
        try {
            if (!audioContextRef.current) {
                const AudioCtx =
                    window.AudioContext || window.webkitAudioContext;

                if (!AudioCtx) return;

                audioContextRef.current = new AudioCtx();
            }

            const audioContext = audioContextRef.current;

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            if (!analyserRef.current) {
                analyserRef.current = audioContext.createAnalyser();
                analyserRef.current.fftSize = 64;
                analyserRef.current.smoothingTimeConstant = 0.8;
            }

            if (!sourceNodeRef.current) {
                audioRef.current.crossOrigin = "anonymous";
                sourceNodeRef.current =
                    audioContext.createMediaElementSource(audioRef.current);

                sourceNodeRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContext.destination);
            }
        } catch {
            // Use simulated frequency data if audio analysis is unavailable.
        }
    }, []);

    const playSong = useCallback(
        (song, newPlaylist = null) => {
            if (!song) return;

            if (Array.isArray(newPlaylist)) {
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
                .then(() => setIsPlaying(true))
                .catch((err) => {
                    console.warn(
                        "Autoplay was prevented or audio failed:",
                        err
                    );
                    setIsPlaying(false);
                });
        },
        [BASE_URL, setupAudioAnalyser]
    );

    const nextSong = useCallback(() => {
        if (playlist.length === 0 || !currentSong) return;

        const currentIndex = playlist.findIndex(
            (song) => song._id === currentSong._id
        );

        const nextIndex = (currentIndex + 1) % playlist.length;
        playSong(playlist[nextIndex], playlist);
    }, [playlist, currentSong, playSong]);

    const prevSong = useCallback(() => {
        if (playlist.length === 0 || !currentSong) return;

        const currentIndex = playlist.findIndex(
            (song) => song._id === currentSong._id
        );

        const prevIndex =
            (currentIndex - 1 + playlist.length) % playlist.length;

        playSong(playlist[prevIndex], playlist);
    }, [playlist, currentSong, playSong]);

    const scheduleFrequencyFrame = useCallback(() => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            frequencyLoopRef.current?.();
        });
    }, []);

    const updateFrequencyData = useCallback(() => {
        if (!isPlayingRef.current) {
            animationFrameRef.current = null;
            return;
        }

        if (analyserRef.current) {
            const dataArray = new Uint8Array(
                analyserRef.current.frequencyBinCount
            );

            analyserRef.current.getByteFrequencyData(dataArray);
            setAudioFrequencyData(dataArray);
        } else {
            const simulated = new Uint8Array(32);
            const time = Date.now() / 150;

            for (let i = 0; i < 32; i++) {
                const value =
                    Math.sin(time + i * 0.45) * 50 +
                    Math.cos(time * 0.8 + i * 0.3) * 60 +
                    110;

                simulated[i] = Math.max(
                    20,
                    Math.min(255, Math.floor(value))
                );
            }

            setAudioFrequencyData(simulated);
        }

        scheduleFrequencyFrame();
    }, [scheduleFrequencyFrame]);

    useEffect(() => {
        frequencyLoopRef.current = updateFrequencyData;
    }, [updateFrequencyData]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;

        if (isPlaying) {
            scheduleFrequencyFrame();
        } else if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isPlaying, scheduleFrequencyFrame]);

    useEffect(() => {
        const audio = audioRef.current;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration || 0);
        const onEnded = () => nextSong();

        const onError = (event) => {
            console.error("Audio playback error:", event);
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
    }, [nextSong]);

    const togglePlay = useCallback(() => {
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
    }, [currentSong, isPlaying, setupAudioAnalyser]);

    const seek = useCallback((timeInSeconds) => {
        audioRef.current.currentTime = timeInSeconds;
        setCurrentTime(timeInSeconds);
    }, []);

    const setVolume = useCallback(
        (value) => {
            const clamped = Math.max(0, Math.min(1, value));

            setVolumeState(clamped);
            audioRef.current.volume = clamped;

            if (clamped > 0 && isMuted) {
                setIsMuted(false);
                audioRef.current.muted = false;
            }
        },
        [isMuted]
    );

    const toggleMute = useCallback(() => {
        if (isMuted) {
            audioRef.current.muted = false;
            setIsMuted(false);
        } else {
            audioRef.current.muted = true;
            setIsMuted(true);
        }
    }, [isMuted]);

    const closePlayer = useCallback(() => {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentSong(null);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        const audioContext = audioContextRef;

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            audio.pause();
            audio.removeAttribute("src");
            audio.load();

            if (audioContext.current) {
                audioContext.current.close();
            }
        };
    }, []);

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
