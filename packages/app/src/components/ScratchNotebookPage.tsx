import { useParams } from "react-router-dom";
import {
   BrowserNotebookStorage,
   MutableNotebook,
   NotebookStorageProvider,
} from "@malloy-publisher/sdk";
import { PublisherPackageProvider } from "@malloy-publisher/sdk";
interface ScratchNotebookPageProps {
   server?: string;
}

export function ScratchNotebookPage({ server }: ScratchNotebookPageProps) {
   const { projectName, packageName } = useParams();
   if (!projectName) {
      return (
         <div>
            <h2>Missing project name</h2>
         </div>
      );
   } else if (!packageName) {
      return (
         <div>
            <h2>Missing package name</h2>
         </div>
      );
   } else {
      return (
         <PublisherPackageProvider
            server={server}
            projectName={projectName}
            packageName={packageName}
         >
            <NotebookStorageProvider
               notebookStorage={new BrowserNotebookStorage()}
               userContext={{ project: projectName, package: packageName }}
            >
               <MutableNotebook inputNotebookPath={undefined} />
            </NotebookStorageProvider>
         </PublisherPackageProvider>
      );
   }
}
