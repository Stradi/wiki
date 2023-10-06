type ErrorFormat = {
  statusCode: number;
  message: string;
  code: string;
  action: string;
  additionalData?: any;
};

export default class BaseError extends Error {
  constructor(private error: Partial<ErrorFormat>) {
    super();
  }

  public get statusCode(): number {
    return this.error.statusCode || 500;
  }

  public get message(): string {
    return this.error.message || 'Internal Server Error';
  }

  public get code(): string {
    return this.error.code || 'UNKNOWN_ERROR';
  }

  public get action(): string {
    return (
      this.error.action || 'To be honest, I have no idea what you should do. Please wait for the me to fix it lol.'
    );
  }

  public get additionalData(): any {
    return this.error.additionalData || null;
  }
}
