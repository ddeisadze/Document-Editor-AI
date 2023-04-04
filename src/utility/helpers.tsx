import mammoth from "mammoth";

const resumeFileName = `https://aidox.onrender.com/resume.docx`;

export async function getHtml() {
    const arrBuffer = await fetch(resumeFileName)
        .then((res) => res.blob())
        .then((blob) => blob.arrayBuffer());

    const html = await mammoth
        .convertToHtml({ arrayBuffer: arrBuffer })
        .then(function (result) {
            var html = result.value;
            return html;
        })
        .catch((err) => console.log("error", err));

    return html ?? null;
}

export async function getPdfFileFromHtml(htmlString: string): Promise<Blob> {
    const blob = await fetch('https://aidox-pdf.onrender.com/pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/pdf', responseType: 'blob'
        },
        body: new URLSearchParams({ html: htmlString }),
    })

    return await blob.blob()
}
