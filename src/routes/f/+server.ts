import { type RequestHandler } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { patchDocument, PatchType, TextRun } from 'docx';
import { readFileSync, writeFileSync } from 'fs';
import { G } from '$env/static/private';
import { SchemaType } from '@google/generative-ai/server';
import { create_questions } from '$lib/create_questions';
import { subjects } from '$lib';

const genAI = new GoogleGenerativeAI(G);
const grades = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];

const f = async ({ c, g, n, ns, ne }: { c: string; g: string; n: number; ns: number; ne:number }) => {
	const file_model = genAI.getGenerativeModel({
		model: 'gemini-1.5-pro',
		generationConfig: {
			temperature: 0.7,
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 999999,
			responseMimeType: 'application/json',
			responseSchema: {
				description: 'list of exams',
				type: SchemaType.ARRAY,
				items: {
					description: 'an exam object',
					type: SchemaType.OBJECT,
					properties: {
						subject: {
							type: SchemaType.STRING,
							description: "this exam's subject",
							nullable: false
						},
						content: {
							type: SchemaType.STRING,
							description: "this exam's content",
							nullable: false
						}
					},
					required: ['subject', 'content']
				}
			}
		}
	});
	const exams = JSON.parse(
		(
			await file_model.generateContent(
				`return a JSON array of EACH AND EVERY subject's' notes given, where each exam object has 'subject' and 'content', the subject being that subject's name, and the content being the subject's content as a string. Use exactly these subjects were relevant: ${JSON.stringify(subjects)}
				Include EVERY subject.
				The notes:

				${c}
				`
			)
		).response.text()
	);
	console.log(exams, exams.length, );
		for (const { subject: s, content: t } of exams as { subject: string, content: string }[]) {
		console.log('run', s);
		await new Promise((r) => setTimeout(r, 54000));
		writeFileSync(
			`./files/exams/g${grades.indexOf(g) + 1}/${s}.docx`,
			Buffer.from(await (await run({ g, t, s, n, ns, ne })).arrayBuffer())
		);
	}
};

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
  n: number;
  ns: number;
  ne: number;
}) {
  const q = await create_questions({t, n, ns, ne})
	// const q = result.response.text();
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
	await f(data);
	return new Response();
};