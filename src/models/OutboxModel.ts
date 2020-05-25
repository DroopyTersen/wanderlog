export interface OutboxItem {
  id?: string;
  date: Date;
  action: string;
  payload?: any;
}
