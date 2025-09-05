import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = () => {
  const stats = [
    {
      id: 1,
      title: 'Bu Hafta',
      subtitle: 'Hatırlatıcılar',
      value: '12',
      icon: 'Calendar',
      iconColor: 'var(--color-primary)',
      bgColor: 'bg-primary/10',
      change: '+3',
      changeType: 'increase'
    },
    {
      id: 2,
      title: 'Bu Ay',
      subtitle: 'Gider Kayıtları',
      value: '47',
      icon: 'Receipt',
      iconColor: 'var(--color-secondary)',
      bgColor: 'bg-secondary/10',
      change: '+8',
      changeType: 'increase'
    },
    {
      id: 3,
      title: 'Toplam Tutar',
      subtitle: 'Bu Ay',
      value: '2.450 TL',
      icon: 'TrendingUp',
      iconColor: 'var(--color-accent)',
      bgColor: 'bg-accent/10',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats?.map((stat) => (
        <div 
          key={stat?.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-normal"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon 
                name={stat?.icon} 
                size={20} 
                color={stat?.iconColor}
              />
            </div>
            
            <div className={`
              flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
              ${stat?.changeType === 'increase' ?'bg-success/10 text-success' :'bg-error/10 text-error'
              }
            `}>
              <Icon 
                name={stat?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={12} 
              />
              <span>{stat?.change}</span>
            </div>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-foreground mb-1">
              {stat?.value}
            </p>
            <p className="text-xs text-muted-foreground">
              {stat?.title}
            </p>
            <p className="text-xs text-muted-foreground opacity-75">
              {stat?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCard;