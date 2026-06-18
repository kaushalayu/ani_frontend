import { useEffect, useState, useRef } from 'react'
import API from '../../utils/api'

const FILTERS = [
  { key: 'all', label: 'All Messages', icon: 'fa-solid fa-inbox' },
  { key: 'unread', label: 'Unread', icon: 'fa-solid fa-envelope' },
  { key: 'read', label: 'Read', icon: 'fa-solid fa-envelope-open' },
  { key: 'starred', label: 'Starred', icon: 'fa-solid fa-star' },
]

const SUBJECT_LABELS = {
  order: 'Order Inquiry',
  prescription: 'Prescription Question',
  delivery: 'Delivery Issue',
  product: 'Product Information',
  other: 'Other',
}

function ContactMessages() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selected, setSelected] = useState(null)
  const [fullMessage, setFullMessage] = useState(null)
  const [toast, setToast] = useState(null)
  const LIMIT = 20
  const searchRef = useRef(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (search) params.append('search', search)
      if (filter !== 'all') params.append('status', filter)
      const { data } = await API.get(`/contact?${params}`)
      setContacts(data.contacts)
      setTotal(data.total)
      setUnreadCount(data.unreadCount)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [page, filter])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchRef.current) fetchContacts()
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const handleToggleRead = async (contact, e) => {
    e.stopPropagation()
    try {
      const { data } = await API.put(`/contact/${contact._id}`, { isRead: !contact.isRead })
      setContacts(prev => prev.map(c => c._id === contact._id ? data.contact : c))
      setUnreadCount(prev => contact.isRead ? prev + 1 : prev - 1)
      if (selected?._id === contact._id) setSelected(data.contact)
    } catch { showToast('Failed to update', 'error') }
  }

  const handleToggleStar = async (contact, e) => {
    e.stopPropagation()
    try {
      const { data } = await API.put(`/contact/${contact._id}`, { isStarred: !contact.isStarred })
      setContacts(prev => prev.map(c => c._id === contact._id ? data.contact : c))
      if (selected?._id === contact._id) setSelected(data.contact)
    } catch { showToast('Failed to update', 'error') }
  }

  const handleDelete = async (contact, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this message permanently?')) return
    try {
      await API.delete(`/contact/${contact._id}`)
      setContacts(prev => prev.filter(c => c._id !== contact._id))
      setTotal(prev => prev - 1)
      if (!contact.isRead) setUnreadCount(prev => prev - 1)
      if (selected?._id === contact._id) setSelected(null)
      if (fullMessage?._id === contact._id) setFullMessage(null)
      showToast('Message deleted')
    } catch { showToast('Failed to delete', 'error') }
  }

  const handleSelect = (contact) => {
    setSelected(contact)
    if (!contact.isRead) {
      API.put(`/contact/${contact._id}`, { isRead: true }).catch(() => {})
      setContacts(prev => prev.map(c => c._id === contact._id ? { ...c, isRead: true } : c))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const handleViewFull = (contact, e) => {
    e.stopPropagation()
    setFullMessage(contact)
  }

  const totalPages = Math.ceil(total / LIMIT)

  const Stats = () => (
    <div className="admin-stats-grid" style={{ marginBottom: 20 }}>
      <div className="admin-stat-card">
        <div className="admin-stat-icon" style={{ background: '#ede9fe', color: '#6d28d9' }}>
          <i className="fa-solid fa-inbox" />
        </div>
        <div className="admin-stat-info">
          <h3>{total}</h3>
          <p>Total Messages</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
          <i className="fa-solid fa-envelope" />
        </div>
        <div className="admin-stat-info">
          <h3>{unreadCount}</h3>
          <p>Unread</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
          <i className="fa-solid fa-envelope-open" />
        </div>
        <div className="admin-stat-info">
          <h3>{total - unreadCount}</h3>
          <p>Read</p>
        </div>
      </div>
      <div className="admin-stat-card">
        <div className="admin-stat-icon" style={{ background: '#fce7f3', color: '#9d174d' }}>
          <i className="fa-solid fa-star" />
        </div>
        <div className="admin-stat-info">
          <h3>{contacts.filter(c => c.isStarred).length}</h3>
          <p>Starred</p>
        </div>
      </div>
    </div>
  )

  const FilterTabs = () => (
    <div className="contact-filter-tabs" style={{
      display: 'flex', gap: 6, padding: '0 20px', paddingBottom: 16,
      borderBottom: '1px solid var(--border)', overflowX: 'auto', flexWrap: 'nowrap',
    }}>
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => { setFilter(f.key); setPage(1); setSelected(null) }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 8, border: '1px solid',
            borderColor: filter === f.key ? 'var(--primary)' : 'var(--border)',
            background: filter === f.key ? 'var(--primary-bg)' : 'transparent',
            color: filter === f.key ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: filter === f.key ? 600 : 500,
            fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
          }}
        >
          <i className={f.icon} style={{ fontSize: 12 }} />
          {f.label}
        </button>
      ))}
    </div>
  )

  const SearchBar = () => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 20px', borderBottom: '1px solid var(--border)',
    }}>
      <i className="fa-solid fa-search" style={{ color: 'var(--text-light)', fontSize: 14 }} />
      <input
        ref={searchRef}
        type="text"
        placeholder="Search by name, email or message..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); setSelected(null) }}
        style={{
          flex: 1, padding: '8px 12px', border: '1px solid var(--border)',
          borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Inter', sans-serif",
          background: 'var(--card-bg)', color: 'var(--text-primary)',
        }}
      />
      {search && (
        <button
          onClick={() => { setSearch(''); setPage(1) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: 16, padding: 4 }}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  )

  const MessageItem = ({ contact }) => {
    const isSelected = selected?._id === contact._id
    return (
      <div className="contact-message-item"
        onClick={() => handleSelect(contact)}
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 20px', cursor: 'pointer',
          borderBottom: '1px solid #f1f5f9',
          background: isSelected ? 'var(--primary-bg)' : contact.isRead ? '#fff' : '#fafbff',
          transition: 'all 0.15s',
          borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
        }}
        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f8fafc' }}
        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = contact.isRead ? '#fff' : '#fafbff' }}
      >
        <button
          onClick={(e) => handleToggleStar(contact, e)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            color: contact.isStarred ? '#f59e0b' : '#d1d5db', fontSize: 15, flexShrink: 0, marginTop: 2,
            transition: 'color 0.2s',
          }}
          title={contact.isStarred ? 'Unstar' : 'Star'}
        >
          <i className={`fa-solid${contact.isStarred ? '' : '-regular'} fa-star`} />
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {contact.name?.charAt(0).toUpperCase()}
            </span>
            <strong style={{
              fontSize: 14, color: 'var(--text-primary)',
              fontWeight: contact.isRead ? 500 : 700,
              flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {contact.name}
            </strong>
            <span style={{ fontSize: 11, color: 'var(--text-light)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>
            {contact.email}
            {contact.subject && SUBJECT_LABELS[contact.subject] && (
              <span style={{ marginLeft: 8, color: 'var(--text-light)' }}>
                · {SUBJECT_LABELS[contact.subject]}
              </span>
            )}
          </div>

          <div style={{
            fontSize: 13, color: 'var(--text-light)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {contact.message}
          </div>
        </div>

        <div className="msg-actions" style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center', marginTop: 2 }}>
          {!contact.isRead && (
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--primary)', flexShrink: 0,
            }} />
          )}
          <button
            onClick={(e) => handleToggleRead(contact, e)}
            className="admin-btn admin-btn-outline admin-btn-xs"
            title={contact.isRead ? 'Mark unread' : 'Mark read'}
            style={{ padding: '3px 7px', fontSize: 11 }}
          >
            <i className={`fa-solid ${contact.isRead ? 'fa-envelope' : 'fa-envelope-open'}`} />
          </button>
          <button
            onClick={(e) => handleViewFull(contact, e)}
            className="admin-btn admin-btn-outline admin-btn-xs"
            title="View full message"
            style={{ padding: '3px 7px', fontSize: 11 }}
          >
            <i className="fa-solid fa-eye" />
          </button>
          <button
            onClick={(e) => handleDelete(contact, e)}
            className="admin-btn admin-btn-danger admin-btn-xs"
            title="Delete"
            style={{ padding: '3px 7px', fontSize: 11 }}
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </div>
    )
  }

  const MessageDetail = () => {
    if (!selected) return null
    return (
      <div style={{
        background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            <i className="fa-solid fa-message" style={{ marginRight: 8, color: 'var(--primary)' }} />
            Message Details
          </h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={(e) => handleToggleStar(selected, e)}
              className={`admin-btn admin-btn-xs ${selected.isStarred ? 'admin-btn-primary' : 'admin-btn-outline'}`}
            >
              <i className={`fa-solid${selected.isStarred ? '' : '-regular'} fa-star`} />
              {selected.isStarred ? 'Starred' : 'Star'}
            </button>
            <button
              onClick={(e) => handleToggleRead(selected, e)}
              className="admin-btn admin-btn-outline admin-btn-xs"
            >
              <i className={`fa-solid ${selected.isRead ? 'fa-envelope' : 'fa-envelope-open'}`} />
              {selected.isRead ? 'Mark Unread' : 'Mark Read'}
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          <div className="detail-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20,
          }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Name</label>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.name}</p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Date</label>
              <p style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Email</label>
              <a href={`mailto:${selected.email}`} style={{ fontSize: 14, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                {selected.email}
              </a>
            </div>
            {selected.phone && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Phone</label>
                <a href={`tel:${selected.phone}`} style={{ fontSize: 14, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                  {selected.phone}
                </a>
              </div>
            )}
            {selected.subject && SUBJECT_LABELS[selected.subject] && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>Subject</label>
                <span className={`status-badge ${selected.isRead ? 'status-confirmed' : 'status-pending'}`}>
                  {SUBJECT_LABELS[selected.subject]}
                </span>
              </div>
            )}
          </div>

          <div style={{
            background: '#f8fafc', borderRadius: 12, padding: '20px 24px',
            border: '1px solid var(--border)', marginBottom: 20,
          }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
              <i className="fa-solid fa-quote-left" style={{ marginRight: 6, color: 'var(--primary)' }} />
              Message
            </label>
            <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </p>
          </div>

          <div style={{
            display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <a
              href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] || 'Your Message'}`}
              className="admin-btn admin-btn-primary"
              target="_blank" rel="noopener noreferrer"
            >
              <i className="fa-solid fa-reply" />
              Reply via Email
            </a>
            <button
              onClick={(e) => handleDelete(selected, e)}
              className="admin-btn admin-btn-danger"
            >
              <i className="fa-solid fa-trash" />
              Delete Message
            </button>
          </div>
        </div>
      </div>
    )
  }

  const FullMessageModal = () => {
    if (!fullMessage) return null
    return (
      <div className="admin-modal-overlay" onClick={() => setFullMessage(null)}>
        <div className="admin-modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
          <div className="admin-modal-header">
            <h2><i className="fa-solid fa-message" style={{ marginRight: 8, color: 'var(--primary)' }} />Message</h2>
            <button className="admin-modal-close" onClick={() => setFullMessage(null)}>
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 16, fontWeight: 700,
              }}>
                {fullMessage.name?.charAt(0).toUpperCase()}
              </span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{fullMessage.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{fullMessage.email}</p>
              </div>
            </div>

            <div style={{
              display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                <i className="fa-regular fa-calendar" style={{ marginRight: 4 }} />
                {new Date(fullMessage.createdAt).toLocaleString()}
              </div>
              {fullMessage.phone && (
                <a href={`tel:${fullMessage.phone}`} style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none' }}>
                  <i className="fa-regular fa-phone" style={{ marginRight: 4 }} />
                  {fullMessage.phone}
                </a>
              )}
              {fullMessage.subject && SUBJECT_LABELS[fullMessage.subject] && (
                <span className={`status-badge ${fullMessage.isRead ? 'status-confirmed' : 'status-pending'}`}>
                  {SUBJECT_LABELS[fullMessage.subject]}
                </span>
              )}
            </div>

            <div style={{
              background: '#f8fafc', borderRadius: 12, padding: '20px',
              border: '1px solid var(--border)',
            }}>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {fullMessage.message}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`mailto:${fullMessage.email}?subject=Re: ${SUBJECT_LABELS[fullMessage.subject] || 'Your Message'}`}
              className="admin-btn admin-btn-primary"
              target="_blank" rel="noopener noreferrer"
            >
              <i className="fa-solid fa-reply" /> Reply
            </a>
            <button
              className="admin-btn admin-btn-outline"
              onClick={() => setFullMessage(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`} style={{ marginBottom: 16 }}>
          <i className={`fa-solid ${toast.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`} />
          {toast.msg}
        </div>
      )}

      <div className="admin-page-header">
        <h1><i className="fa-solid fa-envelope" style={{ marginRight: 10, color: 'var(--primary)' }} />Contact Messages</h1>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          <i className="fa-regular fa-bell" style={{ marginRight: 6 }} />
          {unreadCount} unread
        </span>
      </div>

      <Stats />

      <div className={`contact-messages-grid${selected ? ' has-selected' : ''}`} style={{ gap: 22, alignItems: 'start' }}>
        <div className="admin-table-card" style={{ marginBottom: 0 }}>
          <FilterTabs />
          <SearchBar />

          {loading ? (
            <div className="admin-loading">
              <div className="admin-loader" />
              <div>Loading messages...</div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="admin-empty" style={{ padding: '60px 20px' }}>
              <i className="fa-solid fa-inbox" style={{ fontSize: 40, display: 'block', marginBottom: 12, color: 'var(--text-light)' }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No messages found</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)' }}>
                {filter !== 'all' ? `No ${filter} messages.` : 'No contact submissions yet.'}
              </div>
            </div>
          ) : (
            <>
              <div style={{ maxHeight: 480, overflowY: 'auto' }}>
                {contacts.map(contact => (
                  <MessageItem key={contact._id} contact={contact} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="admin-pagination" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-light)', marginRight: 'auto' }}>
                    Page {page} of {totalPages}
                  </span>
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i + 1} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {selected && <MessageDetail />}
      </div>

      <FullMessageModal />
    </div>
  )
}

export default ContactMessages
