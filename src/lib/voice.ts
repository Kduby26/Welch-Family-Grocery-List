type VoiceCallback = (transcript: string) => void;
type ErrorCallback = (error: string) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recognition: any = null;

export function isVoiceSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

export function startListening(
  onResult: VoiceCallback,
  onError: ErrorCallback
): () => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognitionCtor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) {
    onError('Speech recognition not supported');
    return () => {};
  }

  recognition = new SpeechRecognitionCtor();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  recognition.onend = () => {
    recognition = null;
  };

  recognition.start();

  return () => {
    if (recognition) {
      recognition.abort();
      recognition = null;
    }
  };
}

export function stopListening() {
  if (recognition) {
    recognition.stop();
  }
}
