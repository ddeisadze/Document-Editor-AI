import { Card, CardBody, CardFooter, Image, Link } from "@chakra-ui/react";

function ThumbnailPreview({
  thumbnail,
  documentId,
  newTab = false,
  ...rest
}: {
  thumbnail: string | undefined;
  documentId: string;
  documentName: string;
  onClick?: (documentId: string) => void;
  newTab?: boolean
}) {

  const cardComponent = <Card
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
    onClick={rest?.onClick != undefined
      ? () => rest?.onClick?.call({}, documentId)
      : undefined}
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
      {rest.documentName}
    </CardFooter>
  </Card>;

  return (
    <>
      {rest?.onClick != undefined
        ? cardComponent
        : <Link isExternal={newTab} href={`/files/${encodeURIComponent(documentId)}`}>
          {cardComponent}
        </Link>}
    </>

  );
}

export default ThumbnailPreview;
