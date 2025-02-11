import { type RequestHandler } from '@sveltejs/kit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { patchDocument, PatchType, TextRun } from 'docx';
import { readFileSync } from 'fs';
import { G } from '$env/static/private';
import { SchemaType } from '@google/generative-ai/server';

const genAI = new GoogleGenerativeAI(G);

const model = genAI.getGenerativeModel({
	model: 'gemini-1.5-pro',
	generationConfig: {
		temperature: 0.7,
		topP: 0.95,
		topK: 64,
		maxOutputTokens: 65536,
		responseMimeType: 'application/json',
		responseSchema: {
			description: 'Array of questions',
			type: SchemaType.ARRAY,
			items: {
				type: SchemaType.STRING
			}
		}
	}
});

async function run({ g, t, s }: { s: string; t: string; g: string }) {
	const result =
		await model.generateContent(`Perfectly following the format the format of the first, edit the second.
Fix spelling, grammar and any other thing where you see fit.
Make all concise.

let blanks (i.e "_____" in questions like "________ is called the light of the body (a)...") be a single underscore, e.g: "_ is called the light of the body (a)...". DO NOT do this for  questions in Section B and Section C

NEVER use a full stop at the end a question. e.g
"_ is called the light of the body. (a)..." wrong(because this question ends with a full stop)
"_ is called the light of the body (a)..." correct (because this question does not end with a full stop)
another example
"The two holes in your nose are called _. (a)..." wrong
"The two holes in your nose are called (a)..." correct
questions may end with question marks, e.g
"How many noses do you have? (a)..." correct

Make all the option lettering enclosed in brackets (e.g (a)... (b)....). Place questions and options on same line. Fix all bad questions, removing or replacing options where necessary, for example:

This question is good, it has only one correct option
1. What is 2 + 2?
    a) 3
    b) 4
    c) 5
    d) 6

This question is not good, it has no correct options
2. Which color is the sky during a clear day?
    a) Red
    b) Green
    c) Yellow
    d) Purple

This question is not good, it has more than one correct option
3. Which of these are prime numbers?
    a) 2
    b) 4
    c) 3
    d) 9

Respond with ONLY the edited questions    
    
The first:

"""
1. When you take care of your body you will look attractive (a) True (b) False

2. How many noses do you have? (a) 2 (b) 1 (c) 3

3. How many nostrils do you have? (a) 1 (b) 2 (c) 3

4. The two holes in your nose are called _ (a) Nose holes (b) Nostrils (c) Nose cover

5. _ is used for breathing (a) Ear (b) Eyes (c) Nose

6. How many eyes do you have? (a) 4 (b) 1 (c) 2

7. Use _ to remove dirt from your nose (a) Stick (b) Hand (c) Cotton bud

8. _ part of the body is used for seeing (a) Nose (b) Eyes (c) Ears

9. _ is called the light of the body (a) Hand (b) Mouth (c) Eyes

10. How do you care for the eyes? (a) Visit an eye doctor (b) Rub your eyes with dirty cloth (c) Wash your eyes with dirty water

11. _ is a part of the human body (a) Leaf (b) Nose (c) Stick

12. The trunk is part of the human body from the neck to the _ (a) Leg (b) Waist (c) Hand

13. _ join the head and the lower part of the human body (a) Leg (b) Hand (c) Trunk

14. _ is part of the hands (a) Palm (b) Ankle (c) Heel

15. _ is part of the human leg (a) Wrist (b) Knee (c) Palm

16. _ is the longest part of the human body (a) Hand (b) Neck (c) Legs

17. The hands extend from _ (a) Neck (b) Shoulders (c) Waist

18. Why do we take care of our body? (a) To be dirty (b) To be clean (c) To be hungry

19. _ is a material used to take care of the body (a) Soap (b) Sand (c) Chalk

20. _ is used to care for the teeth (a) Sand (b) Oil (c) Toothbrush

"""

The second:

"""
${t}
"""`);
	console.log('rrt', result.response.text());
	const q = result.response.text();
	return patchDocument({
		data: readFileSync('./files/template.docx'),
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
