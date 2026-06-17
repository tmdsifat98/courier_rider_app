import { IconBox, IconSwap, IconWallet } from "@/components/ui/SVGUtils";
import FinancialStatement from "@/screens/FinancialStatement";
import ParcelListScreen from "@/screens/ParcelListScreen";
import ParcelSwapScreen from "@/screens/ParcelSwapScreen";
import { SyncHelper } from "@/utils/syncHelper";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AppTab = "Parcels" | "Financials" | "Swap";

export default function HomeScreen(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<AppTab>("Parcels");
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const status = state.isConnected ?? true;
      setIsConnected(status);
      if (status) {
        SyncHelper.processQueue();
      }
    });
    return () => unsubscribe();
  }, []);

  const renderActiveTab = (): React.JSX.Element => {
    switch (currentTab) {
      case "Parcels":
        return <ParcelListScreen />;
      case "Financials":
        return <FinancialStatement />;
      case "Swap":
        return <ParcelSwapScreen />;
      default:
        return <ParcelListScreen />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      {!isConnected && (
        <View className="bg-rose-500 py-1.5 items-center">
          <Text className="text-white text-[11px] font-bold">
            Offline Mode - Updates are saved and queue sync is active.
          </Text>
        </View>
      )}

      <View className="flex-1">{renderActiveTab()}</View>

      {/* Tab bar */}
      <View className="bg-white border-t border-slate-100 py-2.5 flex-row justify-around items-center shadow-lg">
        <TouchableOpacity
          onPress={() => setCurrentTab("Parcels")}
          className="items-center px-4 py-1"
        >
          <IconBox
            color={currentTab === "Parcels" ? "#4F46E5" : "#94A3B8"}
            size={22}
          />
          <Text
            className={`text-[10px] font-bold mt-1.5 ${currentTab === "Parcels" ? "text-indigo-600" : "text-slate-400"}`}
          >
            Parcels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentTab("Financials")}
          className="items-center px-4 py-1"
        >
          <IconWallet
            color={currentTab === "Financials" ? "#4F46E5" : "#94A3B8"}
            size={22}
          />
          <Text
            className={`text-[10px] font-bold mt-1.5 ${currentTab === "Financials" ? "text-indigo-600" : "text-slate-400"}`}
          >
            Financials
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentTab("Swap")}
          className="items-center px-4 py-1"
        >
          <IconSwap
            color={currentTab === "Swap" ? "#4F46E5" : "#94A3B8"}
            size={22}
          />
          <Text
            className={`text-[10px] font-bold mt-1.5 ${currentTab === "Swap" ? "text-indigo-600" : "text-slate-400"}`}
          >
            Swap
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
