import wait from "../utils/wait";
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

export class ShortestPathAlgorithm {
  private graph: Graph;
  private start: VertexName;
  private end: VertexName;
  private h: Heuristic;
  private openSet: OpenSet;
  private visitedSet: VisitedSet;
  private fScore: FScore;
  private gScore: GScore;
  private cameFrom: CameFrom;
  private vertexBeingExpanded: VertexName | null = null;
  private vertexBeingEvaluated: VertexName | null = null;
  private stepDuration: number;

  constructor(
    graph: Graph,
    start: VertexName,
    end: VertexName,
    h: Heuristic,
    stepDuration: number
  ) {
    this.graph = graph;
    this.start = start;
    this.end = end;
    this.h = h;
    const { cameFrom, fScore, gScore, openSet, visitedSet } =
      this.initializeState(graph, start, end, h);
    this.cameFrom = cameFrom;
    this.fScore = fScore;
    this.gScore = gScore;
    this.openSet = openSet;
    this.visitedSet = visitedSet;
    this.stepDuration = stepDuration;
  }

  // TODO: make these return read only versions?
  public getVertexBeingExpanded(): VertexName | null {
    return this.vertexBeingExpanded;
  }

  public getVertexBeingEvaluated(): VertexName | null {
    return this.vertexBeingEvaluated;
  }

  public getOpenSet(): Array<VertexName> {
    return this.openSet;
  }

  public getVisitedSet(): Array<VertexName> {
    return Array.from(this.visitedSet);
  }
  // TODO: does this make sense to return Infinity if it does not exist in the table?
  public getVertexGScore(v: VertexName): number {
    return this.gScore.get(v) || Infinity;
  }

  public getVertexFScore(v: VertexName): number {
    return this.fScore.get(v) || Infinity;
  }

  public async findShortestPath(): Promise<Array<VertexName> | null> {
    const pathExists = await this.search();

    if (pathExists) {
      return this.reconstructPath(this.end, this.cameFrom);
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

  private async evaluateVertex() {
    const g =
      this.gScore.get(this.vertexBeingEvaluated as VertexName) ?? Infinity;
    // get the newGScore for this one
    const potentialG =
      (this.gScore.get(this.vertexBeingExpanded as VertexName) ?? Infinity) +
      this.graph.getEdgeWeight(
        this.vertexBeingExpanded as VertexName,
        this.vertexBeingEvaluated as VertexName
      );

    if (potentialG < g) {
      this.cameFrom.set(
        this.vertexBeingEvaluated as VertexName,
        this.vertexBeingExpanded
      );
      this.gScore.set(this.vertexBeingEvaluated as VertexName, potentialG);
      this.fScore.set(
        this.vertexBeingEvaluated as VertexName,
        potentialG + this.h(this.vertexBeingEvaluated as VertexName, this.end)
      );
      if (!this.visitedSet.has(this.vertexBeingEvaluated as VertexName))
        this.openSet.push(this.vertexBeingEvaluated as VertexName);
    }
  }

  private async search(): Promise<boolean> {
    while (this.openSet.length) {
      this.sortOpenSet();
      this.vertexBeingExpanded = this.openSet.shift() as VertexName;

      if (this.vertexBeingExpanded === this.end) return true;

      await wait(this.stepDuration);

      const neighbors = this.graph.getNeighbors(this.vertexBeingExpanded);

      while (neighbors.length) {
        this.vertexBeingEvaluated = neighbors.shift() as VertexName; // this could be dangerous if it ever directly mutates the graph...
        await wait(this.stepDuration);
        await this.evaluateVertex();
        this.vertexBeingEvaluated = null;
      }
    }

    return false; // no path found
  }

  private sortOpenSet() {
    // TODO: how does this work with Dijkstra? doesn't this mean we do not sort the things at all?
    this.openSet.sort(
      (a, b) =>
        (this.fScore.get(a) || Infinity) - (this.fScore.get(b) || Infinity)
    );
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

export class Dijkstra extends ShortestPathAlgorithm {
  private static h: Heuristic = () => 0;

  constructor(
    graph: Graph,
    start: VertexName,
    end: VertexName,
    stepDuration: number
  ) {
    super(graph, start, end, Dijkstra.h, stepDuration);
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

  constructor(
    graph: Graph,
    start: VertexName,
    end: VertexName,
    stepDuration: number
  ) {
    super(graph, start, end, AStar.h, stepDuration);
  }
}
