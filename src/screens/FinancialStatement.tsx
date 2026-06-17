import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FinancialsData } from '../types';

const MOCK_FINANCIALS: FinancialsData = {
  cashCollected: 4500,
  mfsCollected: 3200,
  totalCollected: 7700,
  exchangeAndPartial: [
    { id: 'PRCL-7721', type: 'Exchange', status: 'Delivered', receivedAmount: 150, originalAmount: 2200 },
    { id: 'PRCL-5049', type: 'Partial Delivery', status: 'Delivered', receivedAmount: 800, originalAmount: 1600 }
  ],
  riderPerformance: [
    { name: 'Self (You)', cash: 4500, mfs: 3200, total: 7700 },
    { name: 'Karim Ullah', cash: 3100, mfs: 4000, total: 7100 },
    { name: 'Sohail Rana', cash: 5200, mfs: 1500, total: 6700 }
  ]
};

export default function FinancialStatement(): React.JSX.Element {
  const data = MOCK_FINANCIALS;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-slate-800 mb-4 mt-8">Financial Statement</Text>

      {/* Collection Breakdown Summary */}
      <View className="bg-indigo-600 rounded-2xl p-5 mb-6 shadow-lg shadow-indigo-600/30">
        <Text className="text-indigo-100 text-sm font-semibold mb-1">Total Collection Balance</Text>
        <Text className="text-white text-3xl font-black mb-4">৳ {data.totalCollected}</Text>
        
        <View className="flex-row justify-between border-t border-indigo-400/40 pt-3">
          <View>
            <Text className="text-indigo-100 text-xs">Cash Collection</Text>
            <Text className="text-white text-lg font-bold">৳ {data.cashCollected}</Text>
          </View>
          <View className="border-r border-indigo-400/40" />
          <View>
            <Text className="text-indigo-100 text-xs">MFS Collection</Text>
            <Text className="text-white text-lg font-bold">৳ {data.mfsCollected}</Text>
          </View>
        </View>
      </View>

      {/* Exchange & Partial List */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-slate-800 mb-3">Exchange & Partial Records</Text>
        {data.exchangeAndPartial.map((item) => (
          <View key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 mb-2 flex-row justify-between items-center">
            <View>
              <Text className="text-slate-800 font-bold text-sm">{item.id}</Text>
              <Text className="text-slate-400 text-xs mt-0.5">{item.type}</Text>
            </View>
            <View className="items-end">
              <Text className="text-emerald-600 font-bold text-sm">Col: ৳{item.receivedAmount}</Text>
              <Text className="text-slate-400 text-[10px] line-through">Orig: ৳{item.originalAmount}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Rider-wise Collections (Admin View) */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-800 mb-3">Rider-wise Collection Summary</Text>
        <View className="bg-white rounded-2xl p-4 border border-slate-100">
          <View className="flex-row border-b border-slate-100 pb-2 mb-2">
            <Text className="flex-[2] text-slate-400 text-xs font-semibold">Rider Name</Text>
            <Text className="flex-1 text-slate-400 text-xs font-semibold text-right">Cash</Text>
            <Text className="flex-1 text-slate-400 text-xs font-semibold text-right">MFS</Text>
            <Text className="flex-1 text-slate-400 text-xs font-semibold text-right">Total</Text>
          </View>
          {data.riderPerformance.map((rider, index) => (
            <View key={index} className="flex-row py-3 border-b border-slate-50 items-center">
              <Text className="flex-[2] text-slate-700 font-semibold text-xs">{rider.name}</Text>
              <Text className="flex-1 text-slate-600 text-right text-xs">৳{rider.cash}</Text>
              <Text className="flex-1 text-slate-600 text-right text-xs">৳{rider.mfs}</Text>
              <Text className="flex-1 text-slate-900 font-bold text-right text-xs">৳{rider.total}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}