import React from 'react';
import Icon from '../../../components/AppIcon';

const TranscriptionDisplay = ({ 
  transcription, 
  parsedData, 
  isProcessing,
  error 
}) => {
  const highlightParsedText = (text, parsed) => {
    if (!text || !parsed) return text;

    let highlightedText = text;
    
    // Highlight task in blue
    if (parsed?.task) {
      highlightedText = highlightedText?.replace(
        new RegExp(parsed.task, 'gi'),
        `<span class="bg-primary/20 text-primary px-1 rounded">${parsed?.task}</span>`
      );
    }

    // Highlight date in green
    if (parsed?.date) {
      highlightedText = highlightedText?.replace(
        new RegExp(parsed.date, 'gi'),
        `<span class="bg-success/20 text-success px-1 rounded">${parsed?.date}</span>`
      );
    }

    // Highlight time in amber
    if (parsed?.time) {
      highlightedText = highlightedText?.replace(
        new RegExp(parsed.time, 'gi'),
        `<span class="bg-warning/20 text-warning px-1 rounded">${parsed?.time}</span>`
      );
    }

    return highlightedText;
  };

  if (!transcription && !isProcessing && !error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-muted/30 border border-border rounded-lg">
        <div className="text-center">
          <Icon name="MessageSquare" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <p className="text-muted-foreground">
            Ses kaydınız burada görünecek
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Transcription Display */}
      <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-start space-x-3">
          <Icon 
            name={isProcessing ? "Loader2" : error ? "AlertCircle" : "MessageSquare"} 
            size={20} 
            color={error ? "var(--color-error)" : "var(--color-muted-foreground)"}
            className={isProcessing ? "animate-spin" : ""}
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              {isProcessing ? 'Ses işleniyor...' : error ? 'Hata' : 'Ses Metni'}
            </h3>
            
            {error ? (
              <div className="space-y-2">
                <p className="text-error text-sm">{error}</p>
                {/* Add helpful suggestions for common errors */}
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                  <p className="font-medium mb-1">💡 İpuçları:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Mikrofona yakın konuşun</li>
                    <li>"Beni [görev] için yarın saat [saat] hatırlat" formatını kullanın</li>
                    <li>Örnek: "Beni toplantı için yarın saat 14:30'da hatırlat"</li>
                    <li>Ses gelmiyor ise mikrofon izinlerini kontrol edin</li>
                  </ul>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-voice-processing rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-voice-processing rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-voice-processing rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm text-muted-foreground ml-2">Metin çözümleniyor...</span>
              </div>
            ) : (
              <div>
                <div 
                  className="text-foreground leading-relaxed mb-2"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightParsedText(transcription, parsedData) 
                  }}
                />
                {/* Show transcription length and encourage longer speech if too short */}
                {transcription && transcription?.length < 10 && (
                  <p className="text-xs text-warning">
                    ⚠️ Çok kısa ses kaydı algılandı. Lütfen daha detaylı konuşun.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Parsed Data Display */}
      {parsedData && !error && (
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle2" size={20} color="var(--color-success)" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Çözümlenen Bilgiler ✅
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {parsedData?.task && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Görev
                    </p>
                    <p className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                      {parsedData?.task}
                    </p>
                  </div>
                )}
                
                {parsedData?.date && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Tarih
                    </p>
                    <p className="text-sm text-success font-medium bg-success/10 px-2 py-1 rounded">
                      {parsedData?.date}
                    </p>
                  </div>
                )}
                
                {parsedData?.time && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Saat
                    </p>
                    <p className="text-sm text-warning font-medium bg-warning/10 px-2 py-1 rounded">
                      {parsedData?.time}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionDisplay;