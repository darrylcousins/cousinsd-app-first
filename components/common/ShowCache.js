import { useApolloClient } from '@apollo/client';

export const printCache = () => {
  const client = useApolloClient();
  console.log(client.cache.data.data);
};

