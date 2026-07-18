import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions, CameraType, FlashMode } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={64} color="#9CA3AF" style={{ marginBottom: 16 }} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>We need your permission to show the camera for taking site photos.</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        if (photoData) {
          setPhoto(photoData.uri);
        }
      } catch (error) {
        console.error("Failed to take picture", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };

  const savePicture = () => {
    // In a real app, this would save to the survey context or media library
    alert('Photo saved successfully!');
    setPhoto(null);
    router.back();
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo }} style={styles.previewImage} />
        <View style={styles.previewControls}>
          <Pressable style={styles.previewButtonSecondary} onPress={retakePicture}>
            <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
            <Text style={styles.previewButtonText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.previewButtonPrimary} onPress={savePicture}>
            <MaterialIcons name="check" size={24} color="#FFFFFF" />
            <Text style={styles.previewButtonText}>Save Photo</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        flash={flash} 
        ref={cameraRef}
      >
        <View style={styles.topControls}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="white" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={28} color="white" />
          </Pressable>
        </View>

        <View style={styles.bottomControlsContainer}>
          <View style={styles.bottomControls}>
            <Pressable style={styles.iconButton} onPress={() => {}}>
              <Ionicons name="image-outline" size={28} color="white" />
            </Pressable>
            
            <Pressable 
              style={[styles.captureButton, isProcessing && styles.captureButtonProcessing]} 
              onPress={takePicture}
              disabled={isProcessing}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={28} color="white" />
            </Pressable>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50, // Account for safe area roughly
  },
  bottomControlsContainer: {
    padding: 30,
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonProcessing: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
    backgroundColor: '#000',
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  previewButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  previewButtonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
