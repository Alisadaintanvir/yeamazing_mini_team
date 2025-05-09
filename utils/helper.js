export const getFileIcon = (fileType) => {
  if (fileType.startsWith("image/")) return "image";
  if (fileType.startsWith("video/")) return "video";
  if (fileType.startsWith("audio/")) return "audio";
  if (fileType.includes("pdf")) return "pdf";
  if (fileType.includes("word")) return "document";
  if (fileType.includes("excel") || fileType.includes("sheet"))
    return "spreadsheet";
  return "file";
};
