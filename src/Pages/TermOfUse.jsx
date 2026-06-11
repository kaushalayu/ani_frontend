import { Link } from 'react-router-dom'
import './TermOfUse.css'

function TermOfUse() {
  return (
    <div className="term-page">
      <div className="container">
        <div className="term-banner">
          <h1>Term of Use</h1>
          <p>Trusted source for prescription and over-the-counter medicines — delivered with care and confidence.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Term of Use</span>
          </div>
        </div>

        <div className="term-content">
          <h2>Term of Use:</h2>
          <p>Welcome to Pharmez! Before accessing or using our website, please read these Terms and Conditions carefully. By accessing or using any part of the site, you agree to be bound by these Terms and Conditions.</p>

          <h4>1. Use of Website:</h4>
          <p>Your use of our website is subject to these Terms and Conditions. You must be at least 18 years old to use our services.</p>

          <h4>2. User Account:</h4>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate and complete information when creating an account.</p>

          <h4>3. Intellectual Property:</h4>
          <p>All content on this website, including text, graphics, logos, and images, is the property of Pharmez and protected by copyright laws. You may not reproduce, distribute, or transmit any content without prior written consent.</p>

          <h4>4. Payment and Billing:</h4>
          <p>Payment for our services is required in advance. All fees are non-refundable.</p>

          <h4>5. Termination:</h4>
          <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms and Conditions. Please review our full Terms and Conditions for more detailed information. You have the right to access, update, or delete your personal information at any time. You can opt out of receiving promotional emails by following the instructions provided in the email. By using our website, you consent to the terms of this Privacy Policy. If you have any questions or concerns, please contact us.</p>

          <p className="last-p">Please review our full Terms and Conditions for more detailed information.</p>
        </div>
      </div>
    </div>
  )
}

export default TermOfUse
