import gql from "graphql-tag"

export const stableJoeQuery = gql`
  query stableJoeQuery($id: String!) {
    stableJoe(id: $id) {
        id
        joeStaked
      }
  }
`;

export const stableJoeDayDatasQuery = gql`
  query stableJoeDayDatasQuery {
    stableJoeDayDatas(orderBy: date, orderDirection: desc) {
      id
      date
      totalJoeStaked
    }
  }
`
