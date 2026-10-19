/* Hero motion + section halaman AdiLabs — diporting dari update2.html.
   Semua markup & CSS dirender di dalam Shadow DOM supaya class generik (.card, .btn, .sec, h2, …)
   tidak bentrok dengan CSS situs. Footer dipasang di root terpisah agar bisa diletakkan paling bawah.
   initHeroMotion(host, {footHost, onCta}) mengembalikan fungsi cleanup. */
import css from './heroMotion.css?raw';
import html from './heroMotion.html?raw';
import footHtml from './heroFooter.html?raw';

function mount(host,markup){
  const r=host.shadowRoot||host.attachShadow({mode:'open'});
  r.innerHTML='<style>'+css+'</style>'+markup;
  return r;
}

export function initHeroMotion(host,{footHost,onCta}={}){
  const root=mount(host,html),foot=footHost?mount(footHost,footHtml):null,roots=foot?[root,foot]:[root];
  let alive=true,visible=true,heroRaf=0,burstFn=null;const timers=[],cleanups=[];
  const gid=id=>{for(const r of roots){const el=r.getElementById(id);if(el)return el;}return null;};
  const qs=s=>{for(const r of roots){const el=r.querySelector(s);if(el)return el;}return null;};
  const qsa=s=>roots.flatMap(r=>[...r.querySelectorAll(s)]);
  const won=(t,f,o)=>{window.addEventListener(t,f,o);cleanups.push(()=>window.removeEventListener(t,f,o));};
  const _raf=f=>alive?requestAnimationFrame(f):0;
  const tset=(f,ms)=>{const id=setTimeout(()=>{if(alive)f();},ms);timers.push(id);return id;};

  // tautan #layanan/#proses/#karya: id-nya ada di dalam Shadow DOM, jadi gulir manual
  const onLink=e=>{
    const a=e.composedPath().find(n=>n.tagName==='A'&&(n.getAttribute('href')||'').startsWith('#'));if(!a)return;
    const id=a.getAttribute('href').slice(1);if(!id||document.getElementById(id))return;
    const el=gid(id);if(!el)return;e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'','#'+id);
  };
  document.addEventListener('click',onLink);cleanups.push(()=>document.removeEventListener('click',onLink));
  if(location.hash){const el=gid(location.hash.slice(1));if(el)tset(()=>el.scrollIntoView({block:'start'}),300);}

  /* ================= hero ================= */
  {
  const $=gid;
  const stage=$('stage'),viz=$('viz'),cam=$('cam'),fx=$('fx'),fctx=fx.getContext('2d'),flash=$('flash');
  const C=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),P=(l,a,d)=>C((l-a)/d),L=(a,b,k)=>a+(b-a)*k;
  const E={
    out3:x=>1-Math.pow(1-x,3),
    inOut:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,
    back:x=>{const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);},
    expo:x=>x>=1?1:1-Math.pow(2,-10*x),
    inExpo:x=>x<=0?0:Math.pow(2,10*x-10),
    inQuad:x=>x*x,
    elastic:x=>x<=0?0:x>=1?1:Math.pow(2,-10*x)*Math.sin((x*10-.75)*(2*Math.PI)/3)+1,
    bounce:x=>{const n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375;}
  };
  function tf(el,o){
    const x=o.x||0,y=o.y||0,z=o.z||0,s=o.s==null?1:o.s,sx=o.sx==null?s:o.sx,sy=o.sy==null?s:o.sy;
    el.style.transform='translate3d('+x.toFixed(3)+'em,'+y.toFixed(3)+'em,'+z.toFixed(3)+'em) rotateX('+(o.rx||0).toFixed(2)+'deg) rotateY('+(o.ry||0).toFixed(2)+'deg) rotate('+(o.r||0).toFixed(2)+'deg) scale('+sx.toFixed(4)+','+sy.toFixed(4)+')';
    if(o.o!=null)el.style.opacity=C(o.o).toFixed(3);
  }
  const IC={
    lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    shield:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    db:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    card:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
    chart:'<path d="M5 20V11M11 20V5M17 20v-7M3 20h18"/>',
    bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    phone:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    flow:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6H14a4 4 0 0 1 4 4v5.5"/>',
    rocket:'<path d="M12 3c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10z"/><circle cx="12" cy="10" r="1.6"/><path d="M10 19l2 2 2-2"/>',
    down:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    play:'<path d="M7 4l12 8-12 8z"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    check:'<path d="M5 12l5 5 9-10"/>'
  };
  const svg=(p,w)=>'<svg viewBox="0 0 24 24" fill="none" stroke-width="'+(w||2)+'" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';

  /* ---------- naskah ---------- */
  const SCENES=[
    {name:'Desain aplikasi',dur:5.5,word:'enak dipakai',sub:'Kami merancang tampilan dan prototipe yang bisa diuji sebelum satu baris kode ditulis.',say:'Lagi nyusun layar aplikasimu…',cap:'UI DESIGN · Layar · komponen · prototipe'},
    {name:'Database',dur:5.5,word:'datanya rapi',sub:'Struktur database disusun sejak awal supaya aplikasi tetap cepat saat penggunanya bertambah.',say:'Datanya aku rapikan dulu!',cap:'DATABASE · users · orders · logs'},
    {name:'Alur sistem',dur:5.5,word:'alurnya jelas',sub:'Setiap proses, dari login sampai notifikasi, dipetakan dan terhubung tanpa celah.',say:'Semua alur sudah nyambung.',cap:'FLOW · Login → API → Bayar → Notifikasi'},
    {name:'Rilis aplikasi',dur:6,word:'siap rilis',sub:'Aplikasi diuji lalu dirilis ke App Store, Play Store, dan web, dan kami dampingi setelahnya.',say:'Build lolos, saatnya rilis!',cap:'RELEASE v1.0.0 · App Store · Play Store · Web'},
    {name:'Mulai proyek',dur:4.5,word:'milik Anda',sub:'Ceritakan ide Anda. Tim AdiLabs mendampingi dari desain sampai rilis.',say:'Hai! Yuk mulai proyekmu.',cap:'ADILABS · Desain · Database · Flow · Rilis'}
  ];
  const TR=0.6,START=[];let acc=0;SCENES.forEach(s=>{START.push(acc);acc+=s.dur;});const TOTAL=acc;
  const SEC=[$('s1'),$('s2'),$('s3'),$('s4'),$('s5')];

  /* ---------- bangun DOM yang berulang ---------- */
  // adegan 2: tabel
  const TB=[
    {name:'users',cols:['id','nama','kota'],x:0,y:0.5,w:11.5,base:1204,row:k=>[String(1024+k),['Rina','Budi','Sari','Dewi','Andi','Maya','Fajar','Tono'][k%8],['Jakarta','Bandung','Surabaya','Medan','Bali','Depok','Bogor','Solo'][k%8]]},
    {name:'orders',cols:['id','user','total'],x:14,y:8,w:11.5,base:8310,row:k=>['#'+(5880+k*3),String(1024+(k*5)%9),(99+((k*37)%400))+'rb']},
    {name:'logs',cols:['jam','event','kode'],x:28,y:1.5,w:11.5,base:52140,row:k=>['09:'+String(41+Math.floor(k/3)).padStart(2,'0'),['login_ok','order_paid','push_sent'][k%3],'200']}
  ];
  const iso=$('iso');
  TB.forEach(t=>{
    const d=document.createElement('div');d.className='a tb';d.style.left=t.x+'em';d.style.top=t.y+'em';d.style.width=t.w+'em';
    d.innerHTML='<div class="th"><i></i><b>'+t.name+'</b><span></span></div><div class="cols">'+t.cols.map(c=>'<span>'+c+'</span>').join('')+'</div><div class="rows"><div class="ri"></div></div>';
    iso.appendChild(d);t.el=d;t.cnt=d.querySelector('.th span');t.ri=d.querySelector('.ri');t.n=-1;
  });
  function fillRows(t,n){t.n=n;let h='';for(let j=0;j<6;j++){const k=n+5-j;h+='<div class="r">'+t.row(k).map(c=>'<span>'+c+'</span>').join('')+'</div>';}
    t.ri.innerHTML=h;t.cnt.textContent=(t.base+n).toLocaleString('id-ID')+' baris';t.first=t.ri.firstChild;}
  // adegan 3: node
  const ND=[['Login','POST /login','lock'],['Auth API','JWT · 32 ms','shield'],['Database','SELECT users','db'],['Pembayaran','QRIS · VA','card'],['Dashboard','Ringkasan order','chart'],['Notifikasi','Push · email','bell']];
  const NP=[[54,15],[72,15],[90,15],[90,33],[72,33],[54,33]];
  const nodesEl=$('nodes'),NODES=[];
  ND.forEach((n,i)=>{const d=document.createElement('div');d.className='a nd';d.style.left=(NP[i][0]-6.75)+'em';d.style.top=(NP[i][1]-3.2)+'em';
    d.innerHTML='<span class="halo"></span><span class="ic">'+svg(IC[n[2]])+'</span><span><b>'+n[0]+'</b><small>'+n[1]+'</small></span><span class="ok">'+svg(IC.check,3.2)+'</span>';
    nodesEl.appendChild(d);NODES.push({el:d,ok:d.querySelector('.ok'),halo:d.querySelector('.halo')});});
  const EDG=[[60.75,15,65.25,15],[78.75,15,83.25,15],[90,18.2,90,29.8],[83.25,33,78.75,33],[65.25,33,60.75,33]];
  $('edges').innerHTML=EDG.map((e,i)=>'<line x1="'+e[0]+'" y1="'+e[1]+'" x2="'+e[2]+'" y2="'+e[3]+'" stroke="#f0c4c1" stroke-width=".22" stroke-dasharray=".6 .5"/>'+
    '<line id="eg'+i+'" x1="'+e[0]+'" y1="'+e[1]+'" x2="'+e[2]+'" y2="'+e[3]+'" stroke="#e3122b" stroke-width=".32" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>').join('');
  const EG=EDG.map((_,i)=>$('eg'+i));
  // adegan 4: badge + bintang
  const BD=[['down','Unduh di','App Store',[54,41.5]],['play','Tersedia di','Google Play',[70,45.5]],['globe','Buka di','Web App',[86,41.5]]];
  const bdgs=$('bdgs'),BDG=[];
  BD.forEach(b=>{const d=document.createElement('div');d.className='a bdg';d.style.left=(b[3][0]-6.5)+'em';d.style.top=(b[3][1]-1.95)+'em';
    d.innerHTML=svg(IC[b[0]])+'<span><small>'+b[1]+'</small><b>'+b[2]+'</b></span>';bdgs.appendChild(d);BDG.push({el:d,c:b[3]});});
  const stars=$('stars');for(let i=0;i<5;i++)stars.insertAdjacentHTML('beforeend','<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>');
  const STARS=[...stars.children];
  // adegan 5: logo + orbit
  const logo=$('logo'),LET=[];'adilabs'.split('').forEach((ch,i)=>{const s=document.createElement('span');s.textContent=ch;if(i>=3)s.className='lr';logo.appendChild(s);LET.push(s);});
  const orbs=$('orbs'),ORB=[];['phone','db','flow','rocket'].forEach(k=>{const d=document.createElement('div');d.className='a orb';d.innerHTML=svg(IC[k]);orbs.appendChild(d);ORB.push(d);});
  // adegan 1 refs
  const phone=$('phone'),BLK=[...phone.querySelectorAll('.hdr,.hero,.lines,.cA,.btn')],cardB=$('cardB'),sel=$('sel'),SW=[...phone.querySelectorAll('.sw')],typeC=$('type'),rl=$('rl'),cur=$('cur'),btn=$('btn'),rip=$('rip');
  const BLKP=BLK.map(b=>b.classList.contains('btn')?b.querySelector('.inner'):b);

  /* ---------- efek partikel (konfeti + debu) ---------- */
  let W=0,H=0,U=1,DPR=1;const CONF=[],DUST=[];
  const COLS=['#e3122b','#ff6a52','#9b0a1d','#ffb020','#ffd0c9'];
  function confetti(x,y,n,pow){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(0.4+Math.random())*pow;
    CONF.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-pow*0.6,r:Math.random()*6,vr:(Math.random()-.5)*0.4,w:4+Math.random()*5,h:6+Math.random()*7,c:COLS[i%5],life:1});}}
  function glow(x,y){flash.style.setProperty('--fx',(x/W*100)+'%');flash.style.setProperty('--fy',(y/H*100)+'%');flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');}
  const em=(x,y)=>[x*U,y*U];

  function resize(){
    const r=stage.getBoundingClientRect();W=Math.max(2,r.width);H=Math.max(2,r.height);U=W/100;DPR=Math.min(2,window.devicePixelRatio||1);
    stage.style.setProperty('--u',U+'px');fx.width=W*DPR;fx.height=H*DPR;fctx.setTransform(DPR,0,0,DPR,0,0);
    if(!DUST.length)for(let i=0;i<34;i++)DUST.push({x:Math.random(),y:Math.random(),s:0.6+Math.random()*1.8,v:0.004+Math.random()*0.01,p:Math.random()*6});
  }

  /* ---------- adegan 1 ---------- */
  function curPos(l){
    const B={x:11.45,y:23.7},S={x:B.x+9,y:B.y-14},K={x:8,y:29.65};
    if(l<2.0)return{x:26,y:2,o:0};
    if(l<2.3){const k=E.out3(P(l,2.0,0.3));return{x:L(26,S.x,k),y:L(2,S.y,k),o:k};}
    if(l<3.4){const k=E.inOut(P(l,2.3,1.1));return{x:L(S.x,B.x,k),y:L(S.y,B.y,k),o:1,press:true};}
    if(l<4.05){const k=E.inOut(P(l,3.45,0.6));return{x:L(B.x,K.x,k),y:L(B.y,K.y,k),o:1};}
    return{x:K.x,y:K.y,o:1-P(l,4.8,0.4),press:l>4.08&&l<4.25};
  }
  function r1(l,dur){
    const pe=E.back(P(l,0,0.95)),settle=E.inOut(P(l,4.5,0.9));
    let ry=L(-50,-16,pe)+Math.sin(l*1.1)*6+MX*10,rx=L(24,7,pe)+Math.cos(l*0.9)*2-MY*6;
    ry=L(ry,0,settle);rx=L(rx,0,settle);
    tf(phone,{y:L(8,0,pe)+Math.sin(l*1.6)*0.35,s:L(.5,1,pe),rx,ry,r:L(-8,0,pe),o:P(l,0,0.25)});
    BLK.forEach((b,i)=>{const k=E.back(P(l,0.35+i*0.1,0.55));tf(b,{y:(1-k)*1.8,s:L(.7,1,k),o:k*2});BLKP[i].style.setProperty('--p',E.expo(P(l,1.25+i*0.13,0.6)));});
    const kb=E.back(P(l,1.55,0.5)),drag=E.inOut(P(l,2.3,1.1)),land=P(l,3.4,0.6),lift=drag>0&&drag<1?1:0;
    const sq=land>0&&land<1?Math.sin(land*Math.PI*3)*(1-land)*0.08:0;
    tf(cardB,{x:(1-drag)*9,y:(1-drag)*-14,r:(1-drag)*12-(drag>0&&drag<1?Math.sin(drag*Math.PI)*6:0),sx:kb*(1+lift*0.06+sq),sy:kb*(1+lift*0.06-sq),o:kb*2});
    cardB.querySelector('.inner').style.setProperty('--p',E.expo(P(l,1.8,0.5)));
    cardB.style.zIndex=drag<1?5:1;
    cardB.style.filter=lift?'drop-shadow(0 1.2em 1.2em rgba(155,10,29,.35))':'none';
    sel.style.opacity=P(l,2.15,0.2)*(1-P(l,3.5,0.3));
    SW.forEach((w,i)=>{const k=E.back(P(l,0.9+i*0.12,0.55));tf(w,{x:(1-k)*5,s:k,o:k*3});});
    const kt=E.elastic(P(l,1.3,1.1));tf(typeC,{s:kt,r:(1-kt)*-18,o:P(l,1.3,0.15)});
    rl.style.transform='scaleY('+E.out3(P(l,1.9,0.5)).toFixed(3)+')';rl.style.opacity=P(l,1.9,0.1);
    const c=curPos(l);tf(cur,{x:c.x,y:c.y,s:c.press?0.85:1,o:c.o});
    const pr=P(l,4.08,0.1)-P(l,4.2,0.3);tf(btn,{s:1-pr*0.07});
    const rp=P(l,4.1,0.7);tf(rip,{s:rp*5,o:rp>0?(1-rp)*0.9:0});
    // keluar: zoom menembus tombol
    const x=P(l,dur,TR),ex=E.inExpo(x);
    SEC[0].style.transformOrigin='70% 73%';
    SEC[0].style.transform='scale('+(1+ex*2.4).toFixed(3)+')';SEC[0].style.opacity=(1-E.inQuad(x)).toFixed(3);SEC[0].style.filter=x>0?'blur('+(x*12).toFixed(1)+'px)':'none';
  }

  /* ---------- adegan 2 ---------- */
  const QTXT="SELECT nama, total FROM orders WHERE status = 'lunas';";
  const RP=[$('rp0'),$('rp1')],PK=[$('pk0'),$('pk1'),$('pk2'),$('pk3')],RL=RP.map(p=>p.getTotalLength());
  function r2(l,dur){
    const e=E.expo(P(l,0,0.7)),tilt=E.back(P(l,0.1,1.1));
    iso.style.transform='rotateX('+(L(8,50,tilt)-MY*5).toFixed(2)+'deg) rotateZ('+(L(0,-28,tilt)+MX*6+Math.sin(l*0.6)*2.5).toFixed(2)+'deg) scale('+L(.85,1.22,tilt).toFixed(3)+')';
    TB.forEach((t,i)=>{
      const k=E.bounce(P(l,0.45+i*0.2,0.85));t.el.style.transform='translateZ('+((1-k)*18+0.5).toFixed(2)+'em)';t.el.style.opacity=P(l,0.45+i*0.2,0.12);
      const st=1.5+i*0.27,n=Math.max(0,Math.floor((l-st)/0.75)),fr=l<st?1:((l-st)%0.75)/0.75;
      if(n!==t.n)fillRows(t,n);
      const ke=l<st?1:E.back(C(fr*2.2));t.ri.style.transform='translateY('+((ke-1)*2.375*0.8).toFixed(3)+'em)';
      if(t.first)t.first.style.background='rgba(255,106,82,'+(l<st?0:(0.32*(1-fr))).toFixed(3)+')';
    });
    RP.forEach((p,i)=>p.setAttribute('stroke-dashoffset',(1-E.out3(P(l,1.4+i*0.25,0.6))).toFixed(3)));
    PK.forEach((c,j)=>{const pi=j%2,on=l>2.1;const u=((l*0.55+j*0.37)%1);const pt=RP[pi].getPointAtLength(u*RL[pi]);c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y);c.setAttribute('opacity',on?(Math.sin(u*Math.PI)).toFixed(2):0);});
    // konsol query
    const kq=E.back(P(l,0.3,0.6));tf($('qc'),{y:(1-kq)*-3,s:L(.85,1,kq),o:kq*2});
    const nch=Math.floor(P(l,0.7,1.5)*QTXT.length);const qt=$('qtext');if(qt.textContent.length!==nch)qt.textContent=QTXT.slice(0,nch);
    $('qres').style.opacity=P(l,2.4,0.3);
    // sekuen: masuk dari zoom, keluar whip pan ke kiri
    const x=P(l,dur,TR),ex=E.inExpo(x);
    SEC[1].style.transform='translateX('+(-ex*85).toFixed(2)+'em) scale('+L(.75,1,e).toFixed(3)+')';
    SEC[1].style.opacity=(Math.min(e*1.5,1)*(1-x)).toFixed(3);
    const bl=Math.max((1-e)*10,x*14);SEC[1].style.filter=bl>0.2?'blur('+bl.toFixed(1)+'px)':'none';
  }

  /* ---------- adegan 3 ---------- */
  const comet=$('comet'),ROUTE=NP,SEGL=18,LAP=2.0,LSTART=2.55;
  function routeAt(u){const d=u*SEGL*5,i=Math.min(4,Math.floor(d/SEGL)),f=(d-i*SEGL)/SEGL;return{x:L(ROUTE[i][0],ROUTE[i+1][0],f),y:L(ROUTE[i][1],ROUTE[i+1][1],f)};}
  function r3(l,dur){
    const e=E.expo(P(l,0,0.75));
    NODES.forEach((n,i)=>{
      const t0=0.3+i*0.36,k=E.back(P(l,t0,0.55));
      const bob=Math.sin(l*1.6+i*1.3)*0.25;
      let pulse=0;if(l>LSTART){const c=routeAt(((l-LSTART)/LAP)%1);if(Math.abs(c.x-NP[i][0])<6.75&&Math.abs(c.y-NP[i][1])<3.2)pulse=1;}
      tf(n.el,{y:(1-k)*3+bob,s:L(.3,1,k)*(1+pulse*0.06),r:(1-k)*(i%2?10:-10),o:k*2});
      n.halo.style.opacity=pulse?0.9:0;
      const done=E.back(P(l,LSTART+LAP*i/5,0.4));n.ok.style.transform='scale('+done.toFixed(3)+')';
      if(i<5)EG[i].setAttribute('stroke-dashoffset',(1-E.out3(P(l,t0+0.22,0.35))).toFixed(3));
    });
    if(l>LSTART){const u=((l-LSTART)/LAP)%1,c=routeAt(u);let inside=false;NP.forEach(p=>{if(Math.abs(c.x-p[0])<6.75&&Math.abs(c.y-p[1])<3.2)inside=true;});
      tf(comet,{x:c.x,y:c.y,o:inside?0:1});}else comet.style.opacity=0;
    const kc=E.back(P(l,4.55,0.5));tf($('chip'),{y:(1-kc)*2,s:L(.6,1,kc),o:kc*2});
    const drift=L(2.5,-2.5,l/dur);
    SEC[2].style.transform='translateX('+((1-e)*85+drift).toFixed(2)+'em)';
    SEC[2].style.opacity=l<dur?Math.min(1,e*1.4).toFixed(3):0;
    const bl=(1-e)*14;SEC[2].style.filter=bl>0.2?'blur('+bl.toFixed(1)+'px)':'none';
  }
  // tirai lingkaran dari node Notifikasi menuju ikon aplikasi
  const wipe=$('wipe');
  function rWipe(t){
    const tb=START[3],a=t-(tb-0.4),b=t-tb;
    if(a<0||b>0.55){wipe.style.visibility='hidden';return;}
    wipe.style.visibility='visible';
    if(b<0){const k=E.inExpo(C(a/0.4));wipe.style.transform='translate('+NP[5][0]+'em,'+NP[5][1]+'em) scale('+(k*12).toFixed(3)+')';}
    else{const k=E.expo(C(b/0.55));wipe.style.transform='translate('+L(NP[5][0],70,k).toFixed(2)+'em,'+L(NP[5][1],23.5,k).toFixed(2)+'em) scale('+((1-k)*12).toFixed(3)+')';}
  }

  /* ---------- adegan 4 ---------- */
  const pipe=$('pipe'),STEPS=[...pipe.querySelectorAll('.st')],appic=$('appic'),ring=$('ring');
  function r4(l,dur){
    const kp=E.back(P(l,0.15,0.55)),out=E.inOut(P(l,2.55,0.45));
    tf(pipe,{y:(1-kp)*3-out*7,s:L(.85,1,kp)*(1-out*0.25),o:Math.min(kp*2,1)*(1-out)});
    STEPS.forEach((s,j)=>{const a=0.55+j*0.62,sp=s.querySelector('.sp'),ck=s.querySelector('.ck');
      sp.style.transform='rotate('+(l*540).toFixed(1)+'deg)';ck.style.transform='rotate('+(-l*540).toFixed(1)+'deg) scale('+E.back(P(l,a+0.55,0.35)).toFixed(3)+')';
      s.style.opacity=0.35+0.65*P(l,a-0.1,0.2);});
    $('pbar').style.transform='scaleX('+E.inOut(P(l,0.55,1.9)).toFixed(3)+')';
    const ka=E.elastic(P(l,2.7,1.2));
    tf(appic,{s:ka,r:(1-ka)*-30,y:l>3.9?Math.sin((l-3.9)*2.2)*0.5:0,o:P(l,2.7,0.1)});
    appic.style.setProperty('--sh',L(-120,120,E.inOut(P(l,3.5,0.8)))+'%');
    if(l>2.9){const rp=((l-2.9)%1.3)/1.3;tf(ring,{s:1+rp*0.7,o:(1-rp)*0.55});}else ring.style.opacity=0;
    BDG.forEach((b,j)=>{const k=E.back(P(l,3.0+j*0.13,0.65));tf(b.el,{x:(70-b.c[0])*(1-k),y:(23.5-b.c[1])*(1-k)+Math.sin(l*1.8+j)*0.25,s:k,r:(1-k)*(j-1)*25,o:k*3});});
    tf($('rate'),{y:(1-E.back(P(l,3.3,0.5)))*-2,o:P(l,3.3,0.3)});
    STARS.forEach((s,j)=>{const k=E.back(P(l,3.45+j*0.09,0.4));s.style.transform='scale('+k.toFixed(3)+') rotate('+((1-k)*-90).toFixed(1)+'deg)';});
    const dl=Math.floor(E.out3(P(l,3.5,2.0))*12480);const dle=$('dl');const dls=dl.toLocaleString('id-ID');if(dle.textContent!==dls)dle.textContent=dls;
    // keluar: putar balik seperti kartu
    const x=P(l,dur,TR),ex=E.inOut(x);
    SEC[3].style.transform='perspective(120em) rotateY('+(ex*90).toFixed(2)+'deg)';SEC[3].style.opacity=(1-x*0.6).toFixed(3);
  }

  /* ---------- adegan 5 ---------- */
  function r5(l,dur){
    const x=P(l,dur,TR);
    LET.forEach((s,j)=>{const k=E.bounce(P(l,0.15+j*0.07,0.8)),d=E.inExpo(P(l,dur+j*0.035,0.4));
      const sgn=j%2?1:-1;
      tf(s,{y:(1-k)*-28+d*40,r:(1-k)*sgn*22+d*sgn*35,sx:1+(k>0.9&&k<1?0:0),o:P(l,0.15+j*0.07,0.08)});});
    $('sws').setAttribute('stroke-dashoffset',(1-E.out3(P(l,0.9,0.6))).toFixed(3));
    tf($('tg'),{y:(1-E.out3(P(l,1.2,0.5)))*1.5,o:P(l,1.2,0.4)*(1-x)});
    ORB.forEach((o,j)=>{const k=E.back(P(l,1.0+j*0.12,0.5)),a=l*0.9+j*Math.PI/2,dz=Math.sin(a);
      tf(o,{x:70+Math.cos(a)*29,y:16+dz*7,s:k*(0.78+0.22*(dz+1)/2),o:k*(0.55+0.45*(dz+1)/2)*(1-x)});o.style.zIndex=dz>0?3:0;});
    const e=E.inOut(P(l,0,TR));
    SEC[4].style.transform='perspective(120em) rotateY('+((1-e)*-90).toFixed(2)+'deg)';SEC[4].style.opacity=(1-x).toFixed(3);
  }
  const RENDER=[r1,r2,r3,r4,r5];

  /* ---------- teks hero, maskot, notifikasi ---------- */
  const notif=$('notif'),cta=$('cta'),copyEl=$('copy'),capline=$('capline');
  const swap=$('swap'),box=$('box'),sub=$('sub'),eb=$('eb');
  function setWord(sc,k){box.style.setProperty('--sx',0);swap.classList.add('out');sub.classList.add('out');capline.classList.add('out');
    timers.push(setTimeout(()=>{if(!alive)return;swap.textContent=sc.word;sub.textContent=sc.sub;eb.textContent='0'+(k+1)+' · '+sc.name;capline.textContent=sc.cap;
      box.style.setProperty('--sx',1);swap.classList.remove('out');sub.classList.remove('out');capline.classList.remove('out');},260));}
  const mascot=$('mascot'),eyes=$('eyes'),bubble=$('bubble'),bText=$('bubbleText');let typeTimer;
  function say(txt){clearInterval(typeTimer);bubble.classList.add('out');
    timers.push(setTimeout(()=>{if(!alive)return;bubble.classList.remove('out');let i=0;bText.textContent='';typeTimer=setInterval(()=>{bText.textContent=txt.slice(0,++i);if(i>=txt.length)clearInterval(typeTimer);},38);},250));}
  won('pointermove',e=>{
    const r=mascot.querySelector('svg').getBoundingClientRect();if(r.width){const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height*0.37),d=Math.hypot(dx,dy)||1,m=Math.min(1,d/300);
      eyes.style.transform='translate('+(dx/d*5*m).toFixed(2)+'px,'+(dy/d*3.5*m).toFixed(2)+'px)';}
    const s=stage.getBoundingClientRect();TX=C((e.clientX-s.left)/s.width*2-1,-1,1);TY=C((e.clientY-s.top)/s.height*2-1,-1,1);
  });
  mascot.addEventListener('pointerdown',e=>{e.stopPropagation();mascot.classList.remove('hop');void mascot.offsetWidth;mascot.classList.add('hop');
    say(['Hehe, geli!','Aku robot AdiLabs.','Klik panggung buat konfeti!'][Math.random()*3|0]);});
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('.cta,.mascot'))return;const s=stage.getBoundingClientRect();confetti(e.clientX-s.left,e.clientY-s.top,40,7);});
  $('ctaBtn').addEventListener('click',()=>{const[x,y]=em(70,30);confetti(x,y,70,9);glow(x,y);if(onCta)timers.push(setTimeout(onCta,450));});

  /* ---------- peristiwa terjadwal ---------- */
  const EVENTS=[
    {t:START[0]+4.1,f:()=>{const[x,y]=em(70,41.2);confetti(x,y,26,5);}},
    {t:START[2]+LSTART+LAP,f:()=>{const[x,y]=em(54,33);glow(x,y);}},
    {t:START[3]+2.75,f:()=>{const[x,y]=em(70,23.5);confetti(x,y,120,11);glow(x,y);}},
    {t:START[4]+0.75,f:()=>{const[x,y]=em(70,15);confetti(x,y,60,8);}}
  ];

  /* ---------- loop utama ---------- */
  let t=0,prevT=0,last=performance.now(),cur_=-1,MX=0,MY=0,TX=0,TY=0;

  function sceneAt(tt){for(let i=SCENES.length-1;i>=0;i--)if(tt>=START[i])return i;return 0;}
  function step(now){
    const dt=Math.min(.05,(now-last)/1000);last=now;prevT=t;t=(t+dt)%TOTAL;
    MX+=(TX-MX)*0.06;MY+=(TY-MY)*0.06;
    const si=sceneAt(t),l=t-START[si];
    if(si!==cur_){cur_=si;setWord(SCENES[si],si);say(SCENES[si].say);}
    // render tiap adegan yang terlihat
    SEC.forEach((sec,i)=>{let lc=t-START[i];if(lc<0)lc+=TOTAL;const vis=lc<SCENES[i].dur+(i===2?0:TR);
      sec.style.visibility=vis?'visible':'hidden';if(vis)RENDER[i](lc,SCENES[i].dur);});
    rWipe(t);
    cam.style.transform='translate('+(MX*-0.8).toFixed(3)+'em,'+(MY*-0.5).toFixed(3)+'em)';
    // peristiwa
    EVENTS.forEach(ev=>{const hit=t>=prevT?(prevT<ev.t&&t>=ev.t):(ev.t>prevT||ev.t<=t);if(hit)ev.f();});
    // maskot & lapisan atas
    mascot.classList.toggle('wave',si===4||(si===0&&l<1.3));
    mascot.classList.toggle('joy',si===4||(si===3&&l>2.7)||(si===0&&l>4.1)||(si===2&&l>LSTART+LAP));
    notif.classList.toggle('show',si===3&&l>3.3&&l<5.7);
    cta.classList.toggle('show',si===4&&l>1.5);
    // efek gulir
    const sr=stage.getBoundingClientRect(),sc=C(-sr.top/(sr.height*0.75),0,1);
    copyEl.style.transform='translateY('+(-sc*40)+'px)';copyEl.style.opacity=String(1-sc*1.1);stage.style.setProperty('--sf',String(C(1-sc*1.3)));
    viz.style.opacity=String(1-sc*0.8);viz.style.transform=sc>0?'translateY('+(-sc*3).toFixed(2)+'em) scale('+(1+sc*0.06).toFixed(3)+')':'';
    // kanvas efek
    fctx.clearRect(0,0,W,H);
    DUST.forEach(d=>{d.y-=d.v*dt*4;if(d.y<-0.05){d.y=1.05;d.x=Math.random();}const a=0.25+0.25*Math.sin(now/900+d.p);
      fctx.fillStyle='rgba(227,18,43,'+(a*(1-sc)).toFixed(3)+')';fctx.beginPath();fctx.arc(d.x*W+Math.sin(now/1500+d.p)*12,d.y*H,d.s,0,7);fctx.fill();});
    for(let i=CONF.length-1;i>=0;i--){const c=CONF[i];c.vy+=0.28;c.vx*=0.985;c.vy*=0.985;c.x+=c.vx;c.y+=c.vy;c.r+=c.vr;c.life-=0.008;
      if(c.life<=0||c.y>H+30){CONF.splice(i,1);continue;}
      fctx.save();fctx.globalAlpha=Math.min(1,c.life*2);fctx.translate(c.x,c.y);fctx.rotate(c.r);fctx.scale(1,Math.cos(c.r*2));fctx.fillStyle=c.c;fctx.fillRect(-c.w/2,-c.h/2,c.w,c.h);fctx.restore();}
  }
  function frame(now){if(!alive)return;if(visible){try{step(now);}catch(e){console.error(e);}}else last=now;heroRaf=requestAnimationFrame(frame);}
  const ro=new ResizeObserver(()=>{if(alive)try{resize();}catch(e){console.error(e);}});ro.observe(stage);
  const vio=new IntersectionObserver(([en])=>{visible=en.isIntersecting;},{threshold:0});vio.observe(stage);
  cleanups.push(()=>{cancelAnimationFrame(heroRaf);clearInterval(typeTimer);ro.disconnect();vio.disconnect();});
  resize();
  let started=false;function boot(){if(started||!alive)return;started=true;last=performance.now();heroRaf=requestAnimationFrame(frame);}
  const fw=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
  Promise.race([fw,new Promise(r=>timers.push(setTimeout(r,800)))]).then(boot);

  }

  /* ================= section di bawah hero ================= */
(function(){
  const C=(v,a,b)=>Math.max(a,Math.min(b,v));
  // muncul saat digulir (konten tetap terbaca walau skrip gagal)
  const rv=[...qsa('.rv')];
  if('IntersectionObserver' in window){
    const vh=window.innerHeight;
    rv.forEach((el,i)=>{if(el.getBoundingClientRect().top>vh*0.9){el.classList.add('pre');el.style.transitionDelay=((i%4)*0.07)+'s';}});
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(el=>io.observe(el));
  }
  // timeline proses mengikuti gulir
  if(gid('tl')){
  const tlw=gid('tl'),steps=[...tlw.querySelectorAll('.stp')],dot=tlw.querySelector('.tl-dot'),track=tlw.querySelector('.tl-track');
  const now=gid('stepNow'),nm=gid('stepName');let last=-1;
  function tick(){
    const r=track.getBoundingClientRect(),mid=window.innerHeight*0.55;
    const p=C((mid-r.top)/r.height,0,1);
    tlw.style.setProperty('--tp',p.toFixed(4));dot.style.setProperty('--ty',(p*r.height).toFixed(1)+'px');
    let a=0;steps.forEach((s,i)=>{const on=s.getBoundingClientRect().top+22<=mid;s.classList.toggle('on',on);if(on)a=i;});
    if(a!==last){last=a;now.textContent=String(a+1).padStart(2,'0');nm.textContent=steps[a].dataset.n;}
  }
  won('scroll',tick,{passive:true});won('resize',tick);tick();
  }
  // mockup miring mengikuti kursor
  qsa('.wk').forEach(w=>{const t=w.querySelector('.tilt'),st=w.querySelector('.wstage');if(!t)return;
    st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      t.style.transform='rotateY('+(x*18).toFixed(2)+'deg) rotateX('+(-y*12).toFixed(2)+'deg) translateY(-6px)';});
    st.addEventListener('pointerleave',()=>{t.style.transform='';});});
  // formulir (contoh tampilan, belum tersambung)
  const f=gid('cf'),msg=gid('fmsg');
  if(f)f.addEventListener('submit',e=>{e.preventDefault();const n=f.nama.value.trim(),k=f.kontak.value.trim();
    if(!n||!k){msg.className='fmsg err';msg.textContent=!n?'Isi nama Anda dulu.':'Isi nomor WhatsApp atau email supaya kami bisa membalas.';(!n?f.nama:f.kontak).focus();return;}
    msg.className='fmsg ok';msg.textContent='Data sudah lengkap, '+n+'. Formulir ini masih contoh tampilan dan belum tersambung ke WhatsApp atau email.';});
  // tombol "Mulai proyek" di hero menggulir ke formulir
  const cta=gid('ctaBtn');
})();

(function(){
  const C=(v,a,b)=>Math.max(a,Math.min(b,v)),$=s=>qs(s),$$=s=>[...qsa(s)];
  const vh=()=>window.innerHeight;

  /* ---------- konfeti halaman ---------- */
  const cv=gid('pconf'),cx=cv.getContext('2d'),PS=[];let run=false;
  function fit(){const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d;cx.setTransform(d,0,0,d,0,0);}
  fit();won('resize',fit);
  const COLS=['#e3122b','#ff6a52','#9b0a1d','#ffb020','#ffd0c9','#1c0b0e'];
  function burst(x,y,n,p){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(0.4+Math.random())*p;PS.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-p*.7,r:Math.random()*6,vr:(Math.random()-.5)*.4,w:5+Math.random()*5,h:7+Math.random()*7,c:COLS[i%6],l:1});}
    if(!run){run=true;_raf(loop);}}
  function loop(){cx.clearRect(0,0,innerWidth,innerHeight);
    for(let i=PS.length-1;i>=0;i--){const q=PS[i];q.vy+=.3;q.vx*=.985;q.x+=q.vx;q.y+=q.vy;q.r+=q.vr;q.l-=.007;if(q.l<=0||q.y>innerHeight+40){PS.splice(i,1);continue;}
      cx.save();cx.globalAlpha=Math.min(1,q.l*2);cx.translate(q.x,q.y);cx.rotate(q.r);cx.scale(1,Math.cos(q.r*2));cx.fillStyle=q.c;cx.fillRect(-q.w/2,-q.h/2,q.w,q.h);cx.restore();}
    if(PS.length)_raf(loop);else run=false;}
  burstFn=burst;

  /* ---------- judul dipecah per kata ---------- */
  $$('.shead h2,.proc-intro h2,.cl h2').forEach(h=>{let i=0;
    const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(w=>{if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return;}
        const s=document.createElement('span');s.className='wd';s.style.setProperty('--i',i++);s.textContent=w;f.appendChild(s);});c.replaceWith(f);}else if(c.nodeType===1)walk(c);});};
    walk(h);});
  // wordmark bawah
  const bm=$('#bigmark');if(bm){'adilabs'.split('').forEach((ch,i)=>{const s=document.createElement('span');s.textContent=ch;s.style.setProperty('--i',i);if(i>=3)s.className='lr';bm.appendChild(s);});
    bm.classList.add('rv');}
  // daftarkan elemen baru ke pengamat muncul
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}}),{rootMargin:'0px 0px -10% 0px'});
    $$('.proc-intro,.cl,#bigmark').forEach(el=>{if(el.getBoundingClientRect().top>vh()*0.9)el.classList.add('pre');io.observe(el);});}

  /* ---------- pita berjalan, ikut kecepatan gulir ---------- */
  const mqw=gid('mqw'),wrapEl=qs('.wrap');
  function bleed(){const r=wrapEl.getBoundingClientRect();mqw.style.marginLeft=(-r.left)+'px';mqw.style.width=document.documentElement.clientWidth+'px';}
  bleed();won('resize',bleed);
  const rows=$$('.mq-track').map((t,k)=>{t.innerHTML+=t.innerHTML;return{t,x:0,dir:k?1:-1};});
  let lastY=scrollY,vel=0;
  /* ---------- proses ---------- */
  const tlw=$('#tl'),steps=$$('#tl .stp'),dot=$('#tl .tl-dot');
  steps.forEach(s=>{s.tabIndex=0;const go=()=>s.scrollIntoView({behavior:'smooth',block:'center'});s.addEventListener('click',go);s.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});});
  const prog=$('#sprog');
  function frame(){
    const y=scrollY,dy=y-lastY;lastY=y;vel+=(dy-vel)*.12;
    rows.forEach(r=>{const half=r.t.scrollWidth/2||1;r.x+=r.dir*(0.6+Math.min(14,Math.abs(vel)*0.35));r.x=((r.x%half)+half)%half;
      r.t.style.transform='translateX('+(-r.x).toFixed(1)+'px) skewX('+C(-vel*0.25,-12,12).toFixed(2)+'deg)';});
    const max=document.documentElement.scrollHeight-innerHeight;prog.style.setProperty('--p',(max>0?y/max:0).toFixed(4));
    if(dot)dot.style.setProperty('--rot',C(vel*1.2,-25,25).toFixed(1)+'deg');
    // langkah aktif (yang paling dekat dengan titik robot)
    const mid=vh()*0.55;let cur=-1;steps.forEach((s,i)=>{if(s.getBoundingClientRect().top+22<=mid)cur=i;});
    steps.forEach((s,i)=>s.classList.toggle('act',i===cur));
    _raf(frame);
  }
  _raf(frame);

  /* ---------- layanan: miring 3D, sorot, balik kartu ---------- */
  $$('.sv').forEach(sv=>{
    const f=sv.querySelector('.sv-f'),b=sv.querySelector('.sv-b');
    const setFace=flip=>{sv.classList.toggle('flip',flip);b.toggleAttribute('inert',!flip);f.toggleAttribute('inert',flip);b.setAttribute('aria-hidden',String(!flip));f.setAttribute('aria-hidden',String(flip));};
    setFace(false);
    sv.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=sv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      sv.style.setProperty('--ry',((x-.5)*14).toFixed(2)+'deg');sv.style.setProperty('--rx',((.5-y)*10).toFixed(2)+'deg');sv.style.setProperty('--ly','-8px');
      f.style.setProperty('--mx',(x*100).toFixed(1)+'%');f.style.setProperty('--my',(y*100).toFixed(1)+'%');});
    sv.addEventListener('pointerleave',()=>{['--rx','--ry','--ly'].forEach(p=>sv.style.removeProperty(p));});
    sv.querySelector('.flipb').addEventListener('click',()=>{setFace(true);sv.querySelector('.backb').focus({preventScroll:true});});
    sv.querySelector('.backb').addEventListener('click',()=>{setFace(false);sv.querySelector('.flipb').focus({preventScroll:true});});
  });

  /* ---------- contoh karya: kilau, layar bergulir, filter mulus ---------- */
  function measure(){$$('.wk').forEach(w=>{const st=w.querySelector('.wstage'),sc=w.querySelector('.scr');if(!sc)return;
    const visible=st.clientHeight-34-35-12;w.style.setProperty('--scrollY',Math.max(0,sc.scrollHeight-visible)+'px');});}
  measure();won('resize',measure);if(document.fonts)document.fonts.ready.then(measure);
  $$('.wk').forEach(w=>{const d=w.querySelector('.dev');if(!d)return;w.querySelector('.wstage').addEventListener('pointermove',e=>{const r=d.getBoundingClientRect();d.style.setProperty('--g',C((e.clientX-r.left)/r.width*100,10,90).toFixed(0)+'%');});});
  // ganti filter lama dengan versi FLIP
  const btns=$$('.wfilter button'),cards=$$('#works .wk');
  btns.forEach(b=>{const nb=b.cloneNode(true);b.replaceWith(nb);});
  const nbtns=$$('.wfilter button');
  nbtns.forEach(b=>b.addEventListener('click',()=>{const f=b.dataset.f;nbtns.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const first=new Map(cards.filter(c=>!c.hidden).map(c=>[c,c.getBoundingClientRect()]));
    cards.forEach(c=>{c.hidden=!(f==='all'||c.dataset.cat.split(' ').includes(f)||c.dataset.cat==='all');c.classList.remove('pre','fade');});
    cards.filter(c=>!c.hidden).forEach((c,i)=>{const r=c.getBoundingClientRect(),o=first.get(c);
      const kf=o?[{transform:'translate('+(o.left-r.left)+'px,'+(o.top-r.top)+'px)'},{transform:'none'}]:[{transform:'translateY(30px) scale(.9)',opacity:.1},{transform:'none',opacity:1}];
      c.animate(kf,{duration:650,delay:o?0:i*40,easing:'cubic-bezier(.2,1.2,.35,1)'});});
    measure();}));

  /* ---------- kontak: robot bereaksi ---------- */
  const cbot=$('#cbot'),bub=$('#cbub'),eyes=$('#eyes2'),box=$('.cbox'),form=$('#cf');
  if(cbot&&form){
  let bt;const say=(t,mood)=>{bub.textContent=t;bub.classList.remove('pop');void bub.offsetWidth;bub.classList.add('pop');
    cbot.classList.remove('hop','shake');void cbot.offsetWidth;if(mood)cbot.classList.add(mood);cbot.classList.toggle('joy',mood==='hop');clearTimeout(bt);bt=tset(()=>cbot.classList.remove('joy'),2200);};
  won('pointermove',e=>{const r=cbot.querySelector('svg').getBoundingClientRect();if(!r.width)return;const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height*.37),d=Math.hypot(dx,dy)||1,m=Math.min(1,d/300);
    eyes.style.transform='translate('+(dx/d*5*m).toFixed(2)+'px,'+(dy/d*3.5*m).toFixed(2)+'px)';});
  box.addEventListener('pointermove',e=>{const r=box.getBoundingClientRect();box.style.setProperty('--cx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');box.style.setProperty('--cy',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');});
  let nT;form.nama.addEventListener('input',()=>{clearTimeout(nT);nT=tset(()=>{const n=form.nama.value.trim().split(' ')[0];if(n)say('Halo, '+n+'! Senang kenalan.','hop');},500);});
  const lines={'Toko online':'Toko online? Aku suka belanja!','Reservasi':'Biar antrean nggak panjang lagi.','Sistem internal':'Kantor jadi lebih rapi nih.','Lainnya':'Wah, penasaran! Ceritakan ya.','Tugas akhir':'Semangat tugas akhirnya! Kita dampingi sampai sidang.'};
  $$('input[name="jenis"]').forEach(r=>r.addEventListener('change',()=>say(lines[r.value]||'Siap!','hop')));
  form.anggaran.addEventListener('change',()=>say('Oke, nanti kita sesuaikan rencananya.'));
  let said=false;form.ide.addEventListener('input',()=>{if(!said&&form.ide.value.length>24){said=true;say('Idenya menarik, lanjutkan!','hop');}});
  form.addEventListener('submit',()=>{tset(()=>{const ok=$('#fmsg').classList.contains('ok');
    if(ok){say('Yeay! Datanya lengkap.','hop');const r=form.querySelector('.fsub').getBoundingClientRect();burst(r.left+r.width/2,r.top,110,12);}
    else say('Eh, ada yang masih kosong.','shake');},0);});
  // tombol kirim magnetis
  const fs=form.querySelector('.fsub');
  fs.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=fs.getBoundingClientRect();fs.style.setProperty('--bx',((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px');fs.style.setProperty('--by',((e.clientY-r.top-r.height/2)*.3).toFixed(1)+'px');});
  fs.addEventListener('pointerleave',()=>{fs.style.removeProperty('--bx');fs.style.removeProperty('--by');});
  }
  // konfeti kecil saat klik tautan "Ceritakan ide Anda"
  $$('.wstage.more').forEach(a=>a.addEventListener('click',e=>{burst(e.clientX,e.clientY,40,8);}));
})();

(function(){
  const wrap=gid('igw');if(!wrap)return;
  const C=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ig=gid('ig'),path=gid('igLine'),bot=gid('igBot'),
        sts=[...ig.querySelectorAll('.ig-st')],ring=gid('igRing'),pctEl=gid('igPct'),
        nameEl=gid('igName'),hint=gid('igHint'),line=ig.querySelector('.ig-line');
  const NAMES=sts.map(s=>s.querySelector('h3').textContent);
  const L=path.getTotalLength();path.style.strokeDasharray=L+' '+L;path.style.strokeDashoffset=L;
  // posisi tiap tahap di sepanjang jalur
  const FR=sts.map(s=>{const x=+s.dataset.x,y=+s.dataset.y;let best=0,bd=1e12;
    for(let i=0;i<=600;i++){const q=path.getPointAtLength(L*i/600),d=(q.x-x)**2+(q.y-y)**2;if(d<bd){bd=d;best=i/600;}}return best;});
  let vertical=false,p=0,last=-2,burstDone=new Set();
  function mode(){const v=innerWidth<900||innerHeight<620;if(v!==vertical){vertical=v;wrap.classList.toggle('vert',v);}}
  mode();won('resize',mode);
  function vGeom(){const mk=sts.map(s=>s.querySelector('.ig-mk')),gr=ig.getBoundingClientRect();
    const c=mk.map(m=>{const r=m.getBoundingClientRect();return r.top+r.height/2-gr.top;});return{c,gr};}
  function target(){const vh=innerHeight;
    if(!vertical){const r=wrap.getBoundingClientRect(),span=r.height-vh;return span>0?C(-r.top/span*1.08,0,1):0;}
    const{c,gr}=vGeom(),y=vh*0.55-gr.top;return C((y-c[0])/(c[c.length-1]-c[0]),0,1);}
  function setOn(k){
    sts.forEach((s,i)=>{s.classList.toggle('on',i<=k);s.classList.toggle('here',i===k);});
    if(k!==last){nameEl.textContent=k<0?'Mulai':NAMES[k];nameEl.classList.remove('swp');void nameEl.offsetWidth;nameEl.classList.add('swp');
      if(k>last&&k>=0&&!burstDone.has(k)&&burstFn){burstDone.add(k);const r=sts[k].querySelector('.ig-mk').getBoundingClientRect();if(r.top>0&&r.top<innerHeight)burstFn(r.left+r.width/2,r.top+r.height/2,18,5);}
      last=k;}
  }
  function frame(){
    const tp=target();p+=(tp-p)*0.14;if(Math.abs(tp-p)<0.0005)p=tp;
    let k=-1;
    if(!vertical){
      path.style.strokeDashoffset=(L*(1-p)).toFixed(1);
      const a=path.getPointAtLength(L*p),b=path.getPointAtLength(Math.min(L,L*p+3)),c0=path.getPointAtLength(Math.max(0,L*p-3));
      const dx=b.x-c0.x,dy=b.y-c0.y,ang=Math.atan2(dy,dx)*180/Math.PI,dir=dx<-0.01?-1:1;
      const w=ig.clientWidth,h=ig.clientHeight,bob=Math.sin(performance.now()/180)*2*(Math.abs(tp-p)>0.002?1:0.3);
      const tilt=dir<0?ang-180:ang;
      bot.style.transform='translate('+(a.x/1200*w).toFixed(1)+'px,'+(a.y/660*h).toFixed(1)+'px) translate(-50%,-78%) translateY('+bob.toFixed(1)+'px) rotate('+(C(tilt,-40,40)*0.5).toFixed(1)+'deg) scaleX('+dir+')';
      FR.forEach((f,i)=>{if(p>=f-0.004)k=i;});
      hint.style.opacity=p>0.04?0:1;
    }else{
      const{c}=vGeom(),y=c[0]+(c[c.length-1]-c[0])*p;
      ig.style.setProperty('--l0',(c[0])+'px');ig.style.setProperty('--lh',(c[c.length-1]-c[0])+'px');ig.style.setProperty('--vp',p.toFixed(4));
      bot.style.transform='translate(-2px,'+(y).toFixed(1)+'px) translate(0,-50%)';
      c.forEach((cy,i)=>{if(y>=cy-2)k=i;});
    }
    setOn(k);
    ring.setAttribute('stroke-dashoffset',(1-p).toFixed(4));pctEl.textContent=Math.round(p*100)+'%';
    _raf(frame);
  }
  _raf(frame);
})();

  return()=>{alive=false;timers.forEach(clearTimeout);cleanups.forEach(f=>f());};
}
