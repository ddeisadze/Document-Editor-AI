import React from "react";
import { Card, Image, CardBody, CardFooter } from "@chakra-ui/react";
import { Link } from "react-router-dom";


function ThumbnailPreview({ thumbnail, documentId, initialHtmlData }: { thumbnail: string | undefined,  documentId: String | undefined, initialHtmlData: String | undefined }) {
  return (
    <Link to={`document/${documentId}`} state={{ some: "value" }}>
    <Card
      _hover={{
        border: "2px solid #10a33f",
      }}
      className="document-card"
      boxShadow="md"
      borderRadius="md"
      p="4"
      margin="1rem"
      padding="0px"
      maxWidth="200px"
      maxHeight="270px"
      height="270px"
      minHeight="270px"
      minWidth="100px"
    >
      <CardBody
        height="83%"
        width="100%"
        style={{
          padding: "0px",
        }}
      >
        <Image
          src={thumbnail}
          alt="Document thumbnail"
          style={{
            objectFit: "cover",
            objectPosition: "top",
            width: "100%",
            height: "100%",
          }}
        />
      </CardBody>
      <CardFooter width="100%" bg="whiteAlpha.800" p="2">
        yoo
      </CardFooter>
    </Card>
    </Link>
  );
}

export default ThumbnailPreview;
