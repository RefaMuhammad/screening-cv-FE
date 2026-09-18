import React, { useState, useEffect } from 'react';
import { JobRequirement, SkillReq } from '../types';
import { polishRoleDescription } from '../services/api';
import { Wand2, Plus, Minus, Check, X } from 'lucide-react';

interface Props {
  onChange: (req: JobRequirement) => void;
}

export default function JobRequirementForm({ onChange }: Props) {
  const [jobTitle, setJobTitle] = useState('Executive Sous Chef - Fine Dining');
  const [openPositions, setOpenPositions] = useState(4);
  const [destination, setDestination] = useState('United Arab Emirates (Dubai Luxury Hub)');
  const [shift, setShift] = useState('Full-Time (Rotational / Executive Schedule)');
  const [currency, setCurrency] = useState('USD');
  const [minSalary, setMinSalary] = useState(6500);
  const [maxSalary, setMaxSalary] = useState(8200);

  const [minExp, setMinExp] = useState(5);
  const [language, setLanguage] = useState('English');
  const [langLevel, setLangLevel] = useState('C1');
  const [visaSponsorship, setVisaSponsorship] = useState(true);
  const [visaReq, setVisaReq] = useState('Eligible for UAE employment visa');
  
  const [skills, setSkills] = useState<SkillReq[]>([
    { name: 'HACCP Level 3', mandatory: true },
    { name: 'Michelin Experience', mandatory: true },
    { name: 'Brigade Management', mandatory: true },
    { name: 'Food Cost & Yield', mandatory: true },
    { name: 'Halal Compliance', mandatory: false },
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillMandatory, setNewSkillMandatory] = useState(true);

  const [roleDesc, setRoleDesc] = useState(`Role Overview:
Marriott International Luxury Collection is seeking an experienced, visionary Executive Sous Chef to co-lead culinary operations at our premier 5-star flagship property in Dubai.

Primary Responsibilities:
- Culinary Direction & Execution
- Financial & Inventory Controls
- Team Leadership
- Menu Development
- Quality Assurance`);

  const [isPolishing, setIsPolishing] = useState(false);

  useEffect(() => {
    onChange({
      job_info: {
        job_title: jobTitle,
        open_positions: openPositions,
        destination_country: destination.split(' (')[0],
        regional_hub: destination,
        shift,
        salary: { currency, min: minSalary, max: maxSalary },
        placement_tier: 'GCC Placement Tier'
      },
      candidate_requirements: {
        minimum_experience_years: minExp,
        language_requirements: [{ language, minimum_level: langLevel }],
        visa_sponsorship: visaSponsorship,
        work_authorization_required: true,
        visa_requirement: visaReq,
        skills
      },
      role_description: {
        overview: roleDesc,
        responsibilities: []
      }
    });
  }, [jobTitle, openPositions, destination, shift, currency, minSalary, maxSalary, minExp, language, langLevel, visaSponsorship, visaReq, skills, roleDesc]);

  const handlePolish = async () => {
    setIsPolishing(true);
    try {
      const polished = await polishRoleDescription(roleDesc);
      setRoleDesc(polished.polished_text || polished);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPolishing(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), mandatory: newSkillMandatory }]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4 uppercase tracking-wider text-gray-700">1. Job Info & Placement Quota</h3>
        <p className="text-xs text-gray-500 mb-4">Core requisition parameters and workforce volume breakdown.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Official Job Title</label>
            <input type="text" value={jobTitle} onChange={e=>setJobTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
          </div>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Number of Open Positions</label>
              <div className="flex items-center mt-1">
                <button onClick={() => setOpenPositions(Math.max(1, openPositions - 1))} className="p-2 border rounded-l bg-gray-50 hover:bg-gray-100"><Minus className="w-4 h-4"/></button>
                <input type="number" value={openPositions} onChange={e=>setOpenPositions(parseInt(e.target.value)||1)} className="w-16 text-center border-y p-2" />
                <button onClick={() => setOpenPositions(openPositions + 1)} className="p-2 border rounded-r bg-gray-50 hover:bg-gray-100"><Plus className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Destination Country & Hub</label>
              <select value={destination} onChange={e=>setDestination(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white">
                <option>United Arab Emirates (Dubai Luxury Hub)</option>
                <option>Germany (Berlin Tech Hub)</option>
                <option>Saudi Arabia (Riyadh Hub)</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Shift</label>
              <select value={shift} onChange={e=>setShift(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white">
                <option>Full-Time (Rotational / Executive Schedule)</option>
                <option>Full-Time (Standard)</option>
                <option>Part-Time</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Monthly Base Remuneration</label>
              <div className="flex items-center mt-1 space-x-2">
                <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-20 rounded-md border p-2 bg-white"><option>USD</option><option>EUR</option></select>
                <input type="number" value={minSalary} onChange={e=>setMinSalary(parseInt(e.target.value)||0)} className="w-24 border p-2 rounded-md" />
                <span>-</span>
                <input type="number" value={maxSalary} onChange={e=>setMaxSalary(parseInt(e.target.value)||0)} className="w-24 border p-2 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4 uppercase tracking-wider text-gray-700">2. Candidate Requirements & Eligibility</h3>
        <p className="text-xs text-gray-500 mb-4">Prerequisites, technical certifications, and relocation coverage.</p>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Minimum Industry Experience (Years)</label>
              <select value={minExp} onChange={e=>setMinExp(parseInt(e.target.value))} className="mt-1 block w-full rounded-md border p-2 bg-white">
                <option value={0}>No experience</option>
                <option value={1}>1-2 years</option>
                <option value={3}>3-5 years</option>
                <option value={5}>5-8 years</option>
                <option value={8}>8+ years</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Primary Language Benchmark</label>
              <select value={langLevel} onChange={e=>setLangLevel(e.target.value)} className="mt-1 block w-full rounded-md border p-2 bg-white">
                <option value="B1">English - Intermediate</option>
                <option value="B2">English - Upper Intermediate</option>
                <option value="C1">English - C1 (Advanced)</option>
                <option value="C2">English - C2 (Fluent)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={visaSponsorship} onChange={e=>setVisaSponsorship(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">International Visa Sponsorship & Full Relocation</span>
            </label>
            {visaSponsorship && (
              <p className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                Winmaker Enterprise handles cross-border embassy filings, background vetting, medical attestations, and consular labor portals.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Visa / Work Eligibility Rule</label>
            <input type="text" value={visaReq} onChange={e=>setVisaReq(e.target.value)} className="mt-1 block w-full rounded-md border p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills, Accreditations & Certifications</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, idx) => (
                <span key={idx} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${skill.mandatory ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {skill.mandatory ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                  {skill.name}
                  <button onClick={() => removeSkill(idx)} className="ml-2 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input type="text" placeholder="Add skill..." value={newSkill} onChange={e=>setNewSkill(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} className="flex-1 border rounded-md p-2 text-sm" />
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" checked={newSkillMandatory} onChange={e=>setNewSkillMandatory(e.target.checked)} />
                <span>Mandatory</span>
              </label>
              <button onClick={addSkill} className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold border-b pb-2 mb-4 uppercase tracking-wider text-gray-700">3. Role Description & Key Responsibilities</h3>
        <p className="text-xs text-gray-500 mb-4">Detailed narrative analyzed for NLP candidate compatibility scoring.</p>
        
        <div className="relative">
          <textarea
            rows={10}
            value={roleDesc}
            onChange={(e) => setRoleDesc(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
          />
          <button
            onClick={handlePolish}
            disabled={isPolishing}
            className="absolute bottom-3 right-3 flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded text-sm shadow hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isPolishing ? 'Polishing...' : 'Polish with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
