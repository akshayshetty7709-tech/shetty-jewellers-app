import React, { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag, Menu, Heart, ArrowRight, Sparkles, Instagram, X, Plus, Minus, Check } from 'lucide-react';
import { getProducts } from './api';

const fallback = [
  { _id:'p1', name:'Temple Gold Necklace Set', category:'Gold', metal:'22K Gold', price:89500, image:'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85', gender:'Women', featured:true },
  { _id:'p2', name:'Diamond Solitaire Ring', category:'Diamond', metal:'18K Gold + Diamond', price:68500, image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85', gender:'Women', featured:true },
  { _id:'p3', name:'Silver Charm Bracelet', category:'Silver', metal:'925 Silver', price:4200, image:'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85', gender:'Women' },
  { _id:'p4', name:'Gents Classic Chain', category:'Gents Chains', metal:'22K Gold', price:73500, image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85', gender:'Men', featured:true },
  { _id:'p5', name:'Platinum Band', category:'Platinum', metal:'950 Platinum', price:42500, image:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85', gender:'Men' },
  { _id:'p6', name:'Gold Kada Bracelet', category:'Bracelets', metal:'22K Gold', price:54500, image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85', gender:'Men' },
  { _id:'p7', name:'Ladies Delicate Chain', category:'Ladies Chains', metal:'18K Gold', price:26500, image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85', gender:'Women' },
  { _id:'p8', name:'Diamond Tennis Bracelet', category:'Bracelets', metal:'18K Gold + Diamond', price:112000, image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85', gender:'Women' }
];
const categories = ['All','Gold','Silver','Platinum','Diamond','Rings','Bracelets','Gents Chains','Ladies Chains'];
const money = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n || 0);

function App() {
  const [products,setProducts] = useState(fallback);
  const [category,setCategory] = useState('All');
  const [query,setQuery] = useState('');
  const [cart,setCart] = useState([]);
  const [cartOpen,setCartOpen] = useState(false);
  const [notice,setNotice] = useState('');
  const [mobileMenu,setMobileMenu] = useState(false);

  useEffect(() => { getProducts().then(data => data.length && setProducts(data)).catch(() => {}); }, []);
  const visible = useMemo(() => products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(query.toLowerCase())
  ), [products,category,query]);
  const count = cart.reduce((s,p) => s + p.qty,0);
  const total = cart.reduce((s,p) => s + p.price*p.qty,0);

  function add(p) {
    setCart(old => old.some(x => x._id===p._id)
      ? old.map(x => x._id===p._id ? {...x,qty:x.qty+1} : x)
      : [...old,{...p,qty:1}]);
    setNotice(`${p.name} added to your bag`);
    setTimeout(() => setNotice(''),2400);
  }
  function changeQty(id,delta) {
    setCart(old => old.map(p => p._id===id ? {...p,qty:p.qty+delta} : p).filter(p=>p.qty>0));
  }

  return <div>
    <div className="topline">Complimentary shipping on orders above ₹25,000 <span>✦</span> Crafted for a lifetime</div>
    <header className="header">
      <button className="icon-btn mobile-only" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Menu"><Menu/></button>
      <a className="wordmark" href="#"><span className="mark">B</span><span>BSSONS<small>J E W E L L E R S</small></span></a>
      <nav className={mobileMenu?'nav open':'nav'}>
        <a href="#collection">Collections</a><a href="#story">Our Story</a><a href="#craft">Craftsmanship</a><a href="#footer">Contact</a>
      </nav>
      <div className="actions">
        <label className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search jewellery"/></label>
        <button className="icon-btn bag" onClick={()=>setCartOpen(true)} aria-label="Shopping bag"><ShoppingBag/><b>{count}</b></button>
      </div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14}/> THE ART OF FOREVER</p>
          <h1>Jewels that<br/><em>tell your story.</em></h1>
          <p className="hero-text">Discover thoughtfully crafted pieces, made to celebrate every chapter of your life.</p>
          <a className="dark-button" href="#collection">Explore collection <ArrowRight size={16}/></a>
          <div className="hero-note"><span>✦</span> TIMELESS DESIGN · TRUSTED CRAFT</div>
        </div>
        <div className="hero-image"><img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1600&q=90" alt="Gold jewellery styled elegantly"/><div className="image-caption">THE SIGNATURE EDIT <span>01 / 04</span></div></div>
      </section>

      <section className="intro" id="story"><p className="eyebrow">BSSONS JEWELLERS</p><h2>Beauty in every detail.<br/><em>Meaning in every moment.</em></h2><p>From everyday essentials to once-in-a-lifetime treasures, find a piece that feels unmistakably yours.</p></section>

      <section className="collection" id="collection">
        <div className="section-head"><div><p className="eyebrow">FIND YOUR FOREVER</p><h2>Explore our <em>collections</em></h2></div><span className="result-count">{visible.length} PIECES</span></div>
        <div className="filters">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?'filter active':'filter'}>{c}</button>)}</div>
        {visible.length ? <div className="product-grid">{visible.map(p=><article className="product" key={p._id}>
          <div className="product-photo"><img src={p.image} alt={p.name} loading="lazy"/><button className="heart" aria-label="Add to wishlist" onClick={()=>setNotice('Wishlist feature: connect customer accounts to save favourites')}><Heart size={17}/></button>{p.featured && <span className="tag">BESTSELLER</span>}<button className="quick-add" onClick={()=>add(p)}>ADD TO BAG <Plus size={15}/></button></div>
          <div className="product-info"><div><p className="metal">{p.metal}</p><h3>{p.name}</h3></div><strong>{money(p.price)}</strong></div>
        </article>)}</div> : <div className="empty">No pieces found. Try another search or collection.</div>}
      </section>

      <section className="craft" id="craft"><div className="craft-image"><img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85" alt="Detailed jewellery craftsmanship"/></div><div className="craft-copy"><p className="eyebrow">MADE WITH INTENTION</p><h2>Crafted carefully.<br/><em>Worn forever.</em></h2><p>Every BSSONS piece is selected with an eye for detail, lasting beauty and the moments that make it yours.</p><a href="#collection" className="text-link">Discover the collection <ArrowRight size={16}/></a></div></section>

      <section className="promise"><div><span>✦</span><h3>Thoughtful design</h3><p>Pieces for every milestone.</p></div><div><span>◇</span><h3>Quality first</h3><p>Made to be treasured.</p></div><div><span>♡</span><h3>Personal service</h3><p>Here for your special moments.</p></div></section>
    </main>

    <footer id="footer"><div className="footer-main"><div><a className="wordmark footer-logo" href="#"><span className="mark">B</span><span>BSSONS<small>J E W E L L E R S</small></span></a><p>Timeless pieces. Personal stories.<br/>A little brilliance, every day.</p></div><div><h4>EXPLORE</h4><a href="#collection">All collections</a><a href="#collection">Gold & Diamond</a><a href="#collection">Men's jewellery</a></div><div><h4>HELP</h4><a href="#footer">Contact us</a><a href="#footer">Shipping & returns</a><a href="#footer">Care guide</a></div><div><h4>STAY IN TOUCH</h4><p>Follow our latest collections and stories.</p><a href="#footer" className="social"><Instagram size={18}/> Instagram</a></div></div><div className="copyright">© {new Date().getFullYear()} BSSONS JEWELLERS. DEMO STORE — ALL RIGHTS RESERVED.</div></footer>

    {notice && <div className="toast"><Check size={16}/>{notice}</div>}
    {cartOpen && <div className="scrim" onClick={()=>setCartOpen(false)}><aside className="cart-panel" onClick={e=>e.stopPropagation()}><div className="cart-head"><h2>Your bag <span>({count})</span></h2><button className="icon-btn" onClick={()=>setCartOpen(false)}><X/></button></div>
      {cart.length===0?<div className="empty-cart">Your bag is waiting for something beautiful.</div>:<><div className="cart-items">{cart.map(p=><div className="cart-item" key={p._id}><img src={p.image} alt={p.name}/><div className="cart-detail"><b>{p.name}</b><span>{money(p.price)}</span><div className="qty"><button onClick={()=>changeQty(p._id,-1)}><Minus size={13}/></button>{p.qty}<button onClick={()=>changeQty(p._id,1)}><Plus size={13}/></button></div></div></div>)}</div><div className="cart-total"><span>Subtotal</span><b>{money(total)}</b></div><button className="dark-button checkout" onClick={()=>setNotice('Demo checkout only — integrate a payment gateway before launch')}>Continue to checkout <ArrowRight size={16}/></button></>}
    </aside></div>}
  </div>;
}
export default App;
