declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    PORT: number;
    DB: string;
    SESSION_SECRET: string;
    EMAIL: string;
    PASSWORD: string;
    TOKEN_SECRET: string;
  }
}
