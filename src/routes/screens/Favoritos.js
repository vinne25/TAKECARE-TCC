import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const TableWithCheckboxes = () => {
    const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const periods = ['Manhã', 'Tarde', 'Noite'];

    const [selected, setSelected] = useState(
        Array.from({ length: periods.length }, () => Array(daysOfWeek.length).fill(false))
    );

    const toggleCheckbox = (rowIndex, colIndex) => {
        const updatedSelected = [...selected];
        updatedSelected[rowIndex][colIndex] = !updatedSelected[rowIndex][colIndex];
        setSelected(updatedSelected);
    };

    return (
        <View style={styles.table}>
            {/* Cabeçalho com os dias da semana */}
            <View style={styles.row}>
                <Text style={[styles.cell, styles.headerCell]}></Text>
                {daysOfWeek.map((day, index) => (
                    <Text key={index} style={[styles.cell, styles.headerCell]}>{day}</Text>
                ))}
            </View>

            {/* Linhas para cada período */}
            {periods.map((period, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    <Text style={[styles.cell, styles.headerCell]}>{period}</Text>
                    {daysOfWeek.map((_, colIndex) => (
                        <View key={colIndex} style={styles.checkboxCell}>
                            <CheckBox
                                value={selected[rowIndex][colIndex]}
                                onValueChange={() => toggleCheckbox(rowIndex, colIndex)}
                                boxType="square" // Garante que o checkbox tenha o mesmo formato em iOS/Android
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        padding: 9,
        backgroundColor: '#FFFF',
        borderRadius: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14.5,
        paddingVertical: 6.5,
        color: '#333',
        borderWidth: 4,
        borderColor: '#ffff',

    },
    headerCell: {
        fontWeight: 'bold',
        backgroundColor: '#e0e0e0', // Dá destaque ao cabeçalho
        backgroundColor: '#ffff',
    },
    checkboxCell: {
        flex: 1,
        alignItems: 'center', // Centraliza o checkbox
        justifyContent: 'center', // Centraliza verticalmente
        paddingVertical: 12, // Ajusta a altura do checkbox
    },
});

export default TableWithCheckboxes;
