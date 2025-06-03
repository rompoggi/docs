import {
  useBlockNoteEditor,
  useComponentsContext,
  useSelectedBlocks,
} from '@blocknote/react';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components';

export function FindButton({
  controller,
}: {
  controller?: { close: () => void };
}) {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext();
  const selectedBlocks = useSelectedBlocks(editor);
  const { t } = useTranslation();

  const shouldShow = useMemo(() => {
    return !!selectedBlocks.find((block) => block.content !== undefined);
  }, [selectedBlocks]);

  const handleFindClick = useCallback(() => {
    const selection = window.getSelection();
    let selectedText = '';
    if (selection && selection.rangeCount > 0) {
      selectedText = selection.toString();
    }
    window.dispatchEvent(
      new CustomEvent('open-chat-with-input', {
        detail: { text: `/find ${selectedText}` },
      }),
    );
    if (controller && typeof controller.close === 'function') {
      controller.close();
    } else {
      setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 100);
    }
  }, [controller]);

  if (!shouldShow || !editor.isEditable || !Components) {
    return null;
  }

  return (
    <Components.FormattingToolbar.Button
      mainTooltip={t('Find')}
      onClick={handleFindClick}
      className="--docs--editor-find-button"
    >
      <Icon iconName="search" $size="20px" />
    </Components.FormattingToolbar.Button>
  );
}
