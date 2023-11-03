import {
  Canvas,
  Group,
  RoundedRect,
  Text as SkiaText,
  matchFont,
} from '@shopify/react-native-skia';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import {PanGesture} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

const font = matchFont({
  fontSize: 24,
});

function Rect({index, offset}) {
  // const y = useDerivedValue(() => {
  //   return offset.value + 150 * index + 50;
  // });

  return (
    <Group
      transform={[
        {
          translateY: 150 * index + 50,
        },
      ]}>
      <RoundedRect x={30} y={0} width={80} height={100} r={16} color="red" />
      <SkiaText
        text={index.toString()}
        font={font}
        color="white"
        x={50}
        y={40}
      />
    </Group>
  );
}

function RectRN({index, offset, color = 'green'}) {
  // const y = useDerivedValue(() => {
  //   return offset.value + 50 + 50 * index;
  // });
  // const styles = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateY: offset.value + 50 + 50 * index,
  //       },
  //     ],
  //   };
  // });

  return (
    <Animated.View
      // left={30}
      // top={50 + 50 * index}
      style={[
        // styles,
        {
          top: 50 + 50 * index,
          left: 30,
          width: 80,
          height: 100,
          backgroundColor: color,
          borderRadius: 16,
        },
      ]}
      // width={150}
      // height={100}
      // borderRadius={16}
      // backgroundColor="green"
    >
      <Text
        style={{color: 'white', fontSize: 24, marginTop: 20, marginLeft: 20}}>
        {index}
      </Text>
    </Animated.View>
  );
}

const array = new Array(30).fill(0).map((_, index) => index);

function App() {
  const offset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      requestAnimationFrame(() => {
        offset.value = event.contentOffset.y * -1;
      });
    },
  });

  const panGesture = Gesture.Pan()
    .onBegin(event => {})
    .onChange(event => {
      requestAnimationFrame(() => {
        offset.value += event.changeY;
      });
    })
    .onEnd(event => {
      offset.value = withDecay({
        velocity: event.velocityY,
        deceleration: 0.998,
      });
    });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <Canvas mode="continuous" style={[{flex: 1}]}>
            <Group
              transform={useDerivedValue(() => {
                return [{translateY: offset.value}];
              })}>
              {array.map(index => (
                <Rect key={index} index={index} offset={offset} />
              ))}
            </Group>
          </Canvas>

          <View
            style={{
              flex: 1,
            }}>
            <Animated.View
              style={{
                top: useDerivedValue(() => {
                  return offset.value;
                }),
              }}>
              {array.map(index => (
                <RectRN
                  key={index}
                  color="blue"
                  index={index}
                  offset={offset}
                />
              ))}
            </Animated.View>
          </View>

          <View
            style={{
              flex: 1,
            }}>
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: useDerivedValue(() => {
                      return offset.value;
                    }),
                  },
                ],
              }}>
              {array.map(index => (
                <RectRN key={index} index={index} offset={offset} />
              ))}
            </Animated.View>
          </View>
        </View>

        {/* <GestureDetector gesture={panGesture}> */}
        <Animated.View style={StyleSheet.absoluteFill}>
          <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={1}>
            <View style={{height: 10000}} />
          </Animated.ScrollView>
        </Animated.View>
        {/* </GestureDetector> */}
      </View>
    </GestureHandlerRootView>
  );
}

export default App;

// import {Canvas, Rect, Skia, Group} from '@shopify/react-native-skia';
// import type {SkRect} from '@shopify/react-native-skia';
// import React, {useMemo, useState} from 'react';
// import {
//   StyleSheet,
//   useWindowDimensions,
//   View,
//   Text,
//   Button,
// } from 'react-native';
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from 'react-native-gesture-handler';
// import type {SharedValue} from 'react-native-reanimated';
// import Animated, {
//   useDerivedValue,
//   useSharedValue,
// } from 'react-native-reanimated';

// const Size = 25;
// const Increaser = 50;

// export const PerformanceDrawingTest: React.FC = () => {
//   const [numberOfBoxes, setNumberOfBoxes] = useState(150);

//   const {width, height} = useWindowDimensions();

//   const SizeWidth = Size;
//   const SizeHeight = Size * 0.45;

//   const pos = useSharedValue<{x: number; y: number}>({
//     x: width / 2,
//     y: height * 0.25,
//   });

//   const rects = useMemo(
//     () =>
//       new Array(numberOfBoxes)
//         .fill(0)
//         .map((_, i) =>
//           Skia.XYWHRect(
//             5 + ((i * Size) % width),
//             25 + Math.floor(i / (width / Size)) * Size,
//             SizeWidth,
//             SizeHeight,
//           ),
//         ),
//     [numberOfBoxes, width, SizeWidth, SizeHeight],
//   );

//   const gesture = Gesture.Pan().onChange(e => (pos.value = e));

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <View style={styles.container}>
//         <View style={styles.mode}>
//           <View style={styles.panel}>
//             <Button
//               title="⬇️"
//               onPress={() => setNumberOfBoxes(n => Math.max(0, n - Increaser))}
//             />
//             <Text>&nbsp;Size&nbsp;</Text>
//             <Text>{numberOfBoxes}</Text>
//             <Text>&nbsp;</Text>
//             <Button
//               title="⬆️"
//               onPress={() => setNumberOfBoxes(n => n + Increaser)}
//             />
//           </View>
//         </View>
//         <View style={{flex: 1}}>
//           <Canvas style={styles.container} mode="default">
//             {rects.map((_, i) => (
//               <Rct pos={pos} key={i} rct={rects[i]} />
//             ))}
//           </Canvas>
//           <GestureDetector gesture={gesture}>
//             <Animated.View style={StyleSheet.absoluteFill} />
//           </GestureDetector>
//         </View>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// interface RctProps {
//   pos: SharedValue<{x: number; y: number}>;
//   rct: SkRect;
// }

// const Rct = ({pos, rct}: RctProps) => {
//   const transform = useDerivedValue(() => {
//     const p1 = {x: rct.x, y: rct.y};
//     const p2 = pos.value;
//     const r = Math.atan2(p2.y - p1.y, p2.x - p1.x);
//     return [{rotate: r}];
//   });
//   return (
//     <Group transform={transform} origin={rct}>
//       <Rect rect={rct} color="#00ff00" />
//       <Rect rect={rct} color="#4060A3" style="stroke" strokeWidth={2} />
//     </Group>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   mode: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   panel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default PerformanceDrawingTest;
