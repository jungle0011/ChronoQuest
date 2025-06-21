'use client';

import { usePlanFeatures } from '@/lib/hooks/usePlanFeatures';
import { FeatureLock } from './FeatureLock';
import { CloudinaryUpload } from './CloudinaryUpload';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessFormSchema } from '@/lib/validations/business';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { HOMEPAGE_THEMES } from '@/lib/homepage-themes';
import type { HomepageThemeConfig } from '@/lib/types';

export function BusinessForm() {
  const { canAccess, isFeatureLocked, getUpgradeMessage } = usePlanFeatures();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [savedHomepageThemes, setSavedHomepageThemes] = useState([HOMEPAGE_THEMES[0]]);
  const [activeHomepageThemeId, setActiveHomepageThemeId] = useState(HOMEPAGE_THEMES[0].id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      ownerImage: '',
      style: 'modern',
      colorScheme: 'default',
      font: 'inter',
      layout: 'default',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      data.activeHomepageThemeId = activeHomepageThemeId;
      data.homepageThemes = savedHomepageThemes;
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create business');
      }

      toast.success('Business created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLogoUpload = () => {
    if (isFeatureLocked('logoUpload')) {
      return (
        <FeatureLock message={getUpgradeMessage('logo upload')} featureId="logoUpload">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Logo</span>
          </div>
        </FeatureLock>
      );
    }
    return (
      <CloudinaryUpload
        onUpload={(url) => setValue('logo', url)}
        folder="logos"
        showPreview={true}
      />
    );
  };

  const renderOwnerImageUpload = () => {
    if (isFeatureLocked('ownerUpload')) {
      return (
        <FeatureLock message={getUpgradeMessage('owner image upload')} featureId="ownerUpload">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">Owner</span>
          </div>
        </FeatureLock>
      );
    }
    return (
      <CloudinaryUpload
        onUpload={(url) => setValue('ownerImage', url)}
        folder="owners"
        showPreview={true}
      />
    );
  };

  // Add a homepage theme from presets
  const addHomepageTheme = (theme: HomepageThemeConfig) => {
    if (!savedHomepageThemes.find(t => t.id === theme.id)) {
      setSavedHomepageThemes([...savedHomepageThemes, theme]);
      setActiveHomepageThemeId(theme.id);
    }
  };

  // Remove a homepage theme
  const removeHomepageTheme = (id: string) => {
    if (savedHomepageThemes.length > 1) {
      const filtered = savedHomepageThemes.filter(t => t.id !== id);
      setSavedHomepageThemes(filtered);
      if (activeHomepageThemeId === id) {
        setActiveHomepageThemeId(filtered[0].id);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Business Name</label>
        <Input
          {...register('name')}
          className="mt-1"
          placeholder="Enter your business name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          {...register('description')}
          className="mt-1"
          placeholder="Describe your business"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Logo</label>
        <div className="mt-1">{renderLogoUpload()}</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Owner Image</label>
        <div className="mt-1">{renderOwnerImageUpload()}</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Style Template</label>
        <select
          {...register('style')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="modern">Modern</option>
          {canAccess('profileAnalytics') && (
            <>
              <option value="luxury">Luxury</option>
              <option value="bold">Bold</option>
              <option value="classic">Classic</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color Scheme</label>
        <select
          {...register('colorScheme')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="default">Default</option>
          {canAccess('profileAnalytics') && (
            <>
              <option value="vibrant">Vibrant</option>
              <option value="muted">Muted</option>
              <option value="dark">Dark</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Font</label>
        <select
          {...register('font')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="inter">Inter</option>
          {canAccess('profileAnalytics') && (
            <>
              <option value="roboto">Roboto</option>
              <option value="poppins">Poppins</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Layout</label>
        <select
          {...register('layout')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="default">Default</option>
          {canAccess('profileAnalytics') && (
            <>
              <option value="centered">Centered</option>
              <option value="grid">Grid</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Homepage Themes</label>
        <div className="flex flex-wrap gap-4 mb-2">
          {savedHomepageThemes.map((theme) => (
            <div key={theme.id} className={`relative rounded-xl p-3 border-2 flex flex-col items-center justify-center space-y-2 ${activeHomepageThemeId === theme.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}>
              <div className={`w-24 h-12 rounded-lg mb-2 ${theme.previewClass}`} />
              <span className="font-semibold text-sm">{theme.name}</span>
              <span className="text-xs text-gray-500 text-center">{theme.description}</span>
              {activeHomepageThemeId === theme.id && (
                <span className="mt-1 text-xs text-blue-600 font-bold">Active</span>
              )}
              {savedHomepageThemes.length > 1 && (
                <button type="button" className="absolute top-1 right-1 text-xs text-red-500" onClick={() => removeHomepageTheme(theme.id)}>&times;</button>
              )}
              {activeHomepageThemeId !== theme.id && (
                <button type="button" className="mt-1 text-xs text-blue-500 underline" onClick={() => setActiveHomepageThemeId(theme.id)}>Set Active</button>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {HOMEPAGE_THEMES.filter(t => !savedHomepageThemes.find(st => st.id === t.id)).map((theme) => (
            <button
              type="button"
              key={theme.id}
              className={`rounded-xl p-3 border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-2 focus:outline-none border-gray-200 hover:border-blue-400`}
              onClick={() => addHomepageTheme(theme)}
            >
              <div className={`w-24 h-12 rounded-lg mb-2 ${theme.previewClass}`} />
              <span className="font-semibold text-sm">{theme.name}</span>
              <span className="text-xs text-gray-500 text-center">{theme.description}</span>
              <span className="mt-1 text-xs text-green-600 font-bold">Add</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Create Business'}
      </Button>
    </form>
  );
} 