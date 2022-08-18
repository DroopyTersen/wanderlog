import { useEffect, useState } from "react";
import { RxQuery } from "rxdb";
import { z, ZodObject, ZodRawShape } from "zod";
import { RouteSelector, useRouteData } from "~/hooks/useRouteData";

export async function queryCollection<
  Schema extends ZodObject<T>,
  T extends ZodRawShape
>(
  query: RxQuery,
  schema: Schema,
  sortCompare?: (a: z.TypeOf<Schema>, b: z.TypeOf<Schema>) => number
) {
  let docs: any = await query.exec();
  let items = parseRxDocs(docs, schema);
  if (sortCompare) items = items.sort(sortCompare);

  return items;
}

export async function findOneEntity<
  Schema extends ZodObject<T>,
  T extends ZodRawShape
>(query: RxQuery, schema: Schema) {
  let doc: any = await query.exec();

  let [result] = parseRxDocs([doc], schema);
  return result;
}

export function useCollection<
  Schema extends ZodObject<T>,
  T extends ZodRawShape
>(
  query: RxQuery,
  selector: RouteSelector,
  schema: Schema,
  sortCompare?: (a: z.TypeOf<Schema>, b: z.TypeOf<Schema>) => number
) {
  let routeData = useRouteData(selector) as T[];
  let [items, setItems] = useState<z.TypeOf<Schema>[]>(() => {
    return routeData || [];
  });

  useEffect(() => {
    query.$.subscribe((docs) => {
      let newItems = parseRxDocs(docs, schema);
      if (sortCompare) newItems = newItems.sort(sortCompare);
      setItems(newItems);
    });
    () => {
      query.$.unsubscribe();
    };
  }, []);

  return items;
}
export function useEntity<Schema extends ZodObject<T>, T extends ZodRawShape>(
  query: RxQuery,
  selector: RouteSelector,
  schema: Schema
) {
  let routeData = useRouteData(selector) as T;
  let [item, setItem] = useState<z.TypeOf<Schema>>(() => {
    return routeData || null;
  });

  useEffect(() => {
    query.$.subscribe((doc) => {
      let items = parseRxDocs([doc], schema);
      setItem(items?.[0]);
    });
    () => {
      query.$.unsubscribe();
    };
  }, []);

  return item;
}

export const parseRxDocs = <Schema extends ZodObject<T>, T extends ZodRawShape>(
  docs: any[],
  schema: Schema
): z.TypeOf<Schema>[] => {
  if (docs) {
    try {
      return docs
        .map((doc) => {
          try {
            return schema.parse(doc);
          } catch (err) {
            console.error(err, JSON.stringify(doc, null, 2));
            return null as any;
          }
        })
        .filter(Boolean);
    } catch (err) {
      console.error("Unable to parse RX docs to Zod object", err, docs);
      return [];
    }
  }
  return [];
};
