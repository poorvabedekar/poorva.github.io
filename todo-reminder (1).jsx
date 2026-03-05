import { useState, useEffect } from "react";

/* ── palette ── */
const C = {
  cream:   "#F5F0E8",
  orange:  "#FF6B35",
  yellow:  "#FFD23F",
  green:   "#4ECDC4",
  purple:  "#7B68EE",
  pink:    "#FF85A1",
  blue:    "#5B9CF6",
  lavender:"#C8B8F8",
  dark:    "#1A1A2E",
  muted:   "#8B8599",
};

const QUAD = {
  "ui":  { label:"Do it Now",   short:"Urgent · Important",    color:C.orange,  bg:"#FFF3EE", emoji:"🔥", pri:"high"   },
  "uni": { label:"Delegate",    short:"Urgent · Not Important", color:C.yellow,  bg:"#FFFBEE", emoji:"📣", pri:"medium" },
  "nui": { label:"Schedule It", short:"Not Urgent · Important", color:C.green,   bg:"#EEFAF9", emoji:"🌿", pri:"medium" },
  "nn":  { label:"Let it go",   short:"Neither",               color:C.lavender, bg:"#F4F0FF", emoji:"☁️", pri:"low"    },
};

const PS = {
  high:   { color:C.orange,  bg:"#FFF3EE", dot:"#FF6B35" },
  medium: { color:"#D4A017", bg:"#FFFBEE", dot:C.yellow  },
  low:    { color:C.purple,  bg:"#F4F0FF", dot:C.lavender},
};

/* ── cute SVG cloud characters ── */
const CloudMascot = ({ mood="happy", color=C.blue, size=56 }) => {
  const faces = {
    happy:  <><ellipse cx="20" cy="28" rx="5" ry="4" fill={C.dark}/><ellipse cx="36" cy="28" rx="5" ry="4" fill={C.dark}/><path d="M24 36 Q28 40 32 36" stroke={C.dark} strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="16" cy="34" r="3" fill={C.pink} opacity="0.7"/><circle cx="40" cy="34" r="3" fill={C.pink} opacity="0.7"/></>,
    fire:   <><ellipse cx="20" cy="28" rx="5" ry="5" fill={C.dark}/><ellipse cx="36" cy="28" rx="5" ry="5" fill={C.dark}/><ellipse cx="21" cy="26" rx="2" ry="2" fill="white"/><ellipse cx="37" cy="26" rx="2" ry="2" fill="white"/><path d="M23 36 Q28 42 33 36" stroke={C.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/></>,
    phone:  <><ellipse cx="20" cy="29" rx="4" ry="4" fill={C.dark}/><ellipse cx="36" cy="29" rx="4" ry="4" fill={C.dark}/><path d="M25 37 Q28 40 31 37" stroke={C.dark} strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="15" cy="35" r="3" fill={C.pink} opacity="0.7"/><circle cx="41" cy="35" r="3" fill={C.pink} opacity="0.7"/></>,
    plan:   <><path d="M17 28 Q20 24 23 28" stroke={C.dark} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M33 28 Q36 24 39 28" stroke={C.dark} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M23 37 Q28 41 33 37" stroke={C.dark} strokeWidth="2.5" fill="none" strokeLinecap="round"/><circle cx="15" cy="34" r="3" fill={C.pink} opacity="0.6"/><circle cx="41" cy="34" r="3" fill={C.pink} opacity="0.6"/></>,
    meh:    <><path d="M17 28 Q20 25 23 28" stroke={C.dark} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M33 28 Q36 25 39 28" stroke={C.dark} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M22 37 L34 37" stroke={C.dark} strokeWidth="2" strokeLinecap="round"/><circle cx="13" cy="32" r="2.5" fill={C.pink} opacity="0.5"/><circle cx="43" cy="32" r="2.5" fill={C.pink} opacity="0.5"/></>,
  };
  return (
    <svg width={size} height={size*0.72} viewBox="0 0 56 42" fill="none">
      {/* cloud body */}
      <ellipse cx="28" cy="30" rx="22" ry="13" fill={color}/>
      <circle cx="18" cy="24" r="10" fill={color}/>
      <circle cx="28" cy="20" r="13" fill={color}/>
      <circle cx="38" cy="24" r="10" fill={color}/>
      {/* dashed outline */}
      <ellipse cx="28" cy="30" rx="22" ry="13" stroke={C.dark} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
      <circle cx="18" cy="24" r="10" stroke={C.dark} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
      <circle cx="28" cy="20" r="13" stroke={C.dark} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
      <circle cx="38" cy="24" r="10" stroke={C.dark} strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
      {faces[mood]}
    </svg>
  );
};

/* tiny floating deco blobs */
const Blob = ({ x, y, r, color, opacity=0.18 }) => (
  <circle cx={x} cy={y} r={r} fill={color} opacity={opacity}/>
);

/* squiggly underline */
const Squiggle = ({ color, width=80 }) => (
  <svg width={width} height="8" viewBox={`0 0 ${width} 8`} fill="none" style={{display:"block"}}>
    <path d={`M0 4 Q${width*.1} 0 ${width*.2} 4 Q${width*.3} 8 ${width*.4} 4 Q${width*.5} 0 ${width*.6} 4 Q${width*.7} 8 ${width*.8} 4 Q${width*.9} 0 ${width} 4`}
      stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

let idCtr = Date.now();
const DEFAULT_CATS = ["Personal","Work","Health","Finance","Other"];

export default function App() {
  const [view, setView]       = useState("tasks");
  const [todos, setTodos]     = useState([
    {id:1,text:"Review project proposal",priority:"high",  date:"",time:"",done:false,category:"Work",    quad:null},
    {id:2,text:"Buy groceries",          priority:"medium",date:"",time:"",done:false,category:"Personal",quad:null},
    {id:3,text:"Read 20 pages",          priority:"low",   date:"",time:"",done:false,category:"Personal",quad:null},
  ]);
  const [cats,setCats]           = useState(DEFAULT_CATS);
  const [editIdx,setEditIdx]     = useState(null);
  const [editVal,setEditVal]     = useState("");
  const [newCat,setNewCat]       = useState("");
  const [showCatMgr,setShowCatMgr] = useState(false);
  const [inp,setInp]             = useState("");
  const [pri,setPri]             = useState("medium");
  const [dt,setDt]               = useState("");
  const [tm,setTm]               = useState("");
  const [cat,setCat]             = useState("Personal");
  const [filter,setFilter]       = useState("all");
  const [dragId,setDragId]       = useState(null);
  const [overQuad,setOverQuad]   = useState(null);
  const [,setTick]               = useState(0);

  useEffect(()=>{const iv=setInterval(()=>setTick(t=>t+1),60000);return()=>clearInterval(iv);},[]);

  const getTimeLeft=(d,t)=>{
    if(!d)return null;
    const due=new Date(`${d}T${t||"23:59"}`),diff=due-new Date();
    if(diff<0)return{label:"Overdue",over:true};
    const m=Math.floor(diff/60000),h=Math.floor(m/60),days=Math.floor(h/24);
    if(days>0)return{label:`${days}d left`,over:false};
    if(h>0)return{label:`${h}h left`,over:false};
    return{label:`${m}m left`,over:false};
  };

  const addTodo=()=>{
    if(!inp.trim())return;
    setTodos(p=>[{id:++idCtr,text:inp.trim(),priority:pri,date:dt,time:tm,done:false,category:cat,quad:null},...p]);
    setInp("");setDt("");setTm("");
  };
  const toggleDone=id=>setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const remove=id=>setTodos(p=>p.filter(t=>t.id!==id));

  const saveEditCat=i=>{
    if(!editVal.trim())return;
    const old=cats[i];
    setCats(p=>p.map((c,ci)=>ci===i?editVal.trim():c));
    setTodos(p=>p.map(t=>t.category===old?{...t,category:editVal.trim()}:t));
    if(cat===old)setCat(editVal.trim());
    setEditIdx(null);
  };
  const deleteCat=i=>{
    const name=cats[i];
    setCats(p=>p.filter((_,ci)=>ci!==i));
    setTodos(p=>p.map(t=>t.category===name?{...t,category:"Other"}:t));
    if(cat===name)setCat(cats[0]||"Other");
  };
  const addCat=()=>{
    if(!newCat.trim()||cats.includes(newCat.trim()))return;
    setCats(p=>[...p,newCat.trim()]);setNewCat("");
  };

  const filtered=todos.filter(t=>{
    if(filter==="active")return!t.done;
    if(filter==="done")return t.done;
    return true;
  }).sort((a,b)=>{
    const po={high:0,medium:1,low:2};
    if(a.done!==b.done)return a.done?1:-1;
    return po[a.priority]-po[b.priority];
  });

  const matrixTasks=todos.filter(t=>!t.done);
  const unassigned=matrixTasks.filter(t=>!t.quad);

  const FD="'Nunito', 'Baloo 2', sans-serif";

  /* pill style helper */
  const pill=(bg,color,border)=>({
    display:"inline-flex",alignItems:"center",gap:4,
    padding:"3px 11px",borderRadius:999,fontSize:"0.7rem",fontWeight:800,
    fontFamily:FD,letterSpacing:"0.3px",
    background:bg,color,border:`2px solid ${border||color}`,
    lineHeight:1.4,
  });

  /* nav tab */
  const navTab=(v,label,active)=>(
    <button onClick={()=>setView(v)} style={{
      fontFamily:FD,fontWeight:800,fontSize:"0.9rem",
      padding:"8px 22px",borderRadius:999,border:"none",cursor:"pointer",
      background:active?"#1A1A2E":C.cream,
      color:active?C.yellow:C.dark,
      boxShadow:active?"0 4px 16px rgba(26,26,46,0.18)":"none",
      transition:"all 0.2s",
    }}>{label}</button>
  );

  return (
    <div style={{minHeight:"100vh",background:C.cream,fontFamily:FD,position:"relative",overflow:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>

      {/* Background decorative blobs */}
      <svg style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} viewBox="0 0 800 900" preserveAspectRatio="xMidYMid slice">
        <Blob x={720} y={80}  r={110} color={C.orange}  opacity={0.12}/>
        <Blob x={80}  y={200} r={90}  color={C.purple}  opacity={0.1}/>
        <Blob x={650} y={400} r={70}  color={C.green}   opacity={0.13}/>
        <Blob x={100} y={600} r={100} color={C.yellow}  opacity={0.11}/>
        <Blob x={750} y={700} r={80}  color={C.pink}    opacity={0.1}/>
        <Blob x={400} y={850} r={120} color={C.blue}    opacity={0.09}/>
      </svg>

      {/* ── HEADER ── */}
      <div style={{position:"relative",zIndex:10,padding:"1.5rem 1.5rem 0.75rem",maxWidth:640,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <CloudMascot mood="happy" color={C.blue} size={52}/>
              <div>
                <div style={{fontWeight:900,fontSize:"1.7rem",color:C.dark,lineHeight:1,letterSpacing:"-0.5px"}}>
                  my<span style={{color:C.orange}}>tasks</span>
                </div>
                <Squiggle color={C.orange} width={100}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
            <button onClick={()=>setShowCatMgr(!showCatMgr)} style={{
              fontFamily:FD,fontWeight:800,fontSize:"0.75rem",
              padding:"7px 14px",borderRadius:999,border:"2px solid "+C.dark,
              background:showCatMgr?C.yellow:C.cream,color:C.dark,cursor:"pointer",
              boxShadow:showCatMgr?"2px 2px 0 "+C.dark:"none",
            }}>🏷️ tags</button>
            {todos.filter(t=>!t.done).length>0&&(
              <span style={{...pill(C.orange,"#fff",C.orange),fontSize:"0.68rem"}}>
                {todos.filter(t=>!t.done).length} pending ✨
              </span>
            )}
          </div>
        </div>

        {/* nav tabs */}
        <div style={{display:"flex",gap:8,background:"rgba(255,255,255,0.6)",padding:6,borderRadius:999,backdropFilter:"blur(8px)",boxShadow:"0 2px 12px rgba(0,0,0,0.07)"}}>
          {navTab("tasks","📋 Tasks",view==="tasks")}
          {navTab("matrix","🧩 Matrix",view==="matrix")}
        </div>
      </div>

      {/* ── CATEGORY MANAGER ── */}
      {showCatMgr&&(
        <div style={{position:"relative",zIndex:10,maxWidth:640,margin:"0.75rem auto 0",padding:"0 1.5rem"}}>
          <div style={{background:"#fff",borderRadius:20,padding:"1rem 1.25rem",boxShadow:"0 4px 24px rgba(0,0,0,0.09)"}}>
            <div style={{fontWeight:800,fontSize:"0.85rem",color:C.dark,marginBottom:"0.625rem"}}>Manage categories</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.625rem"}}>
              {cats.map((c,i)=>(
                <span key={i} style={{display:"inline-flex",alignItems:"center",gap:4,background:C.cream,borderRadius:999,padding:"5px 12px",fontSize:"0.78rem",fontWeight:700,border:"1.5px solid #ddd"}}>
                  {editIdx===i?(
                    <>
                      <input value={editVal} onChange={e=>setEditVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEditCat(i)} autoFocus
                        style={{width:70,border:"none",outline:"none",fontFamily:FD,fontWeight:700,fontSize:"0.78rem",background:"transparent"}}/>
                      <button onClick={()=>saveEditCat(i)} style={{background:"none",border:"none",cursor:"pointer",color:C.green,fontWeight:900,padding:0}}>✓</button>
                      <button onClick={()=>setEditIdx(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,padding:0}}>✕</button>
                    </>
                  ):(
                    <>{c}
                      <button onClick={()=>{setEditIdx(i);setEditVal(c);}} style={{background:"none",border:"none",cursor:"pointer",opacity:0.5,padding:"0 2px",fontSize:"0.75rem"}}>✏️</button>
                      {cats.length>1&&<button onClick={()=>deleteCat(i)} style={{background:"none",border:"none",cursor:"pointer",opacity:0.4,padding:"0 2px",fontSize:"0.75rem"}}>✕</button>}
                    </>
                  )}
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCat()} placeholder="New category…"
                style={{flex:1,padding:"7px 14px",borderRadius:999,border:"2px solid #ddd",fontFamily:FD,fontSize:"0.8rem",fontWeight:600,outline:"none",background:C.cream}}/>
              <button onClick={addCat} style={{fontFamily:FD,fontWeight:800,fontSize:"0.8rem",padding:"7px 16px",borderRadius:999,background:C.dark,color:C.yellow,border:"none",cursor:"pointer"}}>+ Add</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TASKS VIEW ── */}
      {view==="tasks"&&(
        <div style={{maxWidth:640,margin:"0 auto",padding:"1rem 1.5rem 3rem",position:"relative",zIndex:5}}>

          {/* Add task card */}
          <div style={{background:"#fff",borderRadius:24,padding:"1.25rem",marginBottom:"1.25rem",boxShadow:"0 6px 28px rgba(0,0,0,0.08)"}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()}
              placeholder="what's on your mind? 💭"
              style={{width:"100%",border:"none",outline:"none",fontFamily:FD,fontWeight:700,fontSize:"1rem",color:C.dark,marginBottom:"0.875rem",boxSizing:"border-box",background:"transparent",lineHeight:1.5}}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
              {["high","medium","low"].map(p=>(
                <button key={p} onClick={()=>setPri(p)} style={{...pill(pri===p?PS[p].bg:C.cream,PS[p].color,PS[p].dot),cursor:"pointer",outline:"none",fontSize:"0.72rem",boxShadow:pri===p?`0 2px 8px ${PS[p].color}40`:"none",transition:"all 0.15s"}}>
                  {p==="high"?"🔴":p==="medium"?"🟡":"🟣"} {p}
                </button>
              ))}
              <select value={cat} onChange={e=>setCat(e.target.value)} style={{
                background:C.cream,border:"2px solid #ddd",borderRadius:999,
                padding:"4px 12px",fontSize:"0.72rem",fontFamily:FD,fontWeight:700,cursor:"pointer",outline:"none",color:C.dark
              }}>
                {cats.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <input type="date" value={dt} onChange={e=>setDt(e.target.value)} style={{background:C.cream,border:"2px solid #ddd",borderRadius:999,padding:"4px 10px",fontSize:"0.72rem",fontFamily:FD,cursor:"pointer",outline:"none",color:dt?C.dark:C.muted}}/>
              <input type="time" value={tm} onChange={e=>setTm(e.target.value)} style={{background:C.cream,border:"2px solid #ddd",borderRadius:999,padding:"4px 10px",fontSize:"0.72rem",fontFamily:FD,cursor:"pointer",outline:"none",color:tm?C.dark:C.muted}}/>
              <button onClick={addTodo} style={{
                marginLeft:"auto",background:C.orange,color:"#fff",border:"none",borderRadius:999,
                padding:"9px 22px",fontFamily:FD,fontWeight:800,fontSize:"0.85rem",cursor:"pointer",
                boxShadow:`0 4px 16px ${C.orange}55`,transition:"transform 0.1s, box-shadow 0.1s",
              }} onMouseDown={e=>e.currentTarget.style.transform="scale(0.96)"}
                 onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
                + add ✨
              </button>
            </div>
          </div>

          {/* filter tabs */}
          <div style={{display:"flex",gap:6,marginBottom:"1rem"}}>
            {[["all","All"],["active","Active ✨"],["done","Done ✓"]].map(([f,l])=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                fontFamily:FD,fontWeight:800,fontSize:"0.78rem",padding:"7px 16px",borderRadius:999,border:"none",cursor:"pointer",
                background:filter===f?C.dark:C.cream,color:filter===f?C.yellow:C.muted,
                boxShadow:filter===f?"0 2px 12px rgba(0,0,0,0.12)":"none",transition:"all 0.15s",
              }}>{l}</button>
            ))}
          </div>

          {/* task list */}
          <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
            {filtered.length===0&&(
              <div style={{textAlign:"center",padding:"3rem 1rem"}}>
                <CloudMascot mood="happy" color={C.lavender} size={80}/>
                <div style={{fontWeight:800,color:C.muted,marginTop:12,fontSize:"1rem"}}>nothing here! 🎉</div>
              </div>
            )}
            {filtered.map(t=>{
              const tl=t.date?getTimeLeft(t.date,t.time):null;
              const ps=PS[t.priority];
              const qd=t.quad?QUAD[t.quad]:null;
              return (
                <div key={t.id} style={{
                  background:t.done?"rgba(255,255,255,0.55)":"#fff",
                  borderRadius:18,
                  padding:"0.875rem 1rem",
                  display:"flex",alignItems:"flex-start",gap:12,
                  opacity:t.done?0.6:1,
                  boxShadow:t.done?"none":"0 3px 16px rgba(0,0,0,0.07)",
                  borderLeft:`5px solid ${qd?qd.color:ps.dot}`,
                  transition:"all 0.2s",
                }}>
                  {/* checkbox */}
                  <button onClick={()=>toggleDone(t.id)} style={{
                    width:24,height:24,borderRadius:"50%",flexShrink:0,marginTop:1,
                    border:`2.5px solid ${ps.dot}`,background:t.done?ps.dot:"transparent",
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:t.done?`0 2px 8px ${ps.dot}55`:"none",transition:"all 0.15s",
                  }}>
                    {t.done&&<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
                  </button>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:t.done?C.muted:C.dark,fontSize:"0.93rem",textDecoration:t.done?"line-through":"none",marginBottom:6,lineHeight:1.4}}>{t.text}</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      <span style={pill(ps.bg,ps.color,ps.dot)}>{t.priority==="high"?"🔴":t.priority==="medium"?"🟡":"🟣"} {t.priority}</span>
                      <span style={pill(C.cream,C.muted,"#ddd")}>{t.category}</span>
                      {qd&&<span style={pill(qd.bg,qd.color,qd.color)}>{qd.emoji} {qd.label}</span>}
                      {tl&&<span style={pill(tl.over?"#FFF0F3":"#F0F0F0",tl.over?C.orange:C.muted,tl.over?C.orange:"#ddd")}>⏰ {tl.label}</span>}
                    </div>
                  </div>
                  <button onClick={()=>remove(t.id)} style={{background:"transparent",border:"none",color:"#ccc",cursor:"pointer",fontSize:"1.1rem",padding:"0 2px",flexShrink:0,lineHeight:1}} onMouseEnter={e=>e.target.style.color=C.orange} onMouseLeave={e=>e.target.style.color="#ccc"}>×</button>
                </div>
              );
            })}
          </div>
          {todos.length>0&&(
            <div style={{marginTop:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.muted,fontSize:"0.78rem",fontWeight:700}}>{todos.filter(t=>t.done).length}/{todos.length} done</span>
              <button onClick={()=>setTodos(p=>p.filter(t=>!t.done))} style={{background:"none",border:"none",color:C.orange,fontFamily:FD,fontWeight:700,fontSize:"0.78rem",cursor:"pointer",textDecoration:"underline"}}>clear done ✓</button>
            </div>
          )}
        </div>
      )}

      {/* ── MATRIX VIEW ── */}
      {view==="matrix"&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:"1rem 1.5rem 3rem",position:"relative",zIndex:5}}>
          {/* header */}
          <div style={{textAlign:"center",marginBottom:"1.25rem"}}>
            <div style={{fontWeight:900,fontSize:"1.6rem",color:C.dark,letterSpacing:"-0.5px"}}>Eisenhower Matrix</div>
            <div style={{display:"flex",justifyContent:"center",marginTop:4,marginBottom:4}}><Squiggle color={C.purple} width={120}/></div>
            <div style={{color:C.muted,fontWeight:600,fontSize:"0.82rem"}}>drag tasks into the right quadrant — priority updates automagically ✨</div>
          </div>

          {/* unassigned pool */}
          <div style={{background:"#fff",borderRadius:24,padding:"1rem 1.25rem",marginBottom:"1.25rem",boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
            <div style={{fontWeight:800,color:C.dark,fontSize:"0.9rem",marginBottom:"0.625rem",display:"flex",alignItems:"center",gap:6}}>
              <CloudMascot mood="meh" color={C.lavender} size={36}/>
              <span>unassigned tasks <span style={{fontWeight:600,color:C.muted,fontSize:"0.8rem"}}>(drag into a quadrant)</span></span>
            </div>
            {unassigned.length===0
              ?<div style={{color:C.muted,fontWeight:700,fontSize:"0.85rem",textAlign:"center",padding:"0.5rem"}}>all sorted! 🎉</div>
              :<div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {unassigned.map(t=>(
                  <div key={t.id} draggable onDragStart={e=>{setDragId(t.id);e.dataTransfer.effectAllowed="move";}} onDragEnd={()=>{setDragId(null);setOverQuad(null);}}
                    style={{
                      background:PS[t.priority].bg,border:`2px solid ${PS[t.priority].dot}`,borderRadius:14,
                      padding:"7px 14px",fontFamily:FD,fontWeight:700,fontSize:"0.82rem",color:C.dark,
                      cursor:"grab",userSelect:"none",opacity:dragId===t.id?0.4:1,
                      boxShadow:`0 2px 10px ${PS[t.priority].dot}30`,transition:"transform 0.1s, box-shadow 0.1s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 18px ${PS[t.priority].dot}40`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=`0 2px 10px ${PS[t.priority].dot}30`;}}>
                    {t.text}
                    <span style={{opacity:0.5,fontSize:"0.7rem",marginLeft:4}}>({t.category})</span>
                  </div>
                ))}
              </div>
            }
          </div>

          {/* 2×2 grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
            {Object.entries(QUAD).map(([key,q])=>{
              const assigned=matrixTasks.filter(t=>t.quad===key);
              const isOver=overQuad===key;
              const moods={ui:"fire",uni:"phone",nui:"plan",nn:"meh"};
              const cloudColors={ui:C.orange,uni:C.yellow,nui:C.green,nn:C.lavender};
              return (
                <div key={key}
                  onDragOver={e=>{e.preventDefault();setOverQuad(key);}}
                  onDrop={e=>{e.preventDefault();if(dragId==null)return;setTodos(p=>p.map(t=>t.id===dragId?{...t,quad:key,priority:q.pri}:t));setDragId(null);setOverQuad(null);}}
                  onDragLeave={()=>setOverQuad(null)}
                  style={{
                    background:isOver?q.bg:"#fff",borderRadius:24,padding:"1.25rem",minHeight:220,
                    border:`2.5px solid ${isOver?q.color:"transparent"}`,
                    boxShadow:isOver?`0 8px 32px ${q.color}30`:"0 4px 20px rgba(0,0,0,0.07)",
                    transition:"all 0.2s",position:"relative",overflow:"hidden",
                  }}>
                  {/* subtle bg blob */}
                  <div style={{position:"absolute",right:-20,bottom:-20,opacity:isOver?0.3:0.15,transition:"opacity 0.2s",pointerEvents:"none"}}>
                    <CloudMascot mood={moods[key]} color={cloudColors[key]} size={90}/>
                  </div>
                  {/* quadrant header */}
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:"0.75rem",position:"relative"}}>
                    <CloudMascot mood={moods[key]} color={cloudColors[key]} size={44}/>
                    <div>
                      <div style={{fontWeight:900,fontSize:"1rem",color:q.color,lineHeight:1.1}}>{q.emoji} {q.label}</div>
                      <div style={{fontSize:"0.7rem",fontWeight:700,color:C.muted,marginTop:2}}>{q.short}</div>
                      <span style={{...pill(q.bg,q.color,q.color),marginTop:4,fontSize:"0.62rem"}}>→ {q.pri} priority</span>
                    </div>
                  </div>
                  {/* drop hint */}
                  {assigned.length===0&&(
                    <div style={{border:`2px dashed ${q.color}`,borderRadius:14,padding:"0.875rem",textAlign:"center",color:q.color,fontSize:"0.75rem",fontWeight:700,opacity:0.6,background:q.bg}}>
                      drop tasks here
                    </div>
                  )}
                  {/* tasks */}
                  <div style={{display:"flex",flexDirection:"column",gap:6,position:"relative"}}>
                    {assigned.map(t=>(
                      <div key={t.id} draggable onDragStart={e=>{setDragId(t.id);e.dataTransfer.effectAllowed="move";}} onDragEnd={()=>{setDragId(null);setOverQuad(null);}}
                        style={{
                          background:q.bg,border:`2px solid ${q.color}`,borderRadius:12,
                          padding:"7px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",
                          cursor:"grab",userSelect:"none",opacity:dragId===t.id?0.4:1,
                          boxShadow:`0 2px 8px ${q.color}20`,
                        }}>
                        <span style={{fontFamily:FD,fontWeight:700,fontSize:"0.8rem",color:C.dark,flex:1,lineHeight:1.3}}>{t.text}</span>
                        <button onClick={()=>setTodos(p=>p.map(td=>td.id===t.id?{...td,quad:null}:td))}
                          style={{background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:"0.9rem",padding:"0 2px",flexShrink:0}}
                          onMouseEnter={e=>e.target.style.color=C.orange} onMouseLeave={e=>e.target.style.color="#ccc"}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* legend */}
          <div style={{marginTop:"1.25rem",background:"#fff",borderRadius:20,padding:"1rem 1.25rem",boxShadow:"0 3px 14px rgba(0,0,0,0.07)"}}>
            <div style={{fontWeight:800,fontSize:"0.85rem",color:C.dark,marginBottom:"0.5rem"}}>📖 priority mapping</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {Object.entries(QUAD).map(([k,q])=>(
                <span key={k} style={pill(q.bg,q.color,q.color)}>{q.emoji} {q.label} → {q.pri}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
