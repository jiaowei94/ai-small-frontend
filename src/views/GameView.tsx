import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Trophy, Sparkles, RefreshCw, Play, Pause, Swords, Code, ChevronRight } from 'lucide-react';
import { CONFIG } from '../config';

interface GameScore {
  id: string;
  nickname?: string;
  game_id: string;
  score: number;
  created_at: string;
}

interface GameViewProps {
  user: any;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export const GameView: React.FC<GameViewProps> = ({ user, showToast }) => {
  const [activeGame, setActiveGame] = useState<'gomoku' | 'tetris' | 'snake' | 'racing'>('gomoku');
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([]);

  // 俄罗斯方块 State
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);
  const [tetrisRunning, setTetrisRunning] = useState(false);
  const tetrisCanvasRef = useRef<HTMLCanvasElement>(null);

  // 贪吃蛇 State
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeRunning, setSnakeRunning] = useState(false);
  const snakeCanvasRef = useRef<HTMLCanvasElement>(null);

  // 赛车避障 State
  const [racingScore, setRacingScore] = useState(0);
  const [racingRunning, setRacingRunning] = useState(false);
  const racingCanvasRef = useRef<HTMLCanvasElement>(null);

  // 五子棋 State (15x15 棋盘: 0为空, 1为黑子-玩家, 2为白子-AI)
  const [board, setBoard] = useState<number[][]>(() =>
    Array.from({ length: 15 }, () => Array(15).fill(0))
  );
  const [gomokuDifficulty, setGomokuDifficulty] = useState<'beginner' | 'medium' | 'advanced' | 'S'>('S');
  const [gomokuStatus, setGomokuStatus] = useState<string>('对局进行中，请您先手（黑子）下子');
  const [gomokuWinner, setGomokuWinner] = useState<number | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  // 获取排行榜
  const fetchScores = async () => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/game/scores`);
      const data = await res.json();
      if (data.success) setLeaderboard(data.scores);
    } catch (e) {}
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // 记录高分至 Supabase
  const submitScore = async (gameId: string, scoreVal: number) => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/game/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user ? user.id : 'guest',
          nickname: user ? user.nickname : '星际高手',
          game_id: gameId,
          score: scoreVal
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`积分 ${scoreVal} 分已持久化记录至高分排行榜！`, 'success');
        fetchScores();
      }
    } catch (e) {}
  };

  // --- 俄罗斯方块逻辑 ---
  useEffect(() => {
    if (activeGame !== 'tetris' || !tetrisRunning) return;

    const canvas = tetrisCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let score = 0;
    const COLS = 10, ROWS = 20, BLOCK_SIZE = 20;
    const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    const SHAPES = [
      [[1, 1, 1, 1]],
      [[1, 1], [1, 1]],
      [[0, 1, 0], [1, 1, 1]],
      [[1, 0, 0], [1, 1, 1]],
      [[0, 0, 1], [1, 1, 1]]
    ];

    let currentPiece = {
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      x: 3,
      y: 0
    };

    const draw = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c]) {
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        }
      }

      ctx.fillStyle = '#f43f5e';
      currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value) {
            ctx.fillRect((currentPiece.x + c) * BLOCK_SIZE, (currentPiece.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
    };

    const collide = (px: number, py: number, shape: number[][]) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const newX = px + c;
            const newY = py + r;
            if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
            if (newY >= 0 && grid[newY][newX]) return true;
          }
        }
      }
      return false;
    };

    const drop = () => {
      if (!collide(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
        currentPiece.y++;
      } else {
        currentPiece.shape.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val && currentPiece.y + r >= 0) {
              grid[currentPiece.y + r][currentPiece.x + c] = 1;
            }
          });
        });

        for (let r = ROWS - 1; r >= 0; r--) {
          if (grid[r].every((cell) => cell !== 0)) {
            grid.splice(r, 1);
            grid.unshift(Array(COLS).fill(0));
            score += 100;
            setTetrisScore(score);
            r++;
          }
        }

        currentPiece = {
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          x: 3,
          y: 0
        };

        if (collide(currentPiece.x, currentPiece.y, currentPiece.shape)) {
          setTetrisGameOver(true);
          setTetrisRunning(false);
          submitScore('tetris', score);
          return;
        }
      }
      draw();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && !collide(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x--;
      } else if (e.key === 'ArrowRight' && !collide(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) {
        currentPiece.x++;
      } else if (e.key === 'ArrowDown') {
        drop();
      }
      draw();
    };

    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(drop, 450);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [activeGame, tetrisRunning]);

  // --- 贪吃蛇逻辑 ---
  useEffect(() => {
    if (activeGame !== 'snake' || !snakeRunning) return;

    const canvas = snakeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const GRID_SIZE = 15;
    let snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
    let food = { x: 10, y: 10 };
    let dx = 1, dy = 0;
    let score = 0;

    const draw = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 食物
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(food.x * GRID_SIZE + GRID_SIZE / 2, food.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.fill();

      // 蛇身
      ctx.fillStyle = '#10b981';
      snake.forEach((seg, idx) => {
        if (idx === 0) ctx.fillStyle = '#34d399';
        else ctx.fillStyle = '#10b981';
        ctx.fillRect(seg.x * GRID_SIZE, seg.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
      });
    };

    const update = () => {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // 撞墙或撞自身
      if (
        head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
        snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        setSnakeRunning(false);
        submitScore('snake', score);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score += 50;
        setSnakeScore(score);
        food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        };
      } else {
        snake.pop();
      }

      draw();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
      else if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
      else if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; }
      else if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; }
    };

    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(update, 200);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [activeGame, snakeRunning]);

  // --- 五子棋胜负判断 ---
  const checkGomokuWinner = (b: number[][], r: number, c: number, p: number) => {
    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]]
    ];

    for (const d of directions) {
      let count = 1;
      for (const [dr, dc] of d) {
        let nr = r + dr, nc = c + dc;
        while (nr >= 0 && nr < 15 && nc >= 0 && nc < 15 && b[nr][nc] === p) {
          count++;
          nr += dr;
          nc += dc;
        }
      }
      if (count >= 5) return true;
    }
    return false;
  };

  const handleCellClick = async (r: number, c: number) => {
    if (board[r][c] !== 0 || gomokuWinner || aiThinking) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = 1;
    setBoard(newBoard);

    if (checkGomokuWinner(newBoard, r, c, 1)) {
      setGomokuWinner(1);
      setGomokuStatus('🎉 恭喜！您成功击败了 Gemini 五子棋 AI！');
      submitScore('gomoku', 1000);
      return;
    }

    setAiThinking(true);
    setGomokuStatus('🤖 Gemini AI 思考中...');

    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/api/game/gomoku-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: newBoard, difficulty: gomokuDifficulty })
      });
      const data = await res.json();

      if (data.success) {
        const aiR = data.row;
        const aiC = data.col;
        newBoard[aiR][aiC] = 2;
        setBoard(newBoard);

        if (checkGomokuWinner(newBoard, aiR, aiC, 2)) {
          setGomokuWinner(2);
          setGomokuStatus('AI 获胜！评语：' + (data.commentary || '再接再厉！'));
        } else {
          setGomokuStatus(data.commentary ? `AI 评语: "${data.commentary}"` : '轮到您下子');
        }
      }
    } catch (e: any) {
      setGomokuStatus('AI 落子网络异常');
    } finally {
      setAiThinking(false);
    }
  };

  const resetGomoku = () => {
    setBoard(Array.from({ length: 15 }, () => Array(15).fill(0)));
    setGomokuWinner(null);
    setGomokuStatus('对局重新开始，请您下子');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 头部 Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <Gamepad2 className="w-4 h-4" />
            <span>/ooo 益智小游戏专区 & 全局高分榜</span>
          </div>
          <h2 className="text-xl font-bold text-white">五子棋 S级 AI、俄罗斯方块与贪吃蛇</h2>
        </div>

        {/* 游戏选项卡 */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveGame('gomoku')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeGame === 'gomoku' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'
            }`}
          >
            ⚪⚫ 五子棋 AI
          </button>
          <button
            onClick={() => setActiveGame('tetris')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeGame === 'tetris' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'
            }`}
          >
            🧩 俄罗斯方块
          </button>
          <button
            onClick={() => setActiveGame('snake')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeGame === 'snake' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'
            }`}
          >
            🐍 贪吃蛇
          </button>
        </div>
      </div>

      {/* 游戏舞台 & 高分榜 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 2列：游戏主舞台 */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center min-h-[480px]">
          {/* 五子棋 */}
          {activeGame === 'gomoku' && (
            <div className="space-y-4 flex flex-col items-center w-full">
              <div className="flex items-center justify-between w-full max-w-md bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-300 font-semibold">AI 难度:</span>
                  <select
                    value={gomokuDifficulty}
                    onChange={(e: any) => setGomokuDifficulty(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-sky-400 font-bold focus:outline-none"
                  >
                    <option value="beginner">初级 (新手)</option>
                    <option value="medium">中级 (玩家)</option>
                    <option value="advanced">高级 (大师)</option>
                    <option value="S">🔥 S级 (Gemini 2.0 对手)</option>
                  </select>
                </div>

                <button
                  onClick={resetGomoku}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-semibold text-sky-400 text-center">{gomokuStatus}</p>

              {/* 15x15 盘面 */}
              <div className="p-3 bg-amber-950/40 border-2 border-amber-900/60 rounded-2xl shadow-2xl inline-block">
                <div className="grid grid-cols-15 gap-0.5 bg-amber-900/40 p-1 rounded-lg">
                  {board.map((row, r) =>
                    row.map((cell, c) => (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className="w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all cursor-pointer hover:bg-amber-800/50"
                      >
                        {cell === 1 && (
                          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-slate-950 shadow-md border border-slate-700" />
                        )}
                        {cell === 2 && (
                          <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-slate-100 shadow-md border border-slate-300" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 俄罗斯方块 */}
          {activeGame === 'tetris' && (
            <div className="space-y-4 flex flex-col items-center">
              <div className="flex items-center gap-6 text-sm font-bold text-slate-200">
                <span>当前得分: <strong className="text-rose-400 font-mono text-lg">{tetrisScore}</strong></span>
                {tetrisGameOver && <span className="text-rose-500">游戏结束！</span>}
              </div>

              <div className="relative border-4 border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
                <canvas ref={tetrisCanvasRef} width={200} height={400} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setTetrisRunning(!tetrisRunning);
                    setTetrisGameOver(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
                >
                  {tetrisRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{tetrisRunning ? '暂停游戏' : '开始/继续'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">提示: 键盘 ← → 移动，↓ 加速下落</p>
            </div>
          )}

          {/* 贪吃蛇 */}
          {activeGame === 'snake' && (
            <div className="space-y-4 flex flex-col items-center">
              <div className="text-sm font-bold text-slate-200">
                贪吃蛇得分: <strong className="text-emerald-400 font-mono text-lg">{snakeScore}</strong>
              </div>

              <div className="border-4 border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
                <canvas ref={snakeCanvasRef} width={300} height={300} />
              </div>

              <button
                onClick={() => setSnakeRunning(!snakeRunning)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                {snakeRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{snakeRunning ? '暂停' : '开始贪吃蛇'}</span>
              </button>
              <p className="text-[11px] text-slate-500">提示: 使用键盘 ↑ ↓ ← → 方向键控制走向</p>
            </div>
          )}
        </div>

        {/* 右侧高分榜 */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">全服游戏高分尊享榜</h3>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {leaderboard.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold font-mono flex items-center justify-center ${
                      idx === 0
                        ? 'bg-amber-500 text-black'
                        : idx === 1
                        ? 'bg-slate-300 text-black'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block truncate max-w-[100px]">
                      {item.nickname || '玩家_' + item.id.slice(0, 4)}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.game_id}</span>
                  </div>
                </div>

                <span className="text-sm font-black text-rose-400 font-mono">{item.score} pts</span>
              </div>
            ))}
          </div>

          {/* 开发者拓展指南 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
            <span className="font-bold text-sky-400 flex items-center gap-1">
              <Code className="w-3.5 h-3.5" /> 开发者自由扩展小游戏:
            </span>
            <p className="leading-relaxed">
              新增小游戏只需在 <code className="text-amber-300 font-mono">GameView.tsx</code> 增加视图组件并调用 <code className="text-emerald-300 font-mono">submitScore('your_game_id', score)</code> 接口即可全服积分同步！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
