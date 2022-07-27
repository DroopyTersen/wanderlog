import type { RxJsonSchema } from "rxdb";

export interface RxCollectionDefinition {
  name: string;
  schema: RxJsonSchema<any>;
  buildPullQuery: (doc: { lastSync: string }) => Promise<{
    query: string;
    variables: any;
  }>;
  buildPushQuery: (docs: any[]) => {
    query: string;
    variables: any;
  };
}
