export enum ResponseStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_ALLOWED = 405,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

type SuccessResponseOptions = {
  status: ResponseStatus.OK | ResponseStatus.CREATED | ResponseStatus.NO_CONTENT;
  data: {
    message: string;
    payload: any | null;
  };
};

type ErrorResponseOptions = {
  status:
    | ResponseStatus.BAD_REQUEST
    | ResponseStatus.NOT_ALLOWED
    | ResponseStatus.NOT_FOUND
    | ResponseStatus.INTERNAL_SERVER_ERROR;
  data: {
    code: string;
    message: string;
    action?: string;
  };
};

export type ResponseOptions = SuccessResponseOptions | ErrorResponseOptions;

export function resp(opts: ResponseOptions) {
  if (isErrorResponse(opts)) {
    return {
      success: false,
      data: null,
      error: {
        code: opts.data.code,
        message: opts.data.message,
        action: opts.data.action,
      },
    };
  } else {
    return {
      success: true,
      data: {
        message: opts.data.message,
        payload: opts.data.payload,
      },
      error: null,
    };
  }
}

function isErrorResponse(options: ResponseOptions): options is ErrorResponseOptions {
  return options.status >= 400;
}
