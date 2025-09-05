import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ManualEntryForm = ({ onAddTransaction, isRecording }) => {
  const [formData, setFormData] = useState({
    source: '',
    client: '',
    amount: '',
    paymentMethod: '',
    description: ''
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

  const incomeSourceOptions = [
    { value: 'maas', label: 'Maaş' },
    { value: 'freelance', label: 'Freelance İş' },
    { value: 'danismanlik', label: 'Danışmanlık' },
    { value: 'satis', label: 'Satış' },
    { value: 'kira', label: 'Kira Geliri' },
    { value: 'yatirim', label: 'Yatırım Getirisi' },
    { value: 'komisyon', label: 'Komisyon' },
    { value: 'ikramiye', label: 'İkramiye/Bonus' },
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

  const formatAmount = (value) => {
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

  const handleAmountChange = (e) => {
    const formatted = formatAmount(e?.target?.value);
    handleInputChange('amount', formatted);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.source?.trim()) {
      newErrors.source = 'Gelir kaynağı zorunludur';
    }

    if (!formData?.client?.trim()) {
      newErrors.client = 'Müşteri/Şirket adı zorunludur';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Geçerli bir tutar giriniz';
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
      source: formData?.source?.trim(),
      client: formData?.client?.trim(),
      amount: parseFloat(formData?.amount),
      paymentMethod: formData?.paymentMethod,
      description: formData?.description?.trim(),
      timestamp: new Date()
    };

    onAddTransaction(transactionData);
    
    // Reset form
    setFormData({
      source: '',
      client: '',
      amount: '',
      paymentMethod: '',
      description: ''
    });
    setErrors({});
  };

  const clearForm = () => {
    setFormData({
      source: '',
      client: '',
      amount: '',
      paymentMethod: '',
      description: ''
    });
    setErrors({});
  };

  const isFormEmpty = !Object.values(formData)?.some(value => value?.toString()?.trim());

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Edit3" size={20} color="var(--color-success)" />
          <span>Manuel Gelir Girişi</span>
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
          {/* Income Source Select */}
          <Select
            label="Gelir Kaynağı"
            placeholder="Gelir kaynağını seçiniz"
            options={incomeSourceOptions}
            value={formData?.source}
            onChange={(value) => handleInputChange('source', value)}
            error={errors?.source}
            required
            disabled={isRecording}
            className="w-full"
          />

          {/* Client Input */}
          <Input
            label="Müşteri/Şirket"
            type="text"
            placeholder="Örn: ABC Ltd. Şti."
            value={formData?.client}
            onChange={(e) => handleInputChange('client', e?.target?.value)}
            error={errors?.client}
            required
            disabled={isRecording}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Amount Input */}
          <Input
            label="Tutar (TL)"
            type="text"
            placeholder="Örn: 5000.00"
            value={formData?.amount}
            onChange={handleAmountChange}
            error={errors?.amount}
            required
            disabled={isRecording}
            className="w-full"
            description="Ondalık ayırıcı için nokta (.) veya virgül (,) kullanabilirsiniz"
          />

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
        </div>

        {/* Description Input */}
        <Input
          label="Açıklama (İsteğe Bağlı)"
          type="text"
          placeholder="Ek bilgi ve notlar"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          disabled={isRecording}
          className="w-full"
          description="Gelir hakkında ek bilgiler ekleyebilirsiniz"
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
            Gelir Ekle
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