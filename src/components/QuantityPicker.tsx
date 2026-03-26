import { Minus, Plus } from "lucide-react";

interface QuantityPickerProps {
  quantity: number;
  onChangeQuantity: (qty: number) => void;
}

const QuantityPicker = ({ quantity, onChangeQuantity }: QuantityPickerProps) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
        className="w-10 h-10 rounded-lg border-2 border-foreground flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
      <button
        onClick={() => onChangeQuantity(quantity + 1)}
        className="w-10 h-10 rounded-lg border-2 border-foreground flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantityPicker;
