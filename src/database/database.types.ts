import type { RxJsonSchema } from "rxdb";

export interface RxCollectionDefinition {
  name: string;
  /** Milliseconds for live polling of new stuff */
  liveInterval?: number;
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
