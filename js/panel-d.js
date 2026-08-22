/**
 * panel-d.js — Panel D: RBS en accion (v6)
 *
 * Layout limpio:
 *   - Capas centradas: SAMP_X1=110, SAMP_X2=340, SAMP_W=230px
 *   - IZQUIERDA de la capa: sym + Z  (fuera de la capa, en margen)
 *   - DERECHA de la capa: K y E1  (fuera de la capa, en margen)
 *   - DENTRO de cada capa: solo atomos, sin texto
 *   - Escala nm: ticks pegados al borde izquierdo de la muestra
 *   - Haz distribuido: posicion X aleatoria en todo el ancho
 */
'use strict';

const panelD = (() => {

  const cvS = document.getElementById('canvasDsamp');
  const cxS = cvS.getContext('2d');
  const WS = cvS.width;   // 520
  const HS = cvS.height;  // 300

  const cvP = document.getElementById('canvasDspec');
  const cxP = cvP.getContext('2d');
  const WP = cvP.width;
  const HP = cvP.height;

  // Layout: muestra centrada con margenes para texto
  const SAMP_X1 = 136;   // borde izquierdo de la muestra (margen ampliado para nm scale)
  const SAMP_X2 = 340;   // borde derecho de la muestra
  const SAMP_W  = SAMP_X2 - SAMP_X1;  // 204px
  const LBL_X   = SAMP_X1 - 6;        // x texto izquierdo (sym/Z), alineado a la derecha
  const INFO_X  = SAMP_X2 + 6;        // x texto derecho (K/E1)
  const SURF_Y  = 44;
  const DET_X   = 14;
  const DET_Y   = 22;
  const SAMP_H  = HS - SURF_Y - 10;

  const LAYERS = [
    { sym:'C',  Z2:6,  M2:12,  color:'#94a3b8', yFrac:0.00, hFrac:0.17 },
    { sym:'Ag', Z2:47, M2:108, color:'#c084fc', yFrac:0.17, hFrac:0.17 },
    { sym:'Au', Z2:79, M2:197, color:'#f59e0b', yFrac:0.34, hFrac:0.18 },
    { sym:'Fe', Z2:26, M2:56,  color:'#fb923c', yFrac:0.52, hFrac:0.17 },
    { sym:'Si', Z2:14, M2:28,  color:'#60a5fa', yFrac:0.69, hFrac:0.31 },
  ];

  LAYERS.forEach(l => {
    l.y  = SURF_Y + l.yFrac * SAMP_H;
    l.h  = Math.max(l.hFrac * SAMP_H, 20);
    l.cy = l.y + l.h / 2;
    l.K  = Physics.calcK(l.M2, PHYS.THETA_DET);
  });

  let E0_D=2.0, isPaused=false, selectedLyr=null, hoveredSpec=null;
  const conc={C:0.30,Ag:0.2,Au:0.8,Fe:0.2,Si:0.7};
  function getE1(l){return l.K!==null?l.K*E0_D:null;}

  const NUM_BINS=120,E_MAX_SP=3.20,SIGMA_DET=0.030;
  const perEl={};
  LAYERS.forEach(l=>{perEl[l.sym]=new Float32Array(NUM_BINS);});
  const totalBins=new Float32Array(NUM_BINS);
  let peakAreas=[];
  function eToBin(e){return Math.round(e/E_MAX_SP*NUM_BINS);}
  function binToE(i){return(i+0.5)*E_MAX_SP/NUM_BINS;}
  function addCount(layer){
    const E1=getE1(layer);if(E1===null)return;
    for(let i=0;i<NUM_BINS;i++){const v=Math.exp(-0.5*((binToE(i)-E1)/SIGMA_DET)**2);perEl[layer.sym][i]+=v;totalBins[i]+=v;}
  }

  const particles=[];
  let lastTs=null,spawnTimer=0,I_nA=20,spawnMs=9200/I_nA;
  const DUR_APP=800,DUR_FLASH=160;

  function pickLayer(){
    const w=LAYERS.map(l=>({l,w:conc[l.sym]*l.Z2*l.Z2})).filter(x=>x.w>0);
    if(!w.length)return null;
    const tot=w.reduce((s,x)=>s+x.w,0);let r=Math.random()*tot;
    for(const x of w){r-=x.w;if(r<=0)return x.l;}return w[w.length-1].l;
  }
  function spawnParticle(){
    const layer=pickLayer();if(!layer||getE1(layer)===null)return;
    const hitX=SAMP_X1+Math.random()*SAMP_W;
    particles.push({layer,phase:'approach',t:0,x:hitX,y:0,hitX,hitY:layer.cy});
  }
  function updateParticle(p,dt){
    p.t+=dt;
    const DUR_RB=DUR_APP*0.68/Math.sqrt(p.layer.K);
    if(p.phase==='approach'){p.y=Math.min(p.t/DUR_APP,1)*p.hitY;if(p.t>=DUR_APP){p.phase='flash';p.t=0;}}
    else if(p.phase==='flash'){if(p.t>=DUR_FLASH){p.phase='rebound';p.t=0;}}
    else if(p.phase==='rebound'){
      const f=Math.min(p.t/DUR_RB,1);
      p.x=p.hitX+f*(DET_X-p.hitX);p.y=p.hitY+f*(DET_Y-p.hitY);
      if(p.t>=DUR_RB){p.phase='done';addCount(p.layer);}
    }
  }

  function drawSample(){
    cxS.clearRect(0,0,WS,HS);

    // ── Capas ──
    LAYERS.forEach(l=>{
      const isSel=selectedLyr===l.sym;
      const Ni=conc[l.sym];
      const alpha=Ni*0.55+(Ni>0.01?0.08:0);
      const vis=Ni>0.02;

      // Halo seleccion
      if(isSel){cxS.shadowColor=l.color;cxS.shadowBlur=12;cxS.fillStyle=l.color+'20';cxS.fillRect(SAMP_X1-3,l.y-2,SAMP_W+6,l.h+4);cxS.shadowBlur=0;}

      // Relleno y borde
      const hexA=Math.round(alpha*255).toString(16).padStart(2,'0').slice(0,2);
      cxS.fillStyle=l.color+hexA;cxS.fillRect(SAMP_X1,l.y,SAMP_W,l.h);
      cxS.strokeStyle=isSel?l.color+'cc':l.color+'55';cxS.lineWidth=isSel?1.8:1;cxS.strokeRect(SAMP_X1,l.y,SAMP_W,l.h);

      // Atomos DENTRO (sin texto)
      if(vis){
        const atomR=Math.cbrt(l.M2/12)*3.0;
        const cols=Math.max(3,Math.floor(SAMP_W/(atomR*4.0)));
        const rows=Math.max(1,Math.round(l.h/(atomR*3.2)));
        const aA=Math.round(Ni*150+50).toString(16).padStart(2,'0');
        for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
          const ax=SAMP_X1+atomR+c*(SAMP_W-2*atomR)/Math.max(cols-1,1);
          const ay=l.y+atomR+(rows===1?l.h/2-atomR:(r+0.5)*(l.h-2*atomR)/rows);
          cxS.beginPath();cxS.arc(ax,ay,atomR,0,Math.PI*2);
          cxS.fillStyle=l.color+aA;cxS.fill();
        }
      }

      // ── Etiqueta IZQUIERDA (fuera de la capa) ──
      cxS.textAlign='right';
      cxS.font='bold 10px Inter,sans-serif';
      cxS.fillStyle=vis?l.color:l.color+'44';
      cxS.fillText(l.sym, LBL_X, l.cy+4);
      if(l.h>18){
        cxS.font='7.5px JetBrains Mono,monospace';
        cxS.fillStyle=vis?l.color+'99':l.color+'33';
        cxS.fillText('Z='+l.Z2, LBL_X, l.cy+14);
      }
      cxS.textAlign='left';

      // ── Info DERECHA (fuera de la capa) ──
      const E1=getE1(l);
      if(vis&&E1!==null){
        cxS.font='8px JetBrains Mono,monospace';cxS.fillStyle=l.color+'cc';
        cxS.fillText('K='+l.K.toFixed(3),INFO_X,l.cy);
        cxS.fillText(E1.toFixed(3)+' MeV',INFO_X,l.cy+12);
      }
    });

    // ── Linea de superficie ──
    cxS.strokeStyle='rgba(255,255,255,0.40)';cxS.lineWidth=1.8;
    cxS.beginPath();cxS.moveTo(SAMP_X1,SURF_Y);cxS.lineTo(SAMP_X2,SURF_Y);cxS.stroke();
    cxS.font='8px Inter,sans-serif';cxS.fillStyle='rgba(200,220,240,0.55)';
    cxS.textAlign='center';cxS.fillText('Superficie',SAMP_X1+SAMP_W/2,SURF_Y-6);cxS.textAlign='left';

    // ── Escala profundidad: ticks + valores nm en margen izquierdo ──
    const NM_TOTAL = 200;  // escala ilustrativa: 0-200 nm
    const NM_STEPS = [0, 50, 100, 150, 200];
    cxS.font='8px JetBrains Mono,monospace';
    cxS.fillStyle='rgba(160,185,210,0.70)';
    cxS.textAlign='right';
    NM_STEPS.forEach(nm => {
      const yD = SURF_Y + (nm / NM_TOTAL) * SAMP_H;
      // Texto del valor
      cxS.fillText(nm + ' nm', SAMP_X1 - 8, yD + 3);
      // Tick mark
      cxS.strokeStyle = 'rgba(160,185,210,0.35)';
      cxS.lineWidth = 0.8;
      cxS.beginPath(); cxS.moveTo(SAMP_X1 - 5, yD); cxS.lineTo(SAMP_X1, yD); cxS.stroke();
      // Linea guia punteada horizontal tenue a traves de la muestra
      cxS.setLineDash([2, 8]);
      cxS.strokeStyle = 'rgba(255,255,255,0.06)';
      cxS.lineWidth = 0.5;
      cxS.beginPath(); cxS.moveTo(SAMP_X1, yD); cxS.lineTo(SAMP_X2, yD); cxS.stroke();
      cxS.setLineDash([]);
    });
    // Etiqueta del eje
    cxS.save();
    cxS.translate(SAMP_X1 - 32, SURF_Y + SAMP_H / 2);
    cxS.rotate(-Math.PI / 2);
    cxS.font = '7px Inter,sans-serif';
    cxS.fillStyle = 'rgba(140,165,190,0.50)';
    cxS.textAlign = 'center';
    cxS.fillText('Profundidad', 0, 0);
    cxS.restore();
    cxS.textAlign = 'left';

    // ── Detector ──
    cxS.beginPath();cxS.moveTo(DET_X-9,DET_Y);cxS.lineTo(DET_X+9,DET_Y);cxS.lineTo(DET_X,DET_Y+14);cxS.closePath();
    cxS.fillStyle='rgba(100,200,255,0.22)';cxS.fill();
    cxS.strokeStyle='rgba(100,200,255,0.65)';cxS.lineWidth=1;cxS.stroke();
    cxS.font='7px Inter,sans-serif';cxS.fillStyle='rgba(100,200,255,0.70)';
    cxS.textAlign='center';cxS.fillText('Det.',DET_X,DET_Y-8);cxS.fillText('170°',DET_X,DET_Y-1);cxS.textAlign='left';

    // ── Haz distribuido (5 flechas guia) ──
    for(let b=0;b<5;b++){
      const bx=SAMP_X1+(b+0.5)*SAMP_W/5;
      cxS.strokeStyle='rgba(100,160,255,0.10)';cxS.lineWidth=1;cxS.setLineDash([3,6]);
      cxS.beginPath();cxS.moveTo(bx,0);cxS.lineTo(bx,SURF_Y-2);cxS.stroke();cxS.setLineDash([]);
      cxS.fillStyle='rgba(100,160,255,0.22)';
      cxS.beginPath();cxS.moveTo(bx,SURF_Y);cxS.lineTo(bx-3,SURF_Y-7);cxS.lineTo(bx+3,SURF_Y-7);cxS.closePath();cxS.fill();
    }
    cxS.font='bold 11px Inter,sans-serif';cxS.fillStyle='rgba(130,180,255,0.90)';
    cxS.textAlign='center';cxS.fillText('\u03b1  '+E0_D.toFixed(1)+' MeV  \u2193\u2193 haz',SAMP_X1+SAMP_W/2,16);cxS.textAlign='left';

    // ── Particulas ──
    for(const p of particles){if(p.phase!=='done')drawParticle(p);}

    if(isPaused){
      cxS.fillStyle='rgba(0,0,0,0.45)';cxS.fillRect(0,0,WS,HS);
      cxS.font='bold 16px Inter,sans-serif';cxS.fillStyle='rgba(255,255,255,0.7)';
      cxS.textAlign='center';cxS.fillText('\u23f8 Pausado',WS/2,HS/2);cxS.textAlign='left';
    }
  }

  function drawParticle(p){
    const col=p.layer.color;const E1=getE1(p.layer);
    if(p.phase==='approach'){
      cxS.beginPath();cxS.moveTo(p.x,0);cxS.lineTo(p.x,p.y-3);
      cxS.strokeStyle='rgba(100,160,255,0.32)';cxS.lineWidth=1.2;cxS.stroke();
      const g=cxS.createRadialGradient(p.x,p.y,0,p.x,p.y,7);
      g.addColorStop(0,'rgba(100,160,255,0.9)');g.addColorStop(1,'transparent');
      cxS.beginPath();cxS.arc(p.x,p.y,7,0,Math.PI*2);cxS.fillStyle=g;cxS.fill();
      cxS.beginPath();cxS.arc(p.x,p.y,3,0,Math.PI*2);cxS.fillStyle='#60a5fa';cxS.fill();
      const frac=p.t/DUR_APP;
      if(frac>0.08&&frac<0.90){
        cxS.setLineDash([2,4]);cxS.strokeStyle=col+'22';cxS.lineWidth=0.7;
        cxS.beginPath();cxS.moveTo(p.x,p.y+4);cxS.lineTo(p.x,p.hitY);cxS.stroke();cxS.setLineDash([]);
      }
    } else if(p.phase==='flash'){
      const prog=Math.min(p.t/DUR_FLASH,1);
      const r=8+prog*20,a=Math.max(0,0.85-prog);
      const gf=cxS.createRadialGradient(p.hitX,p.hitY,0,p.hitX,p.hitY,r);
      gf.addColorStop(0,`rgba(255,255,255,${a})`);
      gf.addColorStop(0.35,col+Math.round(a*200).toString(16).padStart(2,'0'));
      gf.addColorStop(1,'transparent');
      cxS.beginPath();cxS.arc(p.hitX,p.hitY,r,0,Math.PI*2);cxS.fillStyle=gf;cxS.fill();
    } else if(p.phase==='rebound'){
      cxS.beginPath();cxS.moveTo(p.hitX,p.hitY);cxS.lineTo(p.x,p.y);
      cxS.strokeStyle=col+'50';cxS.lineWidth=1.3;cxS.stroke();
      const gr=cxS.createRadialGradient(p.x,p.y,0,p.x,p.y,7);
      gr.addColorStop(0,col+'cc');gr.addColorStop(1,'transparent');
      cxS.beginPath();cxS.arc(p.x,p.y,7,0,Math.PI*2);cxS.fillStyle=gr;cxS.fill();
      cxS.beginPath();cxS.arc(p.x,p.y,3,0,Math.PI*2);cxS.fillStyle=col;cxS.fill();
      const DUR_RB=DUR_APP*0.68/Math.sqrt(p.layer.K);
      const frac=p.t/DUR_RB;
      if(frac>0.15&&frac<0.78&&E1!==null){
        cxS.font='7.5px JetBrains Mono,monospace';cxS.fillStyle=col;
        cxS.textAlign='center';cxS.fillText('E1='+E1.toFixed(3),p.x,p.y-10);cxS.textAlign='left';
      }
    }
  }

  const PAD={L:52,R:14,T:28,B:46};
  const PW=WP-PAD.L-PAD.R,PH=HP-PAD.T-PAD.B;
  function eToX(e){return PAD.L+(e/E_MAX_SP)*PW;}

  function drawSpectrum(){
    cxP.clearRect(0,0,WP,HP);
    cxP.fillStyle='rgba(255,255,255,0.012)';cxP.fillRect(0,0,WP,HP);
    cxP.fillStyle='rgba(255,255,255,0.015)';cxP.fillRect(PAD.L,PAD.T,PW,PH);
    cxP.strokeStyle='rgba(255,255,255,0.05)';cxP.lineWidth=1;
    for(let i=0;i<=4;i++){const yg=PAD.T+PH*i/4;cxP.beginPath();cxP.moveTo(PAD.L,yg);cxP.lineTo(PAD.L+PW,yg);cxP.stroke();}
    const maxT=Math.max(...totalBins,1);peakAreas=[];
    LAYERS.forEach(l=>{
      const eb=perEl[l.sym];
      const isSel=selectedLyr===l.sym||hoveredSpec===l.sym;
      const y0=PAD.T+PH;
      cxP.beginPath();cxP.moveTo(PAD.L,y0);
      for(let i=0;i<NUM_BINS;i++){const x=PAD.L+(i+0.5)*PW/NUM_BINS;cxP.lineTo(x,y0-(eb[i]/maxT)*PH*0.88);}
      cxP.lineTo(PAD.L+PW,y0);cxP.closePath();
      cxP.fillStyle=l.color+(isSel?'5a':'35');cxP.fill();
      cxP.beginPath();
      for(let i=0;i<NUM_BINS;i++){const x=PAD.L+(i+0.5)*PW/NUM_BINS;const h=(eb[i]/maxT)*PH*0.88;i===0?cxP.moveTo(x,y0-h):cxP.lineTo(x,y0-h);}
      cxP.strokeStyle=l.color+(isSel?'ee':'bb');cxP.lineWidth=isSel?2:1.4;cxP.stroke();
      const E1=getE1(l);
      if(E1!==null&&maxT>0.5){
        const idx=eToBin(E1);
        if(idx>=0&&idx<NUM_BINS){
          const h=(eb[idx]/maxT)*PH*0.88,px=eToX(E1),py=PAD.T+PH-h;
          peakAreas.push({sym:l.sym,x:px,layer:l,counts:eb[idx],h});
          if(h>4){
            cxP.font=`bold ${isSel?12:10}px Inter,sans-serif`;cxP.fillStyle=l.color;cxP.textAlign='center';
            cxP.fillText(l.sym,px,py-12);cxP.font='9px JetBrains Mono,monospace';cxP.fillStyle=l.color+'aa';
            cxP.fillText(E1.toFixed(3)+' MeV',px,py-24);cxP.textAlign='left';
          }
        }
      }
    });
    const xE0=eToX(E0_D);
    if(xE0>=PAD.L&&xE0<=PAD.L+PW){
      cxP.setLineDash([4,5]);cxP.strokeStyle='rgba(255,255,255,0.12)';cxP.lineWidth=1;
      cxP.beginPath();cxP.moveTo(xE0,PAD.T);cxP.lineTo(xE0,PAD.T+PH);cxP.stroke();cxP.setLineDash([]);
      cxP.font='9px Inter,sans-serif';cxP.fillStyle='rgba(255,255,255,0.3)';
      cxP.textAlign='center';cxP.fillText('E0',xE0,PAD.T+10);cxP.textAlign='left';
    }
    cxP.strokeStyle='rgba(255,255,255,0.20)';cxP.lineWidth=1;
    cxP.beginPath();cxP.moveTo(PAD.L,PAD.T+PH);cxP.lineTo(PAD.L+PW,PAD.T+PH);cxP.stroke();
    cxP.font='9.5px JetBrains Mono,monospace';cxP.fillStyle='rgba(180,200,220,0.65)';
    for(let e=0;e<=E_MAX_SP-0.1;e+=0.5){
      const xp=eToX(e);if(xp<PAD.L||xp>PAD.L+PW)continue;
      cxP.beginPath();cxP.moveTo(xp,PAD.T+PH);cxP.lineTo(xp,PAD.T+PH+5);cxP.stroke();
      cxP.textAlign='center';cxP.fillText(e.toFixed(1),xp,PAD.T+PH+18);
    }
    cxP.textAlign='center';cxP.font='10px Inter,sans-serif';cxP.fillStyle='rgba(200,220,240,0.65)';
    cxP.fillText('Energia retrodispersada  E1  (MeV)',PAD.L+PW/2,HP-6);
    cxP.save();cxP.translate(13,PAD.T+PH/2);cxP.rotate(-Math.PI/2);cxP.textAlign='center';cxP.font='10px Inter,sans-serif';cxP.fillStyle='rgba(200,220,240,0.65)';cxP.fillText('Cuentas acumuladas (u.a.)',0,0);cxP.restore();
    const nTot=Math.round(totalBins.reduce((s,v)=>s+v,0)/12);
    cxP.font='9px JetBrains Mono,monospace';cxP.fillStyle='rgba(160,180,200,0.5)';
    cxP.textAlign='right';cxP.fillText('N\u2248'+nTot+' eventos',PAD.L+PW,PAD.T+14);cxP.textAlign='left';
    if(nTot===0){cxP.font='12px Inter,sans-serif';cxP.fillStyle='rgba(200,220,240,0.3)';cxP.textAlign='center';cxP.fillText('Esperando detecciones...',PAD.L+PW/2,PAD.T+PH/2);cxP.textAlign='left';}
    if(hoveredSpec){const pp=peakAreas.find(p=>p.sym===hoveredSpec);if(pp)drawSpecTooltip(pp);}
  }

  function drawSpecTooltip(pp){
    const l=pp.layer,E1=getE1(l);
    const lines=[l.sym+'  (Z2='+l.Z2+', M2='+l.M2+' u)','K  =  '+l.K.toFixed(4),'E1 =  '+(E1!==null?E1.toFixed(4):'--')+' MeV','Z2^2 =  '+(l.Z2*l.Z2),'Cuentas:  '+Math.round(pp.counts)+' u.a.'];
    const pad=10,lh=16,tw=224,th=lines.length*lh+pad*2;
    let tx=pp.x+16,ty=PAD.T+PH-pp.h-th-10;
    if(tx+tw>WP-6)tx=pp.x-tw-16;if(ty<PAD.T)ty=PAD.T;
    cxP.fillStyle='rgba(7,14,26,0.97)';cxP.strokeStyle=l.color+'cc';cxP.lineWidth=1.2;
    cxP.beginPath();cxP.roundRect(tx,ty,tw,th,6);cxP.fill();cxP.stroke();
    cxP.textAlign='left';cxP.font='bold 11px Inter,sans-serif';cxP.fillStyle=l.color;cxP.fillText(lines[0],tx+pad,ty+pad+11);
    cxP.font='10px JetBrains Mono,monospace';cxP.fillStyle='rgba(200,220,240,0.88)';
    for(let i=1;i<lines.length;i++)cxP.fillText(lines[i],tx+pad,ty+pad+11+i*lh);
  }

  cvS.style.cursor='pointer';
  cvS.addEventListener('click',e=>{
    const rect=cvS.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(WS/rect.width),my=(e.clientY-rect.top)*(HS/rect.height);
    let found=null;
    for(const l of LAYERS){if(mx>=SAMP_X1&&mx<=SAMP_X2&&my>=l.y&&my<=l.y+l.h){found=l.sym;break;}}
    selectedLyr=(found===selectedLyr)?null:found;hoveredSpec=selectedLyr;
  });
  cvP.addEventListener('mousemove',e=>{
    const rect=cvP.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(WP/rect.width),my=(e.clientY-rect.top)*(HP/rect.height);
    let found=null;
    for(const pp of peakAreas){if(Math.abs(mx-pp.x)<26&&my>PAD.T&&my<PAD.T+PH){found=pp.sym;break;}}
    if(found!==hoveredSpec){hoveredSpec=found;cvP.style.cursor=found?'pointer':'default';}
  });
  cvP.addEventListener('mouseleave',()=>{if(!selectedLyr)hoveredSpec=null;});

  function buildControls(){
    const container=document.getElementById('panelD-sliders');if(!container)return;container.innerHTML='';
    LAYERS.forEach(l=>{
      const row=document.createElement('div');row.className='slider-row';row.style.marginBottom='4px';
      const lbl=document.createElement('span');lbl.className='slider-label';
      lbl.style.cssText='display:flex;align-items:center;gap:6px;width:130px;flex-shrink:0';
      lbl.innerHTML='<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:'+l.color+';flex-shrink:0"></span><b style="color:'+l.color+'">'+l.sym+'</b><span style="color:var(--muted);font-size:0.71rem">(Z2='+l.Z2+')</span>';
      const sld=document.createElement('input');sld.type='range';sld.min='0';sld.max='100';sld.step='1';
      sld.value=Math.round(conc[l.sym]*100);sld.style.accentColor=l.color;
      const val=document.createElement('span');val.className='slider-val';val.style.color=l.color;val.textContent=sld.value+'%';
      sld.addEventListener('input',function(){conc[l.sym]=parseInt(this.value)/100;val.textContent=this.value+'%';});
      row.appendChild(lbl);row.appendChild(sld);row.appendChild(val);container.appendChild(row);
    });
  }

  function tick(ts){
    if(lastTs===null)lastTs=ts;
    const dt=Math.min(ts-lastTs,50);lastTs=ts;
    if(!isPaused){
      spawnTimer+=dt;
      const active=particles.filter(p=>p.phase!=='done').length;
      if(spawnTimer>=spawnMs&&active<6){spawnParticle();spawnTimer=0;}
      for(const p of particles){if(p.phase!=='done')updateParticle(p,dt);}
      while(particles.length>18)particles.shift();
    }
    drawSample();drawSpectrum();
  }

  function setE0(val){E0_D=parseFloat(val);LAYERS.forEach(l=>{perEl[l.sym].fill(0);});totalBins.fill(0);const lbl=document.getElementById('valE0D');if(lbl)lbl.textContent=E0_D.toFixed(1)+' MeV';}
  function togglePause(){isPaused=!isPaused;const btn=document.getElementById('btnDPause');if(btn)btn.textContent=isPaused?'\u25b6 Continuar':'\u23f8 Pausar';}
  function reset(){LAYERS.forEach(l=>{perEl[l.sym].fill(0);});totalBins.fill(0);particles.length=0;spawnTimer=0;lastTs=null;if(isPaused)togglePause();}
  function setCurrent(nA){I_nA=parseFloat(nA);spawnMs=9200/I_nA;const lbl=document.getElementById('valI_nA');if(lbl)lbl.textContent=I_nA.toFixed(0)+' nA';}
  function init(){buildControls();}

  return{init,tick,reset,setE0,setCurrent,togglePause};
})();
