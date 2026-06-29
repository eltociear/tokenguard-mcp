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
