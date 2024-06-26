import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useMemo } from 'react';

import useTranslation from '@/hooks/useTranslation';

import dashBoardService from '../services/dash-board.service';
import CardItemChart from './card-item-chart';

const ChartQuestionStatistics = ({ numberRange }: { numberRange: number }) => {
  const { t } = useTranslation();

  const {
    data: getQuestionStatistics,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['/getQuestionStatistics', numberRange],
    queryFn: () =>
      dashBoardService.statisticsQuestion({ numberRange: numberRange }),
    enabled: !!numberRange,
  });

  const keyData = useMemo(
    () =>
      getQuestionStatistics && Object.keys(getQuestionStatistics?.data?.data),
    [getQuestionStatistics],
  );

  const valueData = useMemo(
    () =>
      getQuestionStatistics && Object.values(getQuestionStatistics?.data?.data),
    [getQuestionStatistics],
  );

  return (
    <>
      {(isLoading || isFetching) && (
        <Spin
          fullscreen
          spinning={isLoading || isFetching}
          style={{ zIndex: 1000 }}
        />
      )}
      <CardItemChart
        title={t('Thống kê câu hỏi')}
        legend={[t('Số câu hỏi được thêm')]}
        xAxis={[
          {
            type: 'category',
            data: keyData,
          },
        ]}
        yAxis={[
          {
            type: 'value',
            axisLabel: {
              fontSize: 10,
            },
          },
        ]}
        series={[
          {
            name: t('Số câu hỏi được thêm'),
            type: 'bar',
            barGap: 0,
            data: valueData,
            smooth: true,
          },
        ]}
        loading={isLoading || isFetching}
        titleSize={16}
        optionSize={10}
        legendSize={12}
      />
    </>
  );
};

export default ChartQuestionStatistics;
