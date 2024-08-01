import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { recuperarTareasDeAsyncStorage, addToDo, toggleCompletion, tareaMasRapida, borrarTareas, eliminarTarea } from './services/task-service.js';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CustomButton from './components/CustomButton.js';
import ModalTask from './components/ModalTask.js';
import Task from './components/Task.js'

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

  const handleDelete = (index) => {
    Alert.alert(
      "Eliminar Tarea",
      "¿Estás seguro de que deseas eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => {
          if (swipeableRefs.current[index]) {
            swipeableRefs.current[index].close(); // Cierra el Swipeable antes de eliminar
          }
          eliminarTarea(index, tareas, setTareas);
        }}
      ]
    );
  };

  const renderRightActions = (index) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(index)}
    >
      <Text style={styles.deleteButtonText}>Eliminar</Text>
    </TouchableOpacity>
  );

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
                  toggleCompletion={toggleCompletion}
                  renderRightActions={renderRightActions}
                  swipeableRefs={swipeableRefs}
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
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 20, 
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTittleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
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
  deleteButton: {
    backgroundColor: '#d60000',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5, 
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    width: 100,
    height: 55,
  },
  deleteButtonText: {
    color: '#f4f3f3',
    fontWeight: 'bold',
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
