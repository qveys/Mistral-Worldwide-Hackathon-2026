import type { TranscribeCallbacks } from '../types/transcription.js';
export declare class VoxtralService {
    private getApiKey;
    transcribeStream(audioStream: AsyncIterable<Uint8Array>, callbacks: TranscribeCallbacks): Promise<void>;
}
//# sourceMappingURL=voxtral.service.d.ts.map