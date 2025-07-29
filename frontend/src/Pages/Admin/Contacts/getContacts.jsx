import { useEffect, useState } from 'react';
import { deleteContact, getEnterprisesWithContacts, searchContacts, updateContact } from '../../../service/Contact';
import { Mail, Phone, User2, Calendar, MapPin, Contact as ContactIcon, Smartphone, Briefcase, User } from 'lucide-react';
import { Pencil, Save, X, Trash } from 'lucide-react';

const EnterprisesSection = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    position: "",
    preferedContactMethod: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await searchContacts(filters);
      setResults(response.data || []);
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const enterprises = await getEnterprisesWithContacts();
        console.log("enterprises:", enterprises);
        setData(enterprises);
        console.lofg("enterprises:", enterprises);
      } catch (error) {
        console.error('Error fetching enterprises with contacts:', error);
      }
    };

    fetchEnterprises();
  }, []);

  const handleSave = async (contactId) => {
    try {
      await updateContact(contactId, formData);
      setEditId(null);
      const refreshedData = await getEnterprisesWithContacts();
      setData(refreshedData);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };
  const handleDelete = async (contactId) => {
  try {
    await deleteContact(contactId);
    const refreshedEnterprises = await getEnterprisesWithContacts();
    setData(refreshedEnterprises);
  } catch (error) {
    console.error('Delete error:', error);
  }
};

  return (
    <>
     <div className="p-6 grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="flex items-center gap-1 mb-1 font-medium text-gray-700">
            <User className="w-5 h-5 text-blue-500" />
            Name
          </label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Search by name"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 mb-1 font-medium text-gray-700">
            <Mail className="w-5 h-5 text-blue-500" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={filters.email}
            onChange={handleChange}
            placeholder="Search by email"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 mb-1 font-medium text-gray-700">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Position
          </label>
          <input
            type="text"
            name="position"
            value={filters.position}
            onChange={handleChange}
            placeholder="Search by position"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="flex items-center gap-1 mb-1 font-medium text-gray-700">
            <Smartphone className="w-5 h-5 text-blue-500" />
            Preferred Contact Method
          </label>
          <select
            name="preferedContactMethod"
            value={filters.preferedContactMethod}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Any</option>
            <option value="EMAIL">Email</option>
            <option value="PHONE">Phone</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleSearch}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Searching..." : "Search"}
      </button> 
      <button
  onClick={async () => {
    setFilters({ name: "", email: "", position: "", preferedContactMethod: "" });
    setResults([]);
    const refreshedData = await getEnterprisesWithContacts();
    setData(refreshedData);
  }}
  className="ml-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
>
  Reset
</button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
{(results?.length ? results : data || []).map((enterprise) => (
        <div
          key={enterprise._id}
          className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg border border-blue-100"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <ContactIcon className="w-6 h-6 text-blue-500" />
            {enterprise.name}
          </h2>

          <div className="grid gap-4">
            {enterprise.contacts.map((contact) => {
              const isEditing = editId === contact._id;
              return (
                <div
                  key={contact._id}
                  className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition-all"
                >
<div className="flex justify-between items-center">
                    <div className="text-lg font-medium text-gray-800 flex items-center gap-2">
                      <User2 className="w-5 h-5 text-blue-400" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="border-b border-gray-300 focus:outline-none text-base px-1"
                          placeholder="Name"
                        />
                      ) : (
                        contact.name
                      )}
                    </div>

                    <div className="flex gap-2">
  {isEditing ? (
    <>
      <button
        onClick={() => handleSave(contact._id)}
        className="text-green-600 hover:text-green-800"
        title="Save"
      >
        <Save className="w-4 h-4" />
      </button>
      <button
        onClick={() => setEditId(null)}
        className="text-red-600 hover:text-red-800"
        title="Cancel"
      >
        <X className="w-4 h-4" />
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => {
          setEditId(contact._id);
          setFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            position: contact.position,
            preferedContactMethod: contact.preferedContactMethod,
          });
        }}
        className="text-blue-500 hover:text-blue-700"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={async () => {
          if (window.confirm(`Are you sure you want to delete contact ${contact.name}?`)) {
            try {
              await deleteContact(contact._id);
              const refreshedData = await getEnterprisesWithContacts();
              setData(refreshedData);
            } catch (error) {
              console.error('Error deleting contact:', error);
            }
          }
        }}
        className="text-red-600 hover:text-red-800"
        title="Delete"
      >
        <Trash className="w-4 h-4" />
      </button>
    </>
  )}
</div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 grid gap-1 pl-1">
                    {['email', 'phone', 'position', 'preferedContactMethod'].map((field) => (
                      <div key={field} className="flex items-center gap-2">
                        {field === 'email' && <Mail className="w-4 h-4 text-gray-400" />}
                        {field === 'phone' && <Phone className="w-4 h-4 text-gray-400" />}
                        {field === 'position' && <MapPin className="w-4 h-4 text-gray-400" />}
                        {field === 'preferedContactMethod' && <User2 className="w-4 h-4 text-gray-400" />}

                        {isEditing ? (
                          <input
                            type="text"
                            value={formData[field] || ''}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            className="border-b border-gray-300 focus:outline-none px-1 text-sm"
                            placeholder={field}
                          />
                        ) : (
                          <>
                            {field === 'position' && 'Position:'}
                            {field === 'preferedContactMethod' && 'Prefers:'} {contact[field]}
                          </>
                        )}
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Created: {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                  </div>                </div> 
              );
            })}
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default EnterprisesSection;
