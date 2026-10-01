import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Users, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { emailApi } from '@/services/email.api';
import type { SchedulePayload } from '@/types';
import { pluralize, formatFullDate } from '@/utils';

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  subject: string;
  body: string;
  senderEmail: string;
  startDate: string;
  startTime: string;
  delaySeconds: number;
  hourlyLimit: number;
}

const defaultForm: FormState = {
  subject: '',
  body: '',
  senderEmail: '',
  startDate: '',
  startTime: '',
  delaySeconds: 2,
  hourlyLimit: 200,
};

export function ComposeModal({ open, onClose, onSuccess }: ComposeModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'compose' | 'confirm'>('compose');
  const [form, setForm] = useState<FormState>(defaultForm);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'recipients', string>>>({});

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));

  const validate = () => {
    const e: typeof errors = {};
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.body.trim()) e.body = 'Body is required';
    if (!form.senderEmail.trim()) e.senderEmail = 'Sender email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail)) e.senderEmail = 'Enter a valid email address';
    if (!form.startDate || !form.startTime) e.startDate = 'Start date and time are required';
    if (recipients.length === 0) e.recipients = 'Upload a CSV with at least one email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep('confirm');
  };

  const handleSchedule = async () => {
    setLoading(true);
    try {
      const payload: SchedulePayload = {
        recipients,
        subject: form.subject,
        body: form.body,
        senderEmail: form.senderEmail,
        startTime: new Date(`${form.startDate}T${form.startTime}`).toISOString(),
        delayBetweenMs: form.delaySeconds * 1000,
        hourlyLimit: form.hourlyLimit,
      };
      const res = await emailApi.schedule(payload);
      toast.success(`${res.scheduled.toLocaleString()} emails scheduled successfully`);
      onSuccess();
      handleClose();
      navigate('/scheduled');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg ?? 'Failed to schedule emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('compose');
    setForm(defaultForm);
    setRecipients([]);
    setErrors({});
    onClose();
  };

  const startDateTime = form.startDate && form.startTime
    ? new Date(`${form.startDate}T${form.startTime}`)
    : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={step === 'compose' ? 'Compose Email' : 'Confirm Schedule'}
      description={step === 'compose' ? 'Create a scheduled outreach campaign.' : 'Review your campaign before scheduling.'}
    >
      {step === 'compose' ? (
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Recipients */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#525252] flex items-center gap-1.5">
                <Users size={12} /> Recipients
              </label>
              {recipients.length > 0 && (
                <span className="text-xs text-[#16a34a] font-medium">{pluralize(recipients.length, 'address')} loaded</span>
              )}
            </div>
            <FileUpload
              emails={recipients}
              onEmails={setRecipients}
              onClear={() => setRecipients([])}
            />
            {errors.recipients && <p className="text-xs text-[#dc2626]">{errors.recipients}</p>}
          </div>

          {/* Subject */}
          <Input
            label="Subject"
            placeholder="Enter email subject"
            value={form.subject}
            onChange={set('subject')}
            error={errors.subject}
          />

          {/* Body */}
          <Textarea
            label="Body"
            placeholder="Write your email body here. HTML is supported."
            rows={5}
            value={form.body}
            onChange={set('body')}
            error={errors.body}
          />

          {/* Sender */}
          <Input
            label="Sender Email"
            type="email"
            placeholder="hello@yourcompany.com"
            value={form.senderEmail}
            onChange={set('senderEmail')}
            error={errors.senderEmail}
          />

          {/* Scheduling */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#525252] flex items-center gap-1.5">
              <Calendar size={12} /> Schedule
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                placeholder="Start date"
                value={form.startDate}
                onChange={set('startDate')}
                error={errors.startDate}
              />
              <Input
                type="time"
                placeholder="Start time"
                value={form.startTime}
                onChange={set('startTime')}
              />
            </div>
          </div>

          {/* Sending config */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#525252] flex items-center gap-1.5">
              <Clock size={12} /> Sending Configuration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Delay between emails (seconds)"
                type="number"
                min={0}
                value={form.delaySeconds}
                onChange={set('delaySeconds')}
                hint="Minimum delay between each send"
              />
              <Input
                label="Hourly limit"
                type="number"
                min={1}
                max={1000}
                value={form.hourlyLimit}
                onChange={set('hourlyLimit')}
                hint="Max emails per hour per sender"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#f5f5f5]">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button variant="secondary">Save Draft</Button>
            <Button variant="primary" icon={<ArrowRight size={13} />} onClick={handleNext}>
              Review
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Summary */}
          <div className="bg-[#fafafa] border border-[#e5e5e5] rounded-lg divide-y divide-[#f0f0f0]">
            {[
              { label: 'Recipients', value: pluralize(recipients.length, 'email') },
              { label: 'Subject', value: form.subject },
              { label: 'Sender', value: form.senderEmail },
              { label: 'Starting', value: startDateTime ? formatFullDate(startDateTime) : '—' },
              { label: 'Delay between sends', value: `${form.delaySeconds} second${form.delaySeconds !== 1 ? 's' : ''}` },
              { label: 'Hourly limit', value: `${form.hourlyLimit.toLocaleString()} emails/hour` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-[#737373]">{label}</span>
                <span className="text-sm font-medium text-[#0a0a0a] text-right max-w-[260px] truncate">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#a3a3a3]">
            Emails will be sent via Ethereal SMTP. You can monitor progress in the Scheduled tab.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-[#f5f5f5]">
            <Button variant="ghost" icon={<ArrowLeft size={13} />} onClick={() => setStep('compose')}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              icon={<Send size={13} />}
              onClick={handleSchedule}
            >
              Schedule {recipients.length.toLocaleString()} Emails
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
