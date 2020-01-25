import { saveAs } from 'file-saver';

/**
 * Saves a file by opening file-save-as dialog in the browser
 * using file-save library.
 * @param blobContent file content as a Blob
 * @param fileName name file should be saved as
 */
export const saveFile = (blobContent: Blob, fileName: string, responceType: string) => {
    const blob = new Blob([blobContent], {type: responceType ? responceType : 'application/octet-stream'});
    saveAs(blob, fileName);
};

/**
 * Saves a file by opening file-save-as dialog in the browser
 * using file-save library.
 * @param fileUrl
 * @param fileName name file should be saved as
 */
export const saveFileFromUrl = (url: string, fileName: string) => {
    saveAs(url, fileName);
};

/**
 * Derives file name from the http response
 * by looking inside content-disposition
 * @param res http Response
 */
export const getFileNameFromResponseContentDisposition = (res) => {
    const contentDisposition = res.headers.get('content-disposition') || '';
    if (!contentDisposition) {
        return '"untitled"';
    }
    const matches = (/filename=([^;]+)/ig).exec(contentDisposition);
    return (matches[1] || 'untitled').trim();
};
