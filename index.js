#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "tokenguard-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": "tokenguard-mcp/1.0.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_token_price",
      description: "Get current price, market cap, 24h change, and volume for any cryptocurrency",
      inputSchema: {
        type: "object",
        properties: {
          token: { type: "string", description: "CoinGecko token ID (e.g. 'bitcoin', 'ethereum', 'solana', 'uniswap')" }
        },
        required: ["token"]
      }
    },
    {
      name: "get_gas_fees",
      description: "Get current Ethereum gas fees (fast/standard/slow in Gwei)",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_fear_greed",
      description: "Get the Crypto Fear & Greed Index (0=Extreme Fear, 100=Extreme Greed)",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Number of historical days to return (default: 7)" }
        }
      }
    },
    {
      name: "get_defi_tvl",
      description: "Get Total Value Locked (TVL) for a DeFi protocol from DeFiLlama",
      inputSchema: {
        type: "object",
        properties: {
          protocol: { type: "string", description: "Protocol slug (e.g. 'uniswap', 'aave', 'curve', 'lido')" }
        },
        required: ["protocol"]
      }
    },
    {
      name: "get_mempool",
      description: "Get Bitcoin mempool statistics: pending transactions, fee rates, block height",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_nft_floor",
      description: "Get NFT collection floor price and market stats from CoinGecko",
      inputSchema: {
        type: "object",
        properties: {
          collection: { type: "string", description: "CoinGecko NFT collection slug (e.g. 'bored-ape-yacht-club', 'cryptopunks')" }
        },
        required: ["collection"]
      }
    },
    {
      name: "get_stablecoins",
      description: "Get top stablecoins by circulating supply from DeFiLlama",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Number of stablecoins to return (default: 10)" }
        }
      }
    },
    {
      name: "get_global_market",
      description: "Get global crypto market overview: total market cap, BTC dominance, active currencies",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_trending",
      description: "Get trending cryptocurrencies and NFTs on CoinGecko in the last 24 hours",
      inputSchema: { type: "object", properties: {} }
    },
    {
      name: "get_lightning_stats",
      description: "Get Bitcoin Lightning Network statistics: node count, channel count, total capacity",
      inputSchema: { type: "object", properties: {} }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result;

    if (name === "get_token_price") {
      const data = await fetchJson(
        `https://api.coingecko.com/api/v3/coins/${args.token}?localization=false&tickers=false&community_data=false&developer_data=false`
      );
      const md = data.market_data || {};
      result = {
        id: data.id,
        name: data.name,
        symbol: data.symbol?.toUpperCase(),
        price_usd: md.current_price?.usd,
        market_cap_usd: md.market_cap?.usd,
        volume_24h_usd: md.total_volume?.usd,
        change_24h_pct: md.price_change_percentage_24h,
        change_7d_pct: md.price_change_percentage_7d,
        ath_usd: md.ath?.usd,
        rank: data.market_cap_rank
      };
    } else if (name === "get_gas_fees") {
      const data = await fetchJson("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken");
      if (data.status === "1") {
        result = {
          fast_gwei: data.result.FastGasPrice,
          standard_gwei: data.result.ProposeGasPrice,
          slow_gwei: data.result.SafeGasPrice,
          base_fee_gwei: data.result.suggestBaseFee
        };
      } else {
        const backup = await fetchJson("https://beaconcha.in/api/v1/execution/gasnow");
        result = backup.data || backup;
      }
    } else if (name === "get_fear_greed") {
      const limit = args.limit || 7;
      const data = await fetchJson(`https://api.alternative.me/fng/?limit=${limit}`);
      result = {
        current: data.data?.[0],
        history: data.data,
        metadata: { length: data.data?.length }
      };
    } else if (name === "get_defi_tvl") {
      const data = await fetchJson(`https://api.llama.fi/protocol/${args.protocol}`);
      result = {
        name: data.name,
        symbol: data.symbol,
        tvl: data.tvl,
        chains: data.chains,
        category: data.category,
        url: data.url,
        description: data.description?.slice(0, 200)
      };
    } else if (name === "get_mempool") {
      const [fees, height, mempool] = await Promise.all([
        fetchJson("https://mempool.space/api/v1/fees/recommended"),
        fetchJson("https://mempool.space/api/blocks/tip/height"),
        fetchJson("https://mempool.space/api/mempool")
      ]);
      result = {
        block_height: height,
        fees_sat_per_vb: fees,
        mempool: {
          tx_count: mempool.count,
          total_fee_btc: (mempool.total_fee / 1e8).toFixed(4),
          vsize_mb: (mempool.vsize / 1e6).toFixed(2)
        }
      };
    } else if (name === "get_nft_floor") {
      const data = await fetchJson(`https://api.coingecko.com/api/v3/nfts/${args.collection}`);
      result = {
        name: data.name,
        collection: data.id,
        floor_price_native: data.floor_price?.native_currency,
        floor_price_usd: data.floor_price?.usd,
        volume_24h_usd: data.volume_24h?.usd,
        market_cap_usd: data.market_cap?.usd,
        total_supply: data.total_supply
      };
    } else if (name === "get_stablecoins") {
      const limit = args.limit || 10;
      const data = await fetchJson("https://stablecoins.llama.fi/stablecoins");
      const pegs = data.peggedAssets || [];
      result = {
        count: pegs.length,
        top: pegs.slice(0, limit).map(p => ({
          name: p.name,
          symbol: p.symbol,
          peg_type: p.pegType,
          circulating_usd: p.circulating?.peggedUSD
        }))
      };
    } else if (name === "get_global_market") {
      const data = await fetchJson("https://api.coingecko.com/api/v3/global");
      const gd = data.data || {};
      result = {
        total_market_cap_usd: gd.total_market_cap?.usd,
        total_volume_24h_usd: gd.total_volume?.usd,
        btc_dominance_pct: gd.market_cap_percentage?.btc,
        eth_dominance_pct: gd.market_cap_percentage?.eth,
        active_cryptocurrencies: gd.active_cryptocurrencies,
        markets: gd.markets,
        market_cap_change_24h_pct: gd.market_cap_change_percentage_24h_usd
      };
    } else if (name === "get_trending") {
      const data = await fetchJson("https://api.coingecko.com/api/v3/search/trending");
      result = {
        coins: (data.coins || []).map(c => ({
          name: c.item?.name,
          symbol: c.item?.symbol,
          rank: c.item?.market_cap_rank,
          price_btc: c.item?.price_btc
        })),
        nfts: (data.nfts || []).map(n => ({
          name: n.name,
          symbol: n.symbol,
          floor_price_eth: n.floor_price_in_native_currency
        }))
      };
    } else if (name === "get_lightning_stats") {
      const data = await fetchJson("https://mempool.space/api/v1/lightning/statistics/latest");
      const latest = data.latest || {};
      result = {
        node_count: latest.node_count,
        channel_count: latest.channel_count,
        total_capacity_btc: latest.total_capacity ? (latest.total_capacity / 1e8).toFixed(2) : null,
        avg_capacity_sat: latest.avg_capacity,
        clearnet_nodes: latest.clearnet_nodes,
        tor_nodes: latest.tor_nodes
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
