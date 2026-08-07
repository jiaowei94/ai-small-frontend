import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, ArrowLeft, RefreshCw, Flame, Sparkles } from 'lucide-react';
import { GAME_REGISTRY, GameMetadata } from '../games/GameRegistry';
import { GameScore } from '../../types';
import { supabase } from '../../lib/supabase';

interface GameViewProps {
  onBack: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const GameView: React.FC<GameViewProps> = ({ onBack, onShowToast }) => {
  const [selectedGameId, setSelectedGameId] = useState<string>('gomoku');
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  // Fetch Supabase Leaderboard
  const fetchLeaderboard = async () => {
    setIsLeaderboardLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (data && !error) {
        setLeaderboard(data as GameScore[]);
      } else {
        // Mock fallback scores
        setLeaderboard([
          { user_id: '1', user_name: 'AlphaGomoku', game_id: 'gomoku', score: 1200 },
          { user_id: '2', user_name: 'TetrisKing', game_id: 'tetris', score: 980 },
          { user_id: '3', user_name: 'SnakePro', game_id: 'snake', score: 750 },
        ]);
      }
    } catch (e) {
      console.warn('Leaderboard load error:', e);
    } finally {
      setIsLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGameId]);

  const activeGame = GAME_REGISTRY.find((g) => g.id === selectedGameId) || GAME_REGISTRY[0];
  const ActiveGameComponent = activeGame.component;

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 max-w-7xl mx-auto space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-white/60 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-amber-400" />
              <span>互动益智小游戏专区 (/ooo)</span>
            </h1>
            <p className="text-xs text-white/40">模块化无缝扩充架构 · 实时游戏积分同步至 Supabase</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Game Selector & Leaderboard */}
        <div className="lg:col-span-4 space-y-6">
          {/* Game Selection Cards */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              精选游戏列表 ({GAME_REGISTRY.length})
            </h3>

            <div className="space-y-2">
              {GAME_REGISTRY.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGameId(game.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    game.id === selectedGameId
                      ? 'bg-amber-950/80 border-amber-500/50 text-amber-200 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">{game.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-amber-500/20 font-semibold">
                      {game.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{game.tagline}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>全站排行榜 Top 10</span>
              </h3>
              <button onClick={fetchLeaderboard} className="text-slate-500 hover:text-slate-300">
                <RefreshCw className={`w-3.5 h-3.5 ${isLeaderboardLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 w-4">#{idx + 1}</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[100px]">
                      {item.user_name || '玩家'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">[{item.game_id}]</span>
                  </div>
                  <span className="font-mono font-extrabold text-sky-400">{item.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Active Game Play Area */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col items-center justify-center min-h-[500px]">
          <div className="w-full mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{activeGame.name}</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">{activeGame.tagline}</span>
          </div>

          <ActiveGameComponent
            onScoreSubmitted={() => {
              onShowToast('success', '新的游戏战果已成功保存至排行榜！');
              fetchLeaderboard();
            }}
          />
        </div>
      </div>
    </div>
  );
};
