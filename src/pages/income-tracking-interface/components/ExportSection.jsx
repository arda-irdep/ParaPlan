import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExportSection = ({ transactions, onExport, type = "income" }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    if (!transactions?.length) return;

    setIsExporting(true);
    
    try {
      const headers = ['Tarih', 'Gelir Kaynağı', 'Müşteri/Şirket', 'Tutar (TL)', 'Ödeme Yöntemi', 'Açıklama'];
      
      const csvContent = [
        headers?.join(','),
        ...transactions?.map(transaction => [
          new Date(transaction?.timestamp)?.toLocaleString('tr-TR'),
          `"${transaction?.source || ''}"`,
          `"${transaction?.client || ''}"`,
          transaction?.amount || 0,
          `"${transaction?.paymentMethod || ''}"`,
          `"${transaction?.description || ''}"`
        ]?.join(','))
      ]?.join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link?.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link?.setAttribute('href', url);
        link?.setAttribute('download', `gelir_kayitlari_${new Date()?.toISOString()?.split('T')?.[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body?.appendChild(link);
        link?.click();
        document.body?.removeChild(link);
      }

      onExport?.();
      
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Dışa Aktarma Tamamlandı', {
          body: `${transactions.length} gelir kaydı CSV formatında dışa aktarıldı`,
          icon: '/favicon.ico'
        });
      }

    } catch (error) {
      console.error('CSV export error:', error);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const exportToExcel = () => {
    if (!transactions?.length) return;

    setIsExporting(true);
    
    try {
      const headers = ['Tarih', 'Gelir Kaynağı', 'Müşteri/Şirket', 'Tutar (TL)', 'Ödeme Yöntemi', 'Açıklama'];
      
      let excelContent = '<table border="1"><tr>';
      headers?.forEach(header => {
        excelContent += `<th>${header}</th>`;
      });
      excelContent += '</tr>';

      transactions?.forEach(transaction => {
        excelContent += '<tr>';
        excelContent += `<td>${new Date(transaction?.timestamp)?.toLocaleString('tr-TR')}</td>`;
        excelContent += `<td>${transaction?.source || ''}</td>`;
        excelContent += `<td>${transaction?.client || ''}</td>`;
        excelContent += `<td>${transaction?.amount || 0}</td>`;
        excelContent += `<td>${transaction?.paymentMethod || ''}</td>`;
        excelContent += `<td>${transaction?.description || ''}</td>`;
        excelContent += '</tr>';
      });
      
      excelContent += '</table>';

      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      
      if (link?.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link?.setAttribute('href', url);
        link?.setAttribute('download', `gelir_kayitlari_${new Date()?.toISOString()?.split('T')?.[0]}.xls`);
        link.style.visibility = 'hidden';
        document.body?.appendChild(link);
        link?.click();
        document.body?.removeChild(link);
      }

      onExport?.();

      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Dışa Aktarma Tamamlandı', {
          body: `${transactions.length} gelir kaydı Excel formatında dışa aktarıldı`,
          icon: '/favicon.ico'
        });
      }

    } catch (error) {
      console.error('Excel export error:', error);
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const totalAmount = transactions?.reduce((sum, transaction) => sum + (transaction?.amount || 0), 0) || 0;
  const thisWeekAmount = transactions?.filter(t => {
    const weekAgo = new Date();
    weekAgo?.setDate(weekAgo?.getDate() - 7);
    return new Date(t.timestamp) >= weekAgo;
  })?.reduce((sum, transaction) => sum + (transaction?.amount || 0), 0) || 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Download" size={20} color="var(--color-success)" />
        <span>Dışa Aktarma</span>
      </h2>
      {/* Summary Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Toplam Kayıt:</span>
          <span className="font-medium text-foreground">{transactions?.length || 0}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Bu Hafta:</span>
          <span className="font-medium text-success">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            })?.format(thisWeekAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">Genel Toplam:</span>
          <span className="font-semibold text-success text-lg">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            })?.format(totalAmount)}
          </span>
        </div>
      </div>
      {/* Export Buttons */}
      <div className="space-y-3">
        <Button
          fullWidth
          onClick={exportToExcel}
          disabled={!transactions?.length || isExporting}
          iconName={isExporting ? "Loader2" : "FileSpreadsheet"}
          iconPosition="left"
          iconSize={18}
          className={`${isExporting ? 'animate-spin' : ''}`}
        >
          {isExporting ? 'Aktarılıyor...' : 'Excel\'e Aktar'}
        </Button>
        
        <Button
          variant="outline"
          fullWidth
          onClick={exportToCSV}
          disabled={!transactions?.length || isExporting}
          iconName={isExporting ? "Loader2" : "FileText"}
          iconPosition="left"
          iconSize={18}
          className={`${isExporting ? 'animate-spin' : ''}`}
        >
          {isExporting ? 'Aktarılıyor...' : 'CSV\'ye Aktar'}
        </Button>
      </div>
      {!transactions?.length && (
        <div className="mt-4 bg-muted/30 border border-border rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} color="var(--color-muted-foreground)" />
            <p className="text-sm text-muted-foreground">
              Dışa aktarmak için en az bir gelir kaydı gerekli
            </p>
          </div>
        </div>
      )}
      {/* Export Format Info */}
      <div className="mt-6 bg-muted/20 border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Info" size={16} color="var(--color-muted-foreground)" />
          <span>Dışa Aktarma Bilgileri</span>
        </h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Excel formatı muhasebe programlarıyla uyumludur</p>
          <p>• CSV formatı Google Sheets ve diğer elektronik tablolarla uyumludur</p>
          <p>• Türkçe karakterler doğru şekilde kodlanır</p>
          <p>• Tarih formatı: GG.AA.YYYY SS:DD</p>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;