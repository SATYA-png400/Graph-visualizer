// graphAlgorithms.js
// These functions are generator functions that yield steps for the animation

export function* runBFS(nodes, edgesList, startNode) {
  const adjList = buildAdjList(nodes.length, edgesList);
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);

  yield { type: 'VISITING', node: startNode, visited: Array.from(visited) };

  while (queue.length > 0) {
    const current = queue.shift();
    yield { type: 'CURRENT', node: current, visited: Array.from(visited) };

    const neighbors = adjList[current] || [];
    for (const neighbor of neighbors) {
      yield { type: 'CHECKING_EDGE', edge: [current, neighbor], visited: Array.from(visited) };
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        yield { type: 'VISITED', node: neighbor, visited: Array.from(visited), edge: [current, neighbor] };
      }
    }
  }
  
  yield { type: 'DONE', visited: Array.from(visited) };
}

export function* runDFS(nodes, edgesList, startNode) {
  const adjList = buildAdjList(nodes.length, edgesList);
  const visited = new Set();
  
  function* dfsHelper(current) {
    visited.add(current);
    yield { type: 'CURRENT', node: current, visited: Array.from(visited) };

    const neighbors = adjList[current] || [];
    for (const neighbor of neighbors) {
      yield { type: 'CHECKING_EDGE', edge: [current, neighbor], visited: Array.from(visited) };
      if (!visited.has(neighbor)) {
        yield { type: 'VISITED', node: neighbor, visited: Array.from(visited), edge: [current, neighbor] };
        yield* dfsHelper(neighbor);
        // backtracking
        yield { type: 'CURRENT', node: current, visited: Array.from(visited) };
      }
    }
  }

  yield* dfsHelper(startNode);
  yield { type: 'DONE', visited: Array.from(visited) };
}

export function* runDijkstra(nodes, edgesList, startNode) {
  const adjList = buildAdjListWeighted(nodes.length, edgesList);
  const dist = {};
  const prev = {};
  const visited = new Set();
  
  nodes.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[startNode] = 0;

  while (visited.size < nodes.length) {
    // Find min dist node
    let current = null;
    let minDist = Infinity;
    for (const n of nodes) {
      if (!visited.has(n.id) && dist[n.id] < minDist) {
        minDist = dist[n.id];
        current = n.id;
      }
    }

    if (current === null) break; // unreachable nodes

    visited.add(current);
    yield { type: 'CURRENT', node: current, visited: Array.from(visited), distances: { ...dist } };

    const neighbors = adjList[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (visited.has(neighbor)) continue;
      
      yield { type: 'CHECKING_EDGE', edge: [current, neighbor], visited: Array.from(visited), distances: { ...dist } };
      
      const alt = dist[current] + weight;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
        yield { type: 'UPDATE_DIST', node: neighbor, edge: [current, neighbor], visited: Array.from(visited), distances: { ...dist } };
      }
    }
  }
  
  yield { type: 'DONE', visited: Array.from(visited), distances: dist, prev };
}

// Helpers
function buildAdjList(numNodes, edgesList) {
  const adj = {};
  for (let i = 1; i <= numNodes; i++) adj[i] = [];
  
  for (const edge of edgesList) {
    const [u, v] = edge;
    adj[u].push(v);
    adj[v].push(u); // assuming undirected
  }
  return adj;
}

function buildAdjListWeighted(numNodes, edgesList) {
  const adj = {};
  for (let i = 1; i <= numNodes; i++) adj[i] = [];
  
  for (const edge of edgesList) {
    // assume weight is 1 if not provided
    const [u, v, w = 1] = edge;
    adj[u].push({ node: v, weight: w });
    adj[v].push({ node: u, weight: w }); 
  }
  return adj;
}
