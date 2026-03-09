import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { normalizeSoundVolume, shouldPlayTypingSound } from './sound';

describe('normalizeSoundVolume', () => {
  it('should clamp sound volume into 0-100', () => {
    assert.equal(normalizeSoundVolume(-10), 0);
    assert.equal(normalizeSoundVolume(44.7), 45);
    assert.equal(normalizeSoundVolume(120), 100);
  });
});

describe('shouldPlayTypingSound', () => {
  it('should not play when the sound profile is off', () => {
    assert.equal(shouldPlayTypingSound('off', 0, 1), false);
  });

  it('should play only when input length increases', () => {
    assert.equal(shouldPlayTypingSound('soft', 0, 1), true);
    assert.equal(shouldPlayTypingSound('soft', 2, 2), false);
    assert.equal(shouldPlayTypingSound('soft', 3, 2), false);
  });
});
