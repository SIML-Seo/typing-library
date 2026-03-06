import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildVisualFilterValue, hasActiveVisualFilter } from './visual-filters';

describe('buildVisualFilterValue', () => {
  it('should return an empty string for the default filter state', () => {
    assert.equal(
      buildVisualFilterValue({
        brightness: 100,
        contrast: 100,
        hue: 0,
        saturate: 100,
        sepia: 0,
        grayscale: 0,
        invert: 0,
      }),
      '',
    );
  });

  it('should build a stable css filter string in a fixed order', () => {
    assert.equal(
      buildVisualFilterValue({
        brightness: 110,
        contrast: 95,
        hue: 12,
        saturate: 120,
        sepia: 10,
        grayscale: 5,
        invert: 8,
      }),
      'brightness(110%) contrast(95%) hue-rotate(12deg) saturate(120%) sepia(10%) grayscale(5%) invert(8%)',
    );
  });
});

describe('hasActiveVisualFilter', () => {
  it('should return false when every slider is at its default value', () => {
    assert.equal(
      hasActiveVisualFilter({
        brightness: 100,
        contrast: 100,
        hue: 0,
        saturate: 100,
        sepia: 0,
        grayscale: 0,
        invert: 0,
      }),
      false,
    );
  });

  it('should return true when any slider changes', () => {
    assert.equal(
      hasActiveVisualFilter({
        brightness: 115,
        contrast: 100,
        hue: 0,
        saturate: 100,
        sepia: 0,
        grayscale: 0,
        invert: 0,
      }),
      true,
    );
  });
});
