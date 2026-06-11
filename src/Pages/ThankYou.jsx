import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative thank-you-con padding-top125 padding-bottom150 text-center">
          <div className="main-container">
            <div className="thankyou-content-con">
              <figure>
                <img src="/assets/images/smile-image.png" alt="smile icon" className="img-fluid" />
              </figure>
              <h1 className="text-black">Thank You!</h1>
              <p>Thank you for your order! We're committed to your health and well-being, and we can't wait for<br />you to experience our trusted pharmacy care. Your satisfaction is our top priority.</p>
              <Link to="/" className="text-decoration-none primary_btn d-inline-block">Back to Home</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ThankYou
