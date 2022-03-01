import React from "react"
import Head from "next/head";
import { AppShell, RemittanceTable } from "app/components";
import { remittancesQuery } from "app/core"
import { useQuery } from "@apollo/client";

const SJoeDetailsPage = () => {
  const data = useQuery(remittancesQuery, {
    variables: {
      first: 100,
    },
    context: {
      clientName: "moneymaker",
    },
  });
  const remittances = data?.data?.remits ?? []

  return (
    <AppShell>
      <Head>
        <title>sJOE | Trader Joe Analytics</title>
      </Head>
      <RemittanceTable remittances={remittances} orderBy="timestamp" orderDirection="desc" rowsPerPage={10} />
    </AppShell>
  );
}

export default SJoeDetailsPage