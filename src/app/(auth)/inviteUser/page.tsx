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

export default function InviteUser() {
  const [userData, setUserData] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      setUserData(res.data.user);
    }).catch((err) => {
      redirect("/")
    })
  }, [])

  const handleConfirmPasswordChange = (e: React.ChangeEvent) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setError('Password and Confirm Password do not match');
    } else if (value.length < 8) {
      setError('Password must be at least 8 characters long');
    } else if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)) {
      setError('Password must contain at least one number and one special character');
    } else {
      setError(null);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    try {
      // update password in supabase authentication

      const { data: InvitationDetails, error: userError } = await supabase
        .from('invitations')
        .select('*')
        .eq('email_address', userData?.email);

      if (InvitationDetails?.[0].revoked) {
        setError('Your invitation has been revoked by admin.');
        return;
      }

      if (userError) {
        throw new Error(userError?.message);
      }

      if (userData?.id) {
        const { error: supaBaseError } = await supabase.auth.admin.updateUserById(
          userData?.id,
          { password }
        )
        if (supaBaseError) {
          throw new Error(supaBaseError?.message);
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: InvitationDetails?.[0]?.public_metadata?.first_name ?? null,
          last_name: InvitationDetails?.[0]?.public_metadata?.last_name ?? null,
          email: userData?.email,
          password: hashedPassword,
          role: 'employee',
          position: InvitationDetails?.[0]?.public_metadata?.role ?? '',
          hire_date: new Date(InvitationDetails?.[0]?.hire_date),
          created_at: new Date(),
          auth_id: userData?.id,
          organization_ids: [InvitationDetails?.[0]?.organization_id]
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const { error } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', InvitationDetails?.[0].id);

      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('An unexpected error occurred');
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
          {/* {error && <p className="text-red-600 text-sm mt-1">{error}</p>} */}
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
