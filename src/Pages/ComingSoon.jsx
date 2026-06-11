import { Link } from "react-router-dom";

function ComingSoon() {
  return (
    <>
      <section className="float-left w-100 coming-soon-con d-flex flex-column justify-content-center position-relative main-box bg-lavendr">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 mr-auto ml-auto">
              <div className="sub-content-con position-relative">
                <Link to="/" className="d-block">
                  <img src="/assets/images/large-logo.png" alt="logo-icon" className="img-fluid new-logo" />
                </Link>
                <div className="position-relative coming-content-con">
                  <h3 className="font-weight-500">Our Website is under construction</h3>
                  <h1 className="black-text">Coming Soon</h1>
                  <div id="compaign_countdown2" className="compaign_countdown">
                    <ul className="p-0 d-flex justify-content-center align-items-center">
                      <li><span id="days" className="days"></span> Days</li>
                      <li><span id="hours" className="hours"></span>Hours</li>
                      <li><span id="minutes" className="minutes"></span>Mints</li>
                      <li><span id="seconds" className="seconds"></span>Sec</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ComingSoon
