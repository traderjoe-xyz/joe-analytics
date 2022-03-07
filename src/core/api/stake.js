import { stableJoeDayDatasQuery, stableJoeQuery } from "../queries/sjoe";
import { moneyMakerDayDatasQuery, moneyMakerQuery, remittancesQuery } from "../queries/moneymaker";

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

export async function getStableJoeDayDatas(client = getApollo()) {
  const { data } = await client.query({
    query: stableJoeDayDatasQuery,
    context: {
      clientName: "sjoe",
    },
  });

  await client.cache.writeQuery({
    query: stableJoeDayDatasQuery,
    data,
  });

  return await client.cache.readQuery({
    query: stableJoeDayDatasQuery,
  });
}

export async function getMoneyMaker(client = getApollo()) {
  const { data } = await client.query({
    query: moneyMakerQuery,
    variables: {
      id: "0x63c0cf90ae12190b388f9914531369ac1e4e4e47",
    },
    context: {
      clientName: "moneymaker",
    },
  });

  await client.cache.writeQuery({
    query: moneyMakerQuery,
    data,
  });

  return await client.cache.readQuery({
    query: moneyMakerQuery,
  });
}

export async function getMoneyMakerDayDatas(client = getApollo()) {
  const { data } = await client.query({
    query: moneyMakerDayDatasQuery,
    context: {
      clientName: "moneymaker",
    },
  });

  await client.cache.writeQuery({
    query: moneyMakerDayDatasQuery,
    data,
  });

  return await client.cache.readQuery({
    query: moneyMakerDayDatasQuery,
  });
}
 
export async function getRemittances(client = getApollo()) {
  const { data } = await client.query({
    query: remittancesQuery,
    variables: {
      first: 500,
    },
    context: {
      clientName: "moneymaker",
    },
  });

  await client.cache.writeQuery({
    query: remittancesQuery,
    data,
  });

  return await client.cache.readQuery({
    query: remittancesQuery,
  });
}