import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Children } from 'react';

function LogoutButton({children}) {

    const { logout } = useAuthStore();

    const onLogout = () => {
        logout();
    }

  return (
   <button className='btn btn-primary' onClick={onLogout} type='button'>
    {children}
   </button>
  )
}

export default LogoutButton
