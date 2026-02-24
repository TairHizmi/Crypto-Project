import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface Recommend { decision: string; explanation: string; }

export default function AIPage() {
  const selected = useSelector((state: RootState) => state.selectedCoins.coins);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [result, setResult] = useState<{ [id: string]: Recommend }>({});

  const getRecommendation = async (id: string) => {
    setLoadingId(id);
    try {
      const resp = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?market_data=true`);
      const data = await resp.json();

      const prompt = `You are an investment advisor. Using the following data about a cryptocurrency, answer whether it is worth buying and provide a paragraph explaining why.\n` +
        JSON.stringify({
          name: data.name,
          current_price_usd: data.market_data.current_price.usd,
          market_cap_usd: data.market_data.market_cap.usd,
          volume_24h_usd: data.market_data.total_volume.usd,
          price_change_percentage_30d_in_currency: data.market_data.price_change_percentage_30d,
          price_change_percentage_60d_in_currency: data.market_data.price_change_percentage_60d,
          price_change_percentage_200d_in_currency: data.market_data.price_change_percentage_200d,
        }, null, 2);

      const chatResp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You provide buy/not buy with explanation.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 300,
        }),
      });
      const chatData = await chatResp.json();
      const text = chatData.choices?.[0]?.message?.content || '';
      // naive parse: first line decision, rest explanation
      const [decisionLine, ...rest] = text.split('\n');
      setResult((prev) => ({
        ...prev,
        [id]: { decision: decisionLine, explanation: rest.join('\n') },
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="page ai-page">
      <h2>AI Recommendations</h2>
      {selected.length === 0 && <div>No coins to provide recommendations for</div>}
      {selected.map((coin) => (
        <div key={coin.id} className="ai-coin">
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{coin.id.toUpperCase()} ({coin.symbol.toUpperCase()})</span>
          <button onClick={() => getRecommendation(coin.id)} disabled={loadingId === coin.id}>
            {loadingId === coin.id ? 'Loading...' : 'Get recommendation'}
          </button>
          {result[coin.id] && (
            <div className="ai-result">
              <strong style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>{result[coin.id].decision}</strong>
              <p>{result[coin.id].explanation}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
