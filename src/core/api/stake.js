import { stableJoeQuery } from "../queries/sjoe";

import { getApollo } from "../apollo";

export async function getStableJoe(client = getApollo()) {
  const { data } = await client.query({
    query: stableJoeQuery,
    variables: {
      id: "0x1a731b2299e22fbac282e7094eda41046343cb51",
    },
    context: {
      clientName: "sjoe",
    },
  });

  await client.cache.writeQuery({
    query: stableJoeQuery,
    data,
  });

  return await client.cache.readQuery({
    query: stableJoeQuery,
  });
}