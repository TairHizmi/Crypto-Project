import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addCoin, removeCoin } from '../store/selectedCoinsSlice';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
}

interface Props {
  coin: Coin;
}

export default function CoinCard({ coin }: Props) {
  const [showInfo, setShowInfo] = useState(false);
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.selectedCoins.coins);
  const isSelected = selected.some(c => c.id === coin.id);

  const handleSwitch = () => {
    if (isSelected) {
      dispatch(removeCoin(coin.id));
    } else {
      if (selected.length >= 5) {
        // dispatch an event or show dialog
        window.dispatchEvent(new CustomEvent('limitReached', { detail: { id: coin.id, symbol: coin.symbol } }));
      } else {
        dispatch(addCoin({ id: coin.id, symbol: coin.symbol }));
      }
    }
  };

  return (
    <div className="coin-card">
      <img src={coin.image} alt={coin.name} className="coin-icon" />
      <div className="coin-symbol">{coin.symbol.toUpperCase()}</div>
      <div className="coin-name">{coin.name}</div>
      <button
        onClick={() => setShowInfo((s) => !s)}
        className={`info-btn ${showInfo ? 'active' : ''}`}
      >
        {showInfo ? 'Close Info' : 'More Info'}
      </button>
      <label className="switch">
        <input type="checkbox" checked={isSelected} onChange={handleSwitch} />
        <span className="slider" />
      </label>
      {showInfo && <CoinInfo id={coin.id} onClose={() => setShowInfo(false)} />}
    </div>
  );
}

function CoinInfo({ id, onClose }: { id: string; onClose: () => void }) {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((r) => r.json())
      .then((data) => setInfo(data.market_data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="info-loading">Loading info...</div>;
  if (!info) return null;

  return (
    <div className="info-section">
      <div className="info-item">
        <span className="info-label">USD:</span>
        <span className="info-value">${info.current_price.usd.toLocaleString()}</span>
      </div>
      <div className="info-item">
        <span className="info-label">EUR:</span>
        <span className="info-value">€{info.current_price.eur.toLocaleString()}</span>
      </div>
      <div className="info-item">
        <span className="info-label">ILS:</span>
        <span className="info-value">₪{info.current_price.ils.toLocaleString()}</span>
      </div>
      <button onClick={onClose} className="btn-close-mini">Close</button>
    </div>
  );
}
