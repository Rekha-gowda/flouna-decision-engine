import React, { useState, useEffect } from 'react';
import { X, Users, Shield, Calendar, Clock, Key, Mail, CheckCircle } from 'lucide-react';

export default function AdminUsersModal({ isOpen, onClose }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/auth/users')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUsers(data.users || []);
          }
        })
        .catch(err => console.error('Failed to fetch users:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-white">Administrator Portal: Registered Users</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Admin Access (Rekha)
                </span>
              </div>
              <p className="text-xs text-slate-400">Live directory of all user accounts registered on FLOUNA</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Users Table */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Account Password</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                {users.map((u) => {
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-white flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                          isAdmin ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                        {u.email}
                      </td>

                      {/* Password */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-amber-300/90">
                        {u.password}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          isAdmin
                            ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Total registered accounts: <strong className="text-white">{users.length}</strong></span>
          <span className="text-[11px] text-emerald-400">✓ Real-time user persistence active</span>
        </div>
      </div>
    </div>
  );
}
