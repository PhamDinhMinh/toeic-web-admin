import { Tag } from 'antd';
import { useId, useMemo } from 'react';

import { EExamTipsType } from '@/modules/exam-tips/exam-tips.model';

import {
  TypePart1,
  TypePart2,
  TypePart3,
  TypePart4,
  TypePart5,
  TypePart6,
  TypePart7,
} from '../services/question-toeic.model';

const TypePartTypeTag = ({
  type,
  partId,
}: {
  type: number[];
  partId: number;
}) => {
  const uid = useId();

  const listType = useMemo<any>(() => {
    switch (partId) {
      case EExamTipsType.Part1:
        return TypePart1;
      case EExamTipsType.Part2:
        return TypePart2;
      case EExamTipsType.Part3:
        return TypePart3;
      case EExamTipsType.Part4:
        return TypePart4;
      case EExamTipsType.Part5:
        return TypePart5;
      case EExamTipsType.Part6:
        return TypePart6;
      case EExamTipsType.Part7:
        return TypePart7;
      default:
        return 'default';
    }
  }, [partId]);

  const labelsType = useMemo(
    () =>
      type
        .filter((type) =>
          listType.some((typePart: any) => typePart.value === type),
        )
        .map(
          (type) =>
            listType.find((typePart: any) => typePart.value === type).label,
        ),
    [listType, type],
  );

  return (
    <>
      {labelsType.map((labelItem, index) => (
        <Tag key={uid + index}>{labelItem}</Tag>
      ))}
    </>
  );
};

export default TypePartTypeTag;
