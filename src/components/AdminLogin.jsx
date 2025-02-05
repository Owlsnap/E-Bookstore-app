import React from 'react'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import getBaseUrl from '../utils/baseURL';


const AdminLogin = () => {
      const [message, setMessage] = useState("");
      const navigate = useNavigate();
    

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();

      const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const auth = response.data;
            console.log(auth)
            if(auth.token) {
                localStorage.setItem("token", auth.token);
                setTimeout(() => {
                    localStorage.removeItem("token");
                    alert("Token Expired, log in again");
                    Navigate("/admin");
                }, 3600 * 1000); //1hour
            }
            alert(" Admin Login Successful");
            navigate("/dashboard");
        
        } catch (error) {
          setMessage("Invalid Email or Password");
          console.error("Error logging in:", error.message);
        }
      };


  return (
        <div className="h-screen border flex justify-center items-center">
          <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
    
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  {...register("username", { required: true })}
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Username"
                  className="shadow appearance-none border rounded w-full py-2 px-3
                    leading-tight focus:outline-none focus:shadow-slate-300"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="shadow appearance-none border rounded w-full py-2 px-3
                    leading-tight focus:outline-none focus:shadow-slate-300"
                />
              </div>
              {message && (
                <p className="text-red-500 text-xs italic">
                  Please enter valid Email and Password.
                </p>
              )}
              <div>
                <button className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-8 rounded focus:outline-none">
                  Login
                </button>
              </div>
            </form>
            <p className="mt-5 text-center text-gray-500 text-xs">
              ©2025 Book Store. All rights reserved.
            </p>
          </div>
        </div>
    
  )
}

export default AdminLogin
