import { useEffect, useState } from 'react'
import API from '../../utils/api'
import { useAuth } from '../../Context/AuthContext'

function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 15

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (search) params.append('search', search)
      const { data } = await API.get(`/admin/users?${params}`)
      setUsers(data.users)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [page, search])

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!window.confirm(`Change role to ${newRole}?`)) return
    try {
      await API.put(`/admin/users/${userId}`, { role: newRole })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  const handleStatusToggle = async (userId, isActive) => {
    if (!window.confirm(`${isActive ? 'Deactivate' : 'Activate'} this user?`)) return
    try {
      await API.put(`/admin/users/${userId}`, { isActive: !isActive })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Permanently delete this user?')) return
    try {
      await API.delete(`/admin/users/${userId}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed')
    }
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div>
      <div className="admin-page-header">
        <h1><i className="fa-solid fa-users" style={{ marginRight: 10, color: 'var(--primary)' }} />Users ({total})</h1>
      </div>

      <div className="admin-table-card">
        <div className="admin-search-bar">
          <i className="fa-solid fa-search" style={{ color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setPage(1) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loader" />
            <div>Loading users...</div>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-users-slash" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: 'var(--text-light)' }} />
            No users found.
          </div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="admin-user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </span>
                        {u.name}
                        {u._id === currentUser?._id && (
                          <span style={{ fontSize: 10, background: 'var(--primary-bg)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>You</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td>
                      <span className={`status-badge ${u.role === 'admin' ? 'status-confirmed' : 'status-processing'}`}>
                        <i className={`fa-solid ${u.role === 'admin' ? 'fa-shield-halved' : 'fa-user'}`} style={{ marginRight: 4 }} />
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                        <i className={`fa-solid ${u.isActive ? 'fa-circle-check' : 'fa-circle-xmark'}`} style={{ marginRight: 4 }} />
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u._id !== currentUser?._id ? (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            className="admin-btn admin-btn-outline admin-btn-xs"
                            onClick={() => handleRoleToggle(u._id, u.role)}
                          >
                            <i className="fa-solid fa-arrows-rotate" />
                            {u.role === 'admin' ? 'User' : 'Admin'}
                          </button>
                          <button
                            className={`admin-btn admin-btn-xs ${u.isActive ? 'admin-btn-outline' : 'admin-btn-success'}`}
                            onClick={() => handleStatusToggle(u._id, u.isActive)}
                          >
                            <i className={`fa-solid ${u.isActive ? 'fa-pause' : 'fa-play'}`} />
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="admin-btn admin-btn-danger admin-btn-xs"
                            onClick={() => handleDelete(u._id)}
                          >
                            <i className="fa-solid fa-trash" /> Delete
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--text-light)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <i className="fa-solid fa-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  <i className="fa-solid fa-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
