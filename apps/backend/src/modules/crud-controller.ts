import { Context, Env, Next } from 'hono';
import BaseController, { ResponseTypes } from './base-controller';

export type IndexSignature = (ctx: Context<Env, '/'>, next?: Next) => ResponseTypes;
export type CreateSignature = (ctx: Context<Env, '/'>, next?: Next) => ResponseTypes;
export type ShowSignature = (ctx: Context<Env, '/:id'>, next?: Next) => ResponseTypes;
export type EditSignature = (ctx: Context<Env, '/:id'>, next?: Next) => ResponseTypes;
export type DeleteSignature = (ctx: Context<Env, '/:id'>, next?: Next) => ResponseTypes;

type TCrudController = {
  index: IndexSignature;
  create: CreateSignature;
  show: ShowSignature;
  edit: EditSignature;
  delete: DeleteSignature;
};

export default class CrudController extends BaseController implements TCrudController {
  public router() {
    this._app.get('/', this.index);
    this._app.post('/', this.create);
    this._app.get('/:id', this.show);
    this._app.put('/:id', this.edit);
    this._app.delete('/:id', this.delete);

    return this._app;
  }

  public index: IndexSignature = (ctx) => {
    return this.notAllowed(ctx);
  };

  public create: CreateSignature = (ctx) => {
    return this.notAllowed(ctx);
  };

  public show: ShowSignature = (ctx) => {
    return this.notAllowed(ctx);
  };

  public edit: EditSignature = (ctx) => {
    return this.notAllowed(ctx);
  };

  public delete: DeleteSignature = (ctx) => {
    return this.notAllowed(ctx);
  };
}
