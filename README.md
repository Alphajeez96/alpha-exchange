## Alpha Exchange

A minimal spot swap Interface with a Trade Panel, Portfolio and Transaction History tables, and a price chart. Live market data is fetched from the Hyperliquid public API. Styling uses Tailwind CSS; state is managed with Zustand and TanStack Query.

### 1. Setup

1. Requirements
   - Node.js 20+
   - pnpm or npm
2. Install
   ```bash
   npm install
   ```
3. Run dev server
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

### 2. Project Structure

```
app/
  components/
    PriceChart.tsx               # TradingView widget wrapper
    Table/
      index.tsx                  # DataTable abstraction
      PortfolioTable.tsx         # Holdings view
      TransactionHistoryTable.tsx# Swap history view
    TradePanel/
      index.tsx                  # Trade form orchestration
      TokenAmount.tsx            # Amount input + token selector
      MoreInformation.tsx        # Min received, fee, price impact
  hooks/
    useMarketData.ts             # TanStack Query hooks for Hyperliquid
  lib/
    formatCurrency.ts            # Number/fiat formatters
    hyperliquid/
      client.ts                  # Minimal client for Hyperliquid info API
      types.ts                   # Typed responses
  store/
    portfolioStore.ts            # Holdings + swap history (persisted)
  globals.css                    # Tailwind + global tokens/utilities
  page.tsx                       # Page layout & wiring
```

### 3. Architectural Overview

- UI Composition

  - `TradePanel` coordinates token selection and amounts using child components:
    - `TokenAmount` encapsulates input validation, token image, and `AssetSelector` dropdown.
  - `PriceChart` shows `BINANCE:${baseSymbol}USDT`, where `baseSymbol` is the current pay token.
  - Tables are built via a small `DataTable` abstraction for consistency and search.

- Data Flow

  - Live mids/meta/candles via Hyperliquid (`app/lib/hyperliquid/client.ts`) consumed with TanStack Query hooks (`app/hooks/useMarketData.ts`).
  - Page-level `payToken` state is owned by `app/page.tsx` and passed to `TradePanel` (setter) and `PriceChart` (reader).
  - Portfolio/history use a persisted Zustand store (`portfolioStore.ts`). Swaps update balances and append history rows.

- Styling & UX
  - Tailwind CSS with custom design tokens in `globals.css`.
  - Transparent scrollbars, small table typography, and consistent spacing.
  - Accessibility: `AssetSelector` supports ESC to close and outside-click dismissal.
  - Animations: opted for simple, fast transitions (`ease-out`, ~200–300ms).

### 4. Key Design Decisions & Trade-offs

- Chart Pair Simplification

  - Decision: Always render `BINANCE:BASEUSDT` to avoid symbol validation and inconsistent availability across venues.
  - Trade-off: Cross-crypto pairs (e.g., ETHBTC) are not shown even if available, opted for a more deterministic and robust UX.

- Token Images and Fall back images

  - Decision: Retrieve token images from a CDN and create a fallback image for token images that are not available.
  - Trade-off: Slightly more code, but better control and optimal UX, a win I'd say.

- Input Validation Strategy

  - Decision: Custom hook `useAmountInput` enforces positive numeric input, single decimal, max decimals, prevents leading zeros (e.g., blocks `00` unless decimal), and normalizes on blur.
  - Trade-off: Slightly more code than a generic mask, but better control and no heavy dependency.

- Table Abstraction

  - Decision: Uses a lightweight `DataTable` wrapper instead of verbose head/body/cell components.
  - Trade-off: Less granular styling hooks per cell, but far less boilerplate and faster iteration.

- Animation Scope

  - Decision: Keep micro-interactions (buttons, caret, dropdown) animated.
  - Trade-off: Fewer large-layout animations, but better perceived performance and stability.

- Event Listener Cleanup
  - Decision: Use AbortController for event listener cleanup instead of manual addEventListener/removeEventListener pairs.
  - Trade-off: Slightly more verbose setup, but automatic cleanup on component unmount and better memory management.

### 5. Environment

- Environment

  - No secrets required for Hyperliquid public info endpoints.
  - Node 20+, Next.js App Router.

- Build & Run

  ```bash
  npm run build
  npm start
  ```
