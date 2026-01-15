import { describe, it, expect } from 'vitest';
import { url } from '../src/index.js';
import {
  MissingParamError,
  UnknownParamError,
  InvalidParamDeclarationError,
} from '../src/errors.js';

describe('snowurl', () => {
  it('builds a simple url', () => {
    const result = url('/user/:id', { id: 123 });
    expect(result).toBe('/user/123');
  });

  it('keeps literal extensions', () => {
    const result = url('/file/:hash.tar.gz', { hash: 'abc' });
    expect(result).toBe('/file/abc.tar.gz');
  });

  it('stops param at first invalid character', () => {
    const result = url('/:name-doc+x', { name: 'snow' });
    expect(result).toBe('/snow-doc+x');
  });

  it('supports underscore and numbers in param names', () => {
    const result = url('/v/:user_id2/profile', { user_id2: 42 });
    expect(result).toBe('/v/42/profile');
  });

  it('handles multiple params', () => {
    const result = url('/user/:id/post/:post_id.json', {
      id: 1,
      post_id: 99,
    });
    expect(result).toBe('/user/1/post/99.json');
  });

  it('stringifies non-string values', () => {
    const result = url('/flags/:enabled', { enabled: false });
    expect(result).toBe('/flags/false');
  });

  it('supports uppercase letters in param names', () => {
    const result = url('/user/:UserID/profile', { UserID: 123 });
    expect(result).toBe('/user/123/profile');
  });

  /* ---------- Error cases ---------- */

  it('throws if param is missing', () => {
    expect(() => url('/user/:id', {})).toThrow(MissingParamError);
  });

  it('throws if an unknown param is provided', () => {
    expect(() => url('/user/:id', { id: 1, foo: 'bar' })).toThrow(UnknownParamError);
  });

  it('throws if param name contains invalid characters', () => {
    expect(() => url('/:name-doc', { 'name-doc': 'x' } as any)).toThrow(MissingParamError);
  });

  it('throws on invalid param declaration in path', () => {
    expect(() => url('/user/:', {} as any)).toThrow(InvalidParamDeclarationError);
  });

  it('throws if param value is undefined', () => {
    expect(() => url('/user/:id', { id: undefined } as any)).toThrow(MissingParamError);
  });

  it('is case-sensitive for param names', () => {
    expect(() => url('/user/:UserID', { userid: 1 } as any)).toThrow(MissingParamError);
  });

  /* ---------- Edge cases ---------- */

  it('allows same param name only once per occurrence', () => {
    const result = url('/:id/:id', { id: 'x' });
    expect(result).toBe('/x/x');
  });

  it('works without params', () => {
    const result = url('/static/file.txt', {});
    expect(result).toBe('/static/file.txt');
  });

  it('handles adjacent params and literals', () => {
    const result = url('/:a-:b', { a: '1', b: '2' });
    expect(result).toBe('/1-2');
  });

  it('does not treat dots as part of param name', () => {
    const result = url('/:file.name', { file: 'abc' });
    expect(result).toBe('/abc.name');
  });
  it('does not return /', () => {
    const result = url(':file.name', { file: 'abc' });
    expect(result).toBe('abc.name');
  });
});
