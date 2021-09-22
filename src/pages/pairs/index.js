import { AppShell, PairTable, SortableTable } from "app/components";
import { getApollo, getPairs, pairsQuery, useInterval } from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

function PairsPage() {
  const utcSevenDayBack = dayjs()
  .utc()
  .startOf('hour')
  .subtract(7, 'day')
  .unix()

  const {
    data: { pairs },
  } = useQuery(pairsQuery, { dateAfter: utcSevenDayBack });
  useInterval(getPairs, 60000);
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
