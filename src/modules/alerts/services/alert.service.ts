import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { NotImplementedError } from "../../../common/utils/error.util";
import type { AlertResponseDTO, SendAlertRequestDTO } from "../dtos/alert.dto";
import type { AlertDeliveryRecord } from "../models/alert.model";
import { alertRepository } from "../repository/alert.repository";

export function toAlertResponse(record: AlertDeliveryRecord): AlertResponseDTO {
  return {
    alertId: record.alert_id,
    patientId: record.patient_id,
    channel: record.channel,
    status: record.status,
    createdAt: record.created_at,
  };
}

/**
 * Care-circle alerts. Red statuses must reach the gateway within one minute
 * (PRD F6); consent and contact verification are checked before dispatch.
 */
export class AlertService {
  constructor(private readonly alerts = alertRepository) {}

  async send(_context: RequestContextDTO, _data: SendAlertRequestDTO): Promise<AlertResponseDTO> {
    // Messaging provider, consent check and delivery receipts are open items (PRD §15).
    throw new NotImplementedError("SMS/WhatsApp dispatch");
  }

  async listFailures(_context: RequestContextDTO): Promise<AlertResponseDTO[]> {
    const records = await this.alerts.findFailed();
    return records.map((record) => toAlertResponse(record as AlertDeliveryRecord));
  }
}

export function newAlertService(): AlertService {
  return new AlertService();
}
