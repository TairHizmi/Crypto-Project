import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RealtimePage from './components/RealtimePage';
import AIPage from './components/AIPage';
import AboutPage from './components/AboutPage';
import Dialog from './components/Dialog';
import type { RootState } from './store';
import { addCoin, removeCoin } from './store/selectedCoinsSlice';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error('Error Boundary:', error);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">שגיאה בהרכבת או in component: בדוק console</div>;
    }
    return this.props.children;
  }
}

function App() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [pendingCoin, setPendingCoin] = useState<{ id: string; symbol: string } | null>(null);
  const selected = useSelector((state: RootState) => state.selectedCoins.coins);
  const dispatch = useDispatch();


  // Parallax effect for hero
  useEffect(() => {
    const parallax = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector('.hero');
      if (hero) {
        (hero as HTMLElement).style.setProperty('--scroll', scrollY.toString());
      }
    };
    window.addEventListener('scroll', parallax);
    return () => window.removeEventListener('scroll', parallax);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      setPendingCoin(e.detail);
      setDialogVisible(true);
    };
    window.addEventListener('limitReached', handler);
    return () => window.removeEventListener('limitReached', handler);
  }, []);

  const handleChoose = (id: string) => {
    if (pendingCoin) {
      dispatch(removeCoin(id));
      dispatch(addCoin(pendingCoin));
      setDialogVisible(false);
      setPendingCoin(null);
    }
  };

  const handleClose = () => {
    setDialogVisible(false);
    setPendingCoin(null);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Navbar />
        <header className="hero">
          {/* <h1>Cryptonite</h1> */}
        </header>
        <Dialog
          visible={dialogVisible}
          options={selected.map(c => c.id)}
          onChoose={handleChoose}
          onClose={handleClose}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/realtime" element={<RealtimePage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App
