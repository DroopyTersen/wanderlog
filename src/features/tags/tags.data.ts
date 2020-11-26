export interface Tag {
  name: string;
  id: number;
}

export const processTags = (tagNames: string[], existingTags: Tag[]) => {
  let newTagNames = tagNames.filter((tagName) => !existingTags.find((t) => t.name === tagName));
  let existingTagIds = tagNames
    .map((tagName) => existingTags.find((t) => t.name === tagName))
    .filter(Boolean)
    .map((t) => t.id);

  return {
    newTagNames,
    existingTagIds,
  };
};
