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
  const { hasOperatorWorkspace, hasOperatorApplication, user } =
    usePermissions();
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
  const applicationStatus = profile?.status ?? user?.operator?.status ?? null;
  const hasSubmittedApplication = Boolean(profile) || hasOperatorApplication;
  const isPendingReview = applicationStatus === 'PENDING';
  const isRejected = applicationStatus === 'REJECTED';
  const canSaveUpdates = hasOperatorWorkspace || isRejected;
  const formDisabled =
    hasSubmittedApplication && isPendingReview && !hasOperatorWorkspace;
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
        description="Submit your charging operator company details. Business address is for contact and review; station GPS coordinates are set when you add each charging site."
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {applicationStatus
              ? `Status: ${applicationStatus}`
              : 'Operator application'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : null}

          {isPendingReview && !hasOperatorWorkspace ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              Your application is under review. You cannot submit again until an
              administrator decides. After approval, sign out and sign back in
              (or wait a few minutes and refresh) to unlock station management.
            </p>
          ) : null}

          {isRejected ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              Your application was rejected. Update your details below and save
              to resubmit for review.
              {profile?.adminNotes ? ` Note: ${profile.adminNotes}` : null}
            </p>
          ) : null}

          {!hasOperatorWorkspace && !hasSubmittedApplication ? (
            <p className="text-sm text-muted-foreground">
              Submit your company profile to apply. An administrator will review
              it before you can add charging stations on the map.
            </p>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label>Business name</Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={profile?.businessName ?? 'UZA Charging Ltd'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Registration number</Label>
              <Input
                value={businessRegNumber}
                onChange={(e) => setBusinessRegNumber(e.target.value)}
                placeholder={profile?.businessRegNumber ?? 'Optional'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Contact person</Label>
              <Input
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder={profile?.contactPerson ?? 'Jane Doe'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={profile?.phone ?? '+250...'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={profile?.email ?? 'ops@example.com'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Country (2 letters)</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                placeholder={profile?.country ?? 'RW'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={profile?.city ?? 'Kigali'}
                disabled={formDisabled}
              />
            </div>
            <div className="space-y-1">
              <Label>Business address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  profile?.address ?? 'Office / HQ address (optional)'
                }
                disabled={formDisabled}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={profile?.description ?? 'Optional'}
              disabled={formDisabled}
            />
          </div>

          <div className="flex gap-2">
            {!hasSubmittedApplication ? (
              <Button onClick={submitApply} disabled={isBusy}>
                Submit application
              </Button>
            ) : null}
            {hasSubmittedApplication && canSaveUpdates ? (
              <Button onClick={submitUpdate} disabled={isBusy}>
                Save profile updates
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
