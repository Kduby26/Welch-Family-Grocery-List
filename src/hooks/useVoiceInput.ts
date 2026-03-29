import { useState, useCallback, useRef } from 'react';
import { startListening, stopListening, isVoiceSupported } from '@/lib/voice';
import { parseVoiceInput } from '@/lib/parser';
import { ParsedItem } from '@/types';

type VoiceState = 'idle' | 'listening' | 'processing' | 'confirming' | 'error';

export function useVoiceInput() {
  const [state, setState] = useState<VoiceState>('idle');
  const [parsedItems, setParsedItems] = useState<ParsedItem[]>([]);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  const supported = isVoiceSupported();

  const start = useCallback(() => {
    if (!supported) {
      setError('Voice input not supported on this device');
      setState('error');
      return;
    }

    setState('listening');
    setError(null);
    setTranscript('');
    setParsedItems([]);

    stopRef.current = startListening(
      (text) => {
        setTranscript(text);
        setState('processing');
        const items = parseVoiceInput(text);
        setParsedItems(items);
        setState(items.length > 0 ? 'confirming' : 'error');
        if (items.length === 0) {
          setError("Couldn't understand any items. Try again?");
        }
      },
      (err) => {
        setError(err);
        setState('error');
      }
    );
  }, [supported]);

  const stop = useCallback(() => {
    stopListening();
    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }
    setState('idle');
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setParsedItems([]);
    setTranscript('');
    setError(null);
  }, []);

  return {
    state,
    parsedItems,
    transcript,
    error,
    supported,
    start,
    stop,
    reset,
  };
}
