import { Schema, model } from "mongoose";
import { AUDIT_ACTIONS, ROLES, type AuditAction, type Role } from "../../../common/constants";

export interface AuditLogRecord {
  audit_id: string;
  actor_user_id: string;
  actor_role: Role;
  action: AuditAction;
  entity: string;
  entity_id: string;
  timestamp: string;
  ip_hash: string;
  /** Required for admin access (data contract §4.13). */
  reason?: string;
}

const auditLogSchema = new Schema<AuditLogRecord>({
  audit_id: { type: String, required: true, unique: true },
  actor_user_id: { type: String, required: true },
  actor_role: { type: String, enum: [...ROLES], required: true },
  action: { type: String, enum: [...AUDIT_ACTIONS], required: true },
  entity: { type: String, required: true },
  entity_id: { type: String, required: true },
  timestamp: { type: String, required: true },
  ip_hash: { type: String, required: true },
  reason: { type: String },
});

// Append-only and never contains health values.
for (const op of ["findOneAndUpdate", "updateOne", "updateMany", "deleteOne", "deleteMany"] as const) {
  auditLogSchema.pre(op, function () {
    throw new Error("AuditLog is append-only");
  });
}

auditLogSchema.index({ actor_user_id: 1, timestamp: -1 });
auditLogSchema.index({ entity: 1, entity_id: 1 });

export const AuditLogModel = model<AuditLogRecord>("AuditLog", auditLogSchema, "audit_logs");
