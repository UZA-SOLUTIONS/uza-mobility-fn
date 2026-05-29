'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';

type StationLocationFieldsProps = {
  latitude: string;
  longitude: string;
  onLatitudeChange: (value: string) => void;
  onLongitudeChange: (value: string) => void;
  disabled?: boolean;
};

export function StationLocationFields({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  disabled = false,
}: StationLocationFieldsProps) {
  const [geoError, setGeoError] = useState<string | null>(null);

  const useCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLatitudeChange(String(position.coords.latitude));
        onLongitudeChange(String(position.coords.longitude));
      },
      () => {
        setGeoError(
          'Could not read your location. Enter latitude and longitude manually.',
        );
      },
      { enableHighAccuracy: true, timeout: 15_000 },
    );
  };

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <Label>Map coordinates (required)</Label>
        <p className="text-xs text-muted-foreground">
          Stations need the real GPS point on the map (not just the street
          address). Use your device location at the site or enter coordinates
          from Google Maps.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="station-latitude">Latitude</Label>
          <NumberInput
            id="station-latitude"
            placeholder="-1.9441"
            value={latitude}
            onChange={(event) => onLatitudeChange(event.target.value)}
            disabled={disabled}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="station-longitude">Longitude</Label>
          <NumberInput
            id="station-longitude"
            placeholder="30.0619"
            value={longitude}
            onChange={(event) => onLongitudeChange(event.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={useCurrentLocation}
      >
        Use my current location
      </Button>
      {geoError ? <p className="text-xs text-destructive">{geoError}</p> : null}
    </div>
  );
}

export function parseStationCoordinates(
  latitude: string,
  longitude: string,
): { latitude: number; longitude: number } | null {
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  return { latitude: lat, longitude: lng };
}
