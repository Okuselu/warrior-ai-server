import type { Model, QueryFilter, UpdateQuery } from "mongoose";

/** Shared data-access shape for all domain repositories. Constructors do no I/O. */
export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return (await this.model.findById(id).lean()) as unknown as T | null;
  }

  async find(filter: QueryFilter<T> = {}): Promise<T[]> {
    return (await this.model.find(filter).lean()) as unknown as T[];
  }

  async findOne(filter: QueryFilter<T>): Promise<T | null> {
    return (await this.model.findOne(filter).lean()) as unknown as T | null;
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc.toObject() as unknown as T;
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return (await this.model.findByIdAndUpdate(id, data, { new: true }).lean()) as unknown as T | null;
  }
}
