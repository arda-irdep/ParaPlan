import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ isVoiceRecording = false, className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Ana Sayfa',
      path: '/home-dashboard',
      icon: 'Home',
      description: 'Dashboard ve genel bakış'
    },
    {
      label: 'Hatırlatıcı',
      path: '/voice-reminder-creation',
      icon: 'Mic',
      description: 'Sesli hatırlatıcı oluştur'
    },
    {
      label: 'Gider Takibi',
      path: '/expense-tracking-interface',
      icon: 'Receipt',
      description: 'Harcama kayıtları'
    }
  ];

  const currentPath = location?.pathname;
  const currentItem = navigationItems?.find(item => item?.path === currentPath);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-100 bg-card border-b border-border transition-all duration-normal ${isVoiceRecording ? 'shadow-voice-glow' : 'shadow-sm'} ${className}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon 
                name="Mic2" 
                size={24} 
                color="var(--color-primary-foreground)" 
                className="drop-shadow-sm"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                VoiceTracker
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                Sesli Üretkenlik Asistanı
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => {
              const isActive = currentPath === item?.path;
              return (
                <Button
                  key={item?.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item?.path)}
                  iconName={item?.icon}
                  iconPosition="left"
                  iconSize={18}
                  className={`
                    px-4 py-2 transition-all duration-fast
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                    ${isVoiceRecording && isActive ? 'animate-voice-pulse' : ''}
                  `}
                  disabled={isVoiceRecording && !isActive}
                >
                  {item?.label}
                </Button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconSize={20}
              className="text-muted-foreground hover:text-foreground"
              disabled={isVoiceRecording}
            />
          </div>

          {/* Voice Recording Indicator */}
          {isVoiceRecording && (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-voice-recording/10 border border-voice-recording/20 rounded-full">
              <div className="w-2 h-2 bg-voice-recording rounded-full animate-voice-pulse"></div>
              <span className="text-sm font-medium text-voice-recording">
                Kayıt Alınıyor
              </span>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item) => {
                const isActive = currentPath === item?.path;
                return (
                  <Button
                    key={item?.path}
                    variant={isActive ? "default" : "ghost"}
                    fullWidth
                    onClick={() => handleNavigation(item?.path)}
                    iconName={item?.icon}
                    iconPosition="left"
                    iconSize={18}
                    className={`
                      justify-start px-3 py-2.5 text-left transition-all duration-fast
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                    disabled={isVoiceRecording && !isActive}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item?.label}</span>
                      <span className="text-xs opacity-75">{item?.description}</span>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Mobile Voice Recording Indicator */}
            {isVoiceRecording && (
              <div className="px-4 py-3 border-t border-border bg-voice-recording/5">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-voice-recording rounded-full animate-voice-pulse"></div>
                  <div>
                    <p className="text-sm font-medium text-voice-recording">
                      Ses kaydı devam ediyor
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Navigasyon geçici olarak devre dışı
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Current Screen Title for Mobile */}
      <div className="sm:hidden px-4 py-2 bg-muted/30 border-t border-border">
        <div className="flex items-center space-x-2">
          {currentItem && (
            <>
              <Icon 
                name={currentItem?.icon} 
                size={16} 
                color="var(--color-muted-foreground)" 
              />
              <span className="text-sm font-medium text-muted-foreground">
                {currentItem?.label}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;