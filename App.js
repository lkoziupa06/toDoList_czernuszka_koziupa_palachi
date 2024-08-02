// App.js
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView} from 'react-native';
import { recuperarTareasDeAsyncStorage, addToDo, tareaMasRapida, borrarTareas, eliminarTarea, toggleCompletion } from './services/task-service.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomButton from './components/CustomButton.js';
import ModalTask from './components/ModalTask.js';
import Task from './components/Task.js'; // Asegúrate de que el import sea correcto

// Define toggleCompletion aquí, asegurando que recibe los argumentos correctos

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [tareaInput, setTareaInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const swipeableRefs = useRef([]); 

  useEffect(() => {
    const fetchTareas = async () => {
      const tareasRecuperadas = await recuperarTareasDeAsyncStorage();
      setTareas(tareasRecuperadas);
    };
    fetchTareas();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.titleText}>To Do List</Text>
        <Text style={styles.subTittleText}>Czernuszka, Palachi y Koziupa</Text>
        <View style={styles.scrollViewContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            style={styles.scrollView}
          >
            {tareas.length === 0 ? (
              <Text style={styles.emptyText}>No hay tareas</Text>
            ) : (
              tareas.map((tarea, index) => (
                <Task
                  key={tarea.tiempoCreacion}
                  tarea={tarea}
                  index={index}
                  toggleCompletion={() => toggleCompletion(index, tareas, setTareas)}
                  swipeableRefs={swipeableRefs}
                  tareas={tareas} 
                  setTareas={setTareas} 
                />
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.addButtonContainer}>
          <CustomButton title="Añadir nueva tarea" onPress={() => setModalVisible(true)} />
        </View>

        <ModalTask
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          tareaInput={tareaInput}
          setTareaInput={setTareaInput}
          addToDo={addToDo}
          tareas={tareas}
          setTareas={setTareas}
        />

        <StatusBar style="auto" />

      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555358',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 20, 
  },
  titleText: {
    color: '#C6CA53',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTittleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C6CA53',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1, 
    marginBottom: 40,
  },
  scrollContainer: {
    marginTop: 5,
    paddingVertical: 10,
  },
  scrollViewContainer: {
    flex: 1, 
    width: '100%',
  },
  addButtonContainer: {
    bottom: 30,
    width: '100%',
    paddingBottom: 25,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold', 
    textAlign: 'center',
  }
});
