import React, { useEffect, useRef, useState } from "react";
import { NewAIConversation } from "./NewAIConversation";
import ReactQuill, { Range } from "react-quill";
import { Grid, GridItem, Text, useDimensions } from "@chakra-ui/react";
import InlineToolbar from "./inlineToolbar";
import DocumentTitle from "./LoginTitle";
import { getHtml } from "./utility/helpers";
// import AiConvoManager from "./aiConvoManager";

export interface aiConvoComponents {
    componentKey: string,
    component: JSX.Element,
    range: Range,
    // isOpen: Boolean
}

export function MyEditor() {
    const [toolbarStyle, setToolbarStyle] = useState({ display: 'none' });
    const [showInlineToolbar, setShowInlineToolbar] = useState<JSX.Element | null>(null);
    const [aiConversationsChildren, setAiConversationsChildren] = useState<aiConvoComponents[]>([]);
    const [lastModified, setLastModified] = useState<Date>();
    const [openConvoKey, setOpenConvoKey] = useState<String>();


    // const gridElementRef = useRef()
    const quillRef = React.useRef<ReactQuill | null>(null);
    // const gridElementRef = useRef<HTMLDivElement>(quillRef.current?.editingArea as HTMLDivElement);
    const gridElementRef = React.useRef<HTMLDivElement>(null);

    const z = useDimensions(gridElementRef, true);


    const commentWidth = "300px";

    useEffect(() => {
        getHtml().then((html) => {
            handlePasteHTML(html);
        });
    }, []);

    const handleChange = (): void => {
        setLastModified(new Date());
    };

    const handlePasteHTML = (html: any) => {
        if (quillRef.current) {
            quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, html);
        }
    };

    const removeAiConvo = (key: string) => {
        setAiConversationsChildren((prev) => {
            const componentToRemove = prev.filter(i => i.componentKey == key)[0];
            console.log(componentToRemove);
            
            quillRef.current?.editor?.removeFormat(componentToRemove.range?.index ?? 0, componentToRemove.range?.length ?? 0);

            return prev.filter(i => i.componentKey != key);
        });
    };

    const handleOnAiUpdatedPrompt = (editedText: string) => {
        if (!editedText) {
            return;
        }

    };

    const onLaunchAiClicked = (range: Range, selectedAttrs: {
        text: string;
        top: Number;
        bottom: Number;
        left: Number;
        right: Number;

    }) => {

        const key = new Date().getTime().toString();
        console.log(key,  );
        setOpenConvoKey(key)

        
        setAiConversationsChildren([
            ...aiConversationsChildren,
            {
                range: range,
                componentKey: key,
                component: <NewAIConversation
                    componentKey={key}
                    width={commentWidth}
                    handleUpdatePrompt={handleOnAiUpdatedPrompt}
                    onRemoveComponent={() => removeAiConvo(key)}
                    selectedText={selectedAttrs.text}
                    top={selectedAttrs.top}
                    bottom={selectedAttrs.bottom}
                    left={selectedAttrs.left}
                    right={selectedAttrs.right}
                    openConvoKey={openConvoKey} 
                    setOpenConvoKey={setOpenConvoKey}/>
                    ,
                // isOpen: true,

                

            }
        ]);
        // setAiConversationsChildren(prev => {
        //     return prev.map(conversation => {
        //         console.log(conversation, "yoooooooooooooooo");

        //       if (conversation.componentKey === key) {                
        //         return {
        //           ...conversation,
        //           conversation.component. false
        //         };
        //       } else {
        //         // console.log(conversation.componentKey, "yoooooooooooooooo");

        //         return {
        //           ...conversation,
        //           isOpen: false
        //         };
        //       }
        //     });
        //   });

        setShowInlineToolbar(null);
    };

    useEffect(() => {
        setAiConversationsChildren(prevChildren => {
          return prevChildren.map(child => {
            
              // Update openConvoKey prop
              return {
                ...child,
                component: React.cloneElement(child.component, { openConvoKey: openConvoKey })
              }
            
          })
        })
      }, [openConvoKey])

    return (
        <>
            <Grid
                marginLeft={"5%"}
                marginRight={"5%"}
                templateAreas={`"header header"
                  "main comments"
                  "footer comments"`}
                gridTemplateRows={'50px 1fr 30px'}
                gridTemplateColumns={`1fr ${commentWidth}`}
                gap='1'
            >
                <GridItem pl='2' area={'header'}>
                    <DocumentTitle />
                    {lastModified && (
                        <Text
                            fontSize="sm"
                            color="gray"
                            fontStyle="italic"
                            marginBottom="0.5rem">
                            Last modified: {lastModified.toLocaleString()}
                        </Text>)}
                </GridItem>
                <GridItem pl='2' area={'comments'} maxHeight="100%" overflowY="auto">
                    {aiConversationsChildren.map(i => i.component)}
                </GridItem>
                <GridItem pl='2' area={'main'} marginTop="1rem">
                    <div ref={gridElementRef}>

                        <ReactQuill ref={quillRef}

                            onChange={handleChange}
                            onChangeSelection={(range) => {
                                if (range?.length ?? 0 > 0) {
                                    var text = quillRef.current?.editor?.getText(range?.index, range?.length);
                                    const bounds = quillRef.current?.editor?.getBounds(range?.index ?? 0);

                                    const editingArea = quillRef.current?.getEditingArea().getBoundingClientRect();

                                    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
                                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                                    const windowSelection = window.getSelection();
                                    const windowRange = windowSelection?.getRangeAt(0);
                                    const boundingRect = windowRange?.getBoundingClientRect();

                                    const container = windowRange?.commonAncestorContainer;
                                    const selectedElement = container?.parentElement as Element;
                                    const elementStyles = window.getComputedStyle(selectedElement);
                                    const elementLineHeight = parseFloat(elementStyles?.lineHeight);

                                    const selectedAttrs = {
                                        text: text ?? "",
                                        top: (boundingRect?.top ?? 0) + scrollTop,
                                        bottom: boundingRect?.bottom ?? 0,
                                        right: boundingRect?.right ?? 0,
                                        left: (boundingRect?.left ?? 0) + scrollLeft,
                                    };


                                    const format = {
                                        background: "rgb(124, 114, 227)" // set background color to yellow
                                    };

                                    if (range) {
                                        quillRef?.current?.editor?.formatText(range, format); // apply new background color format
                                    }

                                    const toolbarComponenet = <InlineToolbar
                                        top={selectedAttrs.top}
                                        bottom={selectedAttrs.bottom}
                                        left={selectedAttrs.left}
                                        right={selectedAttrs.right}
                                        lineHeight={elementLineHeight}
                                        onClick={() => onLaunchAiClicked(range, selectedAttrs)} />;
                                    setShowInlineToolbar(toolbarComponenet);
                                }
                            }} />
                    </div>

                </GridItem>
                <GridItem pl="2" area={"footer"}>
                    Footer
                </GridItem>
            </Grid>
            {showInlineToolbar}
        </>
    );
}
