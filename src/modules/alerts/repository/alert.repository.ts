import { BaseRepository } from "../../../common/repository/base.repository";
import { AlertDeliveryModel, type AlertDeliveryRecord } from "../models/alert.model";

export class AlertRepository extends BaseRepository<AlertDeliveryRecord> {
  constructor() {
    super(AlertDeliveryModel);
  }

  findFailed() {
    return this.model.find({ status: "failed" }).lean();
  }
}

export const alertRepository = new AlertRepository();
