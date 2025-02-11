<script>
  let text = '';
  let grade = 'ONE';
  let subject = 'Mathematics';
  let loading = false;

  const grades = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
  const subjects = ['Mathematics', 'English Language', 'Basic Science and Technology', 'Social Studies', 'Physical and Health Education', 'National Values', 'Cultural and Creative Arts', 'PreVocational Studies', 'French', 'Yoruba', 'Igbo', 'Hausa'];

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
    console.log('blob', blob)
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject} - grade ${grades.indexOf(grade) + 1} - midterm exam - 2nd term - 2025.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    loading = false;
  }

  function pasteText() {
    navigator.clipboard.readText().then(text => {
      this.text = text;
    });
  }
</script>

<div class="bg-gray-200 p-4 rounded-lg shadow-md w-96">
  <div class="mb-2">
    <label for="grade" class="block text-gray-700 text-sm font-bold mb-2">Grade</label>
    <select id="grade" bind:value={grade} class="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
      {#each grades as gradeOption}
        <option value={gradeOption}>{gradeOption}</option>
      {/each}
    </select>
  </div>
  <div class="mb-2">
    <label for="subject" class="block text-gray-700 text-sm font-bold mb-2">Subject</label>
    <select id="subject" bind:value={subject} class="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
      {#each subjects as subjectOption}
        <option value={subjectOption}>{subjectOption}</option>
      {/each}
    </select>
  </div>
  <textarea 
    class="bg-gray-100 w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
    bind:value={text} 
    placeholder="Paste your text here..."
  ></textarea>

  <div class="flex mt-2 space-x-2">
    <button 
      class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
      on:click={pasteText}
    >
      Paste
    </button>
    {#if loading}
      <div>Loading...</div>
    {:else}
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        on:click={sendText}
      >
        Send
      </button>
    {/if}
  </div>
</div>
```