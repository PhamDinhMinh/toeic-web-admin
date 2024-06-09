import { createFileRoute } from '@tanstack/react-router';
import { Col, Divider, Flex, Row, Select } from 'antd';
import { useState } from 'react';

import useTranslation from '@/hooks/useTranslation';
import ChartQuestionStatistics from '@/modules/dash-board/components/chart-statistic-question';
import ChartUserStatistics from '@/modules/dash-board/components/chart-statistic-user';
import TitleHeading from '@/shared/components/title-heading';

export const Route = createFileRoute('/_app/dash-board/')({
  component: DashBoardPage,
});

function DashBoardPage() {
  const { t } = useTranslation();
  const [numberRange, setNumberRange] = useState(6);

  const handleChange = (value: number) => {
    setNumberRange(value);
  };
  const { Option } = Select;

  return (
    <>
      <Flex justify="space-between">
        <TitleHeading>{t('Thống kê')}</TitleHeading>
        <Select
          defaultValue={numberRange}
          style={{ width: 120 }}
          onChange={handleChange}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option value={i + 1} key={i}>
              {i + 1} {t('Tháng')}
            </Option>
          ))}
        </Select>
      </Flex>

      <Divider />

      <Row gutter={24}>
        <Col span={0.5} style={{ height: '400px' }} />
        <Col
          span={11}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '400px',
            boxShadow: '0px 0px 2px 0px #888888',
            borderRadius: 10,
          }}
        >
          <ChartUserStatistics numberRange={numberRange} />
        </Col>
        <Col span={1} style={{ height: '400px' }} />
        <Col
          span={11}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '400px',
            boxShadow: '0px 0px 2px 0px #888888',
            borderRadius: 10,
          }}
        >
          <ChartQuestionStatistics numberRange={numberRange} />
        </Col>
      </Row>
    </>
  );
}

export default DashBoardPage;
