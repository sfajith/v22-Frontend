interface TotalLinksCardProps {
  total?: number;
  description: string;
  title: string;
}

const TotalCard: React.FC<TotalLinksCardProps> = ({
  total,
  description,
  title,
}) => {
  return (
    <div className="rounded-2xl bg-white shadow-sm dark:bg-zinc-900 p-4 flex flex-col gap-2 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
      <p className="text-3xl font-semibold text-zinc-900 dark:text-white">
        {total}
      </p>
      <span className="text-sm text-zinc-400">{description}</span>
    </div>
  );
};

export default TotalCard;
