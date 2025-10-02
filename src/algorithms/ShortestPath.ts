import { Graph } from "../data-structures/Graph";
import { VertexName, vertexNameToPosition } from "../data-structures/Vertex";

interface ShortestPathAlgorithm {
  findShortestPath(
    start: VertexName,
    end: VertexName
  ): Array<VertexName> | null;
  // reconstructPath(end: Vertex): Array<Vertex> | null;
  // getMinDistanceToVertex(u: Vertex): number; // the min distance at this point in time?
}

// what can happen to a node?
// it can be a node...
// it can be turned off (to allow the user to create unique graphs)
// it can be being expanded (the algo is expanding it at the moment)
// can also visualize edges... and show which ones are being expanded at the moment
// it can be 'visited'
// it can be a part of the final path
// it can have a shortest distance from the start...
// it can have an estimated distance to the end?
// it can be the 'goal'
// it can be the 'start'

// be able to query all of these things from the outside...
// then in an raf frame, update the things on the canvas?
// mutation + raf loop = rendering
// react not involved here?

// then each algo would have a 'step' function?
// that we would also call as a part of the raf loop?
// the algo would have to call its own step function at an interval...
// separate from our rendering raf loop
function search({
  graph,
  start,
  end,
  h,
  cameFrom,
}: {
  graph: Graph;
  start: VertexName;
  end: VertexName;
  h: (u: VertexName, end: VertexName) => number;
  cameFrom: Map<VertexName, VertexName | null>;
}): boolean {
  const q = [start];
  const visited = new Set();
  const fScore: Map<VertexName, number> = new Map();
  const gScore: Map<VertexName, number> = new Map();

  // could have the algo class do this? and pass the stateful parts in?
  graph.getVerticesNames().forEach((v) => {
    cameFrom.set(v, null);
    gScore.set(v, v === start ? 0 : Infinity);
    fScore.set(v, v === start ? h(v, end) : Infinity);
  });

  while (q.length) {
    const current = q.shift() as VertexName;

    if (current === end) return true; // we have updated all of the state... it can be reconstructed now...

    if (visited.has(current)) continue;
    visited.add(current);

    graph.getNeighbors(current).forEach((neighbor) => {
      // get the existing gScore for this one
      const g = gScore.get(neighbor) ?? Infinity;
      // get the newGScore for this one
      const potentialG =
        (gScore.get(current) ?? Infinity) +
        graph.getEdgeWeight(current, neighbor);

      if (potentialG < g) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, potentialG);
        fScore.set(neighbor, potentialG + h(neighbor, end));
        if (!visited.has(neighbor)) q.push(neighbor);
      }
    });

    // TODO: how does this work with Dijkstra? doesn't this mean we do not sort the things at all?
    q.sort((a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity));
  }

  return false; // no path found
}

function reconstructPath(
  end: VertexName,
  cameFrom: Map<VertexName, VertexName | null>
) {
  const pathInReverse: Array<VertexName> = [];

  let curr: VertexName | null = end;

  while (curr) {
    pathInReverse.push(curr);
    curr = cameFrom.get(curr) ?? null;
  }

  return pathInReverse.length > 1 ? pathInReverse.reverse() : null;
}

export class Dijkstra implements ShortestPathAlgorithm {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  findShortestPath(
    start: VertexName,
    end: VertexName
  ): Array<VertexName> | null {
    const cameFrom: Map<VertexName, VertexName | null> = new Map();
    const pathExists = search({
      graph: this.graph,
      end,
      start,
      h: () => 0,
      cameFrom,
    });

    if (pathExists) {
      return reconstructPath(end, cameFrom);
    } else {
      return null;
    }
  }
}

export class AStar {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  findShortestPath(
    start: VertexName,
    end: VertexName
  ): Array<VertexName> | null {
    const cameFrom: Map<VertexName, VertexName | null> = new Map();
    const pathExists = search({
      graph: this.graph,
      end,
      start,
      h: (v, end) => {
        const startPosition = vertexNameToPosition(v);
        const endPosition = vertexNameToPosition(end);
        return Math.sqrt(
          Math.pow(Math.abs(startPosition.x - endPosition.x), 2) +
            Math.pow(Math.abs(startPosition.y - endPosition.y), 2)
        ); // the hypotenuse
      },
      cameFrom,
    });

    if (pathExists) {
      return reconstructPath(end, cameFrom);
    } else {
      return null;
    }
  }
}
