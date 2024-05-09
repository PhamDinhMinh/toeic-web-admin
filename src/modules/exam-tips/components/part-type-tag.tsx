import { Tag } from 'antd';
import { useMemo } from 'react';

import { EExamTipsType } from '../exam-tips.model';

const PartTypeTag = ({ type }: { type: number }) => {
  const color = useMemo<string>(() => {
    switch (type) {
      case EExamTipsType.Part1:
      case EExamTipsType.Part2:
      case EExamTipsType.Part3:
      case EExamTipsType.Part4:
      case EExamTipsType.Part5:
      case EExamTipsType.Part6:
      case EExamTipsType.Part7:
        return 'blue';
      default:
        return 'default';
    }
  }, [type]);

  const nameType = useMemo<string>(() => {
    switch (type) {
      case EExamTipsType.Part1:
        return 'Part 1';
      case EExamTipsType.Part2:
        return 'Part 2';
      case EExamTipsType.Part3:
        return 'Part 3';
      case EExamTipsType.Part4:
        return 'Part 4';
      case EExamTipsType.Part5:
        return 'Part 5';
      case EExamTipsType.Part6:
        return 'Part 6';
      case EExamTipsType.Part7:
        return 'Part 7';
      default:
        return 'default';
    }
  }, [type]);

  return <Tag color={color}>{nameType}</Tag>;
};

export default PartTypeTag;
