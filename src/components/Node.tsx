type NodeState = "active" | "disabled" | "in-path";

type NodeProps = {
  state: NodeState;
  onClick: () => void;
};

export default function Node({ state, onClick }: NodeProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        height: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: state === "disabled" ? "scale(.8)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.18, 0.89, 0.32, 1.35)",
          border: state === "in-path" ? "1px solid green" : "1px solid white",
          opacity: state === "disabled" ? "50%" : "100%",
        }}
      />
    </button>
  );
}
