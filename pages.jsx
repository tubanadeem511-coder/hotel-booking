import {useState,useEffect,useMemo} from 'react';
import {Link,useNavigate,useParams,useSearchParams} from 'react-router-dom';
import {Heart,MapPin,Star,Wifi,Waves,Car,Utensils,Dumbbell,Sparkles,Coffee,Snowflake,Plane,ChevronLeft,ChevronRight,X,Users,SlidersHorizontal,Trash2,Pencil,Plus,CheckCircle,Building2,Home as HomeIcon,Search} from 'lucide-react';
import {useStore,nights} from './store.jsx';
import {hotels as seed,cities,offers,types,rooms as roomsOf,FALLBACK} from './data.js';

/* ---------- helpers ---------- */
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const money=n=>'PKR '+Math.round(n).toLocaleString();
const nowPrice=h=>h.price*(1-(h.discount||0)/100);
const todayStr=()=>new Date().toISOString().slice(0,10);
const status=b=>b.status==='Confirmed'&&b.cout<todayStr()?'Completed':b.status;
const label=r=>r>=9?'Exceptional':r>=8.5?'Excellent':r>=8?'Very good':'Good';
const FAC={'Free WiFi':Wifi,'Swimming Pool':Waves,Parking:Car,Breakfast:Coffee,Restaurant:Utensils,'Air Conditioning':Snowflake,Spa:Sparkles,Gym:Dumbbell,'Airport Shuttle':Plane};
const FACS=Object.keys(FAC),TYPES=['Hotel','Apartment','Resort','Villa','Guest House','Hostel'];
function useHotels(){
 const [list,setList]=useState(()=>ld('sy_hotels',seed));
 useEffect(()=>{const f=()=>setList(ld('sy_hotels',seed));window.addEventListener('sy_h',f);return()=>window.removeEventListener('sy_h',f)},[]);
 const save=l=>{localStorage.setItem('sy_hotels',JSON.stringify(l));window.dispatchEvent(new Event('sy_h'))};
 return [list,save];
}
const Img=({src,alt,...p})=><img src={src} alt={alt||''} loading="lazy" onError={e=>{if(e.target.src!==FALLBACK)e.target.src=FALLBACK}} {...p}/>;
const Stars=({n})=><span style={{color:'var(--gold)',whiteSpace:'nowrap'}}>{Array.from({length:n},(_,i)=><Star key={i} size={14} fill="currentColor"/>)}</span>;
const Modal=({children,onClose})=><div className="modal" onClick={onClose}><div className="card" onClick={e=>e.stopPropagation()}>{children}</div></div>;
const Field=({label:l,err,children})=><div className="field"><label>{l}</label>{children}{err&&<div className="err">{err}</div>}</div>;
const NotFound=({what})=><div className="wrap empty"><h2>{what} not found</h2><p>It may have been removed or the link is incorrect.</p><Link className="btn" to="/search">Browse stays</Link></div>;

/* ---------- hotel card ---------- */
function HotelCard({h}){
 const {favs,toggleFav,user,notify}=useStore();const nav=useNavigate();const fav=favs.includes(h.id);
 const heart=()=>{if(!user){notify('Please log in to save hotels','err');nav('/login');return}toggleFav(h.id);notify(fav?'Removed from favorites':'Saved to favorites')};
 return <div className="card hc">
  <div style={{position:'relative'}}><Img src={h.images[0]} alt={h.name}/><button className="fav" style={{position:'absolute',top:10,right:10}} aria-label="Favorite" onClick={heart}><Heart size={18} color="#d92d20" fill={fav?'#d92d20':'none'}/></button></div>
  <div className="hb"><h3><Link to={`/hotel/${h.id}`}>{h.name}</Link></h3>
   <p style={{margin:'4px 0',color:'var(--mu)'}}><MapPin size={14}/> {h.location}, {h.country} · {h.distance} km from centre</p>
   <Stars n={h.stars}/> <span className="badge">{h.type}</span>
   <div className="tags" style={{marginTop:8}}>{h.facilities.slice(0,4).map(f=><span key={f}>{f}</span>)}</div>
   <div className="ok">Free cancellation · No prepayment needed</div></div>
  <div className="pr"><div><b>{label(h.rating)}</b> <span className="rate">{h.rating}</span><div style={{fontSize:'.8rem',color:'var(--mu)'}}>{h.reviews} reviews</div></div>
   <div>{h.discount>0&&<><span className="badge">{h.discount}% OFF</span><div className="old">{money(h.price)}</div></>}<div className="pc">{money(nowPrice(h))}</div><div style={{fontSize:'.8rem',color:'var(--mu)'}}>per night</div></div>
   <div style={{display:'flex',gap:6,flexWrap:'wrap'}}><Link className="btn out" to={`/hotel/${h.id}`}>View Details</Link><Link className="btn" to={`/hotel/${h.id}#rooms`}>Reserve</Link></div></div>
 </div>;
}

/* ---------- hero search ---------- */
function HeroSearch(){
 const {search,setSearch,notify}=useStore();const nav=useNavigate();const [list]=useHotels();
 const [s,setS]=useState({...search});const [open,setOpen]=useState(false);const [g,setG]=useState(false);const [err,setErr]=useState('');
 const sugg=useMemo(()=>{const q=s.dest.trim().toLowerCase();const all=[...new Set(list.flatMap(h=>[h.city,h.country,h.name]))];const base=q?all.filter(x=>x.toLowerCase().includes(q)):cities.map(c=>c.city);return base.slice(0,6)},[s.dest,list]);
 const go=()=>{
  if(!s.dest.trim())return setErr('Please enter a destination.');
  if(!s.cin||!s.cout)return setErr('Please select check-in and check-out dates.');
  if(s.cin<todayStr())return setErr('Check-in cannot be in the past.');
  if(s.cout<=s.cin)return setErr('Check-out must be after check-in.');
  setErr('');setSearch({...s,type:undefined});nav('/search');};
 const row=(k,l,min)=><div className="row"><span>{l}</span><span><button className="s" onClick={()=>setS({...s,[k]:Math.max(min,s[k]-1)})}>−</button> <b style={{margin:'0 8px'}}>{s[k]}</b> <button className="s" onClick={()=>setS({...s,[k]:Math.min(10,s[k]+1)})}>+</button></span></div>;
 return <div><div className="panel">
  <div><label>Destination</label><input placeholder="Where are you going?" value={s.dest} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),150)} onChange={e=>{setS({...s,dest:e.target.value});setOpen(true)}} onKeyDown={e=>e.key==='Enter'&&go()}/>
   {open&&sugg.length>0&&<div className="sug">{sugg.map(x=><div key={x} onMouseDown={()=>{setS({...s,dest:x});setOpen(false)}}><MapPin size={14}/> {x}</div>)}</div>}</div>
  <div><label>Check-in</label><input type="date" min={todayStr()} value={s.cin} onChange={e=>setS({...s,cin:e.target.value})}/></div>
  <div><label>Check-out</label><input type="date" min={s.cin} value={s.cout} onChange={e=>setS({...s,cout:e.target.value})}/></div>
  <div><label>Guests</label><input readOnly style={{cursor:'pointer'}} value={`${s.adults} Adults · ${s.children} Children · ${s.rooms} Room${s.rooms>1?'s':''}`} onClick={()=>setG(!g)}/>
   {g&&<div className="gpop">{row('adults','Adults',1)}{row('children','Children',0)}{row('rooms','Rooms',1)}<button className="btn" style={{width:'100%'}} onClick={()=>setG(false)}>Done</button></div>}</div>
  <button className="btn gold" onClick={go}><Search size={16}/> Search</button></div>
  <label className="chk"><input type="checkbox" checked={s.work} onChange={e=>setS({...s,work:e.target.checked})}/> I'm travelling for work</label>
  {err&&<div className="err" style={{background:'#fff',padding:'6px 10px',borderRadius:8,display:'inline-block'}}>{err}</div>}</div>;
}

/* ---------- home ---------- */
export function Home(){
 const {search,setSearch}=useStore();const nav=useNavigate();const [list]=useHotels();
 const dest=c=>{setSearch({...search,dest:c,type:undefined});nav('/search')};
 return <>
  <section className="hero"><div className="wrap"><h1>Find your next perfect stay</h1><p>Search hotels, resorts, apartments and unique stays at the best available prices.</p><HeroSearch/></div></section>
  <section className="s wrap"><h2 className="t">Popular destinations</h2><div className="grid g3">{cities.map(c=><div key={c.city} className="card ic" onClick={()=>dest(c.city)}><Img src={c.image} alt={c.city}/><div className="ov"><h3>{c.city}</h3><span>{c.country} · {c.count} properties</span></div></div>)}</div></section>
  <section className="s wrap"><h2 className="t">Special offers</h2><div className="grid g3">{offers.map((o,i)=><div key={o.t} className="card"><Img src={o.img} alt={o.t} style={{height:170,width:'100%',objectFit:'cover'}}/><div className="pad"><span className="badge">{o.off}</span><h3 style={{margin:'8px 0 4px'}}>{o.t}</h3><p style={{color:'var(--mu)'}}>{o.d}</p><button className="btn" onClick={()=>nav('/search?offer='+i)}>Explore Deal</button></div></div>)}</div></section>
  <section className="s wrap"><h2 className="t">Explore stays</h2><div className="grid g3">{types.map(t=><div key={t.t} className="card ic" onClick={()=>{setSearch({...search,dest:'',type:t.t});nav('/search')}}><Img src={t.img} alt={t.t}/><div className="ov"><h3><Building2 size={16}/> {t.t}</h3><span>{t.d} · {list.filter(h=>h.type===t.t).length*12+8} available</span></div></div>)}</div></section></>;
}

/* ---------- results ---------- */
export function Results(){
 const {search,setSearch}=useStore();const [q]=useSearchParams();const [list]=useHotels();
 const [loading,setLoading]=useState(true);const [drawer,setDrawer]=useState(false);const [sort,setSort]=useState('rec');
 const [f,setF]=useState({min:'',max:'',types:[],stars:[],rating:0,fac:[],area:''});
 const offer=q.get('offer')!==null?offers[+q.get('offer')]:null,deals=q.get('deals');
 useEffect(()=>{setLoading(true);const t=setTimeout(()=>setLoading(false),350);return()=>clearTimeout(t)},[search,q]);
 useEffect(()=>{setF(x=>({...x,types:search.type?[search.type]:[]}))},[search.type]);
 const base=useMemo(()=>{const d=search.dest.trim().toLowerCase();
  return list.filter(h=>offer?offer.f(h):deals?h.discount>0:!d||[h.city,h.country,h.name,h.area].some(x=>x.toLowerCase().includes(d)))},[list,search.dest,offer,deals]);
 const areas=[...new Set(base.map(h=>h.area))];
 const shown=useMemo(()=>{
  let r=base.filter(h=>{const p=nowPrice(h);
   return (!f.min||p>=+f.min)&&(!f.max||p<=+f.max)&&(!f.types.length||f.types.includes(h.type))&&(!f.stars.length||f.stars.includes(h.stars))&&h.rating>=f.rating&&f.fac.every(x=>h.facilities.includes(x))&&(!f.area||h.area===f.area)});
  const S={rec:h=>-(h.rating*10+h.popularity),pa:h=>nowPrice(h),pd:h=>-nowPrice(h),rate:h=>-h.rating,dist:h=>h.distance,pop:h=>-h.popularity};
  return [...r].sort((a,b)=>S[sort](a)-S[sort](b))},[base,f,sort]);
 const tog=(k,v)=>setF(x=>({...x,[k]:x[k].includes(v)?x[k].filter(i=>i!==v):[...x[k],v]}));
 const n=nights(search.cin,search.cout);
 const title=offer?offer.t:deals?'Deals':search.dest||(search.type?search.type+'s':'All destinations');
 const Side=<aside className={'sb card'+(drawer?' show':'')}>
  <div className="row"><h3 style={{margin:0}}>Filters</h3>{drawer&&<button className="fav" onClick={()=>setDrawer(false)}><X/></button>}</div>
  <h4>Price per night (PKR)</h4><div className="row"><input type="number" placeholder="Min" value={f.min} onChange={e=>setF({...f,min:e.target.value})}/><input type="number" placeholder="Max" value={f.max} onChange={e=>setF({...f,max:e.target.value})}/></div>
  <h4>Property type</h4>{TYPES.map(t=><label className="c" key={t}><input type="checkbox" checked={f.types.includes(t)} onChange={()=>tog('types',t)}/>{t}</label>)}
  <h4>Star rating</h4>{[5,4,3,2,1].map(s=><label className="c" key={s}><input type="checkbox" checked={f.stars.includes(s)} onChange={()=>tog('stars',s)}/>{s} star{s>1&&'s'}</label>)}
  <h4>Guest rating</h4>{[0,8,7,6].map(r=><label className="c" key={r}><input type="radio" name="rt" checked={f.rating===r} onChange={()=>setF({...f,rating:r})}/>{r?r+'+':'Any'}</label>)}
  <h4>Facilities</h4>{FACS.map(x=><label className="c" key={x}><input type="checkbox" checked={f.fac.includes(x)} onChange={()=>tog('fac',x)}/>{x}</label>)}
  <h4>Location</h4><select style={{width:'100%',padding:10}} value={f.area} onChange={e=>setF({...f,area:e.target.value})}><option value="">All areas</option>{areas.map(a=><option key={a}>{a}</option>)}</select>
  <button className="btn out" style={{width:'100%',marginTop:14}} onClick={()=>setF({min:'',max:'',types:[],stars:[],rating:0,fac:[],area:''})}>Clear filters</button>
  {drawer&&<button className="btn" style={{width:'100%',marginTop:8}} onClick={()=>setDrawer(false)}>Show {shown.length} results</button>}</aside>;
 return <div className="wrap">
  <div className="bar"><div><h2 style={{margin:0}}>{title}: {shown.length} {shown.length===1?'property':'properties'} found</h2>
   <span style={{color:'var(--mu)'}}>{search.cin} → {search.cout} ({n} night{n!==1&&'s'}) · {search.adults} adults, {search.children} children · {search.rooms} room{search.rooms>1&&'s'}{search.work&&' · Work trip'}</span></div>
   <Link className="btn out" to="/" onClick={()=>window.scrollTo(0,0)}>Modify Search</Link></div>
  <div className="layout">{Side}<div>
   <div className="row" style={{marginBottom:14}}><button className="btn out fbtn" onClick={()=>setDrawer(true)}><SlidersHorizontal size={14}/> Filters</button>
    <select style={{padding:10,borderRadius:8,marginLeft:'auto'}} value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort"><option value="rec">Recommended</option><option value="pa">Price: Low to High</option><option value="pd">Price: High to Low</option><option value="rate">Guest Rating</option><option value="dist">Distance</option><option value="pop">Most Popular</option></select></div>
   {loading?[1,2,3].map(i=><div className="sk" key={i}/>):shown.length?shown.map(h=><HotelCard key={h.id} h={h}/>)
    :<div className="card empty"><h3>No properties match your search</h3><p>Try changing your filters or destination.</p><button className="btn" onClick={()=>{setF({min:'',max:'',types:[],stars:[],rating:0,fac:[],area:''});setSearch({...search,dest:'',type:undefined})}}>Reset search</button></div>}
  </div></div></div>;
}

/* ---------- details ---------- */
export function Details(){
 const {id}=useParams();const nav=useNavigate();const {search,setPending,user,favs,toggleFav,notify}=useStore();const [list]=useHotels();
 const h=list.find(x=>x.id===+id);const [i,setI]=useState(0);const [lb,setLb]=useState(false);
 useEffect(()=>{if(location.hash==='#rooms')setTimeout(()=>document.getElementById('rooms')?.scrollIntoView({behavior:'smooth'}),300)},[id]);
 if(!h)return <NotFound what="Hotel"/>;
 const imgs=h.images,prev=()=>setI((i+imgs.length-1)%imgs.length),next=()=>setI((i+1)%imgs.length);
 const select=r=>{setPending({hotelId:h.id,roomId:r.id});nav('/checkout')};
 return <div className="wrap">
  <div className="row" style={{marginTop:20,alignItems:'flex-start'}}><div><h1 style={{margin:0}}>{h.name}</h1><Stars n={h.stars}/> <span className="badge">{h.type}</span><div style={{color:'var(--mu)'}}><MapPin size={14}/> {h.location}, {h.country}</div></div>
   <div style={{textAlign:'right'}}><span className="rate">{h.rating}</span> <b>{label(h.rating)}</b><div style={{fontSize:'.8rem'}}>{h.reviews} reviews</div>
    <button className="btn out" style={{marginTop:6}} onClick={()=>{if(!user){notify('Please log in to save hotels','err');return nav('/login')}toggleFav(h.id)}}><Heart size={14} fill={favs.includes(h.id)?'#d92d20':'none'}/> {favs.includes(h.id)?'Saved':'Save'}</button></div></div>
  <div className="gal"><div style={{position:'relative'}}><Img className="main" src={imgs[i]} alt={h.name} onClick={()=>setLb(true)}/>
    <button className="fav" style={{position:'absolute',left:10,top:'45%'}} onClick={prev} aria-label="Previous"><ChevronLeft/></button><button className="fav" style={{position:'absolute',right:10,top:'45%'}} onClick={next} aria-label="Next"><ChevronRight/></button></div>
   <div className="th">{imgs.slice(0,4).map((s,k)=><Img key={k} src={s} className={k===i?'on':''} onClick={()=>setI(k)}/>)}</div></div>
  {lb&&<div className="lb" onClick={()=>setLb(false)}><button style={{top:16,right:16}} onClick={()=>setLb(false)}><X/></button><button style={{left:16}} onClick={e=>{e.stopPropagation();prev()}}><ChevronLeft/></button><Img src={imgs[i]} onClick={e=>e.stopPropagation()}/><button style={{right:16}} onClick={e=>{e.stopPropagation();next()}}><ChevronRight/></button></div>}
  <div className="card pad"><h3>About this property</h3><p>{h.description}</p>
   <h3>Facilities</h3><div className="grid g3">{h.facilities.map(x=>{const I=FAC[x]||CheckCircle;return <div key={x}><I size={16} color="var(--blue)"/> {x}</div>})}</div>
   <h3>Policies</h3><p>Check-in from 14:00 · Check-out until 12:00 · Free cancellation up to 48 hours before arrival · Children of all ages welcome.</p></div>
  <h2 className="t" id="rooms" style={{marginTop:28}}>Available rooms</h2>
  {roomsOf(h).map(r=>{const p=r.price*(1-h.discount/100);return <div className="card pad row" key={r.id} style={{marginBottom:14,flexWrap:'wrap'}}>
   <div><h3 style={{margin:0}}>{r.name}</h3><p style={{color:'var(--mu)',margin:'4px 0'}}>{r.beds} · <Users size={13}/> {r.cap} guests · {r.size} m²</p><div className="tags">{['Free WiFi',...r.perks].map(x=><span key={x}>{x}</span>)}</div></div>
   <div style={{textAlign:'right'}}>{h.discount>0&&<div className="old">{money(r.price)}</div>}<div className="pc">{money(p)} / night</div>
    <div style={{fontSize:'.8rem',color:'var(--mu)'}}>{nights(search.cin,search.cout)} nights from {search.cin}</div><button className="btn" style={{marginTop:6}} onClick={()=>select(r)}>Select Room</button></div></div>})}
 </div>;
}

/* ---------- checkout ---------- */
const calc=(h,r,n,rooms)=>{const base=r.price*n*rooms,disc=base*h.discount/100,after=base-disc,tax=after*.1,fee=after*.05;return {base,disc,tax,fee,total:after+tax+fee}};
export function Checkout(){
 const {pending,setPending,search,user,addBooking,notify}=useStore();const nav=useNavigate();const [list]=useHotels();
 const h=list.find(x=>x.id===pending?.hotelId),r=h&&roomsOf(h).find(x=>x.id===pending.roomId);
 const [form,setForm]=useState({first:user?.name.split(' ')[0]||'',last:user?.name.split(' ').slice(1).join(' ')||'',email:user?.email||'',phone:'',country:'',req:'',pay:'card',cname:'',cnum:'',exp:'',cvv:''});
 const [e,setE]=useState({});const [busy,setBusy]=useState(false);
 if(!h||!r)return <div className="wrap empty"><h2>No room selected</h2><p>Choose a hotel and room to continue your booking.</p><Link className="btn" to="/search">Find a stay</Link></div>;
 const n=nights(search.cin,search.cout);
 if(!(n>0))return <div className="wrap empty"><h2>Invalid dates</h2><p>Check-out must be after check-in.</p><Link className="btn" to="/">Modify search</Link></div>;
 const c=calc(h,r,n,search.rooms);const set=k=>ev=>setForm({...form,[k]:ev.target.value});
 const submit=async()=>{
  const x={};if(!form.first.trim())x.first='First name is required';if(!form.last.trim())x.last='Last name is required';
  if(!/^\S+@\S+\.\S+$/.test(form.email))x.email='Enter a valid email';if(!/^[+\d][\d\s-]{6,}$/.test(form.phone))x.phone='Enter a valid phone number';if(!form.country.trim())x.country='Country is required';
  if(form.pay==='card'){if(!form.cname.trim())x.cname='Cardholder name is required';if(!/^\d{16}$/.test(form.cnum.replace(/\s/g,'')))x.cnum='Card number must be 16 digits';
   if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp))x.exp='Use MM/YY';if(!/^\d{3,4}$/.test(form.cvv))x.cvv='3–4 digits'}
  setE(x);if(Object.keys(x).length)return notify('Please fix the highlighted fields','err');
  setBusy(true);
  try{await new Promise(res=>setTimeout(res,900));
   const b={id:'STY'+Date.now().toString().slice(-8),userId:user.id,hotelId:h.id,roomId:r.id,hotel:h.name,image:h.images[0],room:r.name,cin:search.cin,cout:search.cout,adults:search.adults,children:search.children,rooms:search.rooms,guest:`${form.first} ${form.last}`,email:form.email,total:Math.round(c.total),status:'Confirmed',payment:form.pay==='card'?'Paid':'Pay at property',createdAt:new Date().toISOString()};
   await addBooking(b);nav('/confirmation/'+b.id);setPending(null);notify('Booking confirmed!');
  }catch{notify('Booking failed. Please try again.','err');setBusy(false)}};
 const F=(k,l,p={})=><Field label={l} err={e[k]}><input value={form[k]} onChange={set(k)} {...p}/></Field>;
 return <div className="wrap two"><div>
  <div className="card pad"><h2 style={{marginTop:0}}>Your details</h2><div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>{F('first','First name *')}{F('last','Last name *')}{F('email','Email *',{type:'email'})}{F('phone','Phone *')}</div>{F('country','Country *')}
   <Field label="Special requests"><textarea rows={3} value={form.req} onChange={set('req')}/></Field></div>
  <div className="card pad" style={{marginTop:16}}><h2 style={{marginTop:0}}>Payment</h2>
   <label className="c" style={{display:'block'}}><input type="radio" checked={form.pay==='card'} onChange={()=>setForm({...form,pay:'card'})}/> Credit / Debit Card</label>
   <label className="c" style={{display:'block',marginBottom:12}}><input type="radio" checked={form.pay==='property'} onChange={()=>setForm({...form,pay:'property'})}/> Pay at Property</label>
   {form.pay==='card'?<>{F('cname','Cardholder name')}{F('cnum','Card number',{placeholder:'1234 5678 9012 3456',inputMode:'numeric',maxLength:19})}<div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>{F('exp','Expiry',{placeholder:'MM/YY',maxLength:5})}{F('cvv','CVV',{type:'password',maxLength:4})}</div><p style={{fontSize:'.8rem',color:'var(--mu)'}}>Demo only — no card details are stored; payment is simulated.</p></>:<p>You'll pay directly at the property on arrival.</p>}</div></div>
  <aside><div className="card pad sum" style={{position:'sticky',top:80}}><Img src={h.images[0]} alt="" style={{height:120,width:'100%',objectFit:'cover',borderRadius:10}}/><h3>{h.name}</h3><p style={{margin:0,color:'var(--mu)'}}>{r.name}</p>
   <div className="l"><span>Check-in</span><b>{search.cin}</b></div><div className="l"><span>Check-out</span><b>{search.cout}</b></div><div className="l"><span>Nights</span><b>{n}</b></div><div className="l"><span>Guests</span><b>{search.adults} adults, {search.children} children</b></div><div className="l"><span>Rooms</span><b>{search.rooms}</b></div>
   <div className="l"><span>{money(r.price)} × {n} night(s) × {search.rooms}</span><span>{money(c.base)}</span></div><div className="l"><span>Discount ({h.discount}%)</span><span>−{money(c.disc)}</span></div><div className="l"><span>Taxes (10%)</span><span>{money(c.tax)}</span></div><div className="l"><span>Service fee (5%)</span><span>{money(c.fee)}</span></div>
   <div className="l tot"><span>Total</span><span>{money(c.total)}</span></div><button className="btn gold" style={{width:'100%',marginTop:12}} disabled={busy} onClick={submit}>{busy?'Processing…':'Confirm & Pay'}</button></div></aside></div>;
}

/* ---------- confirmation ---------- */
export function Confirmation(){
 const {id}=useParams();const {bookings}=useStore();const b=bookings.find(x=>x.id===id);
 if(!b)return <NotFound what="Booking"/>;
 const dl=()=>{const t=`STAYORA BOOKING CONFIRMATION\n\nBooking ID: ${b.id}\nHotel: ${b.hotel}\nGuest: ${b.guest}\nRoom: ${b.room}\nCheck-in: ${b.cin}\nCheck-out: ${b.cout}\nGuests: ${b.adults} adults, ${b.children} children\nTotal: ${money(b.total)}\nPayment: ${b.payment}\n`;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download=`${b.id}.txt`;a.click()};
 return <div className="wrap" style={{maxWidth:640,padding:'30px 16px'}}><div className="card pad" style={{textAlign:'center'}}><CheckCircle size={52} color="#067647"/><h1>Booking Confirmed! 🎉</h1>
  <div style={{textAlign:'left'}} className="sum">{[['Booking ID',b.id],['Hotel',b.hotel],['Guest',b.guest],['Room',b.room],['Check-in',b.cin],['Check-out',b.cout],['Guests',`${b.adults} adults, ${b.children} children`],['Total amount',money(b.total)],['Payment status',b.payment]].map(([k,v])=><div className="l" key={k}><span>{k}</span><b>{v}</b></div>)}</div>
  <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap',marginTop:18}}><Link className="btn" to="/bookings">View Booking</Link><button className="btn out" onClick={dl}>Download Confirmation</button><Link className="btn out" to="/">Back to Home</Link></div></div></div>;
}

/* ---------- auth ---------- */
export function Auth({reg}){
 const {login,register,pending,notify,user}=useStore();const nav=useNavigate();
 const [f,setF]=useState({name:'',email:'',pw:''});const [err,setErr]=useState('');const [busy,setBusy]=useState(false);
 useEffect(()=>{if(user)nav(pending?'/checkout':'/dashboard')},[user]);
 const go=async ev=>{ev.preventDefault();setErr('');setBusy(true);
  try{reg?await register(f.name,f.email,f.pw):await login(f.email,f.pw);notify(reg?'Account created!':'Welcome back!')}catch(x){setErr(x.message||'Something went wrong. Please try again.')}setBusy(false)};
 return <div className="card pad auth"><h2 style={{marginTop:0}}>{reg?'Create your account':'Log in to Stayora'}</h2>
  <form onSubmit={go}>{reg&&<Field label="Full name"><input value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></Field>}
   <Field label="Email"><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></Field>
   <Field label="Password"><input type="password" value={f.pw} onChange={e=>setF({...f,pw:e.target.value})}/></Field>
   {err&&<div className="err" style={{marginBottom:10}}>{err}</div>}<button className="btn" style={{width:'100%'}} disabled={busy}>{busy?'Please wait…':reg?'Register':'Login'}</button></form>
  <p style={{textAlign:'center'}}>{reg?<>Already have an account? <Link to="/login" style={{color:'var(--blue)'}}>Login</Link></>:<>New to Stayora? <Link to="/register" style={{color:'var(--blue)'}}>Register</Link></>}</p></div>;
}

/* ---------- bookings ---------- */
export function Bookings(){
 const {bookings,cancel,notify}=useStore();const [view,setView]=useState(null);const [conf,setConf]=useState(null);
 return <div className="wrap" style={{padding:'24px 16px'}}><h1>My Bookings</h1>
  {!bookings.length?<div className="card empty"><h3>No bookings yet</h3><p>Your upcoming trips will appear here.</p><Link className="btn" to="/">Find a stay</Link></div>
  :bookings.map(b=>{const s=status(b);return <div className="card hc" key={b.id}><Img src={b.image} alt=""/><div className="hb"><h3>{b.hotel}</h3><p style={{margin:'4px 0',color:'var(--mu)'}}>#{b.id} · {b.room}<br/>{b.cin} → {b.cout} · {b.adults+b.children} guests</p><span className={'st '+s}>{s}</span></div>
   <div className="pr"><div className="pc">{money(b.total)}</div><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><button className="btn out" onClick={()=>setView(b)}>View Details</button>{s==='Confirmed'&&<button className="btn red" onClick={()=>setConf(b)}>Cancel Booking</button>}</div></div></div>})}
  {view&&<Modal onClose={()=>setView(null)}><h3 style={{marginTop:0}}>{view.hotel}</h3><div className="sum">{[['Booking ID',view.id],['Guest',view.guest],['Room',view.room],['Dates',`${view.cin} → ${view.cout}`],['Rooms',view.rooms],['Payment',view.payment],['Total',money(view.total)],['Status',status(view)]].map(([k,v])=><div className="l" key={k}><span>{k}</span><b>{v}</b></div>)}</div><button className="btn" onClick={()=>setView(null)}>Close</button></Modal>}
  {conf&&<Modal onClose={()=>setConf(null)}><h3 style={{marginTop:0}}>Cancel this booking?</h3><p>{conf.hotel} · {conf.cin} → {conf.cout}. This cannot be undone.</p><div style={{display:'flex',gap:8}}><button className="btn red" onClick={()=>{cancel(conf.id);setConf(null);notify('Booking cancelled')}}>Yes, cancel</button><button className="btn out" onClick={()=>setConf(null)}>Keep booking</button></div></Modal>}</div>;
}

/* ---------- favorites ---------- */
export function Favorites(){
 const {favs}=useStore();const [list]=useHotels();const items=list.filter(h=>favs.includes(h.id));
 return <div className="wrap" style={{padding:'24px 16px'}}><h1>My Favorites</h1>{items.length?items.map(h=><HotelCard key={h.id} h={h}/>):<div className="card empty"><Heart size={36}/><h3>No saved hotels yet</h3><p>Tap the heart on any hotel to save it here.</p><Link className="btn" to="/search">Browse stays</Link></div>}</div>;
}

/* ---------- dashboard ---------- */
export function Dashboard(){
 const {user,bookings,favs}=useStore();const up=bookings.filter(b=>status(b)==='Confirmed'),done=bookings.filter(b=>status(b)==='Completed');
 return <div className="wrap" style={{padding:'24px 16px'}}><h1>Hello, {user.name} 👋</h1>
  <div className="stat">{[['Upcoming Trips',up.length],['Completed Stays',done.length],['Saved Hotels',favs.length],['Total Bookings',bookings.length]].map(([k,v])=><div className="card" key={k}><b>{v}</b><div style={{color:'var(--mu)'}}>{k}</div></div>)}</div>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18}}><Link className="btn" to="/bookings">My Bookings</Link><Link className="btn out" to="/favorites">Favorites</Link><Link className="btn out" to="/profile">Profile</Link>{user.admin&&<Link className="btn gold" to="/admin">Admin</Link>}</div>
  <h2 className="t">Upcoming bookings</h2>{up.length?up.map(b=><div className="card pad row" key={b.id} style={{marginBottom:10}}><div><b>{b.hotel}</b><div style={{color:'var(--mu)'}}>{b.cin} → {b.cout} · #{b.id}</div></div><b>{money(b.total)}</b></div>):<div className="card empty">No upcoming trips. <Link to="/" style={{color:'var(--blue)'}}>Plan one</Link></div>}</div>;
}

/* ---------- profile ---------- */
export function Profile(){
 const {user,notify}=useStore();const [p,setP]=useState(()=>ld('sy_profile_'+user.id,{phone:'',country:''}));
 return <div className="wrap" style={{maxWidth:520,padding:'24px 16px'}}><h1>Profile</h1><div className="card pad">
  <Field label="Name"><input value={user.name} readOnly/></Field><Field label="Email"><input value={user.email} readOnly/></Field>
  <Field label="Phone"><input value={p.phone} onChange={e=>setP({...p,phone:e.target.value})}/></Field><Field label="Country"><input value={p.country} onChange={e=>setP({...p,country:e.target.value})}/></Field>
  <button className="btn" onClick={()=>{localStorage.setItem('sy_profile_'+user.id,JSON.stringify(p));notify('Profile saved')}}>Save changes</button></div></div>;
}

/* ---------- admin ---------- */
export function Admin(){
 const {allBookings,notify}=useStore();const [list,save]=useHotels();const [edit,setEdit]=useState(null);const [del,setDel]=useState(null);
 const [bk,setBk]=useState(allBookings);const users=ld('sy_users',[]);
 const setStatus=(id,s)=>{const all=ld('sy_bookings',[]).map(b=>b.id===id?{...b,status:s}:b);localStorage.setItem('sy_bookings',JSON.stringify(all));setBk(all);notify('Status updated')};
 const blank={name:'',city:'',country:'',area:'',type:'Hotel',stars:4,rating:8,reviews:0,price:10000,discount:0,distance:2,popularity:50,facilities:['Free WiFi'],images:[''],description:''};
 const submit=()=>{const x=edit;if(!x.name.trim()||!x.city.trim()||!x.country.trim()||!(+x.price>0))return notify('Name, city, country and a valid price are required','err');
  const h={...x,location:`${x.area||x.city}, ${x.city}`,price:+x.price,discount:+x.discount,stars:+x.stars,rating:+x.rating,images:x.images[0]?x.images:[FALLBACK],area:x.area||x.city};
  save(h.id?list.map(i=>i.id===h.id?h:i):[...list,{...h,id:Math.max(0,...list.map(i=>i.id))+1}]);setEdit(null);notify('Hotel saved')};
 const revenue=bk.filter(b=>b.status!=='Cancelled').reduce((s,b)=>s+b.total,0);
 return <div className="wrap" style={{padding:'24px 16px'}}><h1>Admin Dashboard</h1>
  <div className="stat">{[['Total Hotels',list.length],['Total Users',users.length],['Total Bookings',bk.length],['Revenue',money(revenue)]].map(([k,v])=><div className="card" key={k}><b style={{fontSize:'1.4rem'}}>{v}</b><div style={{color:'var(--mu)'}}>{k}</div></div>)}</div>
  <div className="row"><h2 className="t">Hotels</h2><button className="btn" onClick={()=>setEdit(blank)}><Plus size={14}/> Add hotel</button></div>
  <div className="card scroll"><table><thead><tr><th>Name</th><th>City</th><th>Type</th><th>Price</th><th></th></tr></thead><tbody>{list.map(h=><tr key={h.id}><td>{h.name}</td><td>{h.city}</td><td>{h.type}</td><td>{money(h.price)}</td><td style={{whiteSpace:'nowrap'}}><button className="fav" onClick={()=>setEdit(h)} aria-label="Edit"><Pencil size={15}/></button><button className="fav" onClick={()=>setDel(h)} aria-label="Delete"><Trash2 size={15} color="#d92d20"/></button></td></tr>)}</tbody></table></div>
  <h2 className="t" style={{marginTop:24}}>Bookings</h2><div className="card scroll"><table><thead><tr><th>ID</th><th>Hotel</th><th>Guest</th><th>Total</th><th>Status</th></tr></thead><tbody>{bk.length?bk.map(b=><tr key={b.id}><td>{b.id}</td><td>{b.hotel}</td><td>{b.guest}</td><td>{money(b.total)}</td><td><select value={b.status} onChange={e=>setStatus(b.id,e.target.value)}><option>Confirmed</option><option>Completed</option><option>Cancelled</option></select></td></tr>):<tr><td colSpan={5}>No bookings yet</td></tr>}</tbody></table></div>
  <h2 className="t" style={{marginTop:24}}>Users</h2><div className="card scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.admin?'Admin':'User'}</td></tr>)}</tbody></table></div>
  {edit&&<Modal onClose={()=>setEdit(null)}><h3 style={{marginTop:0}}>{edit.id?'Edit':'Add'} hotel</h3>
   {[['name','Name'],['city','City'],['country','Country'],['area','Area'],['price','Price / night (PKR)'],['discount','Discount %']].map(([k,l])=><Field key={k} label={l}><input value={edit[k]} onChange={e=>setEdit({...edit,[k]:e.target.value})}/></Field>)}
   <Field label="Type"><select value={edit.type} onChange={e=>setEdit({...edit,type:e.target.value})}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></Field>
   <Field label="Image URL"><input value={edit.images[0]} onChange={e=>setEdit({...edit,images:[e.target.value]})}/></Field>
   <div style={{display:'flex',gap:8}}><button className="btn" onClick={submit}>Save</button><button className="btn out" onClick={()=>setEdit(null)}>Cancel</button></div></Modal>}
  {del&&<Modal onClose={()=>setDel(null)}><h3 style={{marginTop:0}}>Delete {del.name}?</h3><p>This removes the hotel from search results.</p><div style={{display:'flex',gap:8}}><button className="btn red" onClick={()=>{save(list.filter(h=>h.id!==del.id));setDel(null);notify('Hotel deleted')}}>Delete</button><button className="btn out" onClick={()=>setDel(null)}>Cancel</button></div></Modal>}</div>;
}
