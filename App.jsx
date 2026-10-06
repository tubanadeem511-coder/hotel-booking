import {useState} from 'react';import {Routes,Route,Link,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {Menu,X,Building2,Globe} from 'lucide-react';import {useStore} from './store.jsx';
import {Home,Results,Details,Checkout,Confirmation,Auth,Bookings,Favorites,Dashboard,Profile,Admin} from './pages.jsx';
const Guard=({children,admin})=>{const {user}=useStore();if(!user)return <Navigate to="/login"/>;if(admin&&!user.admin)return <Navigate to="/dashboard"/>;return children};
function Nav(){const {user,logout,setSearch,search}=useStore();const [o,setO]=useState(false);const nav=useNavigate();
 const go=t=>{setSearch({...search,type:t,dest:''});setO(false);nav('/search')};
 return <header className="nav"><div className="wrap row"><Link to="/" className="logo" onClick={()=>setO(false)}><Building2 size={22}/>Stayora</Link>
 <button className="burger" aria-label="Menu" onClick={()=>setO(!o)}>{o?<X/>:<Menu/>}</button>
 <nav className={o?'links open':'links'}>
  {['Hotel','Apartment','Villa','Resort'].map(t=><a key={t} onClick={()=>go(t)}>{t}s</a>)}
  <NavLink to="/search?deals=1" onClick={()=>setO(false)}>Deals</NavLink><a href="mailto:help@stayora.example">Help</a>
  <select aria-label="Currency"><option>PKR</option><option>USD</option><option>AED</option></select>
  <select aria-label="Language"><option>EN</option><option>اردو</option></select>
  {user?<><NavLink to="/dashboard" onClick={()=>setO(false)}>{user.name.split(' ')[0]}</NavLink><button className="btn ghost" onClick={()=>{logout();setO(false);nav('/')}}>Logout</button></>
  :<><Link className="btn ghost" to="/login" onClick={()=>setO(false)}>Login</Link><Link className="btn gold" to="/register" onClick={()=>setO(false)}>Register</Link></>}
 </nav></div></header>}
export default function App(){const {toast}=useStore();
 return <><Nav/><main><Routes>
  <Route path="/" element={<Home/>}/><Route path="/search" element={<Results/>}/><Route path="/hotel/:id" element={<Details/>}/>
  <Route path="/checkout" element={<Guard><Checkout/></Guard>}/><Route path="/confirmation/:id" element={<Guard><Confirmation/></Guard>}/>
  <Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth reg/>}/>
  <Route path="/dashboard" element={<Guard><Dashboard/></Guard>}/><Route path="/bookings" element={<Guard><Bookings/></Guard>}/>
  <Route path="/favorites" element={<Guard><Favorites/></Guard>}/><Route path="/profile" element={<Guard><Profile/></Guard>}/>
  <Route path="/admin" element={<Guard admin><Admin/></Guard>}/><Route path="*" element={<div className="wrap empty"><h2>Page not found</h2><Link className="btn" to="/">Back home</Link></div>}/>
 </Routes></main>
 <footer><div className="wrap">© 2026 Stayora — Find your stay. Make it memorable.</div></footer>
 {toast&&<div className={'toast '+toast.t}>{toast.m}</div>}</>}
