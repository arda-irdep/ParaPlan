import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeHeader = () => {
  const getCurrentGreeting = () => {
    const hour = new Date()?.getHours();
    
    if (hour < 12) {
      return 'Günaydın';
    } else if (hour < 18) {
      return 'İyi öğleden sonra';
    } else {
      return 'İyi akşamlar';
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now?.toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/20 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name="Sun" 
              size={24} 
              color="var(--color-primary)" 
            />
            <h1 className="text-2xl font-bold text-foreground">
              {getCurrentGreeting()}!
            </h1>
          </div>
          
          <p className="text-muted-foreground mb-3">
            {getCurrentDate()}
          </p>
          
          <p className="text-sm text-muted-foreground max-w-md">
            VoiceTracker ile günlük görevlerinizi ve harcamalarınızı sesli komutlarla kolayca yönetin.
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full border-2 border-primary/20">
          <Icon 
            name="Mic2" 
            size={32} 
            color="var(--color-primary)" 
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">
            Sistem aktif
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon 
            name="Globe" 
            size={14} 
            color="var(--color-muted-foreground)" 
          />
          <span className="text-xs text-muted-foreground">
            Türkçe sesli komutlar destekleniyor
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;