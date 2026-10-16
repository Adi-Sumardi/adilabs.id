/* Hero motion AdiLabs — partikel 3D di kanvas, 5 adegan (desain → database → alur → rilis → logo).
   Diporting dari motion.html. initHeroMotion(root) mengembalikan fungsi cleanup. */
export function initHeroMotion(root,{onCta}={}){
  let alive=true,visible=true,raf=0;const timers=[];
  const $=sel=>root.querySelector(sel);
  const cv=$('.m-canvas'),ctx=cv.getContext('2d'),stage=$('.m-stage'),flash=$('.m-flash');
  const notif=$('.m-notif'),cta=$('.m-cta'),copyEl=$('.m-copy');
  const SCENES=[
    {name:'Desain aplikasi',dur:5.5,word:'enak dipakai',sub:'Kami merancang tampilan dan prototipe yang bisa diuji sebelum satu baris kode ditulis.',say:'Lagi nyusun layar aplikasimu…',cap:['UI DESIGN','Layar · komponen · prototipe']},
    {name:'Database',dur:5,word:'datanya rapi',sub:'Struktur database disusun sejak awal supaya aplikasi tetap cepat saat penggunanya bertambah.',say:'Datanya aku rapikan dulu!',cap:['DATABASE','users · orders · logs']},
    {name:'Alur sistem',dur:5.5,word:'alurnya jelas',sub:'Setiap proses, dari login sampai notifikasi, dipetakan dan terhubung tanpa celah.',say:'Semua alur sudah nyambung.',cap:['FLOW','Login → API → Data → Notifikasi']},
    {name:'Rilis aplikasi',dur:6,word:'siap rilis',sub:'Aplikasi diuji lalu dirilis ke App Store, Play Store, dan web, dan kami dampingi setelahnya.',say:'Siap-siap… meluncur!',cap:['RELEASE v1.0.0','App Store · Play Store · Web']},
    {name:'Mulai proyek',dur:4.5,word:'milik Anda',sub:'Ceritakan ide Anda. Tim AdiLabs mendampingi dari desain sampai rilis.',say:'Hai! Yuk mulai proyekmu.',cap:['ADILABS','Desain · Database · Flow · Rilis']}
  ];
  const TOTAL=SCENES.reduce((a,s)=>a+s.dur,0);
  let W=0,H=0,S=0,DPR=1,N=0,P=[],phone=[],db=[],flow=[],rocket=[],word=[],nodes=[],edges=[];
  let t=0,last=performance.now(),playing=true,mouse={x:-9999,y:-9999},waves=[],scroll=0;
  let PH={},nozzle,wordPos,prevLocal=0,prevScene=-1;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=x=>{x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;},lerp=(a,b,k)=>a+(b-a)*k;

  function off(){const o=document.createElement('canvas');o.width=W;o.height=H;const x=o.getContext('2d');x.fillStyle='#000';x.strokeStyle='#000';x.lineJoin='round';x.lineCap='round';return x;}
  function pix(ox,count,stepDiv){
    const d=ox.getImageData(0,0,W,H).data,pts=[],step=Math.max(2,Math.round(Math.min(W,H)/(stepDiv||220)));
    for(let y=0;y<H;y+=step)for(let x=0;x<W;x+=step)if(d[(y*W+x)*4+3]>128)pts.push({x,y});
    for(let i=pts.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[pts[i],pts[j]]=[pts[j],pts[i]];}
    const out=[];for(let i=0;i<count;i++)out.push(pts.length?pts[i%pts.length]:{x:W/2,y:H/2});return out;
  }
  function rr(x,a,b,w,h,r){x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h);}

  /* ---------- bentuk ---------- */
  function mkPhone(count){
    const x=off(),ph=H*0.8,pw=ph*0.49,cx=W*0.7,top=H*0.08,l=cx-pw/2,lw=Math.max(2.5,ph*0.012);x.lineWidth=lw;
    rr(x,l,top,pw,ph,pw*0.14);x.stroke();
    rr(x,cx-pw*0.14,top+ph*0.025,pw*0.28,ph*0.03,ph*0.015);x.fill();
    const m=pw*0.1,iw=pw-m*2;let y=top+ph*0.1;
    x.lineWidth=lw*0.8;x.beginPath();x.arc(l+m+ph*0.025,y+ph*0.025,ph*0.025,0,7);x.stroke();
    rr(x,l+m+ph*0.07,y+ph*0.012,iw*0.45,ph*0.014,4);x.fill();rr(x,l+m+ph*0.07,y+ph*0.035,iw*0.28,ph*0.01,4);x.fill();
    y+=ph*0.09;rr(x,l+m,y,iw,ph*0.22,ph*0.03);x.stroke();
    x.beginPath();x.moveTo(l+m+iw*0.08,y+ph*0.19);x.lineTo(l+m+iw*0.35,y+ph*0.08);x.lineTo(l+m+iw*0.55,y+ph*0.15);x.lineTo(l+m+iw*0.7,y+ph*0.1);x.lineTo(l+m+iw*0.92,y+ph*0.19);x.stroke();
    x.beginPath();x.arc(l+m+iw*0.78,y+ph*0.05,ph*0.02,0,7);x.fill();
    y+=ph*0.26;[0.9,0.7,0.8].forEach((f,k)=>{rr(x,l+m,y+k*ph*0.035,iw*f,ph*0.014,4);x.fill();});
    y+=ph*0.13;const cw=(iw-m*0.6)/2,ch=ph*0.12,cardY=y;
    [0,1].forEach(k=>{rr(x,l+m+k*(cw+m*0.6),y,cw,ch,ph*0.02);x.stroke();});
    // isi kartu kiri (thumbnail + teks) supaya jelas sebagai komponen
    rr(x,l+m+cw*0.12,y+ch*0.18,cw*0.76,ch*0.36,ph*0.01);x.fill();rr(x,l+m+cw*0.12,y+ch*0.66,cw*0.5,ch*0.1,3);x.fill();
    y+=ph*0.16;const btnY=y;rr(x,l+m,y,iw,ph*0.065,ph*0.033);x.fill();
    rr(x,cx-pw*0.18,top+ph*0.955,pw*0.36,ph*0.01,4);x.fill();
    PH={l,top,pw,ph,card:{x:l+m,y:cardY,w:cw,h:ch},btn:{x:l+m+iw/2,y:btnY+ph*0.0325}};
    const c=PH.card,e=lw*1.5;
    return pix(x,count,260).map(p=>({x:p.x,y:p.y,
      btn:p.y>btnY-2&&p.y<btnY+ph*0.07&&p.x>l+m&&p.x<l+m+iw,
      card:p.x>c.x-e&&p.x<c.x+c.w+e&&p.y>c.y-e&&p.y<c.y+c.h+e,
      rev:(p.y-top)/ph}));
  }
  function mkDB(count){
    const a=[];for(let i=0;i<count;i++){
      const disk=i%3,r=Math.random(),ang=Math.random()*Math.PI*2;
      if(i%22===0){a.push({pkt:1,ang,ph:Math.random()});continue;}
      if(r<0.42)a.push({x:Math.cos(ang),z:Math.sin(ang),y:disk*0.62,d:disk});
      else if(r<0.62)a.push({x:Math.cos(ang),z:Math.sin(ang),y:disk*0.62+0.42,d:disk});
      else if(r<0.88)a.push({x:Math.cos(ang),z:Math.sin(ang),y:disk*0.62+Math.random()*0.42,d:disk});
      else{const q=Math.sqrt(Math.random());a.push({x:Math.cos(ang)*q,z:Math.sin(ang)*q,y:disk*0.62,d:disk});}
    }return a;
  }
  function mkFlow(count){
    nodes=[{x:.47,y:.2,l:'Login'},{x:.66,y:.2,l:'Auth API'},{x:.66,y:.55,l:'Database'},{x:.86,y:.36,l:'Dashboard'},{x:.86,y:.74,l:'Notifikasi'}]
      .map(n=>({x:n.x*W,y:n.y*H,l:n.l,w:S*0.2,h:S*0.085}));
    edges=[[0,1],[1,2],[1,3],[2,4],[3,4],[2,3]];
    const x=off();x.lineWidth=Math.max(2,S*0.006);
    nodes.forEach(n=>{rr(x,n.x-n.w/2,n.y-n.h/2,n.w,n.h,n.h*0.3);x.stroke();});
    x.setLineDash([S*0.012,S*0.012]);x.lineWidth=Math.max(1.5,S*0.004);
    edges.forEach(([a,b])=>{const c=curve(a,b);x.beginPath();x.moveTo(c[0],c[1]);x.bezierCurveTo(c[2],c[3],c[4],c[5],c[6],c[7]);x.stroke();});
    return pix(x,count,260).map((p,i)=>i%7===0?{pkt:1,e:i%edges.length,off:Math.random()}:p);
  }
  function curve(a,b){const A=nodes[a],B=nodes[b];let x0=A.x,y0=A.y,x1=B.x,y1=B.y;
    if(Math.abs(y1-y0)<Math.abs(x1-x0)){x0+=Math.sign(x1-x0)*A.w/2;x1-=Math.sign(x1-x0)*B.w/2;const mx=(x0+x1)/2;return[x0,y0,mx,y0,mx,y1,x1,y1];}
    y0+=Math.sign(y1-y0)*A.h/2;y1-=Math.sign(y1-y0)*B.h/2;const my=(y0+y1)/2;return[x0,y0,x0,my,x1,my,x1,y1];}
  function bez(c,u){const v=1-u;return{x:v*v*v*c[0]+3*v*v*u*c[2]+3*v*u*u*c[4]+u*u*u*c[6],y:v*v*v*c[1]+3*v*v*u*c[3]+3*v*u*u*c[5]+u*u*u*c[7]};}
  function mkRocket(count){
    const x=off(),s=H*0.5,cx=W*0.7,base=H*0.66;x.lineWidth=Math.max(2.5,s*0.02);
    x.beginPath();x.moveTo(cx,base-s);x.bezierCurveTo(cx+s*0.22,base-s*0.75,cx+s*0.2,base-s*0.35,cx+s*0.15,base-s*0.1);
    x.lineTo(cx-s*0.15,base-s*0.1);x.bezierCurveTo(cx-s*0.2,base-s*0.35,cx-s*0.22,base-s*0.75,cx,base-s);x.closePath();x.stroke();
    x.beginPath();x.arc(cx,base-s*0.6,s*0.075,0,7);x.fill();
    [-1,1].forEach(d=>{x.beginPath();x.moveTo(cx+d*s*0.17,base-s*0.32);x.lineTo(cx+d*s*0.32,base-s*0.02);x.lineTo(cx+d*s*0.15,base-s*0.1);x.closePath();x.fill();});
    rr(x,cx-s*0.09,base-s*0.1,s*0.18,s*0.06,4);x.fill();
    nozzle={x:cx,y:base-s*0.04,s};
    return pix(x,count,260).map((p,i)=>i%3===0?{ex:1,seed:Math.random(),sp:Math.random()}:p);
  }
  function mkWord(count){
    const x=off(),narrow=W<640;wordPos={x:W*0.66,y:H*(narrow?0.18:0.36)};
    const fs=Math.min(W*0.105,H*0.26);x.font='900 '+fs+'px Unbounded, "Arial Black", sans-serif';
    x.textAlign='center';x.textBaseline='middle';x.fillText('adilabs',wordPos.x,wordPos.y);
    return pix(x,count,240);
  }

  function resize(){
    const r=stage.getBoundingClientRect();DPR=Math.min(2,window.devicePixelRatio||1);
    W=Math.max(2,Math.round(r.width));H=Math.max(2,Math.round(r.height));S=Math.min(W,H);
    cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
    N=Math.round(Math.min(3200,Math.max(900,W*H/230)));
    phone=mkPhone(N);db=mkDB(N);flow=mkFlow(N);rocket=mkRocket(N);word=mkWord(N);
    if(P.length!==N)P=Array.from({length:N},(_,i)=>({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,i,r:Math.random(),z:0,hot:0,fade:1}));
  }

  /* ---------- transisi bermakna: tiap adegan diawali partikel berkumpul di satu titik dari adegan sebelumnya ---------- */
  function funnelPoint(si){
    if(si===0)return{x:W*0.66,y:H*0.6};                       // dari tombol "Mulai proyek"
    if(si===1)return PH.btn;                                   // tombol aplikasi pecah jadi data
    if(si===2)return{x:W*0.7,y:H*0.18};                        // data keluar dari puncak database
    if(si===3)return{x:nodes[4].x,y:nodes[4].y};               // node Notifikasi menyala jadi roket
    return null;                                               // penutup: hujan dari atas
  }
  function funnelDur(si,p){return si===4?0:0.35+p.r*0.55;}

  /* ---------- kursor desainer ---------- */
  function cardOffset(l){const o={x:PH.pw*0.98,y:-PH.ph*0.14};if(l<1.9)return o;const k=ease((l-1.9)/1.4);return{x:o.x*(1-k),y:o.y*(1-k)};}
  function cursorAt(l){
    const c=PH.card,cc={x:c.x+c.w/2,y:c.y+c.h/2},o0=cardOffset(0),grab={x:cc.x+o0.x,y:cc.y+o0.y};
    if(l<1.3)return null;
    if(l<1.9){const k=ease((l-1.3)/0.6);return{x:lerp(grab.x+PH.pw*0.4,grab.x,k),y:lerp(grab.y-PH.ph*0.15,grab.y,k),press:false,a:k};}
    if(l<3.3){const o=cardOffset(l);return{x:cc.x+o.x,y:cc.y+o.y,press:true,a:1};}
    if(l<4.0){const k=ease((l-3.3)/0.7);return{x:lerp(cc.x,PH.btn.x,k),y:lerp(cc.y,PH.btn.y,k),press:false,a:1};}
    return{x:PH.btn.x,y:PH.btn.y,press:l>4.05&&l<4.3,a:clamp((5.3-l)/0.6,0,1)};
  }
  function drawCursor(c){
    const u=clamp(S/520,0.75,1.5);ctx.save();ctx.globalAlpha=c.a;ctx.translate(c.x,c.y);ctx.scale(u,u);
    if(c.press){ctx.beginPath();ctx.arc(0,0,13,0,7);ctx.fillStyle='rgba(227,18,43,.18)';ctx.fill();}
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,22);ctx.lineTo(6,17);ctx.lineTo(10,26);ctx.lineTo(14,24);ctx.lineTo(10,15.5);ctx.lineTo(18,15.5);ctx.closePath();
    ctx.fillStyle='#1c0b0e';ctx.fill();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.6;ctx.stroke();
    ctx.font='600 11px "Instrument Sans", system-ui, sans-serif';const tw=ctx.measureText('Desainer').width;
    ctx.beginPath();ctx.roundRect?ctx.roundRect(16,24,tw+14,20,10):ctx.rect(16,24,tw+14,20);ctx.fillStyle='#e3122b';ctx.fill();
    ctx.fillStyle='#ffffff';ctx.textBaseline='middle';ctx.fillText('Desainer',23,34.5);ctx.restore();
  }
  function drawSelection(l){
    if(l<1.9||l>3.7)return;const a=l<3.3?1:clamp((3.7-l)/0.4,0,1),o=cardOffset(l),c=PH.card,pad=4;
    const x=c.x+o.x-pad,y=c.y+o.y-pad,w=c.w+pad*2,h=c.h+pad*2;
    ctx.save();ctx.globalAlpha=a;ctx.setLineDash([5,4]);ctx.strokeStyle='#e3122b';ctx.lineWidth=1.4;ctx.strokeRect(x,y,w,h);ctx.setLineDash([]);
    [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([hx,hy])=>{ctx.fillStyle='#fff';ctx.fillRect(hx-3.5,hy-3.5,7,7);ctx.strokeRect(hx-3.5,hy-3.5,7,7);});
    ctx.font='500 '+Math.max(10,Math.round(S*0.02))+'px "JetBrains Mono", monospace';ctx.fillStyle='#e3122b';ctx.textBaseline='bottom';
    ctx.fillText('Card · Produk  '+Math.round(c.w)+'×'+Math.round(c.h),x,y-6);ctx.restore();
  }

  /* ---------- baris data database ---------- */
  function dbRow(k){
    const tb=['users','orders','logs'][k%3],sec=(41*60+k*3),tm='09:'+String(Math.floor(sec/60)%60).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
    if(tb==='users')return['INSERT',tb,'user_'+(1024+k),'aktif'];
    if(tb==='orders')return['INSERT',tb,'#'+(58800+k*7),'Rp '+(149000+(k*37000)%400000).toLocaleString('id-ID')];
    return['UPDATE',tb,'login_ok',tm];
  }
  function drawRows(l){
    if(W<560||l<0.9)return -1;
    const a=clamp((l-0.9)/0.5,0,1)*clamp((5-l)/0.4,0,1),step=0.45,n=Math.floor((l-0.9)/step),frac=((l-0.9)%step)/step;
    const x0=Math.max(16,W*0.04),y0=H*0.15,pw=W*0.31,rh=H*0.052,rows=5,fs=Math.max(9,Math.round(S*0.021));
    ctx.save();ctx.globalAlpha=a;
    ctx.beginPath();ctx.roundRect?ctx.roundRect(x0,y0,pw,rh*(rows+1)+8,12):ctx.rect(x0,y0,pw,rh*(rows+1)+8);
    ctx.fillStyle='rgba(255,255,255,.9)';ctx.fill();ctx.strokeStyle='#f3d6d4';ctx.lineWidth=1;ctx.stroke();
    ctx.font='500 '+fs+'px "JetBrains Mono", monospace';ctx.textBaseline='middle';
    ctx.fillStyle='#e3122b';ctx.beginPath();ctx.arc(x0+16,y0+rh/2+4,3.5+Math.sin(l*8)*1,0,7);ctx.fill();
    ctx.fillText('LIVE QUERY',x0+26,y0+rh/2+4);ctx.fillStyle='#7d5b60';ctx.textAlign='right';ctx.fillText((n+1)+' baris',x0+pw-14,y0+rh/2+4);ctx.textAlign='left';
    ctx.save();ctx.beginPath();ctx.rect(x0,y0+rh+4,pw,rh*rows);ctx.clip();
    const slide=(1-ease(Math.min(1,frac*3)))*rh;
    for(let j=0;j<=rows;j++){const k=n-j;if(k<0)break;const y=y0+rh*(j+1)+4+rh/2-slide;const r=dbRow(k);
      if(j===0){ctx.fillStyle='rgba(255,106,82,'+(0.25*(1-frac)).toFixed(2)+')';ctx.fillRect(x0+6,y-rh/2+2,pw-12,rh-4);}
      ctx.fillStyle='#e3122b';ctx.fillText(r[0],x0+14,y);ctx.fillStyle='#1c0b0e';ctx.fillText(r[1],x0+14+pw*0.25,y);
      ctx.fillStyle='#7d5b60';ctx.fillText(r[2],x0+14+pw*0.47,y);ctx.textAlign='right';ctx.fillText(r[3],x0+pw-14,y);ctx.textAlign='left';}
    ctx.restore();ctx.restore();
    return n%3;
  }

  /* ---------- hitungan mundur ---------- */
  function drawCountdown(l){
    if(l<0.2||l>2.2)return;const n=3-Math.floor((l-0.2)/0.6),fr=((l-0.2)%0.6)/0.6;
    const cx=W*0.47,cy=H*0.4,fs=S*0.22*(1.35-0.35*ease(fr*1.5));
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
    if(n>0){ctx.globalAlpha=1-ease(fr);ctx.font='900 '+fs+'px Unbounded, "Arial Black", sans-serif';ctx.fillStyle='#e3122b';ctx.fillText(String(n),cx,cy);}
    ctx.globalAlpha=clamp((2.2-l)/0.3,0,1);ctx.font='500 '+Math.max(10,Math.round(S*0.022))+'px "JetBrains Mono", monospace';ctx.fillStyle='#9b0a1d';
    ctx.fillText(n>0?'T-MINUS':'IGNITION',cx,cy-S*0.16);ctx.restore();
  }

  function lift(l){return l<2.2?Math.sin(l*40)*(l>1.6?1.6:0.6):Math.pow(l-2.2,2.2)*H*0.09;}

  function target(si,p,time,l){
    const f=S*1.1,fp=funnelPoint(si);
    if(fp&&l<funnelDur(si,p)){const a=p.i*0.7+time*3,rad=S*0.03*p.r;return{x:fp.x+Math.cos(a)*rad,y:fp.y+Math.sin(a)*rad,z:-0.5,hot:0.7,funnel:1};}
    if(si===4&&l<0.15+p.r*0.9)return{x:word[p.i].x+(p.r-.5)*W*0.2,y:-30-p.r*H*0.6,z:0,hot:0,funnel:1};
    if(si===0){
      const q=phone[p.i];
      if(l*0.55<q.rev){const a=p.i*2.4+time*0.6;return{x:W*0.7+Math.cos(a)*W*0.28,y:H*0.5+Math.sin(a*1.3)*H*0.38,z:0.6,hot:0};}
      const fl=Math.sin(time*1.4)*H*0.012;let x=q.x,y=q.y+fl,hot=0;
      if(q.card){const o=cardOffset(l);x+=o.x;y+=o.y;hot=l>1.9&&l<3.3?0.3:0;}
      if(q.btn)hot=l>4.05&&l<4.9?1:0.35+0.3*Math.sin(time*5);
      return{x,y,z:q.card&&l>1.9&&l<3.3?-0.6:0,hot};
    }
    if(si===1){
      const q=db[p.i],cx=W*0.7,cy=H*0.18,R=S*0.26,a=time*0.7,tilt=0.32;let x,y,z;
      if(q.pkt){const h=((time*0.45+q.ph)%1)*2.1;x=Math.cos(q.ang+time*2)*0.25;z=Math.sin(q.ang+time*2)*0.25;y=h;}
      else{x=q.x;z=q.z;y=q.y;}
      const xr=x*Math.cos(a)-z*Math.sin(a),zr=x*Math.sin(a)+z*Math.cos(a),sy=y*R*1.05+zr*R*tilt,s=f/(f+zr*R*1.5);
      return{x:cx+xr*R*s,y:cy+sy*s,z:zr,hot:q.pkt?1:(q.d===hotDisk?0.25:0)};
    }
    if(si===2){
      const q=flow[p.i];
      if(q.pkt){const u=(time*0.35+q.off)%1,b=bez(curve(...edges[q.e]),u);return{x:b.x,y:b.y,z:-0.8,hot:1,pkt:1};}
      return{x:q.x,y:q.y,z:0,hot:0};
    }
    if(si===3){
      const q=rocket[p.i],L=lift(l);
      if(q.ex){
        const ign=clamp((l-1.9)/0.6,0,1),d=((time*1.8+q.seed)%1),len=nozzle.s*(0.35+ign*1.1),flick=Math.sin(time*30+q.seed*50)*0.04;
        const spread=nozzle.s*(0.16*(1-d)+0.05+d*0.22)*(q.sp-.5)*2;
        return{x:nozzle.x+spread+flick*nozzle.s*0.3,y:nozzle.y-L+d*len,z:0,hot:1-d,fade:ign*(1-d*d),ex:1};
      }
      return{x:q.x,y:q.y-L,z:0,hot:0};
    }
    const w=word[p.i];return{x:w.x+Math.sin(time*2+p.i)*0.8,y:w.y+Math.cos(time*1.7+p.i)*0.8,z:0,hot:p.r<0.18?0.6:0};
  }
  let hotDisk=-1;

  function wave(x,y,sp,strength){waves.push({x,y,r:0,a:strength||1,sp:sp||1});}
  function burst(x,y,power){
    wave(x,y,1,1);
    for(const p of P){const dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy)||1,k=power*(0.4+Math.random())/(1+d/300);p.vx+=dx/d*k;p.vy+=dy/d*k;}
    glow(x,y);
  }
  function glow(x,y){flash.style.setProperty('--fx',(x/W*100)+'%');flash.style.setProperty('--fy',(y/H*100)+'%');flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go');}

  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
  stage.addEventListener('pointerleave',()=>{mouse.x=mouse.y=-9999;});
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('.cta'))return;const r=stage.getBoundingClientRect();burst(e.clientX-r.left,e.clientY-r.top,38);});
  const ctaBtn=$('.m-cta button');
  ctaBtn.addEventListener('click',()=>{burst(W*0.66,H*0.6,45);if(onCta)timers.push(setTimeout(onCta,350));});

  function sceneAt(time){let acc=0;for(let i=0;i<SCENES.length;i++){if(time<acc+SCENES[i].dur)return{i,local:time-acc,p:(time-acc)/SCENES[i].dur};acc+=SCENES[i].dur;}return{i:0,local:0,p:0};}

  const swap=$('.m-swap'),box=$('.m-swapbox'),sub=$('.m-sub'),eb=$('.m-eyebrow');
  function setWord(sc){const k=SCENES.indexOf(sc);box.style.setProperty('--sx',0);swap.classList.add('out');sub.classList.add('out');
    timers.push(setTimeout(()=>{if(!alive)return;swap.textContent=sc.word;sub.textContent=sc.sub;eb.textContent='0'+(k+1)+' · '+sc.name;
      box.style.setProperty('--sx',1);swap.classList.remove('out');sub.classList.remove('out');},260));}

  function labels(si,l){
    const a=clamp((l-1.2)/0.8,0,1)*clamp((SCENES[si].dur-l)/0.5,0,1);
    ctx.save();ctx.textBaseline='middle';
    if(a>0&&si===2){ctx.globalAlpha=a;ctx.textAlign='center';ctx.font='600 '+Math.round(S*0.03)+'px "Instrument Sans", system-ui, sans-serif';ctx.fillStyle='#1c0b0e';nodes.forEach(n=>ctx.fillText(n.l,n.x,n.y));}
    if(a>0&&si===1){ctx.globalAlpha=a;ctx.font='500 '+Math.round(S*0.024)+'px "JetBrains Mono", monospace';ctx.textAlign='left';
      const R=S*0.26,x0=W*0.7+R*1.15;['users','orders','logs'].forEach((t2,k)=>{const on=k===hotDisk;ctx.fillStyle=on?'#ff6a52':'#9b0a1d';ctx.fillText((on?'● ':'▸ ')+t2,x0,H*0.18+(k*0.62+0.2)*R*1.05+R*0.1);});}
    const ca=clamp(l/0.6,0,1)*clamp((SCENES[si].dur-l)/0.4,0,1);
    if(ca>0&&W>=640&&!(si===1&&W>=560&&l>0.9)){ // panel query menggantikan caption di adegan database
      const cap=SCENES[si].cap;ctx.globalAlpha=ca;ctx.textAlign='left';ctx.font='500 '+Math.max(9,Math.round(S*0.022))+'px "JetBrains Mono", monospace';ctx.fillStyle='#e3122b';
      ctx.fillText(cap[0]+'  ·  '+cap[1],Math.max(16,W*0.04),H*0.08);}
    ctx.restore();
  }

  /* ---------- maskot ---------- */
  const mascot=$('.m-mascot'),eyes=$('.m-eyes'),bubble=$('.m-bubble'),bText=$('.m-bubble-text');
  let typeTimer;
  function say(txt){clearInterval(typeTimer);bubble.classList.add('out');
    timers.push(setTimeout(()=>{if(!alive)return;bubble.classList.remove('out');let i=0;bText.textContent='';
      typeTimer=setInterval(()=>{bText.textContent=txt.slice(0,++i);if(i>=txt.length)clearInterval(typeTimer);},38);},250));}
  function mood(si,l){
    mascot.classList.toggle('wave',si===4||(si===0&&l<1.4));
    mascot.classList.toggle('joy',si===4||(si===3&&l>2.2)||(si===0&&l>4.1));
  }
  function lookAt(e){
    const r=mascot.querySelector('svg').getBoundingClientRect();if(!r.width)return;
    const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height*0.37),d=Math.hypot(dx,dy)||1,m=Math.min(1,d/300);
    eyes.style.transform='translate('+(dx/d*5*m).toFixed(2)+'px,'+(dy/d*3.5*m).toFixed(2)+'px)';
  }
  window.addEventListener('pointermove',lookAt);
  mascot.addEventListener('pointerdown',e=>{e.stopPropagation();mascot.classList.remove('hop');void mascot.offsetWidth;mascot.classList.add('hop');
    say(['Hehe, geli!','Aku robot AdiLabs.','Klik panggung buat ledakan!'][Math.random()*3|0]);});
  function crossed(l,mark){return prevLocal<mark&&l>=mark;}

  function step(now){
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(playing)t=(t+dt)%TOTAL;
    const s=sceneAt(t),time=now/1000,l=s.local;
    if(s.i!==prevScene){
      if(prevScene!==-1){const fp=funnelPoint(s.i);if(fp){wave(fp.x,fp.y,0.6,0.9);glow(fp.x,fp.y);}}
      prevScene=s.i;prevLocal=0;setWord(SCENES[s.i]);say(SCENES[s.i].say);
    }
    // peristiwa dalam adegan
    if(s.i===0){if(crossed(l,1.9)){const c=cursorAt(1.95);wave(c.x,c.y,0.25,0.7);}
      if(crossed(l,3.3)){const c=PH.card;wave(c.x+c.w/2,c.y+c.h/2,0.35,0.8);}
      if(crossed(l,4.1)){wave(PH.btn.x,PH.btn.y,0.45,1);glow(PH.btn.x,PH.btn.y);}}
    if(s.i===3&&crossed(l,2.2)){wave(nozzle.x,nozzle.y,0.8,1);glow(nozzle.x,nozzle.y);}
    mood(s.i,l);
    notif.classList.toggle('show',s.i===3&&l>2.7&&l<5.7);
    cta.classList.toggle('show',s.i===4&&l>1.4);
    prevLocal=l;

    // efek gulir
    const sr=stage.getBoundingClientRect();scroll=clamp(-sr.top/(sr.height*0.75),0,1);
    copyEl.style.transform='translateY('+(-scroll*40)+'px)';copyEl.style.opacity=String(1-scroll*1.1);stage.style.setProperty('--sf',String(clamp(1-scroll*1.3,0,1)));

    ctx.clearRect(0,0,W,H);
    for(let k=waves.length-1;k>=0;k--){const w=waves[k];w.r+=Math.max(W,H)*0.025*w.sp;w.a*=0.93;
      ctx.beginPath();ctx.arc(w.x,w.y,w.r,0,Math.PI*2);ctx.strokeStyle='rgba(227,18,43,'+(w.a*0.5).toFixed(3)+')';ctx.lineWidth=2+w.a*6;ctx.stroke();
      if(w.a<0.02)waves.splice(k,1);}

    if(s.i===1)hotDisk=drawRows(l);else hotDisk=-1;

    const pull=0.06*Math.min(1,l/1.2+0.1);
    for(const p of P){
      const T=target(s.i,p,time,l);
      if(scroll>0){const ang=p.i*2.399,sp=scroll*scroll;T.x=W/2+(T.x-W/2)*(1+scroll*0.9)+Math.cos(ang)*W*0.35*sp;T.y=H/2+(T.y-H/2)*(1+scroll*0.9)+Math.sin(ang)*H*0.4*sp;}
      p.z=T.z;p.hot=T.hot||0;
      if(T.ex){p.x=T.x;p.y=T.y;p.vx=p.vy=0;p.fade=T.fade;continue;}
      p.fade=1;
      if(T.pkt&&l>1){p.x+=(T.x-p.x)*0.45;p.y+=(T.y-p.y)*0.45;p.vx=p.vy=0;continue;}
      const k=T.funnel?0.1:pull;
      p.vx+=(T.x-p.x)*k;p.vy+=(T.y-p.y)*k;
      const dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy,RR=12000;
      if(d2<RR){const d=Math.sqrt(d2)||1,f=(RR-d2)/RR*3;p.vx+=dx/d*f;p.vy+=dy/d*f;}
      p.vx*=0.82;p.vy*=0.82;p.x+=p.vx;p.y+=p.vy;
    }
    const order=s.i===1||s.i===0?P.slice().sort((a,b)=>b.z-a.z):P;
    if(mouse.x>-1000){ctx.lineWidth=0.6;let c=0;
      for(let a=0;a<P.length&&c<160;a+=3){const p=P[a],dm=Math.hypot(p.x-mouse.x,p.y-mouse.y);if(dm<170&&dm>110){
        ctx.strokeStyle='rgba(227,18,43,'+(0.35*(1-(dm-110)/60)).toFixed(3)+')';ctx.beginPath();ctx.moveTo(mouse.x,mouse.y);ctx.lineTo(p.x,p.y);ctx.stroke();c++;}}}
    const dim=1-scroll*0.65;
    for(const p of order){
      const depth=clamp(p.z,-1.6,1.6),near=(1.6-depth)/3.2,speed=Math.min(1,Math.hypot(p.vx,p.vy)/10);
      let size=0.9+near*2+p.r*0.8,col;
      if(p.hot>0.05){col=p.hot>0.8?'255,170,90':p.hot>0.5?'255,106,82':'227,18,43';size*=1+p.hot*0.6;}
      else if(p.r<0.1)col='255,106,82';else if(p.r<0.72)col='227,18,43';else col='155,10,29';
      const alpha=Math.min(1,0.3+near*0.65+p.hot*0.2)*p.fade*dim;
      if(alpha<0.02)continue;
      ctx.fillStyle='rgba('+col+','+alpha.toFixed(2)+')';
      if(speed>0.3){ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=size*0.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*2,p.y-p.vy*2);ctx.stroke();}
      else{ctx.beginPath();ctx.arc(p.x,p.y,size*0.55,0,Math.PI*2);ctx.fill();}
    }
    if(s.i===0){drawSelection(l);const c=cursorAt(l);if(c&&scroll<0.5)drawCursor(c);}
    if(s.i===3)drawCountdown(l);
    labels(s.i,l);
  }
  function frame(now){if(!alive)return;if(visible){try{step(now);}catch(e){console.error(e);}}else last=now;raf=requestAnimationFrame(frame);}

  let rt;const ro=new ResizeObserver(()=>{clearTimeout(rt);rt=setTimeout(()=>{if(alive)try{resize();}catch(e){console.error(e);}},120);});ro.observe(stage);
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;},{threshold:0});io.observe(stage);
  let started=false;
  function boot(){if(started||!alive)return;started=true;try{resize();}catch(e){console.error(e);}
    P.forEach(p=>{p.x=W*0.66+(Math.random()-.5)*10;p.y=H*0.6+(Math.random()-.5)*10;});
    raf=requestAnimationFrame(frame);}
  const fontWait=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
  Promise.race([fontWait,new Promise(r=>timers.push(setTimeout(r,800)))]).then(boot);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(started&&alive)try{word=mkWord(N);}catch(e){}});

  return()=>{alive=false;cancelAnimationFrame(raf);clearInterval(typeTimer);window.removeEventListener('pointermove',lookAt);clearTimeout(rt);timers.forEach(clearTimeout);ro.disconnect();io.disconnect();};
}
