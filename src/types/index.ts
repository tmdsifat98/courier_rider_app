export interface Parcel {
  id: string;
  customer: string;
  phone: string;
  address: string;
  amount: number;
  type: 'Regular' | 'Exchange' | 'Partial Delivery' | 'Bill Update';
}

export type ActionType = 'deliver' | 'reschedule' | 'reject';

export interface SyncPayload {
  parcelId: string;
  action: ActionType;
  paymentMethod?: string;
  mfsProvider?: string;
  billAmount?: number | string;
  returnCharge?: string;
  note?: string;
  rescheduleDate?: string;
}

export interface SyncAction {
  id: string;
  type: string;
  payload: SyncPayload;
  timestamp: string;
}

export interface ExchangePartialItem {
  id: string;
  type: 'Exchange' | 'Partial Delivery';
  status: 'Delivered';
  receivedAmount: number;
  originalAmount: number;
}

export interface RiderPerformanceItem {
  name: string;
  cash: number;
  mfs: number;
  total: number;
}

export interface FinancialsData {
  cashCollected: number;
  mfsCollected: number;
  totalCollected: number;
  exchangeAndPartial: ExchangePartialItem[];
  riderPerformance: RiderPerformanceItem[];
}

export interface SwapRequest {
  targetRider: string;
  count: number;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}