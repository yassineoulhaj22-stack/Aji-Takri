// Stockage local (localStorage). Pour la production : remplacer par Firebase / API.
const DB={
get(k,d){try{const v=localStorage.getItem("at_"+k);return v?JSON.parse(v):d}catch(e){return d}},
set(k,v){try{localStorage.setItem("at_"+k,JSON.stringify(v))}catch(e){}}};
async function hash(s){
if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("aji-tkri:"+s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}
return btoa("aji-tkri:"+s)}
const Auth={
me(){const id=DB.get("session",null);return DB.get("users",[]).find(u=>u.id===id)||null},
async register(d){
const users=DB.get("users",[]),email=d.email.trim().toLowerCase();
if(!d.nom.trim()||!email.includes("@"))return"e.invalid";
if(d.pass.length<6)return"e.short";
if(users.some(u=>u.email===email))return"e.exists";
const u={id:"u"+Date.now(),nom:d.nom.trim(),email,tel:d.tel.trim(),role:d.role,h:await hash(d.pass)};
users.push(u);DB.set("users",users);DB.set("session",u.id);return null},
async login(email,pass){
const u=DB.get("users",[]).find(x=>x.email===email.trim().toLowerCase());
if(!u||u.h!==await hash(pass))return"e.badlogin";
DB.set("session",u.id);return null},
logout(){DB.set("session",null)}};
const Data={
listings(){return SEED.concat(DB.get("listings",[]))},
addListing(l){const a=DB.get("listings",[]);a.push(l);DB.set("listings",a)},
favs(){const u=Auth.me();return u?DB.get("favs_"+u.id,[]):[]},
toggleFav(id){const u=Auth.me(),f=Data.favs(),i=f.indexOf(id);i<0?f.push(id):f.splice(i,1);DB.set("favs_"+u.id,f)},
reqs(){return DB.get("reqs",[])},
addReq(r){const a=Data.reqs();a.push(r);DB.set("reqs",a)},
setStatus(id,s){const a=Data.reqs();const r=a.find(x=>x.id===id);if(r)r.st=s;DB.set("reqs",a)}};
