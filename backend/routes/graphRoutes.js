const express = require('express');
const router = express.Router();
const Graph = require('../models/Graph');

// GET all graphs
router.get('/', async (req, res) => {
  try {
    const graphs = await Graph.find().sort({ createdAt: -1 });
    res.json(graphs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific graph
router.get('/:id', async (req, res) => {
  try {
    const graph = await Graph.findById(req.params.id);
    if (!graph) return res.status(404).json({ message: 'Graph not found' });
    res.json(graph);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new graph
router.post('/', async (req, res) => {
  const graph = new Graph({
    title: req.body.title,
    numNodes: req.body.numNodes,
    edges: req.body.edges
  });

  try {
    const newGraph = await graph.save();
    res.status(201).json(newGraph);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
