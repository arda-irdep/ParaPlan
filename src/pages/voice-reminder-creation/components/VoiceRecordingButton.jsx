import React from 'react';

import Button from '../../../components/ui/Button';

const VoiceRecordingButton = ({ 
  isRecording, 
  isProcessing, 
  audioLevel, 
  onStartRecording, 
  onStopRecording,
  hasPermission 
}) => {
  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isRecording) return 'recording';
    return 'idle';
  };

  const getButtonText = () => {
    if (isProcessing) return 'İşleniyor...';
    if (isRecording) return 'Kaydı Durdur';
    return 'Ses Kaydı Başlat';
  };

  const getButtonIcon = () => {
    if (isProcessing) return 'Loader2';
    if (isRecording) return 'Square';
    return 'Mic';
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Recording Button */}
      <div className="relative">
        {/* Audio Level Visualization */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-voice-recording/30 animate-ping"></div>
        )}
        
        <Button
          variant={buttonState === 'recording' ? 'destructive' : 'default'}
          size="xl"
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isProcessing || !hasPermission}
          iconName={getButtonIcon()}
          iconSize={32}
          className={`
            w-24 h-24 sm:w-32 sm:h-32 rounded-full shadow-xl transition-all duration-300
            ${buttonState === 'recording' ?'bg-voice-recording hover:bg-voice-recording/90 text-white animate-voice-pulse' 
              : buttonState === 'processing' ?'bg-voice-processing hover:bg-voice-processing/90 text-white' :'bg-primary hover:bg-primary/90 text-primary-foreground'
            }
            ${isRecording ? 'scale-110' : 'hover:scale-105'}
          `}
        >
          <span className="sr-only">{getButtonText()}</span>
        </Button>

        {/* Audio Level Indicator */}
        {isRecording && audioLevel > 0 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              {[...Array(5)]?.map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-1 bg-voice-recording rounded-full transition-all duration-100
                    ${audioLevel > (i + 1) * 20 ? 'h-4' : 'h-2 opacity-30'}
                  `}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Button Label */}
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">
          {getButtonText()}
        </p>
        {!hasPermission && (
          <p className="text-sm text-error mt-1">
            Mikrofon izni gerekli
          </p>
        )}
        {isRecording && (
          <p className="text-sm text-muted-foreground mt-1">
            Hatırlatıcınızı söyleyin...
          </p>
        )}
      </div>
      {/* Recording Status Indicator */}
      {isRecording && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-voice-recording/10 border border-voice-recording/20 rounded-full">
          <div className="w-2 h-2 bg-voice-recording rounded-full animate-voice-pulse"></div>
          <span className="text-sm font-medium text-voice-recording">
            Kayıt devam ediyor
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecordingButton;