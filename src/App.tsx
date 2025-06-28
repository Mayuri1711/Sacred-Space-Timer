import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';

type TimerState = 'setup' | 'running' | 'complete';

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  { text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "Wherever you are, be there totally.", author: "Eckhart Tolle" },
  { text: "The quieter you become, the more you are able to hear.", author: "Rumi" },
  { text: "In the depth of winter, I finally learned that there was in me an invincible summer.", author: "Albert Camus" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "The way out is through.", author: "Robert Frost" },
  { text: "Be yourself. Everyone else is already taken.", author: "Oscar Wilde" }
];

function App() {
  const [timerState, setTimerState] = useState<TimerState>('setup');
  const [intention, setIntention] = useState('');
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState<Quote>(QUOTES[0]);
  const [showCompletion, setShowCompletion] = useState(false);

  // Audio context for gong sounds
  const playGong = useCallback(() => {
    // Create a simple tone using Web Audio API as a placeholder for gong sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 3);
  }, []);

  const startTimer = useCallback(() => {
    if (!intention.trim()) return;
    
    setTimeLeft(duration * 60);
    setTimerState('running');
    playGong();
    
    // Select random quote for completion
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setSelectedQuote(randomQuote);
  }, [intention, duration, playGong]);

  const resetTimer = useCallback(() => {
    setTimerState('setup');
    setIntention('');
    setDuration(5);
    setTimeLeft(0);
    setShowCompletion(false);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (timerState === 'running' && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerState('complete');
            playGong();
            setTimeout(() => setShowCompletion(true), 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timerState, timeLeft, playGong]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (timerState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4 font-serif">
              Sacred Space
            </h1>
            <p className="text-purple-200 text-lg font-light">
              Create a moment of peace
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="mb-8">
              <label className="block text-white/90 text-sm font-medium mb-3">
                Set your intention
              </label>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="clarity, gratitude, peace..."
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                maxLength={50}
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-white/90 text-sm font-medium mb-3">
                Duration (minutes)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 5, 10].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setDuration(minutes)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      duration === minutes
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={startTimer}
              disabled={!intention.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-lg font-medium text-lg flex items-center justify-center gap-2 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Play size={20} />
              Begin Sacred Time
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (timerState === 'running') {
    return (
     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
  {/* Candle Animation */}
  <div className="relative flex flex-col items-center">
    {/* Flame */}
    <div className="relative w-6 h-8 z-10">
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full animate-pulse flame-flicker opacity-90"></div>
      <div className="absolute inset-1 bg-gradient-to-t from-red-400 via-orange-300 to-yellow-100 rounded-full animate-pulse flame-flicker-delayed opacity-80"></div>
    </div>

    {/* Wick */}
   <div className="w-0.5 h-4 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full transform rotate-[5deg] shadow-sm z-20 -mb-1"></div>


    {/* Candle Body */}
    <div className="w-8 h-32 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-sm shadow-lg z-0"></div>

    {/* Glow Effect */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-radial from-orange-400/20 via-yellow-400/10 to-transparent rounded-full blur-2xl animate-pulse z-0"></div>
  </div>
        
        {/* Subtle time indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="text-white/30 text-sm font-light">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    );
  }

  if (timerState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl text-center transition-all duration-2000 ${showCompletion ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4 font-serif">
              Your intention:
            </h2>
            <p className="text-5xl md:text-6xl font-light text-amber-400 mb-8 font-serif italic">
              {intention}
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
            <blockquote className="text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-4 font-serif italic">
              "{selectedQuote.text}"
            </blockquote>
            <cite className="text-purple-200 text-lg">
              — {selectedQuote.author}
            </cite>
          </div>
          
          <button
            onClick={resetTimer}
            className="bg-white/10 hover:bg-white/20 text-white py-3 px-8 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all border border-white/20"
          >
            <RotateCcw size={18} />
            Create Another Sacred Moment
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;