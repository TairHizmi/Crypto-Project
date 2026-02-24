import { useEffect, useState } from 'react';
import CoinCard from './CoinCard';
import SearchBar from './SearchBar';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

export default function HomePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${import.meta.env.VITE_COINGECKO_KEY}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`API Error: ${r.status}. Please wait a minute and refresh.`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCoins(data);
        } else {
          throw new Error('Unexpected data format from API');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = coins.filter((c) =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="page home-page">
      <SearchBar value={filter} onChange={setFilter} />
      {loading && <div className="loading-spinner">Loading coins...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="cards-container">
        {filtered.map((c) => (
          <CoinCard key={c.id} coin={c} />
        ))}
      </div>
    </div>
  );
}
