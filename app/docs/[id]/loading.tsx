"use client"
// app/docs/[id]/loading.tsx
// Drop-in replacement — no props needed, Next.js renders this automatically

export default function LoadingPage() {
  return (
    <div className="loading-wrap">

      {/* NAV */}
      <div className="l-nav">
        <div className="l-nav-left">
          <div className="l-logo">
            <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
              <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill="white" opacity=".9"/>
              <path d="M15 2l5 5h-5V2z" fill="white" opacity=".6"/>
              <rect x="7" y="11" width="10" height="1.5" rx=".75" fill="#4285f4" opacity=".7"/>
              <rect x="7" y="14" width="8"  height="1.5" rx=".75" fill="#4285f4" opacity=".5"/>
              <rect x="7" y="17" width="6"  height="1.5" rx=".75" fill="#4285f4" opacity=".35"/>
            </svg>
          </div>
          <div className="l-nav-meta">
            <div className="l-nav-title">
              <div className="sk l-title-sk" />
              <div className="l-cloud" />
            </div>
            <div className="l-menus">
              {[32,36,44,52,46,36,32].map((w,i) => (
                <div key={i} className="sk l-menu-item" style={{width:`${w}px`,animationDelay:`${i*0.08}s`}}/>
              ))}
            </div>
          </div>
        </div>
        <div className="l-nav-right">
          <div className="sk l-avatar" style={{animationDelay:'.1s'}}/>
          <div className="sk l-avatar" style={{animationDelay:'.18s'}}/>
          <div className="sk l-share-btn"/>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="l-toolbar">
        {[null,null,null,'sep',108,116,58,72,'sep',null,null,null,null,'sep',26,26,'sep',null,null,null,null,'sep',null,null,null].map((v,i) => {
          if (v === 'sep') return <div key={i} className="l-tb-sep"/>;
          const w = typeof v === 'number' ? v : 30;
          return <div key={i} className="sk l-tb-btn" style={{width:`${w}px`,animationDelay:`${i*0.04}s`}}/>;
        })}
      </div>

      {/* RULER */}
      <div className="l-ruler">
        <div className="l-ruler-inner">
          <div className="l-shaded-left"/>
          <div className="l-shaded-right"/>
          <div className="l-rmarker" style={{left:'72px'}}/>
          <div className="l-rmarker" style={{right:'56px'}}/>
          <div className="l-handle l-handle-l">
            <svg viewBox="0 0 10 10" width="10" height="10">
              <polygon points="5,8 0,2 10,2" fill="#4285f4" opacity=".7"/>
            </svg>
          </div>
          <div className="l-handle l-handle-r">
            <svg viewBox="0 0 10 10" width="10" height="10">
              <polygon points="5,8 0,2 10,2" fill="#4285f4" opacity=".7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* PAGE */}
      <div className="l-page-area">
        <div className="l-page">

          {/* animated pen line */}
          <div className="l-pen-wrap">
            <div className="l-pen-line"/>
            <div className="l-pen-cur"/>
          </div>

          {/* skeleton content */}
          <div className="l-content">
            <div className="sk l-line" style={{height:'32px',width:'52%',marginBottom:'28px'}}/>
            <div className="sk l-line" style={{height:'18px',width:'34%',marginBottom:'32px',animationDelay:'.06s'}}/>

            {[
              {label:true},
              {w:'100%',d:'.04s'},{w:'97%',d:'.08s'},{w:'100%',d:'.12s'},
              {w:'93%',d:'.16s'},{w:'99%',d:'.20s'},{w:'68%',d:'.24s'},
              {gap:true},
              {label:true,d:'.1s'},
              {w:'100%',d:'.10s'},{w:'95%',d:'.14s'},{w:'100%',d:'.18s'},
              {w:'88%',d:'.22s'},{w:'74%',d:'.26s'},
              {gap:true},
              {label:true,d:'.2s'},
              {w:'100%',d:'.16s'},{w:'98%',d:'.20s'},{w:'100%',d:'.24s'},
              {w:'92%',d:'.28s'},{w:'100%',d:'.32s'},{w:'55%',d:'.36s'},
            ].map((item:any, i) => {
              if (item.gap)   return <div key={i} style={{height:'22px'}}/>;
              if (item.label) return <div key={i} className="sk l-section-head" style={{animationDelay:item.d}}/>;
              return (
                <div key={i} className="sk l-line"
                  style={{height:'13px',width:item.w,marginBottom:'9px',animationDelay:item.d}}
                />
              );
            })}
          </div>

          <div className="l-badge">
            <div className="l-badge-dot"/>
            Opening document
          </div>
        </div>
      </div>

      <style jsx global>{`
        .loading-wrap { width:100%; min-height:100vh; background:#f0f4f9; font-family:'Google Sans',Roboto,Arial,sans-serif; animation:l-fadein .3s ease; }

        @keyframes shimmer    { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
        @keyframes penwrite   { 0%{width:0} 70%{width:58%} 100%{width:58%} }
        @keyframes blink      { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes l-fadein   { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotpulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:.5} }
        @keyframes badge-in   { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }

        .sk { background:linear-gradient(90deg,#e8eaed 25%,#f8f9fa 50%,#e8eaed 75%); background-size:800px 100%; animation:shimmer 1.6s ease-in-out infinite; border-radius:4px; }

        /* NAV */
        .l-nav        { height:64px; background:#fff; border-bottom:1px solid #e0e0e0; display:flex; align-items:center; justify-content:space-between; padding:0 20px; }
        .l-nav-left   { display:flex; align-items:center; gap:14px; }
        .l-nav-right  { display:flex; align-items:center; gap:10px; }
        .l-logo       { width:40px; height:40px; border-radius:8px; background:linear-gradient(135deg,#4285f4 0%,#34a853 50%,#fbbc04 75%,#ea4335 100%); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .l-nav-meta   { display:flex; flex-direction:column; gap:5px; }
        .l-nav-title  { display:flex; align-items:center; gap:8px; }
        .l-title-sk   { width:180px; height:15px; border-radius:3px; }
        .l-cloud      { width:16px; height:16px; border-radius:50%; background:#34a853; opacity:.8; flex-shrink:0; }
        .l-menus      { display:flex; gap:4px; }
        .l-menu-item  { height:11px; border-radius:3px; }
        .l-avatar     { width:34px; height:34px; border-radius:50%; }
        .l-share-btn  { width:88px; height:34px; border-radius:20px; background:linear-gradient(90deg,#e8eaed 25%,#f8f9fa 50%,#e8eaed 75%); background-size:800px 100%; animation:shimmer 1.6s ease-in-out infinite; }

        /* TOOLBAR */
        .l-toolbar    { height:44px; background:#f9fbfd; border-bottom:1px solid #e0e0e0; display:flex; align-items:center; padding:0 10px; gap:3px; overflow:hidden; }
        .l-tb-btn     { height:28px; border-radius:5px; flex-shrink:0; }
        .l-tb-sep     { width:1px; height:20px; background:#dadce0; flex-shrink:0; margin:0 3px; }

        /* RULER */
        .l-ruler        { height:26px; background:#fff; border-bottom:1px solid #dadce0; display:flex; justify-content:center; align-items:stretch; overflow:hidden; }
        .l-ruler-inner  { width:816px; position:relative; background:repeating-linear-gradient(90deg,transparent,transparent 7px,#e8eaed 7px,#e8eaed 8px); }
        .l-shaded-left  { position:absolute; top:0; bottom:0; left:0; width:72px; background:rgba(66,133,244,.07); }
        .l-shaded-right { position:absolute; top:0; bottom:0; right:0; width:56px; background:rgba(66,133,244,.07); }
        .l-rmarker      { position:absolute; top:0; bottom:0; width:2px; background:#4285f4; opacity:.6; }
        .l-handle       { position:absolute; top:0; display:flex; justify-content:center; }
        .l-handle-l     { left:65px; }
        .l-handle-r     { right:49px; }

        /* PAGE */
        .l-page-area  { display:flex; justify-content:center; padding:28px 16px 80px; background:#f0f4f9; min-height:calc(100vh - 134px); }
        .l-page       { width:816px; min-height:1054px; background:#fff; border:1px solid #c8c8c8; box-shadow:0 1px 3px rgba(0,0,0,.12),0 4px 12px rgba(0,0,0,.06); padding:72px 72px 80px; position:relative; box-sizing:border-box; }

        /* PEN */
        .l-pen-wrap   { display:flex; align-items:center; height:22px; margin-bottom:28px; }
        .l-pen-line   { height:3px; background:linear-gradient(90deg,#4285f4,#34a853); border-radius:2px; animation:penwrite 2s cubic-bezier(.4,0,.2,1) forwards; }
        .l-pen-cur    { width:2px; height:20px; background:#4285f4; margin-left:1px; border-radius:1px; animation:blink .85s step-end infinite; }

        /* CONTENT */
        .l-content       { display:flex; flex-direction:column; }
        .l-line          { border-radius:3px; flex-shrink:0; }
        .l-section-head  { height:16px; width:28%; border-radius:3px; margin-bottom:14px; background:linear-gradient(90deg,#e8eaed 25%,#f8f9fa 50%,#e8eaed 75%); background-size:800px 100%; animation:shimmer 1.6s ease-in-out infinite; }

        /* BADGE */
        .l-badge      { position:absolute; bottom:24px; right:24px; display:flex; align-items:center; gap:6px; font-size:11.5px; color:#5f6368; letter-spacing:.02em; animation:badge-in .5s ease .5s both; }
        .l-badge-dot  { width:7px; height:7px; border-radius:50%; background:#4285f4; animation:dotpulse 1.3s ease-in-out infinite; }

        @media(max-width:900px) {
          .l-page { width:100%; padding:40px 24px 60px; }
          .l-ruler-inner { width:100%; }
        }
      `}</style>
    </div>
  );
}