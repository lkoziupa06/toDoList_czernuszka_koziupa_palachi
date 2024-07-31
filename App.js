import { useState, useEffect} from 'react';
import { StatusBar} from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { guardarTareasEnAsyncStorage, recuperarTareasDeAsyncStorage, addToDo, toggleCompletion, tareaMasRapida, borrarTareas, eliminarTarea} from './services/task-service.js';
import CustomButton from './components/CustomButton.js';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [tareasTemporal, setTareasTemporal] = useState([]);
  const [tareaInput, setTareaInput] = useState('');

  useEffect(() => {
    const fetchTareas = async () => {
      const tareasRecuperadas = await recuperarTareasDeAsyncStorage();
      setTareas(tareasRecuperadas);
      setTareasTemporal(tareasRecuperadas);
    };
    fetchTareas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>To Do List</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Enter your task here"
        value={tareaInput}
        onChangeText={setTareaInput}
      />

      <View style={styles.buttonContainer}>
        <CustomButton title="Add Task" onPress={() => addToDo(tareaInput, tareas, setTareas, setTareasTemporal)} />
        <CustomButton title="View Fastest Task" onPress={() => tareaMasRapida(tareas)} />
        <CustomButton title="Delete All Tasks" onPress={() => borrarTareas(setTareas, setTareasTemporal)} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {tareas.map((tarea, index) => (
          <View key={index} style={styles.task}>
            <TouchableOpacity onPress={() => toggleCompletion(index, tareas, setTareas)}>
              <Text style={[styles.taskText, tarea.completada && styles.completedTask]}>
                {tarea.tarea}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    
      <StatusBar style="auto" />
    </View>
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
    alignItems: 'center', 
    marginTop: 5,
    paddingVertical: 10,
  },
  task: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 25,
    width: '100%', 
    height: 45, 
    margin: 10,
    justifyContent: 'center',
  },
  taskText: {
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
