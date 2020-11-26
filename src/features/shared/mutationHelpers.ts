import { useConditionalRedirect } from "core/hooks/useConditionalEffect";
import { processTags } from "features/tags/tags.data";
import { useMutation, useQuery, UseQueryArgs, UseQueryState } from "urql";

export interface ResourceWithTagsHookConfig<T> {
  /** The primary key */
  resourceId: number | string;
  /** Urql Query { query, variables } */
  query: UseQueryArgs;
  /** Insert Mutation GQL */
  INSERT: string;
  /** Update Mutation GQL */
  UPDATE: string;
  /** The column in the tag_<resource> lookup table that maps the resource PK */
  tagKey: string;
  /** On Success */
  successRedirect: (data: T) => string;
}
export function useResourceWithTags<T extends { tags: any } = any>({
  resourceId,
  query,
  INSERT,
  UPDATE,
  successRedirect,
  tagKey,
}: ResourceWithTagsHookConfig<T>) {
  let [queryResult] = useQuery<T>(query);
  let [insertResult, insertMutation] = useMutation(INSERT);
  let [updateResult, updateMutation] = useMutation(UPDATE);

  if (queryResult.error) {
    console.error("Wanderlog Error", queryResult.error);
  }
  const save = (values) => {
    console.log("SAVE", resourceId, values);
    if (parseInt(resourceId + "")) {
      return updateWithTags(values, updateMutation, queryResult.data.tags, tagKey);
    } else {
      return insertWithTags(values, insertMutation, queryResult.data.tags);
    }
  };

  useConditionalRedirect(insertResult?.data || updateResult?.data, successRedirect);

  return {
    ...queryResult,
    save,
  };
}

export const updateWithTags = async (values: any, mutation, existingTags, tagKey) => {
  let { tags = [], id, ...formFields } = values;

  let { existingTagIds, newTagNames } = processTags(tags, existingTags);
  let tagsInput = [
    ...newTagNames.map((name) => ({
      tag: {
        data: { name },
      },
      [tagKey]: id,
    })),
    ...existingTagIds.map((tag_id) => ({ tag_id, [tagKey]: id })),
  ];
  let variables = {
    id: id,
    updates: formFields,
    tagsInput,
  };
  let { error, data } = await mutation(variables);
  if (error) throw error;
  return data;
};

export const insertWithTags = async (values: any, mutation, existingTags) => {
  let { tags: tagNames = [], ...formFields } = values;
  let { newTagNames, existingTagIds } = processTags(tagNames, existingTags);
  let tagsInput = [
    ...newTagNames.map((name) => ({ tag: { data: { name } } })),
    ...existingTagIds.map((tag_id) => ({ tag_id })),
  ];
  let variables = {
    object: {
      ...formFields,
      tags: {
        data: tagsInput,
      },
    },
  };
  let { error, data } = await mutation(variables);
  if (error) throw error;
  return data;
};
