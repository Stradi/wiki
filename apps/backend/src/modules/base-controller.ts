import { Context, Hono } from 'hono';
import zod from 'zod';
import BaseError from '../utils/errors/base-error';
import ValidationError from '../utils/errors/validation-error';

export type ResponseTypes = Promise<Response> | Response;

export type Controller = {
  _app: Hono;

  router(): Hono;

  validate<T>(ctx: Context, schema: zod.Schema<T>): Promise<T>;

  ok(ctx: Context, additionalData: any, message?: string): ResponseTypes;
  created(ctx: Context, additionalData: any, message?: string): ResponseTypes;
  noContent(ctx: Context, message?: string): ResponseTypes;
  badRequest(ctx: Context, message?: string): ResponseTypes;
  notAllowed(ctx: Context, message?: string): ResponseTypes;
  notFound(ctx: Context, message?: string): ResponseTypes;
  internalServerError(ctx: Context, message?: string): ResponseTypes;
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

  public ok(ctx: Context, data: any, message?: string): ResponseTypes {
    ctx.status(200);
    return ctx.json({
      error: null,
      data,
      message: message || 'OK',
    });
  }

  public created(ctx: Context, data: any, message?: string): ResponseTypes {
    ctx.status(201);
    return ctx.json({
      error: null,
      data,
      message: message || 'Created',
    });
  }

  public noContent(ctx: Context, message?: string): ResponseTypes {
    ctx.status(204);
    return ctx.json({
      error: null,
      data: {},
      message: message || 'No Content',
    });
  }

  public badRequest(ctx: Context, message?: string): ResponseTypes {
    ctx.status(400);
    return ctx.json({
      error: null,
      data: {},
      message: message || 'Bad Request',
    });
  }

  public notAllowed(ctx: Context, message?: string): ResponseTypes {
    ctx.status(405);
    return ctx.json({
      error: null,
      data: {},
      message: message || 'Not Allowed',
    });
  }

  public notFound(ctx: Context, message?: string): ResponseTypes {
    ctx.status(404);
    return ctx.json({
      error: null,
      data: {},
      message: message || 'Not Found',
    });
  }

  public internalServerError(ctx: Context, message?: string): ResponseTypes {
    ctx.status(500);
    return ctx.json({
      error: null,
      data: {},
      message: message || 'Internal Server Error',
    });
  }
}
