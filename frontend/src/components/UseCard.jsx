export default function UserCard({ name, date, image }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-20 h-20 rounded-full border-2 border-indigo-500 shadow"
        />
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
      </div>
      <h3 className="mt-4 font-semibold text-lg text-zinc-800">{name}</h3>
      <p className="text-sm text-zinc-500">{date}</p>
    </div>
  );
}
