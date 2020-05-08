import gql from 'graphql-tag';

export const GET_SCRIPTTAGS = gql`
  query {
    scriptTags(first: 5) {
      edges {
        node {
          id
          displayScope
          src
        }
      }
    }
  }
`;

export const GET_SCRIPTTAG = gql`
  query scriptTag($id: ID!) {
    scriptTag(id: $id) {
      id
      displayScope
      src
    }
  }
`;

export const INSTALL_SCRIPTTAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
        displayScope
        src
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_SCRIPTTAG = gql`
  mutation scriptTagUpdate($id: ID!, $input: ScriptTagInput!) {
    scriptTagUpdate(id: $id, input: $input) {
      scriptTag {
        id
        displayScope
        src
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const DELETE_SCRIPTTAG = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`;
