'use client';

import { useCallback, useRef, useState } from 'react';

interface UseVoxtralSTTReturn {
    transcript: string;
    isStreaming: boolean;
    error: string | null;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    resetTranscript: () => void;
}

const WS_URL = process.env['NEXT_PUBLIC_WS_URL'] || 'ws://localhost:4000';

/**
 * Downsamples a Float32Array from sourceSampleRate to targetSampleRate
 * and converts to Int16 PCM (little-endian).
 */
function downsampleToInt16(
    float32: Float32Array,
    sourceSampleRate: number,
    targetSampleRate: number,
): Uint8Array {
    const ratio = sourceSampleRate / targetSampleRate;
    const newLength = Math.round(float32.length / ratio);
    const buffer = new ArrayBuffer(newLength * 2); // 2 bytes per Int16 sample
    const view = new DataView(buffer);

    for (let i = 0; i < newLength; i++) {
        const sourceIndex = Math.round(i * ratio);
        const sample = Math.max(-1, Math.min(1, float32[sourceIndex] ?? 0));
        const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(i * 2, int16, true); // little-endian
    }

    return new Uint8Array(buffer);
}

export function useVoxtralSTT(): UseVoxtralSTTReturn {
    const [transcript, setTranscript] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);

    const cleanup = useCallback(() => {
        workletNodeRef.current?.disconnect();
        workletNodeRef.current = null;

        if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close();
        }
        audioContextRef.current = null;

        mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;

        if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) {
            wsRef.current.close(1000, 'Recording stopped');
        }
        wsRef.current = null;
    }, []);

    const startRecording = useCallback(async () => {
        setError(null);
        setTranscript('');

        try {
            // 1. Get microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    channelCount: 1,
                    sampleRate: 16000, // hint — browser may ignore this
                },
            });
            mediaStreamRef.current = stream;

            // 2. Open WebSocket to backend
            const ws = new WebSocket(`${WS_URL}/ws/transcribe`);
            ws.binaryType = 'arraybuffer';
            wsRef.current = ws;

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data as string) as {
                        type: string;
                        text?: string;
                        error?: string;
                    };

                    if (data.type === 'transcription.text.delta' && data.text) {
                        setTranscript((prev) => prev + data.text);
                    } else if (data.type === 'transcription.done') {
                        setIsStreaming(false);
                    } else if (data.type === 'error' && data.error) {
                        setError(data.error);
                        setIsStreaming(false);
                        cleanup();
                    }
                } catch {
                    // Ignore malformed messages
                }
            };

            ws.onerror = () => {
                setError('Connexion au serveur perdue');
                setIsStreaming(false);
                cleanup();
            };

            ws.onclose = () => {
                setIsStreaming(false);
            };

            // 3. Wait for WS to open, then start audio pipeline
            await new Promise<void>((resolve, reject) => {
                ws.onopen = () => resolve();
                ws.onerror = () => reject(new Error('WebSocket connection failed'));
            });

            // 4. Create AudioContext and capture PCM chunks
            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const actualSampleRate = audioContext.sampleRate; // may differ from 16000

            // Use ScriptProcessorNode (widely supported) — bufferSize 4096 = ~256ms at 16kHz
            const bufferSize = 4096;
            const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
            workletNodeRef.current = processor;

            processor.onaudioprocess = (e: AudioProcessingEvent) => {
                if (ws.readyState !== WebSocket.OPEN) return;

                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = downsampleToInt16(inputData, actualSampleRate, 16000);
                ws.send(pcmData.buffer);
            };

            source.connect(processor);
            processor.connect(audioContext.destination); // must connect to keep it alive

            setIsStreaming(true);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erreur micro inconnu';
            setError(message);
            setIsStreaming(false);
            cleanup();
        }
    }, [cleanup]);

    const stopRecording = useCallback(() => {
        cleanup();
        setIsStreaming(false);
    }, [cleanup]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        transcript,
        isStreaming,
        error,
        startRecording,
        stopRecording,
        resetTranscript,
    };
}
