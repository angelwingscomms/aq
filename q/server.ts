import { runQuiz } from "../lib/run";
// ...existing code...

export async function run(questions: string[]) {
    return await runQuiz(questions);
}
// ...existing code...
