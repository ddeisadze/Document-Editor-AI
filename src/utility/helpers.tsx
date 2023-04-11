import mammoth from "mammoth";

const resumeFileName = `https://aidox.onrender.com/resume.docx`;

export async function getHtml() {
    const arrBuffer = await fetch(resumeFileName)
        .then((res) => res.blob())
        .then((blob) => blob.arrayBuffer());

    function transformElement(element: any) {

        if (element.children) {
            element.children.forEach(transformElement);
        }

        if (element.alignment === "center" && !element.styleId) {
            console.log("testse", element)
            element.styleName = "center";
            element.styleId = "Heading2";
        }

        return element;
    }

    var options = {
        styleMap: [
            "p[style-name='Title'] => h1:fresh",
            // "p[style-name='center'] => p.align-center",
            // "p[style-name='Center'] => p.center",
        ],
        transformDocument: transformElement
    };

    const html = await mammoth
        .convertToHtml({ arrayBuffer: arrBuffer }, options)
        .then(function (result) {
            console.log(result)
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
