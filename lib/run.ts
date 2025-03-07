import { Quiz } from "../types";

export async function runQuiz(questions: string[]): Promise<Quiz> {
    const quiz: Quiz = {
        questions: questions.map((q, i) => ({
            id: i.toString(),
            text: q,
            answers: []
        }))
    };
    return quiz;
}
