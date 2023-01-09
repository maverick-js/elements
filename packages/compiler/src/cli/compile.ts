import kleur from 'kleur';
import { resolve } from 'pathe';
import ts from 'typescript';

import { log, LogLevel, reportDiagnosticByLine } from '../utils/logger';
import { isUndefined } from '../utils/unit';

const defaultOptions: ts.CompilerOptions = {
  noEmitOnError: false,
  allowJs: true,
  experimentalDecorators: true,
  target: ts.ScriptTarget.ES2020,
  downlevelIteration: true,
  module: ts.ModuleKind.ESNext,
  strictNullChecks: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
  noEmit: true,
  pretty: true,
  allowSyntheticDefaultImports: true,
  allowUnreachableCode: true,
  allowUnusedLabels: true,
  skipDefaultLibCheck: true,
};

export function readTsConfigFile(root: string): ts.CompilerOptions | undefined {
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, 'tsconfig.json');

  log(
    () =>
      !isUndefined(configPath)
        ? `using TS config file: ${configPath}`
        : `could not find TS config file from: ${root} [using default]`,
    LogLevel.Info,
  );

  const tsConfig = !isUndefined(configPath)
    ? ts.readConfigFile(configPath!, ts.sys.readFile).config
    : undefined;

  return tsConfig;
}

export interface CompileResult {
  program: ts.Program;
  files: ts.SourceFile[];
}

export function compileOnce(
  filePaths: string[],
  options: ts.CompilerOptions = defaultOptions,
): ts.Program {
  return ts.createProgram(filePaths, options);
}

const tsDiagnosticCategoryToLogLevel: Record<ts.DiagnosticCategory, LogLevel> = {
  [ts.DiagnosticCategory.Warning]: LogLevel.Warn,
  [ts.DiagnosticCategory.Error]: LogLevel.Error,
  [ts.DiagnosticCategory.Message]: LogLevel.Info,
  [ts.DiagnosticCategory.Suggestion]: LogLevel.Info,
};

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  const sourceFile = diagnostic.file;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine);
  const logLevel = tsDiagnosticCategoryToLogLevel[diagnostic.category];
  const pos = diagnostic.start
    ? sourceFile?.getLineAndCharacterOfPosition(diagnostic.start)
    : undefined;
  if (isUndefined(sourceFile) || isUndefined(pos)) {
    log(message, logLevel);
  } else {
    reportDiagnosticByLine(message, sourceFile, pos.line + 1, logLevel);
  }
}

function reportWatchStatusChanged(diagnostic: ts.Diagnostic) {
  log(`[${kleur.yellow(diagnostic.code)}] ${diagnostic.messageText}`, LogLevel.Info);
}

export function compileAndWatch(
  configFileName: string,
  onProgramCreate: (program: ts.Program) => void | Promise<void>,
) {
  const host = ts.createWatchCompilerHost(
    configFileName,
    {},
    ts.sys,
    ts.createSemanticDiagnosticsBuilderProgram,
    // Ignore diagnostic errors.
    () => {},
    () => {},
    // reportDiagnostic,
    // reportWatchStatusChanged,
  );

  const afterProgramCreate = host.afterProgramCreate!;
  host.afterProgramCreate = async (builderProgram) => {
    const program = builderProgram.getProgram();
    afterProgramCreate(builderProgram);
    await onProgramCreate(program);
  };

  return ts.createWatchProgram(host);
}

export async function transpileModuleOnce(filePath: string): Promise<unknown> {
  const { existsSync, mkdirSync, readFileSync, writeFileSync } = await import('node:fs');

  const sourceText = readFileSync(filePath, 'utf8').toString();

  const transpiledResult = ts.transpileModule(sourceText, {
    compilerOptions: defaultOptions,
  });

  const tmpDir = resolve(process.cwd(), 'node_modules/.temp');

  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir);
  }

  const transpiledFilePath = resolve(tmpDir, 'config.mjs');
  writeFileSync(transpiledFilePath, transpiledResult.outputText);

  try {
    return (await import(transpiledFilePath + `?t=${Date.now()}`))?.default ?? [];
  } catch (e) {
    return {};
  }
}
