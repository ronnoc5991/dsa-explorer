"use client";

// TODO: break this thing out into components...
// TODO: get rid of many useEffects with a library like zustand (some sort of state management)
// TODO: POC out how to play the algorithm through step by step so we have time to visualize it

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import gridToGraph from "@/utils/gridToGraph";
import {
  AStar,
  Dijkstra,
  ShortestPathAlgorithm,
} from "@/algorithms/ShortestPath";
import { VertexName, vertexNameToPosition } from "@/data-structures/Vertex";
import { Graph } from "@/data-structures/Graph";
import GraphDisplay from "@/components/GraphDisplay";
import useRequestAnimationFrame from "@/hooks/useRequestAnimationFrame";

type BooleanGrid = Array<Array<boolean>>;

function generateGrid(size: number, prev?: BooleanGrid | null) {
  return Array.from({ length: size }).map((_, rIndex) =>
    Array.from({ length: size }).map(
      (_, cIndex) => prev?.[rIndex]?.[cIndex] ?? true
    )
  );
}

type ShortestPathAlgorithmName = "Dijkstra's" | "A-Star";

// TODO: allow the user to select the duration of each step
const stepDuration = 100;

// now, we want to run some sort of raf loop that checks the state of the algo
// and updates some state
// and that state will impact how the graph is shown on the screen

const shortestPathAlgorithms: Record<
  ShortestPathAlgorithmName,
  (graph: Graph, start: VertexName, end: VertexName) => ShortestPathAlgorithm
> = {
  "Dijkstra's": (graph: Graph, start: VertexName, end: VertexName) =>
    new Dijkstra(graph, start, end, stepDuration),
  "A-Star": (graph: Graph, start: VertexName, end: VertexName) =>
    new AStar(graph, start, end, stepDuration),
} as const;

type MouseMode = "default" | "select-start" | "select-end";

export default function ShortestPath() {
  const [size, setSize] = useState(10);

  const [grid, setGrid] = useState<Array<Array<boolean>>>(generateGrid(size));

  const [graph, setGraph] = useState(gridToGraph(grid));

  const [algorithm, setAlgorithm] =
    useState<ShortestPathAlgorithmName>("Dijkstra's");

  const [algoInstance, setAlgoInstance] =
    useState<ShortestPathAlgorithm | null>(null);

  const [shortestPath, setShortestPath] = useState<Array<string> | null>(null);

  const [mouseMode, setMouseMode] = useState<MouseMode>("default");

  const [startNode, setStartNode] = useState<VertexName | null>(null);
  const [endNode, setEndNode] = useState<VertexName | null>(null);

  const adjustGridSize = (s: number) => {
    setGrid((prev) => generateGrid(s, prev));
  };

  useEffect(() => {
    adjustGridSize(size);
  }, [size]);

  useEffect(() => {
    setGraph(gridToGraph(grid));
  }, [grid]);

  const findShortestPath = async () => {
    if (!startNode || !endNode) return;
    const algo = shortestPathAlgorithms[algorithm](graph, startNode, endNode);
    console.log("setting algoInstance: ", algo);
    setAlgoInstance(algo);
    const p = await algo.findShortestPath();
    setShortestPath(p);
  };

  const [vertexBeingExpanded, setVertexBeingExpanded] =
    useState<VertexName | null>(null);

  const tick = () => {
    console.log("in loop!");
    if (!algoInstance) return;
    setVertexBeingExpanded(algoInstance.getVertexBeingExpanded());
  };

  useRequestAnimationFrame(tick);

  useEffect(() => {
    if (shortestPath !== null) setShortestPath(null);
    setStartNode(null);
    setEndNode(null);
  }, [graph]);

  useEffect(() => {
    if (shortestPath !== null) setShortestPath(null);
  }, [startNode, endNode]);

  const toggleIsNodeActive = (rowIndex: number, colIndex: number) => {
    setGrid((g) =>
      g.map((row, rIndex) =>
        row.map((isActive, cIndex) =>
          rowIndex === rIndex && colIndex === cIndex ? !isActive : isActive
        )
      )
    );
  };

  // TODO: instead of having the user select the algo...
  // we could render the same graph twice to highlight the differences/similarities between the algos?

  const getNodeState = (name: VertexName) => {
    console.log("node state", name, vertexBeingExpanded);
    if (name === vertexBeingExpanded) return "being-expanded";
    return "active";
  };

  return (
    <div>
      <Counter
        value={size}
        onDecrement={(v) => v > 1 && setSize(v)}
        onIncrement={(v) => v <= 20 && setSize(v)}
      />
      <select
        value={algorithm}
        onChange={(e) =>
          setAlgorithm(e.target.value as ShortestPathAlgorithmName)
        }
      >
        {Object.keys(shortestPathAlgorithms).map((name) => {
          return (
            <option key={name} value={name}>
              {name}
            </option>
          );
        })}
      </select>
      <button onClick={findShortestPath}>Find Shortest Path</button>
      <div>
        <button onClick={() => setMouseMode("default")}>Default</button>
        <br />
        <button onClick={() => setMouseMode("select-start")}>
          Select Start
        </button>
        <br />
        <button onClick={() => setMouseMode("select-end")}>Select End</button>
      </div>
      <div>Mode is: {mouseMode}</div>
      <br />
      <div>Start is: {startNode}</div>
      <br />
      <div>End is: {endNode}</div>
      {/* could have the same underlying grid and run two different algos on it? */}
      <GraphDisplay
        grid={grid}
        onVertexClick={(name) => {
          const { x, y } = vertexNameToPosition(name);

          switch (mouseMode) {
            case "default":
              toggleIsNodeActive(y, x);
              break;
            case "select-start":
              setStartNode(name);
              break;
            case "select-end":
              setEndNode(name);
              break;
            default:
              break;
          }
        }}
      />
    </div>
  );
}
