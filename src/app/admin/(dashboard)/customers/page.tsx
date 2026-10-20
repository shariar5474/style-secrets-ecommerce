'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  Shield,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Mail,
  UserPlus,
  Lock,
  Phone,
  User,
  X,
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { DEMO_CUSTOMERS } from '@/lib/admin-demo-data';
import type { Profile } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>(DEMO_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [notification, setNotification] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'customer'>('admin');

  // Load real users from database
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          if (data.profiles && data.profiles.length > 0) {
            setCustomers(data.profiles);
          }
        }
      } catch (e) {
        console.warn('Using demo customers fallback');
      }
    }
    loadUsers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        (c.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery));
      const matchRole = roleFilter === 'all' || c.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [customers, searchQuery, roleFilter]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: newStatus } : c))
    );
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: newStatus }),
      });
    } catch {}
  };

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, role: newRole as any } : c))
    );
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole }),
      });
      setNotification(`User role updated to ${newRole.toUpperCase()}`);
      setTimeout(() => setNotification(''), 4000);
    } catch {}
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: name,
          email,
          phone,
          password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Failed to create user');
        return;
      }

      // Add newly created user to state
      const newUser: Profile = {
        id: data.user?.id || `user_${Date.now()}`,
        full_name: name,
        email: email.trim().toLowerCase(),
        phone: phone || null,
        avatar_url: null,
        role: role as any,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setCustomers((prev) => [newUser, ...prev]);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setNotification(`🎉 New ${role === 'admin' ? 'Administrator' : 'Customer'} created successfully!`);
      setTimeout(() => setNotification(''), 5000);
    } catch (err: any) {
      setModalError(err.message || 'Something went wrong');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">
            Access & Security
          </span>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">
            Users & Admin Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer accounts, assign administrative roles, or create new store administrators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-2 bg-brand-pink/10 text-brand-pink rounded-xl">
            {customers.length} Accounts
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2 px-4 flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
          >
            <UserPlus size={15} />
            <span>+ Add New Admin</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <Check size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-border-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
          </div>
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-border-subtle rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-pink"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrators Only</option>
            <option value="customer">Customers Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Name</th>
                <th className="px-6 py-3.5 font-semibold">Email</th>
                <th className="px-6 py-3.5 font-semibold">Role (Click to Toggle)</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((user) => (
                <tr key={user.id} className="hover:bg-brand-ivory/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-soft-pink/40 text-brand-pink flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <strong className="block text-brand-charcoal font-semibold text-xs">
                          {user.full_name}
                        </strong>
                        {user.phone && (
                          <span className="text-[10px] text-gray-400 font-mono">{user.phone}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                    {user.email}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => toggleRole(user.id, user.role)}
                      title="Click to toggle between Admin and Customer"
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 ring-1 ring-purple-300'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <Shield size={12} className="text-purple-600" />
                          <span>Admin</span>
                        </>
                      ) : (
                        <>
                          <Users size={12} className="text-blue-500" />
                          <span>Customer</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(user.id, user.is_active)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                        user.is_active
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {user.is_active ? 'Active' : 'Suspended'}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="px-2 py-1 text-[10px] font-semibold rounded bg-gray-100 text-gray-600 hover:bg-brand-soft-pink/30 hover:text-brand-pink transition-colors"
                        title="Change Role"
                      >
                        {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Admin */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border-subtle p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-brand-charcoal">
                    Create New Administrator
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Add a new manager with access to the Style Secrets admin portal.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shariar Islam"
                    className="input-field pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@stylesecrets.com"
                    className="input-field pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="input-field pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="input-field pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Assigned Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="input-field text-xs bg-white cursor-pointer"
                >
                  <option value="admin">Administrator (Full Dashboard Access)</option>
                  <option value="customer">Regular Customer</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-subtle mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border-subtle rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="btn-primary py-2 px-5 text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Creating Admin...</span>
                    </>
                  ) : (
                    <span>Create Administrator</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
