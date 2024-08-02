import React from 'react';
import { eliminarTarea, guardarTareasEnAsyncStorage } from '../services/task-service.js';
import { View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Task = ({ tarea, index, toggleCompletion, swipeableRefs, tareas, setTareas }) => {
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

  const handleFavoriteToggle = (index) => {
    const tareaMarcada = { ...tarea, favorita: !tarea.favorita }; 
    const nuevasTareas = tareas.filter((_, i) => i !== index); 
  
    if (tareaMarcada.favorita) {
      nuevasTareas.unshift(tareaMarcada); 
    } else {
      nuevasTareas.push(tareaMarcada); 
    }
  
    setTareas(nuevasTareas); 
    guardarTareasEnAsyncStorage(nuevasTareas); 
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
    <Swipeable
      ref={ref => swipeableRefs.current[index] = ref}
      renderRightActions={() => renderRightActions(index)}
      friction={2}
      rightThreshold={35}
      overshootRight={false}

      style={styles.swipeable}
    >
      <View style={styles.task}>
        <TouchableOpacity onPress={toggleCompletion} style={styles.taskContent}>
          <Fontisto
            name={tarea.completada ? 'checkbox-active' : 'checkbox-passive'}
            size={20}
            color={tarea.completada ? 'green' : 'gray'}
            style={styles.icon}
          />
          <Text style={[styles.taskText, tarea.completada && styles.completedTask]}>
            {tarea.tarea.length > 20 ? `${tarea.tarea.substring(0, 20)}...` : tarea.tarea}
          </Text>
        </TouchableOpacity>
        <View style={styles.rightSection}>
          <Text style={styles.dateText}>
            {new Date(tarea.tiempoCreacion).toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={() => handleFavoriteToggle(index)}>
            <AntDesign
              name={tarea.favorita ? 'star' : 'staro'}
              size={25}
              style={styles.iconSave}
              color={tarea.favorita ? '#B68323' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#C9DCB3',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    height: 55,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Esto ayuda a que el texto de la fecha se alinee a la derecha
    shadowColor: '#C9DCB3',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.56,
    shadowRadius: 2,
  },
  taskContent: {
    flexDirection: 'row', // Para alinear icono y texto horizontalmente
    alignItems: 'center',
    flex: 1, // Para que ocupe todo el espacio disponible excepto el espacio del texto de la fecha
  },
  icon: {
    marginRight: 10, // Espacio entre el icono y el texto
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
    paddingLeft: 10,
    marginLeft: 'auto', // Esto alinea el texto a la derecha
  },
  swipeable: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSave: {

    paddingLeft: 15,
    marginRight: 0,
  },
});

export default Task;
