import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCcw, Save, Upload } from 'lucide-react';
import { runBFS, runDFS, runDijkstra } from './algorithms/graphAlgorithms';

function App() {
  const [numNodes, setNumNodes] = useState(5);
  const [edgesText, setEdgesText] = useState('1 2\n2 3\n3 4\n4 5\n1 5\n1 3');
  const [algorithm, setAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState(1);
  const [speed, setSpeed] = useState(500);

  // Graph State
  const [nodes, setNodes] = useState([]);
  const [edgesList, setEdgesList] = useState([]);
  
  // Animation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationState, setAnimationState] = useState({
    visited: [],
    current: null,
    checkingEdge: null,
    distances: {},
  });
  
  const timerRef = useRef(null);
  const generatorRef = useRef(null);

  // Calculate layout when N changes
  useEffect(() => {
    const newNodes = [];
    const n = Math.max(1, parseInt(numNodes) || 1);
    const radius = 200;
    const centerX = 300;
    const centerY = 300;

    for (let i = 1; i <= n; i++) {
      const angle = ((i - 1) * 2 * Math.PI) / n - Math.PI / 2;
      newNodes.push({
        id: i,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    setNodes(newNodes);
    resetAnimation();
  }, [numNodes]);

  // Parse edges when text changes
  useEffect(() => {
    const parsed = edgesText.split('\n').map(line => {
      const parts = line.trim().split(/[\s,]+/);
      if (parts.length >= 2) {
        return [parseInt(parts[0]), parseInt(parts[1]), parts.length > 2 ? parseInt(parts[2]) : 1];
      }
      return null;
    }).filter(e => e !== null && !isNaN(e[0]) && !isNaN(e[1]));
    
    setEdgesList(parsed);
    resetAnimation();
  }, [edgesText]);

  const resetAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    generatorRef.current = null;
    setAnimationState({
      visited: [],
      current: null,
      checkingEdge: null,
      distances: {},
    });
  };

  const startAnimation = () => {
    if (isPlaying) return;
    
    if (!generatorRef.current) {
      if (algorithm === 'bfs') {
        generatorRef.current = runBFS(nodes, edgesList, parseInt(startNode) || 1);
      } else if (algorithm === 'dfs') {
        generatorRef.current = runDFS(nodes, edgesList, parseInt(startNode) || 1);
      } else if (algorithm === 'dijkstra') {
        generatorRef.current = runDijkstra(nodes, edgesList, parseInt(startNode) || 1);
      }
    }

    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      const { value, done } = generatorRef.current.next();
      if (done) {
        setIsPlaying(false);
        clearInterval(timerRef.current);
      } else {
        setAnimationState(prev => ({
          ...prev,
          visited: value.visited || prev.visited,
          current: value.node || prev.current,
          checkingEdge: value.edge || null,
          distances: value.distances || prev.distances,
        }));
      }
    }, speed);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const saveGraph = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/graphs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Graph ${nodes.length} nodes`,
          numNodes: parseInt(numNodes),
          edges: edgesText.split('\n').filter(l => l.trim().length > 0)
        })
      });
      if (res.ok) {
        alert('Graph saved successfully!');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save graph. Ensure backend is running.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800 p-6 shadow-xl z-10 flex flex-col gap-6 overflow-y-auto border-r border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-1">
            GRAPH VISUALISER
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Number of Nodes (N)</label>
            <input 
              type="number" 
              min="1" 
              max="20"
              value={numNodes} 
              onChange={e => setNumNodes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Edges (u v [weight])</label>
            <textarea 
              rows={6}
              value={edgesText} 
              onChange={e => setEdgesText(e.target.value)}
              placeholder="1 2 5&#10;2 3 10&#10;1 4"
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Algorithm</label>
            <select 
              value={algorithm} 
              onChange={e => {setAlgorithm(e.target.value); resetAnimation();}}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="bfs">Breadth-First Search (BFS)</option>
              <option value="dfs">Depth-First Search (DFS)</option>
              <option value="dijkstra">Dijkstra's Algorithm</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Start Node</label>
            <input 
              type="number" 
              min="1" 
              max={numNodes}
              value={startNode} 
              onChange={e => {setStartNode(e.target.value); resetAnimation();}}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Animation Speed ({speed}ms)</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100"
              value={speed} 
              onChange={e => {setSpeed(Number(e.target.value)); if(isPlaying) { pauseAnimation(); startAnimation(); }}}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          {isPlaying ? (
            <button onClick={pauseAnimation} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition">
              <Square size={16} /> Pause
            </button>
          ) : (
            <button onClick={startAnimation} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition">
              <Play size={16} /> Play
            </button>
          )}
          <button onClick={resetAnimation} className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-2 px-4 rounded flex items-center justify-center transition">
            <RefreshCcw size={16} />
          </button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-700">
          <button onClick={saveGraph} className="w-full bg-blue-600 hover:bg-blue-700 text-slate-100 font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition mb-2">
            <Save size={16} /> Save to Database
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black overflow-hidden flex items-center justify-center">
        {/* Canvas / SVG */}
        <svg className="w-full h-full max-w-3xl max-h-3xl" viewBox="0 0 600 600">
          {/* Edges */}
          {edgesList.map((edge, idx) => {
            const [u, v, weight] = edge;
            const nodeU = nodes.find(n => n.id === u);
            const nodeV = nodes.find(n => n.id === v);
            if (!nodeU || !nodeV) return null;

            const isChecking = animationState.checkingEdge && 
              ((animationState.checkingEdge[0] === u && animationState.checkingEdge[1] === v) || 
               (animationState.checkingEdge[0] === v && animationState.checkingEdge[1] === u));
            
            const isVisited = animationState.visited.includes(u) && animationState.visited.includes(v);

            let strokeColor = "#334155"; // slate-700
            let strokeWidth = 2;
            
            if (isChecking) {
              strokeColor = "#f59e0b"; // amber-500
              strokeWidth = 4;
            } else if (isVisited) {
              strokeColor = "#10b981"; // emerald-500
              strokeWidth = 3;
            }

            return (
              <g key={`edge-${idx}`}>
                <line 
                  x1={nodeU.x} 
                  y1={nodeU.y} 
                  x2={nodeV.x} 
                  y2={nodeV.y} 
                  stroke={strokeColor} 
                  strokeWidth={strokeWidth}
                  className="transition-all duration-300 ease-in-out"
                />
                {algorithm === 'dijkstra' && (
                  <text 
                    x={(nodeU.x + nodeV.x) / 2} 
                    y={(nodeU.y + nodeV.y) / 2 - 5} 
                    fill="#94a3b8" 
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const isCurrent = animationState.current === node.id;
            const isVisited = animationState.visited.includes(node.id);
            const isStart = parseInt(startNode) === node.id;
            
            let fillColor = "#1e293b"; // slate-800
            let strokeColor = "#475569"; // slate-600
            let scale = 1;
            let strokeWidth = 3;

            if (isCurrent) {
              fillColor = "#f59e0b"; // amber-500
              strokeColor = "#fcd34d"; // amber-300
              scale = 1.2;
            } else if (isVisited) {
              fillColor = "#10b981"; // emerald-500
              strokeColor = "#6ee7b7"; // emerald-300
            } else if (isStart) {
              strokeColor = "#3b82f6"; // blue-500
              strokeWidth = 4;
            }

            return (
              <g key={`node-${node.id}`} className="transition-all duration-300 ease-in-out" style={{ transform: `scale(${scale})`, transformOrigin: `${node.x}px ${node.y}px` }}>
                <circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={20} 
                  fill={fillColor} 
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
                <text 
                  x={node.x} 
                  y={node.y} 
                  fill="#f8fafc" 
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {node.id}
                </text>
                {algorithm === 'dijkstra' && animationState.distances[node.id] !== undefined && (
                  <text 
                    x={node.x} 
                    y={node.y + 30} 
                    fill="#38bdf8" 
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {animationState.distances[node.id] === Infinity ? '∞' : animationState.distances[node.id]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default App;
