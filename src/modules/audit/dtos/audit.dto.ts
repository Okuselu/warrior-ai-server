import type { AuditAction, Role } from "../../../common/constants";

export interface LogAuditRequestDTO {
  actorUserId: string;
  actorRole: Role;
  action: AuditAction;
  entity: string;
  entityId: string;
  ipHash: string;
  reason?: string;
}

export interface AuditResponseDTO {
  auditId: string;
  actorUserId: string;
  actorRole: Role;
  action: AuditAction;
  entity: string;
  entityId: string;
  timestamp: string;
}
