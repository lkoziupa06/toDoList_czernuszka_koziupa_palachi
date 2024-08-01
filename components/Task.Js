import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

const Task = ({ tarea, index, toggleCompletion, renderRightActions, swipeableRefs }) => {
  return (
    <Swipeable
      ref={ref => swipeableRefs.current[index] = ref}
      renderRightActions={() => renderRightActions(index)}
      style={styles.swipeable}
    >
      <View style={styles.task}>
        <TouchableOpacity onPress={() => toggleCompletion(index)} style={styles.taskContent}>
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
        <Text style={styles.dateText}>
          {new Date(tarea.tiempoCreacion).toLocaleDateString()}
        </Text>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  task: {
    backgroundColor: '#e1e0e0',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Esto ayuda a que el texto de la fecha se alinee a la derecha
    shadowColor: '#949494',
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
    marginLeft: 'auto', // Esto alinea el texto a la derecha
  },
  swipeable: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export default Task;
