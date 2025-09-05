import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import ActionCard from './components/ActionCard';
import MicrophonePermissionCard from './components/MicrophonePermissionCard';
import RecentActivityPanel from './components/RecentActivityPanel';
import WelcomeHeader from './components/WelcomeHeader';
import QuickStatsCard from './components/QuickStatsCard';

const HomeDashboard = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check for success messages from navigation state or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams?.get('success');
    
    if (success) {
      let message = '';
      switch (success) {
        case 'reminder':
          message = 'Hatırlatıcı başarıyla oluşturuldu!';
          break;
        case 'expense':
          message = 'Gider kaydı başarıyla eklendi!';
          break;
        default:
          message = 'İşlem başarıyla tamamlandı!';
      }
      
      setSuccessMessage(message);
      setShowSuccessMessage(true);
      
      // Clear URL parameter
      window.history?.replaceState({}, document.title, window.location?.pathname);
      
      // Hide message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, []);

  const actionCards = [
    {
      title: 'Hatırlatıcı',
      description: 'Sesli komutlarla Google Takvim hatırlatıcıları oluşturun',
      iconName: 'Calendar',
      route: '/voice-reminder-creation',
      bgColor: 'bg-card',
      iconColor: 'var(--color-primary)'
    },
    {
      title: 'Gelir/Giderler',
      description: 'Harcamalarınızı kaydedin ve Excel dosyası olarak indirin',
      iconName: 'Receipt',
      route: '/expense-tracking-interface',
      bgColor: 'bg-card',
      iconColor: 'var(--color-secondary)'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center space-x-3">
              <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-success font-medium">{successMessage}</p>
              <button 
                onClick={() => setShowSuccessMessage(false)}
                className="ml-auto text-success hover:text-success/80"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Welcome Header */}
          <WelcomeHeader />

          {/* Microphone Permission Card */}
          <div className="mb-6">
            <MicrophonePermissionCard />
          </div>

          {/* Quick Stats */}
          <QuickStatsCard />

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {actionCards?.map((card, index) => (
              <ActionCard
                key={index}
                title={card?.title}
                description={card?.description}
                iconName={card?.iconName}
                route={card?.route}
                bgColor={card?.bgColor}
                iconColor={card?.iconColor}
              />
            ))}
          </div>

          {/* Recent Activity Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentActivityPanel />
            </div>
            
            {/* Connection Status */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Bağlantı Durumu
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Google Takvim</span>
                    </div>
                    <span className="text-xs text-success">Bağlı</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Sesli Komutlar</span>
                    </div>
                    <span className="text-xs text-success">Aktif</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Bildirimler</span>
                    </div>
                    <span className="text-xs text-warning">Beklemede</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Hızlı İpuçları
                </h3>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Hatırlatıcı için: "Beni [görev] için [tarih] [saat]'te hatırlat"</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Gider için: "[miktar] [ürün] [şirket]'ten geldi. Fiyat [tutar] TL"</p>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <p>Mikrofon izni vermeyi unutmayın</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;