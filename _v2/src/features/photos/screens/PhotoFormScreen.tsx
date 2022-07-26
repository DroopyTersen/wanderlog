const INSERT_MUTATION = `
mutation AddPhoto($object: photos_insert_input!) {
    insert_photos_one(object: $object) {
      id
      thumbnail
      url
      date
      blurred
    }
  }
  
`;
