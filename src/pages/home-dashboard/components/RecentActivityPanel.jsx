import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityPanel = () => {
  const recentActivities = [
    {
      id: 1,
      type: 'reminder',
      title: 'Doktor randevusu',
      description: 'Yarın saat 14:00 için hatırlatıcı oluşturuldu',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      icon: 'Calendar',
      iconColor: 'var(--color-primary)'
    },
    {
      id: 2,
      type: 'expense',
      title: 'Market alışverişi',
      description: '5 adet elma - Migros - 25.50 TL',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      icon: 'Receipt',
      iconColor: 'var(--color-secondary)'
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Toplantı hazırlığı',
      description: 'Pazartesi saat 09:00 için hatırlatıcı oluşturuldu',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      icon: 'Calendar',
      iconColor: 'var(--color-primary)'
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} dakika önce`;
    } else if (hours < 24) {
      return `${hours} saat önce`;
    } else {
      return `${days} gün önce`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Son Aktiviteler
        </h3>
        <Icon 
          name="Activity" 
          size={20} 
          color="var(--color-muted-foreground)" 
        />
      </div>
      <div className="space-y-4">
        {recentActivities?.map((activity) => (
          <div 
            key={activity?.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-fast"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
              <Icon 
                name={activity?.icon} 
                size={16} 
                color={activity?.iconColor}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {activity?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {activity?.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2 opacity-75">
                {formatTimestamp(activity?.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
      {recentActivities?.length === 0 && (
        <div className="text-center py-8">
          <Icon 
            name="Clock" 
            size={32} 
            color="var(--color-muted-foreground)" 
            className="mx-auto mb-2 opacity-50"
          />
          <p className="text-sm text-muted-foreground">
            Henüz aktivite bulunmuyor
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            İlk hatırlatıcınızı veya gider kaydınızı oluşturun
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityPanel;