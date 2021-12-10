import { apiActions } from "@actions";
import * as Utils from '@utils';
import React, { useEffect, useState } from "react";
import { Image, Linking, Text, TouchableHighlight, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import ImageSlider from 'react-native-image-slider';
import styles from "./styles";

const SliderItem = () => {
    const [banner, setBanner] = useState([]);
    
    useEffect(() => {
        var filter = {
            Records_Filter: 'ALL',
            Banner_Status: 'Active'
        }
        apiActions.get_banner(filter)
            .then(async res => {
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    setBanner(res?.Banner);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    const handleClick = (item) => {
        Linking.canOpenURL(item?.Banner_Link).then(supported => {
            if (supported) {
                Linking.openURL(item?.Banner_Link);
            } else {
                console.log("Don't know how to open URI: " + item?.Banner_Link);
            }
        });
    }
    return (
        <ImageSlider
            autoPlayWithInterval={3000}
            images={banner}
            customSlide={({ index, item, style, width }) => (
                // It's important to put style here because it's got offset inside
                <View key={index} style={[styles.customSlide, { width: Utils.SCREEN.WIDTH }]}>
                    <TouchableWithoutFeedback onPress={() => handleClick(item)}>
                        <Image source={{ uri: item?.Banner_Image }} style={[styles.customImage, { resizeMode: 'contain', width: Utils.SCREEN.WIDTH }]} />
                    </TouchableWithoutFeedback>
                </View>
            )}
            customButtons={(position, move) => {
                return (
                    <View style={styles.buttons}>
                        {banner?.map((image, index) => {
                            return (
                                <TouchableHighlight
                                    key={index}
                                    underlayColor="#ccc"
                                    onPress={() => move(index)}
                                    style={position % banner?.length === index ? styles.buttonSelected : styles.button}
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
    )
}

export default SliderItem