import { AppShell, TokenTable } from "app/components";
import {
  avaxPriceQuery,
  getApollo,
  getOneDayAvaxPrice,
  getTokens,
  tokensQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";

function TokensPage() {
  const {
    data: { tokens },
  } = useQuery(tokensQuery);

  useInterval(async () => {
    await Promise.all([getTokens, getOneDayAvaxPrice]);
  }, 60000);

  return (
    <AppShell>
      <Head>
        <title>Tokens | SushiSwap Analytics</title>
      </Head>
      <TokenTable title="Tokens" tokens={tokens} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();

  await client.query({
    query: avaxPriceQuery,
  });

  await getOneDayAvaxPrice(client);

  await getTokens(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export default TokensPage;
