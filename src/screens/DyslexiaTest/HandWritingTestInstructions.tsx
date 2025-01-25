import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
const HandWritingTestInstructions = ({ navigation }: any) => {
    return(
        <View style={styles.container}>
            <Text>Instructions</Text>
            <TouchableOpacity onPress={navigation.navigate('WritingTest')}>
                <Text>continue</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});
export default HandWritingTestInstructions;
