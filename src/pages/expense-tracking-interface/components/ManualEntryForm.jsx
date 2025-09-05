import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ManualEntryForm = ({ onAddTransaction, isRecording }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    product: '',
    company: '',
    price: '',
    paymentMethod: ''
  });
  const [errors, setErrors] = useState({});

  const paymentMethodOptions = [
    { value: 'nakit', label: 'Nakit' },
    { value: 'kredi_karti', label: 'Kredi Kartı' },
    { value: 'banka_karti', label: 'Banka Kartı' },
    { value: 'havale', label: 'Havale/EFT' },
    { value: 'cek', label: 'Çek' },
    { value: 'kripto', label: 'Kripto Para' },
    { value: 'diger', label: 'Diğer' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatPrice = (value) => {
    // Remove non-numeric characters except comma and dot
    const cleaned = value?.replace(/[^\d.,]/g, '');
    
    // Replace comma with dot for decimal
    const withDot = cleaned?.replace(',', '.');
    
    // Ensure only one decimal point
    const parts = withDot?.split('.');
    if (parts?.length > 2) {
      return parts?.[0] + '.' + parts?.slice(1)?.join('');
    }
    
    return withDot;
  };

  const handlePriceChange = (e) => {
    const formatted = formatPrice(e?.target?.value);
    handleInputChange('price', formatted);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.quantity || parseInt(formData?.quantity) <= 0) {
      newErrors.quantity = 'Geçerli bir miktar giriniz';
    }

    if (!formData?.product?.trim()) {
      newErrors.product = 'Ürün adı zorunludur';
    }

    if (!formData?.company?.trim()) {
      newErrors.company = 'Şirket adı zorunludur';
    }

    if (!formData?.price || parseFloat(formData?.price) <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }

    if (!formData?.paymentMethod) {
      newErrors.paymentMethod = 'Ödeme yöntemi seçiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData = {
      quantity: parseInt(formData?.quantity),
      product: formData?.product?.trim(),
      company: formData?.company?.trim(),
      price: parseFloat(formData?.price),
      paymentMethod: formData?.paymentMethod,
      timestamp: new Date()
    };

    onAddTransaction(transactionData);
    
    // Reset form
    setFormData({
      quantity: '',
      product: '',
      company: '',
      price: '',
      paymentMethod: ''
    });
    setErrors({});
  };

  const clearForm = () => {
    setFormData({
      quantity: '',
      product: '',
      company: '',
      price: '',
      paymentMethod: ''
    });
    setErrors({});
  };

  const isFormEmpty = !Object.values(formData)?.some(value => value?.toString()?.trim());

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Edit3" size={20} color="var(--color-primary)" />
          <span>Manuel Gider Girişi</span>
        </h2>
        {!isFormEmpty && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearForm}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
            className="text-muted-foreground hover:text-foreground"
          >
            Temizle
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quantity Input */}
          <Input
            label="Miktar"
            type="number"
            placeholder="Örn: 5"
            value={formData?.quantity}
            onChange={(e) => handleInputChange('quantity', e?.target?.value)}
            error={errors?.quantity}
            required
            min="1"
            disabled={isRecording}
            className="w-full"
          />

          {/* Product Input */}
          <Input
            label="Ürün Adı"
            type="text"
            placeholder="Örn: Kalem, Defter, Bilgisayar"
            value={formData?.product}
            onChange={(e) => handleInputChange('product', e?.target?.value)}
            error={errors?.product}
            required
            disabled={isRecording}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Input */}
          <Input
            label="Tedarikçi/Şirket"
            type="text"
            placeholder="Örn: ABC Ltd. Şti."
            value={formData?.company}
            onChange={(e) => handleInputChange('company', e?.target?.value)}
            error={errors?.company}
            required
            disabled={isRecording}
            className="w-full"
          />

          {/* Price Input */}
          <Input
            label="Fiyat (TL)"
            type="text"
            placeholder="Örn: 25.50"
            value={formData?.price}
            onChange={handlePriceChange}
            error={errors?.price}
            required
            disabled={isRecording}
            className="w-full"
            description="Ondalık ayırıcı için nokta (.) veya virgül (,) kullanabilirsiniz"
          />
        </div>

        {/* Payment Method Select */}
        <Select
          label="Ödeme Yöntemi"
          placeholder="Ödeme yöntemi seçiniz"
          options={paymentMethodOptions}
          value={formData?.paymentMethod}
          onChange={(value) => handleInputChange('paymentMethod', value)}
          error={errors?.paymentMethod}
          required
          disabled={isRecording}
          className="w-full"
        />

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="default"
            size="lg"
            iconName="Plus"
            iconPosition="left"
            iconSize={18}
            disabled={isRecording || isFormEmpty}
            className="px-8"
          >
            Gider Ekle
          </Button>
        </div>
      </form>
      {/* Recording Warning */}
      {isRecording && (
        <div className="mt-4 bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
            <p className="text-sm text-warning">
              Ses kaydı devam ederken manuel giriş devre dışıdır
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualEntryForm;