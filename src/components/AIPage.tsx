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
            {
              role: 'system',
              content: 'You are an expert crypto financial advisor. Analyze the data provided and give a professional recommendation. Start your response with exactly "BUY", "NOT BUY", or "HOLD" as the first line, followed by a detailed explanation paragraph.'
            },
            {
              role: 'user',
              content: `Analyze this coin data and provide a recommendation:\n${prompt}`
            },
          ],
          max_tokens: 400,
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

  const hideRecommendation = (id: string) => {
    setResult((prev) => {
      const newResult = { ...prev };
      delete newResult[id];
      return newResult;
    });
  };

  return (
    <div className="page ai-page">
      <h2>AI Recommendations</h2>
      {selected.length === 0 && <div className="no-coins-msg">No coins selected for AI recommendations. Please go to Home and select some coins.</div>}
      <div className="ai-coins-grid">
        {selected.map((coin) => (
          <div key={coin.id} className="ai-coin-card">
            <div className="ai-coin-header">
              <span className="coin-title">{coin.id.toUpperCase()} ({coin.symbol.toUpperCase()})</span>
              <div className="ai-actions">
                <button
                  className="btn-get-rec"
                  onClick={() => getRecommendation(coin.id)}
                  disabled={loadingId === coin.id}
                >
                  {loadingId === coin.id ? (
                    <span className="loading-dots">Thinking</span>
                  ) : (
                    'Get recommendation'
                  )}
                </button>
                {result[coin.id] && (
                  <button className="btn-hide-rec" onClick={() => hideRecommendation(coin.id)}>
                    Hide
                  </button>
                )}
              </div>
            </div>
            {result[coin.id] && (
              <div className="ai-result-box">
                <div className={`recommendation-badge ${result[coin.id].decision.toLowerCase().replace(' ', '-')}`}>
                  {result[coin.id].decision}
                </div>
                <div className="explanation-text">
                  {result[coin.id].explanation}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
