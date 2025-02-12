<script>
	import { dev } from '$app/environment';

	let text = '';
	let grade = 'ONE';
	let subject = 'Mathematics';
	let loading = false;
	let text2 = '';
	let grade2 = 'ONE';
	let loading2 = false; // Added loading state for sendText2

	const grades = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
	const subjects = [
		'Mathematics',
		'English Language',
		'Basic Science and Technology',
		'Computer Science',
		'Social Studies',
		'Physical and Health Education',
		'National Values',
		'Cultural and Creative Arts',
		'PreVocational Studies',
		'French',
		'Yoruba',
		'Igbo',
		'Hausa'
	];

	async function sendText() {
		loading = true;
		const data = {
			s: subject,
			g: grade,
			t: text
		};

		const response = await fetch('/q', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			console.error('Error sending text:', response.status);
			loading = false;
			return;
		}

		const blob = await response.blob();
		console.log('blob', blob);
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = dev
			? `g${grades.indexOf(grade) + 1}`
			: `${subject} - grade ${grades.indexOf(grade) + 1} - midterm exam - 2nd term - 2025.docx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
		loading = false;
	}

	function pasteText() {
		navigator.clipboard.readText().then((text) => {
			this.text = text;
		});
	}

	async function sendText2() {
		loading2 = true; // Set loading2 to true before sending the request
		const data = {
			c: text2,
			g: grade2
		};

		const response = await fetch('/f', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			console.error('Error sending text:', response.status);
			loading2 = false; // Set loading2 to false if there's an error
			return;
		}

		console.log('Success:', response);
		loading2 = false; // Set loading2 to false after successful request
	}
</script>

<div class="w-96 rounded-lg bg-gray-200 p-4 shadow-md">
	<div class="mb-2">
		<label for="grade" class="mb-2 block text-sm font-bold text-gray-700">Grade</label>
		<select
			id="grade"
			bind:value={grade}
			class="rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		>
			{#each grades as gradeOption}
				<option value={gradeOption}>{gradeOption}</option>
			{/each}
		</select>
	</div>
	<div class="mb-2">
		<label for="subject" class="mb-2 block text-sm font-bold text-gray-700">Subject</label>
		<select
			id="subject"
			bind:value={subject}
			class="rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		>
			{#each subjects as subjectOption}
				<option value={subjectOption}>{subjectOption}</option>
			{/each}
		</select>
	</div>
	<textarea
		class="w-full rounded-md border border-gray-300 bg-gray-100 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		bind:value={text}
		placeholder="Paste your text here..."
	></textarea>

	<div class="mt-2 flex space-x-2">
		<button
			class="focus:shadow-outline rounded bg-gray-400 px-4 py-2 font-bold text-white hover:bg-gray-500 focus:outline-none"
			on:click={pasteText}
		>
			Paste
		</button>
		{#if loading}
			<div>Loading...</div>
		{:else}
			<button
				class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				on:click={sendText}
			>
				Send
			</button>
		{/if}
	</div>
	<div class="mb-2">
		<label for="grade2" class="mb-2 block text-sm font-bold text-gray-700">Grade</label>
		<select
			id="grade2"
			bind:value={grade2}
			class="rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		>
			{#each grades as gradeOption}
				<option value={gradeOption}>{gradeOption}</option>
			{/each}
		</select>
	</div>
	<textarea
		class="w-full rounded-md border border-gray-300 bg-gray-100 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
		bind:value={text2}
		placeholder="Paste your text here..."
	></textarea>
	{#if loading2}
		<div>Loading...</div>
	{:else}
		<button on:click={sendText2}>Send2</button>
	{/if}
</div>
```
