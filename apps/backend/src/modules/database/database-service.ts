import { PrismaClient } from '@prisma/client';

export default class DatabaseService {
  public static getInstance() {
    return new PrismaClient();
  }
}
