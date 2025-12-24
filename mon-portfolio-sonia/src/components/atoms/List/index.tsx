interface ListProps {
  items: string[];
  className?: string;
}

const List: React.FC<ListProps> = ({ items, className = "" }) => (
  <ul className={`ml-5 list-disc space-y-2 text-white/80 ${className}`}>
    {items.map((item, index) => (
      <li key={index} className="text-[14px] leading-relaxed">
        {item}
      </li>
    ))}
  </ul>
);

export default List;
