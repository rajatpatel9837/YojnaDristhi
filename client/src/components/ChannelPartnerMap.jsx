import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { MapPin, Navigation, Phone, Clock, CheckCircle2, Building2, ShieldCheck, ThumbsUp, Star } from 'lucide-react';
import { getBranchRating } from '../data/bankBranchRatingsData.js';

// Custom Marker Icon for Leaflet
const customBankIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function ChannelPartnerMap({ stateName, matchedSchemeSlug }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);

  const defaultCenter = [25.6115, 85.144]; // Patna, Bihar coordinates

  useEffect(() => {
    fetchPartners();
  }, [stateName, matchedSchemeSlug]);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/partners/nearby', {
        params: { state: stateName || 'Bihar', schemeSlug: matchedSchemeSlug }
      });
      const data = res.data.data || [];
      setPartners(data);
      if (data.length > 0) setSelectedPartner(data[0]);
    } catch (err) {
      console.warn('Partners fetch failed, using fallback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-6 text-[#173B57]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-[#0F766E]" />
            Scheme-Aware Channel Partner Map
          </div>
          <h3 className="text-lg font-black text-[#173B57]">Find Nearby Authorized Bank Branches & Nodal Agencies</h3>
          <p className="text-xs text-slate-500">
            Routing is dynamically filtered for financial institutions authorized to process your matched scheme.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
            Recommended Routing Option
          </span>
        </div>
      </div>

      {/* Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaflet Map Container */}
        <div className="lg:col-span-2 h-[420px] rounded-xl overflow-hidden border border-[#E2E8F0] shadow-inner relative">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-[#F8FAFC] text-slate-500 text-xs font-medium">
              Loading Leaflet map layers...
            </div>
          ) : (
            <MapContainer
              center={selectedPartner?.location ? [selectedPartner.location.lat, selectedPartner.location.lng] : defaultCenter}
              zoom={12}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {partners.map((partner, idx) => {
                const lat = partner.location ? partner.location.lat : 25.6115;
                const lng = partner.location ? partner.location.lng : 85.144;
                const rating = getBranchRating(partner.name, partner.city || stateName);

                return (
                  <Marker
                    key={idx}
                    position={[lat, lng]}
                    icon={customBankIcon}
                    eventHandlers={{
                      click: () => setSelectedPartner(partner)
                    }}
                  >
                    <Popup>
                      <div className="p-1 text-[#173B57] font-sans text-xs space-y-1.5 min-w-[200px]">
                        <div className="font-bold text-sm leading-tight">{partner.name}</div>
                        <div className="text-[11px] text-slate-500">{partner.address}</div>
                        
                        {/* Approval Rate & Speed */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                            🟢 {rating.approvalRate}% स्वीकृति दर
                          </span>
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded-full">
                            ⏱️ औसतन {rating.avgTurnaroundDays} दिन
                          </span>
                        </div>

                        {/* Top Tag */}
                        {rating.topTags_hi?.[0] && (
                          <div className="text-[10px] text-slate-600 bg-slate-100 p-1 rounded font-medium">
                            👍 {rating.topTags_hi[0]}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>

        {/* Selected Partner Cards List */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {partners.map((partner, idx) => {
            const rating = getBranchRating(partner.name, partner.city || stateName);

            return (
              <div
                key={idx}
                onClick={() => setSelectedPartner(partner)}
                className={`p-4 rounded-xl border cursor-pointer transition space-y-2.5 ${
                  selectedPartner?._id === partner._id
                    ? 'bg-[#F0FDFA] border-[#0F766E] shadow-sm'
                    : 'bg-white border-[#E2E8F0] hover:border-[#14B8A6]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs text-[#173B57] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0F766E]" />
                      {partner.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{partner.partnerType}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30">
                    {partner.suitabilityScore}% Match
                  </span>
                </div>

                {/* Crowdsourced Success Rate & Turnaround */}
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>{rating.approvalRate}% स्वीकृति दर</span>
                  </span>
                  <span className="font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                    ⏱️ औसतन {rating.avgTurnaroundDays} दिन
                  </span>
                  <span className="text-slate-400">
                    ({rating.positiveReviewsCount}+ समीक्षाएं)
                  </span>
                </div>

                {/* Helpful Community Tags */}
                {rating.topTags_hi && rating.topTags_hi.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {rating.topTags_hi.slice(0, 2).map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200">
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[11px] text-slate-600 space-y-1 my-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#0F766E]" />
                    <span>{partner.address} ({partner.distanceKm || '2.4'} km away)</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{partner.workingHours || '10:00 AM - 4:00 PM'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {(partner.supportedLoanTypes || ['Term Loan']).map((lt, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                        {lt}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${partner.location?.lat || 25.6115},${partner.location?.lng || 85.144}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold bg-[#0F766E] hover:bg-[#115E59] text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition shadow-sm"
                  >
                    <Navigation className="w-3 h-3" /> Get Directions
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
