type VehiclePurchaseUnavailableProps = {
  variant: 'booked' | 'sold' | 'superseded';
};

const copy = {
  booked: {
    title: 'Vehicle booked',
    body: 'Another buyer has secured this vehicle. Browse similar listings or contact UZA Mobility for help.',
  },
  sold: {
    title: 'Vehicle sold',
    body: 'This vehicle has been sold. Browse our catalog for other available options.',
  },
  superseded: {
    title: 'No longer available to you',
    body: 'Another buyer completed payment first. Your reservation or booking for this vehicle was cancelled. Contact UZA Mobility if you need assistance.',
  },
} as const;

export function VehiclePurchaseUnavailable({
  variant,
}: VehiclePurchaseUnavailableProps) {
  const message = copy[variant];

  return (
    <div className="rounded-xl border border-[#E9E9E9] bg-[#f8faf9] p-4 text-sm text-[#356769]">
      <p className="font-medium text-[#151515]">{message.title}</p>
      <p className="mt-2">{message.body}</p>
    </div>
  );
}
