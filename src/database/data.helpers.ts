import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { RxQuery } from "rxdb";
import { z, ZodObject, ZodRawShape } from "zod";

export async function queryEntity<
  Schema extends ZodObject<T>,
  T extends ZodRawShape
>(query: RxQuery, schema: Schema) {
  let docs: any = await query.exec();
  return parseRxDocs(docs, schema);
}

export async function findOneEntity<
  Schema extends ZodObject<T>,
  T extends ZodRawShape
>(query: RxQuery, schema: Schema) {
  let doc: any = await query.exec();
  let [result] = parseRxDocs([doc], schema);
  return result;
}

export function useEntity<Schema extends ZodObject<T>, T extends ZodRawShape>(
  query: RxQuery,
  loaderDataProperty: string,
  schema: Schema
) {
  let loaderData = useLoaderData() as any;
  let [items, setItems] = useState<z.TypeOf<Schema>[]>(() => {
    return loaderData?.[loaderDataProperty] || [];
  });

  useEffect(() => {
    query.$.subscribe((docs) => {
      setItems(parseRxDocs(docs, schema));
    });
    () => {
      query.$.unsubscribe();
    };
  }, []);

  return items;
}

export const parseRxDocs = <Schema extends ZodObject<T>, T extends ZodRawShape>(
  docs: any[],
  schema: Schema
): z.TypeOf<Schema>[] => {
  if (docs) {
    try {
      return docs.map((doc) => {
        return schema.parse(doc);
      });
    } catch (err) {
      console.error("Unable to parse RX docs to Zod object", err, docs);
      return [];
    }
  }
  return [];
};
