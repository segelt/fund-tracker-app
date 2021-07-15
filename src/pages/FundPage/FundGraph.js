import * as d3 from 'd3';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {getYForX, parse} from 'react-native-redash';
import {G, Line, Path, Svg, Text as SvgText} from 'react-native-svg';
import * as path from 'svg-path-properties';
import {Context} from '../../context/ThemeProvider';
import {
  calculateHorizontalRulerXPositions,
  calculateHorizontalRulerYPositions,
} from '../../Utils';

var svgWidth = -10;
var svgHeight = -10;
var graphWidth = -10;
var graphHeight = -10;
var graphPadding = 30;

const FundGraph = ({data, width, height, updateParentVal}) => {
  const AnimatedSvg = Animated.createAnimatedComponent(Svg);
  svgWidth = width;
  svgHeight = height;
  graphWidth = svgWidth + graphPadding;
  graphHeight = svgHeight + graphPadding;

  const {theme} = useContext(Context);
  const {colors} = theme;

  const yMinValue = d3.min(data, (d) => d.payDegeri) - 0.01;
  const yMaxValue = d3.max(data, (d) => d.payDegeri) + 0.01;

  const xMinValue = d3.min(data, (d) => 0);
  const xMaxValue = d3.max(data, (d) => data.length);
  const singleItemInterval = svgWidth / (data.length - 1);

  var xScale = d3
    .scaleUtc()
    .domain([xMinValue, xMaxValue])
    .range([0, (svgWidth * data.length) / (data.length - 1)]);

  var yScale = d3
    .scaleLinear()
    .range([svgHeight, 0])
    .domain([yMinValue, yMaxValue]);

  var line = d3
    .line()
    .x((d, index) => xScale(index))
    .y((d) => yScale(d.payDegeri))(data);

  //calculate horizontal line locations
  var numberOfLines = 3;
  var padding = 20;

  var yPositions = calculateHorizontalRulerYPositions(
    svgHeight,
    padding,
    numberOfLines,
    yScale,
  );

  const properties = path.svgPathProperties(line);
  //const lineLength = properties.getTotalLength();
  var parsedLine = parse(line);

  const translateX = useSharedValue(0);
  const translateY = useDerivedValue(() => {
    return Math.max(
      1,
      //getYForX(parsedLine, Math.min(Math.max(translateX.value, 1), svgWidth)),
      getYForX(parsedLine, translateX.value),
    );
  });

  const graphValue = useDerivedValue(() => {
    var newValue =
      data[
        Math.max(
          0,
          Math.floor(
            interpolate(
              translateX.value,
              [0, svgWidth],
              [xMinValue, xMaxValue],
            ),
          ),
        )
      ];

    updateParentVal(newValue);
    return newValue;
  });

  const scrollTranslationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value - 3},
        {translateY: translateY.value - 5},
      ],
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      //translateX.value = Math.min(Math.max(event.x, 0), svgWidth - 1);
      var actualPos = Math.min(Math.max(event.x, 0), svgWidth);

      translateX.value = Math.min(
        Math.floor((actualPos ?? 1) / singleItemInterval) * singleItemInterval,
        svgWidth - 1,
      );
    },
    onEnd: (_, ctx) => {},
  });

  //removing this seed data causes the main page to not render fund information correctly
  updateParentVal({
    payDegeri: -100,
    tarih: '1990-03-09',
  });

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      }}>
      <AnimatedSvg height={svgHeight} width={svgWidth}>
        {/* Graph itself */}
        <G x={0} y={0}>
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <AnimatedSvg
              height={svgHeight}
              width={svgWidth}
              stroke="red"
              color="blue">
              {yPositions.map((item, index) => {
                return (
                  //lines
                  <G key={index.toString() + 'g'}>
                    <Line
                      x1="0"
                      y1={item.position}
                      x2={svgWidth}
                      y2={item.position}
                      stroke={colors.text}
                      strokeWidth="0.4"
                      key={index.toString()}
                    />
                  </G>
                );
              })}
              <Path
                d={line}
                fill="transparent"
                stroke="#ed0547"
                strokeWidth={1.2}
              />
            </AnimatedSvg>
          </PanGestureHandler>
        </G>

        {/* YAxis */}
        {yPositions.map((item, index) => {
          return (
            //lines
            <G key={index.toString() + 'g'}>
              <SvgText
                transform={`translate(${-35},${-4})`}
                fill={colors.text}
                fontSize={12}
                x={svgWidth}
                y={item.position}>
                {item.data.toFixed(3)}
              </SvgText>
            </G>
          );
        })}

        {/* XAxis */}
        {/* {xPositions.map((item, index) => {
          return (
            //lines
            <G key={index.toString() + 'g'}>
              <SvgText
                transform={`rotate(40, ${item.position}, ${svgHeight})`}
                fill={colors.text}
                fontSize={12}
                x={item.position}
                y={svgHeight}>
                {item.data}
              </SvgText>
            </G>
          );
        })} */}

        <Animated.View
          style={[
            {...styles.cursor, ...{bottom: svgHeight}},
            scrollTranslationStyle,
          ]}
        />
      </AnimatedSvg>
    </View>
  );
};

const styles = StyleSheet.create({
  cursor: {
    width: 4,
    height: 4,
    borderRadius: 10,
    borderColor: '#367be2',
    borderWidth: 3,
    backgroundColor: 'white',
  },
});

export default FundGraph;
