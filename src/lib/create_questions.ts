import { GoogleGenerativeAI } from '@google/generative-ai';
import { SchemaType } from '@google/generative-ai/server';
import { G } from '$env/static/private';

const genAI = new GoogleGenerativeAI(G);

const model = genAI.getGenerativeModel({
	model: 'gemini-2.0-pro-exp-02-05',
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

export const create_questions = async ({
	t,
	n,
	ns,
	ne
}: {
	t: string;
	n?: number;
	ns?: number;
	ne?: number;
}) => {
	const numQuestionsClause = n
		? `
	- **Number of objective questions:** Create ${n} questions.`
		: '';
	const numShortAnswerQuestionsClause = ns
		? `
	- **Number of short answer questions:** Create ${ns} short answer questions.`
		: '';
	const numEssayQuestionsClause = ne
		? `
	- **Number of essay questions:** Create ${ne} essay questions.`
		: '';
	const result =
		await model.generateContent(`Generate a quiz from the following text, adhering to these rules:

- **Formatting:**  Mimic the format of the provided example quiz.  Use single underscores "_" for blanks in questions (except in sections with headings), enclose options in brackets (e.g., (a), (b)), and place questions and options on the same line. Do not end questions with periods, but question marks are acceptable.

- **Question Quality:** Ensure each question has only one correct answer.  If a question has no correct answer or multiple correct answers, rephrase it to have only one.  If necessary, remove or replace options.

- **Short Answer Questions:** If a question requires a short answer without options, provide a space for the answer using 9 underscores ("________").

- **Question Numbering:** Number all questions sequentially.

- **Headings and Passages:** Include headings and passages if present in the original text.

- **Language:** Preserve original language and punctuation.

- **Conciseness:** Make questions clear and concise.

- **Sectioning:** If short answer or essay questions are requested, these should be in sections (Section A, Section B etc.), with short answer questions coming before essay questions.


${numQuestionsClause}
${numShortAnswerQuestionsClause}
${numEssayQuestionsClause}


**Example Quiz:**

"""
1. When you take care of your body you will look attractive (a) True (b) False

2. How many noses do you have? (a) 2 (b) 1 (c) 3

3. How many nostrils do you have? (a) 1 (b) 2 (c) 3
"""

Section B: Short answer
1. How many sides does a hexagon have? _________
2. Sum of angles in a triangle. _________
3. 5 + 4 = _________

Section C: Essay
1. Write the theory of relative posterity.
2. Describe the relationship of astronomy and sacred geometry
3. What did the wind tell the sun?

Text to create quiz from:

"""
${t}
"""`);
	console.log('questions created',);
	return result.response.text();
};
