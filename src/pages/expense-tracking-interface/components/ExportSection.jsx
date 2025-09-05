import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExportSection = ({ transactions, onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })?.format(price);
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      'nakit': 'Nakit',
      'kredi_karti': 'Kredi Kartı',
      'banka_karti': 'Banka Kartı',
      'havale': 'Havale/EFT',
      'cek': 'Çek',
      'kripto': 'Kripto Para',
      'diger': 'Diğer'
    };
    return methods?.[method] || method;
  };

  const generateExcelData = () => {
    const headers = ['Tarih/Saat', 'Miktar', 'Ürün', 'Tedarikçi/Şirket', 'Fiyat (TL)', 'Ödeme Yöntemi'];
    
    const data = transactions?.map(transaction => [
      formatDate(transaction?.timestamp),
      transaction?.quantity,
      transaction?.product,
      transaction?.company,
      formatPrice(transaction?.price),
      getPaymentMethodLabel(transaction?.paymentMethod)
    ]);

    return [headers, ...data];
  };

  const exportToExcel = async () => {
    if (transactions?.length === 0) {
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));

      const excelData = generateExcelData();
      const csvContent = excelData?.map(row => 
        row?.map(cell => `"${cell}"`)?.join(',')
      )?.join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link?.setAttribute('href', url);
      
      const now = new Date();
      const filename = `gider_kayitlari_${now?.getFullYear()}_${(now?.getMonth() + 1)?.toString()?.padStart(2, '0')}_${now?.getDate()?.toString()?.padStart(2, '0')}.csv`;
      link?.setAttribute('download', filename);
      
      link.style.visibility = 'hidden';
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);

      setExportSuccess(true);
      onExport && onExport();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const shareData = async () => {
    if (!navigator.share) {
      // Fallback for browsers that don't support Web Share API
      const text = `Gider Kayıtları (${transactions?.length} kayıt)\n\n` +
        transactions?.map(t => 
          `${formatDate(t?.timestamp)} - ${t?.quantity} ${t?.product} (${t?.company}) - ${formatPrice(t?.price)} TL`
        )?.join('\n');
      
      navigator.clipboard?.writeText(text)?.then(() => {
        alert('Gider kayıtları panoya kopyalandı!');
      });
      return;
    }

    try {
      await navigator.share({
        title: 'Gider Kayıtları',
        text: `${transactions?.length} adet gider kaydı`,
        url: window.location?.href
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const totalAmount = transactions?.reduce((sum, transaction) => sum + transaction?.price, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Download" size={20} color="var(--color-primary)" />
          <span>Dışa Aktarma</span>
        </h2>
        
        {exportSuccess && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <span className="text-sm font-medium text-success">Başarıyla dışa aktarıldı</span>
          </div>
        )}
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-muted-foreground">Toplam Kayıt</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{transactions?.length}</p>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-muted-foreground">Toplam Tutar</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              minimumFractionDigits: 2
            })?.format(totalAmount)}
          </p>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm font-medium text-muted-foreground">Son Güncelleme</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {transactions?.length > 0 
              ? formatDate(Math.max(...transactions?.map(t => new Date(t.timestamp))))
              : 'Henüz kayıt yok'
            }
          </p>
        </div>
      </div>
      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="default"
          size="lg"
          onClick={exportToExcel}
          iconName={isExporting ? "Loader2" : "Download"}
          iconPosition="left"
          iconSize={18}
          loading={isExporting}
          disabled={transactions?.length === 0 || isExporting}
          className="flex-1 sm:flex-none px-8"
        >
          {isExporting ? 'Dışa Aktarılıyor...' : 'Excel\'e Aktar'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={shareData}
          iconName="Share2"
          iconPosition="left"
          iconSize={18}
          disabled={transactions?.length === 0 || isExporting}
          className="flex-1 sm:flex-none px-6"
        >
          Paylaş
        </Button>
      </div>
      {/* Export Information */}
      <div className="mt-6 bg-muted/30 border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} color="var(--color-muted-foreground)" />
          <span>Dışa Aktarma Bilgileri</span>
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Excel dosyası CSV formatında indirilir</p>
          <p>• Türkçe karakter desteği mevcuttur</p>
          <p>• Tarih formatı: GG/AA/YYYY SS:DD</p>
          <p>• Fiyat formatı: Türk Lirası (1.000,00)</p>
          {transactions?.length === 0 && (
            <p className="text-warning font-medium">• Dışa aktarmak için en az bir kayıt gereklidir</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportSection;