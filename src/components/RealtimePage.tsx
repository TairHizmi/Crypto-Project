
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Prices {
  [symbol: string]: {
    usd: number;
  };
}

export default function RealtimePage() {
  const selected = useSelector((state: RootState) => state.selectedCoins.coins);
  // Removed unused 'prices' state
  const [history, setHistory] = useState<{ time: string; prices: Prices }[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setHistory([]); // reset history when coins change
    async function fetchPrices() {
      if (selected.length === 0) return;
      const symbols = selected.map((c) => c.symbol.toUpperCase()).join(',');
      try {
        const resp = await fetch(
          `https://min-api.cryptocompare.com/data/pricemulti?tsyms=usd&fsyms=${symbols}&api_key=${import.meta.env.VITE_CRYPTO_COMPARE_KEY}`
        );
        const data = await resp.json();
        setHistory((prev) => [
          ...prev.slice(-29), // keep last 30 points
          { time: new Date().toLocaleTimeString(), prices: data }
        ]);
      } catch (e) {
        console.error(e);
      }
    }
    fetchPrices();
    timerRef.current = setInterval(fetchPrices, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selected]);

  // Prepare chart data
  const chartData = {
    labels: history.map((h) => h.time),
    datasets: selected.map((coin, idx) => {
      const colorList = [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
      ];
      const symbol = coin.symbol.toUpperCase();
      return {
        label: symbol,
        data: history.map((h) => h.prices[symbol]?.usd ?? null),
        borderColor: colorList[idx % colorList.length],
        backgroundColor: colorList[idx % colorList.length],
        fill: false,
        tension: 0.2,
        pointRadius: 3,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: selected.length > 0 ? `${selected.map(c => c.id.toUpperCase()).join(', ')} to USD` : 'No coins selected',
      },
    },
    scales: {
      y: {
        title: { display: true, text: 'Coin Value' },
        beginAtZero: true,
      },
      x: {
        title: { display: true, text: 'Time' },
      },
    },
  };

  return (
    <div className="page realtime-page">
      <h2>Realtime Report</h2>
      {selected.length === 0 && <div>Please select coins on the Home page.</div>}
      {selected.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #0001' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
