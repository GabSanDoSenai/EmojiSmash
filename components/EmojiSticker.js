import { View, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export default function EmojiSticker({ imageSize, stickerSource }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleImage = useSharedValue(imageSize);
  const isEnlarged = useSharedValue(false); // Estado para controlar se está ampliado

  const drag = Gesture.Pan().onChange((event) => {
    translateX.value += event.changeX;
    translateY.value += event.changeY;
  });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      // Toggle entre tamanho original e ampliado
      if (isEnlarged.value) {
        // Se está ampliado, volta ao tamanho original
        scaleImage.value = imageSize;
        isEnlarged.value = false;
      } else {
        // Se está no tamanho original, amplia
        scaleImage.value = imageSize * 2;
        isEnlarged.value = true;
      }
    });

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const combinedGestures = Gesture.Simultaneous(drag, doubleTap);

  return (
    <GestureDetector gesture={combinedGestures}>
      <Animated.View style={[containerStyle, { top: -350 }]}>
        <Animated.Image
          source={stickerSource}
          resizeMode="contain"
          style={[imageStyle, { width: imageSize, height: imageSize }]}
        />
      </Animated.View>
    </GestureDetector>
  );
}