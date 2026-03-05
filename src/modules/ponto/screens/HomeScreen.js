import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { getUserRegisters } from "../services/api";

export default function HomeScreen() {
  const [registers, setRegisters] = useState([]);

  useEffect(() => {
    loadRegisters();
  }, []);

  const loadRegisters = async () => {
    const data = await getUserRegisters();
    setRegisters(data);
  };

  return (
    <View>
      {registers.map((item) => (
        <Text key={item.id}>
          {item.date} - {item.type}
        </Text>
      ))}

      <Button title="Atualizar" onPress={loadRegisters} />
    </View>
  );
}