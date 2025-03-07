export const subjects = [
		'Mathematics',
		'English Language',
		'Basic Science and Technology',
		'Computer Science',
		'History',
		'Physical and Health Education',
		'National Values',
		'Cultural and Creative Arts',
		'PreVocational Studies',
		'French',
		'Religion Studies',
		'Music'
	];


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
	8. **Number of Questions:** Create ${n} questions.`
		: '';
	const numShortAnswerQuestionsClause = ns
		? `
	9. **Number of Short Answer Questions:** Create ${ns} short answer questions.`
		: '';
	const numEssayQuestionsClause = ne
		? `
	10. **Number of Essay Questions:** Create ${ne} essay questions.`
		: '';
	const result =
		await model.generateContent(`Generate a quiz from the following text, adhering to these rules:

 1. **Formatting:**  Mimic the format of the provided example quiz.  Use single underscores "_" for blanks in questions (except in sections with headings), enclose options in brackets (e.g., (a), (b)), and place questions and options on the same line. Do not end questions with periods, but question marks are acceptable.

 2. **Question Quality:** Ensure each question has only one correct answer.  If a question has no correct answer or multiple correct answers, rephrase it to have only one.  If necessary, remove or replace options.

 3. **Short Answer Questions:** If a question requires a short answer without options, provide a space for the answer using 9 underscores ("________").

 4. **Question Numbering:** Number all questions sequentially.

 5. **Headings and Passages:** Include headings and passages if present in the original text.

 6. **Language:** Preserve original language and punctuation.

 7. **Conciseness:** Make questions clear and concise.

 8. **Sectioning:** If short answer or essay questions are requested, these should be in sections (Section A, Section B etc.), with short answer questions coming before essay questions.


 ${numQuestionsClause}
 ${numShortAnswerQuestionsClause}
 ${numEssayQuestionsClause}


 **Example Quiz:**

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

 """

 **Example short answer questions:**
 1. How many sides does a hexagon have? _________
 2. Sum of angles in a triangle. _________
 3. 5 + 4 = _________

 **Example essay questions:**
 1. Write the theory of relative posterity.
 2. Describe the relationship of astronomy and sacred geometry
 3. What did the wind tell the sun?

 Text to create quiz from:

 """
 ${t}
 """`);
	console.log('rrt', result.response.text());
	return result.response.text();
};