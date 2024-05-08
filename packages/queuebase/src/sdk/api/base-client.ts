export abstract class BaseClient {
  protected readonly _publicKey: string;
  protected readonly _queuebaseUrl: string;

  constructor(publicKey: string, queuebaseUrl?: string) {
    this._publicKey = publicKey;
    this._queuebaseUrl = queuebaseUrl ?? "https://www.queuebase.com/api/v1";
  }
}
