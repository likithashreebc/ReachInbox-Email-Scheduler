import { useState } from 'react';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useSlack } from '@/hooks/useSlack';
import toast from 'react-hot-toast';

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-[#f5f5f5]">
        <h3 className="text-sm font-semibold text-[#0a0a0a]">{title}</h3>
        {description && <p className="text-xs text-[#a3a3a3] mt-0.5">{description}</p>}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f5f5f5] last:border-0">
      <div>
        <p className="text-sm font-medium text-[#0a0a0a]">{label}</p>
        {description && <p className="text-xs text-[#a3a3a3] mt-0.5">{description}</p>}
      </div>
      <div className="ml-6 shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { slack, connect, disconnect } = useSlack();
  const [defaultDelay, setDefaultDelay] = useState('2');
  const [defaultLimit, setDefaultLimit] = useState('200');

  const handleSave = () => toast.success('Settings saved');

  return (
    <>
      <Header title="Settings" description="Manage your account and preferences" />

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl flex flex-col gap-4">

          {/* Profile */}
          <Section title="Profile" description="Your account information">
            <div className="flex items-center gap-4 pb-4 border-b border-[#f5f5f5] mb-4">
              <Avatar src={user?.avatar} name={user?.name ?? 'U'} size="lg" />
              <div>
                <p className="text-sm font-semibold text-[#0a0a0a]">{user?.name}</p>
                <p className="text-xs text-[#737373]">{user?.email}</p>
                <p className="text-xs text-[#a3a3a3] mt-0.5">Signed in with Google</p>
              </div>
            </div>
            <SettingRow label="Display name" description="Used in notifications and reports">
              <Input value={user?.name ?? ''} className="w-48" readOnly />
            </SettingRow>
            <SettingRow label="Email address" description="Your Google account email">
              <Input value={user?.email ?? ''} className="w-48" readOnly />
            </SettingRow>
          </Section>

          {/* Email Sending */}
          <Section title="Email Sending" description="Default configuration for new campaigns">
            <SettingRow label="Default delay between sends" description="Minimum time between each email send">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  value={defaultDelay}
                  onChange={(e) => setDefaultDelay(e.target.value)}
                  className="w-20"
                />
                <span className="text-xs text-[#737373]">seconds</span>
              </div>
            </SettingRow>
            <SettingRow label="Default hourly limit" description="Max emails per hour per sender">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={defaultLimit}
                  onChange={(e) => setDefaultLimit(e.target.value)}
                  className="w-20"
                />
                <span className="text-xs text-[#737373]">emails/hr</span>
              </div>
            </SettingRow>
            <div className="flex justify-end pt-3">
              <Button variant="primary" size="sm" onClick={handleSave}>Save changes</Button>
            </div>
          </Section>

          {/* Integrations */}
          <Section title="Integrations" description="Connect third-party services">
            <div className="flex items-start justify-between py-3">
              <div className="flex items-start gap-3">
                {/* Slack icon */}
                <div className="w-8 h-8 rounded-lg bg-[#4a154b] flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0a0a0a]">Slack</p>
                  <p className="text-xs text-[#737373] mt-0.5">Receive real-time notifications when your sending limit is reached.</p>
                  {slack.connected && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <CheckCircle2 size={11} className="text-[#16a34a]" />
                      <span className="text-xs text-[#16a34a] font-medium">Connected · Notifications enabled</span>
                    </div>
                  )}
                  {!slack.connected && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle size={11} className="text-[#a3a3a3]" />
                      <span className="text-xs text-[#a3a3a3]">Not connected</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="ml-4 shrink-0">
                {slack.connected ? (
                  <Button variant="ghost" size="sm" onClick={disconnect}>Disconnect</Button>
                ) : (
                  <Button variant="secondary" size="sm" icon={<ExternalLink size={12} />} onClick={connect}>
                    Connect Slack
                  </Button>
                )}
              </div>
            </div>
          </Section>

          {/* Security */}
          <Section title="Security">
            <SettingRow label="Authentication" description="Managed via Google OAuth 2.0">
              <span className="text-xs text-[#16a34a] font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> Active
              </span>
            </SettingRow>
            <SettingRow label="Session" description="Your current login session">
              <Button variant="ghost" size="sm" className="text-[#dc2626] hover:bg-[#fef2f2]">
                Sign out all devices
              </Button>
            </SettingRow>
          </Section>

        </div>
      </main>
    </>
  );
}
