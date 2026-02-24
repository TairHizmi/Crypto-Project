interface Props {
  visible: boolean;
  options: string[];
  onChoose: (id: string) => void;
  onClose: () => void;
}

export default function Dialog({ visible, options, onChoose, onClose }: Props) {
  if (!visible) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Select a coin to cancel</h3>
        <ul className="dialog-list">
          {options.map((id) => (
            <li key={id}>
              <button onClick={() => onChoose(id)}>{id}</button>
            </li>
          ))}
        </ul>
        <button className="dialog-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
