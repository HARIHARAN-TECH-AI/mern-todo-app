import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useEffect, useState } from "react";

function App() {

  async function FetchData() {
    const res = await axios.get(`http://localhost:4040/api/find`)
    Setusers(res.data.data)
  }

  useEffect(() => {
    FetchData()

  },[])

  const [FormData, SetFormData] = useState({
    name:'',
    email:'',
    password:''
  })

  const [Editid, SetEditid] = useState(null)
  const [Users, Setusers] = useState([])


  function handlechange(e) {

    SetFormData({...FormData,[e.target.name]:e.target.value})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if(Editid) {
      const res = await axios.put(`http://localhost:4040/api/update/${Editid}`,FormData)
      FetchData()
      toast.success(res.data.message)
    }
    else {
      if(FormData.name !== "" && FormData.email !== "" && FormData.password !== "") {
      const res = await axios.post(`http://localhost:4040/api/insert`,FormData)
      toast.success(res.data.message)
      FetchData()
      }
      else {
          toast.error("Fill the Required Field")

      }

    }
      SetFormData({name:'',email:'', password:''})

  }

  async function EditData(data) {
    SetFormData({name:data.name,email:data.email,password:data.password})
    SetEditid(data._id)
  }

  async function DelData(id) {
    const res = await axios.delete(`http://localhost:4040/api/delete/${id}`)
      toast.success(res.data.message)
    FetchData()
  }

  return(<>
    <ToastContainer
        position="top-center"
        autoClose={2000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
     <h1 className="mt-10 flex justify-center text-3xl text-bold  font-serif">Registration Details</h1>


<form 
  onSubmit={handleSubmit} 
  className="flex flex-wrap justify-center items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-2xl w-fit mx-auto mt-16"
>
  <h2 className="text-white text-xl font-semibold w-full text-center mb-2">
    {Editid ? "Update User" : "Add New User"}
  </h2>

  <input 
    className="h-10 px-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200" 
    type="text" 
    name="name" 
    placeholder="Enter Name"
    value={FormData.name} 
    onChange={handlechange} 
  />

  <input 
    className="h-10 px-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200" 
    type="email" 
    name="email" 
    placeholder="Enter Email"
    value={FormData.email} 
    onChange={handlechange} 
  />

  <input 
    className="h-10 px-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-200" 
    type="password" 
    name="password" 
    placeholder="Enter Password"
    value={FormData.password} 
    onChange={handlechange} 
  />

  <button 
    type="submit" 
    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
  >
    {Editid ? "Update" : "Add"}
  </button>
</form>


 {Users && Users.length > 0 ? (
  <table className="w-[800px] mx-auto mt-10 bg-white shadow-2xl rounded-2xl overflow-hidden">
    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <tr>
        <th className="py-3 px-4 text-center">Name</th>
        <th className="py-3 px-4 text-center">Email</th>
        <th className="py-3 px-4 text-center">Password</th>
        <th className="py-3 px-4 text-center">Actions</th>
      </tr>
    </thead>

    <tbody>
      {Users.map((data) => (
        <tr 
          key={data._id} 
          className="border-b hover:bg-gray-100 transition duration-300"
        >
          <td className="py-3 px-4 text-gray-700 font-medium text-center">{data.name}</td>
          <td className="py-3 px-4 text-gray-700 text-center">{data.email}</td>
          <td className="py-3 px-4 text-gray-700 text-center">{data.password}</td>
          <td className="py-3 px-4 text-center space-x-3">
            <button 
              onClick={() => EditData(data)} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full shadow transition transform hover:scale-105"
            >
              Edit
            </button>
            <button 
              onClick={() => DelData(data._id)} 
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full shadow transition transform hover:scale-105"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="flex justify-center font-serif text-3xl mt-48">No Data Found</p>
)}


  </>)
}

export default App;
