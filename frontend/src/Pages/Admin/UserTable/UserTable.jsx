import { useEffect, useState } from "react";
import { activeAccount, approveUser, deleteAccount, desactiveAccount, getAllUsersFiltred } from "../../../service/user";
import { toast} from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export default function UsersTable() {

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [isActive, setIsActive] = useState(null);
    const [isApproved, setIsApproved] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 10;
    const debouncedSearch = useDebouncedValue(search, 300);

   const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersFiltred({
        page,
        limit,
        search: debouncedSearch,
        isActive,
        isApproved,
        isEmailVerified,
      });

      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, isActive, isApproved, isEmailVerified]);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await (currentStatus ? desactiveAccount(id) : activeAccount(id));
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user status", error);
      toast.error("Failed to update user status.");
    }
  };

  const handleApprove = async (userId) => {
    try {
      await approveUser(userId);
      toast.success("User approved successfully");
      fetchUsers();
    } catch (error) {
      console.error("Approval failed", error);
      toast.error("Failed to approve user");
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await deleteAccount(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

    return (
        <div className="bg-white w-full min-h-screen px-12 py-12  rounded-lg shadow-md space-y-6 ">
          <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">All Users</h2>

  <div className="flex  items-center">
    <div className="w-96 border border-zinc-300 rounded-full h-11 flex items-center justify-center" >
    <input
      type="text"
      placeholder="Search users..."
      className="flex-1 h-full rounded-full outline-none border-none bg-white px-4"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button className="px-4 h-full flex items-center justify-center text-base   text-zinc-600 border-l border-zinc-300">
                      <FaSearch/>
                    </button>
      </div>
    <div className="relative group">
      <button className="btn btn-bordered w-40">Active Status</button>
      <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded  top-full w-40">
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsActive(null)}
        >
          All
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsActive(true)}
        >
          Active
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsActive(false)}
        >
          Inactive
        </li>
      </ul>
    </div>

    <div className="relative group">
      <button className="btn btn-bordered w-40">Approval Status</button>
      <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded top-full w-40">
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsApproved(null)}
        >
          All
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsApproved(true)}
        >
          Approved
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsApproved(false)}
        >
          Pending
        </li>
      </ul>
    </div>

    <div className="relative group">
      <button className="btn btn-bordered w-40">Email Verified</button>
      <ul className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded top-full w-40">
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsEmailVerified(null)}
        >
          All
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsEmailVerified(true)}
        >
          Verified
        </li>
        <li
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsEmailVerified(false)}
        >
          Not Verified
        </li>
      </ul>
    </div>
  </div>
</div>

      
     
  <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
  <table className="table w-full text-base bg-white">
    <thead className="bg-gradient-to-l from-cyan-900 to-sky-500 text-white shadow-md">
      <tr>
        <th className="px-4 py-3 text-left font-semibold tracking-wider">#</th>
        <th className="px-4 py-3 text-left font-semibold tracking-wider">Full Name</th>
        <th className="px-4 py-3 text-left font-semibold tracking-wider">Email</th>
        <th className="px-4 py-3 text-left font-semibold tracking-wider">Role</th>
        <th className="px-4 py-3 text-left font-semibold tracking-wider">Status</th>
        <th className="px-4 py-3 text-left font-semibold tracking-wider">Actions</th>
      </tr>
    </thead>

    <tbody>
      {users.map((user, index) => (
        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200 ease-in-out border-b border-gray-100">
          <td className="px-4 py-3 text-gray-700 font-medium">{index + 1}</td>
          <td className="px-4 py-3 text-gray-900 font-semibold">{user.name}</td>
          <td className="px-4 py-3  hover:underline text-decoration-none ">{user.email}</td>
          <td className="px-4 py-3">
            <span className={`
    badge badge-lg text-white font-medium shadow-sm capitalize px-3 py-1 rounded-full
    ${user.role === 'admin' ? 'bg-purple-600' :
      user.role === 'rh' ? 'bg-teal-500' :
      'badge-primary'}
  `}>
    {user.role}
  </span>
          </td>
          <td className="px-4 py-3  flex flex-col space-y-1">
            <span className={`badge badge-sm font-semibold ${user.isActive ? 'badge-success' : 'badge-danger bg-red-700 text-white-700 border-gray-300'} px-2 py-1 rounded-full`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
            <span className={`badge badge-sm font-semibold ${user.isEmailVerified ? 'badge-info' : 'badge-neutral bg-gray-300 text-gray-700 border-gray-300'} px-2 py-1 rounded-full`}>
              {user.isEmailVerified ? 'Email Verified' : 'Email Unverified'}
            </span>
            <span className={`badge badge-sm font-semibold ${user.isApproved ? 'badge-primary' : 'badge-warning'} px-2 py-1 rounded-full`}>
              {user.isApproved ? 'Approved' : 'Pending'}
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-wrap gap-2 ">
              <button className="btn btn-sm btn-outline btn-info hover:bg-info  hover:text-white transition-all duration-200">
                Details
              </button>
              <button
                className={`btn btn-sm btn-outline  ${
                  user.isActive
                    ? 'btn-danger hover:bg-danger  ' 
                    : 'btn-success hover:bg-success'
                } transition-all duration-200`}
                onClick={() => handleToggleStatus(user._id, user.isActive)}
              >
                {user.isActive ? 'ban' : 'unban'}
              </button>
              <button
                className="btn btn-sm btn-outline btn-warning hover:bg-warning hover:text-white transition-all duration-200"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
              {!user.isApproved && (
                <button
                  className="btn btn-sm btn-outline btn-secondary hover:bg-secondary hover:text-white transition-all duration-200"
                  onClick={() => handleApprove(user._id)}
                >
                  Approve
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


      
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Showing 0 of 0 users</span>
            <div className="flex gap-2 mt-4">
              <button className="btn btn-sm btn-outline" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev-1,1))}>Previous</button>
              <span className="btn btn-sm btn-ghost" >{page}</span>
              <button className="btn btn-sm btn-outline" onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
          </div>
        </div>
        
      );
      
}
