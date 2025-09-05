import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FormatGuidance = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const examples = [
    {
      command: "Beni yarın saat 14:00'te doktor randevusuna git diye hatırlat",
      task: "doktor randevusuna git",
      date: "yarın",
      time: "14:00"
    },
    {
      command: "15 Ocak saat 09:30\'da toplantıya katıl diye hatırlat",
      task: "toplantıya katıl",
      date: "15 Ocak",
      time: "09:30"
    },
    {
      command: "Pazartesi günü saat 18:00\'de spor salonuna git diye hatırlat",
      task: "spor salonuna git",
      date: "Pazartesi günü",
      time: "18:00"
    },
    {
      command: "Beni 22.25\'te toplantıya katıl diye hatırlat",
      task: "toplantıya katıl",
      date: "bugün",
      time: "22:25"
    },
    {
      command: "14.30'da doktora git diye hatırlat",
      task: "doktora git", 
      date: "bugün",
      time: "14:30"
    }
  ];

  const timeKeywords = [
    "yarın", "bugün", "pazartesi", "salı", "çarşamba", "perşembe", "cuma", "cumartesi", "pazar",
    "gelecek hafta", "önümüzdeki hafta", "bu hafta"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="HelpCircle" size={20} color="var(--color-primary)" />
            <h3 className="text-lg font-semibold text-foreground">
              Nasıl Kullanılır?
            </h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            className="sm:hidden"
          >
            {isExpanded ? 'Gizle' : 'Detaylar'}
          </Button>
        </div>

        {/* Basic Format */}
        <div className="mb-6">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium text-primary mb-2">
              Temel Format:
            </p>
            <code className="text-sm text-foreground bg-background px-2 py-1 rounded">
              "Beni [tarih] saat [saat]'te [görev] diye hatırlat"
            </code>
          </div>
        </div>

        {/* Expandable Content */}
        <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
          {/* Examples */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Örnek Komutlar:
            </h4>
            <div className="space-y-3">
              {examples?.map((example, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground mb-2">
                    "{example?.command}"
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                      Görev: {example?.task}
                    </span>
                    <span className="bg-success/20 text-success px-2 py-1 rounded">
                      Tarih: {example?.date}
                    </span>
                    <span className="bg-warning/20 text-warning px-2 py-1 rounded">
                      Saat: {example?.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time Keywords */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Desteklenen Zaman İfadeleri:
            </h4>
            <div className="flex flex-wrap gap-2">
              {timeKeywords?.map((keyword, index) => (
                <span 
                  key={index}
                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Lightbulb" size={16} color="var(--color-success)" className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success mb-2">
                  İpuçları:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Net ve açık konuşun</li>
                  <li>• Tarih ve saati belirtmeyi unutmayın</li>
                  <li>• Saat formatı: 14:30 veya 14.30 şeklinde kullanabilirsiniz</li>
                  <li>• Tüm saatler İstanbul saatine göre ayarlanır</li>
                  <li>• Gürültülü ortamlardan kaçının</li>
                  <li>• Ses kaydı çalışmazsa manuel girişi kullanın</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatGuidance;