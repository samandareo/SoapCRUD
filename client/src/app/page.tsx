"use client";
import axios from "axios";
import { parseString } from "xml2js";
import { useState, useEffect } from "react";
import editIcon from "@/app/image/edit.svg";
import Image from "next/image";

const ServerURL = "https://soapcrud.onrender.com/soap";

type typeUser = {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const cutEmail = (email: string) => {
    const atIndex = email.indexOf("@");
    let before = email.slice(0, atIndex);
    const after = email.slice(atIndex);
    if (before.length > 5) {
      before = before.slice(0, 3) + "..." + before.slice(-2);
    }
    return before + after;
  };

  const cutName = (name: string) => {
    if (name.length > 10) {
      return name.slice(0,4) + "...";
    }
    return name;
  }

      
  const getUserHandler = async () => {
    setLoading(true);
    const soapRequest = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <getUsersRequest></getUsersRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      const res = await axios.post(ServerURL, soapRequest, {
        headers: {
          "Content-Type": "text/xml",
        },
      });

      parseString(res.data, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          setUsers([]); 
          return;
        }
        
        const usersResponse = result["soap:Envelope"]["soap:Body"][0]["getUsersResponse"][0];
        const res_users = usersResponse["users"];

        if (res_users) {
          const parsedUsers = res_users.map((user: typeUser) => {
            return {
              id: user.id[0],
              name: user.name[0],
              email: user.email[0],
            };
          });
          setUsers(parsedUsers);
          console.log("Parsed Users:", parsedUsers);
        } else {
          setUsers([]);
          console.log("No users found in response.");
        }
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUserHandler = async () => {
    if (!name || !email) {
      alert("Please fill in all fields");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return; // Stop execution if email is invalid
    }

    setLoading(true);
    const soapRequest = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <createUserRequest>
            <user>
              <name>${name}</name>
              <email>${email}</email>
            </user>
          </createUserRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      const res = await axios.post(ServerURL, soapRequest, {
        headers: {
          "Content-Type": "text/xml",
        },
      });
      console.log("User created successfully:", res.data);
      
      // Clear form fields
      setName("");
      setEmail("");
      
      // Refresh user list
      getUserHandler();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }
  
  const deleteUserRequest = async (userId: string) => {
    setLoading(true);
    const soapRequest = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <deleteUserRequest>
            <userId>${userId}</userId>
          </deleteUserRequest>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      const res = await axios.post(ServerURL, soapRequest, {
        headers: {
          "Content-Type": "text/xml",
        },
      });
      console.log("User deleted successfully:", res.data);
      
      // Refresh user list
      getUserHandler();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const updateUserRequest = async (userId: string) => {
    setLoading(true);
    const soapRequest = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <updateUserRequest>
            <userId>${userId}</userId>
            <user> {/* Add user wrapper tag */}
              <name>${updateName}</name>
              <email>${updateEmail}</email>
            </user> {/* Close user wrapper tag */}
          </updateUserRequest>
        </soap:Body>
      </soap:Envelope>
    `;
    try {
      const res = await axios.post(ServerURL, soapRequest, {
        headers: {
          "Content-Type": "text/xml",
        },
      });

      console.log("User updated successfully:", res.data);
      setModalOpen(false);

      getUserHandler();
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserHandler();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                <input 
                  type="text" 
                  id="edit-name" 
                  value={updateName}
                  onChange={(event) => setUpdateName(event.target.value)} 
                  className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input 
                  type="email" 
                  id="edit-email" 
                  value={updateEmail}
                  onChange={(event) => setUpdateEmail(event.target.value)} 
                  className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <button 
                onClick={() => updateUserRequest(updateId)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Save
              </button>
            </div>
          </div>
          <div className="fixed inset-0 bg-black opacity-50 z-[-1]" onClick={() => setModalOpen(false)}></div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SOAP Client</h1>
          <p className="text-gray-600">A modern interface for SOAP API interactions</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Create New User
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
                <input 
                  type="text" 
                  id="name" 
                  value={name}
                  onChange={(event) => setName(event.target.value)} 
                  className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(event) => setEmail(event.target.value)} 
                  className="w-full px-3 py-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <button 
                onClick={createUserHandler} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span> : 
                  "CREATE USER"
                }
              </button>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Users
              </h2>
              <button 
                onClick={getUserHandler}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
            {users.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user:typeUser) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 scrol">{cutName(user.name)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{cutEmail(user.email)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 flex items-center space-x-2">
                        <button onClick={() => deleteUserRequest(user.id)} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-2">Delete</button>
                            <Image
                              src={editIcon}
                              alt="Edit"
                              className="h-5 w-5 cursor-pointer bg-blue-600 hover:bg-blue-700 rounded"
                              onClick={() => {
                                setUpdateId(user.id); 
                                setUpdateName(user.name);
                                setUpdateEmail(user.email);
                                setModalOpen(true);
                              }}
                            />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-gray-50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No users found</p>
                <button 
                  onClick={getUserHandler} 
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh list
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
