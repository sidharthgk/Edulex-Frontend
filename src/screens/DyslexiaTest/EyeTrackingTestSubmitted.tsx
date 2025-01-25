import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const EyeTrackingTestSubmitted = ({ navigation }: any) => {
    return (
        <View style={styles.container}>
            <Text>Video submitted</Text>
            <TouchableOpacity onPress={navigation.navigate('HandWritingTestInstructions')}>
                <Text>move on to the next test</Text>
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

export default EyeTrackingTestSubmitted;
