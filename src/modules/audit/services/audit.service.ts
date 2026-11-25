import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import { newId } from "../../../common/utils/id";
import type { AuditResponseDTO, LogAuditRequestDTO } from "../dtos/audit.dto";
import type { AuditLogRecord } from "../models/audit.model";
import { auditRepository } from "../repository/audit.repository";

export function toAuditResponse(record: AuditLogRecord): AuditResponseDTO {
  return {
    auditId: record.audit_id,
    actorUserId: record.actor_user_id,
    actorRole: record.actor_role,
    action: record.action,
    entity: record.entity,
    entityId: record.entity_id,
    timestamp: record.timestamp,
  };
}

/** Append-only audit writes; health values are never included in an audit row. */
export class AuditService {
  constructor(private readonly audits = auditRepository) {}

  async log(_context: RequestContextDTO, data: LogAuditRequestDTO): Promise<AuditResponseDTO> {
    if (data.actorRole === "admin" && !data.reason) {
      throw new Error("reason is required for admin access");
    }

    const record = await this.audits.create({
      audit_id: newId(),
      actor_user_id: data.actorUserId,
      actor_role: data.actorRole,
      action: data.action,
      entity: data.entity,
      entity_id: data.entityId,
      timestamp: nowISO(),
      ip_hash: data.ipHash,
      reason: data.reason,
    });
    return toAuditResponse(record);
  }

  async listByEntity(
    _context: RequestContextDTO,
    entity: string,
    entityId: string
  ): Promise<AuditResponseDTO[]> {
    const records = await this.audits.findByEntity(entity, entityId);
    return records.map((record) => toAuditResponse(record as AuditLogRecord));
  }
}

export function newAuditService(): AuditService {
  return new AuditService();
}
