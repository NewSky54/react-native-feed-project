import React from "react";
import { gql } from "@apollo/client";

export const PRODUCTS_QUERY = gql`
  query products($first: Int, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      aggregate {
        count
      }
      edges {
        cursor
        node {
          id
          name
          priceAmountPretty
          createdAt
          image {
            src
            width
            height
          }
        }
      }
    }
  }
`;
