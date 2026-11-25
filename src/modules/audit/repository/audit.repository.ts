import { BaseRepository } from "../../../common/repository/base.repository";
import { AuditLogModel, type AuditLogRecord } from "../models/audit.model";

export class AuditRepository extends BaseRepository<AuditLogRecord> {
  constructor() {
    super(AuditLogModel);
  }

  findByEntity(entity: string, entity_id: string) {
    return this.model.find({ entity, entity_id }).sort({ timestamp: -1 }).lean();
  }
}

export const auditRepository = new AuditRepository();
