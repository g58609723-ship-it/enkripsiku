declare module 'escodegen' {
  export interface GenerateOptions {
    format?: {
      compact?: boolean;
      indent?: {
        style?: string;
        base?: number;
      };
      newline?: string;
      space?: string;
      json?: boolean;
      renumber?: boolean;
      hexadecimal?: boolean;
      quotes?: string;
      escapeless?: boolean;
      parentheses?: boolean;
      semicolons?: boolean;
      safeConcatenation?: boolean;
      preserveBlankLines?: boolean;
    };
    comment?: boolean;
    sourceMap?: string;
    sourceMapRoot?: string;
    sourceMapWithCode?: boolean;
    directive?: boolean;
    raw?: boolean;
    verbatim?: string;
  }

  export function generate(ast: any, options?: GenerateOptions): string;
  export function generate(ast: any): string;
}