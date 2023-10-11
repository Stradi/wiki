import { Page, Prisma as PrismaNS } from '@prisma/client';
import BaseError from '../../utils/errors/base-error';
import DatabaseService from '../database/database-service';

let instance: null | PageService = null;

export default class PageService {
  private _db = DatabaseService.getInstance();

  public static getInstance() {
    if (!instance) {
      instance = new PageService();
    }

    return instance;
  }

  public async getPages(options: {
    filter: PrismaNS.PageWhereInput;
    sort: PrismaNS.PageOrderByWithRelationInput;
    offset: number;
    limit: number;
  }) {
    return this._db.page.findMany({
      where: options.filter,
      orderBy: options.sort,
      skip: options.offset,
      take: options.limit,
    });
  }

  public async createNewPage(data: { title: string; slug: string }) {
    const existingRecord = await this._db.page.count({
      where: {
        slug: data.slug,
      },
    });

    if (existingRecord) {
      throw new BaseError({
        code: 'ALREADY_EXISTS',
        action: 'Please provide a unique slug.',
        message: 'A page with this slug already exists.',
        statusCode: 409,
      });
    }

    const newRecord = await this._db.page.create({
      data: {
        title: data.title,
        slug: data.slug,
      },
    });

    return newRecord;
  }

  public async getPageById(id: number) {
    const record = await this._db.page.findUnique({
      where: {
        id,
      },
    });

    return record;
  }

  public async getPageBySlug(slug: string) {
    const record = await this._db.page.findUnique({
      where: {
        slug,
      },
    });

    return record;
  }

  public async updatePage(
    id: number,
    data: {
      title?: string;
      slug?: string;
    }
  ) {
    const updatedRecord = await this._db.page.update({
      where: {
        id,
      },
      data: {
        title: data.title,
        slug: data.slug,
      },
    });

    return updatedRecord;
  }

  public async deletePage(id: number) {
    const deletedRecord = await this._db.page.delete({
      where: {
        id,
      },
    });

    return deletedRecord;
  }

  public async getByIdOrSlug(param: string) {
    let record: null | Page = null;

    if (isNaN(Number(param))) {
      record = await this.getPageBySlug(param);
    } else {
      record = await this.getPageById(Number(param));
    }

    return record;
  }
}
