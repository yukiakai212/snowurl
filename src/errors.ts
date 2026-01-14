export enum SnowurlErrorCode {
  INVALID_PARAM_DECLARATION = 'INVALID_PARAM_DECLARATION',
  MISSING_PARAM = 'MISSING_PARAM',
  UNKNOWN_PARAM = 'UNKNOWN_PARAM',
}

export class SnowurlError extends Error {
  readonly code: SnowurlErrorCode;

  constructor(code: SnowurlErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'SnowurlError';
  }
}

export class InvalidParamDeclarationError extends SnowurlError {
  constructor(position: number) {
    super(
      SnowurlErrorCode.INVALID_PARAM_DECLARATION,
      `Invalid param declaration at position ${position}. ` + `Param names must match [a-z0-9_]+`,
    );
    this.name = 'InvalidParamDeclarationError';
  }
}

export class MissingParamError extends SnowurlError {
  constructor(name: string) {
    super(SnowurlErrorCode.MISSING_PARAM, `Missing param "${name}"`);
    this.name = 'MissingParamError';
  }
}

export class UnknownParamError extends SnowurlError {
  constructor(name: string) {
    super(
      SnowurlErrorCode.UNKNOWN_PARAM,
      `Unknown param "${name}"` + `Only [a-z0-9_]+ params defined in path are allowed.`,
    );
    this.name = 'UnknownParamError';
  }
}
