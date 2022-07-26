import { useConditionalRedirect } from "core/hooks/useConditionalEffect";
import { useMemo } from "react";
// import { processTags } from "features/tags/tags.data";
import { useMutation, useQuery, UseQueryArgs, UseQueryState } from "urql";

export interface ResourceCrud<T> {
  /** The primary key (empty for "New" forms) */
  resourceId?: number | string;
  /** Urql Query { query, variables } */
  query: UseQueryArgs;
  /** Insert Mutation GQL */
  INSERT: string;
  /** Update Mutation GQL */
  UPDATE: string;
  /** Delete Mutation GQL */
  DELETE: string;
  /** Path to send to after successful Save */
  successRedirect: (data: T) => string;
  /** Path to send to after delete */
  deleteRedirect: (deleteData) => string;
}

export interface ResourceWithTagsHookConfig<T> extends ResourceCrud<T> {
  /** The column in the tag_<resource> lookup table that maps the resource PK */
  tagKey: string;
}

function useResourceCrud<T = any>({
  resourceId,
  query,
  INSERT,
  UPDATE,
  DELETE,
  successRedirect,
  deleteRedirect,
}: ResourceCrud<T>) {
  let [queryResult] = useQuery<T>(query);
  let [insertResult, insertMutation] = useMutation(INSERT);
  let [updateResult, updateMutation] = useMutation(UPDATE);
  let [deleteResult, deleteMutation] = useMutation(DELETE);

  if (queryResult.error) {
    console.error("Wanderlog Error", queryResult.error);
  }

  const { save, deleteItem } = useMemo(() => {
    const save = (values) => {
      let { id, ...formFields } = values;
      if (id) {
        return updateMutation({
          id,
          updates: formFields,
        });
      } else {
        return insertMutation({
          object: formFields,
        });
      }
    };

    let deleteItem = resourceId
      ? () => {
          if (window.confirm("Are you sure?!")) {
            deleteMutation({ id: resourceId });
          }
        }
      : null;
    return { save, deleteItem };
  }, [insertMutation, deleteMutation, updateMutation, resourceId]);

  useConditionalRedirect(insertResult?.data || updateResult?.data, successRedirect);
  useConditionalRedirect(deleteResult?.data, deleteRedirect);

  let error = [queryResult, insertResult, updateResult, deleteResult]
    .filter((result) => result.error)
    .map((result) => result.error.message)
    .join(" | ");

  return {
    data: queryResult.data,
    save,
    deleteItem,
    error,
    loading: queryResult.fetching,
    fetching: [queryResult, insertResult, updateResult, deleteResult].some(
      (result) => result.fetching
    ),
    insertMutation,
    updateMutation,
    deleteMutation,
  };
}

export function useResourceWithTags<T = any>(props: ResourceWithTagsHookConfig<T>) {
  let { resourceId, tagKey } = props;
  let crud = useResourceCrud(props);

  const save = (values) => {
    if (parseInt(resourceId + "")) {
      return updateWithTags(values, crud.updateMutation, tagKey);
    } else {
      return insertWithTags(values, crud.insertMutation);
    }
  };

  return {
    ...crud,
    save,
  };
}

export const updateWithTags = async (values: any, mutation, tagKey) => {
  let { tags = [], id, ...formFields } = values;

  let existingTagIds = tags.filter((t) => t.id !== -1).map((t) => t.id);
  let newTagNames = tags.filter((t) => t.id === -1).map((t) => t.name);

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

export const insertWithTags = async (values: any, mutation) => {
  let { tags = [], ...formFields } = values;
  let existingTagIds = tags.filter((t) => t.id !== -1).map((t) => t.id);
  let newTagNames = tags.filter((t) => t.id === -1).map((t) => t.name);

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
