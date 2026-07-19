# tokenguard-mcp

MCP (Model Context Protocol) server for crypto/DeFi data — 10 tools, no API keys required.

## Tools

| Tool | Description |
|------|-------------|
| `get_token_price` | Price, market cap, 24h change for any token (CoinGecko) |
| `get_gas_fees` | Ethereum gas fees (fast/standard/slow) |
| `get_fear_greed` | Crypto Fear & Greed Index |
| `get_defi_tvl` | DeFi protocol TVL from DeFiLlama |
| `get_mempool` | Bitcoin mempool stats & fee rates |
| `get_nft_floor` | NFT collection floor price & market data |
| `get_stablecoins` | Top stablecoins by circulating supply |
| `get_global_market` | Global crypto market overview |
| `get_trending` | Trending coins & NFTs on CoinGecko |
| `get_lightning_stats` | Bitcoin Lightning Network stats |

## Usage

```json
{
  "mcpServers": {
    "tokenguard": {
      "command": "npx",
      "args": ["@eltociear/tokenguard-mcp"]
    }
  }
}
```

Or run directly:
```bash
npx @eltociear/tokenguard-mcp
```

## Data Sources

All free, no API keys required:
- [CoinGecko](https://www.coingecko.com/en/api) — price, NFT, global market
- [DeFiLlama](https://defillama.com/docs/api) — TVL, stablecoins
- [mempool.space](https://mempool.space/api) — Bitcoin mempool, Lightning Network
- [alternative.me](https://alternative.me/crypto/fear-and-greed-index/) — Fear & Greed Index

## Live API

Full 40+ route API with x402 micropayments: [eltociear-tokenguard.hf.space](https://eltociear-tokenguard.hf.space)

## License

MIT

## Professional audit services

Maintained by the same author — paid services on Polar (Stripe checkout):

- **[MCP Security Audit Report — $5](https://buy.polar.sh/polar_cl_sut9rtngBRutEhBAGk1FmwRYSLrAebowkPw8g2C5Op7)** — one-off audit of your MCP server: 68 attack patterns, severity-rated PDF report with concrete fixes.
- **[Security Pulse — $5/mo](https://buy.polar.sh/polar_cl_jKHyL3Ge9u5YGAsjgixp16UYrhU0WGldxvRmN03expZ)** ([annual $50](https://buy.polar.sh/polar_cl_rEcqwjLJ83vlfa3C8vhAtDLOa6fPVxWeHZyd31BdIPT)) — monthly briefing on newly disclosed MCP server vulnerabilities, scan stats across 100+ tracked repos, mitigation playbooks.
- **[Pro Audit Stack — $20/mo](https://buy.polar.sh/polar_cl_C37THjfoFMdOnu6xc1TnMIezYNuBbbivXbvFb3DCpZa)** — for teams running MCP servers in CI/CD: 50 hosted scans/month, Discord access, 24h SLA on vulnerability questions.

Full catalog: [polar.sh/eltociear](https://polar.sh/eltociear)
