import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import VoiceRecordingSection from './components/VoiceRecordingSection';
import ManualEntryForm from './components/ManualEntryForm';
import TransactionPreviewTable from './components/TransactionPreviewTable';
import ExportSection from './components/ExportSection';

const ExpenseTrackingInterface = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState('voice');

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('voicetracker_transactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed);
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('voicetracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: Date.now() + Math.random(), // Simple unique ID
      timestamp: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    // Show success notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Gider Eklendi', {
        body: `${transactionData.quantity} ${transactionData.product} - ${new Intl.NumberFormat('tr-TR', {
          style: 'currency',
          currency: 'TRY'
        }).format(transactionData.price)}`,
        icon: '/favicon.ico'
      });
    }
  };

  const handleDeleteTransaction = (index) => {
    setTransactions(prev => prev?.filter((_, i) => i !== index));
  };

  const handleClearAllTransactions = () => {
    if (window.confirm('Tüm gider kayıtlarını silmek istediğinizden emin misiniz?')) {
      setTransactions([]);
      localStorage.removeItem('voicetracker_transactions');
    }
  };

  const handleExport = () => {
    // Additional export logic can be added here
    console.log('Export completed for', transactions?.length, 'transactions');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header isVoiceRecording={isRecording} />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Gider Takip Sistemi
                </h1>
                <p className="text-muted-foreground">
                  Sesli komut veya manuel giriş ile giderlerinizi kaydedin ve Excel'e aktarın
                </p>
              </div>
              
              <div className="hidden sm:flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/income-tracking-interface')}
                  iconName="TrendingUp"
                  iconPosition="left"
                  iconSize={18}
                  className="text-success border-success/20 hover:border-success/40"
                >
                  Gelir Takibi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/home-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  iconSize={18}
                >
                  Ana Sayfaya Dön
                </Button>
              </div>
            </div>
          </div>

          {/* Input Method Tabs */}
          <div className="mb-8">
            <div className="flex items-center space-x-1 bg-muted/30 p-1 rounded-lg w-fit">
              <Button
                variant={activeTab === 'voice' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('voice')}
                iconName="Mic"
                iconPosition="left"
                iconSize={16}
                disabled={isRecording}
                className="px-4"
              >
                Sesli Giriş
              </Button>
              <Button
                variant={activeTab === 'manual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('manual')}
                iconName="Edit3"
                iconPosition="left"
                iconSize={16}
                disabled={isRecording}
                className="px-4"
              >
                Manuel Giriş
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Input Methods */}
            <div className="xl:col-span-2 space-y-8">
              {/* Voice Recording Section */}
              {activeTab === 'voice' && (
                <VoiceRecordingSection
                  onTranscriptionComplete={handleAddTransaction}
                  isRecording={isRecording}
                  setIsRecording={setIsRecording}
                />
              )}

              {/* Manual Entry Form */}
              {activeTab === 'manual' && (
                <ManualEntryForm
                  onAddTransaction={handleAddTransaction}
                  isRecording={isRecording}
                />
              )}

              {/* Transaction Preview Table */}
              <TransactionPreviewTable
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                onClearAll={handleClearAllTransactions}
              />
            </div>

            {/* Right Column - Export Section */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <ExportSection
                  transactions={transactions}
                  onExport={handleExport}
                />

                {/* Quick Stats */}
                <div className="mt-6 bg-card border border-border rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="BarChart3" size={16} color="var(--color-muted-foreground)" />
                    <span>Hızlı İstatistikler</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bugünkü Kayıtlar:</span>
                      <span className="font-medium text-foreground">
                        {transactions?.filter(t => {
                          const today = new Date();
                          const transactionDate = new Date(t.timestamp);
                          return transactionDate?.toDateString() === today?.toDateString();
                        })?.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Bu Hafta:</span>
                      <span className="font-medium text-foreground">
                        {transactions?.filter(t => {
                          const weekAgo = new Date();
                          weekAgo?.setDate(weekAgo?.getDate() - 7);
                          return new Date(t.timestamp) >= weekAgo;
                        })?.length}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ortalama Tutar:</span>
                      <span className="font-medium text-foreground">
                        {transactions?.length > 0 
                          ? new Intl.NumberFormat('tr-TR', {
                              style: 'currency',
                              currency: 'TRY'
                            })?.format(
                              transactions?.reduce((sum, t) => sum + t?.price, 0) / transactions?.length
                            )
                          : '₺0,00'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <div className="mt-6 sm:hidden space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/income-tracking-interface')}
                    iconName="TrendingUp"
                    iconPosition="left"
                    iconSize={18}
                    className="text-success border-success/20 hover:border-success/40"
                  >
                    Gelir Takibi
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/home-dashboard')}
                    iconName="ArrowLeft"
                    iconPosition="left"
                    iconSize={18}
                  >
                    Ana Sayfaya Dön
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExpenseTrackingInterface;