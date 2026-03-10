import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import api from "../api/axiosinstance";
import { LuLogOut, LuUser, LuMail, LuPhone, LuKey } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

export function Account() {
  const [userProfile, setUserProfile] = useState({});
  const { user, logout } = useAuth();

  // Popup Visibility States
  const [editUserPopup, setEditUserPopup] = useState(false);
  const [editEmailPopup, setEditEmailPopup] = useState(false);
  const [editPhonePopup, setEditPhonePopup] = useState(false);

  // Form Input States
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/api/profile");
      if (res.data) {
        setUserProfile(res.data);
        setNewUsername(res.data.username || "");
        setNewEmail(res.data.email || "");
        setNewPhone(res.data.phone_no || "");
      }
    } catch (err) {
      console.log("Error Getting User Profile", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleUpdate = async (field) => {
    setLoading(true);
    try {
      let data = {};
      if (field === "username") data = { username: newUsername };
      if (field === "email") data = { email: newEmail };
      if (field === "phone") data = { phone_no: newPhone };

      const res = await api.put("/api/client/update", data);
      if (res.data) {
        setUserProfile(res.data);
        setEditUserPopup(false);
        setEditEmailPopup(false);
        setEditPhonePopup(false);
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update " + field);
    } finally {
      setLoading(false);
    }
  };

  function handleLogout() {
    logout();
  }

  const { username, email, phone_no } = userProfile;

  return (
    <>
      {editUserPopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-1/3 h-max bg-background border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Change Username</div>
                <div>
                  <button
                    onClick={() => {
                      setEditUserPopup(false);
                      setNewUsername("");
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-4">
                <label className=" mb-1">New Username</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  placeholder="new username"
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                  }}
                ></input>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditUserPopup(false);
                    setNewUsername("");
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUpdate("username");
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editEmailPopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-1/3 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Change Username</div>
                <div>
                  <button
                    onClick={() => {
                      setEditEmailPopup(false);
                      setNewEmail("");
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-4">
                <label className=" mb-1">New Email</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  placeholder="new email"
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                  }}
                ></input>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditEmailPopup(false);
                    setNewEmail("");
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUpdate("email");
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {editPhonePopup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full z-50 backdrop-blur-[2px]">
          <div className="w-1/3 h-max bg-white border border-black rounded-xl">
            <div className="m-4">
              <div className="flex justify-between items-center mb-1">
                <div className="text-lg">Change Phone No</div>
                <div>
                  <button
                    onClick={() => {
                      setEditPhonePopup(false);
                      setNewPhone("");
                    }}
                    className="text-xl"
                  >
                    <IoMdClose />
                  </button>
                </div>
              </div>
              <div className="w-full border-b mb-2"></div>
              <div className="flex flex-col mb-4">
                <label className=" mb-1">New Phone No</label>
                <input
                  type="text"
                  className="border border-gray-300 p-2 pl-3 rounded-lg"
                  placeholder="new phone no"
                  onChange={(e) => {
                    setNewPhone(e.target.value);
                  }}
                ></input>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditPhonePopup(false);
                    setNewPhone("");
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUpdate("phone");
                  }}
                  className="w-full border border-black py-1.5 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
            {/* Header section */}
            <div className="w-full bg-muted p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-5 justify-center sm:justify-start">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center border-4 border-secondary shadow-inner">
                  <LuUser className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl w-full font-bold text-primary uppercase tracking-wider truncate">
                    {username || "User"}
                  </h1>
                  <p className="text-primary flex items-center justify-center sm:justify-start">
                    <LuMail className="mr-1.5 h-4 w-4" /> {email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-6 sm:mt-0 flex items-center justify-center px-6 py-2.5 bg-secondary text-primary hover:text-secondary font-bold rounded-full hover:bg-primary transition-all active:scale-95 shadow-lg"
              >
                <LuLogOut className="mr-2 h-5 w-5" /> Logout
              </button>
            </div>

            {/* Profile details grid */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4 border-gray-100">
                Personal Information
              </h2>

              <div className="grid gap-6">
                {/* Username Field */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-primary transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <LuUser className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Username
                      </p>
                      <p className="font-semibold text-gray-800 text-lg">
                        {username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditUserPopup(true)}
                    className="px-4 py-2 text-sm font-bold text-primary hover:bg-secondary rounded-lg transition-colors"
                  >
                    EDIT
                  </button>
                </div>

                {/* Email Field */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-primary transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <LuMail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Email Address
                      </p>
                      <p className="font-semibold text-gray-800 text-lg">
                        {email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditEmailPopup(true)}
                    className="px-4 py-2 text-sm font-bold text-primary hover:bg-secondary rounded-lg transition-colors"
                  >
                    CHANGE
                  </button>
                </div>

                {/* Phone Field */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-primary transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <LuPhone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Phone Number
                      </p>
                      <p className="font-semibold text-gray-800 text-lg">
                        {phone_no || "(Add mobile number)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditPhonePopup(true)}
                    className="px-4 py-2 text-sm font-bold text-primary hover:bg-secondary rounded-lg transition-colors"
                  >
                    {phone_no ? "UPDATE" : "ADD"}
                  </button>
                </div>

                {/* Password Field (Placeholder for UI) */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-primary transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <LuKey className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Security
                      </p>
                      <p className="font-semibold text-gray-800 text-lg">
                        ••••••••
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-bold text-primary hover:bg-secondary rounded-lg transition-colors">
                    SECURITY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
