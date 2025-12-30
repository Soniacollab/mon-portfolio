import { TSkill } from "../../../types";

interface MultiSelectSkillsProps {
  skills: TSkill[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
  className?: string;
  name?: string; // nom du champ à utiliser avec les form managers si nécessaire
}

export default function MultiSelectSkills({ skills, selected, onChange, className = "", name }: MultiSelectSkillsProps) {
  const handleToggle = (id: string) => {
    const already = selected.includes(id);
    const updated = already ? selected.filter((s) => s !== id) : [...selected, id];
    onChange(updated);
  };

  return (
    <div className={`flex flex-wrap gap-3 mt-2 ${className}`} role="group" aria-label={name || "skills"}>
      {skills.map((skill) => (
        <label
          key={skill._id}
          className="flex items-center gap-2 text-white bg-[rgba(145,94,255,0.2)] px-2 py-1 rounded cursor-pointer hover:bg-[rgba(145,94,255,0.4)]"
        >
          <input
            type="checkbox"
            className="accent-[#915EFF]"
            checked={selected.includes(skill._id)}
            onChange={() => handleToggle(skill._id)}
            aria-label={`Select ${skill.name}`}
          />
          {skill.name}
        </label>
      ))}
    </div>
  );
}
