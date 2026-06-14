import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'

function FAQ() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    API.get('/faqs')
      .then(({ data }) => setFaqs(data.faqs))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false))
  }, [])

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about our products, orders, <br />and delivery services.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">FAQ</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="float-left w-100 faq-con position-relative padding-top padding-bottom padding-rl">
        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-12">
              <div className="faq-list">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
                    <p>Loading FAQs...</p>
                  </div>
                ) : faqs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
                    <p>No FAQs available at the moment.</p>
                  </div>
                ) : (
                  faqs.map((item, index) => (
                    <div key={item._id} className={`faq-item${openIndex === index ? ' open' : ''}`}>
                      <div className="faq-question" onClick={() => toggleFAQ(index)}>
                        <span>{item.question}</span>
                        <i className="fa-solid fa-chevron-down" />
                      </div>
                      <div className="faq-answer" style={{ display: openIndex === index ? 'block' : 'none' }}>
                        {item.answer}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FAQ
