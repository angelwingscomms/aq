import { type RequestHandler } from '@sveltejs/kit';
import { patchDocument, PatchType, TextRun } from 'docx';
import { readFileSync } from 'fs';

import { create_questions } from '$lib/create_questions';

async function run({
	g,
	t,
	s,
	n,
	ns,
	ne
}: {
	s: string;
	t: string;
	g: string;
	n?: number;
	ns?: number;
	ne?: number;
}) {
	const q = await create_questions({
		t,
		n,
		ns,
		ne
	});
	return patchDocument({
		data: readFileSync(`./files/template${g === 'ONE' ? '-cc' : ''}.docx`),
		outputType: 'blob',
		keepOriginalStyles: true,
		patches: {
			s: {
				type: PatchType.PARAGRAPH,
				children: [new TextRun(s)]
			},
			g: {
				type: PatchType.PARAGRAPH,
				children: [new TextRun(g)]
			},
			q: {
				type: PatchType.PARAGRAPH,
				children: (JSON.parse(q) as string[]).reduce((acc: TextRun[], e) => {
					acc.push(new TextRun(e));
					acc.push(new TextRun({ break: 1 }));
					acc.push(new TextRun({ break: 1 }));
					return acc;
				}, [])
			}
		}
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const result = await run(data);
	return new Response(result);
};
