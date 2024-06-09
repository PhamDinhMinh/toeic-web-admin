import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import useTranslation from '@/hooks/useTranslation';

import dashBoardService from '../services/dash-board.service';
import CardItemChart from './card-item-chart';

const ChartUserStatistics = ({ numberRange }: { numberRange: number }) => {
  const { t } = useTranslation();

  const { data: getUserStatistics } = useQuery({
    queryKey: ['/getUserStatistics', numberRange],
    queryFn: () =>
      dashBoardService.statisticsUser({ numberRange: numberRange }),
    enabled: !!numberRange,
  });

  const { data: getPostStatistics } = useQuery({
    queryKey: ['/getPostStatistics'],
    queryFn: () =>
      dashBoardService.statisticsPost({ numberRange: numberRange }),
    enabled: !!numberRange,
  });

  const keyData = useMemo(
    () => getUserStatistics && Object.keys(getUserStatistics?.data?.data),
    [getUserStatistics],
  );

  const valueDataUser = useMemo(
    () => getUserStatistics && Object.values(getUserStatistics?.data?.data),
    [getUserStatistics],
  );

  const valueDataPost = useMemo(
    () => getPostStatistics && Object.values(getPostStatistics?.data?.data),
    [getPostStatistics],
  );

  return (
    <CardItemChart
      title={t('Thống kê người dùng')}
      legend={[
        t('Tổng số tài khoản người dùng'),
        t('Tổng số bài viết đã đăng'),
      ]}
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
          name: t('Tổng số tài khoản người dùng'),
          type: 'line',
          barWidth: '60%',
          data: valueDataUser,
          smooth: true,
          color: 'green',
        },
        {
          name: t('Tổng số bài viết đã đăng'),
          type: 'line',
          barWidth: '60%',
          data: valueDataPost,
          smooth: true,
        },
      ]}
      titleSize={16}
      optionSize={10}
      legendSize={12}
    />
  );
};

export default ChartUserStatistics;
