import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

const Loader = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;
    const loadingBarWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animação dos pontos (blinking dots)
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot1, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(dot2, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(dot3, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        ).start();

        // Animação da barra de carregamento
        Animated.loop(
            Animated.timing(loadingBarWidth, {
                toValue: 200, // Largura máxima da barra de carregamento
                duration: 4000,
                easing: Easing.ease,
                useNativeDriver: false,
            })
        ).start();
    }, [dot1, dot2, dot3, loadingBarWidth]);

    return (
        <View style={styles.container}>
            <View style={styles.loader}>
                <View style={styles.loadingTextContainer}>
                    <Text style={styles.loadingText}>PROCURANDO BABÁS</Text>
                    <Animated.Text style={[styles.dot, { opacity: dot1 }]}>.</Animated.Text>
                    <Animated.Text style={[styles.dot, { opacity: dot2 }]}>.</Animated.Text>
                    <Animated.Text style={[styles.dot, { opacity: dot3 }]}>.</Animated.Text>
                </View>

                <View style={styles.loadingBarBackground}>
                    <Animated.View style={[styles.loadingBar, { width: loadingBarWidth }]}>
                        <View style={styles.whiteBarsContainer}>
                            {[...Array(10)].map((_, i) => (
                                <View key={i} style={styles.whiteBar} />
                            ))}
                        </View>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0BBEE5", // Cor de fundo
    },
    loader: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 5,
    },
    loadingTextContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    loadingText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 10,
    },
    dot: {
        marginLeft: 3,
        fontSize: 14,
        color: "white",
    },
    loadingBarBackground: {
        height: 30,
        display: "flex",
        alignItems: "center",
        width: 200,
        backgroundColor: "#FFF", // Cor base do carregamento
        borderRadius: 15,
        padding: 5,
    },
    loadingBar: {
        height: 20,
        backgroundColor: "#0BBEE5",
        borderRadius: 10,
        overflow: "hidden",
    },
    whiteBarsContainer: {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 18,
    },
    whiteBar: {
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        width: 15,
        height: 50,
        transform: [{ rotate: "45deg" }],
    },
});

export default Loader;
