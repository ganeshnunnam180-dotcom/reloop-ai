'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Building2, 
  Truck, 
  HeartHandshake, 
  Recycle, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ArrowRight,
  X
} from 'lucide-react';
import { DEMO_PROVIDERS } from '@/data/providers';
import { ProviderRecord, DeviceCategory } from '@/types';
import { loadJourney } from '@/lib/journeyStorage';

export default function CollectionPage() {
  const [providers] = useState<ProviderRecord[]>(DEMO_PROVIDERS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  
  // Active modal or selected provider detail
  const [activeProviderDetail, setActiveProviderDetail] = useState<ProviderRecord | null>(null);

  // Pre-filter based on user assessment location if present
  useEffect(() => {
    const journey = loadJourney();
    if (journey.assessment) {
      if (journey.assessment.category) {
        setSelectedCategory(journey.assessment.category);
      }
      if (journey.assessment.userLocation) {
        const userLoc = journey.assessment.userLocation.toLowerCase();
        const matchedCity = DEMO_PROVIDERS.find(p => p.city.toLowerCase().includes(userLoc));
        if (matchedCity) {
          setSelectedCity(matchedCity.city);
        }
      }
    }
  }, []);

  const cities = Array.from(new Set(DEMO_PROVIDERS.map((p) => p.city)));
  const serviceTypes = [
    { id: 'all', label: 'All Service Types' },
    { id: 'certified_recycler', label: 'Certified E-Waste Recycler' },
    { id: 'retail_tradein', label: 'Retail Trade-In / Buyback' },
    { id: 'nonprofit_donation', label: 'Charity & Donation Center' },
    { id: 'mailin_program', label: 'Prepaid Mail-In Service' },
    { id: 'municipal_depot', label: 'Municipal Civic Depot' },
    { id: 'repair_cafe', label: 'Community Repair Workshop' },
  ];

  const filteredProviders = providers.filter((p) => {
    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCity) return false;
    }

    // Category
    if (selectedCategory !== 'all') {
      if (!p.deviceCategoriesAccepted.includes(selectedCategory as DeviceCategory)) {
        return false;
      }
    }

    // Service Type
    if (selectedServiceType !== 'all') {
      if (p.organizationType !== selectedServiceType) {
        return false;
      }
    }

    // City
    if (selectedCity !== 'all') {
      if (p.city !== selectedCity) {
        return false;
      }
    }

    // Condition
    if (selectedCondition !== 'all') {
      if (!p.conditionsAccepted.includes(selectedCondition as any)) {
        return false;
      }
    }

    return true;
  });

  const getServiceIcon = (type: ProviderRecord['organizationType']) => {
    switch (type) {
      case 'certified_recycler': return Recycle;
      case 'retail_tradein': return Building2;
      case 'nonprofit_donation': return HeartHandshake;
      case 'mailin_program': return Truck;
      case 'municipal_depot': return MapPin;
      case 'repair_cafe': return Wrench;
      default: return Building2;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-10">
      
      {/* Title & Introduction */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#143525]">
          <MapPin className="w-4 h-4 text-[#10B981]" />
          <span>Collection & Transfer Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F241A] tracking-tight">
          Explore vetted electronic collection pathways
        </h1>
        <p className="text-sm sm:text-base text-[#4E6255] max-w-3xl leading-relaxed">
          Filter demonstration and verified channel archetypes by device category, location, and service model.
          Review required verification checkpoints before visiting or scheduling transfers.
        </p>
      </div>

      {/* Mandatory Demonstration Disclosure Banner */}
      <div className="rounded-2xl bg-[#F4F3EF] border border-[#E0DED4] p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white text-[#143525] border border-[#D7D4C5] shrink-0">
          <Info className="w-5 h-5 text-[#143525]" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm text-[#3D5245] leading-relaxed">
          <h2 className="font-bold text-[#0F241A] text-base">
            Sample Directory & Verification Notice
          </h2>
          <p>
            The records in this directory represent <strong>clearly labelled demonstration records</strong> illustrating
            typical operational channels (e.g. municipal civic depots, retail trade-in desks, charity refurbishers, and mail-in programs).
            ReLoop does not fabricate live appointments or broker commercial contracts. You must directly confirm current operating hours,
            intake policies, and identity documentation requirements with any facility prior to dispatch.
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E6DC] shadow-sm space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7D72] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search providers by keyword, city, or service name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#D7D4C5] bg-[#FAF9F5] text-sm focus:outline-none focus:ring-2 focus:ring-[#143525] focus:bg-white"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7D72] mb-1">
              Device Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7D4C5] bg-white text-xs font-medium text-[#143525] focus:outline-none focus:ring-2 focus:ring-[#143525]"
            >
              <option value="all">All Categories</option>
              <option value="smartphone">Smartphones</option>
              <option value="laptop">Laptops / Computers</option>
              <option value="tablet">Tablets</option>
              <option value="tv_monitor">TVs / Monitors</option>
              <option value="other">Other Electronics</option>
            </select>
          </div>

          {/* Service Type Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7D72] mb-1">
              Service Type
            </label>
            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7D4C5] bg-white text-xs font-medium text-[#143525] focus:outline-none focus:ring-2 focus:ring-[#143525]"
            >
              {serviceTypes.map((st) => (
                <option key={st.id} value={st.id}>{st.label}</option>
              ))}
            </select>
          </div>

          {/* City / Region Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7D72] mb-1">
              Location / Coverage
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7D4C5] bg-white text-xs font-medium text-[#143525] focus:outline-none focus:ring-2 focus:ring-[#143525]"
            >
              <option value="all">All Locations</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7D72] mb-1">
              Accepted Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7D4C5] bg-white text-xs font-medium text-[#143525] focus:outline-none focus:ring-2 focus:ring-[#143525]"
            >
              <option value="all">Any Condition</option>
              <option value="working">Working Only</option>
              <option value="broken">Broken / Dead Accepted</option>
            </select>
          </div>

        </div>

        {/* Filter reset helper */}
        {(selectedCategory !== 'all' || selectedServiceType !== 'all' || selectedCity !== 'all' || selectedCondition !== 'all' || searchTerm) && (
          <div className="flex items-center justify-between pt-2 text-xs text-[#6B7D72]">
            <span>Showing {filteredProviders.length} filtered directory result(s)</span>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedServiceType('all');
                setSelectedCity('all');
                setSelectedCondition('all');
                setSearchTerm('');
              }}
              className="font-semibold text-[#143525] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* Provider Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((prov) => {
          const Icon = getServiceIcon(prov.organizationType);

          return (
            <div
              key={prov.id}
              className="bg-white rounded-3xl p-6 border border-[#E8E6DC] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                
                {/* Header badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-[#E8F5E9] text-[#143525] shrink-0">
                    <Icon className="w-5 h-5 text-[#143525]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                    {prov.verificationBadgeText}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0F241A] leading-snug">
                  {prov.name}
                </h3>
                
                <p className="text-xs text-[#6B7D72] mt-0.5 font-medium">
                  {prov.serviceTypeLabel}
                </p>

                {/* Location snippet */}
                <div className="flex items-center gap-1.5 text-xs text-[#4E6255] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{prov.addressSnippet}, {prov.city}</span>
                </div>

                {/* Financial terms */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EFECE6] text-xs text-[#3D5245]">
                  <strong className="text-[#143525]">Financial model: </strong>
                  <span>{prov.financialNote}</span>
                </div>

                {/* Short description */}
                <p className="text-xs text-[#52635A] mt-3 leading-relaxed">
                  {prov.description}
                </p>

                {/* Verification Checkpoints Summary */}
                <div className="mt-4 pt-3 border-t border-[#F0EFEA]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E] block mb-1.5">
                    What You Must Verify Before Visiting:
                  </span>
                  <ul className="space-y-1">
                    {prov.whatToVerifyBeforeVisiting.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="text-[11px] text-[#4E6255] flex items-start gap-1.5">
                        <span className="text-[#D97706] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#F0EFEA] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveProviderDetail(prov)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#143525] text-white hover:bg-[#1B4933] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Verification Checklist</span>
                  <ArrowRight className="w-3 h-3 text-[#34D399]" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredProviders.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E6DC] space-y-3">
          <p className="font-bold text-base text-[#0F241A]">No providers match your exact filters</p>
          <p className="text-xs text-[#6B7D72] max-w-md mx-auto">
            Try adjusting your search keyword or relaxing category and city filters to view demonstration archetypes.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedServiceType('all');
              setSelectedCity('all');
              setSelectedCondition('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#143525] text-white"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Modal / Detail View for Verification Checklist */}
      {activeProviderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E8E6DC] relative max-h-[90vh] overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setActiveProviderDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#6B7D72] hover:bg-[#F4F3EF]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                {activeProviderDetail.verificationBadgeText}
              </span>
              <h3 className="text-xl font-bold text-[#0F241A] mt-2">
                {activeProviderDetail.name}
              </h3>
              <p className="text-xs text-[#6B7D72]">
                {activeProviderDetail.serviceTypeLabel} • {activeProviderDetail.city}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DC] text-xs text-[#3D5245] space-y-1">
              <p><strong>Address:</strong> {activeProviderDetail.addressSnippet}, {activeProviderDetail.region}</p>
              <p><strong>Terms:</strong> {activeProviderDetail.financialNote}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#143525] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Verification Checklist Before Handover:</span>
              </h4>
              <ul className="space-y-2">
                {activeProviderDetail.whatToVerifyBeforeVisiting.map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#F7FBF9] border border-[#C8E6C9] text-xs text-[#143525] leading-relaxed flex items-start gap-2.5">
                    <span className="font-bold text-[#10B981]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Demonstration Listing: ReLoop does not book or execute live transfers.
                Always contact organizations via their official channels.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EFEA]">
              <button
                type="button"
                onClick={() => setActiveProviderDetail(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#143525] text-white"
              >
                Understood & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
