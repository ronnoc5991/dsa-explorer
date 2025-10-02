type CounterProps = {
  value: number;
  onIncrement: (value: number) => void;
  onDecrement: (value: number) => void;
};

// TODO: make this accessible/use an input or something
export default function Counter({
  value,
  onIncrement,
  onDecrement,
}: CounterProps) {
  return (
    <div>
      <button type="button" onClick={() => onDecrement(value - 1)}>
        -
      </button>
      {value}
      <button type="button" onClick={() => onIncrement(value + 1)}>
        +
      </button>
    </div>
  );
}
