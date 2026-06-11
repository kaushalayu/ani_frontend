import { Link } from 'react-router-dom'

function About() {
  return (

    <>
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>About Us</h1>
                <p>Trusted source for prescription and over-the-counter medicines — delivered <br />
                  with care and confidence.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">About</li>
                  </ol>
                </div>
                { /* banner inner con */}
              </div>
              { /* col */}
            </div>

            { /* wrapper */}
          </div>
          { /* banner con */}
        </section>
        { /* padding rl */}
      </div>
      { /* MAIN ABOUT SECTION */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 main-about-con position-relative padding-top padding-bottom">
          <div className="main-container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="main-abt-content-con">
                  <div className="heading-title-con">
                    <span className="special-text d-inline-block wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.3s">About Us</span>
                    <h2 className="wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">Committed to
                      Making <br />
                      Healthcare Accessible
                    </h2>
                    <p className="text-margin wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">We
                      offer a trusted platform where you can confidently order both
                      prescription and
                      over-the-counter medicines online. Our team is dedicated to safety, reliability, and
                      exceptional customer care—ensuring that you receive the medications you need,
                      when you need them, without hassle.
                    </p>
                    <p className="wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">With a focus on
                      convenience and quality, we partner with licensed pharmacies and
                      healthcare professionals. Our mission is to simplify your healthcare journey, one
                      delivery at a time.</p>
                    { /* heading title con */}
                  </div>
                  <div className="position-relative wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">
                    <figure><img src="/assets/images/main-abt-img1.jpg" alt="image" className="img-fluid br-30" />
                    </figure>
                    <div className="vid-con bg-black br-30 text-center"><a href="https://video-previews.elements.envatousercontent.com/a8007808-5900-46c3-92dc-9c4dc55afd78/watermarked_preview/watermarked_preview.mp4" className="popup-vimeo d-inline-block"><img src="/assets/images/play-btn.png" alt="icon" className="img-fluid" /></a><span className="d-block text-white font-weight-bold">Watch
                      Video</span>
                    </div>
                  </div>
                  { /* main about content con */}
                </div>
                { /* col */}
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="main-about-img-con wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.05s">
                  <figure><img src="/assets/images/main-abt-img2.jpg" alt="image" className="img-fluid br-30" />
                  </figure>
                  <div className="users-details-con wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.6s">
                    <div className="user-detrail-box">
                      <span className="d-inline-block counter">98</span><span className="d-inline-block alphabet">%</span>
                      <p className="mb-0">Customer Satisfaction</p>
                    </div>
                    <div className="user-detrail-box">
                      <span className="d-inline-block counter">10</span><span className="d-inline-block alphabet">M</span><span className="d-inline-block alphabet">+</span>
                      <p className="mb-0">Orders Delivered</p>
                    </div>
                    <div className="user-detrail-box border-right-0">
                      <span className="d-inline-block counter">500</span><span className="d-inline-block alphabet">+</span>
                      <p className="mb-0">Pharmacy Partners</p>
                    </div>
                  </div>
                  { /* main about img con */}
                </div>
                { /* col */}
              </div>
              { /* row */}
            </div>
            { /* main container */}
          </div>
          { /* main about con */}
        </section>
        { /* padding rl */}
      </div>

      { /* BENEFITS SECTION */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 benefits-con background-lemon">
          <div className="main-container">
            <div className="benefits-inner-con">
              <ul className="d-flex list-unstyled p-0 mb-0 align-items-center justify-content-between">
                <li className="position-relative d-flex align-items-center wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">
                  <figure>
                    <img src="/assets/images/benefits-icon1.png" alt="icon" className="img-fluid" />
                  </figure>
                  <div className="sub-info-inner">
                    <h6 className="">Free Shipping & Returns</h6>
                    <p className="mb-0 sub-p">For all order over $200</p>
                    { /* sub info inner */}
                  </div>
                </li>
                <li className="position-relative d-flex align-items-center wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.06s">
                  <figure>
                    <img src="/assets/images/benefits-icon2.png" alt="icon" className="img-fluid" />
                  </figure>
                  <div className="sub-info-inner">
                    <h6 className="">Secure Payment</h6>
                    <p className="mb-0 sub-p">Ensure Secure Payment</p>
                    { /* sub info inner */}
                  </div>
                </li>
                <li className="position-relative d-flex align-items-center wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.07s">
                  <figure>
                    <img src="/assets/images/benefits-icon3.png" alt="icon" className="img-fluid" />
                  </figure>
                  <div className="sub-info-inner">
                    <h6 className="">Money Back Guarantee</h6>
                    <p className="mb-0 sub-p">Returning Money in 30 days</p>
                    { /* sub info inner */}
                  </div>
                </li>
                <li className="position-relative d-flex align-items-center wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.08s">
                  <figure>
                    <img src="/assets/images/benefits-icon4.png" alt="icon" className="img-fluid" />
                  </figure>
                  <div className="sub-info-inner">
                    <h6 className="">24/7 Customer Support</h6>
                    <p className="mb-0 sub-p">Friendly Customer Support</p>
                    { /* sub info inner */}
                  </div>
                </li>
                { /* list unstyled */}
              </ul>
              { /* benefits inner con */}
            </div>
            { /* main container */}
          </div>
          { /* benefits con */}
        </section>
        { /* padding rl */}
      </div>
      <div className="spacer" />
      { /* HOW IT WORKS SECTION */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 position-relative how-it-works-con br-30">
          <figure className="pharmz-icon wow tada" data-wow-duration="2s" data-wow-delay="0.05s"><img src="/assets/images/capsule-icon.png" alt="vector" className="position-absolute img-fluid" />
          </figure>
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-6">
                <div className="work-img-con wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.05s">
                  <figure><img src="/assets/images/work-img.jpg" alt="image" className="" /></figure>
                  { /* work image con */}
                </div>
                { /* col */}
              </div>
              <div className="col-lg-5 col-md-6">
                <div className="work-content-con">
                  <div className="heading-title-con">
                    <span className="special-text d-inline-block text-lemon wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">Our Process</span>
                    <h2 className="wow fadeInLeft mb-0 text-white" data-wow-duration="2s" data-wow-delay="0.05s">How it
                      Works
                    </h2>
                    { /* heading title con */}
                  </div>
                  <ul className="list-unstyled p-0 mb-0 position-relative wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">

                    <li className="position-relative d-flex align-items-center">
                      <figure>
                        <img src="/assets/images/work-icon2.png" alt="icon" className="img-fluid" />
                      </figure>
                      <div className="sub-info-inner">
                        <h6 className="">Choose Your Products</h6>
                        <p className="mb-0 sub-p ">Browse and select the medicines or health products
                          you need.</p>
                        { /* sub info inner */}
                      </div>
                    </li>
                    <li className="position-relative d-flex align-items-center">
                      <figure>
                        <img src="/assets/images/work-icon3.png" alt="icon" className="img-fluid" />
                      </figure>
                      <div className="sub-info-inner">
                        <h6 className="">Get It Delivered</h6>
                        <p className="mb-0 sub-p ">Receive your order at your doorstep — fast, safe, and
                          hassle-free. </p>
                        { /* sub info inner */}
                      </div>
                    </li>
                    { /* info details */}
                  </ul>
                  <Link to="/cart" className="text-decoration-none primary_btn d-inline-block">Shop Now</Link>
                  { /* work content con */}
                </div>
                { /* col */}
              </div>
              { /* row */}
            </div>
            { /* container fluid */}
          </div>
          { /* how it works con */}
        </section>
        { /* padding rl */}
      </div>

      { /* OUR TEAM SECTION  */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 our-team-con padding-top padding-bottom position-relative br-30">
          <div className="main-container wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.2s">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.3s">Our
                Team</span>
              <h2 className="wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.3s">The People Behind the Care
              </h2>
              { /* heading title con */}
            </div>
            <div className="row all_row">
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.3s">
                <div className="team-box text-center position-relative all_boxes">
                  <figure><img src="/assets/images/team-person1.jpg" alt="image" className="img-fluid" />
                  </figure>
                  <h5>Emma Collins </h5>
                  <span className="designation text-color d-block">Chief Medical Officer</span>
                  <ul className="list-unstyled p-0 mb-0">
                    <li className="d-inline-block"><a href="https://www.facebook.com/login/" className="ml-0"><i className="fa-brands fa-facebook-f" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.instagram.com/"><i className="fa-brands fa-instagram" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.linkedin.com/"><i className="fa-brands fa-linkedin" /></a>
                    </li>
                  </ul>
                  { /* team box */}
                </div>
                { /* col */}
              </div>
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.5s">
                <div className="team-box text-center position-relative all_boxes">
                  <figure><img src="/assets/images/team-person2.jpg" alt="image" className="img-fluid" />
                  </figure>
                  <h5>James Bennett </h5>
                  <span className="designation text-color d-block">Head of Operations</span>
                  <ul className="list-unstyled p-0 mb-0">
                    <li className="d-inline-block"><a href="https://www.facebook.com/login/" className="ml-0"><i className="fa-brands fa-facebook-f" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.instagram.com/"><i className="fa-brands fa-instagram" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.linkedin.com/"><i className="fa-brands fa-linkedin" /></a>
                    </li>
                  </ul>
                  { /* team box */}
                </div>
                { /* col */}
              </div>
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.6s">
                <div className="team-box text-center position-relative all_boxes">
                  <figure><img src="/assets/images/team-person3.jpg" alt="image" className="img-fluid" />
                  </figure>
                  <h5>Sophie Turner</h5>
                  <span className="designation text-color d-block">Customer Experience Manager</span>
                  <ul className="list-unstyled p-0 mb-0">
                    <li className="d-inline-block"><a href="https://www.facebook.com/login/" className="ml-0"><i className="fa-brands fa-facebook-f" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.instagram.com/"><i className="fa-brands fa-instagram" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.linkedin.com/"><i className="fa-brands fa-linkedin" /></a>
                    </li>
                  </ul>
                  { /* team box */}
                </div>
                { /* col */}
              </div>
              <div className="col-lg-3 col-md-6 all_column wow fadeInUp" data-wow-duration="2s" data-wow-delay="0.7s">
                <div className="team-box text-center position-relative all_boxes">
                  <figure><img src="/assets/images/team-person4.jpg" alt="image" className="img-fluid" />
                  </figure>
                  <h5>Daniel Harris</h5>
                  <span className="designation text-color d-block">Lead Pharmacist</span>
                  <ul className="list-unstyled p-0 mb-0">
                    <li className="d-inline-block"><a href="https://www.facebook.com/login/" className="ml-0"><i className="fa-brands fa-facebook-f" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.instagram.com/"><i className="fa-brands fa-instagram" /></a>
                    </li>
                    <li className="d-inline-block"><a href="https://www.linkedin.com/"><i className="fa-brands fa-linkedin" /></a>
                    </li>
                  </ul>
                  { /* team box */}
                </div>
                { /* col */}
              </div>
              { /* row */}
            </div>
            { /* main-container*/}
          </div>
          { /* our team con */}
        </section>
        { /* padding rl */}
      </div>

      { /* CLIENT SECTION START HERE */}
      <div className="padding-rl float-left w-100">
        <div className="client-review-slider w-100 float-left padding-top padding-bottom position-relative main-box br-30">
          <div className="container wow fadeIn" data-wow-duration="2s" data-wow-delay="0.3s">
            <figure><img src="/assets/images/left-quote.png" alt="quote" className="position-absolute left-quote" />
            </figure>
            <figure><img src="/assets/images/right-quote.png" alt="quote" className="position-absolute right-quote" />
            </figure>
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block text-lemon wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">Testimonials</span>
              <h2 className="wow fadeInRight mb-0" data-wow-duration="2s" data-wow-delay="0.05s">Our Client Reviews
              </h2>
              { /* heading title con */}
            </div>
            <div className="client-review-slider-inner-con wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
              <div id="home1_testimonial_slider" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="client-review-box">
                      <figure className="rating-stars">
                        <img src="/assets/images/rating-stars.png" alt="rating-stars" />
                      </figure>
                      <p className="review-text">“Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem
                        quia voluptas aspernatur aurodit aut fugit, <br />
                        sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are
                        dolore magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor
                        incidunt labore minima veniam.”
                      </p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="client-review-box">
                      <figure className="rating-stars">
                        <img src="/assets/images/rating-stars.png" alt="rating-stars" />
                      </figure>
                      <p className="review-text">“Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem
                        quia
                        voluptas aspernatur aurodit aut fugit,<br />
                        sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are
                        dolore
                        magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt
                        labore
                        minima veniam.”</p>

                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="client-review-box">
                      <figure className="rating-stars">
                        <img src="/assets/images/rating-stars.png" alt="rating-stars" />
                      </figure>
                      <p className="review-text">“Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem
                        quia
                        voluptas aspernatur aurodit aut fugit, <br />
                        sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are
                        dolore
                        magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt
                        labore
                        minima veniam.”</p>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="client-review-box">
                      <figure className="rating-stars">
                        <img src="/assets/images/rating-stars.png" alt="rating-stars" />
                      </figure>
                      <p className="review-text">“Beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem
                        quia
                        voluptas aspernatur aurodit aut fugit,<br />
                        sed neatae vitae dicta ripiscing elit, sed do euismod tempor incidunt labore are
                        dolore
                        magna aliqua aut enim a minim adipiscing elit, sed do euismod tempor incidunt
                        labore
                        minima veniam.”</p>
                    </div>
                  </div>
                </div>
                <ul className="carousel-indicators">
                  <li data-target="#home1_testimonial_slider" data-slide-to="0" className="active">
                    <figure className="mb-0">
                      <img src="/assets/images/client-img1.jpg" alt="image" className="img-fluid" />
                    </figure>
                    <div className="name_wrapper">
                      <p className="client-name">Jennifer Troyer</p>
                      <span className="d-block">Administrator</span>
                    </div>
                  </li>
                  <li data-target="#home1_testimonial_slider" data-slide-to="1">
                    <figure className="mb-0">
                      <img src="/assets/images/client-img2.jpg" alt="image" className="img-fluid" />
                    </figure>
                    <div className="name_wrapper">
                      <p className="client-name">Fergus Douchebag</p>
                      <span className="d-block">Happy Customer</span>
                    </div>
                  </li>
                  <li data-target="#home1_testimonial_slider" data-slide-to="2">
                    <figure className="mb-0">
                      <img src="/assets/images/client-img3.jpg" alt="image" className="img-fluid" />
                    </figure>
                    <div className="name_wrapper">
                      <p className="client-name">lucy Smith</p>
                      <span className="d-block">Satisfied Customer</span>
                    </div>
                  </li>
                  <li data-target="#home1_testimonial_slider" data-slide-to="3">
                    <figure className="mb-0">
                      <img src="/assets/images/client-img4.jpg" alt="image" className="img-fluid" />
                    </figure>
                    <div className="name_wrapper">
                      <p className="client-name">John Smith</p>
                      <span className="d-block">Satisfied Client</span>
                    </div>
                  </li>
                </ul>
                <div className="pagination-outer">
                  <a className="carousel-control-prev" href="#home1_testimonial_slider" role="button" data-slide="prev">
                    <i className="prev-arrow fa-solid fa-arrow-left" />
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href="#home1_testimonial_slider" role="button" data-slide="next">
                    <i className="next-arrow fa-solid fa-arrow-right" />
                    <span className="sr-only">Next</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        { /* padding-rl */}
      </div>
      { /* NEWS AND ARTICLES SECTION */}
      <div className="padding-rl float-left w-100">
        <section className="float-left w-100 news-and-articles-con padding-top padding-bottom position-relative">
          <div className="main-container">
            <div className="heading-title-con text-center">
              <span className="special-text d-inline-block wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">News & Articles</span>
              <h2 className="wow fadeInRight mb-0" data-wow-duration="2s" data-wow-delay="0.05s">Our Latest Blog Posts
              </h2>
              { /* heading title con */}
            </div>
            <div className="row" data-aos="fade-up">
              <div className="col-lg-4 col-md-6 col-sm-6 col-12 order-lg-1 order-1 mx-auto wow fadeInLeft" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="article-box">
                  <div className="image position-relative">
                    <figure className="article-image">
                      <img src="/assets/images/news-and-articles-img1.jpg" alt="image" className="img-fluid" />
                    </figure>
                  </div>
                  <div className="box-content">
                    <Link to="/blog" className="text-decoration-none">
                      <h4>5 Natural Ways to Strengthen Your
                        Immune System </h4>
                    </Link>
                    <p className="mb-0">Discover simple lifestyle habits and key supplements
                      that can naturally boost your immunity...</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6 col-12 order-lg-2 order-3 mx-auto wow bounce" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="article-box mb-0">
                  <div className="image position-relative">
                    <figure className="article-image">
                      <img src="/assets/images/news-and-articles-img2.jpg" alt="image" className="img-fluid" />
                    </figure>
                  </div>
                  <div className="box-content">
                    <Link to="/blog" className="text-decoration-none">
                      <h4>Skincare Advice for Sensitive Skin:
                        Simple Tips for a Calmer</h4>
                    </Link>
                    <p className="mb-0">Learn how to care for sensitive skin with gentle routines
                      and dermatologist-recommended products.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-6 col-12 order-lg-3 order-2 mx-auto wow fadeInRight" data-wow-duration="2s" data-wow-delay="0.05s">
                <div className="article-box">
                  <div className="image position-relative">
                    <figure className="article-image">
                      <img src="/assets/images/news-and-articles-img3.jpg" alt="image" className="img-fluid" />
                    </figure>
                  </div>
                  <div className="box-content">
                    <Link to="/blog" className="text-decoration-none">
                      <h4>Do You Really Need Supplements?
                        a Practical Guide to Boosting</h4>
                    </Link>
                    <p className="mb-0">Find out when supplements are helpful and how to
                      choose the right ones for your health needs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div></>

  )
}

export default About
