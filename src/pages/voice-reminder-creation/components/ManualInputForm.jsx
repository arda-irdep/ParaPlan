import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ManualInputForm = ({ 
  formData, 
  onFormChange, 
  onSubmit, 
  isSubmitting,
  errors 
}) => {
  const handleInputChange = (field, value) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Manuel Hatırlatıcı Girişi
          </h3>
          <p className="text-sm text-muted-foreground">
            Ses kaydı çalışmıyorsa, hatırlatıcınızı manuel olarak girebilirsiniz.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Input */}
          <Input
            label="Görev Açıklaması"
            type="text"
            placeholder="Örn: Doktor randevusuna git"
            value={formData?.task || ''}
            onChange={(e) => handleInputChange('task', e?.target?.value)}
            error={errors?.task}
            required
            description="Ne hatırlatılmasını istiyorsunuz?"
          />

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tarih"
              type="date"
              value={formData?.date || ''}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              error={errors?.date}
              required
              description="Hangi tarihte?"
            />

            <Input
              label="Saat"
              type="time"
              value={formData?.time || ''}
              onChange={(e) => handleInputChange('time', e?.target?.value)}
              error={errors?.time}
              required
              description="Saat kaçta?"
            />
          </div>

          {/* Additional Notes */}
          <Input
            label="Ek Notlar (İsteğe Bağlı)"
            type="text"
            placeholder="Örn: Kimlik kartını unutma"
            value={formData?.notes || ''}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            description="Hatırlatıcıya eklemek istediğiniz notlar"
          />

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              iconName="Calendar"
              iconPosition="left"
              className="flex-1"
              disabled={!formData?.task || !formData?.date || !formData?.time}
            >
              {isSubmitting ? 'Oluşturuluyor...' : 'Hatırlatıcı Oluştur'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onFormChange({ task: '', date: '', time: '', notes: '' })}
              iconName="RotateCcw"
              iconPosition="left"
              disabled={isSubmitting}
            >
              Temizle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualInputForm;