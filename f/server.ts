import { runQuiz } from "../lib/run";

// ...existing code...

export async function run(files: string[]) {
    const questions = files.map(file => `Explain the purpose of ${file}`);
    return await runQuiz(questions);
}

// ...existing code...
