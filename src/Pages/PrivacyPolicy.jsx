import { Link } from 'react-router-dom'
import './PrivacyPolicy.css'

function PrivacyPolicy() {
  return (
    <div className="privacy-page">
      <div className="container">
        <div className="privacy-banner">
          <h1>Privacy Policy</h1>
          <p>Trusted source for prescription and over-the-counter medicines — delivered with care and confidence.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active" aria-current="page">Privacy Policy</span>
          </div>
        </div>

        <div className="privacy-content">
          <h2>Privacy Policy:</h2>
          <p>Protecting your privacy is important to us. This Privacy Policy outlines how we collect, use, and disclose personal information when you use our website.</p>

          <h4>1. Information We Collect:</h4>
          <p>We collect personal information such as your name, email address, and payment details when you create an account or make a purchase. We also collect usage data such as IP address, browser type, and pages visited.</p>

          <h4>2. How We Use Your Information:</h4>
          <p>We use your personal information to provide and improve our services. Your information may also be used for communication purposes, such as sending newsletters or updates.</p>

          <h4>3. Information Sharing:</h4>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent. We may share your information with trusted third-party service providers who assist us in operating our website.</p>

          <h4>4. Security:</h4>
          <p>We implement security measures to protect your personal information against unauthorized access or alteration. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

          <h4>5. Your Choices:</h4>
          <p>You have the right to access, update, or delete your personal information at any time. You can opt out of receiving promotional emails by following the instructions provided in the email. By using our website, you consent to the terms of this Privacy Policy. If you have any questions or concerns, please contact us.</p>

          <p className="last-p">By using our website, you consent to the terms of this Privacy Policy. If you have any questions or concerns, please contact us.</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
