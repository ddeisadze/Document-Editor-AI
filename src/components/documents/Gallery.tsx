import {
  Grid,
} from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { documentStored, getDocuments } from "../../utility/storageHelpers";
import AuthLogin from "../auth/auth";
import ThumbnailPreview from "./editor/ThumbnailPreview";

const ThumbnailPreviewRow = ({
  documents,
}: {
  documents: Array<documentStored> | null;
}) => {

  const childrenRenders = documents?.map((document, index: number) => {
    if (document) {
      return <ThumbnailPreview documentId={document.id} key={index} documentName={document.documentName} thumbnail={document.thumbnail} />
    }
  });

  return documents && Array.isArray(documents) ? (
    <Grid templateColumns="repeat(auto-fit, minmax(190px, 4fr))" gap={4} mt={8} mx={['auto', '8%', '10%', '15%', '25%']} autoRows="auto">
      {childrenRenders}
    </Grid>
  ) : <p>No documents found. Add one!</p>;
};


export default function DocumentManager() {
  const session = useSession()

  return <>
    {<AuthLogin session={session}>

      <ThumbnailPreviewRow documents={getDocuments()} />
    </AuthLogin>}
  </>
}
