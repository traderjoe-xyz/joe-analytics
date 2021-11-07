import { AppShell, PoolTable } from "app/components";
import { getApollo, getPools, poolsQuery, useInterval } from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

function PoolsPage() {
  const {
    data: { pools },
  } = useQuery(poolsQuery, {
    context: {
      clientName: "masterchef",
    },
  });

  useInterval(getPools, 1800000);

  return (
    <AppShell>
      <Head>
        <title>Pools | Trader Joe Analytics</title>
      </Head>
      <PoolTable pools={pools} orderBy="tvl" order="desc" rowsPerPage={100} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getPools(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default PoolsPage;
