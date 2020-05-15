export interface Model<T> {
  item: T;
  update: (key: string, value: any) => void;
  checkIsValid(): boolean;
  save(): Promise<any>;
}
