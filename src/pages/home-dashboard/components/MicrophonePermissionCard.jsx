import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MicrophonePermissionCard = () => {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices?.getUserMedia) {
        setPermissionStatus('unsupported');
        return;
      }

      // Try to get user media without storing the stream to check permission
      try {
        const stream = await navigator.mediaDevices?.getUserMedia({ 
          audio: { 
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false 
          } 
        });
        
        // Immediately stop all tracks to release the microphone
        stream?.getTracks()?.forEach(track => track?.stop());
        setPermissionStatus('granted');
      } catch (mediaError) {
        // Handle different types of getUserMedia errors
        if (mediaError?.name === 'NotAllowedError' || mediaError?.name === 'PermissionDeniedError') {
          setPermissionStatus('denied');
        } else if (mediaError?.name === 'NotFoundError' || mediaError?.name === 'DevicesNotFoundError') {
          setPermissionStatus('unsupported');
        } else {
          setPermissionStatus('prompt');
        }
      }
    } catch (error) {
      console.error('Mikrofon izni kontrol edilemedi:', error);
      setPermissionStatus('unknown');
    }
  };

  const requestMicrophonePermission = async () => {
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
      stream?.getTracks()?.forEach(track => track?.stop());
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Mikrofon izni reddedildi:', error);
      setPermissionStatus('denied');
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusConfig = () => {
    switch (permissionStatus) {
      case 'granted':
        return {
          icon: 'CheckCircle',
          iconColor: 'var(--color-success)',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          title: 'Mikrofon Erişimi Aktif',
          description: 'Sesli komutlar kullanıma hazır',
          showButton: false
        };
      case 'denied':
        return {
          icon: 'XCircle',
          iconColor: 'var(--color-error)',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          title: 'Mikrofon Erişimi Reddedildi',
          description: 'Sesli özellikler için tarayıcı ayarlarından izin verin',
          showButton: false
        };
      case 'prompt':
        return {
          icon: 'AlertCircle',
          iconColor: 'var(--color-warning)',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          title: 'Mikrofon İzni Gerekli',
          description: 'Sesli komutlar için mikrofon erişimine izin verin',
          showButton: true
        };
      case 'unsupported':
        return {
          icon: 'AlertTriangle',
          iconColor: 'var(--color-error)',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          title: 'Mikrofon Desteklenmiyor',
          description: 'Tarayıcınız mikrofon erişimini desteklemiyor',
          showButton: false
        };
      default:
        return {
          icon: 'Loader2',
          iconColor: 'var(--color-muted-foreground)',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/20',
          title: 'Mikrofon Durumu Kontrol Ediliyor',
          description: 'Lütfen bekleyin...',
          showButton: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`
      ${config?.bgColor} ${config?.borderColor} border rounded-lg p-4 transition-all duration-normal
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon 
            name={config?.icon} 
            size={20} 
            color={config?.iconColor}
            className={permissionStatus === 'checking' ? 'animate-spin' : ''}
          />
          <div>
            <h4 className="text-sm font-medium text-foreground">
              {config?.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {config?.description}
            </p>
          </div>
        </div>
        
        {config?.showButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={requestMicrophonePermission}
            loading={isRequesting}
            iconName="Mic"
            iconPosition="left"
            iconSize={16}
          >
            İzin Ver
          </Button>
        )}
      </div>
    </div>
  );
};

export default MicrophonePermissionCard;