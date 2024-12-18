'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { supabase } from '@/utils/supabase/supabaseClient';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';


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

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setError('Password and Confirm Password do not match');
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
      const { data: userDetails, error: userError } = await supabase
        .from('invitations')
        .select('*')
        .eq('email_address', userData?.email);

      if (userError) {
        throw new Error(userError?.message);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const { error: insertError } = await supabase
        .from("users")
        .insert({
          first_name: userDetails?.[0]?.public_metadata?.first_name ?? '',
          last_name: userDetails?.[0]?.public_metadata?.last_name ?? '',
          email: userData?.email,
          password: hashedPassword,
          position: userDetails?.[0]?.public_metadata?.role ?? '',
          hire_date: new Date(userDetails?.[0]?.hire_date),
          created_at: new Date(),
          auth_id: userData?.id,
          organizations: [userDetails?.[0]?.organization_id]
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const { error } = await supabase
        .from('invitations')
        .update({ status: 'accepted' })
        .eq('id', userDetails?.[0].id);

      if (error) {
        throw new Error(error.message);
      }

      redirect('/');
    } catch (error) {
      console.log('Error ===>: ', error);
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
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
        <Button type="submit">Set Password</Button>
      </form>
    </div>
  );
}
