import React from 'react';
import { CiUser } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";

export const Login = () => {
    return (
        <div style={{ width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ fontWeight: 800, fontSize: 26, marginBottom: 6, color: '#ff5a00' }}>Login</h1>
                <p style={{ color: '#bbb', fontSize: 15 }}>Please login to access our services!</p>
            </div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#222', borderRadius: 8, padding: '12px 16px', border: '1px solid #333' }}>
                    <CiUser style={{ fontSize: 22, color: '#ff5a00', marginRight: 8 }} />
                    <input style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 16, flex: 1 }} type="text" placeholder="Username" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: '#222', borderRadius: 8, padding: '12px 16px', border: '1px solid #333' }}>
                    <RiLockPasswordLine style={{ fontSize: 22, color: '#ff5a00', marginRight: 8 }} />
                    <input style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 16, flex: 1 }} type="password" placeholder="Password" />
                </div>
                <button type="submit" style={{ background: '#ff5a00', color: '#fff', borderRadius: 8, padding: '13px 0', fontWeight: 700, fontSize: 17, border: 'none', cursor: 'pointer', marginTop: 8, boxShadow: '0 2px 8px rgba(0,0,0,.10)' }}>Login</button>
            </form>
        </div>
    );
}