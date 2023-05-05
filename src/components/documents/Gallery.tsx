import {
  Grid,
} from "@chakra-ui/react";
import { useSession } from "@supabase/auth-helpers-react";
import { documentStored, getDocuments } from "../../utility/storageHelpers";
import AuthLogin from "../auth/auth";
import ThumbnailPreview from "./editor/ThumbnailPreview";

export const ThumbnailGallery = ({
  documents,
  onClick
}: {
  documents: Array<documentStored> | null;
  onClick?: (documentId: string) => void
}) => {

  const childrenRenders = documents?.map((document, index: number) => {
    if (document) {
      return <ThumbnailPreview onClick={onClick} documentId={document.id} key={index} documentName={document.documentName} thumbnail={document.thumbnail} />
    }
  });

  return documents && Array.isArray(documents) ? (
    <Grid templateColumns="repeat(auto-fit, minmax(190px, 4fr))" gap={4} mt={8} mx={['auto', '8%', '10%', '15%', '25%']} autoRows="auto">
      {childrenRenders}
    </Grid>
  ) : <p>No documents found. Add one!</p>;
};


export function DocumentManager() {
  const session = useSession()

  return <>
    {<AuthLogin session={session}>

      <ThumbnailGallery documents={getDocuments()} />
    </AuthLogin>}
  </>
}
