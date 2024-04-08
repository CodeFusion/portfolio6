import Markdown from "react-markdown";
import {useEffect, useState} from "react";

export interface TextViewerProps {
    filename: string;
}

export const TextViewer = ({ filename }: TextViewerProps) => {
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    fetch(`/files/${filename}`)
      .then((res) => res.text())
      .then((text) => setContent(text))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
        <div className="TextViewer prose p-2 prose-headings:my-2 prose-p:leading-4
          prose-li:leading-3 marker:prose-li:text-black prose-li:list-square">
            <Markdown children={content} />
        </div>
    )
}
