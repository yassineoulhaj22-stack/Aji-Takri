const S={scr:"home",pf:"all",q:"",lid:null,fk:null,draft:null,err:""};
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mad=n=>Number(n).toLocaleString(LANG==="en"?"en-US":"fr-FR")+" "+(LANG==="ar"?"درهم":"MAD");
const dstr=d=>new Date(d).toLocaleDateString({fr:"fr-FR",en:"en-GB",ar:"ar-MA-u-nu-latn"}[LANG]);
const price=(l,k)=>Math.round(l.p*F[k].coef);
const ttl=l=>l.tk?t("l."+l.tk):esc(l.t);
const where=l=>esc(place(l.q))+", "+esc(place(l.v));
const TABS={home:1,favs:1,reqs:1,me:1};
function go(s){S.scr=s;S.err="";render();window.scrollTo(0,0)}
function logo(w){w=w||32;return`<svg width="${w}" height="${w}" viewBox="0 0 512 512"><rect width="512" height="512" rx="110" fill="#fff"/><polygon points="256,90 416,238 96,238" fill="#F2A93B"/><rect x="136" y="238" width="240" height="150" fill="#0B6E4F"/><path d="M226 388 V318 a30 30 0 0 1 60 0 V388 Z" fill="#fff"/></svg>`}
function lsel(){return`<select class="lg" onchange="setLang(this.value)" aria-label="Language">${[["fr","FR"],["en","EN"],["ar","AR"]].map(x=>`<option value="${x[0]}" ${LANG===x[0]?"selected":""}>${x[1]}</option>`).join("")}</select>`}
function head(back){return`<header>${back?`<button onclick="go('${back}')" aria-label="Back">${LANG==="ar"?"→":"←"}</button>`:""}${logo()}<b>AJI <i>TKRI</i></b>${lsel()}</header>`}
function tabbar(){return`<nav>${[["home","🏠"],["favs","❤️"],["reqs","📄"],["me","👤"]].map(x=>`<button class="${S.scr===x[0]?"on":""}" onclick="go('${x[0]}')"><span>${x[1]}</span>${t("tab."+x[0])}</button>`).join("")}</nav>`}
/* Auth */
function login(){return`<div class="lgbar">${lsel()}</div><div class="hero">${logo(80)}<h2 style="margin-top:10px;color:var(--g)">AJI TKRI</h2><p class="s">${t("slogan")}</p></div>
<main><label>${t("email")}</label><input id="em" type="email" autocomplete="email"><label>${t("password")}</label><input id="pw" type="password" autocomplete="current-password">
<div class="err">${S.err?t(S.err):""}</div><button class="btn g" onclick="doLogin()">${t("login_btn")}</button><div class="link" onclick="go('register')">${t("no_account")}</div></main>`}
async function doLogin(){S.err=await Auth.login($("em").value,$("pw").value)||"";S.err?render():go("home")}
function register(){return head("login")+`<main><h2>${t("create_account")}</h2><p class="s">${t("join")}</p>
<label>${t("fullname")}</label><input id="nom"><label>${t("email")}</label><input id="em" type="email"><label>${t("phone")}</label><input id="tel" type="tel" placeholder="06 00 00 00 00" dir="ltr">
<label>${t("password")}</label><input id="pw" type="password" autocomplete="new-password"><label>${t("role")}</label>
<select id="role"><option value="loc">${t("loc")}</option><option value="prop">${t("prop")}</option></select>
<div class="err">${S.err?t(S.err):""}</div><button class="btn g" onclick="doRegister()">${t("register_btn")}</button></main>`}
async function doRegister(){S.err=await Auth.register({nom:$("nom").value,email:$("em").value,tel:$("tel").value,pass:$("pw").value,role:$("role").value})||"";S.err?render():go("home")}
function logout(){Auth.logout();S.scr="login";render()}
/* Logements */
function card(l){const f=Data.favs().includes(l.id);
return`<div class="card"><button class="heart" onclick="fav('${l.id}')">${f?"❤️":"🤍"}</button><div class="pic" onclick="openL('${l.id}')">${l.e||"🏠"}</div>
<div class="ci" onclick="openL('${l.id}')"><h3>${ttl(l)}</h3><small>${where(l)} · ${l.r} ${t("rooms")} · ${l.m} m²</small>
<div>${l.a?`<span class="tag">${t("accessible")}</span>`:""}${l.pr.map(x=>`<span class="tag">${t("p."+x)}</span>`).join("")}</div><div class="price">${t("from")} ${mad(l.p)} ${t("per_month")}</div></div></div>`}
function fav(id){Data.toggleFav(id);S.scr==="home"?($("list").innerHTML=listHTML()):render()}
function openL(id){S.lid=id;S.fk=null;go("detail")}
function listHTML(){const q=S.q.toLowerCase();
const a=Data.listings().filter(l=>(S.pf==="all"||l.pr.includes(S.pf))&&(l.v+" "+l.q+" "+place(l.v)+" "+place(l.q)+" "+(l.tk?t("l."+l.tk):l.t)).toLowerCase().includes(q));
return a.length?a.map(card).join(""):`<div class="empty">${t("no_result")}</div>`}
function home(){const u=Auth.me();
return head()+`<main><h2>${t("hello",{n:esc(u.nom.split(" ")[0])})}</h2><p class="s">${t("find")}</p>
<input placeholder="${t("search")}" value="${esc(S.q)}" oninput="S.q=this.value;$('list').innerHTML=listHTML()">
<div class="chips">${Object.keys(P).map(k=>`<button class="chip ${S.pf===k?"on":""}" onclick="S.pf='${k}';render()">${t("p."+k)}</button>`).join("")}</div><div id="list">${listHTML()}</div></main>`}
function favs(){const f=Data.favs(),a=Data.listings().filter(l=>f.includes(l.id));
return head()+`<main><h2>${t("my_favs")}</h2><p class="s">${t("saved")}</p>${a.length?a.map(card).join(""):`<div class="empty">${t("no_fav")}</div>`}</main>`}
function detail(){const l=Data.listings().find(x=>x.id===S.lid);
const forms=["flex","fam","cou"].concat(l.a?["ser"]:[]).filter(k=>S.pf==="all"||P[S.pf].includes(k));
if(!S.fk||!forms.includes(S.fk))S.fk=forms[0]||"flex";
return head("home")+`<main><div class="card"><div class="pic" style="cursor:default">${l.e||"🏠"}</div><div class="ci" style="cursor:default"><h3>${ttl(l)}</h3><small>${where(l)} · ${l.r} ${t("rooms")} · ${l.m} m²</small></div></div>
<h2>${t("choose")}</h2><p class="s">${t("auto")}</p>
${forms.map(k=>`<div class="opt ${S.fk===k?"on":""}" onclick="S.fk='${k}';render()"><b><span style="color:var(--tx)">${F[k].ico} ${t("f."+k)}</span><span style="color:var(--g)">${mad(price(l,k))}</span></b><span>${t("fd."+k)}</span></div>`).join("")}
${Auth.me().role==="prop"?`<div class="warn">${t("need_loc")}</div>`:`<button class="btn" onclick="go('form')">${t("cont")}</button>`}</main>`}
function form(){const u=Auth.me(),k=S.fk,d=S.draft||{};
return head("detail")+`<main><h2>${t("info")}</h2><p class="s">${t("formula")} ${t("f."+k)}</p>
<label>${t("fullname")}</label><input id="nom" value="${esc(d.nom||u.nom)}"><label>${t("cin")}</label><input id="cin" dir="ltr" value="${esc(d.cin||"")}">
<label>${t("entry_date")}</label><input id="date" type="date" value="${d.date||new Date().toISOString().slice(0,10)}">
${F[k].min===3?`<label>${t("duration")}</label><select id="mois">${[3,4,5,6].map(m=>`<option value="${m}" ${d.mois==m?"selected":""}>${t("months",{n:m})}</option>`).join("")}</select>`:""}
<div class="err">${S.err?t(S.err):""}</div><button class="btn g" onclick="toContract()">${t("gen")}</button></main>`}
function toContract(){const nom=$("nom").value.trim(),cin=$("cin").value.trim();
if(!nom||!cin){S.err="e.fields";return render()}
S.draft={nom,cin,date:$("date").value,mois:$("mois")?+$("mois").value:1};go("contract")}
function contract(){const l=Data.listings().find(x=>x.id===S.lid),f=F[S.fk],d=S.draft;
const dur=f.min===3?t("dur_fixed",{n:d.mois,d:dstr(d.date)}):t("dur_renew",{d:dstr(d.date)});
return head("form")+`<main><h2>${t("your_contract")}</h2><p class="s">${t("preview")}</p>
<div class="doc"><h3>${t("c_title",{f:t("f."+S.fk).toUpperCase()})}</h3>
<p>${t("c_between",{id:esc(l.id)})}</p><p>${t("c_and",{n:esc(d.nom),c:esc(d.cin)})}</p>
<p>${t("c1",{t:ttl(l),q:esc(place(l.q)),v:esc(place(l.v)),m:l.m})}</p><p>${t("c2",{d:dur})}</p><p>${t("c3",{p:mad(price(l,S.fk))})}</p><p>${t("c4",{n:f.pre})}</p><p>${t("c5")}</p><p>${t("c6")}</p><p>${t("c7")}</p>
<p style="margin-top:14px">${t("made",{d:dstr(new Date())})}</p></div>
<div class="warn">${t("disc")}</div><button class="btn g" onclick="sendReq()">${t("confirm")}</button><button class="btn" onclick="window.print()">${t("print")}</button></main>`}
function sendReq(){const l=Data.listings().find(x=>x.id===S.lid),u=Auth.me(),d=S.draft;
Data.addReq({id:"r"+Date.now(),lid:l.id,tk:l.tk||"",lt:l.t||"",q:l.q,o:l.o,tid:u.id,tn:d.nom,tel:u.tel,fk:S.fk,date:d.date,mois:d.mois,prix:price(l,S.fk),st:0});S.draft=null;go("reqs")}
/* Demandes */
function reqs(){const u=Auth.me(),prop=u.role==="prop";
const a=Data.reqs().filter(r=>prop?r.o===u.id:r.tid===u.id).reverse();
const item=r=>`<div class="card"><div class="ci" style="cursor:default"><h3>${r.tk?t("l."+r.tk):esc(r.lt)} – ${esc(place(r.q))}</h3><small>${prop?esc(r.tn)+" · "+esc(r.tel||"")+" · ":""}${t("f."+r.fk)}</small>
<div class="price">${mad(r.prix)} ${t("per_month")} · ${t("entry")} ${dstr(r.date)}</div><span class="badge st${r.st}" style="margin-top:8px">${t("s"+r.st)}</span>
${prop&&r.st===0?`<div><button class="btn g sm" onclick="setSt('${r.id}',1)">${t("accept")}</button><button class="btn r sm" onclick="setSt('${r.id}',2)">${t("refuse")}</button></div>`:""}</div></div>`;
return head()+`<main><h2>${prop?t("reqs_in"):t("my_reqs")}</h2><p class="s">${prop?t("on_ads"):t("track")}</p>${a.length?a.map(item).join(""):`<div class="empty">${t("no_req")}</div>`}</main>`}
function setSt(id,s){Data.setStatus(id,s);render()}
/* Profil + annonce */
function me(){const u=Auth.me(),prop=u.role==="prop",n=DB.get("listings",[]).filter(l=>l.o===u.id).length;
return head()+`<main><h2>${esc(u.nom)}</h2><p class="s">${esc(u.email)} · <span dir="ltr">${esc(u.tel||"")}</span><br>${prop?t("acct_prop"):t("acct_loc")}</p>
${prop?`<p class="s">${t("published",{n})}</p><button class="btn g" onclick="go('add')">${t("publish_ad")}</button>`:""}<button class="btn r" onclick="logout()">${t("logout")}</button></main>`}
function add(){return head("me")+`<main><h2>${t("new_ad")}</h2><p class="s">${t("ad_sub")}</p>
<label>${t("title")}</label><input id="t" placeholder="${t("title_ph")}"><label>${t("city")}</label><input id="v"><label>${t("district")}</label><input id="q">
<label>${t("rent")}</label><input id="p" type="number" min="0"><label>${t("beds")}</label><input id="r" type="number" min="1" value="1"><label>${t("area")}</label><input id="m" type="number" min="1">
<label>${t("for_who")}</label><div>${Object.keys(P).filter(k=>k!=="all").map(k=>`<label class="chk"><input type="checkbox" value="${k}">${t("p."+k)}</label>`).join("")}</div>
<label class="chk" style="margin-top:12px"><input id="a" type="checkbox">${t("acc_label")}</label>
<div class="err">${S.err?t(S.err):""}</div><button class="btn g" onclick="saveL()">${t("publish")}</button></main>`}
function saveL(){const pr=Array.from(document.querySelectorAll("input[type=checkbox][value]:checked")).map(x=>x.value);
const l={id:"l"+Date.now(),o:Auth.me().id,t:$("t").value.trim(),v:$("v").value.trim(),q:$("q").value.trim(),p:+$("p").value,r:+$("r").value,m:+$("m").value,a:$("a").checked,pr,e:"🏠"};
if(!l.t||!l.v||!l.p||!l.m||!pr.length){S.err="e.ad";return render()}
Data.addListing(l);go("me")}
/* Rendu */
function render(){if(!Auth.me()&&S.scr!=="login"&&S.scr!=="register")S.scr="login";
const V={login,register,home,favs,detail,form,contract,reqs,me,add};
$("app").innerHTML=V[S.scr]()+(TABS[S.scr]?tabbar():"")}
render();
