import { useEffect, useState } from "react";
import api from "../api/axiosinstance";
import { TbTrash } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import { LuPencil, LuSearch } from "react-icons/lu";

function AllUsers() {
  const [userList, setUserList] = useState([]);
  const [deletePopUp, setDeletePopUP] = useState(false);
  const [editPopUp, setEditPopUP] = useState(false);
  const [userId, setUserId] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [role, setRole] = useState("user");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      const res = await api.get("/api/auth/all-users");
      console.log(res.data);
      setUserList(res.data);
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [userList, searchQuery, roleFilter]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = userList.filter((user) => {
      const matchesQuery =
        !query ||
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone_no?.toString().includes(query) ||
        user.name?.toLowerCase().includes(query);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesQuery && matchesRole;
    });
    setFilteredUsers(filtered);
  };

  const deleteUser = async (user_id) => {
    const res = await api.delete(`/api/auth/delete-user/${user_id}`);
    setUserList((users) => users.filter((u) => !(u.id === user_id)));
    console.log(res.data);
  };

  const editUser = async (user_id) => {
    if (!role && !newPassword) return;
    const res = await api.post("/api/auth/edit-user-role", {
      user_id,
      role: role,
      password: newPassword,
    });
    console.log(res.data);
    if (!newPassword) return;
  };

  return (
    <>
      {deletePopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg text-red-600">
                  Do you want to Delete this User?
                </div>
                <div>
                  <button
                    onClick={() => {
                      setDeletePopUP(false);
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mx-5">
                <div className="">
                  <p className="text-lg text-left font-medium">
                    Do you really want to delete this User?
                  </p>
                  <p className="text-lg text-left font-light">
                    This action will delete the user and their data.
                  </p>
                </div>
                <div className="text-sm font-semibold text-red-500 my-3">
                  *This Action is Irreversible!
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setDeletePopUP(false);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteUser(userId);
                    setDeletePopUP(false);
                  }}
                  className="w-full border border-red-600 bg-red-600 text-white py-1.5 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editPopUp && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-4/5 sm:w-1/2 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Edit User</div>
                <div>
                  <button
                    onClick={() => {
                      setEditPopUP(false);
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-5">
                <span className="my-2">Edit Password</span>
                <input
                  type="text"
                  placeholder="new password..."
                  className="px-2 py-1.5 rounded-md border"
                  onChange={(e) => setNewPassword(e.target.value)}
                ></input>
                <span className="my-2">Edit Role</span>
                <select
                  className=" bg-transparent py-3 outline-none border rounded-md pl-2 text-slate-600 font-medium cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditPopUP(false);
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    editUser(userId);
                    setEditPopUP(false);
                  }}
                  className="w-full border border-primary bg-primary text-white py-1.5 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-5">
        <div className="text-2xl my-3 font-semibold">All Users</div>
        <div id="search-bar" className="w-full my-6">
          <div className="w-full flex flex-col md:flex-row items-stretch md:items-center border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm focus-within:border-black transition-all duration-300">
            <div className="flex-1 flex items-center bg-white px-4 border-b md:border-b-0 md:border-r border-slate-200">
              <LuSearch className="text-slate-400 mr-3 text-xl" />
              <input
                className="w-full py-3 outline-none text-slate-700 bg-transparent"
                placeholder="Search name, email, username or phone..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:w-1/4 flex items-center bg-slate-50 px-4 border-b md:border-b-0 md:border-r border-slate-200">
              <span className="md:w-1/2 md:text-center text-xs font-bold text-slate-400 uppercase tracking-widest mr-3">
                Role
              </span>
              <select
                className="md:w-1/2 bg-transparent py-3 outline-none text-slate-600 font-medium cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="creator">Creator</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-secondary text-primary font-bold hover:opacity-90 transition-opacity active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
        <div className="table-container mb-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>USER ID</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>PHONE NO</th>
                <th>ROLE</th>
                <th>CREATED AT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td>#{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_no}</td>
                    <td>{user.role}</td>
                    <td>{user.created_at}</td>
                    <td className="commission-highlight">
                      <button
                        className="text-green-500 bg-green-50 p-1.5 rounded-full mr-5"
                        onClick={() => {
                          setUserId(user.id);
                          setEditPopUP(true);
                        }}
                      >
                        <LuPencil />
                      </button>
                      <button
                        className="text-red-500 bg-red-50 p-1.5 rounded-full"
                        onClick={() => {
                          setUserId(user.id);
                          setDeletePopUP(true);
                        }}
                      >
                        <TbTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "32px",
                      color: "#6b7280",
                    }}
                  >
                    No Users Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllUsers;
