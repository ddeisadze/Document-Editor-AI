import mammoth from "mammoth";

export async function getHtmlFromDocxUrlApi(fileUrl: string): Promise<string> {
	const resumeBlob = await fetch(fileUrl)
		.then((res) => res.blob())

	return getHtmlFromFileApi(resumeBlob);
}

export async function getHtmlFromDocFileLegacy(buffer: ArrayBuffer) {
	const html = await mammoth
		.convertToHtml({ arrayBuffer: buffer })
		.then(function (result) {
			var html = result.value;
			return html;
		})
		.catch((err) => console.log("error", err));

	return html ?? null;
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