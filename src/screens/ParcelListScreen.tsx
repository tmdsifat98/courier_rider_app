import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    ListRenderItem,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { IconCheck, IconClock, IconX } from "../components/ui/SVGUtils";
import { ActionType, Parcel, SyncPayload } from "../types";
import { SyncHelper } from "../utils/syncHelper";

const MOCK_PARCELS: Parcel[] = [
  {
    id: "PRCL-9081",
    customer: "Rakibul Islam",
    phone: "01712345678",
    address: "Mirpur 10, Dhaka",
    amount: 1500,
    type: "Regular",
  },
  {
    id: "PRCL-7721",
    customer: "Tahmid Hasan",
    phone: "01987654321",
    address: "Dhanmondi 32, Dhaka",
    amount: 2200,
    type: "Exchange",
  },
  {
    id: "PRCL-4412",
    customer: "Sabbir Rahman",
    phone: "01511223344",
    address: "Uttara Sector 4, Dhaka",
    amount: 850,
    type: "Regular",
  },
];

export default function ParcelListScreen(): React.JSX.Element {
  const [parcels, setParcels] = useState<Parcel[]>(MOCK_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  // Form States
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [mfsProvider, setMfsProvider] = useState<string>("Bkash");
  const [note, setNote] = useState<string>("");
  const [charge, setCharge] = useState<string>("50");
  const [billAmount, setBillAmount] = useState<string>("");
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);

  const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  const handleActionSubmit = async (): Promise<void> => {
    if (!selectedParcel || !actionType) return;

    let payload: SyncPayload = {
      parcelId: selectedParcel.id,
      action: actionType,
    };

    if (actionType === "deliver") {
      payload = {
        ...payload,
        paymentMethod,
        mfsProvider: paymentMethod === "MFS" ? mfsProvider : undefined,
        billAmount:
          paymentMethod === "Bill Update"
            ? billAmount || selectedParcel.amount
            : selectedParcel.amount,
        note,
      };
    } else if (actionType === "reschedule") {
      if (!rescheduleDate) {
        Alert.alert(
          "Date Required",
          "Please select a date and time for rescheduling.",
        );
        return;
      }
      payload = {
        ...payload,
        rescheduleDate: rescheduleDate.toISOString(),
        note,
      };
    } else if (actionType === "reject") {
      payload = { ...payload, returnCharge: charge, note };
    }

    const response = await SyncHelper.saveAction("PARCEL_UPDATE", payload);

    if (response.success) {
      setParcels((prev) => prev.filter((p) => p.id !== selectedParcel.id));
      Alert.alert(
        response.queued ? "Saved Offline" : "Status Updated",
        response.queued
          ? "Action queued. It will sync automatically when online."
          : "Database successfully updated.",
      );
    }
    closeModal();
  };

  const onChangeDate = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      const nextDate = new Date(rescheduleDate || new Date());
      nextDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setRescheduleDate(nextDate);
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date): void => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedTime) {
      const nextDate = new Date(rescheduleDate || new Date());
      nextDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
        0,
      );

      if (nextDate < new Date()) {
        Alert.alert("Invalid Time", "You cannot select a past time.");
        return;
      }

      setRescheduleDate(nextDate);
    }
  };

  const closeModal = (): void => {
    setSelectedParcel(null);
    setActionType(null);
    setPaymentMethod("Cash");
    setNote("");
    setBillAmount("");
    setRescheduleDate(null);
  };

  const renderParcelItem: ListRenderItem<Parcel> = ({ item }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100">
      <View className="flex-row justify-between items-center border-b border-slate-100 pb-2 mb-3">
        <Text className="text-indigo-600 font-bold text-base">{item.id}</Text>
        <Text className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
          {item.type}
        </Text>
      </View>
      <View className="flex-row justify-between mb-4 items-center">
        <View>
          <Text className="text-slate-800 font-semibold text-lg">
            {item.customer}
          </Text>
          <Text className="text-slate-500 text-sm mb-1">{item.phone}</Text>
          <Text className="text-slate-600 text-sm mb-3">{item.address}</Text>
        </View>
        <Text className="text-emerald-600 font-extrabold text-xl mb-4">
          ৳ {item.amount}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => {
            setSelectedParcel(item);
            setActionType("deliver");
          }}
          className="flex-1 bg-emerald-500 py-3 rounded-xl mr-2 flex-row justify-center items-center"
        >
          <IconCheck color="#fff" size={18} />
          <Text className="text-white font-bold ml-1 text-sm">Delivered</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSelectedParcel(item);
            setActionType("reschedule");
          }}
          className="flex-1 bg-amber-500 py-3 rounded-xl mr-2 flex-row justify-center items-center"
        >
          <IconClock color="#fff" size={18} />
          <Text className="text-white font-bold ml-1 text-sm">Reschedule</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setSelectedParcel(item);
            setActionType("reject");
          }}
          className="flex-1 bg-rose-500 py-3 rounded-xl flex-row justify-center items-center"
        >
          <IconX color="#fff" size={18} />
          <Text className="text-white font-bold ml-1 text-sm">Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 p-4">
      <Text className="text-2xl font-bold text-slate-800 mb-4 mt-8">
        Parcel Delivery List
      </Text>
      {parcels.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-slate-400 text-base">
            No pending parcels remaining!
          </Text>
        </View>
      ) : (
        <FlatList
          data={parcels}
          keyExtractor={(item) => item.id}
          renderItem={renderParcelItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={selectedParcel !== null}
        animationType="slide"
        transparent
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <Text className="text-xl font-extrabold text-slate-800 capitalize">
                {actionType} Action
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                className="bg-slate-100 p-2 rounded-full"
              >
                <IconX color="#475569" size={16} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* DELIVERED FLOW */}
              {actionType === "deliver" && (
                <View>
                  <Text className="text-slate-600 font-bold mb-2">
                    Select Payment Method
                  </Text>
                  <View className="flex-row flex-wrap gap-2 mb-4">
                    {[
                      "Cash",
                      "MFS",
                      "Partial Delivery",
                      "Exchange",
                      "Bill Update",
                    ].map((method) => (
                      <TouchableOpacity
                        key={method}
                        onPress={() => setPaymentMethod(method)}
                        className={`px-4 py-2.5 rounded-xl border ${paymentMethod === method ? "bg-indigo-600 border-indigo-600" : "bg-slate-50 border-slate-200"}`}
                      >
                        <Text
                          className={`font-semibold text-sm ${paymentMethod === method ? "text-white" : "text-slate-700"}`}
                        >
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {paymentMethod === "MFS" && (
                    <View className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                      <Text className="text-slate-600 font-semibold mb-2 text-xs">
                        Choose Operator
                      </Text>
                      <View className="flex-row gap-2">
                        {["Bkash", "Nagad", "Rocket"].map((op) => (
                          <TouchableOpacity
                            key={op}
                            onPress={() => setMfsProvider(op)}
                            className={`flex-1 py-2 rounded-lg items-center ${mfsProvider === op ? "bg-indigo-100 border border-indigo-400" : "bg-white border border-slate-200"}`}
                          >
                            <Text
                              className={`font-semibold text-xs ${mfsProvider === op ? "text-indigo-800" : "text-slate-500"}`}
                            >
                              {op}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {paymentMethod === "Bill Update" && (
                    <View className="mb-4">
                      <Text className="text-slate-600 font-bold mb-2 text-sm">
                        Updated Bill Amount (৳)
                      </Text>
                      <TextInput
                        placeholder={`Original: ৳ ${selectedParcel?.amount}`}
                        keyboardType="numeric"
                        value={billAmount}
                        onChangeText={setBillAmount}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium"
                      />
                    </View>
                  )}

                  <Text className="text-slate-600 font-bold mb-2 text-sm">
                    Note / Remarks
                  </Text>
                  <TextInput
                    placeholder="Enter notes (e.g. transaction ID, partial reasons)..."
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium h-20 mb-6 text-xs"
                  />
                </View>
              )}

              {actionType === "reschedule" && (
                <View>
                  <Text className="text-slate-600 font-bold mb-2 text-sm">
                    Reason for Rescheduling
                  </Text>
                  <View className="flex-row items-center gap-2 mb-2">
                    <TouchableOpacity
                      className="flex-row items-center flex-1 px-3 py-2.5 border border-gray-200 rounded bg-white"
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Feather name="calendar" size={18} color={"#9CA3AF"} />
                      <Text
                        className={`ml-2 font-medium ${rescheduleDate ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {rescheduleDate
                          ? formatDate(rescheduleDate)
                          : "Select Date"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center flex-1 px-3 py-2.5 border border-gray-200 rounded bg-white"
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Feather name="clock" size={18} color={"#9CA3AF"} />
                      <Text
                        className={`ml-2 font-medium ${rescheduleDate ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {rescheduleDate
                          ? formatTime(rescheduleDate)
                          : "Select Time"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={rescheduleDate || new Date()}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={onChangeDate}
                    />
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      value={rescheduleDate || new Date()}
                      mode="time"
                      display="default"
                      onChange={onChangeTime}
                    />
                  )}
                  <TextInput
                    placeholder="Type reason here (Customer unavailable, Phone off, etc.)..."
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={4}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium h-24 mb-6 text-sm"
                  />
                </View>
              )}

              {/* REJECT FLOW */}
              {actionType === "reject" && (
                <View>
                  <Text className="text-slate-600 font-bold mb-2 text-sm">
                    Reason for Rejection
                  </Text>
                  <TextInput
                    placeholder="Why did the customer reject this package?..."
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium h-20 mb-6 text-xs"
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={handleActionSubmit}
                className="bg-indigo-600 py-4 rounded-xl items-center shadow-lg shadow-indigo-600/30"
              >
                <Text className="text-white font-bold text-base">
                  Submit Update
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
