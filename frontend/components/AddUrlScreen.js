import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import qs from "qs";
import { CommonActions } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

function FormInput({ labelName, placeholderName, ...rest }) {
  return (
    <TextInput
      label={labelName}
      placeholder={placeholderName}
      style={styles.input}
      numberOfLines={1}
      {...rest}
    />
  );
}

function FormButton({ title, modeValue, ...rest }) {
  return (
    <Button
      mode={modeValue}
      {...rest}
      style={styles.button}
      contentStyle={styles.buttonContainer}
    >
      {title}
    </Button>
  );
}

const AddUrlScreen = ({ navigation: { goBack } }) => {
  const [url, setUrl] = useState("");
  const [disabled, setDisabled] = useState(true);
  const validateUrl = (text) => {
    console.log(text);
    let reg = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (reg.test(text) === false) {
      setUrl(text);
      setDisabled(true);
      return false;
    } else {
      setUrl(text);
      setDisabled(false);
    }
  };
  const shortenUrl = async () => {
    var postData = {
      url: url,
    };

    let axiosConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    };

    axios
      .post(
        "http://localhost:3003/shorten",
        qs.stringify(postData),
        axiosConfig
      )
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        goBack();
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };
  return (
    <View style={styles.container}>
      <FormInput
        labelName="URL"
        placeholderName="Type or paste your URL"
        value={url}
        autoCapitalize="none"
        onChangeText={(inputUrl) => validateUrl(inputUrl)}
      />
      <FormButton
        title="Shorten URL!"
        modeValue="contained"
        disabled={disabled}
        labelStyle={styles.loginButtonLabel}
        onPress={(url) => shortenUrl(url)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", marginHorizontal: 30 },
  input: { marginVertical: 5 },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  button: {
    marginTop: 10,
  },
  buttonContainer: {
    width: width / 2,
    height: height / 15,
  },
});

export default AddUrlScreen;
