# PandaSwapV2 Analytics

Analytics for Pandaswap on AVAX chain.

Forked from `sushiswap-analytics`. 

## TODo
- [ ] Update `queries/exchange.js` 
    - refactor `ETH` to `AVAX`
    - update endpoint to get daily `AVAX` price
    - refactor `SUSHI` for `PANDASWAPV2`
- [x] updated to use avax block subgraph
- update `constants.js`
- update `src/components/Sushi.js` sushi svg logo
- update `src/components/TokenIcon.js` with avax token icons
- [x] update etherscan links to avaxexplorer
- update sushiswap pool / token links
- implement template/mustache for configs
    - added new `config.json`
    - update `src/core/constants.js`

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
