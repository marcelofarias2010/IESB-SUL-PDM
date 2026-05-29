import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";

export default function DatePicker({ form, setForm }) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (_, selectDate) => {
    setShowPicker(false);
    if (selectDate) {
      setForm({ ...form, date: selectDate });
    }
  };

  let currentDate = new Date();
  if (form.date) {
    const parsed = new Date(form.date);
    if (!isNaN(parsed.getTime())) {
      currentDate = parsed;
    }
  }

  const webDateString = currentDate.toISOString().split("T")[0];

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Data</Text>
      
      {Platform.OS === "web" ? (
        <input
          type="date"
          style={{
            backgroundColor: "#FFF",
            borderRadius: 8,
            padding: 16,
            fontSize: 16,
            marginBottom: 16,
            borderWidth: 0,
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
            fontFamily: "inherit"
          }}
          value={webDateString}
          onChange={(e) => {
            const text = e.target.value;
            if (text) {
              const newDate = new Date(text + "T12:00:00Z");
              if (!isNaN(newDate.getTime())) {
                setForm({ ...form, date: newDate });
              }
            }
          }}
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <View pointerEvents="none">
              <TextInput
                value={currentDate.toLocaleDateString("pt-BR")}
                style={globalStyles.input}
                editable={false}
              />
            </View>
          </TouchableOpacity>

          {showPicker && (
            <RNDateTimePicker
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              value={currentDate}
              onChange={handleDateChange}
            />
          )}
        </>
      )}
    </View>
  );
}