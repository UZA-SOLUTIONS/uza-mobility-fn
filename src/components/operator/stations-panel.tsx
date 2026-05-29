'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  parseStationCoordinates,
  StationLocationFields,
} from '@/components/operator/station-location-fields';
import { StatusBadge } from '@/components/admin/shared/status-badge';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useAddStationCompatibility,
  useCreateStation,
  useCreateStationPort,
  useMyChargingStations,
  useSetStationPricing,
  useSubmitStation,
  useUpdateStation,
  useUploadStationPhotos,
} from '@/queries/operator';
import type {
  ChargingStationFilters,
  StationStatus,
} from '@/types/operator/stations';

const stationStatuses = [
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
] as const;

export function OperatorStationsPanel() {
  const [status, setStatus] = useState<'ALL' | StationStatus>('ALL');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('RW');
  const [description, setDescription] = useState('');
  const [locationType, setLocationType] = useState<
    'PUBLIC' | 'PRIVATE' | 'SEMI_PUBLIC' | 'FLEET_ONLY'
  >('PUBLIC');
  const [operationalStatus, setOperationalStatus] = useState<
    'OPERATIONAL' | 'PARTIALLY_OPERATIONAL' | 'OFFLINE' | 'MAINTENANCE'
  >('OPERATIONAL');
  const [isOpen24h, setIsOpen24h] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [hasWifi, setHasWifi] = useState(false);
  const [hasRestroom, setHasRestroom] = useState(false);
  const [hasCCTV, setHasCCTV] = useState(false);
  const [hasRoofCover, setHasRoofCover] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [portNumber, setPortNumber] = useState('');
  const [chargerType, setChargerType] = useState<
    'AC_TYPE2' | 'DC_CCS' | 'DC_CHADEMO' | 'DC_GBDC' | 'AC_TYPE1' | 'TESLA_WALL'
  >('DC_CCS');
  const [speedCategory, setSpeedCategory] = useState<
    'SLOW' | 'FAST' | 'RAPID' | 'ULTRA_RAPID'
  >('FAST');
  const [powerKw, setPowerKw] = useState('60');
  const [currentType, setCurrentType] = useState<'AC' | 'DC'>('DC');
  const [portStatus, setPortStatus] = useState<
    'AVAILABLE' | 'IN_USE' | 'FAULTED' | 'OUT_OF_SERVICE'
  >('AVAILABLE');

  const [pricingModel, setPricingModel] = useState<
    'PER_KWH' | 'PER_MINUTE' | 'PER_SESSION' | 'FREE'
  >('PER_KWH');
  const [rateAmount, setRateAmount] = useState('0.35');
  const [currency, setCurrency] = useState('USD');
  const [pricingNotes, setPricingNotes] = useState('');

  const [vehicleCategory, setVehicleCategory] = useState<
    'PASSENGER_EV' | 'TWO_THREE_WHEEL' | 'COMMERCIAL_EV'
  >('PASSENGER_EV');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const filters = useMemo<ChargingStationFilters>(
    () => ({
      status: status === 'ALL' ? undefined : status,
      limit: 20,
      page: 1,
    }),
    [status],
  );
  const stations = useMyChargingStations(filters);
  const createStation = useCreateStation();
  const updateStation = useUpdateStation();
  const submitStation = useSubmitStation();
  const createPort = useCreateStationPort();
  const setPricing = useSetStationPricing();
  const addCompatibility = useAddStationCompatibility();
  const uploadPhotos = useUploadStationPhotos();

  const stationItems = stations.data?.items ?? [];
  const selectedStation = stationItems.find(
    (item) => item.id === selectedStationId,
  );

  useEffect(() => {
    if (!selectedStation) return;
    if (selectedStation.latitude != null) {
      setLatitude(String(selectedStation.latitude));
    }
    if (selectedStation.longitude != null) {
      setLongitude(String(selectedStation.longitude));
    }
  }, [selectedStation]);

  const createDraft = () => {
    const coords = parseStationCoordinates(latitude, longitude);
    if (!coords) {
      toast.error(
        'Enter valid map coordinates (latitude and longitude) for this station.',
      );
      return;
    }
    createStation.mutate({
      name,
      address,
      city,
      country,
      latitude: coords.latitude,
      longitude: coords.longitude,
      description: description || undefined,
      locationType,
      isOpen24h,
      hasCCTV,
      hasParking,
      hasRestroom,
      hasRoofCover,
      hasWifi,
      operationalStatus,
    });
  };

  const saveStationLocation = () => {
    const coords = parseStationCoordinates(latitude, longitude);
    if (!coords || !selectedStationId) {
      toast.error('Enter valid map coordinates before saving.');
      return;
    }
    updateStation.mutate({
      id: selectedStationId,
      body: {
        latitude: coords.latitude,
        longitude: coords.longitude,
      },
    });
  };

  const submitSelectedStation = (stationId: string) => {
    const station = stationItems.find((item) => item.id === stationId);
    if (station?.latitude == null || station?.longitude == null) {
      toast.error(
        'Set GPS coordinates on this station before submitting for review.',
      );
      return;
    }
    submitStation.mutate(stationId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My charging stations"
        description="Create drafts, add ports/pricing, upload photos and submit."
      />

      <Card>
        <CardHeader>
          <CardTitle>Create station draft</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Station name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
            />
          </div>
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <StationLocationFields
            latitude={latitude}
            longitude={longitude}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Location type</Label>
              <Select
                value={locationType}
                onValueChange={(v) => setLocationType(v as typeof locationType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                  <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                  <SelectItem value="SEMI_PUBLIC">SEMI_PUBLIC</SelectItem>
                  <SelectItem value="FLEET_ONLY">FLEET_ONLY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Operational status</Label>
              <Select
                value={operationalStatus}
                onValueChange={(v) =>
                  setOperationalStatus(v as typeof operationalStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERATIONAL">OPERATIONAL</SelectItem>
                  <SelectItem value="PARTIALLY_OPERATIONAL">
                    PARTIALLY_OPERATIONAL
                  </SelectItem>
                  <SelectItem value="OFFLINE">OFFLINE</SelectItem>
                  <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={isOpen24h} onCheckedChange={setIsOpen24h} /> Open
              24h
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={hasParking} onCheckedChange={setHasParking} />{' '}
              Parking
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={hasWifi} onCheckedChange={setHasWifi} /> Wifi
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={hasRestroom} onCheckedChange={setHasRestroom} />{' '}
              Restroom
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={hasCCTV} onCheckedChange={setHasCCTV} /> CCTV
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={hasRoofCover}
                onCheckedChange={setHasRoofCover}
              />{' '}
              Roof cover
            </label>
          </div>
          <Button disabled={createStation.isPending} onClick={createDraft}>
            Create draft
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Station list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3 max-w-xs">
            <Label>Filter by status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as 'ALL' | StationStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {stationStatuses.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stationItems.map((station) => (
                  <TableRow key={station.id}>
                    <TableCell>{station.name}</TableCell>
                    <TableCell>
                      <StatusBadge status={station.status} />
                    </TableCell>
                    <TableCell>{station.ports?.length ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={submitStation.isPending}
                        onClick={() => submitSelectedStation(station.id)}
                      >
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {stationItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No stations yet.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Station setup tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedStationId}
            onValueChange={setSelectedStationId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stationItems.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedStation ? (
            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              {selectedStation.name} · {selectedStation.address} · status{' '}
              <span className="font-medium text-foreground">
                {selectedStation.status}
              </span>
              {selectedStation.latitude != null &&
              selectedStation.longitude != null ? (
                <>
                  {' '}
                  · {selectedStation.latitude.toFixed(5)},{' '}
                  {selectedStation.longitude.toFixed(5)}
                </>
              ) : (
                <span className="text-destructive"> · GPS not set</span>
              )}
            </div>
          ) : null}

          {selectedStationId ? (
            <div className="space-y-2">
              <StationLocationFields
                latitude={latitude}
                longitude={longitude}
                onLatitudeChange={setLatitude}
                onLongitudeChange={setLongitude}
              />
              <Button
                variant="outline"
                disabled={!selectedStationId || updateStation.isPending}
                onClick={saveStationLocation}
              >
                Save map location
              </Button>
            </div>
          ) : null}

          <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Update selected station description</Label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <Button
                variant="outline"
                disabled={!selectedStationId || updateStation.isPending}
                onClick={() =>
                  updateStation.mutate({
                    id: selectedStationId,
                    body: { description: description || undefined },
                  })
                }
              >
                Save station update
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Add charging port</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <Input
                  placeholder="Port number"
                  value={portNumber}
                  onChange={(event) => setPortNumber(event.target.value)}
                />
                <NumberInput
                  placeholder="Power kW"
                  value={powerKw}
                  onChange={(event) => setPowerKw(event.target.value)}
                />
                <Select
                  value={chargerType}
                  onValueChange={(v) => setChargerType(v as typeof chargerType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC_TYPE2">AC_TYPE2</SelectItem>
                    <SelectItem value="DC_CCS">DC_CCS</SelectItem>
                    <SelectItem value="DC_CHADEMO">DC_CHADEMO</SelectItem>
                    <SelectItem value="DC_GBDC">DC_GBDC</SelectItem>
                    <SelectItem value="AC_TYPE1">AC_TYPE1</SelectItem>
                    <SelectItem value="TESLA_WALL">TESLA_WALL</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={speedCategory}
                  onValueChange={(v) =>
                    setSpeedCategory(v as typeof speedCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SLOW">SLOW</SelectItem>
                    <SelectItem value="FAST">FAST</SelectItem>
                    <SelectItem value="RAPID">RAPID</SelectItem>
                    <SelectItem value="ULTRA_RAPID">ULTRA_RAPID</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={currentType}
                  onValueChange={(v) => setCurrentType(v as typeof currentType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="DC">DC</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={portStatus}
                  onValueChange={(v) => setPortStatus(v as typeof portStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                    <SelectItem value="IN_USE">IN_USE</SelectItem>
                    <SelectItem value="FAULTED">FAULTED</SelectItem>
                    <SelectItem value="OUT_OF_SERVICE">
                      OUT_OF_SERVICE
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                disabled={!selectedStationId || createPort.isPending}
                onClick={() =>
                  createPort.mutate({
                    stationId: selectedStationId,
                    portNumber: portNumber || undefined,
                    chargerType,
                    speedCategory,
                    powerKw: Number(powerKw),
                    currentType,
                    status: portStatus,
                    isActive: true,
                  })
                }
              >
                Add port
              </Button>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Set pricing</Label>
              <div className="grid gap-2 md:grid-cols-2">
                <Select
                  value={pricingModel}
                  onValueChange={(v) =>
                    setPricingModel(v as typeof pricingModel)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PER_KWH">PER_KWH</SelectItem>
                    <SelectItem value="PER_MINUTE">PER_MINUTE</SelectItem>
                    <SelectItem value="PER_SESSION">PER_SESSION</SelectItem>
                    <SelectItem value="FREE">FREE</SelectItem>
                  </SelectContent>
                </Select>
                <NumberInput
                  placeholder="Rate amount"
                  value={rateAmount}
                  onChange={(event) => setRateAmount(event.target.value)}
                />
                <Input
                  placeholder="Currency"
                  value={currency}
                  onChange={(event) =>
                    setCurrency(event.target.value.toUpperCase())
                  }
                />
              </div>
              <Textarea
                placeholder="Pricing notes"
                value={pricingNotes}
                onChange={(event) => setPricingNotes(event.target.value)}
              />
              <Button
                variant="outline"
                disabled={!selectedStationId || setPricing.isPending}
                onClick={() =>
                  setPricing.mutate({
                    stationId: selectedStationId,
                    pricingModel,
                    rateAmount:
                      pricingModel === 'FREE' ? undefined : Number(rateAmount),
                    currency,
                    notes: pricingNotes || undefined,
                    validFrom: new Date().toISOString(),
                    isActive: true,
                  })
                }
              >
                Save pricing
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Add vehicle compatibility</Label>
              <div className="grid gap-2">
                <Select
                  value={vehicleCategory}
                  onValueChange={(v) =>
                    setVehicleCategory(v as typeof vehicleCategory)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASSENGER_EV">PASSENGER_EV</SelectItem>
                    <SelectItem value="TWO_THREE_WHEEL">
                      TWO_THREE_WHEEL
                    </SelectItem>
                    <SelectItem value="COMMERCIAL_EV">COMMERCIAL_EV</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Brand (optional)"
                  value={vehicleBrand}
                  onChange={(event) => setVehicleBrand(event.target.value)}
                />
                <Input
                  placeholder="Model (optional)"
                  value={vehicleModel}
                  onChange={(event) => setVehicleModel(event.target.value)}
                />
              </div>
              <Button
                variant="outline"
                disabled={!selectedStationId || addCompatibility.isPending}
                onClick={() =>
                  addCompatibility.mutate({
                    stationId: selectedStationId,
                    vehicleCategory,
                    isVerified: false,
                    brand: vehicleBrand || undefined,
                    model: vehicleModel || undefined,
                  })
                }
              >
                Save compatibility
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <Label>Upload station photos</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(event) =>
                setFiles(Array.from(event.currentTarget.files ?? []))
              }
            />
            <Button
              disabled={
                !selectedStationId || files.length < 1 || uploadPhotos.isPending
              }
              onClick={() =>
                uploadPhotos.mutate({ stationId: selectedStationId, files })
              }
            >
              Upload photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
