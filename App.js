import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { guardarTareasEnAsyncStorage, recuperarTareasDeAsyncStorage, addToDo, toggleCompletion, tareaMasRapida, borrarTareas, eliminarTarea } from './services/task-service.js';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import CustomButton from './components/CustomButton.js';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [tareaInput, setTareaInput] = useState('');
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
            swipeableRefs.current[index].close();
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

        <TextInput
          style={styles.textInput}
          placeholder="Enter your task here"
          value={tareaInput}
          onChangeText={setTareaInput}
        />

        <View style={styles.buttonContainer}>
          <CustomButton title="Add Task" onPress={() => addToDo(tareaInput, tareas, setTareas, setTareaInput)} />
          <CustomButton title="View Fastest Task" onPress={() => tareaMasRapida(tareas)} />
          <CustomButton title="Delete All Tasks" onPress={() => borrarTareas(setTareas)} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}
        >
          {tareas.map((tarea, index) => (
        <Swipeable
          key={tarea.tiempoCreacion} // Usa tiempoCreacion como clave única
          renderRightActions={() => renderRightActions(index)}
          style={styles.swipeable}
        >
        <View style={styles.task}>
          <TouchableOpacity onPress={() => toggleCompletion(index, tareas, setTareas)}>
            <Text style={[styles.taskText, tarea.completada && styles.completedTask]}>
              {tarea.tarea}
            </Text>
          </TouchableOpacity>
        </View>
  </Swipeable>
))}
        </ScrollView>

        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 20, 
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
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
  scrollView: {
    flex: 1, 
    width: '100%', 
  },
  scrollContainer: {
    marginTop: 5,
    paddingVertical: 10,
  },
  task: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10, 
    width: '100%', 
    height: 55, 
    marginVertical: 5, 
    justifyContent: 'flex-start',
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5, 
    borderRadius: 5,
    width: 100,
    height: 55,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  swipeable: {
    width: '100%', 
    paddingHorizontal: 0, 
    paddingVertical: 0, 
  },
});
