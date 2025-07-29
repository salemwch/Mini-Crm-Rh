import { useEffect, useState } from "react";
import { FaGlobe, FaPhone, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { FileText, Upload, Building2, TextCursorInput } from 'lucide-react';
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { getAllEnterprises } from "../../../service/interprise";
import { uploadDocument } from "../../../service/document";

const CreateFeedback = () => {
    const [enterprises, setEnterprises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
    const fetchEnterprises = async () => {
        try {
        const data = await getAllEnterprises();
            console.log("ENTERPRISES RESPONSE:", data);

        setEnterprises(data);
        } catch (err) {
        console.error("Error fetching enterprises:", err);
    } finally {
        setLoading(false);
    }
    };

    fetchEnterprises();
    }, []);

    if (loading) return <div className="text-center mt-10 text-xl">Loading enterprises...</div>;

    return (
    <>
    {enterprises.map((enterprise) => (
    <div
    key={enterprise._id}
    className="bg-white shadow-xl rounded-2xl p-5 border hover:shadow-2xl transition duration-300"
    >
    <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-bold text-blue-700">{enterprise.name}</h2>
            <span className={`text-sm px-2 py-1 rounded-full font-semibold 
            ${enterprise.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {enterprise.isActive ? "Active" : "Inactive"}
            </span>
        </div>

            <p className="text-gray-600 mb-2"><strong>Secteur:</strong> {enterprise.secteur}</p>
            <p className="text-gray-600 mb-2"><FaMapMarkerAlt className="inline mr-2" /> {enterprise.address}</p>

            <div className="flex items-center text-yellow-500 mb-2">
            {Array(enterprise.rating).fill().map((_, i) => (
                <FaStar key={i} />
            ))}
        </div>

            <p className="text-gray-600 mb-2">
            <FaPhone className="inline mr-2" />
            {enterprise.phone}
            </p>

            {enterprise.website && (
            <p className="text-blue-600 underline mb-2">
            <FaGlobe className="inline mr-1" />
            <a href={enterprise.website} target="_blank" rel="noreferrer">
                Visit Website
            </a>
            </p>
        )}

        <p className="text-gray-700 mb-3">
            <IoMdInformationCircle className="inline mr-1 text-blue-500" />
            {enterprise.notes}
        </p>

        <div className="mb-3">
            <p className="font-semibold text-sm mb-1">Documents:</p>
            {enterprise.documents?.length > 0 ? (
            enterprise.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                {doc.isApproved ? (
                    <MdCheckCircle className="text-green-600" />
                ) : (
                    <MdCancel className="text-red-600" />
                )}
                <span>{doc.isApproved ? "Approved" : "Not Approved"}</span>
                </div>
            ))
            ) : (
            <p className="text-gray-400 italic text-sm">No documents</p>
            )}
        </div> 
    <button
        onClick={() =>
        setExpandedId((prevId) => (prevId === enterprise._id ? null : enterprise._id))
    }
        className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
    >
        {expandedId === enterprise._id ? "Close Form" : "+ Create Feedback"}
    </button>
        {expandedId === enterprise._id && (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 mt-4 border">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-500" />
            Upload New Document
        </h2>

        {message && (
          <div className="text-sm text-center py-2 px-4 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
            {message}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (!name || !file || !enterprise._id) {
              setMessage("Please fill in all fields.");
              return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("file", file);
            formData.append("enterpriseId", enterprise._id);

            setLoading(true);
            uploadDocument(formData)
              .then(() => {
                setMessage(" Upload successful!");
                setName("");
                setFile(null);
              })
              .catch(() => {
                setMessage(" Upload failed.");
              })
              .finally(() => setLoading(false));
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 border rounded p-2">
            <TextCursorInput className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Document Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2 border rounded p-2 opacity-60 pointer-events-none">
            <Building2 className="text-gray-400 w-5 h-5" />
            <select
              value={enterprise._id}
              disabled
              className="w-full text-sm outline-none bg-transparent"
            >
              <option>{enterprise.name}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 border rounded p-2">
            <FileText className="text-gray-400 w-5 h-5" />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>
    )}
  </div>
))}

    
    </>
  );
};

export default CreateFeedback;
