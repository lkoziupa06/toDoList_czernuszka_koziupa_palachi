import { useState, useEffect} from 'react';
import { StatusBar} from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from './components/CustomButton.js';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [tareasTemporal, setTareasTemporal] = useState([]);
  const [tareaInput, setTareaInput] = useState('');

  useEffect(() => {
    recuperarTareasDeAsyncStorage();
  }, []);

  const guardarTareasEnAsyncStorage = async (tareas) => {
    try {
      await AsyncStorage.setItem('tareas', JSON.stringify(tareas));
    } catch (error) {
      console.error('Error guardando las tareas en AsyncStorage', error);
    }
  };

  const recuperarTareasDeAsyncStorage = async () => {
    try {
      const tareasGuardadas = await AsyncStorage.getItem('tareas');
      if (tareasGuardadas !== null) {
        setTareas(JSON.parse(tareasGuardadas));
        setTareasTemporal(JSON.parse(tareasGuardadas));
      }
    } catch (error) {
      console.error('Error recuperando las tareas de AsyncStorage', error);
    }
  };

  const addToDo = () => {
    const tarea = tareaInput.trim();
    if (tarea !== "") {
      const tiempo = new Date().getTime();
      const nuevaTarea = {
        tarea: tarea,
        tiempoCreacion: tiempo,
        completada: false,
        tiempoFinalizacion: null
      };
      
      const nuevasTareas = [...tareasTemporal, nuevaTarea];
      setTareasTemporal(nuevasTareas);
      setTareas(nuevasTareas);
      setTareaInput('');
      guardarTareasEnAsyncStorage(nuevasTareas);
    }
  };

  const toggleCompletion = (index) => {
    const updatedTareas = [...tareas];
    const tarea = updatedTareas[index];
    tarea.completada = !tarea.completada;
    if (tarea.completada) {
      tarea.tiempoFinalizacion = new Date().getTime();
    }
    setTareas(updatedTareas);
    guardarTareasEnAsyncStorage(updatedTareas);
  };

  const tareaMasRapida = () => {
    let tareaMasRapida = null;
    let tiempoMasRapido = Infinity;
    tareas.forEach(tarea => {
      if (tarea.completada && tiempoMasRapido > (tarea.tiempoFinalizacion - tarea.tiempoCreacion)) {
        tareaMasRapida = tarea;
        tiempoMasRapido = (tarea.tiempoFinalizacion - tarea.tiempoCreacion);
      }
    });

    if (tareaMasRapida != null) {
      Alert.alert("La tarea más rápida fue", tareaMasRapida.tarea);
    } else {
      Alert.alert("No hay tareas completas aún");
    }
  };

  const borrarTareas = () => {
    setTareas([]);
    setTareasTemporal([]);
    guardarTareasEnAsyncStorage([]);
  };

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
        <CustomButton title="Add Task" onPress={addToDo} />
        <CustomButton title="View Fastest Task" onPress={tareaMasRapida} />
        <CustomButton title="Delete All Tasks" onPress={borrarTareas} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}
      >
        {tareas.map((tarea, index) => (
          <View key={index} style={styles.task}>
            <TouchableOpacity onPress={() => toggleCompletion(index)}>
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
