import { useState } from 'react'
import { Link } from 'react-router-dom'

const faqData = [
  {
    question: 'How do I place an order?',
    answer: 'Simply browse our shop, add items to your cart, and proceed to checkout. Fill in your details and choose a payment method to complete your order.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept payments via WhatsApp and Email. You can send your order details through either method and our team will assist you with the payment process.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days. Express delivery is available within 24-48 hours for an additional fee. Free shipping is available on orders over $200.'
  },
  {
    question: 'Can I return a product?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you are not satisfied with your purchase, contact our support team to initiate a return.'
  },
  {
    question: 'Do I need a prescription for medicines?',
    answer: 'Over-the-counter medicines can be purchased directly. Prescription medicines require a valid prescription from a licensed healthcare provider.'
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can reach us via phone at +61 3 8376 6284 or email at Info@pharmez.com. Our support team is available 24/7 to assist you.'
  }
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

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
                {faqData.map((item, index) => (
                  <div key={index} className={`faq-item${openIndex === index ? ' open' : ''}`}>
                    <div className="faq-question" onClick={() => toggleFAQ(index)}>
                      <span>{item.question}</span>
                      <i className="fa-solid fa-chevron-down" />
                    </div>
                    <div className="faq-answer" style={{ display: openIndex === index ? 'block' : 'none' }}>
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FAQ
