import React from 'react';
import { StyleSheet, Text, View, TextInput, Modal, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import CustomButton from './CustomButton';

const ModalTask = ({ 
  modalVisible, 
  setModalVisible, 
  tareaInput, 
  setTareaInput, 
  addToDo, 
  tareas, 
  setTareas 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Añadir Tarea</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your task here"
              value={tareaInput}
              onChangeText={setTareaInput}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Añadir la tarea"
                onPress={() => {
                  addToDo(tareaInput, tareas, setTareas, setTareaInput);
                  setModalVisible(false);
                }}
              />
              <CustomButton
                title="Cancelar"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#d2d2d2',
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 25,
        height: 250,
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        width: '100%',
        marginBottom: 20,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10, 
    },
});

export default ModalTask;
