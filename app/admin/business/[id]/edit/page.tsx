"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { SavedBusiness } from '@/lib/types';
import Link from 'next/link';

const siteStyles = [
  'modern', 'elegant', 'bold', 'minimal', 'creative', 'corporate', 'luxury', 'neon', 'vintage', 'glassmorphism', 'nature'
];
const colorSchemes = [
  'blue', 'purple', 'green', 'orange', 'red', 'dark', 'gradient', 'gold', 'teal', 'rose', 'slate'
];
const fontStyles = [
  'modern', 'classic', 'playful', 'professional', 'luxury', 'tech', 'artistic', 'bold'
];
const layoutStyles = [
  'centered', 'full-width', 'card-based', 'magazine', 'minimal', 'wide'
];
const contactOptions = ['whatsapp', 'call', 'both', 'none'];
const languages = ['en', 'yo', 'ig', 'ha'];
const plans = [
  { label: 'Free', value: 'free' },
  { label: 'Basic', value: 'basic' },
  { label: 'Premium', value: 'premium' }
];

export default function EditBusinessPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<SavedBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [plan, setPlan] = useState<'free' | 'basic' | 'premium'>('free');

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/business/${params.id}`);
        if (!response.ok) {
          throw new Error('Business not found');
        }
        const data = await response.json();
        setBusiness(data);
        setPlan(data.interestedInPremium ? 'premium' : 'basic');
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch business details');
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!business) return;
    if (!business.businessName.trim()) {
      setFormError('Business name is required.');
      return;
    }
    if (!business.fullName.trim()) {
      setFormError('Owner name is required.');
      return;
    }
    // Plan logic
    let interestedInPremium = plan === 'premium';
    // Optionally, you can add a plan field to the business object
    // @ts-ignore
    business.plan = plan;
    business.interestedInPremium = interestedInPremium;
    try {
      const response = await fetch(`/api/business/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(business),
      });
      if (!response.ok) {
        throw new Error('Failed to update business');
      }
      router.push('/admin');
    } catch (error) {
      setError('Failed to update business');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }
  if (error || !business) {
    return <div className="text-center py-4 text-red-500">{error || 'Business not found'}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Business</h1>
          <Link href="/admin" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name *</label>
            <input
              type="text"
              value={business.businessName}
              onChange={(e) => setBusiness({ ...business, businessName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner Name *</label>
            <input
              type="text"
              value={business.fullName}
              onChange={(e) => setBusiness({ ...business, fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Description</label>
            <textarea
              value={business.businessDescription}
              onChange={(e) => setBusiness({ ...business, businessDescription: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              value={business.productDescription}
              onChange={(e) => setBusiness({ ...business, productDescription: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={business.location}
                onChange={(e) => setBusiness({ ...business, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={business.contactNumber}
                onChange={(e) => setBusiness({ ...business, contactNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input
                type="text"
                value={business.logoUrl}
                onChange={(e) => setBusiness({ ...business, logoUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner Picture URL</label>
              <input
                type="text"
                value={business.ownerPictureUrl}
                onChange={(e) => setBusiness({ ...business, ownerPictureUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Style</label>
              <select
                value={business.siteStyle}
                onChange={(e) => setBusiness({ ...business, siteStyle: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {siteStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Color Scheme</label>
              <select
                value={business.colorScheme}
                onChange={(e) => setBusiness({ ...business, colorScheme: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {colorSchemes.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Font Style</label>
              <select
                value={business.fontStyle}
                onChange={(e) => setBusiness({ ...business, fontStyle: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {fontStyles.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Layout Style</label>
              <select
                value={business.layoutStyle}
                onChange={(e) => setBusiness({ ...business, layoutStyle: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {layoutStyles.map((layout) => (
                  <option key={layout} value={layout}>{layout}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Option</label>
              <select
                value={business.contactOption}
                onChange={(e) => setBusiness({ ...business, contactOption: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {contactOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <select
                value={business.language}
                onChange={(e) => setBusiness({ ...business, language: e.target.value as any })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'free' | 'basic' | 'premium')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {plans.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Social Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Facebook"
                value={business.socialLinks?.facebook || ''}
                onChange={(e) => setBusiness({ ...business, socialLinks: { ...business.socialLinks, facebook: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Instagram"
                value={business.socialLinks?.instagram || ''}
                onChange={(e) => setBusiness({ ...business, socialLinks: { ...business.socialLinks, instagram: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Twitter"
                value={business.socialLinks?.twitter || ''}
                onChange={(e) => setBusiness({ ...business, socialLinks: { ...business.socialLinks, twitter: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="LinkedIn"
                value={business.socialLinks?.linkedin || ''}
                onChange={(e) => setBusiness({ ...business, socialLinks: { ...business.socialLinks, linkedin: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="YouTube"
                value={business.socialLinks?.youtube || ''}
                onChange={(e) => setBusiness({ ...business, socialLinks: { ...business.socialLinks, youtube: e.target.value } })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Hours (JSON or text)</label>
            <textarea
              value={JSON.stringify(business.businessHours || {}, null, 2)}
              onChange={(e) => {
                try {
                  setBusiness({ ...business, businessHours: JSON.parse(e.target.value) });
                  setFormError(null);
                } catch {
                  setFormError('Business hours must be valid JSON.');
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 