import { Link } from 'react-router-dom'
import { useWishlist } from '../Context/WishlistContext'
import { useToast } from '../Components/Toast'

function Services() {
  const { addToWishlist } = useWishlist()
  const { addToast } = useToast()
  return (
    <>
      <><div className="padding-rl float-left w-100">
        <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
          <div className="main-container">
            <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
              <div className="sub-banner-inner-con text-center">
                <h1>Services</h1>
                <p>Trusted source for prescription and over-the-counter medicines — delivered <br />
                  with care and confidence.</p>
                <div className="breadcrumb-con d-inline-block">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Services</li>
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
        { /* home banner outer */}


        { /* SERVICES INTRO */}
        <div className="padding-rl float-left w-100">
          <section className="float-left w-100 srv-intro-con">
            <div className="main-container">
              <div className="row align-items-center">
                <div className="col-lg-6 wow fadeInLeft" data-wow-duration="1.5s" data-wow-delay="0.05s">
                  <div className="srv-intro-content">
                    <span className="srv-section-tag">What We Offer</span>
                    <h2>Comprehensive <span>Healthcare</span> Services</h2>
                    <p>From prescription medicines to wellness supplements, we provide end-to-end pharmaceutical
                      care with expert guidance, fast delivery, and unwavering quality — because your health
                      is our priority.</p>
                    <div className="srv-intro-stats">
                      <div className="srv-stat-item">
                        <span className="srv-stat-num">50K+</span>
                        <span className="srv-stat-label">Happy Patients</span>
                      </div>
                      <div className="srv-stat-item">
                        <span className="srv-stat-num">10K+</span>
                        <span className="srv-stat-label">Products</span>
                      </div>
                      <div className="srv-stat-item">
                        <span className="srv-stat-num">99%</span>
                        <span className="srv-stat-label">Satisfaction</span>
                      </div>
                    </div>
                    <Link to="/shop" className="srv-primary-btn">Explore Products <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
                <div className="col-lg-6 wow fadeInRight" data-wow-duration="1.5s" data-wow-delay="0.05s">
                  <div className="srv-intro-image">
                    <img src="/assets/images/popular-category1.jpg" alt="Healthcare" className="img-fluid srv-intro-main-img" />
                    <div className="srv-intro-badge">
                      <i className="fa-solid fa-truck" />
                      <span>Free Delivery</span>
                    </div>
                    { /* <div class="srv-intro-badge srv-intro-badge-2">
                                                             <i class="fa-solid fa-shield-halved"></i>
                                                             <span>100% Secure</span>
                                                         </div> */ }
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        { /* SERVICES CARDS */}
        <div className="padding-rl float-left w-100">
          <section className="float-left w-100 srv-cards-con">
            <div className="main-container">
              <div className="text-center wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.05s">
                <span className="srv-section-tag">Our Services</span>
                <h2>Everything You Need <span>Under One Roof</span></h2>
                <p className="srv-cards-desc">We cover every aspect of your pharmaceutical needs with care and
                  professionalism</p>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.08s">
                  <div className="srv-card">
                    <div className="srv-card-icon"><i className="fa-solid fa-prescription-bottle-medical" /></div>
                    <h4>Prescription Medicines</h4>
                    <p>Authentic prescription drugs sourced directly from verified manufacturers with full
                      dosage guidance.</p>
                    <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.12s">
                  <div className="srv-card">
                    <div className="srv-card-icon"><i className="fa-solid fa-leaf" /></div>
                    <h4>Wellness & Supplements</h4>
                    <p>Premium vitamins, minerals, and herbal supplements to support your daily wellness
                      journey.</p>
                    <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.16s">
                  <div className="srv-card">
                    <div className="srv-card-icon"><i className="fa-solid fa-hand-holding-heart" /></div>
                    <h4>Personal Care</h4>
                    <p>Skincare, hygiene, and personal wellness products curated for your daily self-care
                      routine.</p>
                    <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.20s">
                  <div className="srv-card">
                    <div className="srv-card-icon"><i className="fa-solid fa-truck-fast" /></div>
                    <h4>Fast Home Delivery</h4>
                    <p>Same-day and next-day delivery options so you never run out of what you need.</p>
                    <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.24s">
                  <div className="srv-card">
                    <div className="srv-card-icon"><i className="fa-solid fa-headset" /></div>
                    <h4>24/7 Pharmacist Support</h4>
                    <p>Licensed pharmacists available around the clock for consultations and medication advice.
                    </p>
                    <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.28s">
                  <div className="srv-card">
                    <div className="srv-card-icon"><i className="fa-solid fa-shield-halved" /></div>
                    <h4>Secure Payments</h4>
                    <p>Encrypted transactions with multiple payment options for a safe and seamless checkout.
                    </p>
                    <Link to="/shop">Learn More <i className="fa-solid fa-arrow-right" /></Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        { /* FEATURED PRODUCTS SECTION */}
        <div className="padding-rl float-left w-100">
          <section className="position-relative padding-top padding-bottom services-featured-section">
            <div className="main-container">
              <div className="services-featured-header text-center">
                <span className="services-featured-tag wow fadeInLeft" data-wow-duration="1.5s" data-wow-delay="0.05s">Best Items</span>
                <h2 className="wow fadeInRight mb-0" data-wow-duration="1.5s" data-wow-delay="0.05s">Our Featured
                  Products</h2>
                <p className="services-featured-desc">Premium healthcare solutions tailored to your needs</p>
              </div>
              <div className="services-featured-tabs wow fadeInUp" data-wow-duration="1.5s" data-wow-delay="0.1s">
                <div className="services-tab-nav">
                  <a className="active" data-toggle="tab" href="#srv-all">All</a>
                  <a data-toggle="tab" href="#srv-Cardiology">Cardiology</a>
                  <a data-toggle="tab" href="#srv-Neurology">Neurology</a>
                  <a data-toggle="tab" href="#srv-Pediatrics">Pediatrics</a>
                  <a data-toggle="tab" href="#srv-Gynecology">Gynecology</a>
                </div>
                <div className="services-tab-content">
                  <div id="srv-all" className="services-tab-pane active">
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">
                              <figure className="mb-0">
                                <img src="/assets/images/product1.png" alt="VitalEase Multivitamins" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Supplement</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'vitalease-multivitamins', name: 'VitalEase Multivitamins', price: 63.00, img: '/assets/images/product1.png', pills: 'Supplement' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">VitalEase
                                Multivitamins</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$63.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">
                              <figure className="mb-0">
                                <img src="/assets/images/product2.png" alt="DermaGlow Skin Cream" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Healthy Skin</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'dermaglow-skin-cream', name: 'DermaGlow Skin Cream', price: 84.00, img: '/assets/images/product2.png', pills: 'Healthy Skin' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">DermaGlow
                                Skin Cream</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$84.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">
                              <figure className="mb-0">
                                <img src="/assets/images/product3.png" alt="CalmFlu Relief Syrup" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Flu Remedy</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'calmflu-relief-syrup', name: 'CalmFlu Relief Syrup', price: 96.00, img: '/assets/images/product3.png', pills: 'Flu Remedy' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">CalmFlu
                                Relief Syrup</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$96.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">
                              <figure className="mb-0">
                                <img src="/assets/images/product4.png" alt="NutriSlim Capsules" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Herbal</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'nutrislim-capsules', name: 'NutriSlim Capsules', price: 42.00, img: '/assets/images/product4.png', pills: 'Herbal' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">NutriSlim
                                Capsules</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$42.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="srv-Cardiology" className="services-tab-pane">
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">
                              <figure className="mb-0">
                                <img src="/assets/images/product1.png" alt="VitalEase Multivitamins" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Supplement</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'vitalease-multivitamins', name: 'VitalEase Multivitamins', price: 63.00, img: '/assets/images/product1.png', pills: 'Supplement' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">VitalEase
                                Multivitamins</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$63.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">
                              <figure className="mb-0">
                                <img src="/assets/images/product2.png" alt="DermaGlow Skin Cream" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Healthy Skin</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'dermaglow-skin-cream', name: 'DermaGlow Skin Cream', price: 84.00, img: '/assets/images/product2.png', pills: 'Healthy Skin' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">DermaGlow
                                Skin Cream</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$84.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">
                              <figure className="mb-0">
                                <img src="/assets/images/product3.png" alt="CalmFlu Relief Syrup" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Flu Remedy</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'calmflu-relief-syrup', name: 'CalmFlu Relief Syrup', price: 96.00, img: '/assets/images/product3.png', pills: 'Flu Remedy' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">CalmFlu
                                Relief Syrup</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$96.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">
                              <figure className="mb-0">
                                <img src="/assets/images/product4.png" alt="NutriSlim Capsules" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Herbal</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'nutrislim-capsules', name: 'NutriSlim Capsules', price: 42.00, img: '/assets/images/product4.png', pills: 'Herbal' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">NutriSlim
                                Capsules</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$42.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="srv-Neurology" className="services-tab-pane">
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">
                              <figure className="mb-0">
                                <img src="/assets/images/product3.png" alt="CalmFlu Relief Syrup" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Flu Remedy</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'calmflu-relief-syrup', name: 'CalmFlu Relief Syrup', price: 96.00, img: '/assets/images/product3.png', pills: 'Flu Remedy' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">CalmFlu
                                Relief Syrup</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$96.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">
                              <figure className="mb-0">
                                <img src="/assets/images/product4.png" alt="NutriSlim Capsules" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Herbal</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'nutrislim-capsules', name: 'NutriSlim Capsules', price: 42.00, img: '/assets/images/product4.png', pills: 'Herbal' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">NutriSlim
                                Capsules</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$42.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">
                              <figure className="mb-0">
                                <img src="/assets/images/product1.png" alt="VitalEase Multivitamins" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Supplement</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'vitalease-multivitamins', name: 'VitalEase Multivitamins', price: 63.00, img: '/assets/images/product1.png', pills: 'Supplement' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">VitalEase
                                Multivitamins</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$63.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">
                              <figure className="mb-0">
                                <img src="/assets/images/product2.png" alt="DermaGlow Skin Cream" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Healthy Skin</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'dermaglow-skin-cream', name: 'DermaGlow Skin Cream', price: 84.00, img: '/assets/images/product2.png', pills: 'Healthy Skin' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">DermaGlow
                                Skin Cream</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$84.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="srv-Pediatrics" className="services-tab-pane">
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">
                              <figure className="mb-0">
                                <img src="/assets/images/product3.png" alt="CalmFlu Relief Syrup" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Flu Remedy</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'calmflu-relief-syrup', name: 'CalmFlu Relief Syrup', price: 96.00, img: '/assets/images/product3.png', pills: 'Flu Remedy' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">CalmFlu
                                Relief Syrup</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$96.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">
                              <figure className="mb-0">
                                <img src="/assets/images/product4.png" alt="NutriSlim Capsules" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Herbal</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'nutrislim-capsules', name: 'NutriSlim Capsules', price: 42.00, img: '/assets/images/product4.png', pills: 'Herbal' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">NutriSlim
                                Capsules</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$42.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">
                              <figure className="mb-0">
                                <img src="/assets/images/product1.png" alt="VitalEase Multivitamins" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Supplement</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'vitalease-multivitamins', name: 'VitalEase Multivitamins', price: 63.00, img: '/assets/images/product1.png', pills: 'Supplement' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">VitalEase
                                Multivitamins</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$63.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">
                              <figure className="mb-0">
                                <img src="/assets/images/product2.png" alt="DermaGlow Skin Cream" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Healthy Skin</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'dermaglow-skin-cream', name: 'DermaGlow Skin Cream', price: 84.00, img: '/assets/images/product2.png', pills: 'Healthy Skin' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">DermaGlow
                                Skin Cream</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$84.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="srv-Gynecology" className="services-tab-pane">
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">
                              <figure className="mb-0">
                                <img src="/assets/images/product3.png" alt="CalmFlu Relief Syrup" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Flu Remedy</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'calmflu-relief-syrup', name: 'CalmFlu Relief Syrup', price: 96.00, img: '/assets/images/product3.png', pills: 'Flu Remedy' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/CalmFlu%20Relief%20Syrup?price=96.00&img=%2Fassets%2Fimages%2Fproduct3.png&rating=4.8%2F5&type=Flu+Remedy">CalmFlu
                                Relief Syrup</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$96.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">
                              <figure className="mb-0">
                                <img src="/assets/images/product4.png" alt="NutriSlim Capsules" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Herbal</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'nutrislim-capsules', name: 'NutriSlim Capsules', price: 42.00, img: '/assets/images/product4.png', pills: 'Herbal' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/NutriSlim%20Capsules?price=42.00&img=%2Fassets%2Fimages%2Fproduct4.png&rating=4.8%2F5&type=Herbal">NutriSlim
                                Capsules</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$42.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">
                              <figure className="mb-0">
                                <img src="/assets/images/product1.png" alt="VitalEase Multivitamins" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Supplement</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'vitalease-multivitamins', name: 'VitalEase Multivitamins', price: 63.00, img: '/assets/images/product1.png', pills: 'Supplement' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/VitalEase%20Multivitamins?price=63.00&img=%2Fassets%2Fimages%2Fproduct1.png&rating=4.8%2F5&type=Supplement">VitalEase
                                Multivitamins</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$63.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex">
                        <div className="premium-card w-100">
                          <div className="premium-card-img">
                            <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">
                              <figure className="mb-0">
                                <img src="/assets/images/product2.png" alt="DermaGlow Skin Cream" className="img-fluid" />
                              </figure>
                            </Link>
                            <div className="premium-card-badge">Healthy Skin</div>
                            <button className="premium-card-wishlist" aria-label="Add to wishlist" onClick={() => { addToWishlist({ id: 'dermaglow-skin-cream', name: 'DermaGlow Skin Cream', price: 84.00, img: '/assets/images/product2.png', pills: 'Healthy Skin' }); addToast('Added to wishlist') }}><i className="fa-regular fa-heart" /></button>
                          </div>
                          <div className="premium-card-body">
                            <div className="premium-card-rating">
                              <i className="fa-solid fa-star" />
                              <span>4.8/5</span>
                            </div>
                            <h5 className="premium-card-title">
                              <Link to="/product/DermaGlow%20Skin%20Cream?price=84.00&img=%2Fassets%2Fimages%2Fproduct2.png&rating=4.8%2F5&type=Healthy+Skin">DermaGlow
                                Skin Cream</Link>
                            </h5>
                            <div className="premium-card-footer">
                              <span className="premium-card-price">$84.00</span>
                              <Link to="/cart" className="premium-card-cart" aria-label="Add to cart"><i className="fa-solid fa-cart-plus" /></Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div></>
    </>
  )
}

export default Services
