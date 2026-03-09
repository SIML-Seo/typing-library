'use client';

import { useCallback, useRef } from 'react';
import type { TypingSoundProfile } from '@/shared/db';

export function normalizeSoundVolume(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function shouldPlayTypingSound(
  profile: TypingSoundProfile,
  previousLength: number,
  nextLength: number,
) {
  return profile !== 'off' && nextLength > previousLength;
}

function createNoiseBuffer(context: AudioContext, durationSeconds: number) {
  const sampleRate = context.sampleRate;
  const frameCount = sampleRate * durationSeconds;
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let index = 0; index < frameCount; index += 1) {
    channelData[index] = Math.random() * 2 - 1;
  }

  return buffer;
}

function playSoftClick(context: AudioContext, volume: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(880, now);
  gain.gain.setValueAtTime(volume * 0.00022, now);
  gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.03);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.03);
}

function playMechanicalClick(context: AudioContext, volume: number) {
  const noise = context.createBufferSource();
  const noiseGain = context.createGain();
  const now = context.currentTime;

  noise.buffer = createNoiseBuffer(context, 0.025);
  noiseGain.gain.setValueAtTime(volume * 0.00018, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.025);
  noise.connect(noiseGain);
  noiseGain.connect(context.destination);
  noise.start(now);

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(1400, now);
  gain.gain.setValueAtTime(volume * 0.00012, now);
  gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.02);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.02);
}

function playTypewriterClick(context: AudioContext, volume: number) {
  const now = context.currentTime;

  const first = context.createOscillator();
  const firstGain = context.createGain();
  first.type = 'square';
  first.frequency.setValueAtTime(950, now);
  firstGain.gain.setValueAtTime(volume * 0.00018, now);
  firstGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.018);
  first.connect(firstGain);
  firstGain.connect(context.destination);
  first.start(now);
  first.stop(now + 0.018);

  const second = context.createOscillator();
  const secondGain = context.createGain();
  second.type = 'triangle';
  second.frequency.setValueAtTime(420, now + 0.012);
  secondGain.gain.setValueAtTime(volume * 0.00014, now + 0.012);
  secondGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.04);
  second.connect(secondGain);
  secondGain.connect(context.destination);
  second.start(now + 0.012);
  second.stop(now + 0.04);
}

export function useTypingSound() {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        return null;
      }

      contextRef.current = new AudioContextClass();
    }

    return contextRef.current;
  }, []);

  const playTypingSound = useCallback(
    (profile: TypingSoundProfile, volumePercent: number) => {
      if (profile === 'off') {
        return;
      }

      const context = getContext();

      if (!context) {
        return;
      }

      const volume = normalizeSoundVolume(volumePercent);

      if (context.state === 'suspended') {
        void context.resume();
      }

      if (profile === 'soft') {
        playSoftClick(context, volume);
        return;
      }

      if (profile === 'mechanical') {
        playMechanicalClick(context, volume);
        return;
      }

      playTypewriterClick(context, volume);
    },
    [getContext],
  );

  return {
    playTypingSound,
  };
}
