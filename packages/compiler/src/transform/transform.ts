import {
  log,
  LogLevel,
  type LogLevelName,
  logTime,
  mapLogLevelStringToNumber,
  setGlobalLogLevel,
} from '@maverick-js/logger';
import { relative } from 'pathe';
import ts from 'typescript';

import { printFile } from './print';
import type { Transform } from './transformers/transformer';

export interface TransformOptions {
  transform: Transform;
  logLevel?: LogLevelName;
  filename: string;
}

export interface TransformContext {
  /** User provided transform options. */
  readonly options: Readonly<TransformOptions>;
}

const tsxRE = /\.tsx/;

export function transform(source: string, options: TransformOptions) {
  const { transform, logLevel = 'warn', filename } = options;

  setGlobalLogLevel(mapLogLevelStringToNumber(logLevel));

  log(() => `Transforming ${relative(process.cwd(), filename)}`, LogLevel.Info);
  log(options, LogLevel.Verbose);

  // Build AST
  const ctx: TransformContext = {
    options,
  };

  // Transform JSX
  const sourceFile = ts.createSourceFile(filename, source, 99, true, tsxRE.test(filename) ? 4 : 2),
    transformStartTime = process.hrtime(),
    transformedFile = transform({ sourceFile, ctx });

  logTime({ message: `Transformed AST`, startTime: transformStartTime }, LogLevel.Info);

  return { code: printFile(transformedFile) };
}
