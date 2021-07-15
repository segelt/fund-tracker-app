import * as d3 from 'd3';
import React, {useContext} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {G, Path, Svg} from 'react-native-svg';
import {Context} from '../../context/ThemeProvider';
import {commaDelimitedNumber} from '../../Utils';

const uniqueListingCircleRadius = 10;

const renderListings = (item, colorScheme, textColor) => {
  const data = item.item;
  const index = item.index;

  return (
    <View style={styles.uniqueListing}>
      <View style={{flexDirection: 'row'}}>
        {/* Circle */}
        <View style={{...styles.circle, backgroundColor: colorScheme(index)}} />

        {/* Fund type */}
        <Text
          numberOfLines={2}
          style={{
            ...styles.uniqueListingText,
            width: 130,
            color: textColor,
          }}>
          {data.fundType}
        </Text>
      </View>

      {/* Amount */}
      <Text
        numberOfLines={2}
        style={{
          textAlign: 'right',
          ...styles.uniqueListingText,
          color: textColor,
          marginRight: 10,
        }}>
        ₺{commaDelimitedNumber(data.totalPrice.toFixed(2))}
      </Text>
    </View>
  );
};

function PieChartListing(props) {
  const {theme} = useContext(Context);
  const {colors} = theme;
  const pieChartData = props.data;

  //d3.SchemeSet1, or choose one from https://observablehq.com/@d3/color-schemes
  var color = !theme.dark
    ? d3.scaleOrdinal([
        '#0a1128',
        '#1282a2',
        '#f9c74f',
        '#ee6c4d',
        '#2b2d42',
        '#144552',
        '#f95d6a',
        '#ba181b',
        '#ffbc42',
        '#00b7ff',
        '#fdea45',
      ])
    : d3.scaleOrdinal([
        '#F9B218',
        '#2CB5F4',
        '#8D7CF3',
        '#e15759',
        '#13C38D',
        '#4e79a7',
        '#af7aa1',
        '#ff9da7',
        '#d17f96',
        '#bab0ab',
      ]);

  var data = pieChartData.map((data) => parseFloat(data.percentageTotal));

  const SvgWidth = props.width * 0.4;
  const SvgHeight = props.height - 30;
  const radius = SvgHeight / 3;

  var pieGenerator = d3
    .pie()
    .sort(null)
    .value((d) => d)(data);
  var arc = d3
    .arc()
    //.padAngle(0.05)
    .innerRadius(radius * 0.8)
    .outerRadius(radius * 0.65);

  return (
    <View style={{...styles.PieChartView, width: props.width}}>
      {/* Contains both pie chart and the info */}
      <View style={styles.VisualContainer}>
        {/* Part that contains information */}
        <View style={{...styles.ListContainer, paddingVertical: 30}}>
          <FlatList
            data={pieChartData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={(item) => {
              //item.item and item.index as props
              return renderListings(item, color, colors.text);
            }}
          />
        </View>

        {/* Part that contains the pie */}
        <View style={styles.PieChartContainer}>
          <Svg width={SvgWidth} height={SvgHeight}>
            <G transform={`translate(${SvgWidth / 2},${SvgHeight / 2 + -15})`}>
              {pieGenerator.map((item, index) => {
                return (
                  <G key={'g' + index.toString()}>
                    <Path
                      d={arc(item)}
                      fill={color(index)}
                      key={'piegen' + index.toString()}
                    />
                  </G>
                );
              })}
            </G>
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  PieChartView: {
    flex: 1,
  },
  Title: {
    marginTop: 15,
    fontFamily: 'Proxima-Nova-Alt-Regular',
    fontSize: 24,
    textAlign: 'center',
  },
  VisualContainer: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'red',
  },
  PieChartContainer: {
    flex: 4,
    //backgroundColor: 'green',
  },
  ListContainer: {
    flex: 6,
    //backgroundColor: 'yellow',
  },
  uniqueListing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  circle: {
    width: uniqueListingCircleRadius,
    height: uniqueListingCircleRadius,
    borderRadius: uniqueListingCircleRadius / 4,
    marginRight: 10,
    alignSelf: 'center',
  },
  uniqueListingText: {
    fontSize: 15,
    fontFamily: 'ProximaNova-Alt-Regular',
    flexWrap: 'wrap',
  },
});

export default PieChartListing;
