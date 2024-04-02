import { Tag } from 'antd';
import { useMemo } from 'react';

import { EGrammarType } from '../grammars.model';

const EstateTypeTag = ({ type }: { type: EGrammarType }) => {
  const color = useMemo<string>(() => {
    switch (type) {
      case EGrammarType.BASIC:
        return 'grey';
      case EGrammarType.ADVANCED:
        return 'green';
      default:
        return 'default';
    }
  }, [type]);

  return <Tag color={color}>{type}</Tag>;
};

export default EstateTypeTag;
