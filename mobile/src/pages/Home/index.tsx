import React, { useEffect, useState } from "react";
import { View, Image, Text, ImageBackground } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

import styles from "./style";
import { IBGEufs, IBGEcity, ufModel, cityModel } from "../../models/address";

const Home = () => {
  const [ufs, setUfs] = useState<ufModel[]>([]);
  const [cities, setCities] = useState<cityModel[]>([]);

  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");

  const navigation = useNavigation();

  function navigateToPoints() {
    navigation.navigate("Points", { uf: selectedUf, city: selectedCity });
  }

  useEffect(() => {
    axios
      .get<IBGEufs[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
      )
      .then((res) => {
        const ufInitials = res.data.map((uf: any) => ({
          label: uf.sigla,
          value: uf.sigla,
        }));
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }
    axios
      .get<IBGEcity[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cityInitials = res.data.map((city: any) => ({
          label: city.nome,
          value: city.nome,
        }));
        setCities(cityInitials);
      });
  }, [selectedUf]);

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{
        width: 274,
        height: 368,
      }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente.
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{
              label: "Selecione o estado",
              value: 0,
              color: "#999",
            }}
            onValueChange={(value: any) => setSelectedUf(value)}
            value={selectedUf}
            items={ufs}
          />
        </View>
        <View style={styles.select}>
          <RNPickerSelect
            placeholder={{
              label: "Selecione a cidade",
              value: 0,
              color: "#999",
            }}
            onValueChange={(value: any) => setSelectedCity(value)}
            value={selectedCity}
            items={cities}
          />
        </View>
        <RectButton onPress={navigateToPoints} style={styles.button}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
