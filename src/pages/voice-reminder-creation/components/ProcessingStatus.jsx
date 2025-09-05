import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingStatus = ({ 
  status, 
  message, 
  calendarUrl, 
  onCreateAnother, 
  onGoHome,
  error 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: 'Loader2',
          iconColor: 'var(--color-voice-processing)',
          bgColor: 'bg-voice-processing/10',
          borderColor: 'border-voice-processing/20',
          textColor: 'text-voice-processing',
          animate: 'animate-spin'
        };
      case 'success':
        return {
          icon: 'CheckCircle2',
          iconColor: 'var(--color-success)',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success',
          animate: ''
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          iconColor: 'var(--color-error)',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error',
          animate: ''
        };
      default:
        return null;
    }
  };

  if (!status) return null;

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`p-6 ${config?.bgColor} border ${config?.borderColor} rounded-lg`}>
        <div className="flex items-start space-x-4">
          <Icon 
            name={config?.icon} 
            size={24} 
            color={config?.iconColor}
            className={config?.animate}
          />
          
          <div className="flex-1">
            <div className="mb-4">
              <h3 className={`text-lg font-semibold ${config?.textColor} mb-2`}>
                {status === 'processing' && 'İşleniyor...'}
                {status === 'success' && 'Hatırlatıcı Oluşturuldu!'}
                {status === 'error' && 'Hata Oluştu'}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>

            {/* Success Actions */}
            {status === 'success' && calendarUrl && (
              <div className="space-y-4">
                {/* Calendar Link */}
                <div className="p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Calendar" size={16} color="var(--color-primary)" />
                    <span className="text-sm font-medium text-foreground">
                      Google Takvim Bağlantısı
                    </span>
                  </div>
                  <a 
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 underline break-all"
                  >
                    Takvimde Aç
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    onClick={onCreateAnother}
                    iconName="Plus"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Yeni Hatırlatıcı
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onGoHome}
                    iconName="Home"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Ana Sayfaya Dön
                  </Button>
                </div>
              </div>
            )}

            {/* Error Actions */}
            {status === 'error' && (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 bg-error/5 border border-error/20 rounded-lg">
                    <p className="text-sm text-error">
                      {error}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="default"
                    onClick={onCreateAnother}
                    iconName="RotateCcw"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Tekrar Dene
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onGoHome}
                    iconName="Home"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Ana Sayfaya Dön
                  </Button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {status === 'processing' && (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-voice-processing rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-voice-processing rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-voice-processing rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Lütfen bekleyin...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;