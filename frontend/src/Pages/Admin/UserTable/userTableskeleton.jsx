const UserTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="w-full animate-pulse">
      <div className="h-8 w-40 bg-zinc-200 rounded mb-6" />

      <div className="grid grid-cols-6 gap-4 border-b pb-3 mb-4">
        <div className="h-4 bg-zinc-300 rounded col-span-1" />
        <div className="h-4 bg-zinc-300 rounded col-span-1" />
        <div className="h-4 bg-zinc-300 rounded col-span-1" />
        <div className="h-4 bg-zinc-300 rounded col-span-1" />
        <div className="h-4 bg-zinc-300 rounded col-span-1" />
        <div className="h-4 bg-zinc-300 rounded col-span-1" />
      </div>

      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-4 py-4 border-b items-center"
        >
          <div className="h-4 bg-zinc-200 rounded col-span-1 w-8" />
          <div className="h-4 bg-zinc-200 rounded col-span-1 w-24" />
          <div className="h-4 bg-zinc-200 rounded col-span-1 w-40" />
          <div className="h-4 bg-zinc-200 rounded col-span-1 w-20" />
          <div className="space-y-2 col-span-1">
            <div className="h-3 bg-zinc-200 rounded w-24" />
            <div className="h-3 bg-zinc-200 rounded w-28" />
            <div className="h-3 bg-zinc-200 rounded w-32" />
          </div>
          <div className="h-4 bg-zinc-200 rounded col-span-1 w-32" />
        </div>
      ))}
    </div>
  );
};
export default UserTableSkeleton;