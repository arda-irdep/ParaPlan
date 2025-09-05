import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransactionPreviewTable = ({ transactions, onDeleteTransaction, onClearAll }) => {
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

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
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === 'price') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortField === 'quantity') {
      aValue = parseInt(aValue);
      bValue = parseInt(bValue);
    }

    if (typeof aValue === 'string') {
      aValue = aValue?.toLowerCase();
      bValue = bValue?.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalAmount = transactions?.reduce((sum, transaction) => sum + transaction?.price, 0);

  if (transactions?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
        <div className="text-center">
          <Icon name="Receipt" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Henüz gider kaydı yok</h3>
          <p className="text-muted-foreground">
            Sesli komut veya manuel giriş ile ilk gider kaydınızı oluşturun
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Receipt" size={20} color="var(--color-primary)" />
            <span>Gider Kayıtları</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {transactions?.length} kayıt • Toplam: {formatPrice(totalAmount)}
          </p>
        </div>
        
        {transactions?.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            Tümünü Temizle
          </Button>
        )}
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('timestamp')}
                  iconName={sortField === 'timestamp' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={16}
                  className="font-medium"
                >
                  Tarih/Saat
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('quantity')}
                  iconName={sortField === 'quantity' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={16}
                  className="font-medium"
                >
                  Miktar
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('product')}
                  iconName={sortField === 'product' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={16}
                  className="font-medium"
                >
                  Ürün
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('company')}
                  iconName={sortField === 'company' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={16}
                  className="font-medium"
                >
                  Tedarikçi
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('price')}
                  iconName={sortField === 'price' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'}
                  iconPosition="right"
                  iconSize={16}
                  className="font-medium"
                >
                  Fiyat
                </Button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Ödeme</th>
              <th className="text-center p-4 font-medium text-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions?.map((transaction, index) => (
              <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm text-foreground">
                  {formatDate(transaction?.timestamp)}
                </td>
                <td className="p-4 text-sm text-foreground font-medium">
                  {transaction?.quantity}
                </td>
                <td className="p-4 text-sm text-foreground">
                  {transaction?.product}
                </td>
                <td className="p-4 text-sm text-foreground">
                  {transaction?.company}
                </td>
                <td className="p-4 text-sm text-foreground font-semibold">
                  {formatPrice(transaction?.price)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {getPaymentMethodLabel(transaction?.paymentMethod)}
                </td>
                <td className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTransaction(index)}
                    iconName="Trash2"
                    iconSize={16}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-4">
        {sortedTransactions?.map((transaction, index) => (
          <div key={index} className="bg-muted/20 border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{transaction?.product}</h3>
                <p className="text-sm text-muted-foreground">{transaction?.company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTransaction(index)}
                iconName="Trash2"
                iconSize={16}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive ml-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Miktar:</span>
                <span className="ml-2 font-medium text-foreground">{transaction?.quantity}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fiyat:</span>
                <span className="ml-2 font-semibold text-foreground">{formatPrice(transaction?.price)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Ödeme:</span>
                <span className="ml-2 text-foreground">{getPaymentMethodLabel(transaction?.paymentMethod)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tarih:</span>
                <span className="ml-2 text-foreground">{formatDate(transaction?.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionPreviewTable;