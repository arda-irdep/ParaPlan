import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionCard = ({ 
  title, 
  description, 
  iconName, 
  route, 
  bgColor = 'bg-card',
  iconColor = 'var(--color-primary)',
  disabled = false 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled) {
      navigate(route);
    }
  };

  return (
    <div className={`
      ${bgColor} border border-border rounded-xl p-6 transition-all duration-normal
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' :'hover:shadow-lg hover:border-primary/20 cursor-pointer transform hover:-translate-y-1'
      }
    `}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`
          w-16 h-16 rounded-full flex items-center justify-center
          ${disabled ? 'bg-muted' : 'bg-primary/10 border-2 border-primary/20'}
          transition-all duration-normal
        `}>
          <Icon 
            name={iconName} 
            size={32} 
            color={disabled ? 'var(--color-muted-foreground)' : iconColor}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>
            {title}
          </h3>
          <p className={`text-sm ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'} max-w-xs`}>
            {description}
          </p>
        </div>

        <Button
          variant={disabled ? "ghost" : "default"}
          size="lg"
          onClick={handleClick}
          disabled={disabled}
          iconName="ArrowRight"
          iconPosition="right"
          iconSize={18}
          className="w-full mt-4"
        >
          {disabled ? 'Yakında' : 'Başlat'}
        </Button>
      </div>
    </div>
  );
};

export default ActionCard;