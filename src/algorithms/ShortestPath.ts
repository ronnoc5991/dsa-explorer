import { Graph } from "../data-structures/Graph";
import { VertexName, vertexNameToPosition } from "../data-structures/Vertex";

type OpenSet = Array<VertexName>;
type VisitedSet = Set<VertexName>;
type FScore = Map<VertexName, number>;
type GScore = Map<VertexName, number>;
type CameFrom = Map<VertexName, VertexName | null>;
type Heuristic = (u: VertexName, v: VertexName) => number;

// GOAL
// refactor these things to allow me to walk through them step by step
// 1. identify what the steps are that we want to visualize
// 2. use some combination of timeouts and promises to allow this thing to work...
// 3. expose the state that we are interested in illustrating to the outside world
// 4. ensure that this thing is still testable...
// 5. just visualize one thing at a time for now

class ShortestPathAlgorithm {
  private graph: Graph;
  private start: VertexName;
  private end: VertexName;
  private h: Heuristic;
  private state: {
    openSet: OpenSet;
    visitedSet: VisitedSet;
    fScore: FScore;
    gScore: GScore;
    cameFrom: CameFrom;
  };

  constructor(graph: Graph, start: VertexName, end: VertexName, h: Heuristic) {
    this.graph = graph;
    this.start = start;
    this.end = end;
    this.h = h;
    this.state = this.initializeState(graph, start, end, h);
  }

  public getOpenSet(): Array<VertexName> {
    return this.state.openSet;
  }

  public getVisitedSet(): Array<VertexName> {
    return Array.from(this.state.visitedSet);
  }
  // it might makes sense to expose functions like this so that the renderer doesn't actually have to know the 'shape' of the state...
  // TODO: does this make sense to return Infinity if it does not exist in the table?
  public getVertexGScore(v: VertexName): number {
    return this.state.gScore.get(v) || Infinity;
  }

  public getVertexFScore(v: VertexName): number {
    return this.state.fScore.get(v) || Infinity;
  }

  public findShortestPath(): Array<VertexName> | null {
    const pathExists = this.search({
      graph: this.graph,
      end: this.end,
      h: this.h,
      cameFrom: this.state.cameFrom,
      fScore: this.state.fScore,
      gScore: this.state.gScore,
      openSet: this.state.openSet,
      visitedSet: this.state.visitedSet,
    });

    if (pathExists) {
      return this.reconstructPath(this.end, this.state.cameFrom);
    } else {
      return null;
    }
  }

  private initializeState(
    graph: Graph,
    start: VertexName,
    end: VertexName,
    h: (u: VertexName, v: VertexName) => number
  ) {
    const openSet: OpenSet = [start];
    const visitedSet: VisitedSet = new Set();
    const fScore: FScore = new Map();
    const gScore: GScore = new Map();
    const cameFrom: CameFrom = new Map();

    graph.getVerticesNames().forEach((v) => {
      cameFrom.set(v, null);
      gScore.set(v, v === start ? 0 : Infinity);
      fScore.set(v, v === start ? h(v, end) : Infinity);
    });

    return {
      openSet,
      visitedSet,
      fScore,
      gScore,
      cameFrom,
    };
  }

  private search({
    graph,
    end,
    h,
    cameFrom,
    openSet,
    visitedSet,
    fScore,
    gScore,
  }: {
    graph: Graph;
    end: VertexName;
    h: Heuristic;
    cameFrom: CameFrom;
    openSet: OpenSet;
    visitedSet: VisitedSet;
    fScore: FScore;
    gScore: GScore;
  }): boolean {
    while (openSet.length) {
      const current = openSet.shift() as VertexName;

      if (current === end) return true; // we have updated all of the state... it can be reconstructed now...

      if (visitedSet.has(current)) continue;
      visitedSet.add(current);

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
          if (!visitedSet.has(neighbor)) openSet.push(neighbor);
        }
      });

      // TODO: how does this work with Dijkstra? doesn't this mean we do not sort the things at all?
      openSet.sort(
        (a, b) => (fScore.get(a) || Infinity) - (fScore.get(b) || Infinity)
      );
    }

    return false; // no path found
  }

  private reconstructPath(
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
}

// be able to query all of these things from the outside...
// then in an raf frame, update the things on the canvas?
// mutation + raf loop = rendering
// react not involved here?

// then each algo would have a 'step' function?
// that we would also call as a part of the raf loop?
// the algo would have to call its own step function at an interval...
// separate from our rendering raf loop

// I want to be able to run these things step by step...
// so I want to be able to 'start' them...
// and maybe I want to be able to 'stop' them?...
// when I start them, I want them to run step by step, updating their state as needed
// so they each need a step function?

// each class needs to expose the state I want to illustrate
// that state will be updated on each 'step'
// I will be rendering that behind the scenes

// I want to break the 'loop' out of this function
// this function is JUST the loop now...
// I want to break each iteration out into a separate function and call that on an interval

// how do I want to use this?
// I want to 'instantiate' the algorithm...
// then I want to call something like 'findShortestPath' which will update some state that I have access to...
// pass in a custom interval to the function so that we can test it with a 0 timeout when testing

// when the user clicks 'run'
// we instantiate the algo and let it loose
// then we run an raf loop that constantly reads the state of the algorithm and renders the things

// that means for testing purposes... could make the thing async... and await it in the tests... and also in the app?
// would also want to pass in an interval? would want it to run pretty quickly during testing... and slowly in the app...

export class Dijkstra extends ShortestPathAlgorithm {
  private static h: Heuristic = () => 0;

  constructor(graph: Graph, start: VertexName, end: VertexName) {
    super(graph, start, end, Dijkstra.h);
  }
}

export class AStar extends ShortestPathAlgorithm {
  private static h: Heuristic = (v, end) => {
    const startPosition = vertexNameToPosition(v);
    const endPosition = vertexNameToPosition(end);
    return Math.sqrt(
      Math.pow(Math.abs(startPosition.x - endPosition.x), 2) +
        Math.pow(Math.abs(startPosition.y - endPosition.y), 2)
    ); // the hypotenuse
  };

  constructor(graph: Graph, start: VertexName, end: VertexName) {
    super(graph, start, end, AStar.h);
  }
}
