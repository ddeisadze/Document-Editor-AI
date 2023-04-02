import mammoth from "mammoth";

const resumeFileName = `http://localhost:3000/resume.docx`;

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

    return html;
}
