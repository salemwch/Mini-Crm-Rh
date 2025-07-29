import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Eye, Building2,
  Phone,
  Factory,
  MoreHorizontal } from "lucide-react";
import { BiHorizontalCenter } from "react-icons/bi";

const EnterpriseTable = ({ enterprises }) => {
  const navigate = useNavigate();

  return (
    <div className=" p-4">
      <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
  <thead className="bg-gray-100 text-gray-700 text-sm">
    <tr>
      <th className="text-left px-4 py-3">
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4" /> Name
        </div>
      </th>
      <th className="text-left px-4 py-3">
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" /> Phone
        </div>
      </th>
      <th className="text-left px-4 py-3">
        <div className="flex items-center gap-1">
          <Factory className="w-4 h-4" /> Sector
        </div>
      </th>
      <th className="text-left px-4 py-3">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" /> Status
        </div>
      </th>
      <th className="text-left px-4 py-3">
        <div className="flex items-center gap-1">
          <BiHorizontalCenter className="w-4 h-4" /> Actions
        </div>
      </th>
    </tr>
  </thead>
  <tbody className="text-gray-700 text-sm">
    {enterprises?.map((ent) => (
      <tr
        key={ent._id}
        className="border-t hover:bg-gray-50 transition duration-150"
      >
        <td className="px-4 py-3 font-semibold">{ent.name}</td>
        <td className="px-4 py-3">{ent.phone}</td>
        <td className="px-4 py-3">{ent.sector}</td>
        <td className="px-4 py-3">
          {ent.isActive ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-400" />
          )}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => navigate(`/enterprise/${ent._id}?tab=profile`)}
            className="flex items-center gap-2 text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <Eye size={16} />
            See Details
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default EnterpriseTable;
