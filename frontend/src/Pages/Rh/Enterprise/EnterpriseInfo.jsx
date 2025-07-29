import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaLink } from "react-icons/fa";
import { uploadDocument } from "../../../service/document";

export default function EnterpriseDetails({ enterprise }) {
  const [showForm, setShowForm] = useState(false);
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docName || !file) return alert("All fields required.");

    const formData = new FormData();
    formData.append("name", docName);
    formData.append("file", file);
    formData.append("enterpriseId", enterprise._id);
    console.log('enterpriseId:', enterprise._id);
    setLoading(true);
    setUploadStatus("");
    try {
      await uploadDocument(formData);
      setUploadStatus(" Document uploaded successfully!");
      setDocName("");
      setFile(null);
      setShowForm(false);
    } catch (err) {
      setUploadStatus(" Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-sky-800">{enterprise.name}</h2>

      <div className="flex items-center justify-between">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${
            enterprise.isApproved
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {enterprise.isApproved ? "Approved" : "Pending Approval"}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-gray-700">
        <p>
          <FaMapMarkerAlt className="inline-block mr-2 text-sky-600" /> Address:{" "}
          {enterprise.address}
        </p>
        <p>
          <FaPhone className="inline-block mr-2 text-sky-600" /> Phone:{" "}
          {enterprise.phone}
        </p>
        <p>
          <FaLink className="inline-block mr-2 text-sky-600" /> Website:{" "}
          <a
            href={enterprise.website}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-600"
          >
            {enterprise.website}
          </a>
        </p>
        <p>Industry Code: {enterprise.industryCode}</p>
        <p>Secteur: {enterprise.secteur}</p>
        <p>
          Rating:{" "}
          <span className="font-semibold text-yellow-600">
            {enterprise.rating || 0} / 5
          </span>
        </p>
      </div>

      {/* Add Button */}
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-sky-800"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "➕ Create Document"}
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4 bg-gray-50 p-4 rounded border"
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Document Name
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none"
              placeholder="Enter document name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              PDF File
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>

          {uploadStatus && (
            <p className="text-sm text-gray-700 mt-2">{uploadStatus}</p>
          )}
        </form>
      )}
    </div>
  );
}
