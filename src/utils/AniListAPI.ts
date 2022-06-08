import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient("https://graphql.anilist.co", {
    redirect: "follow"
});

const fetch = (query: string, variables: any) =>
    client
        .request(query, variables)
        .then(data => data)
        .catch(error => ({
            error: error.response.errors[0] || "Unknown Error"
        }));

export default fetch;