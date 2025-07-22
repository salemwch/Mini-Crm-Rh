export default function EquipmentStatus({ status, users }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold mb-2">Equipment Status</h4>
      <p className="text-sm text-zinc-600">{status}</p>
      <div className="flex gap-2 mt-2">
        {/*users.map((user, idx) => (
          <img key={idx} src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
        ))*/}
      </div>
    </div>
  );
}