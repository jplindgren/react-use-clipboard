import { useState, useEffect } from "react";
import copy from "copy-to-clipboard";

interface IOptions {
  /**
   * Reset the status after a certain number of milliseconds. This is useful
   * for showing a temporary success message.
   */
  successDuration?: number;
  /**
   * Enable output to console.
   */
  debug?: boolean;
  /**
   * Set the MIME type of what you want to copy as.
   * Use text/html to copy as HTML, text/plain to avoid
   * inherited styles showing when pasted into rich text editor.
   */
  format?: string;
}

export default function useCopyToClipboard(
  initialContent: string,
  options?: IOptions
): [boolean, (content?: string, onError?: (ex: Error) => void) => void] {
  const [isCopied, setIsCopied] = useState(false);
  const successDuration = options && options.successDuration;

  useEffect(() => {
    if (isCopied && successDuration) {
      const id = setTimeout(() => {
        setIsCopied(false);
      }, successDuration);

      return () => {
        clearTimeout(id);
      };
    }
  }, [isCopied, successDuration]);

  const copyToClipboard = (content?: string, onError?: (ex: Error) => void) => {
    try {
      // copy(content || initialContent, { debug: options?.debug, format: options?.format });
      copy(content || initialContent);
      setIsCopied(true);
    } catch (ex) {
      setIsCopied(false);
      // onError?.(ex);
      if (onError) {
        onError(ex);
      }
    }
  };

  return [isCopied, copyToClipboard];
}
