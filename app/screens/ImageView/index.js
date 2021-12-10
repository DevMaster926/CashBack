import React, { useEffect, useState } from "react";
import ImageSlider from "react-native-image-slider";
import styles from './styles';

const ImageView = (props) => {
    const { images } = props.route?.params;
    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always" }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ImageSlider
                    autoPlayWithInterval={5000}
                    images={images}
                    customSlide={({ index, item, style, width }) => (
                        // It's important to put style here because it's got offset inside
                        <View key={index} style={[styles.customSlide, { width: Utils.SCREEN.WIDTH, backgroundColor: 'white' }]}>
                            <Image source={{ uri: item }} style={[styles.customImage, { resizeMode: 'contain', width: Utils.SCREEN.WIDTH }]} />
                        </View>
                    )}
                    customButtons={(position, move) => {
                        setImageIndex(position % images?.length + 1);
                        return (
                            <View style={styles.buttons}>
                                {images?.map((image, index) => {
                                    return (
                                        <TouchableHighlight
                                            key={index}
                                            underlayColor="#ccc"
                                            onPress={() => move(index)}
                                            style={position % images?.length === index ? styles.buttonSelected : styles.button}
                                        >
                                            <Text>
                                            </Text>
                                        </TouchableHighlight>
                                    );
                                })}
                            </View>
                        )
                    }
                    }
                />
            </View>
        </SafeAreaView>
    )
}

export default ImageView;