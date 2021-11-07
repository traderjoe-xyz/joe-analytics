import { AppShell, PoolTable } from "app/components";
import {
  getApollo,
  getPairs,
  getPools,
  poolsQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

function RecentPoolsPage() {
  const {
    data: { pools },
  } = useQuery(poolsQuery, {
    context: {
      clientName: "masterchef",
    },
  });
  useInterval(() => Promise.all([getPools]), 1800000);
  return (
    <AppShell>
      <Head>
        <title>Recently Added Pools | Trader Joe Analytics</title>
      </Head>
      <PoolTable
        title="Recently Added Pools"
        pools={pools}
        orderBy="timestamp"
        order="desc"
        rowsPerPage={5}
      />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getPairs(client);
  await getPools(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default RecentPoolsPage;
