import React from 'react'

const Dashboard = () => {
  return (
    <div className="Dashboard bg-base-300 shadow-sm">
      
  <div className="flex flex-1 items-center gap-2">
  <img className="w-10 h-10" src="dev_logo.jpeg" alt="Logo" />
  <a className="btn btn-ghost text-xl">DevSphere</a>
</div>

  
  <div className="flex gap-2">
    
    <div className="dropdown dropdown-end mx-5">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
       
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Dashboard component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default Dashboard;
