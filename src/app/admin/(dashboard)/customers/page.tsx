'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { DEMO_CUSTOMERS } from '@/lib/admin-demo-data';
import type { Profile } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>(DEMO_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchSearch =
        c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery));
      const matchRole = roleFilter === 'all' || c.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [customers, searchQuery, roleFilter]);

  const toggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to suspend or delete this account?')) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Mockup Section 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand-gold font-bold">Access & Accounts</span>
          <h1 className="text-2xl font-display font-bold text-brand-charcoal">
            Users Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer accounts, administrative roles, and shopper profiles.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 bg-brand-pink/10 text-brand-pink rounded-lg">
          {customers.length} Registered Accounts
        </span>
      </div>

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
            <option value="customer">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table matching Mockup #6 */}
      <div className="bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[11px] border-b border-border-subtle">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Name</th>
                <th className="px-6 py-3.5 font-semibold">Email</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
                <th className="px-6 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((user) => (
                <tr key={user.id} className="hover:bg-brand-ivory/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-soft-pink/40 text-brand-pink flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {user.full_name.charAt(0)}
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
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize inline-flex items-center gap-1 ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {user.role === 'admin' && <Shield size={12} />}
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                        user.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
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
                        onClick={() => toggleStatus(user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Toggle Status"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
