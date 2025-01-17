// src/app/inviteUser/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { supabase } from '@/utils/supabase/supabaseClient';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert'
import { user_permission } from '@/utils/user-permission';
import { validatePassword } from '@/utils/passwordValidation';
import { useRouter } from 'next/navigation'

export default function InviteUser() {
  const router = useRouter()
  const [userData, setUserData] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (!res.data.user) {
        setError("Invitation Link Expired.")
        router.push("/")
        return
      }
      else {
        setUserData(res.data.user);
      }
    })
      .catch((err) => {
        router.push("/")
      })
  }, [])

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const errorMessage = validatePassword(password, value);
    setError(errorMessage);
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    try {
      const { data: InvitationDetails, error: userError } = await supabase
        .from('invitations')
        .select('*')
        .eq('email_address', userData?.email ?? "");

      if (!InvitationDetails?.length) {
        setError('No valid invitation found.');
        return;
      }
      if (InvitationDetails[0].revoked) {
        setError('Your invitation has been revoked by admin.');
        return;
      }

      if (userError && typeof userError === "object" && "message" in userError) {
        setError((userError as { message: string }).message);
      }

      if (userData?.id) {
        const { error: supaBaseError } = await supabase.auth.admin.updateUserById(
          userData?.id,
          { password }
        )
        if (supaBaseError) {
          setError(supaBaseError?.message);
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const { data, error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: InvitationDetails?.[0]?.public_metadata?.first_name ?? "",
          last_name: InvitationDetails?.[0]?.public_metadata?.last_name ?? "",
          email: userData?.email,
          password: hashedPassword,
          role: InvitationDetails?.[0]?.public_metadata?.role ?? 'employee',
          position: InvitationDetails?.[0]?.public_metadata?.role ?? 'employee',
          hire_date: new Date(InvitationDetails?.[0]?.hire_date),
          created_at: new Date(),
          auth_id: userData?.id,
          organization_ids: [InvitationDetails?.[0]?.organization_id]
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
      }

      const { error } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', InvitationDetails?.[0].id);

      if (error) {
        setError(error.message);
      }

      const { error: permissionError } = await supabase.from("permissions").insert({
        permissions: user_permission,
        organization_id: Number(InvitationDetails?.[0]?.organization_id),
        user_id: Number(data?.id),
        granted_by: InvitationDetails?.[0]?.created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      if (permissionError) {
        setError(permissionError?.message || 'Failed to add permission');
      }

    } catch (error) {
      //TODO: [AV-143] The error handling in the form submission is inconsistent and could lead to unhandled promise rejections. Implement proper error handling and avoid throwing errors in the catch block.
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setTimeout(() => {
        redirect('/');
      }, 3000)
    }
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <Button type="submit" disabled={!password || !confirmPassword || !!error}>Set Password</Button>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
