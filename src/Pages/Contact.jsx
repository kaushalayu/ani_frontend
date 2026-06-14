import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    if (error) setError('')
    if (success) setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(null)
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email and message.')
      return
    }
    setLoading(true)
    try {
      await API.post('/contact', form)
      setSuccess('Thank you! Your message has been sent successfully. We will get back to you within 24 hours.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Contact</h1>
                <p>Need help? We're here for you! Reach out with any questions about prescriptions, orders,
                  <br />
                  or delivery—our team is ready to assist you quickly and reliably.
                </p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Contact</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative contact-info-con padding-top padding-bottom">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">Contact Info</span>
              <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.05s">Our Contact Information</h2>
            </div>
            <div className="row all_row">
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="contact-info-box d-flex w-100">
                  <figure><img src="/assets/images/contact-location-icon.png" alt="location" className="img-fluid" /></figure>
                  <div className="contact-sub-con">
                    <h6>Our Location:</h6>
                    <p className="mb-0">121 King Street, Melbourne Victoria 3000 Australia</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="contact-info-box d-flex w-100">
                  <figure><img src="/assets/images/contact-email-icon.png" alt="email" className="img-fluid" /></figure>
                  <div className="contact-sub-con">
                    <h6>Email us at:</h6>
                    <a href="mailto:support@pharmez.com" className="d-inline-block">support@pharmez.com</a>
                    <div className="clearfix" />
                    <a href="mailto:pharmez@gmail.com" className="d-inline-block">pharmez@gmail.com</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="contact-info-box d-flex w-100">
                  <figure><img src="/assets/images/contact-phone-icon.png" alt="phone" className="img-fluid" /></figure>
                  <div className="contact-sub-con">
                    <h6>Phone:</h6>
                    <a href="tel:+01234567899" className="d-inline-block">+012 (345) 678 99</a>
                    <div className="clearfix" />
                    <a href="tel:+1234567847858" className="d-inline-block">+12345678 478 58</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="contact-info-box d-flex w-100">
                  <figure><img src="/assets/images/contact-open-hours.png" alt="hours" className="img-fluid" /></figure>
                  <div className="contact-sub-con">
                    <h6>Open Hours:</h6>
                    <p className="mb-0">Monday–Friday, 9 am–6 pm <br />Saturday-Sunday: 12 pm - 5pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative contact-form-con padding-top padding-bottom bg-sky br-30">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block">Get in Touch</span>
              <h2>Send us a Message</h2>
              <p className="contact-form-desc">Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>
            <div className="contact-form-wrapper">
              {success && (
                <div style={{
                  background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 12,
                  padding: '16px 20px', marginBottom: 20, fontSize: 14, color: '#065f46',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <i className="fa-regular fa-circle-check" style={{ fontSize: 20 }} />
                  {success}
                </div>
              )}
              {error && (
                <div style={{
                  background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12,
                  padding: '16px 20px', marginBottom: 20, fontSize: 14, color: '#991b1b',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <i className="fa-regular fa-circle-exclamation" style={{ fontSize: 20 }} />
                  {error}
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="name"><i className="fa-regular fa-user"></i> Your Name</label>
                    <input type="text" placeholder="John Doe" name="name" id="name" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email"><i className="fa-regular fa-envelope"></i> Email Address</label>
                    <input type="email" placeholder="john@example.com" name="email" id="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label htmlFor="phone"><i className="fa-regular fa-phone"></i> Phone Number</label>
                    <input type="tel" placeholder="+1 234 567 890" name="phone" id="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="subject"><i className="fa-regular fa-tag"></i> Subject</label>
                    <select name="subject" id="subject" value={form.subject} onChange={handleChange}>
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="prescription">Prescription Question</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="product">Product Information</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="contact-form-group">
                  <label htmlFor="message"><i className="fa-regular fa-message"></i> Your Message</label>
                  <textarea placeholder="Write your message here..." rows={5} name="message" id="message" value={form.message} onChange={handleChange} />
                </div>
                <div className="contact-form-footer">
                  <button type="submit" className="contact-submit-btn" disabled={loading}>
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <i className="fa-regular fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <div className="spacer" />
      </div>

      <div className="padding-rl float-left w-100">
        <div className="float-left w-100 contact-map-con position-relative br-50">
          <div className="container-fluid p-0 wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.05s">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.367176743588!2d144.95736461590413!3d-37.81813957974638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65cbce858f6d7%3A0x9cc486b305ba3fb1!2s21%20King%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2s!4v1669200882885!5m2!1sen!2s" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Google Maps">
            </iframe>
          </div>
        </div>
      </div>
      <div className="clearfix" />
      <div className="spacer" />
    </>
  )
}

export default Contact
