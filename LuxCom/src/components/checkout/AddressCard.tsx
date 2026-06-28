type AddressCardProps = {
  name: string;
  address: string;
  onChange?: () => void;
};

export function AddressCard({ name, address, onChange }: AddressCardProps) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-elevation-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-md uppercase text-on-surface-variant">Shipping Address</p>
          <p className="mt-1 text-body-md font-semibold text-on-surface">{name}</p>
          <p className="text-body-md text-on-surface-variant">{address}</p>
        </div>
        {onChange && (
          <button
            type="button"
            onClick={onChange}
            className="text-label-md font-semibold text-primary-container"
          >
            CHANGE
          </button>
        )}
      </div>
    </div>
  );
}

type PaymentCardProps = {
  label: string;
  detail: string;
  onEdit?: () => void;
};

export function PaymentCard({ label, detail, onEdit }: PaymentCardProps) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-elevation-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-md uppercase text-on-surface-variant">Payment Method</p>
          <p className="mt-1 text-body-md font-semibold text-on-surface">{label}</p>
          <p className="text-body-md text-on-surface-variant">{detail}</p>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-label-md font-semibold text-primary-container"
          >
            EDIT
          </button>
        )}
      </div>
    </div>
  );
}
