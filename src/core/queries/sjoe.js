import gql from "graphql-tag"

export const stableJoeQuery = gql`
  query stableJoeQuery($id: String!) {
    stableJoe(id: $id) {
        id
        joeStaked
      }
  }
`;