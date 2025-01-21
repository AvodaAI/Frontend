import { Input } from '@components/ui/input'
import { Mail } from 'lucide-react'
import { Lock } from 'lucide-react'

interface AuthInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmailInput({ value, onChange }: AuthInputProps) {
  return (
    <div className="relative mt-4">
      <Input
        id="email"
        type="email"
        placeholder="Email"
        value={value}
        onChange={onChange}
        required
      />
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80">
        <Mail size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </div>
  )
}

export function PasswordInput({ value, onChange }: AuthInputProps) {
  return (
    <div className="relative mt-4">
      <Input
        id="password"
        type="password"
        placeholder="Password"
        value={value}
        onChange={onChange}
        required
      />
      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80">
        <Lock size={16} strokeWidth={2} aria-hidden="true" />
      </div>
    </div>
  )
}