export interface ThemeConfigOptions {
  source?: string;
  buildPath?: string;
  themeName?: string;
}

export declare function config(options?: ThemeConfigOptions): void;
