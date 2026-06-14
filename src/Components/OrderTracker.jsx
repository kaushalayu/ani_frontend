/**
 * OrderTracker — Reusable order status timeline
 * Use karo: <OrderTracker status="shipped" createdAt={date} deliveredAt={date} />
 */

const STEPS = [
  {
    key: 'pending',
    label: 'Order Placed',
    desc: 'Your order has been received',
    icon: 'fa-solid fa-receipt',
    color: '#f59e0b',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    desc: 'Order confirmed by pharmacy',
    icon: 'fa-solid fa-circle-check',
    color: '#3b82f6',
  },
  {
    key: 'processing',
    label: 'Processing',
    desc: 'Medicine being prepared',
    icon: 'fa-solid fa-pills',
    color: '#6366f1',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    desc: 'Out for delivery',
    icon: 'fa-solid fa-truck',
    color: '#0f766e',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Order delivered successfully',
    icon: 'fa-solid fa-box-open',
    color: '#10b981',
  },
]

const CANCELLED_STEP = {
  key: 'cancelled',
  label: 'Cancelled',
  desc: 'Order has been cancelled',
  icon: 'fa-solid fa-xmark-circle',
  color: '#ef4444',
}

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

function OrderTracker({ status, createdAt, deliveredAt, compact = false }) {
  const isCancelled = status === 'cancelled'
  const currentIdx  = STATUS_ORDER.indexOf(status)

  const steps = isCancelled
    ? [...STEPS.slice(0, Math.max(currentIdx, 1)), CANCELLED_STEP]
    : STEPS

  const getStepState = (stepKey, idx) => {
    if (isCancelled && stepKey === 'cancelled') return 'active'
    if (isCancelled) return idx < currentIdx ? 'done' : 'pending'
    if (stepKey === status) return 'active'
    return STATUS_ORDER.indexOf(stepKey) < currentIdx ? 'done' : 'pending'
  }

  return (
    <div style={{
      padding: compact ? '16px 0' : '24px 0',
      position: 'relative',
    }}>
      {/* Steps */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Connecting line behind steps */}
        <div style={{
          position: 'absolute',
          top: compact ? 16 : 20,
          left: '5%',
          right: '5%',
          height: 3,
          background: '#e5e7eb',
          zIndex: 0,
          borderRadius: 4,
        }} />

        {/* Progress line — filled portion */}
        <div style={{
          position: 'absolute',
          top: compact ? 16 : 20,
          left: '5%',
          height: 3,
          background: isCancelled ? '#ef4444' : 'linear-gradient(90deg, #10b981, #0f766e)',
          borderRadius: 4,
          zIndex: 1,
          transition: 'width 0.6s ease',
          width: isCancelled
            ? `${Math.min(((Math.max(currentIdx, 0)) / (STEPS.length - 1)) * 90, 90)}%`
            : `${(currentIdx / (STEPS.length - 1)) * 90}%`,
        }} />

        {steps.map((step, idx) => {
          const state = getStepState(step.key, idx)
          const isDone   = state === 'done'
          const isActive = state === 'active'
          const isPend   = state === 'pending'

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Circle icon */}
              <div style={{
                width: compact ? 32 : 40,
                height: compact ? 32 : 40,
                borderRadius: '50%',
                background: isDone
                  ? '#10b981'
                  : isActive
                    ? step.color
                    : '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isPend ? '#9ca3af' : '#fff',
                fontSize: compact ? 12 : 15,
                fontWeight: 700,
                border: isActive ? `3px solid ${step.color}44` : '3px solid transparent',
                boxShadow: isActive ? `0 0 0 3px ${step.color}22` : 'none',
                transition: 'all 0.3s',
                marginBottom: compact ? 6 : 10,
              }}>
                {isDone
                  ? <i className="fa-solid fa-check" style={{ fontSize: compact ? 11 : 14 }} />
                  : <i className={step.icon} style={{ fontSize: compact ? 11 : 14 }} />
                }
              </div>

              {/* Label */}
              <span style={{
                fontSize: compact ? 10 : 12,
                fontWeight: isActive || isDone ? 700 : 500,
                color: isActive
                  ? step.color
                  : isDone
                    ? '#374151'
                    : '#9ca3af',
                textAlign: 'center',
                lineHeight: 1.3,
                maxWidth: 80,
              }}>
                {step.label}
              </span>

              {/* Desc — only on active step, non-compact */}
              {isActive && !compact && (
                <span style={{
                  fontSize: 10.5,
                  color: step.color,
                  textAlign: 'center',
                  marginTop: 3,
                  maxWidth: 80,
                  lineHeight: 1.3,
                }}>
                  {step.desc}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Dates row */}
      {!compact && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 18,
          padding: '12px 16px',
          background: '#f8fafc',
          borderRadius: 10,
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            <i className="fa-regular fa-calendar" style={{ marginRight: 5, color: '#9ca3af' }} />
            <strong>Placed:</strong>{' '}
            {createdAt
              ? new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : '—'}
          </div>
          {deliveredAt && (
            <div style={{ fontSize: 12, color: '#10b981' }}>
              <i className="fa-solid fa-circle-check" style={{ marginRight: 5 }} />
              <strong>Delivered:</strong>{' '}
              {new Date(deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}
          {isCancelled && (
            <div style={{ fontSize: 12, color: '#ef4444' }}>
              <i className="fa-solid fa-xmark-circle" style={{ marginRight: 5 }} />
              <strong>Cancelled</strong>
            </div>
          )}
          {!deliveredAt && !isCancelled && status !== 'delivered' && (
            <div style={{ fontSize: 12, color: '#9ca3af' }}>
              <i className="fa-solid fa-truck" style={{ marginRight: 5 }} />
              <strong>Est. Delivery:</strong> 4–7 working days
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderTracker
