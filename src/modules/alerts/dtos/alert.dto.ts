export interface SendAlertRequestDTO {
  patientId: string;
  contactId: string;
  reasonCode: string;
  channel: "sms" | "whatsapp";
  statusLine: string;
}

export interface AlertResponseDTO {
  alertId: string;
  patientId: string;
  channel: "sms" | "whatsapp";
  status: "queued" | "sent" | "failed";
  createdAt: string;
}
