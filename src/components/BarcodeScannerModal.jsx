import React, { useEffect } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function BarcodeScannerModal({ visible, onClose, onBarcodeScanned }) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!visible) return null;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.centeredMessage}>
          <Text style={styles.errorText}>We need your permission to use the camera hardware</Text>
          <Button onPress={requestPermission} title="Grant Permission" />
          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

const handleBarcodeScanned = (scanningResult) => {
  const { data } = scanningResult;

  if (data) {
    onBarcodeScanned(data);
    onClose();
  }
};

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        //   barcodeScannerSettings={{
        //     // 🚨 FIX: We expanded the format list to capture nearly all global barcode versions
        //     barcodeTypes: [
        //       "qr",
        //       "ean13",
        //       "ean8",
        //       "upc_a",
        //       "upc_e",
        //       "code128",
        //       "code39",
        //       "code93",
        //       "itf14",
        //       "codabar",
        //       "pdf417",
        //       "aztec",
        //       "datamatrix"
        //     ],
        //   }}
        />

        <View style={styles.overlayContainer}>
          <View style={styles.scannerTargetBox}>
            <View style={styles.laserLine} />
          </View>
          <Text style={styles.hintText}>Align barcode inside the guide box</Text>
        </View>

        {/* Floating Dismiss Button */}
        <TouchableOpacity style={styles.btnClose} onPress={onClose}>
          <Text style={styles.btnCloseText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlayContainer: { ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center" },
  
  scannerTargetBox: { 
    width: 280, 
    height: 160, 
    borderWidth: 2, 
    borderColor: "#0056b3", 
    borderRadius: 12, 
    backgroundColor: "transparent",
    justifyContent: "center", // Center the laser line vertically
    alignItems: "center",
    position: "relative"
  },
  
  // Custom laser line style
  laserLine: {
    width: "90%",
    height: 2,
    backgroundColor: "#ef4444",
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },

  hintText: { color: "#fff", fontSize: 13, fontWeight: "600", marginTop: 16, backgroundColor: "rgba(0,0,0,0.65)", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  centeredMessage: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#fff" },
  errorText: { color: "#334155", fontSize: 15, textAlign: "center", marginBottom: 16 },
  btnClose: { position: "absolute", bottom: 40, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 32, paddingVertical: 12, borderRadius: 30 },
  btnCloseText: { color: "#fff", fontSize: 14, fontWeight: "700" }
});