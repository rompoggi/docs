import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { BlockTypeSelectItem, createReactBlockSpec } from '@blocknote/react';
import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import { Box, BoxButton, Icon } from '@/components';

export const LatexBlock = createReactBlockSpec(
	{
		type: 'latex',
		propSchema: {
			formula: { default: '\\frac{a}{b}' },
		},
		content: 'none',
	},
	{
		render: ({ block, editor }) => {
			const [error, setError] = useState<string | null>(null);
			const formula = block.props.formula;

			let html = '';
			try {
				html = katex.renderToString(formula, {
					throwOnError: false,
					displayMode: true,
				});
				setError(null);
			} catch (e) {
				html = '';
				setError('Invalid LaTeX');
			}

			return (
				<Box
					$padding="1rem"
					$gap="0.5rem"
					style={{
						borderLeft: '4px solid #aaa',
						backgroundColor: '#f9f9f9',
						flexDirection: 'column',
					}}
				>
					<Box as="div">
						{error ? (
							<span style={{ color: 'red' }}>{error}</span>
						) : (
							<span dangerouslySetInnerHTML={{ __html: html }} />
						)}
					</Box>
					<textarea
						style={{
							marginTop: '8px',
							width: '100%',
							fontFamily: 'monospace',
							minHeight: '2.5em',
							background: '#fff',
							border: '1px solid #ddd',
							borderRadius: '4px',
							padding: '6px',
						}}
						value={formula}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
							editor.updateBlock(block, {
								props: { formula: e.target.value },
							})
						}
						placeholder="Écris ici ta formule LaTeX"
					/>
				</Box>
			);
		},
	},
);

export const getLatexReactSlashMenuItems = (
	editor,
	t,
	group,
) => [
	{
		title: t('LaTeX'),
		onItemClick: () => {
			insertOrUpdateBlock(editor, {
				type: 'latex',
			});
		},
		aliases: ['latex', 'math', 'équation'],
		group,
		icon: <Icon iconName="functions" $size="18px" />,
		subtext: t('Ajouter un bloc LaTeX'),
	},
];

export const getLatexFormattingToolbarItems = (t): BlockTypeSelectItem => ({
	name: t('LaTeX'),
	type: 'latex',
	icon: () => <Icon iconName="functions" $size="16px" />,
	isSelected: (block) => block.type === 'latex',
});