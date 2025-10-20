import React, { useState, useEffect, useCallback } from 'react';
import { Product, VariantGroup, VariantOption, ModifierGroup, ModifierOption, SelectedVariant, SelectedModifier, CartItem, OrderTypeDetails } from '../types';
import Modal from './Modal';
import { calculateItemPrice } from '../utils/pricing';

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (itemDraft: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  itemToEdit?: CartItem | null;
  orderType: OrderTypeDetails | null;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, product, onAddToCart, itemToEdit, orderType }) => {
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(product?.basePrice || 0);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>([]);
  const [selectedModifiers, setSelectedModifiers] = useState<SelectedModifier[]>([]);
  const [modifierError, setModifierError] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');

  const isEditing = !!itemToEdit;

  const initializeSelections = useCallback(() => {
    if (!product) return;

    if (isEditing && itemToEdit) {
      // Populate state from the item being edited
      setQuantity(itemToEdit.quantity);
      setSelectedVariants(itemToEdit.selectedVariants);
      setSelectedModifiers(itemToEdit.selectedModifiers);
      setNotes(itemToEdit.notes || '');
    } else {
      // Initialize for a new item
      const initialVariants: SelectedVariant[] = [];
      product.variants?.forEach(vg => {
        if (vg.options.length > 0) {
          const defaultOption = vg.options[0];
          initialVariants.push({
            variantGroupId: vg.id,
            optionId: defaultOption.id,
            optionName: defaultOption.name,
            priceAdjustment: defaultOption.priceAdjustment,
          });
        }
      });
      setSelectedVariants(initialVariants);

      const initialModifiers: SelectedModifier[] = [];
      product.modifiers?.forEach(mg => {
        mg.options.forEach(opt => {
          if (opt.defaultSelected) {
            initialModifiers.push({
              modifierGroupId: mg.id,
              optionId: opt.id,
              optionName: opt.name,
              priceAdjustment: opt.priceAdjustment,
            });
          }
        });
      });
      setSelectedModifiers(initialModifiers);
      setQuantity(1);
      setNotes('');
    }
    setModifierError({});
  }, [product, isEditing, itemToEdit]);

  useEffect(() => {
    if (isOpen && product) {
      initializeSelections();
    }
  }, [isOpen, product, initializeSelections]);

  useEffect(() => {
    if (product) {
      setCurrentPrice(calculateItemPrice(product, selectedVariants, selectedModifiers, orderType));
    }
  }, [product, selectedVariants, selectedModifiers, orderType]);

  const handleVariantChange = (variantGroup: VariantGroup, option: VariantOption) => {
    setSelectedVariants(prev => {
      const otherVariants = prev.filter(v => v.variantGroupId !== variantGroup.id);
      return [...otherVariants, { 
        variantGroupId: variantGroup.id, 
        optionId: option.id, 
        optionName: option.name,
        priceAdjustment: option.priceAdjustment 
      }];
    });
  };

  const handleModifierChange = (modifierGroup: ModifierGroup, option: ModifierOption, isSelected: boolean) => {
    setSelectedModifiers(prev => {
      const currentSelectionsForGroup = prev.filter(m => m.modifierGroupId === modifierGroup.id);
      let newSelections = prev.filter(m => m.modifierGroupId !== modifierGroup.id);

      if (isSelected) {
        if (currentSelectionsForGroup.length < modifierGroup.maxSelection) {
          newSelections.push(...currentSelectionsForGroup, { 
            modifierGroupId: modifierGroup.id, 
            optionId: option.id, 
            optionName: option.name,
            priceAdjustment: option.priceAdjustment 
          });
          setModifierError(errs => ({...errs, [modifierGroup.id]: ''}));
        } else {
           setModifierError(errs => ({...errs, [modifierGroup.id]: `Max ${modifierGroup.maxSelection} selections for ${modifierGroup.name}`}));
           return prev;
        }
      } else {
        newSelections.push(...currentSelectionsForGroup.filter(m => m.optionId !== option.id));
      }
      return newSelections;
    });
  };
  
  const validateModifiers = useCallback(() => {
    if (!product || !product.modifiers) return true;
    let isValid = true;
    const errors: Record<string, string> = {};

    for (const mg of product.modifiers) {
      const currentSelectionsCount = selectedModifiers.filter(sm => sm.modifierGroupId === mg.id).length;
      if (currentSelectionsCount < mg.minSelection) {
        errors[mg.id] = `${mg.name} requires at least ${mg.minSelection} selection(s).`;
        isValid = false;
      } else {
        errors[mg.id] = ''; // Clear previous error if valid
      }
    }
    setModifierError(errors);
    return isValid;
  }, [product, selectedModifiers]);


  useEffect(() => {
    validateModifiers();
  }, [selectedModifiers, validateModifiers]);


  const handleAddToCartClick = () => {
    if (!product || !validateModifiers()) {
       alert("Please check your selections for modifiers.");
       return;
    }

    onAddToCart({
      product,
      quantity,
      selectedVariants,
      selectedModifiers,
      unitPrice: currentPrice,
      notes: notes.trim(),
    });
    onClose();
  };
  
  const isAddToCartDisabled = () => {
    if (!product) return true;
    return Object.values(modifierError).some(err => err !== '');
  };

  if (!product) return null;

  const modalFooter = (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-4 py-1.5 border-t border-b border-gray-200 text-gray-700">{quantity}</span>
        <button 
          onClick={() => setQuantity(q => q + 1)}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCartClick}
        disabled={isAddToCartDisabled()}
        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isEditing ? 'Update Item' : 'Add'} for Rp {(currentPrice * quantity).toLocaleString('id-ID')}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isEditing ? 'Edit' : 'Customize'} ${product.name}`} footerContent={modalFooter}>
      <div className="space-y-6">
        {product.variants?.map(vg => (
          <div key={vg.id} className="border-b pb-4 last:border-b-0">
            <h4 className="text-lg font-medium text-gray-700 mb-2">{vg.name}</h4>
            <div className="space-y-2">
              {vg.options.map(opt => (
                <label key={opt.id} className="flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all">
                  <input
                    type="radio"
                    name={vg.id}
                    value={opt.id}
                    checked={selectedVariants.some(v => v.variantGroupId === vg.id && v.optionId === opt.id)}
                    onChange={() => handleVariantChange(vg, opt)}
                    className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">{opt.name}</span>
                  {opt.priceAdjustment !== 0 && (
                    <span className="ml-auto text-sm text-gray-500">
                      {opt.priceAdjustment > 0 ? `+Rp ${opt.priceAdjustment.toLocaleString('id-ID')}` : `-Rp ${Math.abs(opt.priceAdjustment).toLocaleString('id-ID')}`}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}

        {product.modifiers?.map(mg => (
          <div key={mg.id} className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-baseline">
                 <h4 className="text-lg font-medium text-gray-700 mb-1">{mg.name}</h4>
                 <p className="text-sm text-gray-500">
                    {mg.minSelection === mg.maxSelection && mg.minSelection > 0 ? `(Choose ${mg.minSelection})` :
                     mg.minSelection > 0 && mg.maxSelection > mg.minSelection ? `(Choose ${mg.minSelection}-${mg.maxSelection})` :
                     mg.minSelection === 0 && mg.maxSelection > 0 ? `(Up to ${mg.maxSelection})` : ''}
                 </p>
            </div>
             {modifierError[mg.id] && <p className="text-sm text-red-500 mb-2">{modifierError[mg.id]}</p>}
            <div className="space-y-2">
              {mg.options.map(opt => {
                const isChecked = selectedModifiers.some(m => m.modifierGroupId === mg.id && m.optionId === opt.id);
                const currentSelectionsForGroup = selectedModifiers.filter(m => m.modifierGroupId === mg.id).length;
                const isDisabled = !isChecked && currentSelectionsForGroup >= mg.maxSelection;

                return (
                  <label key={opt.id} className={`flex items-center p-3 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="checkbox"
                      name={`${mg.id}-${opt.id}`}
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={(e) => handleModifierChange(mg, opt, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="ml-3 text-gray-700">{opt.name}</span>
                    {opt.priceAdjustment !== 0 && (
                      <span className="ml-auto text-sm text-gray-500">
                        {opt.priceAdjustment > 0 ? `+Rp ${opt.priceAdjustment.toLocaleString('id-ID')}` : `-Rp ${Math.abs(opt.priceAdjustment).toLocaleString('id-ID')}`}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        
        <div>
            <label htmlFor="item-notes" className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
            </label>
            <textarea
                id="item-notes"
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., no onions, extra spicy"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
        </div>

         <div className="pt-4">
            <h4 className="text-lg font-semibold text-gray-800">Item Price: Rp {currentPrice.toLocaleString('id-ID')}</h4>
        </div>
      </div>
    </Modal>
  );
};

export default SelectionModal;