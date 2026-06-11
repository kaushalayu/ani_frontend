import { Link } from "react-router-dom";
import { useState } from "react";
import './ThreeColumnSidebar.css';

const posts = [
  {
    id: 1,
    title: "Curabitur pulvinar euismod ante, ac sagittis ante posuere ac.",
    img: "/assets/images/standard_post_img01.jpg",
    author: "Admin",
    category: "Virtual Assistant",
    date: "Dec 20,2022",
    type: "image",
  },
  {
    id: 2,
    title: "Curabitur pulvinar euismod ante, ac sagittis ante posuere ac.",
    img: "/assets/images/standard_post_img02.jpg",
    img2: "/assets/images/standard_post_img04.jpg",
    img3: "/assets/images/standard_post_img06.jpg",
    author: "Admin",
    category: "Virtual Assistant",
    date: "Dec 20,2022",
    type: "carousel",
  },
  {
    id: 3,
    title: "Curabitur pulvinar euismod ante, ac sagittis ante posuere ac.",
    img: "/assets/images/standard_post_img03.jpg",
    author: "Admin",
    category: "Virtual Assistant",
    date: "Dec 20,2022",
    type: "image",
  },
  {
    id: 4,
    title: "Curabitur pulvinar euismod ante, ac sagittis ante posuere ac.",
    img: "/assets/images/standard_post_img05.jpg",
    author: "Admin",
    category: "Virtual Assistant",
    date: "Dec 20,2022",
    type: "audio",
  },
  {
    id: 5,
    title: "Curabitur pulvinar euismod ante, ac sagittis ante posuere ac.",
    video: "https://player.vimeo.com/video/157467640?background=1",
    author: "Admin",
    category: "Virtual Assistant",
    date: "Dec 20,2022",
    type: "vimeo",
  },
  {
    id: 6,
    title: "Curabitur pulvinar euismod ante, ac sagittis ante posuere ac.",
    video: "https://www.youtube.com/embed/dA8Smj5tZOQ",
    author: "Admin",
    category: "Virtual Assistant",
    date: "Dec 20,2022",
    type: "youtube",
  },
];

const sidePosts = [
  { title: "A true story, that never been told!", img: "/assets/images/side_post_img01.jpg", date: "6m ago", cat: "Lifestyle" },
  { title: "Beautiful nature, and rare feathers!", img: "/assets/images/side_post_img02.jpg", date: "24h ago", cat: "Lifestyle" },
  { title: "The most happiest time of the day!", img: "/assets/images/side_post_img03.jpg", date: "11h ago", cat: "Lifestyle" },
];

const categories = [
  { name: "Tips", count: 2 },
  { name: "WordPress", count: 10 },
  { name: "Hosting", count: 7 },
  { name: "PHP", count: 3 },
  { name: "Photography", count: 9 },
  { name: "Advise", count: 2 },
  { name: "Technology", count: 10 },
  { name: "AI", count: 7 },
  { name: "Products", count: 3 },
  { name: "Action", count: 9 },
];

const tags = ["Tips", "WordPress", "Hosting", "PHP", "Advise", "Technology", "AI", "Products", "Action", "Photography"];

function PostImage({ post }) {
  return (
    <div className="post-image">
      <Link to={`/blog/${post.id}`}>
        <img src={post.img} alt={post.title} />
      </Link>
    </div>
  );
}

function PostCarousel({ post }) {
  const [slide, setSlide] = useState(0);
  const images = [post.img, post.img2, post.img3];
  return (
    <div className="post-carousel">
      <div className="carousel-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
        {images.map((img, i) => (
          <div key={i} className="carousel-slide">
            <img src={img} alt={`Slide ${i + 1}`} />
          </div>
        ))}
      </div>
      <button className="carousel-arrow left" onClick={() => setSlide(s => (s === 0 ? images.length - 1 : s - 1))}><i className="fa-solid fa-chevron-left" /></button>
      <button className="carousel-arrow right" onClick={() => setSlide(s => (s === images.length - 1 ? 0 : s + 1))}><i className="fa-solid fa-chevron-right" /></button>
    </div>
  );
}

function PostMedia({ post }) {
  if (post.type === "carousel") return <PostCarousel post={post} />;
  if (post.type === "vimeo" || post.type === "youtube") {
    return (
      <div className="post-video">
        <iframe src={post.video} title={post.title} allow="autoplay; fullscreen" />
      </div>
    );
  }
  return <PostImage post={post} />;
}

function PostCard({ post }) {
  return (
    <div className="blog-card">
      <PostMedia post={post} />
      <div className="blog-card-body">
        <div className="blog-meta">
          <span><i className="fa-solid fa-user" /> By: {post.author}</span>
          <span><i className="fa-solid fa-tag" /> {post.category}</span>
        </div>
        <p>{post.title}</p>
        <div className="blog-card-footer">
          <span className="blog-date"><i className="fa-solid fa-calendar-days" /> {post.date}</span>
          <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
        </div>
      </div>
    </div>
  );
}

function ThreeColumnSidebar() {
  const [tab, setTab] = useState("popular");

  return (
    <div className="three-column-page">
      <div className="container">
        <div className="page-banner">
          <h1>Three Column Sidebar</h1>
          <p>Trusted source for prescription and over-the-counter medicines — delivered with care and confidence.</p>
          <div className="breadcrumb">
            <span className="breadcrumb-item"><Link to="/">Home</Link></span>
            <span className="breadcrumb-item active">Three Column Sidebar</span>
          </div>
        </div>

        <div className="page-layout">
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <aside className="sidebar">
            <div className="sidebar-widget search-widget">
              <form onSubmit={e => e.preventDefault()}>
                <div className="search-group">
                  <input type="text" placeholder="Search for pages..." />
                  <button type="submit"><i className="fa fa-search" /></button>
                </div>
              </form>
            </div>

            <div className="sidebar-widget tabs-widget">
              <div className="tabs-nav">
                {["popular", "featured", "recent"].map(t => (
                  <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="tabs-content">
                {sidePosts.map((p, i) => (
                  <div key={i} className="side-post">
                    <img src={p.img} alt={p.title} />
                    <div className="side-post-content">
                      <Link to="/blog/1">{p.title}</Link>
                      <span><i className="far fa-clock" /> {p.date}</span>
                      <span><i className="fa fa-tag" /> {p.cat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-widget categories-widget">
              <h4>Categories</h4>
              <ul>
                {categories.map((c, i) => (
                  <li key={i}>
                    <Link to={`/category/${c.name.toLowerCase()}`}>{c.name}</Link>
                    <span className="count">({c.count})</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget tweets-widget">
              <h4>Recent Tweets</h4>
              <ul>
                <li>
                  Rule number 1: Don't overthink it
                  <a href="https://t.co/T9Vg7b9XuI" target="_blank" rel="noopener noreferrer">https://t.co/T9Vg7b9XuI</a>
                  <small>Sep/12/2019</small>
                </li>
                <li>
                  Smart OR Stylish? How do you balance design principles with design trends?
                  <a href="https://t.co/yBb0HKiksq" target="_blank" rel="noopener noreferrer">https://t.co/yBb0HKiksq</a>
                  <small>Sep/10/2019</small>
                </li>
              </ul>
            </div>

            <div className="sidebar-widget tags-widget">
              <h4>Tags</h4>
              <div className="tags">
                {tags.map((t, i) => (
                  <Link key={i} to={`/tag/${t.toLowerCase()}`}>{t}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ThreeColumnSidebar;
