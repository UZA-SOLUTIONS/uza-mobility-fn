'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/permissions';
import {
  useApplyOperatorProfile,
  useMyOperatorProfile,
  useUpdateMyOperatorProfile,
} from '@/queries/operator';

export function OperatorProfilePanel() {
  const { hasOperatorWorkspace } = usePermissions();
  const { data, isLoading } = useMyOperatorProfile();
  const applyMutation = useApplyOperatorProfile();
  const updateMutation = useUpdateMyOperatorProfile();

  const [businessName, setBusinessName] = useState('');
  const [businessRegNumber, setBusinessRegNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('RW');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const profile = data ?? null;
  const canUpdate = hasOperatorWorkspace && Boolean(profile);
  const isBusy = applyMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!profile) return;
    setBusinessName((current) => current || profile.businessName || '');
    setBusinessRegNumber(
      (current) => current || profile.businessRegNumber || '',
    );
    setContactPerson((current) => current || profile.contactPerson || '');
    setPhone((current) => current || profile.phone || '');
    setEmail((current) => current || profile.email || '');
    setCountry((current) => current || profile.country || 'RW');
    setCity((current) => current || profile.city || '');
    setAddress((current) => current || profile.address || '');
    setDescription((current) => current || profile.description || '');
  }, [profile]);

  const submitApply = () =>
    applyMutation.mutate({
      businessName,
      businessRegNumber: businessRegNumber || undefined,
      contactPerson,
      phone,
      email,
      country,
      city,
      address: address || undefined,
      description: description || undefined,
    });

  const submitUpdate = () =>
    updateMutation.mutate({
      businessName: businessName || undefined,
      businessRegNumber: businessRegNumber || undefined,
      contactPerson: contactPerson || undefined,
      phone: phone || undefined,
      email: email || undefined,
      country: country || undefined,
      city: city || undefined,
      address: address || undefined,
      description: description || undefined,
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operator profile"
        description="Submit or update your charging operator company details."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {profile
              ? `Status: ${profile.status}`
              : 'Operator application / profile'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : null}

          {!hasOperatorWorkspace ? (
            <p className="text-sm text-muted-foreground">
              You do not have operator permissions yet. Submit an application
              below. If you already applied, your review may still be pending.
            </p>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Business name</Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={profile?.businessName ?? 'UZA Charging Ltd'}
              />
            </div>
            <div className="space-y-1">
              <Label>Registration number</Label>
              <Input
                value={businessRegNumber}
                onChange={(e) => setBusinessRegNumber(e.target.value)}
                placeholder={profile?.businessRegNumber ?? 'Optional'}
              />
            </div>
            <div className="space-y-1">
              <Label>Contact person</Label>
              <Input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder={profile?.contactPerson ?? 'Jane Doe'}
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={profile?.phone ?? '+250...'}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={profile?.email ?? 'ops@example.com'}
              />
            </div>
            <div className="space-y-1">
              <Label>Country (2 letters)</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                placeholder={profile?.country ?? 'RW'}
              />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={profile?.city ?? 'Kigali'}
              />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={profile?.address ?? 'Optional'}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={profile?.description ?? 'Optional'}
            />
          </div>

          <div className="flex gap-2">
            {!canUpdate ? (
              <Button onClick={submitApply} disabled={isBusy}>
                Submit application
              </Button>
            ) : (
              <Button onClick={submitUpdate} disabled={isBusy}>
                Save profile updates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
