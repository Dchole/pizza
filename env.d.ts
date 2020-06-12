declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    PORT: number;
    DB: string;
    SESSION_SECRET: string;
    EMAIL: string;
    PASSWORD: string;
    TOKEN_SECRET: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_WEBHOOK_KEY: string;
  }
}
