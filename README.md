# 🪙 Cryptonite

> A real-time cryptocurrency dashboard with AI-powered buy/sell recommendations.

---

## 📌 About

Cryptonite is a Single Page Application (SPA) that displays real-time data for the top 100 cryptocurrencies. Users can track live prices, view interactive charts, and receive AI-generated investment recommendations powered by the OpenAI API.

---

## ✨ Features

- 📊 **Live Dashboard** — Displays 100 cryptocurrencies with icons, symbols, and prices
- 🔍 **Instant Search** — Filter coins by name or symbol in real time (no extra API calls)
- 💱 **Multi-Currency Prices** — View prices in USD, EUR, and ILS
- 📈 **Real-Time Charts** — Live price graph updated every second for selected coins (up to 5)
- 🤖 **AI Recommendations** — Get buy/sell advice powered by OpenAI GPT based on market data
- 💾 **Persistent Selections** — Selected coins are saved and restored on page reload
- 🖼️ **Parallax UI** — Smooth parallax background effect on the home page

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript |
| State Management | Redux Toolkit |
| Styling | CSS (App.css) |
| APIs | CoinGecko, CryptoCompare, OpenAI |
| Routing | React Router DOM |
| Deployment | Firebase / GitHub Pages |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/TairHizmi/Crypto-Project.git

# Navigate to project folder
cd CryptoProject

# Install dependencies
npm install

# Create a .env file and add your OpenAI key
REACT_APP_OPENAI_API_KEY=sk-...

# Start the development server
npm run dev
```

---

## 📡 APIs Used

| Purpose | API |
|---------|-----|
| Coin list & market data | [CoinGecko](https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd) |
| Single coin details | [CoinGecko](https://api.coingecko.com/api/v3/coins/<coin-id>) |
| Real-time price chart | [CryptoCompare](https://min-api.cryptocompare.com/data/pricemulti) |
| AI recommendations | [OpenAI](https://api.openai.com/v1/chat/completions) |

---

## 📁 Project Structure

```
src/
├── components/       # All React components
├── store/            # Redux store & slices
├── App.tsx
├── App.css           # All styling
```

---

## 👩‍💻 Author

Made with ❤️ by Tair Shimonov 
📧 Tairhizmi13@gmail.com  
🔗 [github.com/TairHizmi]