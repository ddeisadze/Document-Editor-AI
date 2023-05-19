import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

export default openai;