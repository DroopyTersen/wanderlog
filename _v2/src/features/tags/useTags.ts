import { useQuery } from "urql";

const TAGS_QUERY = `query GetTags {
    tags {
      name
      id
      author_id
    }
  }
`;

export default function useTags() {
  let [{ data }] = useQuery({ query: TAGS_QUERY });
  return data?.tags ?? [];
}
