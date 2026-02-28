"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ElevenLabsState = "idle" | "connecting" | "listening" | "transcribing" | "error";

export interface UseElevenLabsOptions {
  wsUrl?: string;
  onTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onError?: (error: string) => void;
}

export interface UseElevenLabsReturn {
  state: ElevenLabsState;
  transcript: string;
  finalTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  isListening: boolean;
}

export function useElevenLabs(options: UseElevenLabsOptions = {}): UseElevenLabsReturn {
  const {
    wsUrl = process.env.NEXT_PUBLIC_ELEVENLABS_WS_URL || "ws://localhost:4000",
    onTranscript,
    onFinalTranscript,
    onError,
  } = options;

  const [state, setState] = useState<ElevenLabsState>("idle");
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    try {
      cleanup();
      setState("connecting");
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create WebSocket connection
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setState("listening");
        ws.send(JSON.stringify({
          type: "start_transcription",
          userId: crypto.randomUUID()
        }));

        // Set up audio processing with VAD (Voice Activity Detection)
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            // Simple VAD: check if audio level exceeds threshold
            const rms = Math.sqrt(inputData.reduce((sum, val) => sum + val * val, 0) / inputData.length);
            if (rms > 0.01) {
              // Convert to base64 for transmission
              const audioArray = Array.from(inputData);
              ws.send(JSON.stringify({
                type: "audio_data",
                audio: btoa(audioArray.join(","))
              }));
            }
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "transcription_update":
            setState("transcribing");
            setTranscript(data.transcript);
            onTranscript?.(data.transcript);
            break;
          case "transcription_complete":
            setFinalTranscript(data.transcript);
            onFinalTranscript?.(data.transcript);
            setState("idle");
            break;
          case "connection_ack":
            break;
          default:
            break;
        }
      };

      ws.onerror = () => {
        const errorMsg = "WebSocket connection failed";
        setState("error");
        setError(errorMsg);
        onError?.(errorMsg);
      };

      ws.onclose = () => {
        if (state !== "error") {
          setState("idle");
        }
      };

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to start recording";
      setState("error");
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [wsUrl, cleanup, onTranscript, onFinalTranscript, onError, state]);

  const stop = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "end_transcription" }));
    }
    cleanup();
    setState("idle");
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    state,
    transcript,
    finalTranscript,
    error,
    start,
    stop,
    isListening: state === "listening" || state === "transcribing",
  };
}
