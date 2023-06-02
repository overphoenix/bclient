interface Options {
  ssl?: boolean | null;
  strictSSL?: boolean | null;
  host?: string | null;
  port?: number | null;
  path?: string | null;
  headers?: object | null;
  apiKey?: string | null;
  key?: string | null;
  username?: string | null;
  password?: string | null;
  id?: string | null;
  token?: string | null;
  timeout?: number | null;
  limit?: number | null;
  url?: string | null;
}

export declare class ClientOptions {
  ssl?: boolean | null;
  strictSSL?: boolean | null;
  host?: string | null;
  port?: number | null;
  path?: string | null;
  headers?: object | null;
  username?: string | null;
  password?: string | null;
  id?: string | null;
  token?: string | null;
  timeout?: number | null;
  limit?: number | null;
  constructor(options?: Options);
  fromOptions(options: string | Options): this;
}
