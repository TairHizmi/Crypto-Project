interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      className="search-bar"
      placeholder="Search Coin..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
