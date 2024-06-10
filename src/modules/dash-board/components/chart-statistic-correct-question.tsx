import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { color } from 'echarts';
import { useMemo } from 'react';

import useTranslation from '@/hooks/useTranslation';

import dashBoardService from '../services/dash-board.service';
import CardItemChart from './card-item-chart';

const ChartCorrectQuestionStatistics = () => {
  const { t } = useTranslation();

  const {
    data: statisticsCorrectQuestion,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['/statisticsCorrectQuestion'],
    queryFn: () => dashBoardService.statisticsCorrectQuestion(),
  });

  console.log(statisticsCorrectQuestion?.data?.data, 'hehe');
  const statisticsTotal = useMemo(
    () => statisticsCorrectQuestion?.data?.data,
    [statisticsCorrectQuestion?.data?.data],
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
        title={t('Thống kê tỷ lệ câu hỏi')}
        legend={[t('Câu nghe'), t('Câu đọc'), t('Tỷ lệ đúng')]}
        tooltip={{
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        }}
        series={[
          {
            name: t('Số câu hỏi'),
            type: 'pie',
            selectedMode: 'single',
            color: ['#24d094', '#FF9800'],
            radius: [0, '40%'],
            label: {
              position: 'inner',
              fontSize: 14,
            },
            labelLine: {
              show: false,
            },
            data: [
              {
                value: statisticsTotal?.questionListening,
                name: t('Câu nghe'),
              },
              {
                value: statisticsTotal?.questionReading,
                name: t('Câu đọc'),
              },
            ],
          },
          {
            name: t('Tỷ lệ làm bài'),
            type: 'pie',
            radius: ['50%', '65%'],
            label: {
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
            },
            data: [
              {
                value: statisticsTotal?.correctAnswers,
                name: t('Tỷ lệ đúng'),
              },
              {
                value:
                  statisticsTotal?.totalQuestions -
                  statisticsTotal?.correctAnswers,
                name: t('Tỷ lệ sai'),
              },
            ],
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

export default ChartCorrectQuestionStatistics;
