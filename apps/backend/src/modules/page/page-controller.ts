import { Prisma as PrismaNS } from '@prisma/client';

import { z } from 'zod';
import { queryToPrismaSort, queryToPrismaWhere } from '../../utils/qs';
import CrudController, {
  CreateSignature,
  DeleteSignature,
  EditSignature,
  IndexSignature,
  ShowSignature,
} from '../crud-controller';
import PageService from './page-service';

export default class PageController extends CrudController {
  private _service = PageService.getInstance();

  public index: IndexSignature = async (ctx) => {
    const filter = queryToPrismaWhere(ctx.req.queries('filter') || []) as PrismaNS.PageWhereInput;
    const sort = queryToPrismaSort(ctx.req.queries('sort') || []) as PrismaNS.PageOrderByWithRelationInput;
    const offset = Number(ctx.req.query('offset')) || 0;
    const limit = Number(ctx.req.query('limit')) || 10;

    const records = await this._service.getPages({
      filter,
      sort,
      offset,
      limit,
    });

    return this.ok(ctx, {
      message: 'Page records retrieved successfully.',
      payload: records,
    });
  };

  public create: CreateSignature = async (ctx) => {
    const bodySchema = z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
    });

    const body = await this.validate(ctx, bodySchema);

    const record = await this._service.createNewPage({
      title: body.title,
      slug: body.slug,
    });

    return this.created(ctx, {
      message: 'Page record created successfully.',
      payload: record,
    });
  };

  // SUGGESTION: We should probably have seperate getById and getBySlug API routes.
  public show: ShowSignature = async (ctx) => {
    const param = ctx.req.param('id');
    const record = await this._service.getByIdOrSlug(param);

    if (!record) {
      return this.notFound(ctx, {
        message: 'Page record not found.',
      });
    }

    return this.ok(ctx, {
      message: 'Page record retrieved successfully.',
      payload: record,
    });
  };

  public edit: EditSignature = async (ctx) => {
    const param = ctx.req.param('id');
    const bodySchema = z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
    });

    const body = await this.validate(ctx, bodySchema);
    const record = await this._service.getByIdOrSlug(param);

    if (!record) {
      return this.notFound(ctx, {
        message: 'Page record not found.',
      });
    }

    const updatedRecord = await this._service.updatePage(record.id, {
      title: body.title,
      slug: body.slug,
    });

    return this.ok(ctx, {
      message: 'Page record updated successfully.',
      payload: updatedRecord,
    });
  };

  public delete: DeleteSignature = async (ctx) => {
    const param = ctx.req.param('id');
    const record = await this._service.getByIdOrSlug(param);

    if (!record) {
      return this.notFound(ctx, {
        message: 'Page record not found.',
      });
    }

    await this._service.deletePage(record.id);

    return this.ok(ctx, {
      message: 'Page record deleted successfully.',
    });
  };
}
