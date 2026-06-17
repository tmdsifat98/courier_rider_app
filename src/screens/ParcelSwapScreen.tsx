import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SwapRequest } from '../types';

const OTHER_RIDERS: string[] = ['Karim Ullah', 'Sohail Rana', 'Imtiaz Ahmed', 'Kamrul Hasan'];

export default function ParcelSwapScreen(): React.JSX.Element {
  const [scannedParcels, setScannedParcels] = useState<string[]>([]);
  const [selectedRider, setSelectedRider] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [activeRequests, setActiveRequests] = useState<SwapRequest[]>([
    { targetRider: 'Karim Ullah', count: 5, status: 'Pending Approval' }
  ]);

  const simulateScan = (): void => {
    setScanning(true);
    setTimeout(() => {
      const generatedCode = `PRCL-${Math.floor(1000 + Math.random() * 9000)}`;
      
      if (scannedParcels.includes(generatedCode)) {
        Alert.alert("Duplicate Scan", "This parcel has already been scanned.");
      } else {
        setScannedParcels(prev => [...prev, generatedCode]);
      }
      setScanning(false);
    }, 1200);
  };

  const handleSwapRequestSubmit = (): void => {
    if (scannedParcels.length === 0) {
      Alert.alert("Warning", "Please scan at least one parcel before swapping.");
      return;
    }
    if (!selectedRider) {
      Alert.alert("Warning", "Please select a rider to handover the parcels.");
      return;
    }

    const newRequest: SwapRequest = {
      targetRider: selectedRider,
      count: scannedParcels.length,
      status: 'Pending Approval'
    };

    setActiveRequests(prev => [newRequest, ...prev]);
    Alert.alert("Success", `Swap Request sent to ${selectedRider} for ${scannedParcels.length} parcels.`);
    
    setScannedParcels([]);
    setSelectedRider('');
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-slate-800 mb-4 mt-8">Parcel Swap (Handover)</Text>

      {/* Simulator QR Scanner HUD View */}
      <View className="bg-slate-900 rounded-3xl overflow-hidden aspect-[4/3] justify-center items-center relative mb-5 border-4 border-slate-200 shadow-md">
        {scanning ? (
          <View className="items-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-300 font-semibold mt-2 text-sm">Processing Barcode...</Text>
          </View>
        ) : (
          <View className="items-center px-6">
            <View className="w-16 h-16 border-2 border-indigo-400 border-dashed rounded-xl mb-3 flex justify-center items-center">
              <Text className="text-indigo-400 font-bold text-xl">QR</Text>
            </View>
            <Text className="text-white font-bold text-sm mb-1 text-center">Simulate Camera Scanner</Text>
            <Text className="text-slate-400 text-[11px] text-center mb-4">Focus QR / Barcode inside target window</Text>
            
            <TouchableOpacity onPress={simulateScan} className="bg-indigo-600 px-6 py-2.5 rounded-xl">
              <Text className="text-white font-bold text-xs">Press to Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="absolute top-6 left-6 w-6 h-6 border-t-4 border-l-4 border-indigo-400" />
        <View className="absolute top-6 right-6 w-6 h-6 border-t-4 border-r-4 border-indigo-400" />
        <View className="absolute bottom-6 left-6 w-6 h-6 border-b-4 border-l-4 border-indigo-400" />
        <View className="absolute bottom-6 right-6 w-6 h-6 border-b-4 border-r-4 border-indigo-400" />
      </View>

      {/* Scanned Items Count */}
      <View className="mb-6">
        <Text className="text-slate-800 font-bold mb-2">Scanned Items ({scannedParcels.length})</Text>
        {scannedParcels.length === 0 ? (
          <Text className="text-slate-400 text-xs italic">No items scanned yet.</Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {scannedParcels.map((code) => (
              <View key={code} className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 flex-row items-center">
                <Text className="text-indigo-800 text-xs font-bold mr-2">{code}</Text>
                <TouchableOpacity onPress={() => setScannedParcels(prev => prev.filter(c => c !== code))}>
                  <Text className="text-red-500 font-bold text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Select Destination Rider */}
      <View className="mb-6">
        <Text className="text-slate-800 font-bold mb-2">Select Rider for Transfer</Text>
        <View className="flex-row flex-wrap gap-2">
          {OTHER_RIDERS.map((rider) => (
            <TouchableOpacity
              key={rider}
              onPress={() => setSelectedRider(rider)}
              className={`px-4 py-2.5 rounded-xl border ${selectedRider === rider ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}>
              <Text className={`font-semibold text-xs ${selectedRider === rider ? 'text-white' : 'text-slate-700'}`}>{rider}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSwapRequestSubmit}
        className="bg-indigo-600 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/20 mb-6">
        <Text className="text-white font-extrabold text-sm">Send Swap Request</Text>
      </TouchableOpacity>

      {/* Confirmation Details */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-slate-800 mb-3">Active Swap Requests</Text>
        {activeRequests.map((req, index) => (
          <View key={index} className="bg-white p-4 rounded-xl border border-slate-100 flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-slate-800 font-bold text-xs">Rider {req.targetRider} Swap Request</Text>
              <Text className="text-slate-400 text-[10px] mt-0.5">{req.count} Parcels Scanned</Text>
            </View>
            <View className="bg-amber-100 px-3 py-1 rounded-full">
              <Text className="text-amber-800 font-bold text-[10px]">{req.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}