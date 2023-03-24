import React from 'react';
import { Editor, EditorState, ContentState, convertFromHTML } from 'draft-js';
import 'draft-js/dist/Draft.css';
import mammoth from 'mammoth';


const resumeFileName = `src\\Resume 11 2022.docx`;

function MyEditor() {
  const sampleMarkup =
    '<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
    '<a href="http://www.facebook.com">Example link</a>';

  const blocksFromHTML = convertFromHTML(sampleMarkup);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );

  mammoth.convertToHtml({ path: resumeFileName })
    .then(function (result) {
      var html = result.value; // The generated HTML
      var messages = result.messages; // Any messages, such as warnings during conversion

      console.log(html, messages)
    })


  const [editorState, setEditorState] = React.useState(
    () => EditorState.createWithContent(state),
  );

  return <Editor editorState={editorState} onChange={setEditorState} />;
}

function App() {
  return (
    <div className="App">
      <MyEditor />
    </div>
  );
}

export default App;
