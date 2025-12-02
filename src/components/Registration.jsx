import React, { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';
import { FaGoogle, FaFacebookF } from "react-icons/fa";

export const Registration = () => {
    const [isLogin, setIsLogin] = useState(false);
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #181818 0%, #222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ maxWidth: 400, width: '100%', background: '#111', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,.18)', padding: '44px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
                <img src="/images/logo.png" alt="OSAI Logo" style={{ width: 70, marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.12)' }} />
                <h2 style={{ fontWeight: 900, fontSize: 28, marginBottom: 8, letterSpacing: '.5px', color: '#ff5a00' }}>Sign In to OSAI</h2>
                <p style={{ color: '#e5e7eb', fontSize: 15, marginBottom: 28, textAlign: 'center' }}>Access your account and discover exclusive fashion deals.</p>
                <div style={{ width: '100%', marginBottom: 24 }}>
                    {isLogin ? <Login /> : <Signup />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 18, fontSize: 15 }}>
                    <span style={{ color: '#bbb' }}>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button style={{ background: '#ff5a00', color: '#fff', borderRadius: 8, padding: '7px 20px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,.10)', transition: 'background .2s' }} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', margin: '22px 0' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
                    <span style={{ color: '#bbb', fontSize: 13, fontWeight: 500 }}>Or continue with</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #333' }} />
                </div>
                <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center', marginBottom: 8 }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: 8, padding: '10px 18px', background: '#fff', color: '#111', fontWeight: 700, cursor: 'pointer', fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,.10)', transition: 'background .2s' }}>
                        <FaGoogle style={{ fontSize: 20 }} /> Google
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: 8, padding: '10px 18px', background: '#fff', color: '#1877f3', fontWeight: 700, cursor: 'pointer', fontSize: 15, boxShadow: '0 2px 8px rgba(0,0,0,.10)', transition: 'background .2s' }}>
                        <FaFacebookF style={{ fontSize: 20 }} /> Facebook
                    </button>
                </div>
            </div>
        </div>
    );
}
