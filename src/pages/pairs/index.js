import { AppShell, PairTable, SortableTable } from "app/components";
import { getApollo, getPairs, pairsQuery, useInterval } from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

function PairsPage() {
  const {
    data: { pairs },
  } = useQuery(pairsQuery);
  return (
    <AppShell>
      <Head>
        <title>Pairs | Trader Joe Analytics</title>
      </Head>
      <PairTable title="Pairs" pairs={pairs} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();

  // Pairs
  await getPairs(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export default PairsPage;
