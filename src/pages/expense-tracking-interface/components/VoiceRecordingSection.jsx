import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VoiceRecordingSection = ({ onTranscriptionComplete, isRecording, setIsRecording }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Check for Web Speech API support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Tarayıcınız ses tanıma özelliğini desteklemiyor.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'tr-TR';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event?.resultIndex; i < event?.results?.length; i++) {
        if (event?.results?.[i]?.isFinal) {
          finalTranscript += event?.results?.[i]?.[0]?.transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
        // Auto-stop after getting final result
        timeoutRef.current = setTimeout(() => {
          stopRecording();
        }, 1000);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setError(`Ses tanıma hatası: ${event?.error}`);
      setIsListening(false);
      setIsRecording(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsRecording(false);
    };

    return () => {
      if (recognitionRef?.current) {
        recognitionRef?.current?.stop();
      }
      if (timeoutRef?.current) {
        clearTimeout(timeoutRef?.current);
      }
    };
  }, [setIsRecording]);

  const startRecording = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices?.getUserMedia({ audio: true });
      
      setTranscript('');
      setError('');
      setIsRecording(true);
      
      if (recognitionRef?.current) {
        recognitionRef?.current?.start();
      }
    } catch (err) {
      setError('Mikrofon erişimi reddedildi. Lütfen tarayıcı ayarlarından mikrofon iznini etkinleştirin.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef?.current && isListening) {
      recognitionRef?.current?.stop();
    }
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef?.current);
    }
    setIsListening(false);
    setIsRecording(false);
  };

  const processTranscript = () => {
    if (!transcript?.trim()) {
      setError('Lütfen önce bir ses kaydı yapın.');
      return;
    }

    // Parse expense format: "[quantity] [product] arrived from [company]. Price is [amount] TL. Payment method: [method]"
    const expensePattern = /(\d+)\s+(.+?)\s+(.+?)\s+geldi.*?fiyat.*?(\d+(?:[.,]\d+)?)\s*TL.*?ödeme.*?(.+)/i;
    const match = transcript?.match(expensePattern);

    if (match) {
      const [, quantity, product, company, price, paymentMethod] = match;
      const expenseData = {
        quantity: parseInt(quantity),
        product: product?.trim(),
        company: company?.trim(),
        price: parseFloat(price?.replace(',', '.')),
        paymentMethod: paymentMethod?.trim(),
        timestamp: new Date()
      };
      
      onTranscriptionComplete(expenseData);
      setTranscript('');
    } else {
      setError('Ses kaydı anlaşılamadı. Lütfen şu formatta konuşun: "5 kalem ABC şirketinden geldi. Fiyatı 25 TL. Ödeme yöntemi: nakit"');
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setError('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Mic" size={20} color="var(--color-primary)" />
          <span>Sesli Gider Kaydı</span>
        </h2>
        {isRecording && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-voice-recording/10 border border-voice-recording/20 rounded-full">
            <div className="w-2 h-2 bg-voice-recording rounded-full animate-voice-pulse"></div>
            <span className="text-sm font-medium text-voice-recording">Kayıt Alınıyor</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {/* Voice Recording Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            iconName={isRecording ? "Square" : "Mic"}
            iconPosition="left"
            iconSize={20}
            className={`px-8 py-3 ${isRecording ? 'animate-voice-pulse' : ''}`}
            disabled={!!error && !error?.includes('Mikrofon')}
          >
            {isRecording ? 'Kaydı Durdur' : 'Kayda Başla'}
          </Button>

          {transcript && !isRecording && (
            <Button
              variant="outline"
              size="lg"
              onClick={processTranscript}
              iconName="Check"
              iconPosition="left"
              iconSize={18}
              className="px-6 py-3"
            >
              İşle
            </Button>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground">Ses Kaydı:</h3>
              <Button
                variant="ghost"
                size="xs"
                onClick={clearTranscript}
                iconName="X"
                iconSize={14}
                className="text-muted-foreground hover:text-foreground"
              >
                Temizle
              </Button>
            </div>
            <p className="text-sm text-muted-foreground bg-background border border-border rounded p-3">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" className="mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
            <Icon name="Info" size={16} color="var(--color-muted-foreground)" />
            <span>Kullanım Kılavuzu</span>
          </h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Format:</strong> "[miktar] [ürün] [şirket]'den geldi. Fiyatı [tutar] TL. Ödeme yöntemi: [yöntem]"</p>
            <p><strong>Örnek:</strong> "5 kalem ABC şirketinden geldi. Fiyatı 25 TL. Ödeme yöntemi: nakit"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordingSection;