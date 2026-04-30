import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, CheckCircle, Download, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Cards';
import toast, { Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';

import { activities } from '../constants/Apply';
import { FieldWidget } from './FieldWidget';
import { groupBySection, buildInitialValues, validateAll, SECTION_LABELS } from '../lib/formUtils';
import api from '../lib/api';
import { useAuth } from '../utils/AuthProvider';

// ─── Email ────────────────────────────────────────────────────────────────────
const EMAIL_SERVICE_ID = 'service_h7x526j';
const EMAIL_TEMPLATE_ID = 'template_v87pkxg';
const EMAIL_PUBLIC_KEY = 'AVIwzEQbBV_Q4mLkn';

function sendConfirmationEmail(params) {
  emailjs
    .send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, params, { publicKey: EMAIL_PUBLIC_KEY })
    .then(() => toast.success('Confirmation email sent!'))
    .catch((err) => console.error('Email error:', err));
}

// ─── Main component ───────────────────────────────────────────────────────────
const FormRenderer = () => {
  const formName = window.location.pathname.split('/')[2];
  const activity = activities.find((a) => a.link === formName);
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const [isClosed, setIsClosed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState(() =>
    buildInitialValues(activity?.fields ?? [])
  );
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    if (!activity) { navigate('/'); return; }
    if (activity.status === 'closed') setIsClosed(true);
    document.title = `Kalyan | ${activity.title}`;
  }, []);

  // ── Single setter for all field values ──────────────────────────────────────
  const set = (id, value) => setValues((prev) => ({ ...prev, [id]: value }));

  const handleChange = (id, value) => {
    if (id === 'currentClass') {
      const topicField = activity?.fields.find((f) => f.type === 'topic-picker');
      if (topicField) {
        setValues((prev) => ({ ...prev, [id]: value, [topicField.id]: [] }));
        return;
      }
    }
    set(id, value);
  };

  // ── Payment ─────────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    try {
      const res = await api.post('/pay/order', {
        amount: activity.fee * 100,
        currency: 'INR',
        receipt: currentUser?.uid
      });
      const { order, key } = res.data;
      const options = {
        key: key,
        amount: order.amount, currency: order.currency,
        name: 'Kalyan Education Trust',
        description: `Payment for ${activity.title}`,
        image: '/assets/KalyanLogo.svg',
        order_id: order.id,
        handler: async (response) => {
          await api.post('/pay/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success('Payment successful!');
          setPaymentDone(true);
          setPaymentId(response.razorpay_payment_id);

          sendConfirmationEmail({
            customer_name: userData?.displayName,
            amount: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.amount / 100),
            order_id: order.id,
            date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            payment_id: response.razorpay_payment_id,
            billing_email: currentUser?.email ?? '',
            support_email: 'kalyanconsultancy6800@gmail.com',
            company_name: 'Kalyan Education Trust',
            company_address: 'Wankaner, Gujarat',
            year: String(new Date().getFullYear()),
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

    // Validate all fields from schema
    const error = validateAll(activity.fields, values);
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
      return;
    }

    // Payment gate
    if (activity.fee > 0 && !paymentDone) {
      toast.error('Please complete payment before submitting.');
      setIsSubmitting(false);
      return;
    }

    try {
      const fd = new FormData();

      // Dynamically append everything from schema — no hardcoded keys
      for (const field of activity.fields) {
        const val = values[field.id];
        if (field.type === 'file') {
          if (val) fd.append(field.id, val);
        } else {
          fd.append(field.id, JSON.stringify(val));
        }
      }

      // Payment metadata
      fd.append('_payment', JSON.stringify({
        required: activity.fee > 0,
        status: paymentDone,
        id: paymentId,
        amount: activity.fee,
      }));

      const res = await api.post(`/api/user/submit/${activity.link}`, fd);
      const result = res.data;

      toast.success('Application submitted successfully!');
      navigate(`/application/${activity.link}/${result.id}`);
    } catch (err) {
      toast.error('Submission failed. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Closed screen ─────────────────────────────────────────────────────────
  if (isClosed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-secondary/30 px-6">
        <Card className="max-w-xl w-full text-center border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-destructive">Applications Closed 🚫</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-lg">
              The application for <span className="font-semibold">{activity?.title}</span> has been closed.
            </p>
            <Link to="/" className="inline-flex items-center mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activity) return null;

  // ── Group fields into sections for rendering ─────────────────────────────────
  const sections = groupBySection(activity.fields);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">

        <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link to="/" className="text-sm flex gap-1 items-center px-5 p-3 hover:bg-accent w-fit rounded-lg border bg-secondary/10 transition-all">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
          <CardHeader className="text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <CardTitle className="text-3xl lg:text-4xl font-black mb-4">
                Apply For {activity.title}
              </CardTitle>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-4" />
              <p className="text-lg text-muted-foreground mb-6">{activity.description}</p>
              <div className="inline-flex items-center space-x-4 bg-primary/5 px-6 py-3 rounded-2xl">
                <span className="text-muted-foreground">Registration Fee:</span>
                <span className="font-black text-2xl text-primary">
                  {activity.fee === 0 ? 'Free' : `₹${activity.fee}`}
                </span>
              </div>
            </motion.div>
          </CardHeader>
        </Card>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8 mt-8"
          encType="multipart/form-data"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Render sections from schema */}
          {Object.entries(sections).map(([sectionKey, fields]) => (
            <Card key={sectionKey} className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
              <CardHeader className="text-xl font-bold">
                {SECTION_LABELS[sectionKey] ?? sectionKey}
              </CardHeader>
              <CardContent>
                <div className="">
                  {fields.map((field) => (
                    <div key={field.id} className={field.colSpan === 2 ? 'col-span-full' : ''}>
                      <FieldWidget
                        field={field}
                        value={values[field.id]}
                        onChange={(v) => handleChange(field.id, v)}
                        allValues={values}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {activity.downloadPdf ? <a href={activity.downloadPdf} className="w-full flex-1 min-h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground flex items-center justify-center transition-all">
            Download PDF <Download />
          </a> : <></>}
          {/* Payment (only if fee > 0) */}
          {activity.fee > 0 && (
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
                <div className="flex flex-col items-end gap-3">
                  <p className="text-3xl font-extrabold">₹{activity.fee}</p>
                  {paymentDone ? (
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <CheckCircle size={16} /> Payment Done
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePayment}
                      className="flex items-center gap-1 bg-primary text-primary-foreground p-2 px-4 rounded-lg text-sm hover:bg-primary/80 transition-all"
                    >
                      <Lock size={16} /> Pay Securely
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 min-h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground flex items-center justify-center transition-all"
                >
                  {isSubmitting ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Submitting...</>
                  ) : (
                    <><CheckCircle className="h-4 w-4 mr-2" /> Submit Application</>
                  )}
                </button>
                <Link to="/" className="h-14 rounded-xl flex items-center justify-center border px-5 hover:bg-accent transition-all">
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-4"
        >
          <div className="h-16 w-16 border-4 border-t-transparent border-primary rounded-full animate-spin" />
          <p className="text-white font-semibold text-xl">Submitting your application...</p>
          <p className="text-sm text-white/70">Please wait while we process your documents ✨</p>
        </motion.div>
      )}
    </div>
  );
};

export default FormRenderer;