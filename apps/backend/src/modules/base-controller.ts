import { Context, Hono } from 'hono';
import zod from 'zod';
import BaseError from '../utils/errors/base-error';
import ValidationError from '../utils/errors/validation-error';
import { ResponseStatus, resp } from '../utils/response';

export type ResponseTypes = Promise<Response> | Response;

type SuccessResponseData = Partial<{
  message: string;
  payload: any;
}>;

type ErrorResponseData = Partial<{
  code: string;
  message: string;
  action: string;
}>;

export type Controller = {
  _app: Hono;

  router(): Hono;

  validate<T>(ctx: Context, schema: zod.Schema<T>): Promise<T>;

  ok(ctx: Context, additionalData?: SuccessResponseData): ResponseTypes;
  created(ctx: Context, additionalData?: SuccessResponseData): ResponseTypes;
  noContent(ctx: Context, additionalData?: Omit<SuccessResponseData, 'payload'>): ResponseTypes;
  badRequest(ctx: Context, additionalData?: ErrorResponseData): ResponseTypes;
  notAllowed(ctx: Context, additionalData?: ErrorResponseData): ResponseTypes;
  notFound(ctx: Context, additionalData?: ErrorResponseData): ResponseTypes;
  internalServerError(ctx: Context, additionalData?: ErrorResponseData): ResponseTypes;
};

export default class BaseController implements Controller {
  _app = new Hono();

  public router(): Hono {
    throw new Error('Method not implemented.');
  }

  public async validate<T>(ctx: Context, schema: zod.Schema<T>): Promise<T> {
    try {
      const body = await ctx.req.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof zod.ZodError) {
        throw new ValidationError(error);
      }

      throw new BaseError({
        message: 'Request body could not be parsed.',
        code: 'REQUEST_BODY_PARSE_ERROR',
        action: 'Make sure that the request body is a valid JSON.',
        statusCode: 400,
      });
    }
  }

  public ok(ctx: Context, additionalData: SuccessResponseData = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.OK,
      data: {
        message: additionalData.message || 'Ok',
        payload: additionalData.payload || null,
      },
    });

    ctx.status(200);
    return ctx.json(responseObj);
  }

  public created(ctx: Context, additionalData: SuccessResponseData = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.CREATED,
      data: {
        message: additionalData.message || 'Created',
        payload: additionalData.payload || null,
      },
    });

    ctx.status(201);
    return ctx.json(responseObj);
  }

  public noContent(ctx: Context, additionalData: Omit<SuccessResponseData, 'payload'> = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.NO_CONTENT,
      data: {
        message: additionalData.message || 'No content',
        payload: null,
      },
    });

    ctx.status(204);
    return ctx.json(responseObj);
  }

  public badRequest(ctx: Context, additionalData: ErrorResponseData = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.BAD_REQUEST,
      data: {
        code: additionalData.code || 'BAD_REQUEST',
        message: additionalData.message || 'Bad Request',
        action: additionalData.action || 'Please make sure that the request payload is matching the schema.',
      },
    });

    ctx.status(400);
    return ctx.json(responseObj);
  }

  public notAllowed(ctx: Context, additionalData: ErrorResponseData = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.NOT_ALLOWED,
      data: {
        code: additionalData.code || 'NOT_ALLOWED',
        message: additionalData.message || 'Not Allowed',
        action:
          additionalData.action ||
          'This request method is not allowed. Are you sure you are using the correct HTTP verb?',
      },
    });

    ctx.status(405);
    return ctx.json(responseObj);
  }

  public notFound(ctx: Context, additionalData: ErrorResponseData = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.NOT_FOUND,
      data: {
        code: additionalData.code || 'NOT_FOUND',
        message: additionalData.message || 'Not Found',
        action: additionalData.action || 'This resource does not exist.',
      },
    });

    ctx.status(404);
    return ctx.json(responseObj);
  }

  public internalServerError(ctx: Context, additionalData: ErrorResponseData = {}): ResponseTypes {
    const responseObj = resp({
      status: ResponseStatus.INTERNAL_SERVER_ERROR,
      data: {
        code: additionalData.code || 'INTERNAL_SERVER_ERROR',
        message: additionalData.message || 'Internal Server Error',
        action:
          additionalData.action ||
          "Whoops! Something went horribly wrong and I don't know what to do. Please try again later.",
      },
    });

    ctx.status(500);
    return ctx.json(responseObj);
  }
}
