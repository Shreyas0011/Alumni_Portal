import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Link2, Code2 } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  const cols = {
    Platform:[['Alumni Directory','/directory'],['Mentorship','/mentorship'],['Events','/events'],['Register','/register']],
    Resources:[['Success Stories','#'],['Newsletter','#'],['Support Center','#'],['Privacy Policy','#']],
  };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1.5fr', gap:'3rem', marginBottom:'1rem' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display:'inline-flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.25rem' }}>
              <img src="/logo.png" alt="Transcend" style={{ height:40, width:'auto', filter:'brightness(1.4) saturate(0.2)' }}/>
              <span style={{ fontSize:'0.9rem', fontWeight:700, color:'#fff' }}>Alumni Connect <span style={{ color:'var(--blue-400)' }}>Portal</span></span>
            </Link>
            <p style={{ color:'rgba(255,255,255,0.45)', lineHeight:1.8, fontSize:'0.85rem', marginBottom:'1.5rem' }}>
              Empowering the Transcend alumni community through meaningful connections and lifelong support.
            </p>
            <div style={{ display:'flex', gap:'0.6rem' }}>
              {[Link2, Code2, Mail].map((Icon,i)=>(
                <a key={i} href="#" style={{ width:34, height:34, borderRadius:'var(--radius-md)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.4)', transition:'var(--transition)' }}
                  onMouseEnter={e=>{e.currentTarget.style.color='var(--blue-400)';e.currentTarget.style.borderColor='var(--blue-700)';e.currentTarget.style.background='rgba(37,99,235,0.2)';}}
                  onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.4)';e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.background='transparent';}}
                ><Icon size={15}/></a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(cols).map(([section, items])=>(
            <div key={section}>
              <h4 style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--blue-400)', marginBottom:'1.25rem' }}>{section}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.7rem' }}>
                {items.map(([label, path])=>(
                  <li key={label}><Link to={path} style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.875rem', transition:'var(--transition)' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.45)'}
                  >{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'var(--blue-400)', marginBottom:'1.25rem' }}>Newsletter</h4>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.85rem', marginBottom:'1rem', lineHeight:1.7 }}>Alumni news, events & job posts straight to your inbox.</p>
            <div style={{ display:'flex', gap:'0.35rem', background:'rgba(255,255,255,0.05)', padding:'0.3rem', borderRadius:'var(--radius-md)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <input type="email" placeholder="your@email.com" style={{ background:'transparent', border:'none', color:'#fff', padding:'0.4rem 0.6rem', flex:1, outline:'none', fontSize:'0.82rem', width:'auto', minWidth:0 }}/>
              <button className="btn btn-primary" style={{ padding:'0.45rem 0.875rem', borderRadius:'var(--radius-sm)', fontSize:'0.78rem', flexShrink:0 }}><Mail size={13}/></button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem' }}>© {year} Transcend Alumni Connect Portal. All rights reserved.</p>
          <div style={{ display:'flex', gap:'1.5rem' }}>
            {['Terms','Cookies','Accessibility'].map(l=>(
              <a key={l} href="#" style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.8rem', transition:'var(--transition)' }}
                onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
