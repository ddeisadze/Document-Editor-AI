import mammoth from "mammoth";
import TurndownService from "turndown";


export async function getHtmlFromDocxUrlApi(fileUrl: string): Promise<string> {
	const resumeBlob = await fetch(fileUrl)
		.then((res) => res.blob())

	return getHtmlFromFileApi(resumeBlob);
}

export async function getMarkdownFromDocFile(buffer: ArrayBuffer) {
	const html = await mammoth.convertToHtml({ arrayBuffer: buffer })
	  .then((result) => result.value)
	  .catch((err) => {
		console.log("Error converting to HTML:", err);
		return null;
	  });
  
	if (html) {
	  const turndownService = new TurndownService();
	  const markdown = turndownService.turndown(html);
	  return markdown;
	}
  
	return null;
  }

function getHtmlFromFileApi(fileBlob: Blob) {
	const form = new FormData();
	form.append("file", fileBlob);

	const options: RequestInit = {
		method: 'POST',
		headers: { 'Content-Type': 'multipart/form-data' },
		body: form,
	};

	return fetch('https://office-converter.onrender.com/conversion?format=html', options)
		.then(response => {
			console.log(response);

			return response.json();
		})
		.then(response => {
			console.log(response);
			return response;
		})
		.catch(err => console.error(err));
}

export async function getPdfFileFromHtml(htmlString: string): Promise<Blob> {
	console.log(htmlString)
	const blob = await fetch('https://aidox-pdf.onrender.com/pdf', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/pdf',
			responseType: 'blob'
		},
		body: new URLSearchParams({ html: htmlString }),
	})

	return await blob.blob()
}