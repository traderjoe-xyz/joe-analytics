# PandaSwapV2 Analytics

Analytics for Pandaswap on AVAX chain.

Forked from `sushiswap-analytics`. 

## TODo
- [ ] Update `queries/exchange.js` 
    - refactor `ETH` to `AVAX`
    - update endpoint to get daily `AVAX` price
    - refactor `SUSHI` for `PANDASWAPV2`
- what to do about `queries/blocks.js` ?
- do we need to update `queries/masterchef.js` ? Do we need subgraph?
- update `constants.js`
- update etherscan links to avaxexplorer
- update sushiswap pool / token links


# (Original README) SushiSwap Analytics

SushiSwap Analytics is a progressive web application for the SushiSwap Protocol.

## Getting started

This one-liner assumes you have git, nvm & yarn installed.

```sh
git clone https://github.com/sushiswap/sushiswap-analytics.git && cd sushiswap-analytics && nvm use && yarn && yarn dev
```

## Add your logo

Add your logo by opening a PR against sushiswap/assets

## Licence

MIT
