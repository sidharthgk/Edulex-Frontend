import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const TestResult = () => {
    return (
        <View style={styles.container}>
            <Text>
                your result will be here
            </Text>
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

export default TestResult;
