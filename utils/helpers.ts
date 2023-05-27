import { Price } from '../types';

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;

  return url;
};

export const getURLWithPath = (path: string) => {
  return `${getURL()}${path}`;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log('posting,', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    console.log(url)
    console.log(data)
    console.log(res)

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export async function postDataToNewJobSubmission(
  data: {
    email: string,
    name: string,
    jobLink: string,
    resumefileName: string,
    resumePdfFile: Blob,
    additionalNotes: string
  }): Promise<void> {
  const apiUrl = '/api/new-job-submission'; // replace with your API url

  try {
    // Convert Blob to Base64
    const fileBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(data.resumePdfFile);
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        jobLink: data.jobLink,
        resumefileName: data.resumefileName,
        resumePdfFile: fileBase64,
        additionalNotes: data.additionalNotes
      })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
