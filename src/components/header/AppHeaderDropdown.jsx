import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
  cilLockLocked,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import API from '../../utils/api'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState('') 

  useEffect(() => {
    const fetchNamaPemilik = async () => {
      try {
        // Tembak endpoint summary warung yang baru kita modifikasi di BE
        const response = await API.get('/transactions/summary') 
        const nama = response.data.data.nama_pemilik
        
        setCurrentUser(nama)
      } catch (error) {
        console.error('Gagal mengambil nama pemilik warung:', error)
        setCurrentUser('Owner')
      }
    }

    fetchNamaPemilik()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/', { replace: true })
  }

  return (
    <div className="py-2 pe-0 text-body fw-semibold nav-link">
      <span className="text-body">
        {currentUser ? `Hi, ${currentUser}` : 'Memuat...'}
      </span>
    </div>
  )
}

export default AppHeaderDropdown