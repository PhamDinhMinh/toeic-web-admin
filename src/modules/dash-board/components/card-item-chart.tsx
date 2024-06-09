import { Flex, Space, Typography } from 'antd';
import ReactEcharts from 'echarts-for-react';

type TCardItemChart = {
  title: string;
  legend: string[];
  xAxis: any[];
  yAxis?: any[];
  series: any[];
  paddingLeft?: number;
  widthBoolean?: boolean;
  button?: any;
  height?: number;
  xlHeight?: number;
  xxlHeight?: number;
  left?: number;
  buttonExport?: any;
  buttonExportDetail?: any;
  setMonth?: any;
  setMonthSelect?: any;
  titleSize: number;
  optionSize: number;
  legendSize: number;
};

const CardItemChart = (props: TCardItemChart) => {
  const {
    title,
    legend,
    xAxis,
    yAxis,
    series,
    paddingLeft,
    button,
    height,
    left,
    buttonExport,
    setMonth,
    setMonthSelect,
    titleSize,
    optionSize,
    legendSize,
  } = props;

  const onEvents = {
    click: (params: any) => {
      const monthCurrent = new Date().getMonth();
      const yearCurrent = new Date().getFullYear();
      const month = parseInt(params?.name?.match(/\d+/)[0]);
      const date =
        month <= monthCurrent + 1
          ? new Date(`${yearCurrent}-${month}-2`)
          : new Date(`${yearCurrent - 1}-${month}-2`);
      setMonth && setMonth(date);
      setMonthSelect && setMonthSelect(month);
    },
  };

  return (
    <Flex
      style={{
        paddingTop: 16,
        paddingLeft: paddingLeft,
        minHeight: height || '100%',
        height: '100%',
      }}
      vertical
    >
      <Space
        direction="horizontal"
        style={{
          justifyContent: button ? 'space-between' : 'center',
          marginTop: 8,
          marginBottom: 16,
          width: '100%',
        }}
      >
        <Typography.Title
          level={4}
          style={{
            textAlign: 'center',
            marginBottom: 8,
            fontWeight: 500,
            fontSize: titleSize,
          }}
        >
          {title}
        </Typography.Title>
        <Space>
          {buttonExport}
          {button}
        </Space>
      </Space>
      <ReactEcharts
        onEvents={onEvents}
        key={Date.now()}
        theme="light"
        option={{
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
            textStyle: {
              fontFamily: 'sans-serif',
              fontSize: optionSize,
            },
          },
          legend: {
            data: legend,
            textStyle: {
              fontFamily: 'sans-serif',
              fontSize: legendSize,
            },
            left: button ? left : 'center',
          },
          grid: {},
          xAxis: xAxis,
          yAxis: yAxis,
          series: series,
        }}
        style={{
          width: '100%',
          height: '100%',
          margin: 'auto',
        }}
      />
    </Flex>
  );
};

export default CardItemChart;
