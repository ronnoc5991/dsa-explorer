export type VertexName = `${number}-${number}`;

export type VertexPosition = { x: number; y: number };

export function vertexPositionToName({ x, y }: VertexPosition): VertexName {
  return `${x}-${y}`;
}

export function vertexNameToPosition(name: VertexName): VertexPosition {
  const [x, y] = name.split("-");
  return { x: Number(x), y: Number(y) };
}
