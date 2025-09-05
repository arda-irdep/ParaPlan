import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TransactionPreviewTable = ({ transactions, onDeleteTransaction, onClearAll }) => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedTransactions = [...(transactions || [])]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];

    if (sortBy === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortBy === 'amount') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalAmount = transactions?.reduce((sum, transaction) => sum + (transaction?.amount || 0), 0) || 0;

  if (!transactions?.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
        <div className="text-center">
          <Icon name="TrendingUp" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Henüz gelir kaydı yok</h3>
          <p className="text-sm text-muted-foreground">
            İlk gelir kaydınızı yapmak için yukarıdaki yöntemlerden birini kullanın
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
            <Icon name="List" size={20} color="var(--color-success)" />
            <span>Gelir Kayıtları ({transactions?.length})</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Toplam: {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            })?.format(totalAmount)}
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
            className="text-error hover:text-error border-error/20 hover:border-error/40"
          >
            Tümünü Temizle
          </Button>
        )}
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="text-left p-3 text-sm font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleSort('timestamp')}
                  iconName={sortBy === 'timestamp' ? (sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="text-foreground hover:text-foreground"
                >
                  Tarih
                </Button>
              </th>
              <th className="text-left p-3 text-sm font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleSort('source')}
                  iconName={sortBy === 'source' ? (sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="text-foreground hover:text-foreground"
                >
                  Kaynak
                </Button>
              </th>
              <th className="text-left p-3 text-sm font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleSort('client')}
                  iconName={sortBy === 'client' ? (sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="text-foreground hover:text-foreground"
                >
                  Müşteri
                </Button>
              </th>
              <th className="text-left p-3 text-sm font-medium text-foreground">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleSort('amount')}
                  iconName={sortBy === 'amount' ? (sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ArrowUpDown'}
                  iconPosition="right"
                  iconSize={14}
                  className="text-foreground hover:text-foreground"
                >
                  Tutar
                </Button>
              </th>
              <th className="text-left p-3 text-sm font-medium text-foreground">Ödeme</th>
              <th className="text-center p-3 text-sm font-medium text-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions?.map((transaction, index) => (
              <tr key={transaction?.id || index} className="border-b border-border hover:bg-muted/30">
                <td className="p-3 text-sm text-muted-foreground">
                  {new Date(transaction?.timestamp)?.toLocaleString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="p-3 text-sm text-foreground font-medium">
                  {transaction?.source}
                  {transaction?.description && (
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {transaction?.description}
                    </div>
                  )}
                </td>
                <td className="p-3 text-sm text-foreground">
                  {transaction?.client}
                </td>
                <td className="p-3 text-sm text-foreground font-semibold">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  })?.format(transaction?.amount)}
                </td>
                <td className="p-3 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-muted/50 rounded text-xs">
                    {transaction?.paymentMethod}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onDeleteTransaction(index)}
                    iconName="Trash2"
                    iconSize={14}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer Summary */}
      <div className="p-4 bg-muted/20 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {transactions?.length} kayıt gösteriliyor
          </span>
          <span className="font-semibold text-success">
            Toplam Gelir: {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY'
            })?.format(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionPreviewTable;