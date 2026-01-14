import { MissingParamError, UnknownParamError, InvalidParamDeclarationError } from './errors.js';

export type ParamValue = string | number | boolean;

/* ---------- Token ---------- */

type Token = { type: 'literal'; value: string } | { type: 'param'; name: string };

const IDENT_RE = /^[a-z0-9_]+/;

/* ---------- Parser ---------- */

function parse(path: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < path.length) {
    const ch = path[i];

    if (ch === ':') {
      const rest = path.slice(i + 1);
      const match = rest.match(IDENT_RE);

      if (!match) {
        throw new InvalidParamDeclarationError(i);
      }

      const name = match[0];
      tokens.push({ type: 'param', name });
      i += name.length + 1;
      continue;
    }

    // literal
    let j = i + 1;
    while (j < path.length && path[j] !== ':') j++;
    tokens.push({ type: 'literal', value: path.slice(i, j) });
    i = j;
  }

  return tokens;
}

/* ---------- Builder ---------- */

export function url<T extends string, P extends Record<ExtractParams<T>, ParamValue>>(
  path: T,
  params: P,
): string {
  const tokens = parse(path);
  const used = new Set<string>();

  const out = tokens
    .map((token) => {
      if (token.type === 'literal') {
        return token.value;
      }

      const key = token.name as ExtractParams<T>;
      const value = params[key];

      if (value === undefined) {
        throw new MissingParamError(token.name);
      }

      used.add(token.name);
      return String(value);
    })
    .join('');

  // extra param check
  for (const key of Object.keys(params)) {
    if (!used.has(key)) {
      throw new UnknownParamError(key);
    }
  }

  return out;
}

/* ---------- Type Utils ---------- */

/**
 * Extract param names from path.
 * Grammar:
 *   ":" + [a-z0-9_]+
 * Stop immediately when encountering non-matching char.
 */
export type ExtractParams<S extends string> = S extends `${string}:${infer R}`
  ? R extends `${infer Head}${infer Tail}`
    ? Head extends `${infer C}${infer Rest}`
      ? C extends
          | 'a'
          | 'b'
          | 'c'
          | 'd'
          | 'e'
          | 'f'
          | 'g'
          | 'h'
          | 'i'
          | 'j'
          | 'k'
          | 'l'
          | 'm'
          | 'n'
          | 'o'
          | 'p'
          | 'q'
          | 'r'
          | 's'
          | 't'
          | 'u'
          | 'v'
          | 'w'
          | 'x'
          | 'y'
          | 'z'
          | '0'
          | '1'
          | '2'
          | '3'
          | '4'
          | '5'
          | '6'
          | '7'
          | '8'
          | '9'
          | '_'
        ? `${C}${ExtractIdent<Rest>}` | ExtractParams<Tail>
        : never
      : never
    : never
  : never;

type ExtractIdent<S extends string> = S extends `${infer C}${infer Rest}`
  ? C extends
      | 'a'
      | 'b'
      | 'c'
      | 'd'
      | 'e'
      | 'f'
      | 'g'
      | 'h'
      | 'i'
      | 'j'
      | 'k'
      | 'l'
      | 'm'
      | 'n'
      | 'o'
      | 'p'
      | 'q'
      | 'r'
      | 's'
      | 't'
      | 'u'
      | 'v'
      | 'w'
      | 'x'
      | 'y'
      | 'z'
      | '0'
      | '1'
      | '2'
      | '3'
      | '4'
      | '5'
      | '6'
      | '7'
      | '8'
      | '9'
      | '_'
    ? `${C}${ExtractIdent<Rest>}`
    : ''
  : '';
