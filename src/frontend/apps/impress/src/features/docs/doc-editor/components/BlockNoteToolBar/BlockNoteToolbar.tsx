import {
  FormattingToolbar,
  FormattingToolbarController,
  blockTypeSelectItems,
  getFormattingToolbarItems,
  useDictionary,
} from '@blocknote/react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '@/core/config/api';

import { getCalloutFormattingToolbarItems } from '../custom-blocks';

import { AIGroupButton } from './AIButton';
import { FileDownloadButton } from './FileDownloadButton';
import { FindButton } from './FindButton';
import { MarkdownButton } from './MarkdownButton';
import { ModalConfirmDownloadUnsafe } from './ModalConfirmDownloadUnsafe';

export const BlockNoteToolbar = () => {
  const dict = useDictionary();
  const [confirmOpen, setIsConfirmOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void | Promise<void>>();
  const { t } = useTranslation();
  const { data: conf } = useConfig();

  const toolbarItems = useMemo<React.ReactNode[]>(() => {
    const toolbarItems = getFormattingToolbarItems([
      ...blockTypeSelectItems(dict),
      getCalloutFormattingToolbarItems(t),
    ]);
    const fileDownloadButtonIndex = toolbarItems.findIndex(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'key' in item &&
        (item as { key: string }).key === 'fileDownloadButton',
    );
    if (fileDownloadButtonIndex !== -1) {
      toolbarItems.splice(
        fileDownloadButtonIndex,
        1,
        <FileDownloadButton
          key="fileDownloadButton"
          open={(onConfirm) => {
            setIsConfirmOpen(true);
            setOnConfirm(() => onConfirm);
          }}
        />,
      );
    }

    return toolbarItems as React.ReactNode[];
  }, [dict, t]);

  return (
    <>
      <FormattingToolbarController
        formattingToolbar={(controller) => (
          <FormattingToolbar>
            {toolbarItems}
            <FindButton key="findButton" controller={controller} />

            {/* Extra button to do some AI powered actions */}
            {conf?.AI_FEATURE_ENABLED && <AIGroupButton key="AIButton" />}

            {/* Extra button to convert from markdown to json */}
            <MarkdownButton key="customButton" />
          </FormattingToolbar>
        )}
      />
      {confirmOpen && (
        <ModalConfirmDownloadUnsafe
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={onConfirm}
        />
      )}
    </>
  );
};
