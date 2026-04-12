// forms/FormRenderer.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, CheckCircle, Lock, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Cards';
import { activities } from '../constants/Apply';
import { Label } from '../ui/Label';
import { Checkbox, Input, Textarea } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import toast, { Toaster } from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../utils/AuthProvider';
import emailjs from '@emailjs/browser';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPER
// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, required = false, children }) {
  return (
    <div className="space-y-2 flex flex-col">
      <Label className="font-semibold text-sm">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function PersonalInfoSection({ formData, onChange, fee, overrides = {} }) {
  const hidden       = overrides.hide    || [];
  const extraRequired = overrides.require || [];
  const show       = (f) => !hidden.includes(f);
  const isRequired = (f) => extraRequired.includes(f);

  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
      <CardHeader className="text-xl font-bold">Personal Information</CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {show('fullName') && (
            <Field label="Full Name" required>
              <Input value={formData.personalInfo.fullName}
                onChange={(e) => onChange('personalInfo', 'fullName', e.target.value)}
                placeholder="Full Name" />
            </Field>
          )}
          {show('email') && (
            <Field label="Email Address" required>
              <Input type="email" value={formData.personalInfo.email}
                onChange={(e) => onChange('personalInfo', 'email', e.target.value)}
                placeholder="Email Address" />
            </Field>
          )}
          {show('phone') && (
            <Field label="Phone Number" required>
              <Input value={formData.personalInfo.phone}
                onChange={(e) => onChange('personalInfo', 'phone', e.target.value)}
                placeholder="Phone Number" />
            </Field>
          )}
          {show('dateOfBirth') && (
            <Field label="Date of Birth" required>
              <Input type="date" value={formData.personalInfo.dateOfBirth}
                onChange={(e) => onChange('personalInfo', 'dateOfBirth', e.target.value)} />
            </Field>
          )}
          {show('gender') && (
            <Field label="Gender" required>
              <Select onValueChange={(v) => onChange('personalInfo', 'gender', v)}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
          {show('aadhar') && (fee !== 0 || isRequired('aadhar')) && (
            <Field label="Aadhar Number" required>
              <Input type="text" placeholder="Aadhar Number"
                value={formData.personalInfo.aadhar}
                onChange={(e) => onChange('personalInfo', 'aadhar', e.target.value)} />
            </Field>
          )}
        </div>

        {show('address') && (
          <div className="space-y-2">
            <Label>Address <span className="text-destructive">*</span></Label>
            <Textarea placeholder="Address" value={formData.personalInfo.address}
              onChange={(e) => onChange('personalInfo', 'address', e.target.value)} />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {['city', 'state', 'pincode'].map((f) =>
            show(f) && (
              <Field key={f} label={f.charAt(0).toUpperCase() + f.slice(1)} required>
                <Input value={formData.personalInfo[f]}
                  onChange={(e) => onChange('personalInfo', f, e.target.value)}
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)} />
              </Field>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TeamInfoSection({ formData, onTeamChange, onMemberChange, addMember, removeMember, maxTeamSize }) {
  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Team Information</CardTitle>
        <p className="text-sm text-muted-foreground">The person filling this form is the team leader.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Team Name" required>
          <Input value={formData.teamInfo.teamName}
            onChange={(e) => onTeamChange('teamName', e.target.value)}
            placeholder="e.g., The Innovators" />
        </Field>
        <Label>Team Members (excluding leader)</Label>
        {formData.teamInfo.members.map((member, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input type="text" placeholder={`Member ${index + 1} Name`}
              value={member.name}
              onChange={(e) => onMemberChange(index, e.target.value)}
              className="flex-grow" />
            <button type="button" onClick={() => removeMember(index)}
              className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors">
              Remove
            </button>
          </div>
        ))}
        {formData.teamInfo.members.length < (maxTeamSize - 1) && (
          <button type="button" onClick={addMember}
            className="w-full mt-2 p-2 border-2 border-dashed rounded-lg hover:bg-accent transition-colors">
            + Add Team Member
          </button>
        )}
      </CardContent>
    </Card>
  );
}

function AcademicInfoSection({ formData, onChange }) {
  const classes = ['5', '6', '7', '8', '9', '10', '11', '12', 'Graduate', 'Other'];
  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
      <CardHeader className="text-xl font-bold">Academic Information</CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Current Class/Grade" required>
            <Select onValueChange={(v) => onChange('academicInfo', 'currentClass', v)}>
              <SelectTrigger><SelectValue placeholder="Select Class/Grade" /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="School/Institution" required>
            <Input value={formData.academicInfo.school}
              onChange={(e) => onChange('academicInfo', 'school', e.target.value)}
              placeholder="School" />
          </Field>
          <Field label="Board/University" required>
            <Input value={formData.academicInfo.board}
              onChange={(e) => onChange('academicInfo', 'board', e.target.value)}
              placeholder="Board/University" />
          </Field>
          <Field label="Previous Academic Score (%)" required>
            <Input type="number" value={formData.academicInfo.previousScore}
              onChange={(e) => onChange('academicInfo', 'previousScore', e.target.value)} />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function GuardianInfoSection({ formData, onChange }) {
  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
      <CardHeader><CardTitle className="text-xl font-bold">Guardian Information</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Guardian Name" required>
            <Input value={formData.guardianInfo.guardianName}
              onChange={(e) => onChange('guardianInfo', 'guardianName', e.target.value)} />
          </Field>
          <Field label="Guardian Phone" required>
            <Input value={formData.guardianInfo.guardianPhone}
              onChange={(e) => onChange('guardianInfo', 'guardianPhone', e.target.value)} />
          </Field>
          <Field label="Guardian Email">
            <Input type="email" value={formData.guardianInfo.guardianEmail}
              onChange={(e) => onChange('guardianInfo', 'guardianEmail', e.target.value)} />
          </Field>
          <Field label="Relationship" required>
            <Select onValueChange={(v) => onChange('guardianInfo', 'relationship', v)}>
              <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
              <SelectContent>
                {['father', 'mother', 'guardian', 'other'].map((r) => (
                  <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function AdditionalInfoSection({ formData, onChange }) {
  const fields = [
    { key: 'experience',   label: 'Previous Experience (if any)',         placeholder: 'Tell us about any relevant experience or achievements' },
    { key: 'expectations', label: 'What do you expect from this program?', placeholder: 'Share your goals and expectations' },
    { key: 'specialNeeds', label: 'Special Needs or Accommodations',      placeholder: 'Any special requirements or accommodations needed' },
  ];
  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
      <CardHeader><CardTitle className="text-xl font-bold">Additional Information</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <Textarea value={formData.additionalInfo[key]}
              onChange={(e) => onChange('additionalInfo', key, e.target.value)}
              placeholder={placeholder} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DocumentsSection({ onFileUpload }) {
  const docs = [
    { key: 'photo',           label: 'Recent Photo',     accept: 'image/*',              required: true,  placeholder: 'Click to upload photo' },
    { key: 'idProof',         label: 'ID Proof',         accept: '.pdf,.jpg,.jpeg,.png', required: true,  placeholder: 'Upload ID proof' },
    { key: 'academicRecords', label: 'Academic Records', accept: '.pdf,.jpg,.jpeg,.png', required: false, placeholder: 'Upload mark sheets (optional)' },
  ];
  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
      <CardHeader><CardTitle className="text-xl font-bold">Document Upload</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {docs.map(({ key, label, accept, required, placeholder }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="flex flex-col items-start cursor-pointer">
                {label}{required && <span className="text-destructive"> *</span>}
                <div className="border-2 border-dashed w-full border-muted-foreground/25 rounded-lg p-4 text-center mt-1 hover:bg-accent/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{placeholder}</p>
                </div>
              </Label>
              <input id={key} type="file" accept={accept} className="hidden"
                onChange={(e) => onFileUpload(key, e.target.files?.[0] || null)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC SELECTION SECTION
// Reads topicConfig from the activity and formData.academicInfo.currentClass
// to filter which groups are visible.
// ─────────────────────────────────────────────────────────────────────────────

function TopicSelectionSection({ formData, onChange, topicConfig }) {
  if (!topicConfig) return null;

  const { label, description, selectionMode, maxSelections, groups } = topicConfig;
  const currentGrade = formData.academicInfo?.currentClass || '';

  // Filter groups: show if grades is '*' OR currentGrade is in the grades array.
  // If no grade selected yet, show all groups with a hint.
  const visibleGroups = groups.filter(
    (g) => g.grades === '*' || g.grades.includes(currentGrade)
  );

  const gradeNotSelected = !currentGrade;

  // Current selection from formData
  const selected = formData.topicSelection?.selectedTopics || [];

  const handleToggle = (topicId) => {
    if (selectionMode === 'single') {
      // single: replace selection
      onChange('topicSelection', 'selectedTopics', [topicId]);
    } else {
      // multi: toggle
      if (selected.includes(topicId)) {
        onChange('topicSelection', 'selectedTopics', selected.filter((t) => t !== topicId));
      } else {
        const max = maxSelections || Infinity;
        if (selected.length >= max) {
          toast.error(`You can select a maximum of ${max} topics.`);
          return;
        }
        onChange('topicSelection', 'selectedTopics', [...selected, topicId]);
      }
    }
  };

  const isSelected = (topicId) => selected.includes(topicId);

  return (
    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{label} <span className="text-destructive">*</span></CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        {selectionMode === 'multi' && maxSelections && (
          <p className="text-xs text-muted-foreground mt-1">
            Select up to <span className="font-semibold">{maxSelections}</span> topics.
            ({selected.length}/{maxSelections} selected)
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Grade not yet selected — prompt */}
        {gradeNotSelected && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <span className="text-lg">⚠️</span>
            <span>Please fill in your <strong>Academic Information</strong> above first. Topics will filter based on your grade.</span>
          </div>
        )}

        {/* No matching groups for the grade */}
        {!gradeNotSelected && visibleGroups.length === 0 && (
          <div className="p-4 rounded-xl bg-muted text-muted-foreground text-sm">
            No specific tracks available for grade <strong>{currentGrade}</strong>. Please check the Open/Founders track below or contact us.
          </div>
        )}

        {/* Show groups — if grade not selected, show all groups dimmed with a note */}
        {(gradeNotSelected ? groups : visibleGroups).map((group) => (
          <div key={group.id} className={gradeNotSelected ? 'opacity-40 pointer-events-none select-none' : ''}>
            {/* Group header */}
            <div className="flex items-center gap-2 mb-3">
              {group.grades === '*' && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  Always available
                </span>
              )}
              <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
            </div>

            {/* Topic cards */}
            <div className="grid sm:grid-cols-2 gap-3">
              {group.topics.map((topic) => {
                const active = isSelected(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleToggle(topic.id)}
                    className={[
                      'text-left p-4 rounded-xl border-2 transition-all duration-150',
                      active
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border hover:border-primary/40 hover:bg-accent/40 bg-background/50',
                    ].join(' ')}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm font-semibold leading-snug ${active ? 'text-primary' : 'text-foreground'}`}>
                        {topic.label}
                      </span>
                      {/* Checkmark / circle indicator */}
                      <span className={[
                        'mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        active ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                      ].join(' ')}>
                        {active && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </div>
                    {topic.description && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{topic.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Selected summary */}
        {selected.length > 0 && (
          <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">
              {selectionMode === 'single' ? 'Selected domain:' : 'Selected topics:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.map((topicId) => {
                // Find label across all groups
                let foundLabel = topicId;
                for (const g of groups) {
                  const t = g.topics.find((tp) => tp.id === topicId);
                  if (t) { foundLabel = t.label; break; }
                }
                return (
                  <span key={topicId}
                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {foundLabel}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION REGISTRY
// Add new section types here only. FormRenderer loop never changes.
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_REGISTRY = {
  personalInfo:    (props) => <PersonalInfoSection   {...props} />,
  teamInfo:        (props) => <TeamInfoSection        {...props} />,
  academicInfo:    (props) => <AcademicInfoSection    {...props} />,
  guardianInfo:    (props) => <GuardianInfoSection    {...props} />,
  additionalInfo:  (props) => <AdditionalInfoSection  {...props} />,
  documents:       (props) => <DocumentsSection       {...props} />,
  topicSelection:  (props) => <TopicSelectionSection  {...props} />,
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_REQUIRED_FIELDS = {
  personalInfo:   ['fullName', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'city', 'state', 'pincode'],
  academicInfo:   ['currentClass', 'school', 'board', 'previousScore'],
  guardianInfo:   ['guardianName', 'guardianPhone', 'relationship'],
  teamInfo:       ['teamName'],
  documents:      ['photo', 'idProof'],
  additionalInfo: [],
  topicSelection: [], // validated separately below
};

function validateForm(formData, sections, fieldOverrides, fee, topicConfig) {
  for (const section of sections) {
    const requiredFields  = [...(SECTION_REQUIRED_FIELDS[section] || [])];
    const hidden          = fieldOverrides[section]?.hide    || [];
    const extra           = fieldOverrides[section]?.require || [];

    for (const f of extra) {
      if (!requiredFields.includes(f)) requiredFields.push(f);
    }

    // Aadhar: required if fee > 0 or explicitly required
    if (section === 'personalInfo' && !requiredFields.includes('aadhar') && fee !== 0) {
      requiredFields.push('aadhar');
    }

    for (const field of requiredFields) {
      if (hidden.includes(field)) continue;

      const value = section === 'documents'
        ? formData.documents[field]
        : formData[section]?.[field];

      if (!value || value === '') {
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
        return `${label} is required.`;
      }
    }

    if (section === 'academicInfo') {
      const score = Number(formData.academicInfo.previousScore);
      if (score <= 0 || score > 100) return 'Previous Academic Score must be between 1 and 100.';
    }

    // Topic selection validation
    if (section === 'topicSelection' && topicConfig) {
      const selected = formData.topicSelection?.selectedTopics || [];
      if (selected.length === 0) {
        return `Please select at least one ${topicConfig.label || 'topic'}.`;
      }
    }
  }

  if (sections.includes('personalInfo') && fee !== 0) {
    const hidden = fieldOverrides.personalInfo?.hide || [];
    if (!hidden.includes('aadhar') && formData.personalInfo.aadhar?.length !== 12) {
      return 'Aadhar number must be exactly 12 digits.';
    }
  }

  if (!formData.consent) return 'You must agree to the terms and conditions.';
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_SERVICE_ID  = 'service_h7x526j';
const EMAIL_TEMPLATE_ID = 'template_v87pkxg';
const EMAIL_PUBLIC_KEY  = 'AVIwzEQbBV_Q4mLkn';

function sendConfirmationEmail(templateParams) {
  emailjs
    .send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, { publicKey: EMAIL_PUBLIC_KEY })
    .then(
      () => toast.success('Confirmation email sent!'),
      (err) => console.error('Email error:', err),
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const FormRenderer = () => {
  const formName        = window.location.pathname.split('/')[2];
  const currentActivity = activities.find((e) => e.link === formName);
  const navigate        = useNavigate();
  const { currentUser, userData } = useAuth();

  const [isClosed,     setIsClosed]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections       = currentActivity?.sections       || [];
  const fieldOverrides = currentActivity?.fieldOverrides || {};
  const topicConfig    = currentActivity?.topicConfig    || null;

  useEffect(() => {
    if (!currentActivity) { navigate('/'); return; }
    if (currentActivity.status === 'closed') setIsClosed(true);
    document.title = `Kalyan | ${currentActivity.title}`;
  }, []);

  // ── Form State ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    personalInfo:   { fullName: '', email: '', phone: '', dateOfBirth: '', gender: '', aadhar: '', address: '', city: '', state: '', pincode: '' },
    academicInfo:   { currentClass: '', school: '', board: '', previousScore: '' },
    guardianInfo:   { guardianName: '', guardianPhone: '', guardianEmail: '', relationship: '' },
    teamInfo:       { teamName: '', members: [] },
    additionalInfo: { experience: '', expectations: '', specialNeeds: '' },
    topicSelection: { selectedTopics: [] },
    documents:      { photo: null, idProof: null, academicRecords: null },
    payments: {
      paymentRequired: (currentActivity?.fee ?? 0) !== 0,
      paymentStatus:   false,
      paymentId:       '',
    },
    consent: false,
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleInputChange = (section, field, value) =>
    setFormData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const handleFileUpload = (field, file) =>
    setFormData((prev) => ({ ...prev, documents: { ...prev.documents, [field]: file } }));

  const handleTeamChange = (field, value) =>
    setFormData((prev) => ({ ...prev, teamInfo: { ...prev.teamInfo, [field]: value } }));

  const handleMemberChange = (index, value) => {
    const members = [...formData.teamInfo.members];
    members[index] = { name: value };
    setFormData((prev) => ({ ...prev, teamInfo: { ...prev.teamInfo, members } }));
  };

  const addMember = () => {
    if (formData.teamInfo.members.length < (currentActivity.maxTeamSize - 1)) {
      setFormData((prev) => ({
        ...prev,
        teamInfo: { ...prev.teamInfo, members: [...prev.teamInfo.members, { name: '' }] },
      }));
    } else {
      toast.error(`Maximum ${currentActivity.maxTeamSize - 1} additional members allowed.`);
    }
  };

  const removeMember = (index) =>
    setFormData((prev) => ({
      ...prev,
      teamInfo: { ...prev.teamInfo, members: prev.teamInfo.members.filter((_, i) => i !== index) },
    }));

  // When grade changes, clear topic selection (stale selections from another grade)
  const handleAcademicChange = (section, field, value) => {
    handleInputChange(section, field, value);
    if (field === 'currentClass') {
      setFormData((prev) => ({
        ...prev,
        academicInfo:   { ...prev.academicInfo, currentClass: value },
        topicSelection: { selectedTopics: [] }, // reset topics on grade change
      }));
    }
  };

  // ── Payment ─────────────────────────────────────────────────────────────────
  const handlePayment = async (amount, receiptId) => {
    try {
      const res = await api.post('/pay/order', {
        amount: parseInt(amount) * 100, currency: 'INR', receipt: receiptId,
      });
      const order = res.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency,
        name: 'Kalyan Education Trust',
        description: `Payment for ${currentActivity.title}`,
        image: '/assets/KalyanLogo.svg',
        order_id: order.id,
        handler: async (response) => {
          await api.post('/pay/verify', {
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
          });
          toast.success('Payment successful!', { style: { borderRadius: '10px', background: '#030213', color: '#fff' } });
          handleInputChange('payments', 'paymentStatus', true);
          handleInputChange('payments', 'paymentId', response.razorpay_payment_id);

          const formattedAmount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
            .format(order.amount / 100);
          const paymentDate = new Date().toLocaleString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
          });
          sendConfirmationEmail({
            customer_name: userData?.displayName,
            amount: formattedAmount,
            order_id: order.id || receiptId,
            date: paymentDate,
            payment_method: 'Razorpay',
            payment_id: response.razorpay_payment_id,
            billing_email: currentUser?.email || '',
            support_email: 'kalyanconsultancy6800@gmail.com',
            company_name: 'Kalyan Education Trust',
            company_logo_url: '/assets/KalyanLogo.svg',
            company_address: 'Wankaner, Gujarat',
            year: new Date().getFullYear().toString(),
          });
        },
        prefill: { name: userData?.displayName, email: currentUser?.email, contact: userData?.phone },
        theme: { color: '#3399cc' },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Please try again.');
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const error = validateForm(formData, sections, fieldOverrides, currentActivity?.fee ?? 0, topicConfig);
    if (error) {
      toast.error(error, { style: { borderRadius: '10px', background: '#030213', color: '#fff' } });
      setIsSubmitting(false);
      return;
    }

    if (formData.payments.paymentRequired && !formData.payments.paymentStatus) {
      toast.error('Payment is required before submitting.', {
        style: { borderRadius: '10px', background: '#030213', color: '#fff' },
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();

      sections.forEach((section) => {
        if (section === 'documents') return;
        fd.append(section, JSON.stringify(formData[section]));
      });
      fd.append('payments', JSON.stringify(formData.payments));

      if (sections.includes('documents')) {
        if (formData.documents.photo)           fd.append('photo',           formData.documents.photo);
        if (formData.documents.idProof)         fd.append('idProof',         formData.documents.idProof);
        if (formData.documents.academicRecords) fd.append('academicRecords', formData.documents.academicRecords);
      }

      const res    = await api.post(`/api/user/submit/${currentActivity.link}`, fd);
      const result = res.data;

      toast.success('Application submitted successfully!', {
        style: { borderRadius: '10px', background: '#030213', color: '#fff' },
      });
      navigate(`/application/${currentActivity.link}/${result.id}`);
    } catch (err) {
      toast.error('Submission failed. Please try again.', {
        style: { borderRadius: '10px', background: '#030213', color: '#fff' },
      });
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Closed ───────────────────────────────────────────────────────────────────
  if (isClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/30 px-6">
        <Card className="max-w-xl w-full text-center border-none shadow-2xl bg-background/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-destructive">Applications Closed 🚫</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg">
              The application for{' '}
              <span className="font-semibold text-foreground">{currentActivity.title}</span> has been closed.
            </p>
            <p className="text-sm text-muted-foreground">
              Thank you for your interest. Please check back later or explore other active programs.
            </p>
            <Link to="/"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentActivity) return null;

  // ── Shared props for every section ──────────────────────────────────────────
  const sharedSectionProps = {
    formData,
    onChange:       handleAcademicChange, // use the grade-aware handler for all sections
    onFileUpload:   handleFileUpload,
    onTeamChange:   handleTeamChange,
    onMemberChange: handleMemberChange,
    addMember,
    removeMember,
    maxTeamSize:    currentActivity.maxTeamSize ?? 2,
    fee:            currentActivity.fee ?? 0,
    topicConfig,    // passed to topicSelection section
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">

        <motion.div className="mb-8"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.3 }}>
          <Link to="/"
            className="text-sm flex gap-1 items-center px-5 p-3 hover:bg-accent w-fit rounded-lg border bg-secondary/10 transition-all">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
          <CardHeader className="text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}>
              <CardTitle className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Apply For {currentActivity.title}
              </CardTitle>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-4" />
              <p className="text-lg text-muted-foreground mb-6">{currentActivity.description}</p>
              <div className="inline-flex items-center space-x-4 bg-primary/5 px-6 py-3 rounded-2xl">
                <span className="text-muted-foreground">Registration Fee:</span>
                <span className="font-black text-2xl text-primary">
                  {currentActivity.fee === 0 ? 'Free' : `₹${currentActivity.fee}`}
                </span>
              </div>
            </motion.div>
          </CardHeader>
        </Card>

        <motion.form onSubmit={handleSubmit} className="space-y-8 mt-8" encType="multipart/form-data"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}>

          {/* ✅ THE ONLY LOOP — driven by activity.sections[] */}
          {sections.map((sectionKey) => {
            const renderSection = SECTION_REGISTRY[sectionKey];
            if (!renderSection) {
              console.warn(`FormRenderer: unknown section "${sectionKey}" — add to SECTION_REGISTRY.`);
              return null;
            }
            return (
              <div key={sectionKey}>
                {renderSection({ ...sharedSectionProps, overrides: fieldOverrides[sectionKey] || {} })}
              </div>
            );
          })}

          {/* Payment */}
          {formData.payments.paymentRequired && (
            <Card className="w-full p-5 shadow-2xl">
              <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-full">
                    <Banknote className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-base font-semibold">Registration Fee</p>
                    <p className="text-sm text-muted-foreground">One-time payment for processing.</p>
                  </div>
                </div>
                <div className="flex flex-col items-stretch text-center md:text-right md:items-end gap-3 w-full md:w-auto">
                  <p className="text-3xl font-extrabold">₹{currentActivity?.fee}</p>
                  {formData.payments.paymentStatus ? (
                    <span className="flex items-center justify-end gap-1 text-green-600 font-semibold">
                      <CheckCircle size={16} /> Payment Done
                    </span>
                  ) : (
                    <button type="button"
                      onClick={() => handlePayment(currentActivity?.fee, currentUser?.uid)}
                      className="w-full md:w-auto whitespace-nowrap flex items-center gap-1 bg-primary text-primary-foreground p-2 px-3 rounded-lg text-sm cursor-pointer hover:bg-primary/80 transition-all">
                      <Lock size={16} /> Pay Fee Securely
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consent + Submit */}
          <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start space-x-2">
                <Checkbox id="consent" checked={formData.consent}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, consent: checked }))} />
                <Label htmlFor="consent" className="text-sm leading-relaxed">
                  I hereby declare that the information provided above is true and correct to the best of my knowledge.
                  I agree to the terms and conditions of Kalyan Trust and understand that providing false information
                  may lead to disqualification.
                </Label>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="submit"
                  className="flex-1 min-h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground flex items-center justify-center transition-all">
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Submitting...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4 mr-2" /> Submit Application</>
                  )}
                </button>
                <Link to="/"
                  className="h-14 rounded-xl flex items-center justify-center border px-5 hover:bg-accent transition-all">
                  Cancel
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.form>
      </div>

      <Toaster position="bottom-right" />

      {isSubmitting && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-16 w-16 border-4 border-t-transparent border-primary rounded-full animate-spin" />
          <motion.p className="text-white font-semibold text-xl tracking-wide"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Submitting your application...
          </motion.p>
          <motion.div className="text-sm text-white/70"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Please wait while we process your documents ✨
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FormRenderer;