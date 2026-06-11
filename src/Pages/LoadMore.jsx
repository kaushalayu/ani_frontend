import { Link } from "react-router-dom";

function LoadMore() {
  return (
    <>
      <div className="home_banner_outer float-left w-100 main-box position-relative">
        <div className="padding-rl float-left w-100">
          <section className="float-left w-100 sub-banner-con position-relative d-flex align-items-center justify-content-center br-30">
            <div className="main-container">
              <div className="col-xl-12 col-lg-12 mr-auto ml-auto">
                <div className="sub-banner-inner-con text-center">
                  <h1>Load More</h1>
                  <p>Trusted source for prescription and over-the-counter medicines — delivered <br />with care and confidence.</p>
                  <div className="breadcrumb-con d-inline-block">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                      <li className="breadcrumb-item active">Load More</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="blog-posts blogpage-section loadblog-section float-left w-100">
        <div className="container">
          <div className="row">
            <div id="blog" className="col-xl-12">
              <div className="row">
                <div className="col-xl-4 col-lg-4">
                  <div className="blog-box load-blog float-left w-100 post-item mb-4 hide-blog">
                    <div className="post-item-wrap position-relative">
                      <div className="post-image">
                        <Link to="/single-blog">
                          <img alt="image" src="/assets/images/standard_post_img01.jpg" loading="lazy" />
                        </Link>
                      </div>
                      <div className="lower-portion">
                        <div className="span-i-con">
                          <i className="fas fa-user"></i>
                          <span className="text-size-14 text-mr">By : Admin</span>
                          <i className="fas fa-tag"></i>
                          <span className="text-size-14">Virtual Assistant</span>
                        </div>
                        <Link to="/single-blog">
                          <h5>Why You Need Virtual Assistant for Your Company</h5>
                        </Link>
                      </div>
                      <div className="button-portion loadone_twocol">
                        <div className="date">
                          <i className="fas fa-calendar-alt"></i>
                          <span className="mb-0 text-size-14">Dec 20,2022</span>
                        </div>
                        <div className="button">
                          <Link className="mb-0 read_more text-decoration-none" to="/single-blog">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4">
                  <div className="blog-box load-blog float-left w-100 post-item mb-4 hide-blog">
                    <div className="post-item-wrap position-relative">
                      <div id="blogslider" className="carousel slide" data-ride="carousel">
                        <div className="carousel-inner">
                          <div className="carousel-item">
                            <img src="/assets/images/standard_post_img02.jpg" alt="image" loading="lazy" />
                          </div>
                          <div className="carousel-item">
                            <img src="/assets/images/standard_post_img04.jpg" alt="image" loading="lazy" />
                          </div>
                          <div className="carousel-item active">
                            <img src="/assets/images/standard_post_img06.jpg" alt="image" loading="lazy" />
                          </div>
                        </div>
                        <a className="carousel-control-prev" href="#blogslider" data-slide="prev">
                          <span className="carousel-control-prev-icon"></span>
                        </a>
                        <a className="carousel-control-next" href="#blogslider" data-slide="next">
                          <span className="carousel-control-next-icon"></span>
                        </a>
                      </div>
                      <div className="lower-portion">
                        <div className="span-i-con">
                          <i className="fas fa-user"></i>
                          <span className="text-size-14 text-mr">By : Admin</span>
                          <i className="fas fa-tag"></i>
                          <span className="text-size-14">Virtual Assistant</span>
                        </div>
                        <Link to="/single-blog">
                          <h5>Why You Need Virtual Assistant for Your Company</h5>
                        </Link>
                      </div>
                      <div className="button-portion loadone_twocol">
                        <div className="date">
                          <i className="fas fa-calendar-alt"></i>
                          <span className="mb-0 text-size-14">Dec 20,2022</span>
                        </div>
                        <div className="button">
                          <Link className="mb-0 read_more text-decoration-none" to="/single-blog">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4">
                  <div className="blog-box load-blog float-left w-100 post-item mb-4 hide-blog">
                    <div className="post-item-wrap position-relative">
                      <div className="post-image">
                        <Link to="/single-blog"><img alt="image" src="/assets/images/standard_post_img03.jpg" loading="lazy" /></Link>
                      </div>
                      <div className="lower-portion">
                        <div className="span-i-con">
                          <i className="fas fa-user"></i>
                          <span className="text-size-14 text-mr">By : Admin</span>
                          <i className="fas fa-tag"></i>
                          <span className="text-size-14">Virtual Assistant</span>
                        </div>
                        <Link to="/single-blog">
                          <h5>Why You Need Virtual Assistant for Your Company</h5>
                        </Link>
                      </div>
                      <div className="button-portion loadone_twocol">
                        <div className="date">
                          <i className="fas fa-calendar-alt"></i>
                          <span className="mb-0 text-size-14">Dec 20,2022</span>
                        </div>
                        <div className="button">
                          <Link className="mb-0 read_more text-decoration-none" to="/single-blog">Read More</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row hide-blog hide-blog-outer-wrap">
                    <div className="col-xl-4 col-lg-4">
                      <div className="blog-box load-blog hide-blog">
                        <div className="post-item-wrap position-relative">
                          <div className="post-audio position-relative">
                            <Link to="/single-blog"><img src="/assets/images/blog-image4.jpg" alt="image" className="img-fluid" loading="lazy" /></Link>
                          </div>
                          <div className="lower-portion">
                            <div className="span-i-con">
                              <i className="fas fa-user"></i>
                              <span className="text-size-14 text-mr">By : Admin</span>
                              <i className="fas fa-tag"></i>
                              <span className="text-size-14">Virtual Assistant</span>
                            </div>
                            <Link to="/single-blog">
                              <h5>Why You Need Virtual Assistant for Your Company</h5>
                            </Link>
                          </div>
                          <div className="button-portion">
                            <div className="date">
                              <i className="fas fa-calendar-alt"></i>
                              <span className="mb-0 text-size-14">Dec 20,2022</span>
                            </div>
                            <div className="button">
                              <Link className="mb-0 read_more text-decoration-none" to="/single-blog">Read More</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4">
                      <div className="blog-box load-blog hide-blog">
                        <div className="post-item-wrap position-relative">
                          <div className="post-video">
                            <div className="embed-container"><iframe src="https://player.vimeo.com/video/157467640?background=1" title="vimeo"></iframe></div>
                          </div>
                          <div className="lower-portion">
                            <div className="span-i-con">
                              <i className="fas fa-user"></i>
                              <span className="text-size-14 text-mr">By : Admin</span>
                              <i className="fas fa-tag"></i>
                              <span className="text-size-14">Virtual Assistant</span>
                            </div>
                            <Link to="/single-blog">
                              <h5>Why You Need Virtual Assistant for Your Company</h5>
                            </Link>
                          </div>
                          <div className="button-portion">
                            <div className="date">
                              <i className="fas fa-calendar-alt"></i>
                              <span className="mb-0 text-size-14">Dec 20,2022</span>
                            </div>
                            <div className="button">
                              <Link className="mb-0 read_more text-decoration-none" to="/single-blog">Read More</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4">
                      <div className="blog-box hide-blog">
                        <div className="post-item-wrap position-relative">
                          <div className="post-video">
                            <div className="fluid-width-video-wrapper">
                              <iframe width="560" height="376" src="https://www.youtube.com/embed/dA8Smj5tZOQ" title="youtube"></iframe>
                            </div>
                          </div>
                          <div className="infinite-blog float-left">
                            <div className="lower-portion">
                              <div className="span-i-con">
                                <i className="fas fa-user"></i>
                                <span className="text-size-14 text-mr">By : Admin</span>
                                <i className="fas fa-tag"></i>
                                <span className="text-size-14">Virtual Assistant</span>
                              </div>
                              <Link to="/single-blog">
                                <h5>Why You Need Virtual Assistant for Your Company</h5>
                              </Link>
                            </div>
                            <div className="button-portion">
                              <div className="date">
                                <i className="fas fa-calendar-alt"></i>
                                <span className="mb-0 text-size-14">Dec 20,2022</span>
                              </div>
                              <div className="button">
                                <Link className="mb-0 read_more text-decoration-none" to="/single-blog">Read More</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="load-more d-inline-block m-auto align-top">
                  <a className="default-btn hover-effect" href="#" id="loadMore">Load More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadMore;
