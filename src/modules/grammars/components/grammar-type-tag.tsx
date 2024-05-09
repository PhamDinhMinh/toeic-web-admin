import { Tag } from 'antd';
import { useMemo } from 'react';

import { EGrammarType } from '@/modules/grammars/grammars.model';

const GrammarTypeTag = ({ type }: { type: number }) => {
  const color = useMemo<string>(() => {
    switch (type) {
      case EGrammarType.BASIC:
        return 'blue';
      case EGrammarType.ADVANCED:
        return 'green';
      default:
        return 'default';
    }
  }, [type]);

  const nameType = useMemo<string>(() => {
    switch (type) {
      case EGrammarType.BASIC:
        return 'Cơ bản';
      case EGrammarType.ADVANCED:
        return 'Nâng cao';
      default:
        return 'default';
    }
  }, [type]);

  return <Tag color={color}>{nameType}</Tag>;
};

export default GrammarTypeTag;
