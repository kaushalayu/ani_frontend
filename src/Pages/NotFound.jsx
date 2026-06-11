import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="error-section w-100 float-left position-relative bg-lavendr">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-10 col-12 mr-auto ml-auto">
            <div className="error-con">
              <h2>4 <i className="fa-solid fa-face-sad-tear"></i> 4</h2>
              <h4 className="font-weight-700">We Could Not Find The Page You're Looking For</h4>
              <p>The link you're trying to access is probably broken, or the page has been removed.</p>
              <Link to="/" className="text-decoration-none primary_btn d-inline-block">
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
