import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Función para guardar tareas en AsyncStorage
export const guardarTareasEnAsyncStorage = async (tareas) => {
  try {
    await AsyncStorage.setItem('tareas', JSON.stringify(tareas));
  } catch (error) {
    console.error('Error guardando las tareas en AsyncStorage', error);
  }
};

// Función para recuperar tareas desde AsyncStorage
export const recuperarTareasDeAsyncStorage = async () => {
  try {
    const tareasGuardadas = await AsyncStorage.getItem('tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  } catch (error) {
    console.error('Error recuperando las tareas de AsyncStorage', error);
    return [];
  }
};

// Función para añadir una nueva tarea
export const addToDo = (tareaInput, tareas, setTareas, setTareaInput) => {
  const tarea = tareaInput.trim();
  if (tarea !== "") {
    const tiempo = new Date().getTime();
    const nuevaTarea = {
      tarea: tarea,
      tiempoCreacion: tiempo,
      completada: false,
      tiempoFinalizacion: null,
      favorita: false 
    };
    
    const tareasFavoritas = tareas.filter(t => t.favorita);
    const tareasNoFavoritas = tareas.filter(t => !t.favorita);

    const nuevasTareas = [...tareasFavoritas, nuevaTarea, ...tareasNoFavoritas];
    setTareas(nuevasTareas);
    guardarTareasEnAsyncStorage(nuevasTareas);
    
    // Limpia el campo de entrada
    setTareaInput('');
  }
};

// Función para alternar la finalización de una tarea
export const toggleCompletion = (index, tareas, setTareas) => {
  const updatedTareas = [...tareas];
  const tarea = updatedTareas[index];
  tarea.completada = !tarea.completada;
  if (tarea.completada) {
    tarea.tiempoFinalizacion = new Date().getTime();
  }
  setTareas(updatedTareas);
  guardarTareasEnAsyncStorage(updatedTareas);
};

// Función para encontrar la tarea más rápida
export const tareaMasRapida = (tareas) => {
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

// Función para borrar todas las tareas
export const borrarTareas = (setTareas) => {
  setTareas([]);
  guardarTareasEnAsyncStorage([]);
};

// Función para eliminar una tarea
export const eliminarTarea = (index, tareas, setTareas) => {
  const nuevasTareas = tareas.filter((_, i) => i !== index);
  setTareas(nuevasTareas);
  guardarTareasEnAsyncStorage(nuevasTareas);
};
