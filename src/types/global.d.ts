
// Custom type definitions for the project

// Extend HTMLInputElement to include webkitdirectory and directory properties
declare namespace JSX {
  interface InputHTMLAttributes {
    webkitdirectory?: string;
    directory?: string;
  }
}
