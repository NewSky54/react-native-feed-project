import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const makeApolloClient = (token) => {
  // create apollo link instance
  const link = new HttpLink({
    uri: "https://mavely.top/",
    headers: {
      // TODO: Build out login page (not signup, re-route to web app) and store token
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsMG9lbWptcjAwNHQwODI0bjhpOTg0Y3QiLCJlbWFpbCI6InNreWxlcmVzY29iZWRvQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpc1Byb0FjY291bnQiOmZhbHNlLCJicmFuZFNsdWdzIjpbXSwiaWF0IjoxNjQ3MTI0ODE2LCJleHAiOjE2NTQ5MDA4MTZ9.NvyuRFI2xUAwt0Azj1bvKy48FVQA_vHLfb-U_GcvZm4`,
      // Authorization: `Bearer ${token}`,
    },
  });

  // create an inmemory cache instance for caching graphql data
  const cache = new InMemoryCache();

  // instantiate apollo client with apollo link instance and cache instance
  const client = new ApolloClient({
    link,
    cache,
  });

  console.log(client);

  return client;
};

export default makeApolloClient;
