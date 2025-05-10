
interface ClassFilterProps {
  selectedClass: number | null;
  onClassSelect: (kelas: number) => void;
  classes: number[];
}

const ClassFilter = ({ selectedClass, onClassSelect, classes }: ClassFilterProps) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {classes.map((kelas) => (
        <button
          key={kelas}
          onClick={() => onClassSelect(kelas)}
          className={`islamic-bubble aspect-square ${
            selectedClass === kelas ? "bg-accent text-accent-foreground" : ""
          }`}
        >
          <span className="text-lg font-medium">Kelas {kelas}</span>
        </button>
      ))}
    </div>
  );
};

export default ClassFilter;
