import * as d3 from 'd3';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Line, Path, Svg} from 'react-native-svg';
import {calculateHorizontalRulerYPositions} from '../../../Utils';

const PortfolioFundGraph = ({data}) => {
  var svgWidth = 137.14;
  var svgHeight = 50.28;

  const yMinValue = d3.min(data, (d) => d.payDegeri);
  const yMaxValue = d3.max(data, (d) => d.payDegeri);

  const xScale = d3
    .scaleUtc()
    .domain(d3.extent(data, (d) => new Date(d.tarih)))
    .range([0, svgWidth]);

  const yScale = d3
    .scaleLinear()
    .range([svgHeight, 0])
    .domain([yMinValue, yMaxValue]);

  const line = d3
    .line()
    .x((d) => xScale(new Date(d.tarih)))
    .y((d) => yScale(d.payDegeri))(data);

  //calculate horizontal line locations
  var numberOfLines = 3;
  var padding = 4;

  var yPositions = calculateHorizontalRulerYPositions(
    svgHeight,
    padding,
    numberOfLines,
    yScale,
  );

  const OnLayoutEvent = (event) => {
    const {width, height} = event.nativeEvent.layout;
  };

  return (
    <View style={styles.MainStyle}>
      <Svg {...{svgWidth, svgHeight}}>
        {yPositions.map((item, index) => {
          return (
            <Line
              x1="0"
              y1={item.position}
              x2={svgWidth}
              y2={item.position}
              stroke={'#000000'}
              strokeWidth="0.4"
              key={'line' + index}
            />
          );
        })}
        <Path d={line} fill="transparent" stroke="#ed0547" strokeWidth={1.2} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  MainStyle: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});

export default PortfolioFundGraph;
